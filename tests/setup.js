/**
 * Vitest setup file
 * Configures test environment and global mocks
 */

import { vi } from 'vitest';

// Mock matchMedia for all tests
global.matchMedia = global.matchMedia || function(query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
};

// Mock requestAnimationFrame
global.requestAnimationFrame = global.requestAnimationFrame || function(callback) {
  return setTimeout(callback, 16);
};

// Mock cancelAnimationFrame
global.cancelAnimationFrame = global.cancelAnimationFrame || function(id) {
  clearTimeout(id);
};

// Mock performance.now
global.performance = global.performance || {
  now: () => Date.now(),
};
