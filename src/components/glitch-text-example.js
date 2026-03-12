/**
 * Glitch Text Component - Usage Examples
 * Demonstrates various ways to use the GlitchText component
 */

import GlitchText from './glitch-text.js';

// Example 1: Basic usage with default options
const heroName = document.querySelector('.hero-name');
const glitchHero = new GlitchText(heroName);

// Example 2: Custom intensity and frequency
const heading = document.querySelector('.section-heading');
const glitchHeading = new GlitchText(heading, {
  intensity: 0.7,
  frequency: 2000,
  duration: 400,
});

// Example 3: Continuous glitch effect
const terminalPrompt = document.querySelector('.terminal-prompt');
const glitchPrompt = new GlitchText(terminalPrompt, {
  intensity: 0.3,
  continuous: true,
  duration: 200,
});

// Example 4: Using static factory method with selector
const glitchTitles = GlitchText.create('.glitch-title', {
  intensity: 0.5,
  frequency: 3000,
});

// Example 5: Manual control (no auto-start)
const manualGlitch = new GlitchText(document.querySelector('.manual'), {
  autoStart: false,
  intensity: 0.8,
});

// Start on hover
document.querySelector('.manual').addEventListener('mouseenter', () => {
  manualGlitch.start();
});

document.querySelector('.manual').addEventListener('mouseleave', () => {
  manualGlitch.stop();
});

// Example 6: Dynamic intensity control
const dynamicGlitch = new GlitchText(document.querySelector('.dynamic'));

// Increase intensity on scroll
window.addEventListener('scroll', () => {
  const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  dynamicGlitch.setIntensity(scrollPercent);
});

// Example 7: Trigger single glitch on click
const clickGlitch = new GlitchText(document.querySelector('.click-glitch'), {
  autoStart: false,
});

document.querySelector('.click-glitch').addEventListener('click', () => {
  clickGlitch.triggerGlitch();
});

export { glitchHero, glitchHeading, glitchPrompt };
