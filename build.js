const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { minify: minifyHTML } = require('html-minifier-terser');
const sharp = require('sharp');
const { optimize: optimizeSVG } = require('svgo');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');
const imageCachePath = path.join(__dirname, '.image-cache.json');

// Check if we can preserve cached images
function canPreserveImageCache() {
  const projectsDir = path.join(srcDir, 'data', 'projects');
  const distProjectsDir = path.join(distDir, 'data', 'projects');

  if (!fs.existsSync(imageCachePath) || !fs.existsSync(distProjectsDir)) return false;

  try {
    const cache = JSON.parse(fs.readFileSync(imageCachePath, 'utf8'));
    const currentFingerprint = {};

    // Scan source images
    function scanDirectory(dirPath) {
      if (!fs.existsSync(dirPath)) return;
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          scanDirectory(fullPath);
        } else if (entry.name.endsWith('.png')) {
          const stat = fs.statSync(fullPath);
          const relativePath = path.relative(srcDir, fullPath);
          currentFingerprint[relativePath] = `${stat.size}-${stat.mtimeMs}`;
        }
      }
    }
    scanDirectory(projectsDir);

    const cacheKeys = Object.keys(cache.images || {});
    const currentKeys = Object.keys(currentFingerprint);
    if (cacheKeys.length !== currentKeys.length) return false;

    for (const key of currentKeys) {
      if (cache.images[key] !== currentFingerprint[key]) return false;
    }

    // Check if webp files exist
    for (const key of currentKeys) {
      const webpPath = path.join(distDir, key.replace('.png', '.webp'));
      if (!fs.existsSync(webpPath)) return false;
    }

    return true;
  } catch {
    return false;
  }
}

// Clean dist directory (preserving images if cache valid)
console.log('🧹 Cleaning dist directory...');
const preserveImages = canPreserveImageCache();
if (preserveImages) {
  console.log('  ✓ Preserving cached images');
  // Clean everything except data/projects
  if (fs.existsSync(distDir)) {
    const entries = fs.readdirSync(distDir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(distDir, entry.name);
      if (entry.name === 'data') {
        // Clean data folder except projects
        const dataPath = path.join(distDir, 'data');
        if (fs.existsSync(dataPath)) {
          const dataEntries = fs.readdirSync(dataPath, { withFileTypes: true });
          for (const de of dataEntries) {
            if (de.name !== 'projects') {
              fs.rmSync(path.join(dataPath, de.name), { recursive: true });
            }
          }
        }
      } else {
        fs.rmSync(entryPath, { recursive: true });
      }
    }
  }
} else {
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
  }
}
fs.mkdirSync(distDir, { recursive: true });

// Helper to copy directory recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Build JavaScript files
async function buildJS() {
  console.log('📦 Minifying JavaScript...');

  const jsFiles = [
    'script.js',
    'components/loader.js',
    'components/nav.js',
    'components/theme-switcher.js',
    'components/router.js',
    'components/wave-animation.js',
    'components/pages.js',
    'components/pages/home.js',
    'components/pages/work.js',
    'components/pages/story.js',
    'components/pages/resources.js',
    'components/pages/chat.js',
    'components/pages/project-detail.js',
    'components/pages/404.js',
    'components/cursor.js'
  ];

  for (const file of jsFiles) {
    const inputPath = path.join(srcDir, file);
    const outputPath = path.join(distDir, file);

    // Create directory if it doesn't exist
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    try {
      await esbuild.build({
        entryPoints: [inputPath],
        bundle: false,
        minify: true,
        target: 'es2020',
        outfile: outputPath,
        legalComments: 'none'
      });

      const originalSize = fs.statSync(inputPath).size;
      const minifiedSize = fs.statSync(outputPath).size;
      const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
      console.log(`  ✓ ${file}: ${originalSize}B → ${minifiedSize}B (${savings}% reduction)`);
    } catch (err) {
      console.error(`  ✗ Error minifying ${file}:`, err.message);
    }
  }
}

// Build CSS
async function buildCSS() {
  console.log('🎨 Minifying CSS...');

  // Main Style
  const mainInput = path.join(srcDir, 'style.css');
  const mainOutput = path.join(distDir, 'style.css');

  // Component Styles
  const componentStyles = [
    'components/theme-switcher.css'
  ];

  try {
    // Build Main CSS
    await esbuild.build({
      entryPoints: [mainInput],
      bundle: false,
      minify: true,
      outfile: mainOutput,
      loader: { '.css': 'css' },
      legalComments: 'none'
    });
    console.log(`  ✓ style.css built`);

    // Build Component CSS
    for (const style of componentStyles) {
      const input = path.join(srcDir, style);
      const output = path.join(distDir, style);

      if (fs.existsSync(input)) {
        await esbuild.build({
          entryPoints: [input],
          bundle: false,
          minify: true,
          outfile: output,
          loader: { '.css': 'css' },
          legalComments: 'none'
        });
        console.log(`  ✓ ${style} built`);
      }
    }
  } catch (err) {
    console.error('  ✗ Error minifying CSS:', err.message);
  }
}

