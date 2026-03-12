# Implementation Plan: Portfolio Rebuild

## Overview

This implementation plan breaks down the portfolio rebuild into sequential, manageable tasks. The approach follows a bottom-up strategy: establishing core infrastructure first, then building modules and components, and finally integrating everything together. Each task builds on previous work to ensure incremental progress and early validation.

## Tasks

- [ ] 1. Project setup and migration preparation
  - [x] 1.1 Initialize project structure and configuration
    - Create directory structure (src/, public/, tools/, tests/, docs/)
    - Initialize package.json with dependencies (webpack/vite, firebase, testing libraries)
    - Set up .gitignore and version control
    - Create webpack.config.js or vite.config.js for bundling
    - _Requirements: 2.1, 2.2, 2.3, 17.3_

  - [x] 1.2 Implement data migration tool
    - Create tools/migrate-data.js with extraction logic
    - Implement HTML parsing to extract projects, personal info, technologies, certificates
    - Implement image download and path transformation
    - Implement data validation against new schema
    - Generate migration report with statistics
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 1.3 Write unit tests for migration tool
    - Test data extraction accuracy
    - Test schema transformation correctness
    - Test validation logic for edge cases
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 1.4 Run migration and generate content.json
    - Execute migration tool against current portfolio
    - Review migration report for completeness
    - Validate generated content.json structure
    - Organize migrated images in src/assets/images/
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 2. Core modules implementation
  - [x] 2.1 Implement Firebase Integration module
    - Create src/modules/firebase-integration.js
    - Implement init() with Firebase SDK initialization
    - Implement database operations (writeData, readData, updateData)
    - Implement storage operations (uploadFile, getFileUrl)
    - Implement analytics operations (logEvent, logPageView)
    - Implement connection status monitoring
    - Create src/config/firebase.json for configuration
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 2.2 Write unit tests for Firebase Integration
    - Test initialization with mock Firebase SDK
    - Test database operations with mock data
    - Test error handling for connection failures
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 20.1, 20.4_

  - [x] 2.3 Implement Content Manager module
    - Create src/modules/content-manager.js
    - Implement loadContent() to load and parse content.json
    - Implement getProjects() with filtering support
    - Implement getProjectById() for individual project lookup
    - Implement getPersonalInfo(), getTechnologies(), getCareerInfo()
    - Implement validateContent() with schema validation
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]* 2.4 Write unit tests for Content Manager
    - Test content loading and parsing
    - Test filtering and lookup operations
    - Test validation with valid and invalid content
    - _Requirements: 3.1, 3.2, 3.5_

  - [x] 2.5 Implement Animation Engine module
    - Create src/modules/animation-engine.js
    - Implement init() with Intersection Observer setup
    - Implement registerElement() for animation registration
    - Implement animate() for triggering animations
    - Implement observeScrollAnimations() for scroll-based effects
    - Implement shouldReduceMotion() to check prefers-reduced-motion
    - Use requestAnimationFrame for smooth 60fps animations
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 2.6 Write unit tests for Animation Engine
    - Test Intersection Observer registration
    - Test reduced motion preference detection
    - Test animation triggering logic
    - _Requirements: 1.1, 1.2, 1.5_

  - [x] 2.7 Implement URL Router module
    - Create src/modules/router.js
    - Implement init() with route registration
    - Implement navigate() for programmatic navigation
    - Implement getCurrentRoute() for route state access
    - Implement registerRoute() for route handlers
    - Implement handlePopState() for browser back/forward
    - Implement generateShareableUrl() for deep linking
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 2.8 Write unit tests for URL Router
    - Test route registration and navigation
    - Test deep linking with URL parameters
    - Test browser history integration
    - _Requirements: 8.1, 8.2, 8.3, 8.5_

  - [x] 2.9 Implement Visitor Tracker module
    - Create src/modules/visitor-tracker.js
    - Implement init() with Firebase Integration dependency
    - Implement trackVisit() to record visit timestamps
    - Implement trackNavigation() for section navigation events
    - Implement trackInteraction() for user interactions
    - Implement getStatistics() to retrieve analytics data
    - Implement hasConsent() for privacy compliance
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 2.10 Write unit tests for Visitor Tracker
    - Test visit tracking with mock Firebase
    - Test navigation event recording
    - Test privacy consent checking
    - _Requirements: 6.1, 6.2, 6.4_

  - [x] 2.11 Implement Spotlight Search module
    - Create src/modules/spotlight-search.js
    - Implement init() with Content Manager and Firebase dependencies
    - Implement search() with fuzzy matching algorithm
    - Implement indexContent() for search indexing
    - Implement show() and hide() for UI control
    - Implement handleKeyboardShortcut() for Cmd/Ctrl+K activation
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ]* 2.12 Write unit tests for Spotlight Search
    - Test search algorithm with various queries
    - Test fuzzy matching for typo tolerance
    - Test keyboard shortcut handling
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

  - [x] 2.13 Implement Glitch Effects module
    - Create src/modules/glitch-effects.js
    - Implement applyGlitch() for random glitch animations
    - Implement setIntensity() for configurable glitch strength
    - Implement random character replacement logic
    - Add RGB color shift with text-shadow manipulation
    - Use requestAnimationFrame for smooth 60fps effects
    - Respect prefers-reduced-motion preference
    - _Requirements: 1.1, 1.2, 1.5_

  - [x] 2.14 Implement Typing Animation module
    - Create src/modules/typing-animation.js
    - Implement typeText() with character-by-character animation
    - Add variable typing speed with random delays for realism
    - Implement blinking cursor effect
    - Add callback support for animation completion
    - Support multiple typing sequences with delays
    - _Requirements: 1.1, 1.3_

  - [ ]* 2.15 Write unit tests for cyberpunk modules
    - Test glitch effect application and intensity control
    - Test typing animation timing and completion
    - Test reduced motion preference handling
    - _Requirements: 1.1, 1.2, 1.5_

