import sharp from 'sharp';

const inputPath = 'C:\\Users\\PCIB\\.gemini\\antigravity-ide\\brain\\e5143098-5149-4ee5-9fcf-13768564efa5\\media__1785763617956.jpg';
const outputPath = 'c:\\Users\\PCIB\\Desktop\\pet-shop\\public\\logo-badge.png';

async function processLogo() {
  const metadata = await sharp(inputPath).metadata();
  const width = metadata.width;
  const height = metadata.height;
  const radius = Math.min(width, height) / 2 - 2; // slightly trim edge

  const svgMask = Buffer.from(`
    <svg width="${width}" height="${height}">
      <circle cx="${width / 2}" cy="${height / 2}" r="${radius}" fill="#fff"/>
    </svg>
  `);

  await sharp(inputPath)
    .composite([{
      input: svgMask,
      blend: 'dest-in'
    }])
    .png()
    .toFile(outputPath);

  console.log(`Successfully created transparent circular logo at ${outputPath}`);
}

processLogo().catch(err => {
  console.error(err);
  process.exit(1);
});
