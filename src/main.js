/**
 * Main Application Entry Point
 * 
 * Loads styles and initializes the portfolio with the original design
 */

// Import styles (Vite will process these)
import './styles/base.css';
import './styles/analytics.css';

// Import the original portfolio script
import './portfolio-script.js';

console.log('Portfolio application loaded successfully');


// Import spotlight data loader
import '../assets/js/spotlight-data-loader.js';

console.log('Spotlight data loader initialized');
