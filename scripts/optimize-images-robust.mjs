
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const TARGET_DIRECTORIES = ['public', 'vibe_images'];
const EXTENSIONS = ['.png', '.jpg', '.jpeg'];

async function optimizeImages() {
  console.log('🚀 Starting robust image optimization...');

  for (const dir of TARGET_DIRECTORIES) {
    if (!fs.existsSync(dir)) {
      console.warn(`⚠️ Directory not found: ${dir}`);
      continue;
    }

    const files = fs.readdirSync(dir);

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (EXTENSIONS.includes(ext)) {
        const inputPath = path.join(dir, file);
        const webpName = file.substring(0, file.length - ext.length) + '.webp';
        const outputPath = path.join(dir, webpName);

        // Skip if webp already exists and is newer
        if (fs.existsSync(outputPath)) {
          const inputStats = fs.statSync(inputPath);
          const outputStats = fs.statSync(outputPath);
          if (outputStats.mtime > inputStats.mtime) {
            console.log(`⏩ Skipping ${file} (WebP already up to date)`);
            continue;
          }
        }

        try {
          await sharp(inputPath)
            .webp({ quality: 80, effort: 6 })
            .toFile(outputPath);
          console.log(`✅ Optimized: ${file} -> ${webpName}`);
        } catch (err) {
          console.error(`❌ Error optimizing ${file}:`, err);
        }
      }
    }
  }

  console.log('✨ Image optimization complete.');
}

optimizeImages();
