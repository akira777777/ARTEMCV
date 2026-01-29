
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const files = ['barber.png', 'dental.png', 'game.png'];
const publicDir = 'public';

async function optimize() {
  for (const file of files) {
    const inputPath = path.join(publicDir, file);
    const outputPath = path.join(publicDir, file.replace('.png', '.webp'));

    if (!fs.existsSync(inputPath)) {
      console.warn(`File not found: ${inputPath}`);
      continue;
    }

    try {
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
      console.log(`Optimized ${file} to ${outputPath}`);
    } catch (err) {
      console.error(`Error optimizing ${file}:`, err);
    }
  }
}

optimize();