- [x] 3. Checkpoint - Core modules complete
  - Ensure all core modules are implemented and tests pass
  - Verify module interfaces match design specifications
  - Ask the user if questions arise

- [ ] 4. UI components implementation
  - [x] 4.1 Implement Header component
    - Create src/components/header.js
    - Render site title and navigation toggle
    - Integrate with Animation Engine for entrance animations
    - Add responsive behavior for mobile/desktop
    - _Requirements: 1.1, 10.1, 10.2, 10.3_

  - [x] 4.2 Implement Navigation component
    - Create src/components/navigation.js
    - Render navigation menu with section links
    - Integrate with Router for navigation handling
    - Add active state highlighting for current section
    - Implement mobile menu toggle functionality
    - _Requirements: 8.1, 10.1, 10.2, 10.3, 18.2_

  - [x] 4.3 Implement Project Card component
    - Create src/components/project-card.js
    - Render project image, title, description, and technologies
    - Integrate with Animation Engine for scroll animations
    - Add hover effects and interaction feedback
    - Implement click handler for project details
    - _Requirements: 16.1, 16.2, 1.3, 1.2_

  - [x] 4.4 Implement Spotlight Search UI component
    - Create src/components/spotlight-search.js
    - Render search input and results list
    - Integrate with Spotlight Search module
    - Implement keyboard navigation (arrow keys, enter, escape)
    - Add result highlighting and click handlers
    - _Requirements: 7.1, 7.4, 7.5, 18.2_

  - [x] 4.5 Implement Social Links component
    - Create src/components/social-links.js
    - Render social media icons (WhatsApp, Instagram, LinkedIn, GitHub)
    - Add hover animations for icons
    - Implement click handlers to open profiles in new tabs
    - _Requirements: 12.1, 12.2, 12.3_

  - [x] 4.6 Implement Glitch Text component
    - Create src/components/glitch-text.js
    - Implement glitch effect with random character replacement
    - Add RGB color shift effects with text-shadow
    - Add horizontal displacement animation
    - Implement configurable intensity and frequency
    - Use requestAnimationFrame for performance optimization
    - Respect prefers-reduced-motion preference
    - _Requirements: 1.1, 1.2, 1.5_

  - [x] 4.7 Implement Terminal Window component
    - Create src/components/terminal-window.js
    - Render terminal header with colored dots (red, yellow, green)
    - Implement typing animation effect for text content
    - Add command prompt styling with $ prefix
    - Implement blinking cursor animation
    - Add clear() method for terminal content reset
    - _Requirements: 1.1, 1.3, 18.2_

  - [ ]* 4.8 Write unit tests for UI components
    - Test component rendering with mock data
    - Test event handlers and user interactions
    - Test responsive behavior at different viewport sizes
    - Test glitch and typing animations
    - _Requirements: 10.1, 10.2, 10.3, 18.2_

