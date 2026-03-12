/**
 * Unit tests for Glitch Effects module
 * Tests glitch animation functionality, intensity control, and reduced motion support
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('GlitchEffects Module', () => {
  let glitchEffects;
  let element;

  beforeEach(async () => {
    // Create test element
    element = document.createElement('div');
    element.textContent = 'Test Text';
    document.body.appendChild(element);
    
    // Import module
    const module = await import('../../src/modules/glitch-effects.js');
    glitchEffects = module.default;
    
    // Reset the module state
    glitchEffects.stopAll();
    glitchEffects.reducedMotion = false;
  });

  afterEach(() => {
    if (glitchEffects) {
      glitchEffects.stopAll();
    }
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
    vi.clearAllMocks();
  });


  it('should store original text when applying glitch', () => {
    glitchEffects.applyGlitch(element);
    expect(element.dataset.originalText).toBe('Test Text');
  });

  it('should not apply glitch when reduced motion is enabled', () => {
    // Set reduced motion
    glitchEffects.reducedMotion = true;
    
    const originalText = element.textContent;
    glitchEffects.applyGlitch(element);
    
    expect(element.textContent).toBe(originalText);
    expect(element.dataset.originalText).toBeUndefined();
  });

  it('should set intensity correctly', () => {
    glitchEffects.applyGlitch(element, { intensity: 0.5 });
    glitchEffects.setIntensity(element, 0.8);
    
    const glitchData = glitchEffects.activeGlitches.get(element);
    expect(glitchData.config.intensity).toBe(0.8);
  });

  it('should clamp intensity between 0 and 1', () => {
    glitchEffects.applyGlitch(element, { intensity: 0.5 });
    
    glitchEffects.setIntensity(element, 1.5);
    let glitchData = glitchEffects.activeGlitches.get(element);
    expect(glitchData.config.intensity).toBe(1);
    
    glitchEffects.setIntensity(element, -0.5);
    glitchData = glitchEffects.activeGlitches.get(element);
    expect(glitchData.config.intensity).toBe(0);
  });

  it('should restore original text when stopped', () => {
    const originalText = element.textContent;
    glitchEffects.applyGlitch(element);
    
    // Simulate glitch changing text
    element.textContent = 'Glitched!';
    
    glitchEffects.stop(element);
    expect(element.textContent).toBe(originalText);
  });

  it('should remove text-shadow when stopped', () => {
    glitchEffects.applyGlitch(element);
    element.style.textShadow = '2px 2px 0 rgba(255, 0, 255, 0.8)';
    
    glitchEffects.stop(element);
    expect(element.style.textShadow).toBe('');
  });

  it('should stop all active glitches', () => {
    const element2 = document.createElement('div');
    element2.textContent = 'Test 2';
    document.body.appendChild(element2);
    
    glitchEffects.applyGlitch(element);
    glitchEffects.applyGlitch(element2);
    
    expect(glitchEffects.activeGlitches.size).toBe(2);
    
    glitchEffects.stopAll();
    expect(glitchEffects.activeGlitches.size).toBe(0);
  });

  it('should handle null element gracefully', () => {
    expect(() => glitchEffects.applyGlitch(null)).not.toThrow();
  });

  it('should use default options when none provided', () => {
    glitchEffects.applyGlitch(element);
    
    const glitchData = glitchEffects.activeGlitches.get(element);
    expect(glitchData.config.intensity).toBe(0.5);
    expect(glitchData.config.frequency).toBe(3000);
    expect(glitchData.config.duration).toBe(300);
    expect(glitchData.config.continuous).toBe(false);
  });

  it('should respect custom options', () => {
    glitchEffects.applyGlitch(element, {
      intensity: 0.8,
      frequency: 2000,
      duration: 500,
      continuous: true,
    });
    
    const glitchData = glitchEffects.activeGlitches.get(element);
    expect(glitchData.config.intensity).toBe(0.8);
    expect(glitchData.config.frequency).toBe(2000);
    expect(glitchData.config.duration).toBe(500);
    expect(glitchData.config.continuous).toBe(true);
  });
});
