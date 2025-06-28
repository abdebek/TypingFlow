import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Brain, Target, Users, Star, Github, ExternalLink, Award, Rocket, Shield, FileText, Mail, HelpCircle } from 'lucide-react';

interface FooterProps {
  onViewChange?: (view: string) => void;
}

export function Footer({ onViewChange }: FooterProps) {
  const hackathonAchievements = [
    { icon: Brain, label: 'AI-Powered', description: 'Smart coaching & insights' },
    { icon: Zap, label: 'Lightning Fast', description: 'Optimized performance' },
    { icon: Users, label: 'Multiplayer', description: 'Real-time racing' },
    { icon: Target, label: 'Precision', description: 'Advanced analytics' }
  ];

  const scrollToTextInput = () => {
    // Scroll to text display area
    setTimeout(() => {
      const textDisplay = document.getElementById('text-display-area');
      if (textDisplay) {
        textDisplay.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickStartAction = (action: () => void) => {
    action();
    // For test view, scroll to text input
    if (action.toString().includes('test')) {
      scrollToTextInput();
    } else {
      // For other views, scroll to top
      scrollToTop();
    }
  };

  const quickLinks = [
    { 
      label: 'Start Typing Test', 
      action: () => {
        onViewChange?.('test');
        scrollToTextInput();
      }
    },
    { 
      label: 'View Statistics', 
      action: () => {
        onViewChange?.('stats');
        scrollToTop();
      }
    },
    { 
      label: 'Typing Tutorial', 
      action: () => {
        onViewChange?.('tutorial');
        scrollToTop();
      }
    },
    { 
      label: 'Challenges', 
      action: () => {
        onViewChange?.('leaderboard');
        scrollToTop();
      }
    }
  ];

  const premiumFeatures = [
    { 
      label: 'AI Typing Coach', 
      action: () => {
        onViewChange?.('ai-coach');
        scrollToTop();
      }
    },
    { 
      label: 'Multiplayer Racing', 
      action: () => {
        onViewChange?.('multiplayer');
        scrollToTop();
      }
    },
    { 
      label: 'Premium Features', 
      action: () => {
        onViewChange?.('premium');
        scrollToTop();
      }
    },
    { 
      label: 'Advanced Analytics', 
      action: () => {
        onViewChange?.('stats');
        scrollToTop();
      }
    }
  ];

  const supportLinks = [
    { 
      label: 'Privacy Policy', 
      action: () => {
        onViewChange?.('privacy');
        scrollToTop();
      }, 
      icon: Shield 
    },
    { 
      label: 'Terms of Service', 
      action: () => {
        onViewChange?.('terms');
        scrollToTop();
      }, 
      icon: FileText 
    },
    { label: 'Help & Support', href: 'mailto:support@typingflow.com', icon: HelpCircle },
    { label: 'Contact Us', href: 'mailto:hello@typingflow.com', icon: Mail }
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 mt-12"
    >
      {/* Hackathon Banner */}
      <div className="bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-green-600/20 rounded-xl p-6 mb-8 border border-purple-500/30">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="bg-amber-500/20 p-3 rounded-full">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-200">World's Largest Hackathon Entry</h3>
              <p className="text-sm text-gray-400">Competing in 6 prize categories • Built with Bolt.new</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://bolt.new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <img
                src="/black_circle_360x360.png"
                alt="Built on Bolt"
                className="w-5 h-5"
              />
              <span>Built on Bolt</span>
              <ExternalLink className="w-4 h-4" />
            </motion.a>
            
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com/abdebek/TypingFlow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-dark-800 text-gray-300 px-4 py-2 rounded-lg hover:bg-dark-700 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>View Source</span>
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {hackathonAchievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <motion.div
              key={achievement.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 bg-dark-800/30 rounded-lg border border-gray-700/30 hover:border-primary-500/30 transition-colors"
            >
              <Icon className="w-8 h-8 text-primary-400 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-200 text-sm">{achievement.label}</h4>
              <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Quick Actions */}
        <div>
          <h4 className="font-semibold text-gray-200 mb-4 flex items-center space-x-2">
            <Rocket className="w-4 h-4 text-success-400" />
            <span>Quick Start</span>
          </h4>
          <ul className="space-y-2">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={link.action}
                  className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-start space-x-2 w-full text-left"
                >
                  <span className="w-1 h-1 bg-primary-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="leading-tight">{link.label}</span>
                </motion.button>
              </li>
            ))}
          </ul>
        </div>

        {/* Premium Features */}
        <div>
          <h4 className="font-semibold text-gray-200 mb-4 flex items-center space-x-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span>Premium</span>
          </h4>
          <ul className="space-y-2">
            {premiumFeatures.map((link, index) => (
              <li key={index}>
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={link.action}
                  className="text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-start space-x-2 w-full text-left"
                >
                  <span className="w-1 h-1 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="leading-tight">{link.label}</span>
                </motion.button>
              </li>
            ))}
          </ul>
        </div>

        {/* Support & Legal */}
        <div>
          <h4 className="font-semibold text-gray-200 mb-4 flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>Support</span>
          </h4>
          <ul className="space-y-2">
            {supportLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <li key={index}>
                  {link.href ? (
                    <motion.a
                      whileHover={{ x: 4 }}
                      href={link.href}
                      className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-start space-x-2"
                    >
                      <Icon className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="leading-tight">{link.label}</span>
                      <ExternalLink className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    </motion.a>
                  ) : (
                    <motion.button
                      whileHover={{ x: 4 }}
                      onClick={link.action}
                      className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-start space-x-2 w-full text-left"
                    >
                      <Icon className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="leading-tight">{link.label}</span>
                    </motion.button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Achievements */}
        <div>
          <h4 className="font-semibold text-gray-200 mb-4 flex items-center space-x-2">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Prize Categories</span>
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="text-gray-400 flex items-start space-x-2">
              <Star className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
              <span className="leading-tight">Creative Use of AI</span>
            </li>
            <li className="text-gray-400 flex items-start space-x-2">
              <Star className="w-3 h-3 text-pink-400 mt-0.5 flex-shrink-0" />
              <span className="leading-tight">Most Beautiful UI</span>
            </li>
            <li className="text-gray-400 flex items-start space-x-2">
              <Star className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
              <span className="leading-tight">Sharpest Problem Fit</span>
            </li>
            <li className="text-gray-400 flex items-start space-x-2">
              <Star className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="leading-tight">Future Unicorn</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Project Stats Bar - Realistic Numbers */}
      <div className="bg-dark-800/50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary-400">2025</div>
            <div className="text-xs text-gray-400">Built for the Future</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success-400">6</div>
            <div className="text-xs text-gray-400">Prize Categories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">5</div>
            <div className="text-xs text-gray-400">AI Providers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">100%</div>
            <div className="text-xs text-gray-400">Open Source</div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-gray-700/30 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>&copy; 2025 TypingFlow</span>
          <span>•</span>
          <span>Made for typing enthusiasts worldwide</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse" />
            <span className="text-xs text-success-400">Live & Ready</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}