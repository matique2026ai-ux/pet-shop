import sharp from 'sharp';
import path from 'path';

async function generateOgImage() {
  const logoPath = path.resolve('public/logo-badge.png');
  const outputPath = path.resolve('public/og-image.png');

  // Resize logo to 320x320
  const resizedLogo = await sharp(logoPath)
    .resize(320, 320, { fit: 'contain' })
    .toBuffer();

  // Create SVG background canvas with title & text (1200x630)
  const svgCanvas = Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1E2D24"/>
          <stop offset="50%" stop-color="#121F18"/>
          <stop offset="100%" stop-color="#0E1611"/>
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#F1C290"/>
          <stop offset="100%" stop-color="#E3602D"/>
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bgGrad)"/>

      <!-- Accent Circles -->
      <circle cx="1050" cy="100" r="300" fill="#E3602D" opacity="0.08"/>
      <circle cx="150" cy="550" r="250" fill="#F1C290" opacity="0.06"/>
      <rect x="0" y="620" width="1200" height="10" fill="url(#goldGrad)"/>

      <!-- Right Text Area -->
      <text x="500" y="250" font-family="'Cairo', sans-serif" font-weight="900" font-size="54" fill="#FFFFFF" text-anchor="start">
        مخالب وأجنحة | Paws &amp; Wings
      </text>

      <text x="500" y="320" font-family="'Cairo', sans-serif" font-weight="700" font-size="30" fill="url(#goldGrad)" text-anchor="start">
        المتجر الإلكتروني الرائد للحيوانات الأليفة والخيول في الجزائر 🇩🇿
      </text>

      <text x="500" y="390" font-family="'Cairo', sans-serif" font-weight="400" font-size="22" fill="#C5BAA5" text-anchor="start">
        أغذية عالمية • مستلزمات بيطرية • توصيل سريع لجميع الولايات
      </text>

      <!-- Trust Badge -->
      <rect x="500" y="440" width="340" height="50" rx="25" fill="#E3602D" opacity="0.2" stroke="#E3602D" stroke-width="1.5"/>
      <text x="670" y="473" font-family="'Cairo', sans-serif" font-weight="700" font-size="20" fill="#F1C290" text-anchor="middle">
        ⭐️ شحن 24-48 ساعة | الدفع عند الاستلام
      </text>
    </svg>
  `);

  // Composite background with logo
  await sharp(svgCanvas)
    .composite([
      {
        input: resizedLogo,
        top: 155,
        left: 110,
      },
    ])
    .png()
    .toFile(outputPath);

  console.log('Successfully generated 1200x630 Facebook OpenGraph image:', outputPath);
}

generateOgImage().catch(console.error);
