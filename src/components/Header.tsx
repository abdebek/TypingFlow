import React, { useState } from 'react';
import { Keyboard, BarChart3, Settings, Trophy, BookOpen, Menu, X, FileText, Shield, Crown, Globe, Brain, User, LogOut } from 'lucide-react';
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

  const navItems = [
    { id: 'test', label: 'Test', icon: Keyboard },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'leaderboard', label: 'Challenges', icon: Trophy },
    { id: 'multiplayer', label: 'Multiplayer', icon: Globe, premium: true },
    { id: 'ai-coach', label: 'AI Coach', icon: Brain, premium: true },
    { id: 'tutorial', label: 'Tutorial', icon: BookOpen },
    { id: 'premium', label: 'Premium', icon: Crown, premium: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const legalItems = [
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'terms', label: 'Terms', icon: FileText },
  ];

  const handleNavClick = (viewId: string) => {
    // Check if premium feature requires authentication
    const item = navItems.find(nav => nav.id === viewId);
    if (item?.premium && !user) {
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
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-4 md:p-6 mb-6 md:mb-8 relative"
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

          {/* User Section & Built on Bolt Badge */}
          <div className="hidden lg:flex items-center space-x-4">
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
                      <span className="text-gray-300 text-sm">{user.email}</span>
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

            {/* Built on Bolt Badge - REQUIRED FOR HACKATHON */}
            <motion.a
              href="https://bolt.new"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              title="Built with Bolt.new - World's Largest Hackathon Entry"
            >
              <img
                src="/black_circle_360x360.png"
                alt="Built on Bolt"
                className="w-5 h-5"
              />
              <span className="text-sm font-semibold">Built on Bolt</span>
            </motion.a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 mr-32">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const isPremiumFeature = item.premium;
              const isLocked = isPremiumFeature && !isPremium && user;
              
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 relative
                    ${isActive 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-dark-800'
                    }
                    ${isLocked ? 'opacity-60' : ''}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                  {isPremiumFeature && (
                    <Crown className="w-3 h-3 text-amber-400" />
                  )}
                </motion.button>
              );
            })}
            
            {/* Legal Links Separator */}
            <div className="w-px h-6 bg-gray-600 mx-2" />
            
            {/* Legal Links */}
            {legalItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-gray-600 text-white shadow-lg shadow-gray-600/25' 
                      : 'text-gray-500 hover:text-gray-300 hover:bg-dark-800'
                    }
                  `}
                >
                  <Icon className="w-3 h-3" />
                  <span className="text-xs">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

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

            {/* Built on Bolt Badge - Mobile */}
            <motion.a
              href="https://bolt.new"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 rounded text-xs font-medium"
              title="Built with Bolt.new"
            >
              <img
                src="/black_circle_360x360.png"
                alt="Built on Bolt"
                className="w-4 h-4"
              />
              <span>Built on Bolt</span>
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

                {/* Main Navigation */}
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  const isPremiumFeature = item.premium;
                  const isLocked = isPremiumFeature && !isPremium && user;
                  
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
                        flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-left relative
                        ${isActive 
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25' 
                          : 'text-gray-400 hover:text-gray-200 hover:bg-dark-800'
                        }
                        ${isLocked ? 'opacity-60' : ''}
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                      {isPremiumFeature && (
                        <Crown className="w-4 h-4 text-amber-400" />
                      )}
                    </motion.button>
                  );
                })}
                
                {/* Legal Links */}
                <div className="border-t border-gray-700/30 mt-2 pt-2">
                  {legalItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    
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
                          flex items-center space-x-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-left
                          ${isActive 
                            ? 'bg-gray-600 text-white shadow-lg shadow-gray-600/25' 
                            : 'text-gray-500 hover:text-gray-300 hover:bg-dark-800'
                          }
                        `}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

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