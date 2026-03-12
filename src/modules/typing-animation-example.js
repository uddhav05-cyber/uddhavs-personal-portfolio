/**
 * Typing Animation Module - Usage Examples
 * 
 * This file demonstrates various ways to use the typing animation module
 * for terminal-style text effects in the cyberpunk portfolio.
 */

import TypingAnimation from './typing-animation.js';

// Example 1: Simple typing animation
export function simpleTypingExample() {
  const element = document.querySelector('.hero-tagline');
  
  TypingAnimation.typeText(element, 'Full-Stack Developer | Cloud Architect | DevOps Engineer', {
    speed: 50,
    variance: 30,
    cursor: true,
  });
}

// Example 2: Multiple sequences with delays
export function sequenceTypingExample() {
  const element = document.querySelector('.terminal-output');
  
  const sequences = [
    '$ whoami',
    'uddhav.bhople',
    '$ cat skills.txt',
    'Cloud Computing | Kubernetes | Docker | CI/CD',
  ];
  
  TypingAnimation.typeText(element, sequences, {
    speed: 40,
    variance: 20,
    sequenceDelay: 800,
    cursor: true,
    cursorChar: '▋',
  });
}

// Example 3: Typing with completion callback
export function typingWithCallbackExample() {
  const element = document.querySelector('.status-message');
  
  TypingAnimation.typeText(element, 'System initialized. Ready for deployment...', {
    speed: 60,
    variance: 25,
    cursor: true,
    onComplete: () => {
      console.log('Typing animation completed!');
      // Trigger next animation or action
      setTimeout(() => {
        element.classList.add('success');
      }, 500);
    },
  });
}

// Example 4: Looping animation
export function loopingTypingExample() {
  const element = document.querySelector('.rotating-text');
  
  const roles = [
    'Full-Stack Developer',
    'Cloud Architect',
    'DevOps Engineer',
    'System Designer',
  ];
  
  TypingAnimation.typeText(element, roles, {
    speed: 70,
    variance: 30,
    sequenceDelay: 2000,
    cursor: true,
    loop: true,
  });
}

// Example 5: Fast typing without cursor
export function fastTypingExample() {
  const element = document.querySelector('.quick-message');
  
  TypingAnimation.typeText(element, 'Loading portfolio data...', {
    speed: 20,
    variance: 10,
    cursor: false,
    onComplete: () => {
      element.textContent = '✓ Portfolio loaded successfully';
    },
  });
}

// Example 6: Delayed start
export function delayedTypingExample() {
  const element = document.querySelector('.delayed-text');
  
  TypingAnimation.typeText(element, 'Welcome to my portfolio', {
    speed: 50,
    variance: 20,
    delay: 1000, // Wait 1 second before starting
    cursor: true,
  });
}

// Example 7: Terminal command simulation
export function terminalCommandExample() {
  const element = document.querySelector('.terminal-window');
  
  const commands = [
    '$ cd /portfolio',
    '$ ls -la',
    'projects/  skills/  experience/  contact/',
    '$ cat README.md',
    'Building innovative solutions with modern technology.',
  ];
  
  TypingAnimation.typeText(element, commands, {
    speed: 30,
    variance: 15,
    sequenceDelay: 600,
    cursor: true,
    cursorChar: '█',
  });
}

// Example 8: Realistic typing with variable speed
export function realisticTypingExample() {
  const element = document.querySelector('.bio-text');
  
  TypingAnimation.typeText(
    element,
    'Passionate about building scalable cloud infrastructure and automating complex workflows.',
    {
      speed: 60,
      variance: 40, // Higher variance for more realistic typing
      cursor: true,
      cursorChar: '|',
    }
  );
}

// Example 9: Pause and resume
export function pauseResumeExample() {
  const element = document.querySelector('.pausable-text');
  const pauseButton = document.querySelector('.pause-button');
  const resumeButton = document.querySelector('.resume-button');
  
  TypingAnimation.typeText(element, 'This animation can be paused and resumed.', {
    speed: 50,
    variance: 20,
    cursor: true,
  });
  
  pauseButton.addEventListener('click', () => {
    TypingAnimation.pause(element);
  });
  
  resumeButton.addEventListener('click', () => {
    TypingAnimation.resume(element);
  });
}

// Example 10: Stop with completion
export function stopWithCompletionExample() {
  const element = document.querySelector('.stoppable-text');
  const skipButton = document.querySelector('.skip-button');
  
  TypingAnimation.typeText(element, 'This is a long text that can be skipped...', {
    speed: 80,
    variance: 30,
    cursor: true,
  });
  
  skipButton.addEventListener('click', () => {
    TypingAnimation.stop(element, true); // true = show complete text
  });
}

// Example 11: Hero section typing effect
export function heroSectionExample() {
  const nameElement = document.querySelector('.hero-name');
  const roleElement = document.querySelector('.hero-role');
  const bioElement = document.querySelector('.hero-bio');
  
  // Type name first
  TypingAnimation.typeText(nameElement, 'UDDHAV BHOPLE', {
    speed: 80,
    variance: 30,
    cursor: false,
    onComplete: () => {
      // Then type role
      TypingAnimation.typeText(roleElement, '> Full-Stack Developer & Cloud Architect', {
        speed: 50,
        variance: 20,
        cursor: false,
        onComplete: () => {
          // Finally type bio
          TypingAnimation.typeText(
            bioElement,
            'Building the future, one line of code at a time.',
            {
              speed: 60,
              variance: 25,
              cursor: true,
            }
          );
        },
      });
    },
  });
}

// Example 12: Multiple elements simultaneously
export function multipleElementsExample() {
  const elements = document.querySelectorAll('.typing-item');
  
  elements.forEach((element, index) => {
    const text = element.dataset.text || 'Default text';
    
    TypingAnimation.typeText(element, text, {
      speed: 50,
      variance: 20,
      delay: index * 500, // Stagger start times
      cursor: true,
    });
  });
}

// Cleanup function
export function cleanupTypingAnimations() {
  TypingAnimation.stopAll();
}

// Initialize on page load
export function initializeTypingAnimations() {
  // Check if reduced motion is preferred
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (reducedMotion) {
    console.log('Reduced motion preferred - typing animations will be instant');
  }
  
  // Initialize hero section typing
  if (document.querySelector('.hero-section')) {
    heroSectionExample();
  }
  
  // Initialize terminal window if present
  if (document.querySelector('.terminal-window')) {
    terminalCommandExample();
  }
}

// Export the typing animation instance for direct access
export { TypingAnimation };
