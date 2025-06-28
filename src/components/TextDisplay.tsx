import React, { useMemo, useRef, useEffect } from 'react';
import { CharacterState } from '../types';
import { motion } from 'framer-motion';

interface TextDisplayProps {
  characterStates: CharacterState[];
  currentIndex: number;
  onFocus: () => void;
  isActive: boolean;
  isCompleted: boolean;
}

export function TextDisplay({ characterStates, currentIndex, onFocus, isActive, isCompleted }: TextDisplayProps) {
  const textDisplayRef = useRef<HTMLDivElement>(null);

  // Calculate visible text window for single line display
  const visibleText = useMemo(() => {
    const CHARS_PER_LINE = 80; // More characters for single line
    const BUFFER = 20; // Characters before and after current position
    
    // Find the start position to center current position in the visible window
    let startIndex = Math.max(0, currentIndex - BUFFER);
    
    // Adjust to word boundaries to avoid cutting words
    if (startIndex > 0) {
      // Look backwards for a space to start from
      for (let i = startIndex; i >= Math.max(0, startIndex - 10); i--) {
        if (characterStates[i]?.char === ' ') {
          startIndex = i + 1;
          break;
        }
      }
    }
    
    const endIndex = Math.min(characterStates.length, startIndex + CHARS_PER_LINE);
    
    return {
      startIndex,
      endIndex,
      visibleChars: characterStates.slice(startIndex, endIndex)
    };
  }, [characterStates, currentIndex]);

  // Adjust current index for the visible window
  const adjustedCurrentIndex = currentIndex - visibleText.startIndex;

  const getInstructionText = () => {
    if (isCompleted) {
      return "Test completed! Check your results below.";
    }
    if (isActive) {
      return "Keep typing! Press Esc to pause or Tab to restart.";
    }
    return "Click here and start typing to begin the test";
  };

  const handleClick = () => {
    if (!isActive && !isCompleted) {
      onFocus();
    }
  };

  return (
    <motion.div
      ref={textDisplayRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-4 md:p-6 cursor-text text-display overflow-hidden focus-target"
      onClick={handleClick}
      id="text-display-area"
    >
      {/* Compact progress indicator */}
      <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
        <span>
          {currentIndex + 1} / {characterStates.length}
        </span>
        <span>
          {Math.round((currentIndex / characterStates.length) * 100)}%
        </span>
      </div>

      {/* Single line text container with fixed height */}
      <div className="relative">
        <div 
          className="text-lg md:text-xl leading-relaxed font-mono tracking-wide select-none break-words overflow-hidden"
          style={{ 
            height: '2.5rem', // Fixed height for single line
            lineHeight: '2.5rem'
          }}
        >
          {visibleText.visibleChars.map((charState, index) => {
            const isCurrentPosition = index === adjustedCurrentIndex;
            let className = 'relative transition-all duration-150 inline-block ';
            
            switch (charState.status) {
              case 'correct':
                className += 'text-success-400 bg-success-400/10 rounded-sm';
                break;
              case 'incorrect':
                className += 'text-error-400 bg-error-400/20 rounded-sm';
                break;
              case 'extra':
                className += 'text-error-300 bg-error-400/30 rounded-sm';
                break;
              default:
                className += 'text-gray-500';
            }
            
            if (isCurrentPosition) {
              className += ' bg-primary-500/30 border-l-2 border-primary-400 pl-0.5';
            }
            
            return (
              <motion.span
                key={`${visibleText.startIndex + index}`}
                className={className}
                animate={{
                  scale: isCurrentPosition ? 1.05 : 1,
                }}
                transition={{ duration: 0.1 }}
              >
                {charState.char === ' ' ? '\u00A0' : charState.char}
                {isCurrentPosition && !isCompleted && (
                  <motion.span
                    className="absolute -top-1 left-0 w-0.5 h-7 md:h-8 bg-primary-400 rounded-full"
                    animate={{ opacity: isActive ? [1, 0, 1] : 1 }}
                    transition={{ duration: isActive ? 1 : 0, repeat: isActive ? Infinity : 0 }}
                  />
                )}
              </motion.span>
            );
          })}
        </div>

        {/* Fade effect at edges for single line */}
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-dark-900/80 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-dark-900/80 to-transparent pointer-events-none" />
      </div>
      
      {/* Compact instructions */}
      <div className="mt-3 text-center text-gray-400 text-xs">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-1 md:space-y-0 md:space-x-4">
          <span>{getInstructionText()}</span>
          {!isCompleted && (
            <>
              <span className="hidden md:inline">•</span>
              <span className="text-xs">
                {isActive ? "Esc to pause • Tab to restart" : "Tab to restart"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Text navigation hint for single line */}
      {visibleText.startIndex > 0 && (
        <div className="absolute top-2 left-2 text-xs text-gray-500 bg-dark-800/80 px-2 py-1 rounded">
          ← {visibleText.startIndex} chars
        </div>
      )}
      
      {visibleText.endIndex < characterStates.length && (
        <div className="absolute top-2 right-2 text-xs text-gray-500 bg-dark-800/80 px-2 py-1 rounded">
          {characterStates.length - visibleText.endIndex} chars →
        </div>
      )}
    </motion.div>
  );
}