- [ ] 5. Cyberpunk/Terminal styling system implementation
  - [ ] 5.1 Create cyberpunk theme foundation
    - Create src/styles/theme.css with CSS custom properties
    - Define cyberpunk color palette (dark backgrounds, neon green accents, cyan/purple/pink secondaries)
    - Define typography variables (JetBrains Mono, Syne fonts)
    - Define glow effect variables and intensities
    - Define grid and spacing variables
    - _Requirements: 17.1, 17.2_

  - [ ] 5.2 Implement CRT and visual effects
    - Create src/styles/effects.css
    - Implement CRT scanlines overlay with repeating gradient
    - Implement vignette effect with radial gradient
    - Implement grid background pattern with pseudo-elements
    - Add screen flicker animation (optional, respects reduced motion)
    - _Requirements: 1.1, 1.2, 1.5_

  - [ ] 5.3 Create terminal-style elements
    - Create src/styles/terminal.css
    - Style terminal window containers with borders and shadows
    - Style terminal prompts with $ prefix
    - Style terminal dots (red, yellow, green indicators)
    - Implement blinking cursor animation
    - Style command-line interface elements
    - _Requirements: 1.1, 1.3, 17.2_

  - [ ] 5.4 Implement glitch and glow animations
    - Create src/styles/animations.css
    - Define glitch keyframe animation with text-shadow and transform
    - Define glow-on-hover effects with box-shadow transitions
    - Define typing animation with width and caret blink
    - Define status indicator blink animation
    - Define scan line sweep animation for cards
    - Implement prefers-reduced-motion overrides for all animations
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 5.5 Create two-column layout system
    - Create src/styles/layout.css
    - Implement CSS Grid two-column layout (sticky sidebar + scrollable content)
    - Define sidebar styles (350px width, sticky positioning, border)
    - Define main content area styles (max-width, padding, overflow)
    - Implement responsive breakpoint for single-column mobile layout (<1024px)
    - Add smooth scroll behavior with reduced motion support
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ] 5.6 Style cyberpunk UI components
    - Create src/styles/components.css
    - Style project cards with hover lift, glow, and scan animation
    - Style buttons with terminal aesthetic (transparent bg, border, glow on hover)
    - Style form inputs with terminal styling and focus glow
    - Style badges with rotating border gradient animation
    - Style links with underline and color shift on hover
    - Ensure crosshair cursor globally, pointer for interactive elements
    - _Requirements: 17.2, 18.3_

  - [ ] 5.7 Create responsive cyberpunk styles
    - Create src/styles/responsive.css
    - Define mobile breakpoints (max-width: 768px) with simplified effects
    - Define tablet breakpoints (768px - 1023px)
    - Define laptop breakpoints (1024px - 1199px)
    - Define desktop breakpoints (1200px+)
    - Reduce glow intensity and animation complexity on mobile
    - Adjust touch targets to minimum 44x44px
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ] 5.8 Integrate custom fonts
    - Download and add JetBrains Mono font files to src/assets/fonts/JetBrainsMono/
    - Download and add Syne font files to src/assets/fonts/Syne/
    - Create @font-face declarations in theme.css
    - Define font-display: swap for performance
    - Set up fallback font stacks (Consolas, Monaco, Courier New for mono)
    - _Requirements: 17.1, 17.2_

