# Azulito Deployment Checklist

## Pre-Deployment

- [ ] Customize brand name in `src/components/pages/home.js`
- [ ] Update page titles in all page components
- [ ] Replace logo in `src/img/logo-reduced.svg`
- [ ] Update Calendly URL in `src/index.html` and `src/script.js`
- [ ] Edit contact email in `src/components/pages/chat.js`
- [ ] Add your testimonials to `src/data/testimonials.json`
- [ ] Add your projects to `src/data/projects/`

## Build

```bash
npm install
npm run build
```

## Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `dist/` folder
3. Your site is live!

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/azulito.git
git push -u origin main
git subtree push --prefix dist origin gh-pages
```

Enable GitHub Pages in Settings → Pages → Source: `gh-pages` branch.

## Post-Deployment

- [ ] Test all pages and links
- [ ] Verify Calendly integration works
- [ ] Check mobile responsiveness
- [ ] Set up custom domain (optional)
