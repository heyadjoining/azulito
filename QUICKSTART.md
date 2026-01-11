# Azulito Quick Start Guide

Get your portfolio site up and running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Git installed

## Setup

### 1. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/azulito.git
cd azulito
npm install
```

### 2. Customize Your Site

Edit these key files:
- `src/components/pages/home.js` - Brand name & tagline
- `src/components/pages/story.js` - Your story
- `src/components/pages/chat.js` - Contact info (email)
- `src/index.html` - Page title & Calendly URL
- `src/data/testimonials.json` - Client testimonials

### 3. Build & Preview

```bash
npm run build
npm run serve
```

Open http://localhost:3000

### 4. Deploy

**Netlify (Easiest):**
Drag the `dist/` folder to netlify.com/drop

**GitHub Pages:**
```bash
git subtree push --prefix dist origin gh-pages
```

## Need Help?

Check the full README.md for detailed documentation.
