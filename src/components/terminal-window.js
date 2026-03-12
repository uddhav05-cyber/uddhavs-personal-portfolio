/**
 * Terminal Window Component
 * Creates terminal-style UI elements with typing animations
 * 
 * Features:
 * - Terminal header with colored dots (red, yellow, green)
 * - Typing animation effect for text content
 * - Command prompt styling with $ prefix
 * - Blinking cursor animation
 * - Clear method for terminal content reset
 * - Integration with typing-animation module
 * 
 * Requirements: 1.1, 1.3, 18.2
 */

import typingAnimation from '../modules/typing-animation.js';

class TerminalWindow {
  /**
   * Create a terminal window component
   * @param {HTMLElement|string} target - Target element or selector
   * @param {Object} options - Configuration options
   * @param {boolean} options.showHeader - Show terminal header with dots (default: true)
   * @param {boolean} options.showPrompt - Show command prompt (default: true)
   * @param {string} options.promptText - Command prompt text (default: '$')
   * @param {string} options.title - Terminal window title (default: '')
   * @param {boolean} options.autoInit - Auto-initialize on creation (default: true)
   */
  constructor(target, options = {}) {
    // Resolve target element
    if (typeof target === 'string') {
      this.element = document.querySelector(target);
      if (!this.element) {
        throw new Error(`TerminalWindow: Element not found for selector "${target}"`);
      }
    } else if (target instanceof HTMLElement) {
      this.element = target;
    } else {
      throw new Error('TerminalWindow requires a valid element or selector');
    }

    // Configuration
    this.options = {
      showHeader: options.showHeader !== undefined ? options.showHeader : true,
      showPrompt: options.showPrompt !== undefined ? options.showPrompt : true,
      promptText: options.promptText || '$',
      title: options.title || '',
      autoInit: options.autoInit !== undefined ? options.autoInit : true,
    };

    // State
    this.headerElement = null;
    this.contentElement = null;
    this.promptElement = null;
    this.textElement = null;
    this.isInitialized = false;

    // Auto-initialize if requested
    if (this.options.autoInit) {
      this.init();
    }
  }

  /**
   * Initialize the terminal window
   */
  init() {
    if (this.isInitialized) {
      console.warn('TerminalWindow: Already initialized');
      return;
    }

    // Add terminal window class
    this.element.classList.add('terminal-window');

    // Create header if enabled
    if (this.options.showHeader) {
      this._createHeader();
    }

    // Create content area
    this._createContent();

    this.isInitialized = true;
  }

  /**
   * Create terminal header with colored dots
   * @private
   */
  _createHeader() {
    this.headerElement = document.createElement('div');
    this.headerElement.className = 'terminal-header';

    // Create colored dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'terminal-dots';

    const colors = ['red', 'yellow', 'green'];
    colors.forEach(color => {
      const dot = document.createElement('span');
      dot.className = `terminal-dot terminal-dot-${color}`;
      dot.setAttribute('aria-hidden', 'true');
      dotsContainer.appendChild(dot);
    });

    this.headerElement.appendChild(dotsContainer);

    // Add title if provided
    if (this.options.title) {
      const titleElement = document.createElement('span');
      titleElement.className = 'terminal-title';
      titleElement.textContent = this.options.title;
      this.headerElement.appendChild(titleElement);
    }

    this.element.appendChild(this.headerElement);
  }

  /**
   * Create content area with prompt
   * @private
   */
  _createContent() {
    this.contentElement = document.createElement('div');
    this.contentElement.className = 'terminal-content';
    this.contentElement.setAttribute('role', 'log');
    this.contentElement.setAttribute('aria-live', 'polite');

    // Create prompt if enabled
    if (this.options.showPrompt) {
      this.promptElement = document.createElement('span');
      this.promptElement.className = 'terminal-prompt';
      this.promptElement.textContent = this.options.promptText + ' ';
      this.promptElement.setAttribute('aria-hidden', 'true');
      this.contentElement.appendChild(this.promptElement);
    }

    // Create text container
    this.textElement = document.createElement('span');
    this.textElement.className = 'terminal-text';
    this.contentElement.appendChild(this.textElement);

    this.element.appendChild(this.contentElement);
  }

  /**
   * Type text with typing animation effect
   * @param {string|Array<string>} text - Text to type (string or array for multiple lines)
   * @param {Object} options - Typing animation options
   * @param {number} options.speed - Typing speed in ms per character (default: 50)
   * @param {number} options.variance - Random variance in typing speed (default: 30)
   * @param {number} options.delay - Delay before starting in ms (default: 0)
   * @param {boolean} options.cursor - Show blinking cursor (default: true)
   * @param {Function} options.onComplete - Callback when typing completes
   * @returns {Promise} Resolves when typing completes
   */
  typeText(text, options = {}) {
    if (!this.isInitialized) {
      throw new Error('TerminalWindow: Must call init() before typeText()');
    }

    return new Promise((resolve) => {
      const typingOptions = {
        speed: options.speed || 50,
        variance: options.variance || 30,
        delay: options.delay || 0,
        cursor: options.cursor !== undefined ? options.cursor : true,
        clearBefore: false, // Don't clear, we manage content
        onComplete: () => {
          if (options.onComplete) {
            options.onComplete();
          }
          resolve();
        },
      };

      typingAnimation.typeText(this.textElement, text, typingOptions);
    });
  }

