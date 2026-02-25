import sharp from 'sharp';
import { readFileSync } from 'fs';

const width = 1200;
const height = 630;

// Background gradient SVG
const background = `
<svg width="${width}" height="${height}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#60a5fa;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#grad)"/>
  
  <!-- Texto -->
  <text x="600" y="320" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="white" text-anchor="middle">
    Cotizador de Salud Ocupacional
  </text>
  <text x="600" y="380" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.95)" text-anchor="middle">
    Exámenes Ocupacionales • Laboratorio Clínico • SST
  </text>
  
  <!-- Badge inferior -->
  <rect x="300" y="520" width="600" height="60" rx="10" fill="rgba(255,255,255,0.15)"/>
  <text x="600" y="560" font-family="Arial, sans-serif" font-size="26" font-weight="600" fill="white" text-anchor="middle">
    ⚡ Exámenes en 1 hora • ✓ Resultados en 4 horas
  </text>
</svg>
`;

// Cargar y redimensionar logo
const logo = await sharp('public/mediclaboral-logo.png')
  .resize(280, null, { fit: 'inside', withoutEnlargement: true })
  .toBuffer();

// Componer imagen final
await sharp(Buffer.from(background))
  .composite([
    { input: logo, top: 60, left: 460 }
  ])
  .png()
  .toFile('public/og-image-new.png');

console.log('✅ og-image-new.png creado');
