const fs = require('fs');
const path = require('path');

function buildDocs() {
  const rootDir = path.resolve(__dirname, '..');
  const examplesDir = path.join(rootDir, 'examples');
  const readmePath = path.join(rootDir, 'README.md');
  const destDir = path.join(rootDir, 'docs', 'data');

  console.log('Starting documentation synchronization...');

  // 1. Ensure source examples directory exists
  if (!fs.existsSync(examplesDir)) {
    console.error(`Error: Source examples directory does not exist: ${examplesDir}`);
    process.exit(1);
  }

  // 2. Ensure source README.md exists
  if (!fs.existsSync(readmePath)) {
    console.error(`Error: Source README.md does not exist: ${readmePath}`);
    process.exit(1);
  }

  try {
    // 3. Ensure destination docs/data directory exists
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`Destination directory verified: ${destDir}`);
  } catch (err) {
    console.error(`Error: Failed to create destination directory: ${destDir}. Details: ${err.message}`);
    process.exit(1);
  }

  // 4. Copy README.md to docs/data/README.md
  try {
    const destReadme = path.join(destDir, 'README.md');
    fs.copyFileSync(readmePath, destReadme);
    console.log(`Successfully copied: README.md -> docs/data/README.md`);
  } catch (err) {
    console.error(`Error: Failed to copy README.md. Details: ${err.message}`);
    process.exit(1);
  }

  // 5. Copy all files from examples/ to docs/data/
  try {
    const files = fs.readdirSync(examplesDir);
    let copyCount = 0;
    
    for (const file of files) {
      const srcPath = path.join(examplesDir, file);
      const stat = fs.statSync(srcPath);
      
      if (stat.isFile()) {
        const destPath = path.join(destDir, file);
        fs.copyFileSync(srcPath, destPath);
        console.log(`Successfully copied: examples/${file} -> docs/data/${file}`);
        copyCount++;
      }
    }
    
    console.log(`Documentation synchronization completed successfully. Copied README.md and ${copyCount} example file(s).`);
  } catch (err) {
    console.error(`Error: Failed to copy examples directory files. Details: ${err.message}`);
    process.exit(1);
  }
}

buildDocs();
