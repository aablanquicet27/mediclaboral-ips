/**
 * Script para generar todos los assets de imagen para MedicLaboral IPS
 * Ejecutar con: node scripts/generate-assets.mjs
 */

import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');

// ─── SVG base del ícono (cruz médica con fondo azul) ────────────────────────
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#1e40af"/>
  <!-- Cruz médica -->
  <rect x="40" y="20" width="20" height="60" rx="4" fill="white"/>
  <rect x="20" y="40" width="60" height="20" rx="4" fill="white"/>
</svg>`;

// ─── SVG para safari-pinned-tab (monocromático, negro) ──────────────────────
const safariSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="black"/>
  <rect x="40" y="20" width="20" height="60" rx="4" fill="white"/>
  <rect x="20" y="40" width="60" height="20" rx="4" fill="white"/>
</svg>`;

// ─── SVG og-image (1200x630) ─────────────────────────────────────────────────
const ogImageSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a8a"/>
      <stop offset="100%" style="stop-color:#2563eb"/>
    </linearGradient>
    <linearGradient id="card" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(255,255,255,0.12)"/>
      <stop offset="100%" style="stop-color:rgba(255,255,255,0.04)"/>
    </linearGradient>
  </defs>

  <!-- Fondo -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Círculos decorativos -->
  <circle cx="1050" cy="100" r="180" fill="rgba(255,255,255,0.05)"/>
  <circle cx="150" cy="530" r="140" fill="rgba(255,255,255,0.04)"/>
  <circle cx="1100" cy="550" r="90" fill="rgba(59,130,246,0.3)"/>

  <!-- Card central -->
  <rect x="80" y="80" width="1040" height="470" rx="24" fill="url(#card)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>

  <!-- Ícono logo -->
  <rect x="120" y="130" width="90" height="90" rx="18" fill="white"/>
  <rect x="150" y="148" width="30" height="54" rx="5" fill="#1e40af"/>
  <rect x="130" y="168" width="70" height="14" rx="5" fill="#1e40af"/>

  <!-- Nombre empresa -->
  <text x="230" y="175" font-family="Arial, sans-serif" font-size="48" font-weight="700" fill="white">MedicLaboral IPS</text>
  <text x="230" y="210" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.75)">Salud Ocupacional · Medicina Laboral</text>

  <!-- Línea separadora -->
  <line x1="120" y1="250" x2="1080" y2="250" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>

  <!-- Título principal -->
  <text x="600" y="330" font-family="Arial, sans-serif" font-size="60" font-weight="800" fill="white" text-anchor="middle">Cotizador en Línea</text>
  <text x="600" y="390" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.85)" text-anchor="middle">Exámenes Ocupacionales · Laboratorio · SST</text>

  <!-- Badges -->
  <rect x="195" y="430" width="260" height="52" rx="26" fill="rgba(255,255,255,0.15)"/>
  <text x="325" y="462" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">⏱ Exámenes en 1 hora</text>

  <rect x="470" y="430" width="260" height="52" rx="26" fill="rgba(255,255,255,0.15)"/>
  <text x="600" y="462" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">📋 Resultados en 4 horas</text>

  <rect x="745" y="430" width="260" height="52" rx="26" fill="rgba(255,255,255,0.15)"/>
  <text x="875" y="462" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">📍 Cartagena, Colombia</text>

  <!-- URL -->
  <text x="600" y="525" font-family="Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.55)" text-anchor="middle">mediclaboral.com</text>
</svg>`;

async function generate() {
  const iconBuf = Buffer.from(iconSvg);

  // favicon-32x32.png
  await sharp(iconBuf).resize(32, 32).png().toFile(join(PUBLIC, 'favicon-32x32.png'));
  console.log('✓ favicon-32x32.png');

  // favicon-16x16.png
  await sharp(iconBuf).resize(16, 16).png().toFile(join(PUBLIC, 'favicon-16x16.png'));
  console.log('✓ favicon-16x16.png');

  // apple-touch-icon.png 180x180
  await sharp(iconBuf).resize(180, 180).png().toFile(join(PUBLIC, 'apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png');

  // android-chrome-192x192.png
  await sharp(iconBuf).resize(192, 192).png().toFile(join(PUBLIC, 'android-chrome-192x192.png'));
  console.log('✓ android-chrome-192x192.png');

  // android-chrome-512x512.png
  await sharp(iconBuf).resize(512, 512).png().toFile(join(PUBLIC, 'android-chrome-512x512.png'));
  console.log('✓ android-chrome-512x512.png');

  // favicon.ico — usar 32x32 PNG como base y guardar como .ico
  // (sharp no genera .ico nativo, usamos el PNG de 32px renombrado;
  //  los navegadores modernos aceptan PNG con extensión .ico)
  const ico32 = await sharp(iconBuf).resize(32, 32).png().toBuffer();
  writeFileSync(join(PUBLIC, 'favicon.ico'), ico32);
  console.log('✓ favicon.ico');

  // safari-pinned-tab.svg
  writeFileSync(join(PUBLIC, 'safari-pinned-tab.svg'), safariSvg);
  console.log('✓ safari-pinned-tab.svg');

  // og-image.png 1200x630
  await sharp(Buffer.from(ogImageSvg)).resize(1200, 630).png().toFile(join(PUBLIC, 'og-image.png'));
  console.log('✓ og-image.png');

  console.log('\n✅ Todos los assets generados correctamente.');
}

generate().catch((err) => {
  console.error('Error generando assets:', err);
  process.exit(1);
});
