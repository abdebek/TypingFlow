import React from 'react';
import { motion } from 'framer-motion';

interface VirtualKeyboardProps {
  pressedKeys: Set<string>;
  lastPressedKey: string | null;
  keyAccuracy: Record<string, { correct: number; total: number }>;
}

export function VirtualKeyboard({ pressedKeys, lastPressedKey, keyAccuracy }: VirtualKeyboardProps) {
  const keyboardLayout = [
    // Number row
    [
      { key: '`', width: 'w-8 md:w-10' },
      { key: '1', width: 'w-8 md:w-10' },
      { key: '2', width: 'w-8 md:w-10' },
      { key: '3', width: 'w-8 md:w-10' },
      { key: '4', width: 'w-8 md:w-10' },
      { key: '5', width: 'w-8 md:w-10' },
      { key: '6', width: 'w-8 md:w-10' },
      { key: '7', width: 'w-8 md:w-10' },
      { key: '8', width: 'w-8 md:w-10' },
      { key: '9', width: 'w-8 md:w-10' },
      { key: '0', width: 'w-8 md:w-10' },
      { key: '-', width: 'w-8 md:w-10' },
      { key: '=', width: 'w-8 md:w-10' },
      { key: 'Backspace', width: 'w-16 md:w-20', label: '⌫' }
    ],
    // Top row
    [
      { key: 'Tab', width: 'w-12 md:w-16', label: '⇥' },
      { key: 'q', width: 'w-8 md:w-10' },
      { key: 'w', width: 'w-8 md:w-10' },
      { key: 'e', width: 'w-8 md:w-10' },
      { key: 'r', width: 'w-8 md:w-10' },
      { key: 't', width: 'w-8 md:w-10' },
      { key: 'y', width: 'w-8 md:w-10' },
      { key: 'u', width: 'w-8 md:w-10' },
      { key: 'i', width: 'w-8 md:w-10' },
      { key: 'o', width: 'w-8 md:w-10' },
      { key: 'p', width: 'w-8 md:w-10' },
      { key: '[', width: 'w-8 md:w-10' },
      { key: ']', width: 'w-8 md:w-10' },
      { key: '\\', width: 'w-12 md:w-16' }
    ],
    // Home row
    [
      { key: 'CapsLock', width: 'w-14 md:w-20', label: '⇪' },
      { key: 'a', width: 'w-8 md:w-10' },
      { key: 's', width: 'w-8 md:w-10' },
      { key: 'd', width: 'w-8 md:w-10' },
      { key: 'f', width: 'w-8 md:w-10' },
      { key: 'g', width: 'w-8 md:w-10' },
      { key: 'h', width: 'w-8 md:w-10' },
      { key: 'j', width: 'w-8 md:w-10' },
      { key: 'k', width: 'w-8 md:w-10' },
      { key: 'l', width: 'w-8 md:w-10' },
      { key: ';', width: 'w-8 md:w-10' },
      { key: "'", width: 'w-8 md:w-10' },
      { key: 'Enter', width: 'w-16 md:w-20', label: '⏎' }
    ],
    // Bottom row
    [
      { key: 'Shift', width: 'w-18 md:w-24', label: '⇧' },
      { key: 'z', width: 'w-8 md:w-10' },
      { key: 'x', width: 'w-8 md:w-10' },
      { key: 'c', width: 'w-8 md:w-10' },
      { key: 'v', width: 'w-8 md:w-10' },
      { key: 'b', width: 'w-8 md:w-10' },
      { key: 'n', width: 'w-8 md:w-10' },
      { key: 'm', width: 'w-8 md:w-10' },
      { key: ',', width: 'w-8 md:w-10' },
      { key: '.', width: 'w-8 md:w-10' },
      { key: '/', width: 'w-8 md:w-10' },
      { key: 'Shift', width: 'w-20 md:w-28', label: '⇧' }
    ],
    // Space row
    [
      { key: 'Ctrl', width: 'w-12 md:w-16', label: 'Ctrl' },
      { key: 'Alt', width: 'w-12 md:w-16', label: 'Alt' },
      { key: ' ', width: 'w-32 md:w-80', label: 'Space' },
      { key: 'Alt', width: 'w-12 md:w-16', label: 'Alt' },
      { key: 'Ctrl', width: 'w-12 md:w-16', label: 'Ctrl' }
    ]
  ];

  const getKeyAccuracy = (key: string) => {
    const normalizedKey = key.toLowerCase();
    const accuracy = keyAccuracy[normalizedKey];
    if (!accuracy || accuracy.total === 0) return 100;
    return Math.round((accuracy.correct / accuracy.total) * 100);
  };

  const getKeyColor = (key: string, accuracy: number) => {
    const normalizedKey = key.toLowerCase();
    const isPressed = pressedKeys.has(normalizedKey) || pressedKeys.has(key);
    const isLastPressed = lastPressedKey === normalizedKey || lastPressedKey === key;
    
    // Special keys styling
    const isSpecialKey = ['Shift', 'Ctrl', 'Alt', 'Tab', 'CapsLock', 'Enter', 'Backspace'].includes(key);
    
    if (isPressed || isLastPressed) {
      return 'bg-primary-500 text-white shadow-lg shadow-primary-500/50 border-primary-400';
    }
    
    if (isSpecialKey) {
      return 'bg-dark-600 text-gray-300 border-gray-500 hover:bg-dark-500';
    }
    
    // Letter keys with accuracy coloring
    if (key.length === 1 && key.match(/[a-z]/i)) {
      if (accuracy >= 95) return 'bg-success-500/20 text-success-300 border-success-500/40 hover:bg-success-500/30';
      if (accuracy >= 85) return 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30';
      if (accuracy >= 70) return 'bg-orange-500/20 text-orange-300 border-orange-500/40 hover:bg-orange-500/30';
      if (accuracy < 70 && keyAccuracy[normalizedKey]?.total > 0) {
        return 'bg-error-500/20 text-error-300 border-error-500/40 hover:bg-error-500/30';
      }
    }
    
    return 'bg-dark-700 text-gray-300 border-gray-600 hover:bg-dark-600';
  };

  const getKeyLabel = (keyObj: { key: string; label?: string }) => {
    return keyObj.label || keyObj.key.toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-4 md:p-6 overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 space-y-3 md:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-1">Virtual Keyboard</h3>
          <p className="text-sm text-gray-400">Real-time key tracking and accuracy visualization</p>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 md:flex md:items-center md:space-x-4 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success-500/20 border border-success-500/40 rounded"></div>
            <span className="text-gray-400">Excellent (95%+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-500/20 border border-amber-500/40 rounded"></div>
            <span className="text-gray-400">Good (85-94%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500/20 border border-orange-500/40 rounded"></div>
            <span className="text-gray-400">Fair (70-84%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error-500/20 border border-error-500/40 rounded"></div>
            <span className="text-gray-400">{'Needs Work (<70%)'}</span>
          </div>
        </div>
      </div>
      
      {/* Keyboard Layout */}
      <div className="space-y-1 md:space-y-2 select-none overflow-x-auto">
        <div className="min-w-max">
          {keyboardLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-0.5 md:space-x-1 mb-1 md:mb-2">
              {row.map((keyObj, keyIndex) => {
                const accuracy = getKeyAccuracy(keyObj.key);
                const keyColor = getKeyColor(keyObj.key, accuracy);
                const isPressed = pressedKeys.has(keyObj.key.toLowerCase()) || pressedKeys.has(keyObj.key);
                const isLastPressed = lastPressedKey === keyObj.key.toLowerCase() || lastPressedKey === keyObj.key;
                const isLetterKey = keyObj.key.length === 1 && keyObj.key.match(/[a-z]/i);
                
                return (
                  <motion.div
                    key={`${rowIndex}-${keyIndex}-${keyObj.key}`}
                    className={`
                      ${keyObj.width} h-8 md:h-10 ${keyColor} rounded border-2 flex items-center justify-center
                      text-xs md:text-sm font-semibold transition-all duration-150 relative overflow-hidden
                      cursor-default group
                    `}
                    animate={{
                      scale: isPressed || isLastPressed ? 0.95 : 1,
                      y: isPressed || isLastPressed ? 1 : 0,
                    }}
                    transition={{ duration: 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Press animation effect */}
                    {(isPressed || isLastPressed) && (
                      <motion.div
                        className="absolute inset-0 bg-white/20 rounded"
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                      />
                    )}
                    
                    {/* Key label */}
                    <span className="relative z-10 text-center leading-tight truncate px-1">
                      {getKeyLabel(keyObj)}
                    </span>
                    
                    {/* Accuracy indicator for letter keys */}
                    {isLetterKey && keyAccuracy[keyObj.key.toLowerCase()]?.total > 0 && (
                      <motion.div 
                        className="absolute bottom-0.5 right-0.5 text-xs font-bold opacity-80"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {accuracy}%
                      </motion.div>
                    )}
                    
                    {/* Hover tooltip for detailed stats */}
                    {isLetterKey && keyAccuracy[keyObj.key.toLowerCase()]?.total > 0 && (
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-dark-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 whitespace-nowrap">
                        {keyAccuracy[keyObj.key.toLowerCase()].correct}/{keyAccuracy[keyObj.key.toLowerCase()].total} correct
                      </div>
                    )}
                    
                    {/* Special key indicator */}
                    {['f', 'j'].includes(keyObj.key.toLowerCase()) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Typing stats summary */}
      <div className="mt-4 md:mt-6 pt-4 border-t border-gray-700/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
          <div className="bg-dark-800/50 rounded-lg p-2 md:p-3">
            <div className="text-base md:text-lg font-bold text-primary-400">
              {Object.keys(keyAccuracy).length}
            </div>
            <div className="text-xs text-gray-400">Keys Used</div>
          </div>
          <div className="bg-dark-800/50 rounded-lg p-2 md:p-3">
            <div className="text-base md:text-lg font-bold text-success-400">
              {Object.values(keyAccuracy).reduce((sum, acc) => sum + acc.correct, 0)}
            </div>
            <div className="text-xs text-gray-400">Correct Presses</div>
          </div>
          <div className="bg-dark-800/50 rounded-lg p-2 md:p-3">
            <div className="text-base md:text-lg font-bold text-error-400">
              {Object.values(keyAccuracy).reduce((sum, acc) => sum + (acc.total - acc.correct), 0)}
            </div>
            <div className="text-xs text-gray-400">Incorrect Presses</div>
          </div>
          <div className="bg-dark-800/50 rounded-lg p-2 md:p-3">
            <div className="text-base md:text-lg font-bold text-amber-400">
              {Object.values(keyAccuracy).length > 0 
                ? Math.round(
                    Object.values(keyAccuracy).reduce((sum, acc) => sum + (acc.correct / acc.total), 0) / 
                    Object.values(keyAccuracy).length * 100
                  )
                : 100
              }%
            </div>
            <div className="text-xs text-gray-400">Overall Accuracy</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}