import sharp from 'sharp';

const width = 1200;
const height = 630;

// Crear fondo azul sólido más visible
const background = Buffer.from(`
<svg width="${width}" height="${height}">
  <rect width="${width}" height="${height}" fill="#1e40af"/>
  
  <!-- Título grande y visible -->
  <text x="600" y="400" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="white" text-anchor="middle">
    MedicLaboral IPS
  </text>
  <text x="600" y="470" font-family="Arial, sans-serif" font-size="36" fill="white" text-anchor="middle">
    Cotizador de Salud Ocupacional
  </text>
  <text x="600" y="540" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.9)" text-anchor="middle">
    ⚡ Exámenes en 1 hora • ✓ Resultados en 4 horas
  </text>
</svg>
`);

// Cargar logo y hacerlo más grande
const logo = await sharp('public/mediclaboral-logo.png')
  .resize(400, null, { fit: 'inside' })
  .toBuffer();

// Obtener dimensiones del logo
const logoMeta = await sharp(logo).metadata();

// Centrar el logo en la parte superior
const logoLeft = Math.floor((width - logoMeta.width) / 2);

// Componer
await sharp(background)
  .composite([
    { 
      input: logo, 
      top: 50, 
      left: logoLeft 
    }
  ])
  .png()
  .toFile('public/og-image-v2.png');

console.log('✅ og-image-v2.png creado con logo centrado');
