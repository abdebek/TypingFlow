import { createClient } from '@supabase/supabase-js';

// Environment variables - in production these would be from .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          country: string;
          premium_until: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          country?: string;
          premium_until?: string | null;
        };
        Update: {
          username?: string;
          country?: string;
          premium_until?: string | null;
        };
      };
      typing_results: {
        Row: {
          id: string;
          user_id: string;
          wpm: number;
          accuracy: number;
          consistency: number;
          test_duration: number;
          test_type: string;
          text_category: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          wpm: number;
          accuracy: number;
          consistency: number;
          test_duration: number;
          test_type: string;
          text_category: string;
        };
      };
      multiplayer_rooms: {
        Row: {
          id: string;
          name: string;
          max_players: number;
          current_players: number;
          status: 'waiting' | 'racing' | 'finished';
          text_content: string;
          created_at: string;
        };
        Insert: {
          name: string;
          max_players?: number;
          text_content: string;
        };
      };
      room_participants: {
        Row: {
          id: string;
          room_id: string;
          user_id: string;
          progress: number;
          wpm: number;
          accuracy: number;
          finished_at: string | null;
          position: number | null;
        };
        Insert: {
          room_id: string;
          user_id: string;
        };
        Update: {
          progress?: number;
          wpm?: number;
          accuracy?: number;
          finished_at?: string | null;
          position?: number | null;
        };
      };
      leaderboards: {
        Row: {
          id: string;
          user_id: string;
          timeframe: 'daily' | 'weekly' | 'monthly' | 'alltime';
          category: 'speed' | 'accuracy' | 'consistency';
          score: number;
          rank: number;
          updated_at: string;
        };
      };
      user_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string;
          status: 'active' | 'canceled' | 'past_due';
          current_period_end: string;
          created_at: string;
        };
      };
    };
  };
}

// Authentication functions
export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username
      }
    }
  });
  
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Typing results functions
export async function saveTypingResult(result: {
  wpm: number;
  accuracy: number;
  consistency: number;
  test_duration: number;
  test_type: string;
  text_category: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('typing_results')
    .insert({
      user_id: user.id,
      ...result
    });

  if (error) throw error;
  return data;
}

export async function getUserResults(userId: string, limit = 50) {
  const { data, error } = await supabase
    .from('typing_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// Leaderboard functions
export async function getGlobalLeaderboard(
  timeframe: 'daily' | 'weekly' | 'monthly' | 'alltime' = 'weekly',
  category: 'speed' | 'accuracy' | 'consistency' = 'speed',
  limit = 100
) {
  const { data, error } = await supabase
    .from('leaderboards')
    .select(`
      *,
      users (
        username,
        country
      )
    `)
    .eq('timeframe', timeframe)
    .eq('category', category)
    .order('rank', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data;
}

// Multiplayer functions
export async function createMultiplayerRoom(name: string, textContent: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('multiplayer_rooms')
    .insert({
      name,
      text_content: textContent,
      max_players: 4
    })
    .select()
    .single();

  if (error) throw error;

  // Join the room as creator
  await joinMultiplayerRoom(data.id);
  
  return data;
}

export async function joinMultiplayerRoom(roomId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('room_participants')
    .insert({
      room_id: roomId,
      user_id: user.id
    });

  if (error) throw error;
  return data;
}

export async function updateRoomProgress(
  roomId: string,
  progress: number,
  wpm: number,
  accuracy: number
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('room_participants')
    .update({
      progress,
      wpm,
      accuracy,
      finished_at: progress >= 100 ? new Date().toISOString() : null
    })
    .eq('room_id', roomId)
    .eq('user_id', user.id);

  if (error) throw error;
  return data;
}

// Real-time subscriptions
export function subscribeToRoom(roomId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`room:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'room_participants',
        filter: `room_id=eq.${roomId}`
      },
      callback
    )
    .subscribe();
}

// Premium subscription functions
export async function createStripeCheckout(priceId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // This would call your edge function that creates Stripe checkout
  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { priceId, userId: user.id }
  });

  if (error) throw error;
  return data;
}

export async function checkPremiumStatus() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('users')
    .select('premium_until')
    .eq('id', user.id)
    .single();

  if (error) return false;
  
  if (!data.premium_until) return false;
  
  return new Date(data.premium_until) > new Date();
}