# uddhavbhople.in — Personal Portfolio

A modern, performant personal portfolio website built with Vite, vanilla JS, and Firebase — featuring smooth animations, an AI-powered spotlight search, and a full deployment pipeline to a custom domain.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Build Tool | Vite |
| Backend / Cloud | Firebase (Realtime Database, Storage, Analytics) |
| Testing | Vitest |
| Linting | ESLint |
| Transpilation | Babel |

---

## Features

- **AI-Powered Spotlight Search** — fast, keyboard-driven command palette for navigating the portfolio
- **Smooth Animations** — CSS-driven transitions and micro-interactions throughout
- **Firebase Integration** — real-time visitor analytics, data storage, and asset hosting
- **Responsive Design** — works across mobile, tablet, and desktop
- **SEO Optimized** — structured metadata and performance-tuned build
- **Custom Domain** — deployed to `uddhavbhople.in` via Firebase Hosting

---

## Project Structure

```
uddhavs-personal-portfolio/
├── src/
│   ├── components/         # Reusable UI components
│   ├── modules/            # Feature modules (spotlight, analytics, etc.)
│   ├── styles/             # CSS stylesheets
│   ├── assets/             # Images, icons, fonts
│   ├── config/             # Firebase and app configuration
│   ├── utils/              # Utility/helper functions
│   └── main.js             # Application entry point
├── public/                 # Static public assets
├── assets/                 # Root-level assets
├── docs/                   # Deployment and setup documentation
├── scripts/                # Build and migration scripts
├── tests/
│   └── integration/        # Integration test suites
├── .kiro/specs/            # Project specs and design docs
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
├── firebase.json           # Firebase Hosting config
├── .firebaserc             # Firebase project binding
├── .env.example            # Environment variable template
└── cv.pdf                  # Downloadable CV
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- Firebase CLI: `npm install -g firebase-tools`

### Install

```bash
npm install
```

### Develop

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

---

## Deployment

### Quick Deploy (one command)

```bash
npm run deploy
```

Builds the project and pushes to Firebase Hosting automatically.

### Platform-specific scripts

```bash
# Linux / macOS
./deploy.sh

# Windows (PowerShell)
./deploy.ps1

# Windows (Command Prompt)
deploy.bat
```

### First-time Firebase Setup

1. Login to Firebase:
   ```bash
   firebase login
   ```
2. Update `.firebaserc` with your Firebase project ID.
3. Copy `.env.example` → `.env` and fill in your Firebase credentials.
4. Update `src/config/firebase.json` with your project's config object.

---

## Documentation

| Doc | Description |
|---|---|
| [Deployment Quick Start](docs/deployment-quick-start.md) | TL;DR for deploying fast |
| [Firebase Hosting Setup](docs/firebase-hosting-setup.md) | Full hosting configuration walkthrough |
| [Custom Domain Setup](docs/custom-domain-setup-instructions.md) | DNS configuration for `uddhavbhople.in` |
| [Spotlight Guide](SPOTLIGHT-GUIDE.md) | How the AI spotlight search works |

---

## License

MIT © Uddhav Bhople
