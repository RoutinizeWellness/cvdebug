#!/usr/bin/env node

/**
 * Script para actualizar las fechas del sitemap.xml automáticamente
 * Uso: node scripts/update-sitemap-date.js
 */

const fs = require('fs');
const path = require('path');

const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');

function updateSitemapDates() {
  try {
    // Leer el sitemap actual
    let sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');

    // Obtener fecha actual en formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    console.log(`📅 Actualizando fechas del sitemap a: ${today}`);

    // Actualizar homepage (priority 1.0)
    sitemap = sitemap.replace(
      /<url>\s*<loc>https:\/\/cvdebug\.com\/<\/loc>\s*<lastmod>[\d-]+<\/lastmod>/,
      `<url>\n    <loc>https://cvdebug.com/</loc>\n    <lastmod>${today}</lastmod>`
    );

    // Actualizar página de pricing (priority 0.9)
    sitemap = sitemap.replace(
      /<url>\s*<loc>https:\/\/cvdebug\.com\/pricing<\/loc>\s*<lastmod>[\d-]+<\/lastmod>/,
      `<url>\n    <loc>https://cvdebug.com/pricing</loc>\n    <lastmod>${today}</lastmod>`
    );

    // Escribir el sitemap actualizado
    fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf8');

    console.log('✅ Sitemap actualizado exitosamente');
    console.log(`📍 Ubicación: ${SITEMAP_PATH}`);
    console.log('\n📊 Próximos pasos:');
    console.log('1. Commit y push los cambios');
    console.log('2. Verifica en Google Search Console después del despliegue');
    console.log('3. Solicita re-indexación si es necesario');

  } catch (error) {
    console.error('❌ Error al actualizar sitemap:', error.message);
    process.exit(1);
  }
}

// Ejecutar
updateSitemapDates();
