import React, { useState } from 'react';
import { Keyboard, BarChart3, Settings, Trophy, BookOpen, Menu, X, Crown, Globe, Brain, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './AuthModal';
import { signOut } from '../lib/supabase';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user, loading, isPremium } = useAuth();

  // Core navigation items only
  const navItems = [
    { id: 'test', label: 'Test', icon: Keyboard },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'leaderboard', label: 'Challenges', icon: Trophy },
    { id: 'tutorial', label: 'Tutorial', icon: BookOpen },
  ];

  // Premium features dropdown
  const premiumItems = [
    { id: 'multiplayer', label: 'Multiplayer Racing', icon: Globe },
    { id: 'ai-coach', label: 'AI Coach', icon: Brain },
    { id: 'premium', label: 'Upgrade to Premium', icon: Crown },
  ];

  const handleNavClick = (viewId: string) => {
    // Check if premium feature requires authentication
    const isPremiumFeature = premiumItems.some(item => item.id === viewId);
    if (isPremiumFeature && !user) {
      setAuthMode('signup');
      setShowAuthModal(true);
      return;
    }
    
    onViewChange(viewId);
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <>
      {/* Full width header with background */}
      <div className="w-full bg-dark-900/50 backdrop-blur-sm border-b border-dark-700/50 relative z-40">
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="container mx-auto px-4 py-4 md:py-6 max-w-9xl"
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gradient-to-br from-primary-500 to-success-500 rounded-xl cursor-pointer"
                onClick={() => handleNavClick('test')}
              >
                <Keyboard className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-xl md:text-2xl font-bold text-gradient cursor-pointer"
                  onClick={() => handleNavClick('test')}
                  whileHover={{ scale: 1.02 }}
                >
                  TypingFlow
                </motion.h1>
                <p className="text-xs md:text-sm text-gray-400">Modern Typing Experience</p>
              </div>
            </div>

            {/* Desktop Navigation - Core items only */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavClick(item.id)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25' 
                        : 'text-gray-400 hover:text-gray-200 hover:bg-dark-800'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </motion.button>
                );
              })}

              {/* Premium Dropdown */}
              <div className="relative group">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${premiumItems.some(item => currentView === item.id)
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-dark-800'
                    }
                  `}
                >
                  <Crown className="w-4 h-4" />
                  <span className="text-sm">Premium</span>
                  {isPremium && (
                    <div className="w-2 h-2 bg-amber-400 rounded-full" />
                  )}
                </motion.button>

                {/* Dropdown Menu with Localized Backdrop Blur */}
                <div className="absolute top-full left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999]">
                  {/* Dropdown content with backdrop blur applied only to this element */}
                  <div className="relative bg-dark-900/80 backdrop-blur-xl border border-gray-600/50 rounded-xl p-2 shadow-2xl shadow-dark-950/50">
                    {/* Subtle gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-xl pointer-events-none" />
                    
                    <div className="relative z-10">
                      {premiumItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        const isLocked = !isPremium && item.id !== 'premium';
                        
                        return (
                          <motion.button
                            key={item.id}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleNavClick(item.id)}
                            className={`
                              w-full flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 text-left
                              ${isActive 
                                ? 'bg-primary-600/90 text-white shadow-lg backdrop-blur-sm' 
                                : 'text-gray-300 hover:text-white hover:bg-dark-800/80 hover:backdrop-blur-sm'
                              }
                              ${isLocked ? 'opacity-70' : ''}
                            `}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm">{item.label}</span>
                            {isLocked && <Crown className="w-3 h-3 text-amber-400 ml-auto" />}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavClick('settings')}
                className={`
                  p-2 rounded-lg transition-all duration-200
                  ${currentView === 'settings'
                    ? 'bg-gray-600 text-white shadow-lg shadow-gray-600/25' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-dark-800'
                  }
                `}
              >
                <Settings className="w-4 h-4" />
              </motion.button>
            </nav>

            {/* Right Side - User & Built on Bolt */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* User Authentication */}
              {!loading && (
                <div className="flex items-center space-x-3">
                  {user ? (
                    <div className="flex items-center space-x-3">
                      {isPremium && (
                        <div className="bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40">
                          <Crown className="w-4 h-4 text-amber-400 inline mr-1" />
                          <span className="text-amber-400 text-sm font-medium">Premium</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 bg-dark-800/50 rounded-lg px-3 py-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm max-w-32 truncate">{user.email}</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSignOut}
                          className="p-1 text-gray-400 hover:text-gray-200"
                          title="Sign Out"
                        >
                          <LogOut className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openAuthModal('signin')}
                        className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                      >
                        Sign In
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openAuthModal('signup')}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Sign Up
                      </motion.button>
                    </div>
                  )}
                </div>
              )}

              {/* Built on Bolt Badge - Bigger and More Prominent */}
              <motion.a
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-gray-200 hover:text-white px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                title="Built with Bolt.new"
              >
                <img
                  src="/black_circle_360x360.png"
                  alt="Built on Bolt"
                  className="w-8 h-8"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Built on Bolt</span>
                  <span className="text-xs text-gray-400">Hackathon Entry</span>
                </div>
              </motion.a>
            </div>

            {/* Mobile Navigation Toggle */}
            <div className="lg:hidden flex items-center space-x-3">
              {/* Mobile Auth */}
              {!loading && !user && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openAuthModal('signin')}
                  className="p-2 text-gray-400 hover:text-gray-200"
                >
                  <User className="w-5 h-5" />
                </motion.button>
              )}

              {/* Built on Bolt Badge - Mobile (Bigger) */}
              <motion.a
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-gray-300 px-3 py-2 rounded-lg"
                title="Built with Bolt.new"
              >
                <img
                  src="/black_circle_360x360.png"
                  alt="Built on Bolt"
                  className="w-6 h-6"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-medium">Bolt</span>
                  <span className="text-xs text-gray-400">Entry</span>
                </div>
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-400 hover:text-gray-200 hover:bg-dark-800 rounded-lg transition-all duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden mt-4 pt-4 border-t border-gray-700/30 overflow-hidden"
              >
                <nav className="grid grid-cols-1 gap-2">
                  {/* Mobile Auth Section */}
                  {!loading && (
                    <div className="mb-4 pb-4 border-b border-gray-700/30">
                      {user ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-gray-300">
                            <User className="w-4 h-4" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                          {isPremium && (
                            <div className="bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40 inline-flex items-center">
                              <Crown className="w-4 h-4 text-amber-400 mr-1" />
                              <span className="text-amber-400 text-sm font-medium">Premium</span>
                            </div>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSignOut}
                            className="flex items-center space-x-2 px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </motion.button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => openAuthModal('signin')}
                            className="w-full px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-dark-800 transition-colors"
                          >
                            Sign In
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => openAuthModal('signup')}
                            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            Sign Up
                          </motion.button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Core Navigation */}
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavClick(item.id)}
                        className={`
                          flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-left
                          ${isActive 
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25' 
                            : 'text-gray-400 hover:text-gray-200 hover:bg-dark-800'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </motion.button>
                    );
                  })}
                  
                  {/* Premium Section */}
                  <div className="border-t border-gray-700/30 mt-2 pt-2">
                    <div className="text-xs text-gray-500 px-4 py-2 font-medium">Premium Features</div>
                    {premiumItems.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = currentView === item.id;
                      const isLocked = !isPremium && item.id !== 'premium';
                      
                      return (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (navItems.length + index) * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleNavClick(item.id)}
                          className={`
                            flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-left
                            ${isActive 
                              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25' 
                              : 'text-gray-400 hover:text-gray-200 hover:bg-dark-800'
                            }
                            ${isLocked ? 'opacity-60' : ''}
                          `}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                          {isLocked && (
                            <Crown className="w-4 h-4 text-amber-400 ml-auto" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Settings */}
                  <div className="border-t border-gray-700/30 mt-2 pt-2">
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navItems.length + premiumItems.length) * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavClick('settings')}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-left w-full
                        ${currentView === 'settings'
                          ? 'bg-gray-600 text-white shadow-lg shadow-gray-600/25' 
                          : 'text-gray-400 hover:text-gray-200 hover:bg-dark-800'
                        }
                      `}
                    >
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </motion.button>
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
}