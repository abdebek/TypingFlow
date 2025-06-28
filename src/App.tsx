import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { TextDisplay } from './components/TextDisplay';
import { StatsDisplay } from './components/StatsDisplay';
import { TestControls } from './components/TestControls';
import { Results } from './components/Results';
import { Statistics } from './components/Statistics';
import { Settings } from './components/Settings';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { TypingEffects } from './components/TypingEffects';
import { WPMGraph } from './components/WPMGraph';
import { AdvancedMetrics } from './components/AdvancedMetrics';
import { TypingHeatmap } from './components/TypingHeatmap';
import { TypingChallenges } from './components/TypingChallenges';
import { TypingTutorial } from './components/TypingTutorial';
import { PremiumFeatures } from './components/PremiumFeatures';
import { MultiplayerRacing } from './components/MultiplayerRacing';
import { AICoach } from './components/AICoach';
import { GlobalLeaderboard } from './components/GlobalLeaderboard';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { Footer } from './components/Footer';
import { SEOHead } from './components/SEOHead';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineMode } from './components/OfflineMode';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { NotificationSystem, useNotifications } from './components/NotificationSystem';
import { useTypingTest } from './hooks/useTypingTest';
import { useKeyboardTracking } from './hooks/useKeyboardTracking';
import { useWPMTracking } from './hooks/useWPMTracking';
import { useAdvancedMetrics } from './hooks/useAdvancedMetrics';
import { usePerformanceMonitoring } from './hooks/usePerformanceMonitoring';
import { getRandomText, generateCustomText, getTextForDuration } from './data/texts';
import { TestConfig } from './types';

