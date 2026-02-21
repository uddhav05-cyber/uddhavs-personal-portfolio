# Portfolio Rebuild

Modern portfolio website for uddhavbhople.in with professional animations and Firebase integration.

## Directory Structure

```
portfolio-rebuild/
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   ├── modules/            # Feature modules
│   ├── styles/             # CSS stylesheets
│   ├── assets/             # Static assets (images, icons, fonts)
│   ├── config/             # Configuration files
│   ├── utils/              # Utility functions
│   └── main.js             # Application entry point
├── public/                 # Public assets
├── tools/                  # Build and migration tools
├── tests/                  # Test files
│   ├── unit/               # Unit tests
│   └── integration/        # Integration tests
└── docs/                   # Documentation
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Testing

```bash
npm test
```

## Deployment

### Quick Deploy

```bash
npm run deploy
```

This builds the project and deploys to Firebase Hosting.

### Documentation

- **[Deployment Quick Start](./deployment-quick-start.md)** - Quick reference for deployment
- **[Firebase Hosting Setup](./firebase-hosting-setup.md)** - Complete hosting configuration guide
- **[Custom Domain Setup](./custom-domain-setup-instructions.md)** - Step-by-step domain configuration

### Prerequisites

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Update `.firebaserc` with your Firebase project ID
4. Update `src/config/firebase.json` with your Firebase credentials

### Custom Domain

The portfolio is configured for deployment to `uddhavbhople.in`. See [Custom Domain Setup Instructions](./custom-domain-setup-instructions.md) for detailed DNS configuration steps.

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Build Tool**: Vite
- **Backend**: Firebase (Realtime Database, Storage, Analytics)
- **Testing**: Vitest

## Features

- Modern animations and transitions
- Firebase integration for data and analytics
- Responsive design across all devices
- AI-powered spotlight search
- Visitor tracking and analytics
- SEO optimized

## License

MIT