- [ ] 6. Main application integration
  - [ ] 6.1 Create main entry point with cyberpunk initialization
    - Create src/main.js
    - Initialize all modules (Firebase, Content Manager, Router, Animation Engine)
    - Initialize cyberpunk effects (Glitch Effects, Typing Animation)
    - Set up CRT scanlines and vignette overlays
    - Set up global event listeners
    - Implement application lifecycle (init, load, ready)
    - Apply crosshair cursor globally
    - _Requirements: 2.1, 2.2, 1.1_

  - [ ] 6.2 Create HTML structure with cyberpunk layout
    - Create public/index.html
    - Define semantic HTML5 structure with two-column grid
    - Add sticky sidebar section with personal info and navigation
    - Add scrollable main content section
    - Add CRT scanlines overlay div
    - Add grid background pattern
    - Add meta tags for SEO and social sharing (Open Graph)
    - Add ARIA landmarks for accessibility
    - Link cyberpunk stylesheets (theme.css, effects.css, terminal.css, animations.css)
    - Link custom fonts (JetBrains Mono, Syne)
    - _Requirements: 17.1, 18.1, 12.4, 12.5, 10.1_

  - [ ] 6.3 Implement hero section with glitch effects
    - Render hero name with Glitch Text component
    - Add terminal-style role/title with typing animation
    - Add blinking status indicator (online/available)
    - Integrate Animation Engine for entrance animations
    - Add glow effects on hero elements
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] 6.4 Implement section rendering with cyberpunk styling
    - Create rendering logic for home, projects, about, contact sections
    - Apply terminal-style section headers with command prompt prefix
    - Integrate Content Manager for data population
    - Integrate Animation Engine for section transitions and scroll animations
    - Integrate Router for section navigation
    - Add glow effects on section transitions
    - _Requirements: 1.4, 8.1, 8.2, 3.2, 1.2_

  - [ ] 6.5 Implement project filtering and display with card effects
    - Add filter controls styled as terminal buttons
    - Implement filter logic using Content Manager
    - Style project cards with hover lift, glow, and scan animation
    - Update URL with filter parameters using Router
    - Animate filtered results with Animation Engine (staggered fade-in)
    - _Requirements: 16.3, 8.5, 1.2, 1.3_

  - [ ] 6.6 Implement contact and personal information display
    - Render email with mailto link and glow on hover
    - Render phone with tel link
    - Render location and birthday information in terminal style
    - Add contact button with terminal styling and glow effect
    - Display social links with icon glow on hover
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [ ] 6.7 Implement technology showcase with badge styling
    - Render technology categories with terminal-style headers
    - Organize technologies into groups (Cloud, DevOps, Languages, Frameworks, Databases)
    - Display technology badges with rotating border gradient animation
    - Add technology logos with glow effect on hover
    - Add descriptions in monospace font
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ] 6.8 Implement resume/CV access with terminal styling
    - Add CV navigation link in sidebar with terminal button style
    - Implement click handler to open PDF in new tab with glow feedback
    - Upload resume PDF to Firebase Storage
    - Configure Content Manager to load resume URL from config
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [ ] 6.9 Implement error handling and resilience
    - Add try-catch blocks for Firebase operations
    - Implement retry logic for failed Firebase operations
    - Display cached content when Firebase connection fails
    - Show placeholder images for failed image loads
    - Display user-friendly error messages in terminal style
    - Add connection status indicator with blinking dot
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

- [ ] 7. Checkpoint - Cyberpunk theme and application integration complete
  - Ensure all sections render correctly with cyberpunk styling
  - Verify glitch effects, typing animations, and glow effects work properly
  - Test CRT scanlines and vignette overlays
  - Verify two-column layout and responsive behavior
  - Check navigation and routing work across all sections
  - Test error handling with simulated failures
  - Ask the user if questions arise

