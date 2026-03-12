/**
 * Glitch Effects Module
 * Provides cyberpunk-style glitch animations for text elements
 * 
 * Features:
 * - Random character replacement
 * - RGB color shift effects
 * - Configurable intensity
 * - 60fps performance with requestAnimationFrame
 * - Respects prefers-reduced-motion
 * 
 * Requirements: 1.1, 1.2, 1.5
 */

class GlitchEffects {
  constructor() {
    this.activeGlitches = new Map();
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.glitchChars = '!<>-_\\/[]{}—=+*^?#________';
    this.animationFrameId = null;
    
    // Listen for reduced motion preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
      if (this.reducedMotion) {
        this.stopAll();
      }
    });
  }

  /**
   * Apply glitch effect to an element
   * @param {HTMLElement} element - Target element
   * @param {Object} options - Configuration options
   * @param {number} options.intensity - Glitch intensity (0-1, default: 0.5)
   * @param {number} options.frequency - How often glitch occurs in ms (default: 3000)
   * @param {number} options.duration - Duration of each glitch in ms (default: 300)
   * @param {boolean} options.continuous - Whether to glitch continuously (default: false)
   */
  applyGlitch(element, options = {}) {
    if (this.reducedMotion || !element) {
      return;
    }

    const config = {
      intensity: options.intensity || 0.5,
      frequency: options.frequency || 3000,
      duration: options.duration || 300,
      continuous: options.continuous || false,
    };

    // Store original text
    if (!element.dataset.originalText) {
      element.dataset.originalText = element.textContent;
    }

    // Store glitch configuration
    this.activeGlitches.set(element, {
      config,
      intervalId: null,
      timeoutId: null,
      isGlitching: false,
    });

    // Start glitch cycle
    this._startGlitchCycle(element);
  }

  /**
   * Set intensity for an active glitch effect
   * @param {HTMLElement} element - Target element
   * @param {number} intensity - New intensity (0-1)
   */
  setIntensity(element, intensity) {
    const glitchData = this.activeGlitches.get(element);
    if (glitchData) {
      glitchData.config.intensity = Math.max(0, Math.min(1, intensity));
    }
  }

  /**
   * Stop glitch effect on an element
   * @param {HTMLElement} element - Target element
   */
  stop(element) {
    const glitchData = this.activeGlitches.get(element);
    if (glitchData) {
      if (glitchData.intervalId) {
        clearInterval(glitchData.intervalId);
      }
      if (glitchData.timeoutId) {
        clearTimeout(glitchData.timeoutId);
      }
      
      // Restore original text
      if (element.dataset.originalText) {
        element.textContent = element.dataset.originalText;
      }
      
      // Remove text-shadow
      element.style.textShadow = '';
      
      this.activeGlitches.delete(element);
    }
  }

  /**
   * Stop all active glitch effects
   */
  stopAll() {
    this.activeGlitches.forEach((_, element) => {
      this.stop(element);
    });
  }

  /**
   * Start the glitch cycle for an element
   * @private
   */
  _startGlitchCycle(element) {
    const glitchData = this.activeGlitches.get(element);
    if (!glitchData) return;

    const { config } = glitchData;

    if (config.continuous) {
      // Continuous glitching
      this._performGlitch(element);
    } else {
      // Periodic glitching
      glitchData.intervalId = setInterval(() => {
        // Random chance to trigger glitch
        if (Math.random() > 0.7) {
          this._performGlitch(element);
        }
      }, config.frequency);
    }
  }

  /**
   * Perform a single glitch animation
   * @private
   */
  _performGlitch(element) {
    const glitchData = this.activeGlitches.get(element);
    if (!glitchData || glitchData.isGlitching) return;

    glitchData.isGlitching = true;
    const { config } = glitchData;
    const originalText = element.dataset.originalText;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      
      if (elapsed < config.duration) {
        // Apply random character replacement
        const glitchedText = this._glitchText(originalText, config.intensity);
        element.textContent = glitchedText;
        
        // Apply RGB color shift
        this._applyColorShift(element, config.intensity);
        
        // Continue animation
        requestAnimationFrame(animate);
      } else {
        // Restore original state
        element.textContent = originalText;
        element.style.textShadow = '';
        glitchData.isGlitching = false;
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * Apply random character replacement to text
   * @private
   */
  _glitchText(text, intensity) {
    return text.split('').map(char => {
      if (char === ' ') return char;
      
      // Randomly replace characters based on intensity
      if (Math.random() < intensity * 0.3) {
        return this.glitchChars[Math.floor(Math.random() * this.glitchChars.length)];
      }
      
      return char;
    }).join('');
  }

  /**
   * Apply RGB color shift effect using text-shadow
   * @private
   */
  _applyColorShift(element, intensity) {
    const offset = intensity * 3;
    const offsetX = (Math.random() - 0.5) * offset;
    const offsetY = (Math.random() - 0.5) * offset;
    
    // RGB split effect with random offsets
    const shadows = [
      `${offsetX}px ${offsetY}px 0 rgba(255, 0, 255, ${intensity * 0.8})`,
      `${-offsetX}px ${-offsetY}px 0 rgba(0, 255, 255, ${intensity * 0.8})`,
      `${offsetY}px ${-offsetX}px 0 rgba(0, 255, 135, ${intensity * 0.6})`,
    ];
    
    element.style.textShadow = shadows.join(', ');
  }

  /**
   * Destroy the glitch effects system
   */
  destroy() {
    this.stopAll();
    this.activeGlitches.clear();
  }
}

// Export as singleton
export default new GlitchEffects();
