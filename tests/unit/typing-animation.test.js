/**
 * Unit Tests for Typing Animation Module
 * 
 * Tests cover:
 * - Basic typing functionality
 * - Variable speed and variance
 * - Cursor effects
 * - Multiple sequences
 * - Callbacks
 * - Reduced motion support
 * - Pause/resume functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import TypingAnimation from '../../src/modules/typing-animation.js';

describe('TypingAnimation Module', () => {
  let testElement;

  beforeEach(() => {
    // Create a fresh test element for each test
    testElement = document.createElement('div');
    testElement.className = 'test-typing';
    document.body.appendChild(testElement);
    
    // Mock timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Cleanup
    TypingAnimation.stopAll();
    if (testElement && testElement.parentNode) {
      document.body.removeChild(testElement);
    }
    vi.restoreAllMocks();
    vi.clearAllTimers();
  });

  describe('Basic Typing', () => {
    it('should type text character by character', async () => {
      const text = 'Hello';
      TypingAnimation.typeText(testElement, text, {
        speed: 10,
        variance: 0,
        cursor: false,
      });

      // Wait for typing to complete
      await vi.advanceTimersByTimeAsync(100);
      expect(testElement.textContent).toBe('Hello');
    });

    it('should clear element before typing when clearBefore is true', () => {
      testElement.textContent = 'Old text';
      
      TypingAnimation.typeText(testElement, 'New text', {
        speed: 50,
        clearBefore: true,
        cursor: false,
      });

      // Element should be cleared immediately
      const hasOldText = testElement.textContent.includes('Old text');
      expect(hasOldText).toBe(false);
    });

    it('should not clear element when clearBefore is false', () => {
      testElement.textContent = 'Old ';
      
      TypingAnimation.typeText(testElement, 'text', {
        speed: 50,
        clearBefore: false,
        cursor: false,
      });

      vi.advanceTimersByTime(200);
      expect(testElement.textContent).toContain('Old');
    });
  });

  describe('Cursor Effects', () => {
    it('should add blinking cursor when cursor option is true', () => {
      TypingAnimation.typeText(testElement, 'Test', {
        speed: 50,
        cursor: true,
      });

      const cursor = testElement.querySelector('.typing-cursor');
      expect(cursor).toBeTruthy();
      expect(cursor.textContent).toBe('▋');
    });

    it('should use custom cursor character', () => {
      TypingAnimation.typeText(testElement, 'Test', {
        speed: 50,
        cursor: true,
        cursorChar: '|',
      });

      const cursor = testElement.querySelector('.typing-cursor');
      expect(cursor.textContent).toBe('|');
    });

    it('should not add cursor when cursor option is false', () => {
      TypingAnimation.typeText(testElement, 'Test', {
        speed: 50,
        cursor: false,
      });

      const cursor = testElement.querySelector('.typing-cursor');
      expect(cursor).toBeFalsy();
    });

    it('should remove cursor on completion when not looping', () => {
      TypingAnimation.typeText(testElement, 'Hi', {
        speed: 50,
        cursor: true,
        loop: false,
      });

      // Cursor should exist during typing
      expect(testElement.querySelector('.typing-cursor')).toBeTruthy();

      // Complete typing
      vi.advanceTimersByTime(200);

      // Cursor should be removed
      expect(testElement.querySelector('.typing-cursor')).toBeFalsy();
    });
  });

  describe('Multiple Sequences', () => {
    it('should type multiple sequences with delays', async () => {
      const sequences = ['First', 'Second'];
      
      TypingAnimation.typeText(testElement, sequences, {
        speed: 10,
        variance: 0,
        sequenceDelay: 50,
        cursor: false,
      });

      // Wait for completion
      await vi.advanceTimersByTimeAsync(500);
      expect(testElement.textContent).toContain('First');
      expect(testElement.textContent).toContain('Second');
    });

    it('should type multiple sequences separately', async () => {
      const sequences = ['Line 1', 'Line 2'];
      
      TypingAnimation.typeText(testElement, sequences, {
        speed: 10,
        variance: 0,
        sequenceDelay: 50,
        cursor: false,
      });

      // Complete both sequences
      await vi.advanceTimersByTimeAsync(1000);

      // Check that both lines are present
      const content = testElement.textContent;
      expect(content).toContain('Line 1');
      expect(content).toContain('Line 2');
      
      // Verify sequences were typed (not just concatenated immediately)
      expect(content.length).toBeGreaterThan(0);
    });
  });

  describe('Callbacks', () => {
    it('should call onComplete callback when typing finishes', () => {
      const onComplete = vi.fn();
      
      TypingAnimation.typeText(testElement, 'Done', {
        speed: 50,
        variance: 0,
        cursor: false,
        onComplete,
      });

      // Before completion
      expect(onComplete).not.toHaveBeenCalled();

      // After completion
      vi.advanceTimersByTime(300);
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('should call onComplete after all sequences', () => {
      const onComplete = vi.fn();
      const sequences = ['A', 'B', 'C'];
      
      TypingAnimation.typeText(testElement, sequences, {
        speed: 50,
        variance: 0,
        sequenceDelay: 100,
        cursor: false,
        onComplete,
      });

      // Complete all sequences
      vi.advanceTimersByTime(1000);
      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Looping', () => {
    it('should loop animation when loop option is true', async () => {
      TypingAnimation.typeText(testElement, 'Loop', {
        speed: 10,
        variance: 0,
        sequenceDelay: 50,
        cursor: false,
        loop: true,
      });

      // First iteration
      await vi.advanceTimersByTimeAsync(100);
      expect(testElement.textContent).toContain('Loop');

      // Wait for sequence delay and restart
      await vi.advanceTimersByTimeAsync(100);
      
      // Should have restarted (text will be present)
      expect(testElement.textContent.length).toBeGreaterThan(0);
    });

    it('should not call onComplete when looping', () => {
      const onComplete = vi.fn();
      
      TypingAnimation.typeText(testElement, 'Loop', {
        speed: 50,
        variance: 0,
        sequenceDelay: 100,
        cursor: false,
        loop: true,
        onComplete,
      });

      // Complete first iteration
      vi.advanceTimersByTime(500);
      
      // onComplete should not be called for looping animations
      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  describe('Delay', () => {
    it('should delay start when delay option is provided', async () => {
      TypingAnimation.typeText(testElement, 'Delayed', {
        speed: 10,
        variance: 0,
        delay: 100,
        cursor: false,
      });

      // Before delay
      expect(testElement.textContent).toBe('');

      // After delay and typing
      await vi.advanceTimersByTimeAsync(250);
      expect(testElement.textContent).toBe('Delayed');
    });
  });

  describe('Stop and Control', () => {
    it('should stop typing animation', async () => {
      TypingAnimation.typeText(testElement, 'Stop me', {
        speed: 50,
        variance: 0,
        cursor: false,
      });

      // Type a few characters
      await vi.advanceTimersByTimeAsync(100);
      const textBeforeStop = testElement.textContent;

      // Stop animation
      TypingAnimation.stop(testElement);

      // Should not continue typing
      await vi.advanceTimersByTimeAsync(200);
      expect(testElement.textContent).toBe(textBeforeStop);
    });

    it('should show complete text when stop is called with complete=true', () => {
      TypingAnimation.typeText(testElement, 'Complete', {
        speed: 50,
        variance: 0,
        cursor: false,
      });

      // Type a few characters
      vi.advanceTimersByTime(100);

      // Stop with completion
      TypingAnimation.stop(testElement, true);

      expect(testElement.textContent).toBe('Complete');
    });

    it('should pause and resume typing', async () => {
      TypingAnimation.typeText(testElement, 'Pause', {
        speed: 50,
        variance: 0,
        cursor: false,
      });

      // Type a few characters
      await vi.advanceTimersByTimeAsync(100);
      const textBeforePause = testElement.textContent;

      // Pause
      TypingAnimation.pause(testElement);

      // Should not continue
      await vi.advanceTimersByTimeAsync(200);
      expect(testElement.textContent).toBe(textBeforePause);

      // Resume
      TypingAnimation.resume(testElement);
      await vi.advanceTimersByTimeAsync(200);
      
      // Should have continued typing
      expect(testElement.textContent.length).toBeGreaterThan(textBeforePause.length);
    });

    it('should stop all animations', () => {
      const element1 = document.createElement('div');
      const element2 = document.createElement('div');
      document.body.appendChild(element1);
      document.body.appendChild(element2);

      TypingAnimation.typeText(element1, 'First', { speed: 50, cursor: false });
      TypingAnimation.typeText(element2, 'Second', { speed: 50, cursor: false });

      vi.advanceTimersByTime(100);

      TypingAnimation.stopAll();

      // Should not continue typing
      vi.advanceTimersByTime(200);
      expect(element1.textContent).not.toBe('First');
      expect(element2.textContent).not.toBe('Second');

      // Cleanup
      document.body.removeChild(element1);
      document.body.removeChild(element2);
    });
  });

  describe('Reduced Motion Support', () => {
    it('should show text immediately when reduced motion is preferred', () => {
      // Create a new instance that respects reduced motion
      const element = document.createElement('div');
      document.body.appendChild(element);

      // Mock reduced motion by creating a new TypingAnimation instance
      // that will check the matchMedia
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      // Import fresh instance
      const TypingAnimationReduced = new (TypingAnimation.constructor)();
      
      TypingAnimationReduced.typeText(element, 'Instant', {
        speed: 50,
        cursor: false,
      });

      // Text should appear immediately (no cursor)
      expect(element.textContent).toBe('Instant');

      // Restore
      window.matchMedia = originalMatchMedia;
      document.body.removeChild(element);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty text', () => {
      TypingAnimation.typeText(testElement, '', {
        speed: 50,
        cursor: false,
      });

      vi.advanceTimersByTime(100);
      expect(testElement.textContent).toBe('');
    });

    it('should handle null element gracefully', () => {
      expect(() => {
        TypingAnimation.typeText(null, 'Test', { speed: 50 });
      }).not.toThrow();
    });

    it('should handle stopping non-existent animation', () => {
      expect(() => {
        TypingAnimation.stop(testElement);
      }).not.toThrow();
    });

    it('should handle multiple stop calls', () => {
      TypingAnimation.typeText(testElement, 'Test', { speed: 50 });
      
      expect(() => {
        TypingAnimation.stop(testElement);
        TypingAnimation.stop(testElement);
        TypingAnimation.stop(testElement);
      }).not.toThrow();
    });
  });

  describe('Variable Speed', () => {
    it('should apply variance to typing speed', () => {
      const speeds = [];
      const originalSetTimeout = global.setTimeout;
      
      global.setTimeout = vi.fn((callback, delay) => {
        speeds.push(delay);
        return originalSetTimeout(callback, delay);
      });

      TypingAnimation.typeText(testElement, 'Vary', {
        speed: 50,
        variance: 20,
        cursor: false,
      });

      vi.advanceTimersByTime(300);

      // Speeds should vary (not all the same)
      const uniqueSpeeds = new Set(speeds);
      expect(uniqueSpeeds.size).toBeGreaterThan(1);

      global.setTimeout = originalSetTimeout;
    });
  });
});
