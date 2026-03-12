/**
 * Typing Animation Module
 * Provides terminal-style typing animations for text elements
 * 
 * Features:
 * - Character-by-character typing animation
 * - Variable typing speed with random delays for realism
 * - Blinking cursor effect
 * - Callback support for animation completion
 * - Multiple typing sequences with delays
 * - Respects prefers-reduced-motion
 * 
 * Requirements: 1.1, 1.3
 */

class TypingAnimation {
  constructor() {
    this.activeAnimations = new Map();
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Listen for reduced motion preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
      if (this.reducedMotion) {
        this.stopAll();
      }
    });
  }

  /**
   * Type text with character-by-character animation
   * @param {HTMLElement} element - Target element
   * @param {string|Array<string>} text - Text to type (string or array of strings for sequences)
   * @param {Object} options - Configuration options
   * @param {number} options.speed - Base typing speed in ms per character (default: 50)
   * @param {number} options.variance - Random variance in typing speed (default: 30)
   * @param {number} options.delay - Delay before starting in ms (default: 0)
   * @param {number} options.sequenceDelay - Delay between sequences in ms (default: 1000)
   * @param {boolean} options.cursor - Show blinking cursor (default: true)
   * @param {string} options.cursorChar - Cursor character (default: '▋')
   * @param {Function} options.onComplete - Callback when animation completes
   * @param {boolean} options.loop - Loop the animation (default: false)
   * @param {boolean} options.clearBefore - Clear element before typing (default: true)
   */
  typeText(element, text, options = {}) {
    if (!element) {
      console.warn('TypingAnimation: Invalid element provided');
      return;
    }

    // If reduced motion is enabled, show text immediately
    if (this.reducedMotion) {
      const finalText = Array.isArray(text) ? text[text.length - 1] : text;
      element.textContent = finalText;
      if (options.onComplete) {
        options.onComplete();
      }
      return;
    }

    const config = {
      speed: options.speed || 50,
      variance: options.variance || 30,
      delay: options.delay || 0,
      sequenceDelay: options.sequenceDelay || 1000,
      cursor: options.cursor !== undefined ? options.cursor : true,
      cursorChar: options.cursorChar || '▋',
      onComplete: options.onComplete || null,
      loop: options.loop || false,
      clearBefore: options.clearBefore !== undefined ? options.clearBefore : true,
    };

    // Convert single text to array for uniform handling
    const sequences = Array.isArray(text) ? text : [text];

    // Stop any existing animation on this element
    this.stop(element);

    // Store animation data
    const animationData = {
      config,
      sequences,
      currentSequence: 0,
      currentChar: 0,
      timeoutId: null,
      cursorIntervalId: null,
      isTyping: false,
      cursorElement: null,
    };

    this.activeAnimations.set(element, animationData);

    // Clear element if requested
    if (config.clearBefore) {
      element.textContent = '';
    }

    // Add cursor if enabled
    if (config.cursor) {
      this._addCursor(element, animationData);
    }

    // Start typing after delay
    if (config.delay > 0) {
      animationData.timeoutId = setTimeout(() => {
        this._startTyping(element);
      }, config.delay);
    } else {
      this._startTyping(element);
    }
  }

  /**
   * Stop typing animation on an element
   * @param {HTMLElement} element - Target element
   * @param {boolean} complete - Whether to show complete text (default: false)
   */
  stop(element, complete = false) {
    const animationData = this.activeAnimations.get(element);
    if (animationData) {
      // Clear timeouts and intervals
      if (animationData.timeoutId) {
        clearTimeout(animationData.timeoutId);
      }
      if (animationData.cursorIntervalId) {
        clearInterval(animationData.cursorIntervalId);
      }

      // Remove cursor
      this._removeCursor(element, animationData);

      // Show complete text if requested
      if (complete && animationData.sequences.length > 0) {
        const lastSequence = animationData.sequences[animationData.sequences.length - 1];
        element.textContent = lastSequence;
      }

      this.activeAnimations.delete(element);
    }
  }

  /**
   * Stop all active typing animations
   * @param {boolean} complete - Whether to show complete text (default: false)
   */
  stopAll(complete = false) {
    this.activeAnimations.forEach((_, element) => {
      this.stop(element, complete);
    });
  }

  /**
   * Pause typing animation on an element
   * @param {HTMLElement} element - Target element
   */
  pause(element) {
    const animationData = this.activeAnimations.get(element);
    if (animationData && animationData.timeoutId) {
      clearTimeout(animationData.timeoutId);
      animationData.timeoutId = null;
      animationData.isTyping = false;
    }
  }

  /**
   * Resume typing animation on an element
   * @param {HTMLElement} element - Target element
   */
  resume(element) {
    const animationData = this.activeAnimations.get(element);
    if (animationData && !animationData.isTyping) {
      this._startTyping(element);
    }
  }

  /**
   * Start typing animation
   * @private
   */
  _startTyping(element) {
    const animationData = this.activeAnimations.get(element);
    if (!animationData) return;

    animationData.isTyping = true;
    this._typeNextCharacter(element);
  }

  /**
   * Type the next character
   * @private
   */
  _typeNextCharacter(element) {
    const animationData = this.activeAnimations.get(element);
    if (!animationData || !animationData.isTyping) return;

    const { config, sequences, currentSequence, currentChar } = animationData;
    const currentText = sequences[currentSequence];

    if (currentChar < currentText.length) {
      // Type next character
      const char = currentText[currentChar];
      
      // Insert character before cursor if cursor exists, otherwise append
      if (animationData.cursorElement && animationData.cursorElement.parentNode === element) {
        const textNode = document.createTextNode(char);
        element.insertBefore(textNode, animationData.cursorElement);
      } else {
        element.textContent += char;
      }

      animationData.currentChar++;

      // Calculate next delay with variance for realism
      const variance = (Math.random() - 0.5) * config.variance;
      const delay = Math.max(10, config.speed + variance);

      // Schedule next character
      animationData.timeoutId = setTimeout(() => {
        this._typeNextCharacter(element);
      }, delay);
    } else {
      // Current sequence complete
      this._onSequenceComplete(element);
    }
  }

  /**
   * Handle sequence completion
   * @private
   */
  _onSequenceComplete(element) {
    const animationData = this.activeAnimations.get(element);
    if (!animationData) return;

    const { config, sequences, currentSequence } = animationData;

    // Check if there are more sequences
    if (currentSequence < sequences.length - 1) {
      // Move to next sequence after delay
      animationData.currentSequence++;
      animationData.currentChar = 0;

      animationData.timeoutId = setTimeout(() => {
        // Add line break for next sequence
        const br = document.createElement('br');
        element.appendChild(br);
        
        this._typeNextCharacter(element);
      }, config.sequenceDelay);
    } else {
      // All sequences complete
      animationData.isTyping = false;

      // Handle loop
      if (config.loop) {
        animationData.timeoutId = setTimeout(() => {
          // Reset animation
          animationData.currentSequence = 0;
          animationData.currentChar = 0;
          
          // Clear text but keep cursor
          if (animationData.cursorElement) {
            while (element.firstChild && element.firstChild !== animationData.cursorElement) {
              element.removeChild(element.firstChild);
            }
          } else {
            element.textContent = '';
          }
          
          this._startTyping(element);
        }, config.sequenceDelay);
      } else {
        // Remove cursor on completion
        if (config.cursor) {
          this._removeCursor(element, animationData);
        }

        // Call completion callback
        if (config.onComplete) {
          config.onComplete();
        }
      }
    }
  }

  /**
   * Add blinking cursor to element
   * @private
   */
  _addCursor(element, animationData) {
    const { config } = animationData;
    
    // Create cursor element
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = config.cursorChar;
    cursor.style.cssText = `
      display: inline-block;
      animation: typing-cursor-blink 1s step-end infinite;
      margin-left: 2px;
    `;

    // Add cursor animation if not already in stylesheet
    if (!document.getElementById('typing-cursor-style')) {
      const style = document.createElement('style');
      style.id = 'typing-cursor-style';
      style.textContent = `
        @keyframes typing-cursor-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .typing-cursor {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    element.appendChild(cursor);
    animationData.cursorElement = cursor;
  }

  /**
   * Remove cursor from element
   * @private
   */
  _removeCursor(element, animationData) {
    if (animationData.cursorElement && animationData.cursorElement.parentNode === element) {
      element.removeChild(animationData.cursorElement);
      animationData.cursorElement = null;
    }
  }

  /**
   * Destroy the typing animation system
   */
  destroy() {
    this.stopAll();
    this.activeAnimations.clear();
    
    // Remove cursor style
    const style = document.getElementById('typing-cursor-style');
    if (style) {
      style.remove();
    }
  }
}

// Export as singleton
export default new TypingAnimation();
