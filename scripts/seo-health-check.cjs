#!/usr/bin/env node

/**
 * Script de verificación de salud SEO
 * Verifica que todos los elementos SEO estén correctamente configurados
 * Uso: node scripts/seo-health-check.js
 */

const fs = require('fs');
const path = require('path');

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, '..', filePath);
  const exists = fs.existsSync(fullPath);

  if (exists) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - Archivo no encontrado: ${filePath}`, 'red');
    return false;
  }
}

function checkContent(filePath, searchStrings, description) {
  const fullPath = path.join(__dirname, '..', filePath);

  if (!fs.existsSync(fullPath)) {
    log(`❌ ${description} - Archivo no encontrado`, 'red');
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const results = searchStrings.map(str => {
    const found = content.includes(str);
    return { str, found };
  });

  const allFound = results.every(r => r.found);

  if (allFound) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description}`, 'red');
    results.forEach(r => {
      if (!r.found) {
        log(`   ⚠️  No encontrado: "${r.str}"`, 'yellow');
      }
    });
    return false;
  }
}

function runHealthCheck() {
  log('\n🔍 CVDebug - Verificación de Salud SEO\n', 'cyan');
  log('='.repeat(50), 'blue');

  let passed = 0;
  let failed = 0;

  // 1. Verificar archivos principales
  log('\n📁 Verificando archivos principales:', 'cyan');
  if (checkFile('index.html', 'index.html principal')) passed++; else failed++;
  if (checkFile('public/sitemap.xml', 'sitemap.xml')) passed++; else failed++;
  if (checkFile('public/robots.txt', 'robots.txt')) passed++; else failed++;

  // 2. Verificar meta tags
  log('\n🏷️  Verificando meta tags:', 'cyan');
  if (checkContent('index.html', [
    '<title>',
    'meta name="description"',
    'meta name="keywords"',
    'property="og:title"',
    'property="og:description"',
    'property="og:image"',
    'name="twitter:card"',
    'rel="canonical"'
  ], 'Meta tags básicos')) passed++; else failed++;

  // 3. Verificar structured data
  log('\n📊 Verificando structured data (JSON-LD):', 'cyan');
  if (checkContent('index.html', [
    'application/ld+json',
    '@type": "WebApplication"',
    '@type": "Organization"',
    'aggregateRating'
  ], 'Structured data principal')) passed++; else failed++;

  // 4. Verificar robots.txt
  log('\n🤖 Verificando robots.txt:', 'cyan');
  if (checkContent('public/robots.txt', [
    'User-agent: *',
    'Allow: /',
    'Sitemap: https://cvdebug.com/sitemap.xml',
    'User-agent: Googlebot'
  ], 'Configuración robots.txt')) passed++; else failed++;

  // 5. Verificar sitemap.xml
  log('\n🗺️  Verificando sitemap.xml:', 'cyan');
  if (checkContent('public/sitemap.xml', [
    'urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '<loc>https://cvdebug.com/</loc>',
    '<priority>1.0</priority>',
    '<changefreq>'
  ], 'Estructura del sitemap')) passed++; else failed++;

  // 6. Verificar configuración móvil
  log('\n📱 Verificando configuración móvil:', 'cyan');
  if (checkContent('index.html', [
    'name="viewport"',
    'width=device-width',
    'mobile-web-app-capable',
    'apple-mobile-web-app-capable'
  ], 'Meta tags móviles')) passed++; else failed++;

  // 7. Verificar performance tags
  log('\n⚡ Verificando optimizaciones de performance:', 'cyan');
  if (checkContent('index.html', [
    'rel="preconnect"',
    'dns-prefetch'
  ], 'Preconnect y DNS prefetch')) passed++; else failed++;

  // 8. Verificar analytics
  log('\n📈 Verificando analytics:', 'cyan');
  if (checkContent('index.html', [
    'gtag(',
    'G-981QRK7PKW',
    'GTM-5HDL9W6G'
  ], 'Google Analytics y GTM')) passed++; else failed++;

  // Resumen
  log('\n' + '='.repeat(50), 'blue');
  log('\n📊 RESUMEN DE VERIFICACIÓN:\n', 'cyan');
  log(`✅ Verificaciones exitosas: ${passed}`, 'green');
  log(`❌ Verificaciones fallidas: ${failed}`, failed > 0 ? 'red' : 'green');

  const total = passed + failed;
  const percentage = Math.round((passed / total) * 100);

  log(`\n📈 Score de salud SEO: ${percentage}%`, percentage >= 90 ? 'green' : percentage >= 70 ? 'yellow' : 'red');

  // Siguientes pasos
  log('\n📋 PRÓXIMOS PASOS:\n', 'cyan');

  if (failed === 0) {
    log('🎉 ¡Excelente! Todos los checks pasaron.', 'green');
    log('\n✅ El sitio está listo para:');
    log('   1. Verificación en Google Search Console');
    log('   2. Envío de sitemap.xml');
    log('   3. Solicitud de indexación');
    log('\n📖 Consulta: GOOGLE_SEARCH_CONSOLE_SETUP.md para instrucciones detalladas', 'cyan');
  } else {
    log('⚠️  Hay algunos problemas que necesitan atención:', 'yellow');
    log('   1. Revisa los errores arriba marcados con ❌');
    log('   2. Corrige los problemas encontrados');
    log('   3. Vuelve a ejecutar este script');
  }

  // Verificar si el meta tag de Google está vacío
  log('\n🔍 VERIFICACIÓN ADICIONAL:', 'cyan');
  const indexContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

  if (indexContent.includes('google-site-verification" content=""')) {
    log('⚠️  Google Search Console NO verificado aún', 'yellow');
    log('   Acción: Añadir código de verificación en index.html línea 99', 'yellow');
    log('   Guía: GOOGLE_SEARCH_CONSOLE_SETUP.md - Paso 1', 'cyan');
  } else if (indexContent.includes('google-site-verification" content="')) {
    log('✅ Código de verificación de Google añadido', 'green');
    log('   Próximo paso: Hacer clic en "Verificar" en Google Search Console', 'green');
  }

  log('\n' + '='.repeat(50), 'blue');

  process.exit(failed > 0 ? 1 : 0);
}

// Ejecutar
try {
  runHealthCheck();
} catch (error) {
  log(`\n❌ Error durante la verificación: ${error.message}`, 'red');
  process.exit(1);
}