// Build HTML
async function buildHTML() {
  console.log('📄 Minifying HTML...');

  const inputPath = path.join(srcDir, 'index.html');
  const outputPath = path.join(distDir, 'index.html');

  try {
    const html = fs.readFileSync(inputPath, 'utf8');
    const minified = await minifyHTML(html, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyCSS: true,
      minifyJS: true
    });

    fs.writeFileSync(outputPath, minified);

    const originalSize = html.length;
    const minifiedSize = minified.length;
    const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
    console.log(`  ✓ index.html: ${originalSize}B → ${minifiedSize}B (${savings}% reduction)`);
  } catch (err) {
    console.error('  ✗ Error minifying HTML:', err.message);
  }
}

// Generate a fingerprint of all source images (path + size + mtime)
function getImageFingerprint(projectsDir) {
  const images = {};

  function scanDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.name.endsWith('.png')) {
        const stat = fs.statSync(fullPath);
        const relativePath = path.relative(srcDir, fullPath);
        images[relativePath] = `${stat.size}-${stat.mtimeMs}`;
      }
    }
  }

  scanDirectory(projectsDir);
  return images;
}

// Check if image cache is valid (uses result from earlier check)
function isImageCacheValid() {
  return preserveImages;
}

// Save image cache
function saveImageCache(projectsDir) {
  const fingerprint = getImageFingerprint(projectsDir);
  fs.writeFileSync(imageCachePath, JSON.stringify({ images: fingerprint }, null, 2));
}

// Optimize and convert images to WebP
async function optimizeImages() {
  console.log('🖼️  Optimizing images (converting PNG → WebP)...');

  const projectsDir = path.join(srcDir, 'data', 'projects');
  const distProjectsDir = path.join(distDir, 'data', 'projects');

  if (!fs.existsSync(projectsDir)) {
    console.log('  ⚠️  No projects directory found');
    return;
  }

  // Check cache - skip if no changes
  if (isImageCacheValid()) {
    const imageCount = Object.keys(getImageFingerprint(projectsDir)).length;
    console.log(`  ✓ Cache valid - skipped ${imageCount} images (no changes detected)`);
    return;
  }

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let imageCount = 0;

  async function processDirectory(srcPath, destPath) {
    fs.mkdirSync(destPath, { recursive: true });
    const entries = fs.readdirSync(srcPath, { withFileTypes: true });

    for (const entry of entries) {
      const srcFilePath = path.join(srcPath, entry.name);
      const destFilePath = path.join(destPath, entry.name);

      if (entry.isDirectory()) {
        await processDirectory(srcFilePath, destFilePath);
      } else if (entry.name.endsWith('.png')) {
        try {
          const originalSize = fs.statSync(srcFilePath).size;
          const webpPath = destFilePath.replace('.png', '.webp');

          await sharp(srcFilePath)
            .webp({ quality: 85, effort: 6 })
            .toFile(webpPath);

          const optimizedSize = fs.statSync(webpPath).size;
          totalOriginalSize += originalSize;
          totalOptimizedSize += optimizedSize;
          imageCount++;

          if (imageCount % 20 === 0) {
            process.stdout.write(`  ⏳ Processed ${imageCount} images...\r`);
          }
        } catch (err) {
          console.error(`  ✗ Error converting ${entry.name}:`, err.message);
        }
      }
    }
  }

  await processDirectory(projectsDir, distProjectsDir);

  // Save cache after successful processing
  saveImageCache(projectsDir);

  const savings = ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1);
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  console.log(`  ✓ Converted ${imageCount} images to WebP`);
  console.log(`  ✓ Images: ${formatSize(totalOriginalSize)} → ${formatSize(totalOptimizedSize)} (${savings}% reduction)`);
}

// Optimize SVGs
function optimizeSVGs() {
  console.log('🎨 Optimizing SVGs...');

  const imgDir = path.join(srcDir, 'img');
  const distImgDir = path.join(distDir, 'img');

  if (!fs.existsSync(imgDir)) {
    console.log('  ⚠️  No img directory found');
    return;
  }

  fs.mkdirSync(distImgDir, { recursive: true });
  const svgFiles = fs.readdirSync(imgDir).filter(f => f.endsWith('.svg'));

  if (svgFiles.length === 0) {
    console.log('  ⚠️  No SVG files found');
    return;
  }

  svgFiles.forEach(file => {
    const inputPath = path.join(imgDir, file);
    const outputPath = path.join(distImgDir, file);

    try {
      const svgContent = fs.readFileSync(inputPath, 'utf8');
      const result = optimizeSVG(svgContent, {
        multipass: true,
        plugins: [
          { name: 'preset-default' },
          { name: 'removeViewBox', active: false },
          { name: 'removeDimensions', active: true }
        ]
      });

      fs.writeFileSync(outputPath, result.data);

      const originalSize = svgContent.length;
      const optimizedSize = result.data.length;
      const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
      console.log(`  ✓ ${file}: ${savings}% reduction`);
    } catch (err) {
      console.error(`  ✗ Error optimizing ${file}:`, err.message);
    }
  });
}