- [ ] 8. Accessibility and compliance
  - [ ] 8.1 Add ARIA labels and semantic HTML
    - Add ARIA labels to all interactive elements
    - Use semantic HTML5 elements (nav, main, section, article)
    - Add role attributes where needed
    - Add aria-live regions for dynamic content updates
    - Ensure terminal-style elements have proper ARIA descriptions
    - _Requirements: 18.1, 17.1_

  - [ ] 8.2 Implement keyboard navigation
    - Ensure all interactive elements are keyboard accessible
    - Implement focus management for modals and overlays
    - Add visible focus indicators with high-contrast glow
    - Test tab order for logical navigation flow
    - Add keyboard shortcuts for main sections (Cmd/Ctrl + number keys)
    - _Requirements: 18.2_

  - [ ] 8.3 Ensure color contrast and visual accessibility
    - Verify color contrast ratios meet WCAG AAA standards (7:1 for text)
    - Ensure neon green on dark background meets contrast requirements
    - Add alternative text for all images
    - Ensure icons have text alternatives or ARIA labels
    - Test with screen reader (NVDA, JAWS, or VoiceOver)
    - Verify glitch effects don't interfere with readability
    - _Requirements: 18.3, 18.4, 18.5_

  - [ ] 8.4 Implement reduced motion support
    - Disable glitch animations when prefers-reduced-motion is set
    - Remove CRT scanlines for reduced motion users
    - Simplify all transitions to instant or very brief
    - Remove typing animations and show text immediately
    - Keep static cursor instead of blinking
    - Test with prefers-reduced-motion: reduce enabled
    - _Requirements: 1.5, 18.1, 18.2_

  - [ ]* 8.5 Run accessibility audit
    - Run Lighthouse accessibility audit
    - Run axe DevTools accessibility scan
    - Fix any identified accessibility issues
    - Document accessibility compliance status
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

- [ ] 9. Performance optimization
  - [ ] 9.1 Implement lazy loading for images
    - Add loading="lazy" attribute to below-the-fold images
    - Implement Intersection Observer for progressive image loading
    - Add placeholder images or blur-up technique
    - Optimize project card images for fast loading
    - _Requirements: 11.3_

  - [ ] 9.2 Configure build optimization
    - Enable CSS minification in webpack/vite config
    - Enable JavaScript minification and tree-shaking
    - Configure code splitting for vendor bundles
    - Enable gzip/brotli compression
    - Optimize custom font loading with font-display: swap
    - _Requirements: 11.4_

  - [ ] 9.3 Optimize asset delivery and fonts
    - Compress images to WebP format with fallbacks
    - Implement responsive images with srcset
    - Preload critical fonts (JetBrains Mono, Syne)
    - Preload critical CSS (theme.css, effects.css)
    - Add resource hints (preconnect, dns-prefetch) for Firebase
    - Subset custom fonts to include only used characters
    - _Requirements: 11.1, 11.2_

  - [ ] 9.4 Optimize cyberpunk effects for performance
    - Use CSS transforms and opacity for animations (GPU acceleration)
    - Throttle glitch effect frequency to reduce CPU usage
    - Use will-change property sparingly for animated elements
    - Reduce glow effect complexity on mobile devices
    - Disable scanlines on low-end devices
    - Use requestAnimationFrame for all JavaScript animations
    - _Requirements: 1.1, 1.2, 11.5_

  - [ ]* 9.5 Run performance audit
    - Run Lighthouse performance audit
    - Measure First Contentful Paint (target: <1.5s)
    - Measure Time to Interactive (target: <3s)
    - Measure animation frame rate (target: 60fps)
    - Optimize until Lighthouse score reaches 90+
    - _Requirements: 11.1, 11.2, 11.5_

