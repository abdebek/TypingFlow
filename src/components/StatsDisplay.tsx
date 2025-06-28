import React from 'react';
import { TypingStats, TestConfig } from '../types';
import { Clock, Target, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsDisplayProps {
  stats: TypingStats;
  config: TestConfig;
  elapsedTime: number;
  isActive: boolean;
}

export function StatsDisplay({ stats, config, elapsedTime, isActive }: StatsDisplayProps) {
  const timeRemaining = config.mode === 'time' ? Math.max(0, config.timeLimit - elapsedTime) : 0;
  const progress = config.mode === 'time' 
    ? (elapsedTime / config.timeLimit) * 100
    : (stats.totalChars / (config.wordLimit * 5)) * 100;

  const statItems = [
    {
      icon: Zap,
      label: 'WPM',
      value: stats.wpm,
      color: 'text-primary-400',
      bgColor: 'bg-primary-400/10'
    },
    {
      icon: Target,
      label: 'Accuracy',
      value: `${stats.accuracy}%`,
      color: 'text-success-400',
      bgColor: 'bg-success-400/10'
    },
    {
      icon: CheckCircle,
      label: 'Correct',
      value: stats.correctChars,
      color: 'text-success-400',
      bgColor: 'bg-success-400/10'
    },
    {
      icon: Clock,
      label: config.mode === 'time' ? 'Time Left' : 'Time',
      value: config.mode === 'time' 
        ? `${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toFixed(0).padStart(2, '0')}`
        : `${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60).toFixed(0).padStart(2, '0')}`,
      color: 'text-gray-300',
      bgColor: 'bg-gray-600/10'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-4 md:p-6"
    >
      {/* Progress Bar */}
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-success-500"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={`${item.bgColor} rounded-xl p-3 md:p-4 text-center border border-gray-700/30`}
            >
              <div className="flex items-center justify-center mb-2">
                <Icon className={`w-4 h-4 md:w-5 md:h-5 ${item.color}`} />
              </div>
              <div className={`text-xl md:text-2xl font-bold ${item.color} mb-1`}>
                <motion.span
                  key={item.value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.value}
                </motion.span>
              </div>
              <div className="text-xs text-gray-400 font-medium">
                {item.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Test Configuration */}
      <div className="mt-4 pt-4 border-t border-gray-700/30">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 text-sm text-gray-400">
          <span>Mode: {config.mode === 'time' ? 'Timed' : 'Words'}</span>
          <span className="hidden md:inline">•</span>
          <span>
            {config.mode === 'time' 
              ? `${config.timeLimit}s` 
              : `${config.wordLimit} words`
            }
          </span>
          <span className="hidden md:inline">•</span>
          <span className="capitalize">{config.textCategory}</span>
        </div>
      </div>
    </motion.div>
  );
}