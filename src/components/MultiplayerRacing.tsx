import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Trophy, Clock, Zap, Crown, Play, UserCheck } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  progress: number;
  wpm: number;
  accuracy: number;
  isFinished: boolean;
  position?: number;
}

interface MultiplayerRacingProps {
  onStartRace: () => void;
}

export function MultiplayerRacing({ onStartRace }: MultiplayerRacingProps) {
  const [gameState, setGameState] = useState<'lobby' | 'racing' | 'finished'>('lobby');
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'You', progress: 0, wpm: 0, accuracy: 100, isFinished: false },
    { id: '2', name: 'SpeedTyper92', progress: 0, wpm: 0, accuracy: 100, isFinished: false },
    { id: '3', name: 'KeyboardNinja', progress: 0, wpm: 0, accuracy: 100, isFinished: false },
    { id: '4', name: 'TypeMaster', progress: 0, wpm: 0, accuracy: 100, isFinished: false }
  ]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [raceText] = useState("The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is perfect for testing typing speed and accuracy.");

  // Simulate multiplayer race
  useEffect(() => {
    if (gameState === 'racing') {
      const interval = setInterval(() => {
        setPlayers(prev => prev.map(player => {
          if (player.id === '1' || player.isFinished) return player;
          
          const speed = 0.5 + Math.random() * 1.5; // Random typing speed
          const newProgress = Math.min(100, player.progress + speed);
          const newWpm = Math.round(40 + Math.random() * 40);
          const newAccuracy = Math.round(85 + Math.random() * 15);
          
          return {
            ...player,
            progress: newProgress,
            wpm: newWpm,
            accuracy: newAccuracy,
            isFinished: newProgress >= 100
          };
        }));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [gameState]);

  // Check for race completion
  useEffect(() => {
    const finishedPlayers = players.filter(p => p.isFinished);
    if (finishedPlayers.length >= players.length - 1 && gameState === 'racing') {
      // Assign positions
      const sortedPlayers = [...players].sort((a, b) => {
        if (a.isFinished && !b.isFinished) return -1;
        if (!a.isFinished && b.isFinished) return 1;
        if (a.isFinished && b.isFinished) return b.wpm - a.wpm;
        return b.progress - a.progress;
      });

      setPlayers(sortedPlayers.map((player, index) => ({
        ...player,
        position: index + 1
      })));

      setTimeout(() => setGameState('finished'), 1000);
    }
  }, [players, gameState]);

  const startCountdown = () => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setGameState('racing');
          onStartRace();
          return null;
        }
        return prev! - 1;
      });
    }, 1000);
  };

  const resetRace = () => {
    setGameState('lobby');
    setCountdown(null);
    setPlayers(prev => prev.map(player => ({
      ...player,
      progress: 0,
      wpm: 0,
      accuracy: 100,
      isFinished: false,
      position: undefined
    })));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Users className="w-6 h-6 text-primary-400" />
          <h2 className="text-2xl font-bold text-gray-200">Multiplayer Racing</h2>
          <div className="bg-amber-500/20 px-3 py-1 rounded-full">
            <Crown className="w-4 h-4 text-amber-400 inline mr-1" />
            <span className="text-amber-400 text-sm font-medium">Premium</span>
          </div>
        </div>
        <p className="text-gray-400">
          Race against players worldwide in real-time typing competitions
        </p>
      </div>

      {/* Countdown Overlay */}
      <AnimatePresence>
        {countdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="text-8xl font-bold text-primary-400"
            >
              {countdown}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Race Area */}
      <div className="glass-card p-6">
        {gameState === 'lobby' && (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-200">Waiting for Race</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {players.map((player, index) => (
                  <div key={player.id} className="flex items-center space-x-3 bg-dark-800/50 rounded-lg p-3">
                    <UserCheck className="w-5 h-5 text-success-400" />
                    <span className="text-gray-300">{player.name}</span>
                    {player.id === '1' && (
                      <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded-full">You</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startCountdown}
              className="px-8 py-4 bg-gradient-to-r from-primary-600 to-success-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Play className="w-5 h-5 inline mr-2" />
              Start Race
            </motion.button>
          </div>
        )}

        {(gameState === 'racing' || gameState === 'finished') && (
          <div className="space-y-6">
            {/* Race Progress */}
            <div className="space-y-4">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        player.position === 1 ? 'bg-amber-500 text-white' :
                        player.position === 2 ? 'bg-gray-400 text-white' :
                        player.position === 3 ? 'bg-amber-600 text-white' :
                        'bg-dark-700 text-gray-300'
                      }`}>
                        {player.position || (index + 1)}
                      </div>
                      <span className="font-medium text-gray-200">{player.name}</span>
                      {player.id === '1' && (
                        <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded-full">You</span>
                      )}
                      {player.isFinished && (
                        <Trophy className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-primary-400">{player.wpm} WPM</span>
                      <span className="text-success-400">{player.accuracy}%</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-dark-800 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        player.id === '1' ? 'bg-primary-500' : 'bg-gray-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${player.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Race Text */}
            {gameState === 'racing' && (
              <div className="bg-dark-800/50 rounded-xl p-6">
                <div className="text-lg font-mono leading-relaxed text-gray-300">
                  {raceText}
                </div>
              </div>
            )}

            {/* Results */}
            {gameState === 'finished' && (
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold text-gray-200">Race Complete!</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {players.slice(0, 3).map((player, index) => (
                    <div key={player.id} className={`p-4 rounded-xl ${
                      index === 0 ? 'bg-amber-500/20 border border-amber-500/40' :
                      index === 1 ? 'bg-gray-500/20 border border-gray-500/40' :
                      'bg-amber-600/20 border border-amber-600/40'
                    }`}>
                      <div className="text-center">
                        <Trophy className={`w-8 h-8 mx-auto mb-2 ${
                          index === 0 ? 'text-amber-400' :
                          index === 1 ? 'text-gray-400' :
                          'text-amber-600'
                        }`} />
                        <div className="font-bold text-gray-200">{player.name}</div>
                        <div className="text-sm text-gray-400">{player.wpm} WPM</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetRace}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all duration-200"
                >
                  Race Again
                </motion.button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}