function App() {
  const [currentView, setCurrentView] = useState('test');
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);
  const [config, setConfig] = useState<TestConfig>({
    mode: 'time',
    timeLimit: 60,
    wordLimit: 50,
    textCategory: 'quotes'
  });

  const [testText, setTestText] = useState(() => 
    config.mode === 'time' 
      ? getTextForDuration('quotes', config.timeLimit)
      : generateCustomText(config.wordLimit)
  );

  const { notifications, addNotification, removeNotification } = useNotifications();
  const { trackTypingPerformance, trackError } = usePerformanceMonitoring();

  const {
    stats,
    characterStates,
    isActive,
    isPaused,
    isCompleted,
    currentIndex,
    elapsedTime,
    handleKeyPress,
    pause,
    resume,
    restart,
    focusInput,
    inputRef
  } = useTypingTest(testText, config);

  const {
    pressedKeys,
    lastPressedKey,
    keyAccuracy,
    typingEffects,
    correctStreak,
    trackKeyPress,
    resetTracking
  } = useKeyboardTracking();

  const { wpmHistory, resetWPMTracking } = useWPMTracking(isActive && !isPaused, stats.wpm, stats.accuracy);
  const { metrics, addKeystroke, reset: resetAdvancedMetrics } = useAdvancedMetrics();

  // Generate new text when config changes
  useEffect(() => {
    if (config.mode === 'words') {
      setTestText(generateCustomText(config.wordLimit));
    } else {
      setTestText(getTextForDuration(config.textCategory, config.timeLimit));
    }
  }, [config]);

  // Track performance when test completes
  useEffect(() => {
    if (isCompleted) {
      trackTypingPerformance({
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        testDuration: elapsedTime,
        errorCount: stats.incorrectChars
      });

      // Show completion notification
      addNotification({
        type: 'success',
        title: 'Test Completed!',
        message: `${stats.wpm} WPM with ${stats.accuracy}% accuracy`,
        duration: 3000
      });
    }
  }, [isCompleted, stats, elapsedTime, trackTypingPerformance, addNotification]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentView !== 'test') return;
      
      try {
        // Prevent default for typing keys
        if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Escape') {
          e.preventDefault();
          handleKeyPress(e.key, (key, isCorrect) => {
            trackKeyPress(key, isCorrect);
            addKeystroke(key, isCorrect);
          });
        }
        
        // Handle Tab for restart
        if (e.key === 'Tab') {
          e.preventDefault();
          restart();
          resetTracking();
          resetWPMTracking();
          resetAdvancedMetrics();
        }
      } catch (error) {
        trackError(error as Error, 'keyboard_input');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, handleKeyPress, restart, trackKeyPress, resetTracking, resetWPMTracking, addKeystroke, resetAdvancedMetrics, trackError]);

  // Auto-focus input when switching to test view
  useEffect(() => {
    if (currentView === 'test') {
      setTimeout(() => focusInput(), 100);
    }
  }, [currentView, focusInput]);

  const handleConfigChange = (newConfig: TestConfig) => {
    setConfig(newConfig);
    restart();
    resetTracking();
    resetWPMTracking();
    resetAdvancedMetrics();
  };

  const handleRestart = () => {
    // Generate new text based on current config
    if (config.mode === 'words') {
      setTestText(generateCustomText(config.wordLimit));
    } else {
      setTestText(getTextForDuration(config.textCategory, config.timeLimit));
    }
    restart();
    resetTracking();
    resetWPMTracking();
    resetAdvancedMetrics();
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  const handleStartChallenge = (challengeId: string) => {
    setCurrentView('test');
    addNotification({
      type: 'info',
      title: 'Challenge Started!',
      message: 'Good luck with your typing challenge',
      duration: 2000
    });
  };

  const handleUpgrade = () => {
    addNotification({
      type: 'info',
      title: 'Premium Upgrade',
      message: 'Redirecting to payment...',
      duration: 2000
    });
  };

  const handleStartRace = () => {
    addNotification({
      type: 'info',
      title: 'Race Starting!',
      message: 'Get ready to type...',
      duration: 2000
    });
  };

  // Mock data for heatmap
  const mockHeatmapData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    wpm: Math.floor(Math.random() * 40) + 40,
    accuracy: Math.floor(Math.random() * 20) + 80,
    duration: Math.floor(Math.random() * 300) + 60
  }));

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
        <SEOHead />
        
        {/* Background Pattern */}
        <div className="fixed inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Typing Effects */}
        <TypingEffects effects={typingEffects} />

        {/* Offline Mode Indicator */}
        <OfflineMode />

        {/* PWA Install Prompt */}
        <PWAInstallPrompt />

        {/* Notification System */}
        <NotificationSystem 
          notifications={notifications} 
          onRemove={removeNotification} 
        />

        <div className="relative z-10 container mx-auto px-4 py-4 md:py-8 max-w-7xl">
          <Header currentView={currentView} onViewChange={setCurrentView} />

          <AnimatePresence mode="wait">
            {currentView === 'test' && (
              <motion.div
                key="test"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 md:space-y-6"
              >
                {!isCompleted ? (
                  <>
                    {/* Test Controls at the top */}
                    <TestControls
                      config={config}
                      onConfigChange={handleConfigChange}
                      onRestart={handleRestart}
                      onPauseResume={handlePauseResume}
                      isActive={isActive}
                      isPaused={isPaused}
                      isCompleted={isCompleted}
                    />

                    {/* Pause Overlay */}
                    {isPaused && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50 flex items-center justify-center"
                      >
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="glass-card p-8 text-center max-w-md mx-4"
                        >
                          <h3 className="text-2xl font-bold text-gray-200 mb-4">Test Paused</h3>
                          <p className="text-gray-400 mb-6">
                            Your progress has been saved. Press Esc or click below to resume.
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={resume}
                            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all duration-200"
                          >
                            Resume Test
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Stats and WPM Graph */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
                      <div className="xl:col-span-2">
                        <StatsDisplay 
                          stats={stats} 
                          config={config} 
                          elapsedTime={elapsedTime} 
                          isActive={isActive && !isPaused} 
                        />
                      </div>
                      <div className="xl:col-span-1">
                        <WPMGraph data={wpmHistory} currentWPM={stats.wpm} />
                      </div>
                    </div>

                    {/* Advanced Metrics Toggle */}
                    <div className="flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
                        className="px-4 py-2 bg-dark-800 text-gray-400 rounded-lg hover:text-gray-200 transition-colors duration-200"
                      >
                        {showAdvancedMetrics ? 'Hide' : 'Show'} Advanced Metrics
                      </motion.button>
                    </div>

                    {/* Advanced Metrics */}
                    <AdvancedMetrics stats={metrics} isVisible={showAdvancedMetrics} />
                    
                    {/* Text Display */}
                    <TextDisplay
                      characterStates={characterStates}
                      currentIndex={currentIndex}
                      onFocus={focusInput}
                      isActive={isActive}
                      isCompleted={isCompleted}
                    />
                    
                    {/* Virtual Keyboard directly below text */}
                    <VirtualKeyboard
                      pressedKeys={pressedKeys}
                      lastPressedKey={lastPressedKey}
                      keyAccuracy={keyAccuracy}
                    />

                    {/* Streak Display */}
                    {correctStreak > 5 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed top-20 right-4 md:right-8 glass-card p-3 md:p-4 border-l-4 border-success-500 z-40"
                      >
                        <div className="text-success-400 font-bold text-base md:text-lg">
                          🔥 {correctStreak} Streak!
                        </div>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <Results
                    stats={stats}
                    config={config}
                    onRestart={handleRestart}
                  />
                )}
                
                {/* Hidden input for mobile keyboards */}
                <input
                  ref={inputRef}
                  className="absolute -left-[9999px] opacity-0"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </motion.div>
            )}

            {currentView === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Statistics />
                <TypingHeatmap sessions={mockHeatmapData} />
              </motion.div>
            )}

            {currentView === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Settings />
              </motion.div>
            )}

            {currentView === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TypingChallenges onStartChallenge={handleStartChallenge} />
                <div className="mt-8">
                  <GlobalLeaderboard />
                </div>
              </motion.div>
            )}

            {currentView === 'multiplayer' && (
              <motion.div
                key="multiplayer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MultiplayerRacing onStartRace={handleStartRace} />
              </motion.div>
            )}

            {currentView === 'ai-coach' && (
              <motion.div
                key="ai-coach"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AICoach />
              </motion.div>
            )}

            {currentView === 'premium' && (
              <motion.div
                key="premium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PremiumFeatures onUpgrade={handleUpgrade} />
              </motion.div>
            )}

            {currentView === 'tutorial' && (
              <motion.div
                key="tutorial"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TypingTutorial />
              </motion.div>
            )}

            {currentView === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PrivacyPolicy />
              </motion.div>
            )}

            {currentView === 'terms' && (
              <motion.div
                key="terms"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TermsOfService />
              </motion.div>
            )}
          </AnimatePresence>

          <Footer />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;