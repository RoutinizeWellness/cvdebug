const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createONGLogo() {
  const publicDir = path.join(__dirname, '../public');

  // Create SVG with just the ONG symbol (UN emblem style)
  const svgLogo = `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="transparent"/>

      <!-- UN/ONG Emblem - Centered and Large -->
      <g transform="translate(256, 256)">
        <!-- Olive branches -->
        <g stroke="#1e3a5f" stroke-width="12" fill="none" stroke-linecap="round">
          <!-- Left branch -->
          <path d="M -120 0 Q -100 -20, -90 -40 Q -80 -60, -70 -80" />
          <path d="M -120 0 Q -110 10, -100 20 Q -90 30, -80 40" />
          <ellipse cx="-92" cy="-45" rx="8" ry="12" fill="#1e3a5f"/>
          <ellipse cx="-102" cy="-30" rx="8" ry="12" fill="#1e3a5f"/>
          <ellipse cx="-112" cy="-15" rx="8" ry="12" fill="#1e3a5f"/>
          <ellipse cx="-92" cy="25" rx="8" ry="12" fill="#1e3a5f"/>
          <ellipse cx="-102" cy="15" rx="8" ry="12" fill="#1e3a5f"/>
          <ellipse cx="-112" cy="5" rx="8" ry="12" fill="#1e3a5f"/>

          <!-- Right branch -->
          <path d="M 120 0 Q 100 -20, 90 -40 Q 80 -60, 70 -80" />
          <path d="M 120 0 Q 110 10, 100 20 Q 90 30, 80 40" />
          <ellipse cx="92" cy="-45" rx="8" ry="12" fill="#1e3a5f"/>
          <ellipse cx="102" cy="-30" rx="8" ry="12" fill="#1e3a5f"/>
          <ellipse cx="112" cy="-15" rx="8" ry="12" fill="#1e3a5f"/>
          <ellipse cx="92" cy="25" rx="8" ry="12" fill="#1e3a5f"/>
          <ellipse cx="102" cy="15" rx="8" ry="12" fill="#1e3a5f"/>
          <ellipse cx="112" cy="5" rx="8" ry="12" fill="#1e3a5f"/>
        </g>

        <!-- Globe/World Map representation -->
        <circle cx="0" cy="0" r="95" fill="none" stroke="#1e3a5f" stroke-width="10"/>

        <!-- Latitude lines -->
        <ellipse cx="0" cy="0" rx="95" ry="40" fill="none" stroke="#1e3a5f" stroke-width="4"/>
        <ellipse cx="0" cy="0" rx="95" ry="65" fill="none" stroke="#1e3a5f" stroke-width="4"/>

        <!-- Longitude lines -->
        <line x1="0" y1="-95" x2="0" y2="95" stroke="#1e3a5f" stroke-width="4"/>
        <ellipse cx="0" cy="0" rx="30" ry="95" fill="none" stroke="#1e3a5f" stroke-width="4"/>
        <ellipse cx="0" cy="0" rx="60" ry="95" fill="none" stroke="#1e3a5f" stroke-width="4"/>

        <!-- Center anchor point -->
        <circle cx="0" cy="0" r="8" fill="#1e3a5f"/>
      </g>
    </svg>
  `;

  // Convert SVG to PNG
  const svgBuffer = Buffer.from(svgLogo);

  console.log('Creating ONG logo (512x512)...');
  await sharp(svgBuffer)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'logo.png'));

  console.log('✓ Logo created successfully');
}

createONGLogo().catch(err => {
  console.error('Error creating logo:', err);
  process.exit(1);
});
