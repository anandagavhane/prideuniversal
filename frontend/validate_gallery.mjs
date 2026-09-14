import fs from 'fs';
import path from 'path';

const scheduleDataPath = 'c:/Projects/PrideUniversalGanapati2026/frontend/src/data/scheduleData.ts';
const publicDir = 'c:/Projects/PrideUniversalGanapati2026/frontend/public';

const content = fs.readFileSync(scheduleDataPath, 'utf-8');

// Extract GALLERY_PHOTOS
const galleryMatch = content.match(/export const GALLERY_PHOTOS: GalleryPhoto\[\] = (\[[\s\S]*?\]);/);
if (!galleryMatch) {
  console.error('Failed to match GALLERY_PHOTOS array');
  process.exit(1);
}

// Simple parsing or regex check
const imageRegex = /imageUrl:\s*'(.*?)'/g;
let match;
const images = [];
while ((match = imageRegex.exec(galleryMatch[1])) !== null) {
  images.push(match[1]);
}

console.log(`Found ${images.length} photos in GALLERY_PHOTOS.`);

let allValid = true;
for (const img of images) {
  const localPath = path.join(publicDir, img.replace(/^\//, ''));
  if (fs.existsSync(localPath)) {
    const stats = fs.statSync(localPath);
    console.log(`✅ [OK] ${img} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.error(`❌ [MISSING] ${img} -> ${localPath}`);
    allValid = false;
  }
}

if (!allValid) {
  console.error('Validation FAILED: Some images are missing!');
  process.exit(1);
} else {
  console.log('\n🎉 ALL GALLERY PHOTOS VALIDATED SUCCESSFULLY!');
}

