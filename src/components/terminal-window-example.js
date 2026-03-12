/**
 * Terminal Window Component - Usage Examples
 * Demonstrates various features of the TerminalWindow component
 */

import TerminalWindow from './terminal-window.js';

// Example 1: Basic terminal with typing animation
function basicTerminalExample() {
  const container = document.getElementById('basic-terminal');
  if (!container) return;

  const terminal = new TerminalWindow(container, {
    title: 'bash',
    promptText: '$',
  });

  // Type a command with animation
  terminal.typeText('echo "Hello, World!"', { speed: 60 })
    .then(() => {
      terminal.writeLine('Hello, World!');
      return terminal.addPrompt('ls -la', true);
    })
    .then(() => {
      terminal.writeLine('drwxr-xr-x  5 user  staff   160 Jan 15 10:30 .');
      terminal.writeLine('drwxr-xr-x  8 user  staff   256 Jan 14 09:15 ..');
      terminal.writeLine('-rw-r--r--  1 user  staff  1024 Jan 15 10:30 README.md');
    });
}

// Example 2: Terminal without header
function minimalTerminalExample() {
  const container = document.getElementById('minimal-terminal');
  if (!container) return;

  const terminal = new TerminalWindow(container, {
    showHeader: false,
    promptText: '>',
  });

  terminal.typeText('npm install', { speed: 40 })
    .then(() => {
      terminal.writeLine('Installing dependencies...');
      terminal.writeLine('✓ Package installed successfully');
    });
}

// Example 3: Multiple command sequence
function commandSequenceExample() {
  const container = document.getElementById('sequence-terminal');
  if (!container) return;

  const terminal = new TerminalWindow(container, {
    title: 'Terminal',
  });

  // Execute multiple commands in sequence
  async function runCommands() {
    await terminal.typeText('cd /projects', { speed: 50 });
    terminal.writeLine('');
    
    await terminal.addPrompt('git status', true);
    terminal.writeLine('On branch main');
    terminal.writeLine('Your branch is up to date with \'origin/main\'.');
    terminal.writeLine('');
    
    await terminal.addPrompt('npm run build', true);
    terminal.writeLine('Building project...');
    terminal.writeLine('✓ Build completed in 2.3s');
  }

  runCommands();
}

// Example 4: Interactive terminal with clear
function interactiveTerminalExample() {
  const container = document.getElementById('interactive-terminal');
  if (!container) return;

  const terminal = new TerminalWindow(container, {
    title: 'Interactive Shell',
  });

  let commandHistory = [];

  // Simulate command execution
  async function executeCommand(command) {
    commandHistory.push(command);
    
    await terminal.typeText(command, { speed: 30 });
    
    // Simulate command output
    if (command === 'clear') {
      setTimeout(() => {
        terminal.clear();
      }, 500);
    } else if (command.startsWith('echo ')) {
      const text = command.substring(5);
      terminal.writeLine(text);
    } else if (command === 'date') {
      terminal.writeLine(new Date().toString());
    } else if (command === 'whoami') {
      terminal.writeLine('developer');
    } else {
      terminal.writeLine(`Command not found: ${command}`);
    }
  }

  // Demo commands
  const commands = ['whoami', 'date', 'echo "Testing terminal"', 'clear'];
  let index = 0;

  function runNextCommand() {
    if (index < commands.length) {
      executeCommand(commands[index]).then(() => {
        index++;
        setTimeout(runNextCommand, 2000);
      });
    }
  }

  runNextCommand();
}

// Example 5: Terminal with custom cursor
function customCursorExample() {
  const container = document.getElementById('cursor-terminal');
  if (!container) return;

  const terminal = new TerminalWindow(container, {
    title: 'Custom Cursor',
    promptText: '❯',
  });

  terminal.showCursor();
  
  setTimeout(() => {
    terminal.typeText('Loading system...', { 
      speed: 80,
      cursor: false // Use our custom cursor instead
    }).then(() => {
      terminal.hideCursor();
      terminal.writeLine('');
      terminal.writeLine('✓ System ready');
    });
  }, 1000);
}

// Example 6: Boot sequence simulation
function bootSequenceExample() {
  const container = document.getElementById('boot-terminal');
  if (!container) return;

  const terminal = new TerminalWindow(container, {
    title: 'System Boot',
    showPrompt: false,
  });

  const bootMessages = [
    'Initializing system...',
    'Loading kernel modules...',
    'Starting network services...',
    'Mounting file systems...',
    'Starting user services...',
    '✓ System boot complete',
  ];

  async function bootSequence() {
    for (const message of bootMessages) {
      terminal.writeLine(message);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Show prompt after boot
    terminal.updateOptions({ showPrompt: true });
    const prompt = document.createElement('span');
    prompt.className = 'terminal-prompt';
    prompt.textContent = '$ ';
    terminal.contentElement.appendChild(prompt);
    
    const text = document.createElement('span');
    text.className = 'terminal-text';
    terminal.contentElement.appendChild(text);
    terminal.textElement = text;
    
    terminal.showCursor();
  }

  bootSequence();
}

// Example 7: Code execution terminal
function codeExecutionExample() {
  const container = document.getElementById('code-terminal');
  if (!container) return;

  const terminal = new TerminalWindow(container, {
    title: 'Python 3.9.0',
    promptText: '>>>',
  });

  async function runCode() {
    await terminal.typeText('print("Hello from Python")', { speed: 40 });
    terminal.writeLine('Hello from Python');
    terminal.writeLine('');
    
    await terminal.addPrompt('x = 42', true);
    terminal.writeLine('');
    
    await terminal.addPrompt('print(f"The answer is {x}")', true);
    terminal.writeLine('The answer is 42');
  }

  runCode();
}

// Example 8: Static factory method usage
function factoryMethodExample() {
  // Create single terminal from selector
  const terminal1 = TerminalWindow.create('#factory-terminal-1', {
    title: 'Terminal 1',
  });

  if (terminal1) {
    terminal1.typeText('Created with factory method', { speed: 50 });
  }

  // Create multiple terminals from class selector
  const terminals = TerminalWindow.create('.factory-terminal-multi', {
    promptText: '>',
  });

  if (Array.isArray(terminals)) {
    terminals.forEach((terminal, index) => {
      terminal.typeText(`Terminal ${index + 1}`, { speed: 50 });
    });
  }
}

// Initialize examples when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initExamples);
} else {
  initExamples();
}

function initExamples() {
  basicTerminalExample();
  minimalTerminalExample();
  commandSequenceExample();
  interactiveTerminalExample();
  customCursorExample();
  bootSequenceExample();
  codeExecutionExample();
  factoryMethodExample();
}

export {
  basicTerminalExample,
  minimalTerminalExample,
  commandSequenceExample,
  interactiveTerminalExample,
  customCursorExample,
  bootSequenceExample,
  codeExecutionExample,
  factoryMethodExample,
};
