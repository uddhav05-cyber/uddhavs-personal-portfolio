/**
 * Glitch Text Component
 * UI component wrapper for glitch effects on text elements
 * 
 * Features:
 * - Easy-to-use component interface
 * - Wraps glitch-effects module functionality
 * - Configurable intensity and frequency
 * - Automatic cleanup on destroy
 * - Respects prefers-reduced-motion
 * 
 * Requirements: 1.1, 1.2, 1.5
 */

import glitchEffects from '../modules/glitch-effects.js';

class GlitchText {
  constructor(element, options = {}) {
    if (!element) {
      throw new Error('GlitchText requires a valid element');
    }

    this.element = element;
    this.options = {
      intensity: options.intensity || 0.5,
      frequency: options.frequency || 3000,
      duration: options.duration || 300,
      continuous: options.continuous || false,
      autoStart: options.autoStart !== false, // Default to true
    };

    this.isActive = false;

    // Add glitch-text class for styling
    this.element.classList.add('glitch-text');

    // Auto-start if enabled
    if (this.options.autoStart) {
      this.start();
    }
  }

  /**
   * Start the glitch effect
   */
  start() {
    if (this.isActive) return;

    glitchEffects.applyGlitch(this.element, {
      intensity: this.options.intensity,
      frequency: this.options.frequency,
      duration: this.options.duration,
      continuous: this.options.continuous,
    });

    this.isActive = true;
  }

  /**
   * Stop the glitch effect
   */
  stop() {
    if (!this.isActive) return;

    glitchEffects.stop(this.element);
    this.isActive = false;
  }

  /**
   * Set the glitch intensity
   * @param {number} intensity - Intensity value (0-1)
   */
  setIntensity(intensity) {
    this.options.intensity = Math.max(0, Math.min(1, intensity));
    
    if (this.isActive) {
      glitchEffects.setIntensity(this.element, this.options.intensity);
    }
  }

  /**
   * Set the glitch frequency
   * @param {number} frequency - Frequency in milliseconds
   */
  setFrequency(frequency) {
    this.options.frequency = frequency;
    
    // Restart with new frequency if active
    if (this.isActive) {
      this.stop();
      this.start();
    }
  }

  /**
   * Update multiple options at once
   * @param {Object} options - Options to update
   */
  updateOptions(options) {
    const wasActive = this.isActive;
    
    if (wasActive) {
      this.stop();
    }

    this.options = {
      ...this.options,
      ...options,
    };

    if (wasActive) {
      this.start();
    }
  }

  /**
   * Trigger a single glitch animation
   */
  triggerGlitch() {
    if (!this.isActive) {
      // Temporarily activate for single glitch
      glitchEffects.applyGlitch(this.element, {
        intensity: this.options.intensity,
        frequency: 0,
        duration: this.options.duration,
        continuous: false,
      });

      // Stop after duration
      setTimeout(() => {
        glitchEffects.stop(this.element);
      }, this.options.duration + 100);
    }
  }

  /**
   * Destroy the component and clean up
   */
  destroy() {
    this.stop();
    this.element.classList.remove('glitch-text');
    this.element = null;
  }

  /**
   * Static factory method to create glitch text from selector
   * @param {string|HTMLElement} selector - CSS selector or element
   * @param {Object} options - Configuration options
   * @returns {GlitchText|GlitchText[]} Single instance or array of instances
   */
  static create(selector, options = {}) {
    if (typeof selector === 'string') {
      const elements = document.querySelectorAll(selector);
      
      if (elements.length === 0) {
        console.warn(`GlitchText: No elements found for selector "${selector}"`);
        return null;
      }

      if (elements.length === 1) {
        return new GlitchText(elements[0], options);
      }

      return Array.from(elements).map(el => new GlitchText(el, options));
    }

    return new GlitchText(selector, options);
  }
}

export default GlitchText;
