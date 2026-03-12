/**
 * Unit Tests for Glitch Text Component
 * Tests component initialization, configuration, and lifecycle
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import GlitchText from '../../src/components/glitch-text.js';
import glitchEffects from '../../src/modules/glitch-effects.js';

// Mock the glitch-effects module
vi.mock('../../src/modules/glitch-effects.js', () => ({
  default: {
    applyGlitch: vi.fn(),
    stop: vi.fn(),
    setIntensity: vi.fn(),
  },
}));

describe('GlitchText Component', () => {
  let element;

  beforeEach(() => {
    // Create a test element
    element = document.createElement('div');
    element.textContent = 'Test Text';
    document.body.appendChild(element);

    // Clear mock calls
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });

  describe('Initialization', () => {
    it('should create instance with valid element', () => {
      const glitch = new GlitchText(element);
      expect(glitch).toBeInstanceOf(GlitchText);
      expect(glitch.element).toBe(element);
    });

    it('should throw error with invalid element', () => {
      expect(() => new GlitchText(null)).toThrow('GlitchText requires a valid element');
    });

    it('should add glitch-text class to element', () => {
      new GlitchText(element);
      expect(element.classList.contains('glitch-text')).toBe(true);
    });

    it('should auto-start by default', () => {
      new GlitchText(element);
      expect(glitchEffects.applyGlitch).toHaveBeenCalledWith(element, expect.any(Object));
    });

    it('should not auto-start when autoStart is false', () => {
      new GlitchText(element, { autoStart: false });
      expect(glitchEffects.applyGlitch).not.toHaveBeenCalled();
    });

    it('should use default options', () => {
      const glitch = new GlitchText(element);
      expect(glitch.options.intensity).toBe(0.5);
      expect(glitch.options.frequency).toBe(3000);
      expect(glitch.options.duration).toBe(300);
      expect(glitch.options.continuous).toBe(false);
    });

    it('should accept custom options', () => {
      const glitch = new GlitchText(element, {
        intensity: 0.8,
        frequency: 2000,
        duration: 500,
        continuous: true,
      });
      expect(glitch.options.intensity).toBe(0.8);
      expect(glitch.options.frequency).toBe(2000);
      expect(glitch.options.duration).toBe(500);
      expect(glitch.options.continuous).toBe(true);
    });
  });

  describe('Start and Stop', () => {
    it('should start glitch effect', () => {
      const glitch = new GlitchText(element, { autoStart: false });
      glitch.start();
      expect(glitchEffects.applyGlitch).toHaveBeenCalledWith(element, {
        intensity: 0.5,
        frequency: 3000,
        duration: 300,
        continuous: false,
      });
      expect(glitch.isActive).toBe(true);
    });

    it('should not start if already active', () => {
      const glitch = new GlitchText(element);
      vi.clearAllMocks();
      glitch.start();
      expect(glitchEffects.applyGlitch).not.toHaveBeenCalled();
    });

    it('should stop glitch effect', () => {
      const glitch = new GlitchText(element);
      glitch.stop();
      expect(glitchEffects.stop).toHaveBeenCalledWith(element);
      expect(glitch.isActive).toBe(false);
    });

    it('should not stop if not active', () => {
      const glitch = new GlitchText(element, { autoStart: false });
      glitch.stop();
      expect(glitchEffects.stop).not.toHaveBeenCalled();
    });
  });

  describe('Configuration', () => {
    it('should set intensity', () => {
      const glitch = new GlitchText(element);
      glitch.setIntensity(0.7);
      expect(glitch.options.intensity).toBe(0.7);
      expect(glitchEffects.setIntensity).toHaveBeenCalledWith(element, 0.7);
    });

    it('should clamp intensity between 0 and 1', () => {
      const glitch = new GlitchText(element);
      glitch.setIntensity(1.5);
      expect(glitch.options.intensity).toBe(1);
      glitch.setIntensity(-0.5);
      expect(glitch.options.intensity).toBe(0);
    });

    it('should set frequency and restart if active', () => {
      const glitch = new GlitchText(element);
      vi.clearAllMocks();
      glitch.setFrequency(2000);
      expect(glitch.options.frequency).toBe(2000);
      expect(glitchEffects.stop).toHaveBeenCalled();
      expect(glitchEffects.applyGlitch).toHaveBeenCalled();
    });

    it('should update multiple options', () => {
      const glitch = new GlitchText(element);
      vi.clearAllMocks();
      glitch.updateOptions({
        intensity: 0.9,
        frequency: 1500,
        duration: 400,
      });
      expect(glitch.options.intensity).toBe(0.9);
      expect(glitch.options.frequency).toBe(1500);
      expect(glitch.options.duration).toBe(400);
      expect(glitchEffects.stop).toHaveBeenCalled();
      expect(glitchEffects.applyGlitch).toHaveBeenCalled();
    });
  });

  describe('Trigger Single Glitch', () => {
    it('should trigger single glitch when not active', () => {
      vi.useFakeTimers();
      const glitch = new GlitchText(element, { autoStart: false });
      glitch.triggerGlitch();
      expect(glitchEffects.applyGlitch).toHaveBeenCalledWith(element, {
        intensity: 0.5,
        frequency: 0,
        duration: 300,
        continuous: false,
      });
      vi.advanceTimersByTime(400);
      expect(glitchEffects.stop).toHaveBeenCalledWith(element);
      vi.useRealTimers();
    });
  });

  describe('Destroy', () => {
    it('should clean up on destroy', () => {
      const glitch = new GlitchText(element);
      glitch.destroy();
      expect(glitchEffects.stop).toHaveBeenCalledWith(element);
      expect(element.classList.contains('glitch-text')).toBe(false);
      expect(glitch.element).toBeNull();
    });
  });

  describe('Static Factory Method', () => {
    it('should create instance from element', () => {
      const glitch = GlitchText.create(element);
      expect(glitch).toBeInstanceOf(GlitchText);
    });

    it('should create single instance from selector with one match', () => {
      element.className = 'test-glitch';
      const glitch = GlitchText.create('.test-glitch');
      expect(glitch).toBeInstanceOf(GlitchText);
    });

    it('should create array of instances from selector with multiple matches', () => {
      const el1 = document.createElement('div');
      const el2 = document.createElement('div');
      el1.className = 'multi-glitch';
      el2.className = 'multi-glitch';
      document.body.appendChild(el1);
      document.body.appendChild(el2);

      const glitches = GlitchText.create('.multi-glitch');
      expect(Array.isArray(glitches)).toBe(true);
      expect(glitches.length).toBe(2);
      expect(glitches[0]).toBeInstanceOf(GlitchText);
      expect(glitches[1]).toBeInstanceOf(GlitchText);

      document.body.removeChild(el1);
      document.body.removeChild(el2);
    });

    it('should return null for selector with no matches', () => {
      const glitch = GlitchText.create('.non-existent');
      expect(glitch).toBeNull();
    });
  });
});
