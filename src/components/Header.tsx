import React, { useState } from 'react';
import { Keyboard, BarChart3, Settings, Trophy, BookOpen, Menu, X, FileText, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'test', label: 'Test', icon: Keyboard },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'leaderboard', label: 'Challenges', icon: Trophy },
    { id: 'tutorial', label: 'Tutorial', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const legalItems = [
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'terms', label: 'Terms', icon: FileText },
  ];

  const handleNavClick = (viewId: string) => {
    onViewChange(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
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

        {/* Bolt.new Badge - Desktop */}
        <div className="hidden lg:block absolute top-4 right-4">
          <motion.a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="block"
            title="Built with Bolt.new"
          >
            <img
              src="/black_circle_360x360.png"
              alt="Built with Bolt.new"
              className="w-8 h-8 md:w-10 md:h-10 opacity-80 hover:opacity-100 transition-opacity duration-200"
            />
          </motion.a>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 mr-16">
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
          {/* Bolt.new Badge - Mobile */}
          <motion.a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="block"
            title="Built with Bolt.new"
          >
            <img
              src="/black_circle_360x360.png"
              alt="Built with Bolt.new"
              className="w-7 h-7 opacity-80 hover:opacity-100 transition-opacity duration-200"
            />
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
              {/* Main Navigation */}
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
  );
}