const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const { minify: minifyHTML } = require('html-minifier-terser');
const sharp = require('sharp');
const { optimize: optimizeSVG } = require('svgo');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

// Clean dist directory
console.log('🧹 Cleaning dist directory...');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
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

// Build and bundle JavaScript files
async function buildJS() {
  console.log('📦 Bundling and minifying JavaScript...');

  // Bundle all component files into a single bundle
  const componentFiles = [
    'components/footer.js',
    'components/router.js',
    'components/wave-animation.js',
    'components/pages.js',
    'components/pages/home.js',
    'components/pages/work.js',
    'components/pages/story.js',
    'components/pages/resources.js',
    'components/pages/chat.js',
    'components/pages/project-detail.js'
  ];

  try {
    // Create a single entry point that imports all components
    const entryContent = componentFiles.map((file, index) =>
      `import * as module${index} from './${file}';`
    ).join('\n');

    const tempEntry = path.join(srcDir, '_bundle_entry.js');
    fs.writeFileSync(tempEntry, entryContent);

    // Bundle all components into one file
    await esbuild.build({
      entryPoints: [tempEntry],
      bundle: true,
      minify: true,
      target: 'es2020',
      outfile: path.join(distDir, 'app.bundle.js'),
      format: 'iife',
      legalComments: 'none'
    });

    fs.unlinkSync(tempEntry);

    const bundleSize = fs.statSync(path.join(distDir, 'app.bundle.js')).size;
    console.log(`  ✓ app.bundle.js: ${bundleSize}B (all components bundled)`);
  } catch (err) {
    console.error('  ✗ Error bundling components:', err.message);
  }

  // Build main script.js separately
  try {
    await esbuild.build({
      entryPoints: [path.join(srcDir, 'script.js')],
      bundle: false,
      minify: true,
      target: 'es2020',
      outfile: path.join(distDir, 'script.js'),
      legalComments: 'none'
    });

    const scriptSize = fs.statSync(path.join(distDir, 'script.js')).size;
    console.log(`  ✓ script.js: ${scriptSize}B`);
  } catch (err) {
    console.error('  ✗ Error minifying script.js:', err.message);
  }
}

// Build CSS
async function buildCSS() {
  console.log('🎨 Minifying CSS...');

  const inputPath = path.join(srcDir, 'style.css');
  const outputPath = path.join(distDir, 'style.css');

  try {
    await esbuild.build({
      entryPoints: [inputPath],
      bundle: false,
      minify: true,
      outfile: outputPath,
      loader: { '.css': 'css' },
      legalComments: 'none'
    });

    const originalSize = fs.statSync(inputPath).size;
    const minifiedSize = fs.statSync(outputPath).size;
    const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
    console.log(`  ✓ style.css: ${originalSize}B → ${minifiedSize}B (${savings}% reduction)`);
  } catch (err) {
    console.error('  ✗ Error minifying CSS:', err.message);
  }
}

// Build HTML with updated script references
async function buildHTML() {
  console.log('📄 Minifying HTML...');

  const inputPath = path.join(srcDir, 'index.html');
  const outputPath = path.join(distDir, 'index.html');

  try {
    let html = fs.readFileSync(inputPath, 'utf8');

    // Replace all component script tags with single bundle
    html = html.replace(
      /<script src="components\/footer\.js"><\/script>[\s\S]*?<script src="components\/pages\.js"><\/script>\s*<script>window\.pages=pages<\/script>/,
      '<script src="app.bundle.js"></script>'
    );

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

// Optimize images - convert to WebP
async function optimizeImages() {
  console.log('🖼️  Optimizing images (converting to WebP)...');

  const projectsDir = path.join(srcDir, 'data', 'projects');
  const distProjectsDir = path.join(distDir, 'data', 'projects');

  if (!fs.existsSync(projectsDir)) {
    console.log('  ⚠️  No projects directory found');
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
        } catch (err) {
          console.error(`  ✗ Error converting ${entry.name}:`, err.message);
        }
      }
    }
  }

  await processDirectory(projectsDir, distProjectsDir);

  const savings = ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1);
  console.log(`  ✓ Converted ${imageCount} images to WebP`);
  console.log(`  ✓ Total: ${formatSize(totalOriginalSize)} → ${formatSize(totalOptimizedSize)} (${savings}% reduction)`);
}

// Update JSON files to reference WebP images
function updateImageReferences() {
  console.log('📝 Updating image references to WebP...');

  const projectsJsonPath = path.join(distDir, 'data', 'projects.json');

  if (fs.existsSync(projectsJsonPath)) {
    let content = fs.readFileSync(projectsJsonPath, 'utf8');
    content = content.replace(/\.png/g, '.webp');
    fs.writeFileSync(projectsJsonPath, content);
    console.log('  ✓ Updated projects.json');
  }
}

// Optimize SVGs
function optimizeSVGs() {
  console.log('🎨 Optimizing SVGs...');

  const imgDir = path.join(srcDir, 'img');
  const distImgDir = path.join(distDir, 'img');

  if (!fs.existsSync(imgDir)) {
    return;
  }

  fs.mkdirSync(distImgDir, { recursive: true });
  const svgFiles = fs.readdirSync(imgDir).filter(f => f.endsWith('.svg'));

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

// Copy other assets
function copyAssets() {
  console.log('📂 Copying other assets...');

  // Copy data directory (JSON files and README)
  console.log('  ↳ data/ (JSON files)');
  const dataDir = path.join(srcDir, 'data');
  const distDataDir = path.join(distDir, 'data');

  // Create data directory structure
  fs.mkdirSync(distDataDir, { recursive: true });

  // Copy JSON files
  const jsonFiles = ['projects.json', 'resources.json', 'testimonials.json', 'README.md'];
  jsonFiles.forEach(file => {
    const srcPath = path.join(dataDir, file);
    const destPath = path.join(distDataDir, file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  });

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

  const srcSize = getDirSize(srcDir);
  const distSize = getDirSize(distDir);
  const savings = ((1 - distSize / srcSize) * 100).toFixed(1);

  console.log(`Source (src/):       ${formatSize(srcSize)}`);
  console.log(`Production (dist/):  ${formatSize(distSize)}`);
  console.log(`Savings:             ${formatSize(srcSize - distSize)} (${savings}%)`);
  console.log('━'.repeat(60));
  console.log('✅ Optimized build completed successfully!\n');
  console.log('Key optimizations:');
  console.log('  • Images converted to WebP format');
  console.log('  • JavaScript bundled into single file');
  console.log('  • SVGs optimized');
  console.log('  • All code minified\n');
  console.log('To serve locally: npm run serve');
  console.log('To deploy: Upload the dist/ directory to your hosting\n');
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// Main build process
async function build() {
  console.log('🚀 Building Azulito Template (Optimized)...\n');

  try {
    await buildJS();
    await buildCSS();
    await buildHTML();
    await optimizeImages();
    optimizeSVGs();
    copyAssets();
    updateImageReferences();
    generateReport();
  } catch (err) {
    console.error('\n❌ Build failed:', err);
    process.exit(1);
  }
}

build();