  /**
   * Add a command prompt line
   * @param {string} command - Command text to display
   * @param {boolean} animate - Whether to animate the command (default: false)
   */
  addPrompt(command, animate = false) {
    if (!this.isInitialized) {
      throw new Error('TerminalWindow: Must call init() before addPrompt()');
    }

    // Create new line if content already exists
    if (this.textElement.textContent.trim() !== '') {
      const br = document.createElement('br');
      this.contentElement.appendChild(br);

      // Create new prompt
      const newPrompt = document.createElement('span');
      newPrompt.className = 'terminal-prompt';
      newPrompt.textContent = this.options.promptText + ' ';
      newPrompt.setAttribute('aria-hidden', 'true');
      this.contentElement.appendChild(newPrompt);

      // Create new text container
      this.textElement = document.createElement('span');
      this.textElement.className = 'terminal-text';
      this.contentElement.appendChild(this.textElement);
    }

    if (animate) {
      return this.typeText(command);
    } else {
      this.textElement.textContent = command;
      return Promise.resolve();
    }
  }

  /**
   * Write text directly without animation
   * @param {string} text - Text to write
   */
  write(text) {
    if (!this.isInitialized) {
      throw new Error('TerminalWindow: Must call init() before write()');
    }

    this.textElement.textContent += text;
  }

  /**
   * Write a line of text
   * @param {string} text - Text to write
   */
  writeLine(text) {
    if (!this.isInitialized) {
      throw new Error('TerminalWindow: Must call init() before writeLine()');
    }

    if (this.textElement.textContent.trim() !== '') {
      const br = document.createElement('br');
      this.contentElement.appendChild(br);
    }

    const line = document.createElement('span');
    line.className = 'terminal-line';
    line.textContent = text;
    this.contentElement.appendChild(line);
  }

  /**
   * Clear terminal content
   * @param {boolean} keepPrompt - Keep the initial prompt (default: true)
   */
  clear(keepPrompt = true) {
    if (!this.isInitialized) {
      throw new Error('TerminalWindow: Must call init() before clear()');
    }

    // Stop any active typing animations
    typingAnimation.stop(this.textElement);

    // Clear content
    this.contentElement.innerHTML = '';

    // Recreate prompt if requested
    if (keepPrompt && this.options.showPrompt) {
      this.promptElement = document.createElement('span');
      this.promptElement.className = 'terminal-prompt';
      this.promptElement.textContent = this.options.promptText + ' ';
      this.promptElement.setAttribute('aria-hidden', 'true');
      this.contentElement.appendChild(this.promptElement);
    }

    // Recreate text container
    this.textElement = document.createElement('span');
    this.textElement.className = 'terminal-text';
    this.contentElement.appendChild(this.textElement);
  }

  /**
   * Show blinking cursor
   */
  showCursor() {
    if (!this.isInitialized) {
      throw new Error('TerminalWindow: Must call init() before showCursor()');
    }

    // Check if cursor already exists
    if (this.textElement.querySelector('.terminal-cursor')) {
      return;
    }

    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    cursor.textContent = '▋';
    cursor.setAttribute('aria-hidden', 'true');
    this.textElement.appendChild(cursor);
  }

  /**
   * Hide cursor
   */
  hideCursor() {
    if (!this.isInitialized) {
      return;
    }

    const cursor = this.textElement.querySelector('.terminal-cursor');
    if (cursor) {
      cursor.remove();
    }
  }

  /**
   * Update terminal options
   * @param {Object} options - New options to merge
   */
  updateOptions(options) {
    this.options = { ...this.options, ...options };

    // Update prompt text if changed
    if (options.promptText && this.promptElement) {
      this.promptElement.textContent = options.promptText + ' ';
    }

    // Update title if changed
    if (options.title && this.headerElement) {
      let titleElement = this.headerElement.querySelector('.terminal-title');
      if (titleElement) {
        titleElement.textContent = options.title;
      } else if (options.title) {
        titleElement = document.createElement('span');
        titleElement.className = 'terminal-title';
        titleElement.textContent = options.title;
        this.headerElement.appendChild(titleElement);
      }
    }
  }

  /**
   * Destroy the terminal window
   */
  destroy() {
    if (!this.isInitialized) {
      return;
    }

    // Stop any active animations
    if (this.textElement) {
      typingAnimation.stop(this.textElement);
    }

    // Remove all created elements
    if (this.element) {
      this.element.innerHTML = '';
      this.element.classList.remove('terminal-window');
    }

    // Clear references
    this.headerElement = null;
    this.contentElement = null;
    this.promptElement = null;
    this.textElement = null;
    this.element = null;
    this.isInitialized = false;
  }

  /**
   * Static factory method to create terminal window from element or selector
   * @param {HTMLElement|string} target - Target element or selector
   * @param {Object} options - Configuration options
   * @returns {TerminalWindow|Array<TerminalWindow>|null} Terminal window instance(s) or null
   */
  static create(target, options = {}) {
    if (typeof target === 'string') {
      const elements = document.querySelectorAll(target);
      if (elements.length === 0) {
        return null;
      } else if (elements.length === 1) {
        return new TerminalWindow(elements[0], options);
      } else {
        return Array.from(elements).map(el => new TerminalWindow(el, options));
      }
    } else if (target instanceof HTMLElement) {
      return new TerminalWindow(target, options);
    }
    return null;
  }
}

export default TerminalWindow;