// Copy static images (like preview.png, favicon)
function copyStaticImages() {
  console.log('🖼️  Copying static images...');

  const imgDir = path.join(srcDir, 'img');
  const distImgDir = path.join(distDir, 'img');

  if (!fs.existsSync(imgDir)) return;

  // distImgDir might already exist from optimizeSVGs, but ensure it does
  fs.mkdirSync(distImgDir, { recursive: true });

  const files = fs.readdirSync(imgDir).filter(f => !f.endsWith('.svg'));

  files.forEach(file => {
    fs.copyFileSync(path.join(imgDir, file), path.join(distImgDir, file));
    console.log(`  ↳ ${file}`);
  });
}

// Update JSON files to reference WebP images
function updateImageReferences() {
  console.log('📝 Updating image references (PNG → WebP)...');

  const projectsJsonPath = path.join(distDir, 'data', 'projects.json');

  if (fs.existsSync(projectsJsonPath)) {
    let content = fs.readFileSync(projectsJsonPath, 'utf8');
    const pngCount = (content.match(/\.png/g) || []).length;
    content = content.replace(/\.png/g, '.webp');
    fs.writeFileSync(projectsJsonPath, content);
    console.log(`  ✓ Updated ${pngCount} image references in projects.json`);
  }
}

// Copy other assets
function copyAssets() {
  console.log('📂 Copying other assets...');

  // Copy data directory (JSON files only, images handled separately)
  const dataDir = path.join(srcDir, 'data');
  const distDataDir = path.join(distDir, 'data');

  fs.mkdirSync(distDataDir, { recursive: true });

  // Copy JSON files and README
  const jsonFiles = ['projects.json', 'resources.json', 'testimonials.json', 'README.md'];
  jsonFiles.forEach(file => {
    const srcPath = path.join(dataDir, file);
    const destPath = path.join(distDataDir, file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  });
  console.log('  ↳ data/*.json');

  // Copy audio file
  const audioFiles = ['click.wav', 'click.mp3'].filter(f =>
    fs.existsSync(path.join(srcDir, f))
  );

  audioFiles.forEach(file => {
    console.log(`  ↳ ${file}`);
    fs.copyFileSync(
      path.join(srcDir, file),
      path.join(distDir, file)
    );
  });

  // Copy markdown docs
  const docs = fs.readdirSync(srcDir).filter(f => f.endsWith('.md'));
  docs.forEach(file => {
    console.log(`  ↳ ${file}`);
    fs.copyFileSync(
      path.join(srcDir, file),
      path.join(distDir, file)
    );
  });

  // Copy _redirects for Netlify/hosting
  if (fs.existsSync(path.join(srcDir, '_redirects'))) {
    console.log('  ↳ _redirects');
    fs.copyFileSync(
      path.join(srcDir, '_redirects'),
      path.join(distDir, '_redirects')
    );
  }

  // Create .nojekyll to bypass Jekyll processing
  console.log('  ↳ .nojekyll');
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
}

// Generate build report
function generateReport() {
  console.log('\n📊 Build Report:');
  console.log('━'.repeat(60));

  function getDirSize(dirPath) {
    let totalSize = 0;
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dirPath, item.name);
      if (item.isDirectory()) {
        totalSize += getDirSize(itemPath);
      } else {
        totalSize += fs.statSync(itemPath).size;
      }
    }

    return totalSize;
  }

  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  const srcSize = getDirSize(srcDir);
  const distSize = getDirSize(distDir);
  const savings = ((1 - distSize / srcSize) * 100).toFixed(1);

  console.log(`Source (src/):       ${formatSize(srcSize)}`);
  console.log(`Production (dist/):  ${formatSize(distSize)}`);
  console.log(`Savings:             ${formatSize(srcSize - distSize)} (${savings}%)`);
  console.log('━'.repeat(60));
  console.log('✅ Optimized build completed successfully!\n');
  console.log('Key optimizations applied:');
  console.log('  • All PNG images converted to WebP format');
  console.log('  • SVG files optimized');
  console.log('  • JavaScript minified with esbuild');
  console.log('  • CSS minified');
  console.log('  • HTML minified\n');
  console.log('To serve locally: npm run serve');
  console.log('To deploy: Upload the dist/ directory to your hosting\n');
}

// Main build process
async function build() {
  console.log('🚀 Building Azulito Template (Optimized Build)...\n');

  try {
    await buildJS();
    await buildCSS();
    await buildHTML();
    await optimizeImages();
    optimizeSVGs();
    copyStaticImages();
    copyAssets();
    updateImageReferences();
    generateReport();
  } catch (err) {
    console.error('\n❌ Build failed:', err);
    process.exit(1);
  }
}

build();
