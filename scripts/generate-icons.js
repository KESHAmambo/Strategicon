import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceImage = path.join(__dirname, '../src/static/Strategicon_title.jpg');
const publicDir = path.join(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Generate favicon.ico (multiple sizes)
sharp(sourceImage)
  .resize(64, 64, {
    fit: 'contain',
    background: { r: 255, g: 255, b: 255, alpha: 1 }
  })
  .toFile(path.join(publicDir, 'favicon.ico'))
  .then(() => console.log('Generated favicon.ico'))
  .catch(err => console.error('Error generating favicon:', err));

// Generate logo192.png
sharp(sourceImage)
  .resize(192, 192, {
    fit: 'contain',
    background: { r: 255, g: 255, b: 255, alpha: 1 }
  })
  .png()
  .toFile(path.join(publicDir, 'logo192.png'))
  .then(() => console.log('Generated logo192.png'))
  .catch(err => console.error('Error generating logo192:', err));

// Generate logo512.png
sharp(sourceImage)
  .resize(512, 512, {
    fit: 'contain',
    background: { r: 255, g: 255, b: 255, alpha: 1 }
  })
  .png()
  .toFile(path.join(publicDir, 'logo512.png'))
  .then(() => console.log('Generated logo512.png'))
  .catch(err => console.error('Error generating logo512:', err)); 