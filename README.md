# Azulito - Premium Creative Portfolio Template

[![Live Preview](https://img.shields.io/badge/Live_Preview-View_Demo-2563EB?style=for-the-badge&logo=github)](https://your-username.github.io/azulito)

> **Note**: Replace `your-username` in the link above with your GitHub username after deploying.

Azulito is a high-performance, single-page creative portfolio template featuring fluid animations, modular components, and a custom build system. Designed for creative agencies, freelancers, and design studios.

## 🚀 Features

-   **High Performance Setup**: Custom build script (esbuild), asset optimization (WebP/SVG), and zero external frameworks.
-   **Theme Engine**: Built-in Theme Switcher (Blue, Red, Green) using dynamic CSS variables.
-   **Fluid Animations**: Parallax effects, wave animations, and magnetic cursors.
-   **Modular Architecture**: Component-based structure (`components/`) for easy maintenance.
-   **SPA Router**: Hash-based router with smooth page transitions and 404 handling.
-   **Responsiveness**: Fully responsive mobile navigation and layout.

## 🛠️ Quick Start

### Prerequisites
-   Node.js (v14+ recommended)
-   npm

### Installation

1.  **Clone & Install**:
    ```bash
    git clone <repo-url>
    cd azulito
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run serve
    ```
    Opens the site at `http://localhost:8080` with hot reload.

3.  **Build for Production**:
    ```bash
    npm run build
    ```
    Generates an optimized `dist/` folder ready for deployment.
    
4.  **Deploy to GitHub Pages**:
    -   Push the contents of the `dist/` folder to a `gh-pages` branch, OR
    -   Configure GitHub Pages in your repository settings to serve from the `dist` folder (if you commit it) or use a workflow to build and deploy.

## 🎨 Customization

### 1. Changing Colors
The template uses a strict 4-color palette defined in `src/style.css`.
To change the default theme, modify the `:root` variables:
```css
:root {
    --blue: #2563EB;      /* Primary Brand Color */
    --paper: #FAF8F5;     /* Background Color */
    --blue-ish: #DBEAFE;  /* Secondary/Tint Color */
    /* ... */
}
```

### 2. Updating Content
-   **Projects**: Edit `src/data/projects.json`. Images should be in `src/img/projects/`.
-   **Pages**: Modify component files in `src/components/pages/` (e.g., `home.js`, `work.js`).
-   **Static Text**: Update `src/index.html` for header/footer content.

### 3. Adding/Removing Components
-   **Navigation**: `src/components/nav.js`
-   **Loader**: `src/components/loader.js`
-   **Theme Switcher**: Remove `<script src="components/theme-switcher.js"></script>` from `index.html` to disable.

## 📦 Project Structure

```
src/
├── components/         # JS Components (Nav, Loader, Pages)
│   ├── pages/          # Page content renderers
│   └── theme-switcher.js
├── css/                # Styles (if separated, currently style.css)
├── data/               # JSON Content
├── img/                # Images & SVGs
├── index.html          # Main Entry
├── script.js           # Global Logic
└── style.css           # Main Stylesheet
build.js                # Custom Build Script
```

## 📄 License

MIT License. Free to use for personal and commercial projects.
