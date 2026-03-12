/**
 * Unit Tests for Terminal Window Component
 * Tests component initialization, typing animations, and terminal operations
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import TerminalWindow from '../../src/components/terminal-window.js';
import typingAnimation from '../../src/modules/typing-animation.js';

// Mock the typing-animation module
vi.mock('../../src/modules/typing-animation.js', () => ({
  default: {
    typeText: vi.fn(),
    stop: vi.fn(),
  },
}));

describe('TerminalWindow Component', () => {
  let element;

  beforeEach(() => {
    // Create a test element
    element = document.createElement('div');
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
      const terminal = new TerminalWindow(element);
      expect(terminal).toBeInstanceOf(TerminalWindow);
      expect(terminal.element).toBe(element);
    });

    it('should create instance with selector', () => {
      element.id = 'test-terminal';
      const terminal = new TerminalWindow('#test-terminal');
      expect(terminal).toBeInstanceOf(TerminalWindow);
      expect(terminal.element).toBe(element);
    });

    it('should throw error with invalid selector', () => {
      expect(() => new TerminalWindow('#non-existent')).toThrow('Element not found');
    });

    it('should throw error with invalid element', () => {
      expect(() => new TerminalWindow(null)).toThrow('requires a valid element');
    });

    it('should auto-initialize by default', () => {
      const terminal = new TerminalWindow(element);
      expect(terminal.isInitialized).toBe(true);
      expect(element.classList.contains('terminal-window')).toBe(true);
    });

    it('should not auto-initialize when autoInit is false', () => {
      const terminal = new TerminalWindow(element, { autoInit: false });
      expect(terminal.isInitialized).toBe(false);
      expect(element.classList.contains('terminal-window')).toBe(false);
    });

    it('should use default options', () => {
      const terminal = new TerminalWindow(element);
      expect(terminal.options.showHeader).toBe(true);
      expect(terminal.options.showPrompt).toBe(true);
      expect(terminal.options.promptText).toBe('$');
      expect(terminal.options.title).toBe('');
    });

    it('should accept custom options', () => {
      const terminal = new TerminalWindow(element, {
        showHeader: false,
        showPrompt: false,
        promptText: '>',
        title: 'Test Terminal',
      });
      expect(terminal.options.showHeader).toBe(false);
      expect(terminal.options.showPrompt).toBe(false);
      expect(terminal.options.promptText).toBe('>');
      expect(terminal.options.title).toBe('Test Terminal');
    });
  });

  describe('Header Creation', () => {
    it('should create header with colored dots', () => {
      const terminal = new TerminalWindow(element);
      const header = element.querySelector('.terminal-header');
      expect(header).toBeTruthy();

      const dots = header.querySelectorAll('.terminal-dot');
      expect(dots.length).toBe(3);
      expect(dots[0].classList.contains('terminal-dot-red')).toBe(true);
      expect(dots[1].classList.contains('terminal-dot-yellow')).toBe(true);
      expect(dots[2].classList.contains('terminal-dot-green')).toBe(true);
    });

    it('should not create header when showHeader is false', () => {
      const terminal = new TerminalWindow(element, { showHeader: false });
      const header = element.querySelector('.terminal-header');
      expect(header).toBeNull();
    });

    it('should add title to header when provided', () => {
      const terminal = new TerminalWindow(element, { title: 'My Terminal' });
      const title = element.querySelector('.terminal-title');
      expect(title).toBeTruthy();
      expect(title.textContent).toBe('My Terminal');
    });

    it('should not add title when not provided', () => {
      const terminal = new TerminalWindow(element);
      const title = element.querySelector('.terminal-title');
      expect(title).toBeNull();
    });
  });

  describe('Content Creation', () => {
    it('should create content area', () => {
      const terminal = new TerminalWindow(element);
      const content = element.querySelector('.terminal-content');
      expect(content).toBeTruthy();
      expect(content.getAttribute('role')).toBe('log');
      expect(content.getAttribute('aria-live')).toBe('polite');
    });

    it('should create prompt when showPrompt is true', () => {
      const terminal = new TerminalWindow(element);
      const prompt = element.querySelector('.terminal-prompt');
      expect(prompt).toBeTruthy();
      expect(prompt.textContent).toBe('$ ');
    });

    it('should not create prompt when showPrompt is false', () => {
      const terminal = new TerminalWindow(element, { showPrompt: false });
      const prompt = element.querySelector('.terminal-prompt');
      expect(prompt).toBeNull();
    });

    it('should create text container', () => {
      const terminal = new TerminalWindow(element);
      const text = element.querySelector('.terminal-text');
      expect(text).toBeTruthy();
    });
  });

  describe('Type Text', () => {
    it('should call typing animation with text', async () => {
      const terminal = new TerminalWindow(element);
      typingAnimation.typeText.mockImplementation((el, text, opts) => {
        if (opts.onComplete) opts.onComplete();
      });

      await terminal.typeText('Hello World');
      expect(typingAnimation.typeText).toHaveBeenCalledWith(
        terminal.textElement,
        'Hello World',
        expect.objectContaining({
          speed: 50,
          variance: 30,
          cursor: true,
          clearBefore: false,
        })
      );
    });

    it('should accept custom typing options', async () => {
      const terminal = new TerminalWindow(element);
      typingAnimation.typeText.mockImplementation((el, text, opts) => {
        if (opts.onComplete) opts.onComplete();
      });

      await terminal.typeText('Test', { speed: 100, variance: 50, cursor: false });
      expect(typingAnimation.typeText).toHaveBeenCalledWith(
        terminal.textElement,
        'Test',
        expect.objectContaining({
          speed: 100,
          variance: 50,
          cursor: false,
        })
      );
    });

    it('should throw error if not initialized', () => {
      const terminal = new TerminalWindow(element, { autoInit: false });
      expect(() => terminal.typeText('Test')).toThrow('Must call init()');
    });

    it('should call onComplete callback', async () => {
      const terminal = new TerminalWindow(element);
      const onComplete = vi.fn();
      typingAnimation.typeText.mockImplementation((el, text, opts) => {
        if (opts.onComplete) opts.onComplete();
      });

      await terminal.typeText('Test', { onComplete });
      expect(onComplete).toHaveBeenCalled();
    });
  });

  describe('Add Prompt', () => {
    it('should add command prompt without animation', async () => {
      const terminal = new TerminalWindow(element);
      await terminal.addPrompt('ls -la', false);
      expect(terminal.textElement.textContent).toBe('ls -la');
    });

    it('should add command prompt with animation', async () => {
      const terminal = new TerminalWindow(element);
      typingAnimation.typeText.mockImplementation((el, text, opts) => {
        if (opts.onComplete) opts.onComplete();
      });

      await terminal.addPrompt('cd /home', true);
      expect(typingAnimation.typeText).toHaveBeenCalledWith(
        terminal.textElement,
        'cd /home',
        expect.any(Object)
      );
    });

    it('should create new line for subsequent prompts', async () => {
      const terminal = new TerminalWindow(element);
      terminal.textElement.textContent = 'first command';
      
      await terminal.addPrompt('second command', false);
      
      const prompts = element.querySelectorAll('.terminal-prompt');
      expect(prompts.length).toBe(2);
    });

    it('should throw error if not initialized', () => {
      const terminal = new TerminalWindow(element, { autoInit: false });
      expect(() => terminal.addPrompt('test')).toThrow('Must call init()');
    });
  });

  describe('Write Methods', () => {
    it('should write text directly', () => {
      const terminal = new TerminalWindow(element);
      terminal.write('Hello');
      terminal.write(' World');
      expect(terminal.textElement.textContent).toBe('Hello World');
    });

    it('should write line of text', () => {
      const terminal = new TerminalWindow(element);
      terminal.writeLine('Line 1');
      terminal.writeLine('Line 2');
      
      const lines = element.querySelectorAll('.terminal-line');
      expect(lines.length).toBe(2);
      expect(lines[0].textContent).toBe('Line 1');
      expect(lines[1].textContent).toBe('Line 2');
    });

    it('should throw error if not initialized', () => {
      const terminal = new TerminalWindow(element, { autoInit: false });
      expect(() => terminal.write('test')).toThrow('Must call init()');
      expect(() => terminal.writeLine('test')).toThrow('Must call init()');
    });
  });

  describe('Clear', () => {
    it('should clear terminal content', () => {
      const terminal = new TerminalWindow(element);
      terminal.write('Some text');
      terminal.clear();
      
      expect(terminal.textElement.textContent).toBe('');
      expect(typingAnimation.stop).toHaveBeenCalled();
    });

    it('should keep prompt by default', () => {
      const terminal = new TerminalWindow(element);
      terminal.write('Some text');
      terminal.clear();
      
      const prompt = element.querySelector('.terminal-prompt');
      expect(prompt).toBeTruthy();
    });

    it('should remove prompt when keepPrompt is false', () => {
      const terminal = new TerminalWindow(element);
      terminal.write('Some text');
      terminal.clear(false);
      
      const prompt = element.querySelector('.terminal-prompt');
      expect(prompt).toBeNull();
    });

    it('should throw error if not initialized', () => {
      const terminal = new TerminalWindow(element, { autoInit: false });
      expect(() => terminal.clear()).toThrow('Must call init()');
    });
  });

  describe('Cursor Methods', () => {
    it('should show cursor', () => {
      const terminal = new TerminalWindow(element);
      terminal.showCursor();
      
      const cursor = terminal.textElement.querySelector('.terminal-cursor');
      expect(cursor).toBeTruthy();
      expect(cursor.textContent).toBe('▋');
    });

    it('should not add duplicate cursor', () => {
      const terminal = new TerminalWindow(element);
      terminal.showCursor();
      terminal.showCursor();
      
      const cursors = terminal.textElement.querySelectorAll('.terminal-cursor');
      expect(cursors.length).toBe(1);
    });

    it('should hide cursor', () => {
      const terminal = new TerminalWindow(element);
      terminal.showCursor();
      terminal.hideCursor();
      
      const cursor = terminal.textElement.querySelector('.terminal-cursor');
      expect(cursor).toBeNull();
    });

    it('should throw error if not initialized', () => {
      const terminal = new TerminalWindow(element, { autoInit: false });
      expect(() => terminal.showCursor()).toThrow('Must call init()');
    });
  });

  describe('Update Options', () => {
    it('should update prompt text', () => {
      const terminal = new TerminalWindow(element);
      terminal.updateOptions({ promptText: '>' });
      
      expect(terminal.options.promptText).toBe('>');
      expect(terminal.promptElement.textContent).toBe('> ');
    });

    it('should update title', () => {
      const terminal = new TerminalWindow(element, { title: 'Old Title' });
      terminal.updateOptions({ title: 'New Title' });
      
      const title = element.querySelector('.terminal-title');
      expect(title.textContent).toBe('New Title');
    });

    it('should add title if not present', () => {
      const terminal = new TerminalWindow(element);
      terminal.updateOptions({ title: 'New Title' });
      
      const title = element.querySelector('.terminal-title');
      expect(title).toBeTruthy();
      expect(title.textContent).toBe('New Title');
    });
  });

  describe('Destroy', () => {
    it('should clean up on destroy', () => {
      const terminal = new TerminalWindow(element);
      terminal.destroy();
      
      expect(typingAnimation.stop).toHaveBeenCalled();
      expect(element.innerHTML).toBe('');
      expect(element.classList.contains('terminal-window')).toBe(false);
      expect(terminal.element).toBeNull();
      expect(terminal.isInitialized).toBe(false);
    });

    it('should handle destroy when not initialized', () => {
      const terminal = new TerminalWindow(element, { autoInit: false });
      expect(() => terminal.destroy()).not.toThrow();
    });
  });

  describe('Static Factory Method', () => {
    it('should create instance from element', () => {
      const terminal = TerminalWindow.create(element);
      expect(terminal).toBeInstanceOf(TerminalWindow);
    });

    it('should create single instance from selector with one match', () => {
      element.className = 'test-terminal';
      const terminal = TerminalWindow.create('.test-terminal');
      expect(terminal).toBeInstanceOf(TerminalWindow);
    });

    it('should create array of instances from selector with multiple matches', () => {
      const el1 = document.createElement('div');
      const el2 = document.createElement('div');
      el1.className = 'multi-terminal';
      el2.className = 'multi-terminal';
      document.body.appendChild(el1);
      document.body.appendChild(el2);

      const terminals = TerminalWindow.create('.multi-terminal');
      expect(Array.isArray(terminals)).toBe(true);
      expect(terminals.length).toBe(2);
      expect(terminals[0]).toBeInstanceOf(TerminalWindow);
      expect(terminals[1]).toBeInstanceOf(TerminalWindow);

      document.body.removeChild(el1);
      document.body.removeChild(el2);
    });

    it('should return null for selector with no matches', () => {
      const terminal = TerminalWindow.create('.non-existent');
      expect(terminal).toBeNull();
    });

    it('should pass options to created instances', () => {
      element.className = 'test-terminal';
      const terminal = TerminalWindow.create('.test-terminal', { promptText: '>' });
      expect(terminal.options.promptText).toBe('>');
    });
  });
});
