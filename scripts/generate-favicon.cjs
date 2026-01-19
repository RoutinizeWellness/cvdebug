const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImage = path.join(__dirname, '../public/logo.png');
const publicDir = path.join(__dirname, '../public');

async function generateFavicons() {
  try {
    console.log('Generating favicons...');

    // Generate 16x16 favicon
    await sharp(inputImage)
      .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'favicon-16x16.png'));

    // Generate 32x32 favicon
    await sharp(inputImage)
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'favicon-32x32.png'));

    // Generate 192x192 for Android
    await sharp(inputImage)
      .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'android-chrome-192x192.png'));

    // Generate 512x512 for Android
    await sharp(inputImage)
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'android-chrome-512x512.png'));

    // Generate 180x180 for Apple Touch Icon
    await sharp(inputImage)
      .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    // Update main favicon.png (256x256)
    await sharp(inputImage)
      .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'favicon.png'));

    // Generate ICO file (32x32)
    await sharp(inputImage)
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toFile(path.join(publicDir, 'favicon.ico'));

    console.log('✓ Favicons generated successfully!');
    console.log('Generated files:');
    console.log('  - favicon-16x16.png');
    console.log('  - favicon-32x32.png');
    console.log('  - favicon.png (256x256)');
    console.log('  - favicon.ico');
    console.log('  - android-chrome-192x192.png');
    console.log('  - android-chrome-512x512.png');
    console.log('  - apple-touch-icon.png');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
