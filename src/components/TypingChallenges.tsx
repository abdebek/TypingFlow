import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Clock, Zap, Star, Lock } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  requirement: string;
  reward: string;
  isCompleted: boolean;
  isLocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface TypingChallengesProps {
  onStartChallenge: (challengeId: string) => void;
}

export function TypingChallenges({ onStartChallenge }: TypingChallengesProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const challenges: Challenge[] = [
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Achieve 80+ WPM in a 60-second test',
      difficulty: 'hard',
      requirement: '80+ WPM',
      reward: '🏆 Speed Master Badge',
      isCompleted: false,
      isLocked: false,
      progress: 65,
      maxProgress: 80
    },
    {
      id: 'accuracy-master',
      title: 'Accuracy Master',
      description: 'Complete a test with 99%+ accuracy',
      difficulty: 'medium',
      requirement: '99%+ Accuracy',
      reward: '🎯 Precision Badge',
      isCompleted: true,
      isLocked: false
    },
    {
      id: 'marathon-runner',
      title: 'Marathon Runner',
      description: 'Type continuously for 10 minutes',
      difficulty: 'expert',
      requirement: '10 minutes continuous',
      reward: '🏃 Endurance Badge',
      isCompleted: false,
      isLocked: false,
      progress: 7,
      maxProgress: 10
    },
    {
      id: 'code-ninja',
      title: 'Code Ninja',
      description: 'Achieve 60+ WPM on programming text',
      difficulty: 'hard',
      requirement: '60+ WPM (Code)',
      reward: '💻 Developer Badge',
      isCompleted: false,
      isLocked: false,
      progress: 45,
      maxProgress: 60
    },
    {
      id: 'consistency-king',
      title: 'Consistency King',
      description: 'Maintain 95%+ consistency score',
      difficulty: 'expert',
      requirement: '95%+ Consistency',
      reward: '⚡ Steady Hands Badge',
      isCompleted: false,
      isLocked: true
    },
    {
      id: 'streak-master',
      title: 'Streak Master',
      description: 'Type 7 days in a row',
      difficulty: 'medium',
      requirement: '7-day streak',
      reward: '🔥 Dedication Badge',
      isCompleted: false,
      isLocked: false,
      progress: 3,
      maxProgress: 7
    }
  ];

  const difficultyColors = {
    easy: 'text-green-400 bg-green-400/10 border-green-400/30',
    medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    hard: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
    expert: 'text-red-400 bg-red-400/10 border-red-400/30'
  };

  const filteredChallenges = selectedDifficulty === 'all' 
    ? challenges 
    : challenges.filter(c => c.difficulty === selectedDifficulty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Trophy className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-gray-200">Typing Challenges</h2>
        </div>
        <p className="text-gray-400 mb-6">
          Complete challenges to earn badges and improve your typing skills
        </p>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap gap-2">
          {['all', 'easy', 'medium', 'hard', 'expert'].map(difficulty => (
            <motion.button
              key={difficulty}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize ${
                selectedDifficulty === difficulty
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-gray-400 hover:text-gray-200'
              }`}
            >
              {difficulty}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-card p-6 relative overflow-hidden ${
              challenge.isCompleted ? 'border-success-500/50' : ''
            } ${challenge.isLocked ? 'opacity-60' : ''}`}
          >
            {/* Completion overlay */}
            {challenge.isCompleted && (
              <div className="absolute top-4 right-4">
                <div className="bg-success-500 rounded-full p-1">
                  <Star className="w-4 h-4 text-white" />
                </div>
              </div>
            )}

            {/* Lock overlay */}
            {challenge.isLocked && (
              <div className="absolute top-4 right-4">
                <Lock className="w-5 h-5 text-gray-500" />
              </div>
            )}

            {/* Difficulty badge */}
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mb-4 ${
              difficultyColors[challenge.difficulty]
            }`}>
              {challenge.difficulty.toUpperCase()}
            </div>

            <h3 className="text-lg font-bold text-gray-200 mb-2">
              {challenge.title}
            </h3>
            
            <p className="text-gray-400 text-sm mb-4">
              {challenge.description}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Requirement:</span>
                <span className="text-primary-400 font-medium">{challenge.requirement}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Reward:</span>
                <span className="text-amber-400 font-medium">{challenge.reward}</span>
              </div>

              {/* Progress bar */}
              {challenge.progress !== undefined && challenge.maxProgress && !challenge.isCompleted && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Progress</span>
                    <span>{challenge.progress}/{challenge.maxProgress}</span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2">
                    <motion.div
                      className="bg-primary-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              )}

              {/* Action button */}
              <motion.button
                whileHover={{ scale: challenge.isLocked ? 1 : 1.05 }}
                whileTap={{ scale: challenge.isLocked ? 1 : 0.95 }}
                onClick={() => !challenge.isLocked && onStartChallenge(challenge.id)}
                disabled={challenge.isLocked}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  challenge.isCompleted
                    ? 'bg-success-600 text-white cursor-default'
                    : challenge.isLocked
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {challenge.isCompleted ? 'Completed!' : challenge.isLocked ? 'Locked' : 'Start Challenge'}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}