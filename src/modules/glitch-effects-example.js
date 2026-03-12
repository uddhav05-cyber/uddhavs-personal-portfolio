/**
 * Glitch Effects Usage Examples
 * 
 * This file demonstrates how to use the GlitchEffects module
 * in your portfolio application.
 */

import glitchEffects from './glitch-effects.js';

// Example 1: Basic glitch effect on hero name
export function initHeroGlitch() {
  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    glitchEffects.applyGlitch(heroName, {
      intensity: 0.7,
      frequency: 4000,
      duration: 400,
    });
  }
}

// Example 2: Continuous glitch on terminal prompt
export function initTerminalGlitch() {
  const terminalPrompt = document.querySelector('.terminal-prompt');
  if (terminalPrompt) {
    glitchEffects.applyGlitch(terminalPrompt, {
      intensity: 0.3,
      duration: 200,
      continuous: true,
    });
  }
}

// Example 3: Glitch on hover
export function initHoverGlitch(selector) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      glitchEffects.applyGlitch(element, {
        intensity: 0.6,
        duration: 300,
        frequency: 500,
      });
    });
    
    element.addEventListener('mouseleave', () => {
      glitchEffects.stop(element);
    });
  });
}

// Example 4: Dynamic intensity control
export function setGlitchIntensity(element, intensity) {
  glitchEffects.setIntensity(element, intensity);
}

// Example 5: Stop all glitches (useful for cleanup)
export function stopAllGlitches() {
  glitchEffects.stopAll();
}

// Example 6: Glitch section headings
export function initSectionHeadingGlitches() {
  const headings = document.querySelectorAll('h2.section-heading');
  
  headings.forEach((heading, index) => {
    // Stagger the glitch timing for each heading
    setTimeout(() => {
      glitchEffects.applyGlitch(heading, {
        intensity: 0.5,
        frequency: 5000 + (index * 1000),
        duration: 350,
      });
    }, index * 200);
  });
}
