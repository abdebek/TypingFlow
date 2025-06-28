import { useState, useEffect, useCallback } from 'react';
import { supabase, subscribeToRoom } from '../lib/supabase';

interface Player {
  id: string;
  username: string;
  progress: number;
  wpm: number;
  accuracy: number;
  isFinished: boolean;
  position?: number;
}

export function useRealTimeMultiplayer(roomId: string | null) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<'waiting' | 'racing' | 'finished'>('waiting');
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (!roomId) return;

    // Subscribe to real-time updates
    const channel = subscribeToRoom(roomId, (payload) => {
      console.log('Real-time update:', payload);
      fetchRoomData();
    });

    setSubscription(channel);
    fetchRoomData();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [roomId]);

  const fetchRoomData = async () => {
    if (!roomId) return;

    try {
      const { data, error } = await supabase
        .from('room_participants')
        .select(`
          *,
          users (
            username
          )
        `)
        .eq('room_id', roomId);

      if (error) throw error;

      const playersData = data.map(participant => ({
        id: participant.user_id,
        username: participant.users?.username || 'Anonymous',
        progress: participant.progress,
        wpm: participant.wpm,
        accuracy: participant.accuracy,
        isFinished: participant.finished_at !== null,
        position: participant.position
      }));

      setPlayers(playersData);

      // Update game state based on players
      const finishedCount = playersData.filter(p => p.isFinished).length;
      if (finishedCount >= playersData.length && playersData.length > 0) {
        setGameState('finished');
      } else if (playersData.some(p => p.progress > 0)) {
        setGameState('racing');
      }
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  const updateProgress = useCallback(async (progress: number, wpm: number, accuracy: number) => {
    if (!roomId) return;

    try {
      await supabase
        .from('room_participants')
        .update({
          progress,
          wpm,
          accuracy,
          finished_at: progress >= 100 ? new Date().toISOString() : null
        })
        .eq('room_id', roomId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }, [roomId]);

  return {
    players,
    gameState,
    updateProgress,
    setGameState
  };
}