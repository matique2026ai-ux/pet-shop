import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateFavicons() {
  const sourceImage = path.resolve('public/logo-badge.png');
  const targetAppIcon = path.resolve('src/app/icon.png');
  const targetAppleIcon = path.resolve('src/app/apple-icon.png');
  const targetFaviconIco = path.resolve('public/favicon.ico');
  const targetPublicFavicon = path.resolve('public/icon.png');

  console.log('Generating favicons from:', sourceImage);

  // 1. Generate 512x512 transparent PNG for src/app/icon.png
  await sharp(sourceImage)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(targetAppIcon);
  console.log('Created:', targetAppIcon);

  // 2. Generate 180x180 transparent PNG for src/app/apple-icon.png
  await sharp(sourceImage)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(targetAppleIcon);
  console.log('Created:', targetAppleIcon);

  // 3. Generate 64x64 transparent PNG for public/favicon.ico and public/icon.png
  await sharp(sourceImage)
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(targetFaviconIco);
  console.log('Created:', targetFaviconIco);

  await sharp(sourceImage)
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(targetPublicFavicon);
  console.log('Created:', targetPublicFavicon);
}

generateFavicons().catch(console.error);