- [ ] 10. Browser compatibility and testing
  - [x] 10.1 Add browser compatibility polyfills
    - Add polyfills for Intersection Observer (if needed)
    - Add polyfills for ES6+ features for older browsers
    - Configure Babel for transpilation
    - Test graceful degradation in older browsers
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

  - [ ]* 10.2 Cross-browser testing
    - Test in Chrome (latest 2 versions)
    - Test in Firefox (latest 2 versions)
    - Test in Safari (latest 2 versions)
    - Test in Edge (latest 2 versions)
    - Document any browser-specific issues and fixes
    - _Requirements: 19.1, 19.2, 19.3, 19.4_

- [ ] 11. Deployment configuration
  - [x] 11.1 Configure Firebase Hosting
    - Create firebase.json for hosting configuration
    - Configure rewrites for single-page application routing
    - Configure headers for caching and security
    - Set up custom domain (uddhavbhople.in) in Firebase console
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 11.2 Create deployment script
    - Create build script in package.json
    - Create deploy script using Firebase CLI
    - Add pre-deploy validation (linting, tests)
    - Configure environment variables for production
    - _Requirements: 9.1, 9.5_

  - [ ] 11.3 Set up DNS and SSL
    - Configure DNS records for uddhavbhople.in
    - Verify SSL certificate provisioning
    - Test HTTPS access at https://uddhavbhople.in
    - _Requirements: 9.2, 9.3, 9.4_

  - [ ] 11.4 Create deployment documentation
    - Document build and deployment process
    - Document environment configuration
    - Document rollback procedures
    - Create troubleshooting guide
    - _Requirements: 2.4, 9.5_

- [ ] 12. Final integration and validation
  - [ ] 12.1 Create sitemap and robots.txt
    - Create public/sitemap.xml with all portfolio URLs
    - Create public/robots.txt for search engine crawlers
    - _Requirements: 12.4, 12.5_

  - [ ] 12.2 Validate HTML, CSS, and JavaScript
    - Run HTML validator on generated markup
    - Run CSS validator on stylesheets (theme.css, effects.css, terminal.css, animations.css)
    - Run ESLint on JavaScript code
    - Fix any validation errors
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

  - [ ] 12.3 End-to-end integration testing
    - Test complete user flows (landing → projects → project detail → contact)
    - Test cyberpunk effects (glitch, typing, glow, scanlines) across all sections
    - Test two-column layout and responsive breakpoints
    - Test search functionality across all content
    - Test social media links and external navigation
    - Test resume download functionality
    - Test visitor tracking and analytics recording
    - Test reduced motion preferences
    - _Requirements: 6.1, 6.2, 7.1, 7.2, 12.1, 12.2, 14.1, 14.2, 1.5_

  - [ ] 12.4 Deploy to production
    - Run final build with production configuration
    - Deploy to Firebase Hosting
    - Verify deployment at https://uddhavbhople.in
    - Verify cyberpunk theme renders correctly in production
    - Monitor Firebase Analytics for visitor data
    - _Requirements: 9.1, 9.4, 9.5, 5.5_

- [ ] 13. Final checkpoint - Production validation
  - Verify all features work in production environment
  - Check cyberpunk effects render correctly across browsers
  - Verify CRT scanlines, glitch effects, and glow animations work
  - Test two-column layout on various screen sizes
  - Check Firebase connections and data recording
  - Validate performance metrics meet requirements
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- The implementation follows a bottom-up approach: infrastructure → modules → components → integration
- All Firebase functionality is preserved and tested throughout implementation
- Cyberpunk/terminal aesthetic is implemented through modular CSS files (theme.css, effects.css, terminal.css, animations.css)
- New components (Glitch Text, Terminal Window) and modules (Glitch Effects, Typing Animation) enhance the visual experience
- Custom fonts (JetBrains Mono, Syne) are integrated for authentic terminal/cyberpunk typography
- Two-column layout with sticky sidebar provides modern, professional structure
- CRT effects (scanlines, vignette, grid background) create immersive cyberpunk atmosphere
- All animations respect prefers-reduced-motion for accessibility compliance
- Performance optimizations ensure smooth 60fps animations and fast load times
- Accessibility and performance are validated continuously, not just at the end
