const sharp = require('sharp');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
// Note: This uses the local logo.png file in public directory
// If updating to remote logo, download from: https://harmless-tapir-303.convex.cloud/api/storage/4f836582-7336-4306-8004-211fad87218f
const logoPath = path.join(publicDir, 'logo.png');
const outputPath = path.join(publicDir, 'og-image.png');

async function generateOGImage() {
  try {
    console.log('Generating Open Graph image...');

    // Create a 1200x630 canvas with dark background
    const bgColor = { r: 15, g: 23, b: 42, alpha: 1 }; // #0F172A

    // Create base canvas
    const canvas = await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: bgColor
      }
    })
    .png()
    .toBuffer();

    // Resize logo to fit nicely in the OG image
    const logo = await sharp(logoPath)
      .resize(400, 400, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    // Composite logo onto canvas (centered)
    const finalImage = await sharp(canvas)
      .composite([
        {
          input: logo,
          top: 115, // (630 - 400) / 2
          left: 400 // (1200 - 400) / 2
        }
      ])
      .png()
      .toFile(outputPath);

    console.log('✓ Open Graph image generated successfully!');
    console.log('  - Size: 1200x630px');
    console.log('  - Location: /public/og-image.png');
  } catch (error) {
    console.error('Error generating OG image:', error);
    process.exit(1);
  }
}

generateOGImage();
