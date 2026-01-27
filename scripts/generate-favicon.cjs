const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImage = path.join(__dirname, '../public/logo.png');
const publicDir = path.join(__dirname, '../public');

async function generateFavicons() {
  try {
    console.log('Generating favicons...');

    // Generate 16x16 favicon - use 'cover' to fill space, minimize borders
    await sharp(inputImage)
      .resize(16, 16, { fit: 'cover', position: 'center' })
      .png()
      .toFile(path.join(publicDir, 'favicon-16x16.png'));

    // Generate 32x32 favicon - use 'cover' to fill space
    await sharp(inputImage)
      .resize(32, 32, { fit: 'cover', position: 'center' })
      .png()
      .toFile(path.join(publicDir, 'favicon-32x32.png'));

    // Generate 192x192 for Android - use 'cover' for better fill
    await sharp(inputImage)
      .resize(192, 192, { fit: 'cover', position: 'center' })
      .png()
      .toFile(path.join(publicDir, 'android-chrome-192x192.png'));

    // Generate 512x512 for Android - use 'cover'
    await sharp(inputImage)
      .resize(512, 512, { fit: 'cover', position: 'center' })
      .png()
      .toFile(path.join(publicDir, 'android-chrome-512x512.png'));

    // Generate 180x180 for Apple Touch Icon - use 'cover'
    await sharp(inputImage)
      .resize(180, 180, { fit: 'cover', position: 'center' })
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    // Update main favicon.png (256x256) - use 'cover'
    await sharp(inputImage)
      .resize(256, 256, { fit: 'cover', position: 'center' })
      .png()
      .toFile(path.join(publicDir, 'favicon.png'));

    // Generate ICO file (32x32) - use 'cover'
    await sharp(inputImage)
      .resize(32, 32, { fit: 'cover', position: 'center' })
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
