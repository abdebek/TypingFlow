import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, TrendingUp, Lightbulb, MessageCircle, Zap, BarChart3, Clock, Settings, LogIn, AlertCircle } from 'lucide-react';
import { analyzeTypingPatterns, getPerformanceInsights, getCacheStats, clearAICache, getChatResponse, AI_PROVIDERS } from '../lib/ai';
import { LoadingSpinner } from './LoadingSpinner';

interface AIInsight {
  type: 'weakness' | 'strength' | 'suggestion' | 'goal';
  title: string;
  description: string;
  action?: string;
}

interface AICoachProps {
  isAuthenticated: boolean;
  user?: any;
}

export function AICoach({ isAuthenticated, user }: AICoachProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'ai', message: string, provider?: string, cost?: number}>>([
    {
      role: 'ai',
      message: "Hi! I'm your AI typing coach. I can help you improve your typing speed and accuracy. What would you like to work on today?"
    }
  ]);
  const [preferredProvider, setPreferredProvider] = useState<string>('auto');
  const [showProviderSettings, setShowProviderSettings] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadAIAnalysis();
      loadCacheStats();
      setAuthError(null);
    } else {
      // Clear data when not authenticated
      setInsights([]);
      setCacheStats(null);
      setAuthError('Please sign in to access AI coaching features');
    }
  }, [isAuthenticated, preferredProvider]);

  const loadAIAnalysis = async () => {
    if (!isAuthenticated) {
      setAuthError('Authentication required for AI analysis');
      return;
    }

    setIsAnalyzing(true);
    setAuthError(null);
    
    try {
      // Get typing history from localStorage
      const typingHistory = JSON.parse(localStorage.getItem('typingResults') || '[]');
      
      if (typingHistory.length > 0) {
        const analysis = await analyzeTypingPatterns(
          typingHistory, 
          preferredProvider === 'auto' ? undefined : preferredProvider
        );
        
        const newInsights: AIInsight[] = [
          ...analysis.weaknesses.map(w => ({
            type: 'weakness' as const,
            title: 'Area for Improvement',
            description: w,
            action: 'Start Focused Practice'
          })),
          ...analysis.strengths.map(s => ({
            type: 'strength' as const,
            title: 'You\'re Doing Great!',
            description: s
          })),
          ...analysis.suggestions.map(s => ({
            type: 'suggestion' as const,
            title: 'Recommendation',
            description: s,
            action: 'Try This Exercise'
          })),
          ...analysis.nextGoals.map(g => ({
            type: 'goal' as const,
            title: 'Next Milestone',
            description: g,
            action: 'Create Training Plan'
          }))
        ];
        
        setInsights(newInsights);
      } else {
        setInsights([
          {
            type: 'suggestion',
            title: 'Get Started',
            description: 'Complete a few typing tests to receive personalized AI insights!',
            action: 'Take Your First Test'
          }
        ]);
      }
    } catch (error: any) {
      console.error('AI analysis failed:', error);
      
      // Handle specific authentication errors
      if (error.message?.includes('Not authenticated') || error.message?.includes('authentication')) {
        setAuthError('Your session has expired. Please sign in again to access AI features.');
        setInsights([]);
      } else {
        setInsights([
          {
            type: 'suggestion',
            title: 'Analysis Unavailable',
            description: 'Unable to generate AI insights at the moment. Please try again later.',
          }
        ]);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadCacheStats = async () => {
    if (!isAuthenticated) return;
    
    try {
      const stats = await getCacheStats();
      setCacheStats(stats);
    } catch (error: any) {
      console.error('Failed to load cache stats:', error);
      if (error.message?.includes('Not authenticated')) {
        setAuthError('Authentication required to view cache statistics');
      }
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !isAuthenticated) return;

    const userMessage = chatMessage.trim();
    setChatMessage('');
    
    // Add user message to chat
    setChatHistory(prev => [...prev, { role: 'user', message: userMessage }]);

    try {
      const response = await getChatResponse(
        userMessage,
        preferredProvider === 'auto' ? undefined : preferredProvider
      );
      
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        message: response,
        provider: preferredProvider,
        cost: 0.001 // Estimated cost
      }]);
    } catch (error: any) {
      let errorMessage = "I'm having trouble processing your request right now. Please try again later!";
      
      if (error.message?.includes('Not authenticated')) {
        errorMessage = "Your session has expired. Please sign in again to continue our conversation.";
        setAuthError('Session expired - please sign in again');
      }
      
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        message: errorMessage
      }]);
    }
  };

  const handleClearCache = async () => {
    if (!isAuthenticated) return;
    
    try {
      await clearAICache();
      await loadCacheStats();
    } catch (error: any) {
      console.error('Failed to clear cache:', error);
      if (error.message?.includes('Not authenticated')) {
        setAuthError('Authentication required to clear cache');
      }
    }
  };

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

  // Authentication required message
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="glass-card p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-primary-600/20 rounded-full">
              <LogIn className="w-8 h-8 text-primary-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-200 mb-4">Sign In Required</h2>
          <p className="text-gray-400 mb-6">
            Access personalized AI coaching insights, chat with your AI coach, and track your progress by signing in to your account.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all duration-200"
          >
            Sign In to Continue
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-primary-400" />
            <h2 className="text-2xl font-bold text-gray-200">AI Typing Coach</h2>
            {user && (
              <span className="text-sm text-gray-400">
                Welcome back, {user.email}!
              </span>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Provider Settings */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProviderSettings(!showProviderSettings)}
              className="p-2 bg-dark-800 text-gray-400 rounded-lg hover:text-gray-200 transition-colors"
              title="AI Provider Settings"
            >
              <Settings className="w-4 h-4" />
            </motion.button>

            {/* Cache Stats */}
            {cacheStats && (
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>{cacheStats.cacheHitRate}% cache hit rate</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{cacheStats.totalRequests} requests</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearCache}
                  className="px-3 py-1 bg-dark-800 text-gray-400 rounded hover:text-gray-200 transition-colors"
                >
                  Clear Cache
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Authentication Error Alert */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-4 bg-red-600/10 border border-red-600/30 rounded-lg flex items-center space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-400 font-medium">Authentication Error</p>
              <p className="text-red-300 text-sm">{authError}</p>
            </div>
          </motion.div>
        )}

        {/* Provider Settings Panel */}
        {showProviderSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-dark-800/50 rounded-lg border border-gray-700/30"
          >
            <h4 className="text-sm font-medium text-gray-300 mb-3">AI Provider Preference</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPreferredProvider('auto')}
                className={`p-3 rounded-lg text-left transition-all ${
                  preferredProvider === 'auto'
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                }`}
              >
                <div className="font-medium">Auto Select</div>
                <div className="text-xs opacity-80">Best provider for each task</div>
              </motion.button>
              
              {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPreferredProvider(key)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    preferredProvider === key
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  <div className="font-medium">{provider.name}</div>
                  <div className="text-xs opacity-80">{provider.description}</div>
                  <div className="text-xs mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      provider.cost === 'Very Low' ? 'bg-green-600/20 text-green-400' :
                      provider.cost === 'Low' ? 'bg-blue-600/20 text-blue-400' :
                      provider.cost === 'Medium' ? 'bg-amber-600/20 text-amber-400' :
                      'bg-red-600/20 text-red-400'
                    }`}>
                      {provider.cost} Cost
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <p className="text-gray-400">
          Personalized insights powered by multiple AI providers with smart fallback support
        </p>
      </div>

      {/* Analysis Status */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-8 text-center"
        >
          <LoadingSpinner size="lg" text="AI is analyzing your typing patterns..." />
        </motion.div>
      )}

      {/* AI Insights */}
      {!isAnalyzing && insights.length > 0 && !authError && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-200">Personalized Insights</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadAIAnalysis}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Refresh Analysis
            </motion.button>
          </div>
          
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
          {preferredProvider !== 'auto' && (
            <span className="text-xs bg-primary-600/20 text-primary-400 px-2 py-1 rounded-full">
              Using {AI_PROVIDERS[preferredProvider as keyof typeof AI_PROVIDERS]?.name}
            </span>
          )}
        </div>
        
        <div className="space-y-4">
          {/* Chat History */}
          <div className="max-h-64 overflow-y-auto space-y-3">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  chat.role === 'user' ? 'justify-end' : ''
                }`}
              >
                {chat.role === 'ai' && (
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    chat.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-800/50 text-gray-300'
                  }`}
                >
                  <p className="text-sm">{chat.message}</p>
                  {chat.provider && chat.cost && (
                    <div className="text-xs opacity-60 mt-1">
                      {chat.provider} • ${chat.cost.toFixed(4)}
                    </div>
                  )}
                </div>
                {chat.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">You</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Chat Input */}
          <form onSubmit={handleChatSubmit} className="flex space-x-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder={authError ? "Sign in to chat with your AI coach..." : "Ask me anything about improving your typing..."}
              disabled={!!authError}
              className="flex-1 px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!chatMessage.trim() || !!authError}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}