import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, TrendingUp, Lightbulb, MessageCircle, Zap } from 'lucide-react';

interface AIInsight {
  type: 'weakness' | 'strength' | 'suggestion' | 'goal';
  title: string;
  description: string;
  action?: string;
}

export function AICoach() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    // Simulate AI analysis
    setTimeout(() => {
      setInsights([
        {
          type: 'weakness',
          title: 'Struggling with Number Keys',
          description: 'Your accuracy drops to 78% when typing numbers. Focus on number row practice.',
          action: 'Start Number Training'
        },
        {
          type: 'strength',
          title: 'Excellent Home Row Mastery',
          description: 'You maintain 96% accuracy on home row keys. Great foundation!',
        },
        {
          type: 'suggestion',
          title: 'Improve Rhythm Consistency',
          description: 'Your typing speed varies by 15 WPM. Practice maintaining steady rhythm.',
          action: 'Try Metronome Mode'
        },
        {
          type: 'goal',
          title: 'Next Milestone: 80 WPM',
          description: 'You\'re currently at 67 WPM. With focused practice, you can reach 80 WPM in 2 weeks.',
          action: 'Create Training Plan'
        }
      ]);
      setIsAnalyzing(false);
    }, 2000);
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'weakness': return Target;
      case 'strength': return TrendingUp;
      case 'suggestion': return Lightbulb;
      case 'goal': return Zap;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'weakness': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      case 'strength': return 'text-success-400 bg-success-400/10 border-success-400/30';
      case 'suggestion': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'goal': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
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
          <Brain className="w-6 h-6 text-primary-400" />
          <h2 className="text-2xl font-bold text-gray-200">AI Typing Coach</h2>
        </div>
        <p className="text-gray-400">
          Personalized insights and recommendations powered by artificial intelligence
        </p>
      </div>

      {/* Analysis Status */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-8 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <Brain className="w-16 h-16 text-primary-400" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-200 mb-2">Analyzing Your Performance</h3>
          <p className="text-gray-400">
            AI is reviewing your typing patterns and generating personalized insights...
          </p>
        </motion.div>
      )}

      {/* AI Insights */}
      {!isAnalyzing && (
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = getInsightIcon(insight.type);
            const colorClasses = getInsightColor(insight.type);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-card p-6 border ${colorClasses}`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${colorClasses}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">
                      {insight.title}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {insight.description}
                    </p>
                    {insight.action && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all duration-200"
                      >
                        {insight.action}
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Chat Interface */}
      <div className="glass-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <MessageCircle className="w-5 h-5 text-success-400" />
          <h3 className="text-lg font-semibold text-gray-200">Ask Your AI Coach</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-dark-800/50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-300">
                  Hi! I'm your AI typing coach. I can help you improve your typing speed and accuracy. 
                  What would you like to work on today?
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Ask me anything about improving your typing..."
              className="flex-1 px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all duration-200"
            >
              Send
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}