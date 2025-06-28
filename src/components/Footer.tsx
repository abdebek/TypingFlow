import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, X, Heart } from 'lucide-react';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mt-8"
    >
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2 text-gray-400">
          <span>Built with</span>
          <Heart className="w-4 h-4 text-red-400" />
          <span>using</span>
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 hover:text-primary-300 transition-colors duration-200 font-medium"
          >
            bolt
          </motion.a>
          <span>with React, TypeScript & Tailwind CSS</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="https://github.com/abdebek/KeyboardTypingTest"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
            title="View on GitHub"
          >
            <Github className="w-5 h-5" />
          </motion.a>
          {/* 
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
            title="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
            title="X (formerly Twitter)"
          >
            <X className="w-5 h-5" />
          </motion.a>
          */}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700/30 text-center text-sm text-gray-500">
        <p>&copy; 2025 TypingFlow. Crafted for typing enthusiasts worldwide.</p>
      </div>
    </motion.footer>
  );
}