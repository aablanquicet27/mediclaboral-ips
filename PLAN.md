# PLAN: Mejorar MedicLaboral Cotizador - Versión Profesional

## Base
Proyecto copiado de `mediclaboral-cotizador-v2` (ya funcional y hermoso).

## MEJORAS A IMPLEMENTAR

### 1. Favicon Profesional
**`public/favicon.ico`**
- Crear SVG con cruz médica o estetoscopio en azul (#1e40af)
- Convertir a .ico multi-resolución (16x16, 32x32, 48x48)
- Colores: azul médico sobre fondo blanco

**`public/apple-touch-icon.png`**
- 180x180px para iOS
- Mismo diseño del favicon

**`public/favicon-32x32.png` y `public/favicon-16x16.png`**
- Versiones PNG del favicon

### 2. Meta Tags Open Graph (Preview en WhatsApp/Redes)
**Actualizar `app/layout.tsx` con:**

```typescript
export const metadata: Metadata = {
  title: "Cotizador - MedicLaboral IPS | Salud Ocupacional",
  description: "Cotizador automático de servicios de salud ocupacional. Exámenes ocupacionales, laboratorio clínico, SST. Exámenes en 1 hora, resultados en 4 horas.",
  keywords: "salud ocupacional, exámenes ocupacionales, laboratorio, SST, Cartagena, Colombia, cotizador, MedicLaboral",
  
  // Open Graph para WhatsApp, Facebook, LinkedIn
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://mediclaboral.com',
    title: 'MedicLaboral IPS - Cotizador de Salud Ocupacional',
    description: 'Cotice servicios de salud ocupacional al instante. Exámenes en 1 hora, resultados en 4 horas.',
    siteName: 'MedicLaboral IPS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MedicLaboral IPS - Cotizador',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'MedicLaboral IPS - Cotizador',
    description: 'Cotice servicios de salud ocupacional al instante',
    images: ['/og-image.png'],
  },
  
  // PWA
  manifest: '/manifest.json',
  
  // Tema
  themeColor: '#1e40af',
  
  // Otros
  robots: {
    index: true,
    follow: true,
  },
  
  // Verificaciones
  verification: {
    google: 'pendiente',
    // yandex, bing si aplica
  },
};
```

### 3. Imagen de Preview (og-image.png)
**`public/og-image.png`** (1200x630px)
- Fondo: gradient azul médico (#1e40af a #3b82f6)
- Logo/texto: "MedicLaboral IPS"
- Subtítulo: "Cotizador de Salud Ocupacional"
- Iconos: estetoscopio, documento, checkmark
- Texto: "Exámenes en 1 hora • Resultados en 4 horas"
- Estilo: profesional, limpio, moderno

**Crear con Canvas API o exportar desde diseño**

### 4. PWA Manifest
**`public/manifest.json`**
```json
{
  "name": "MedicLaboral IPS - Cotizador",
  "short_name": "MedicLaboral",
  "description": "Cotizador de servicios de salud ocupacional",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1e40af",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 5. Iconos Adicionales
**Crear y agregar a `public/`:**
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
- `apple-touch-icon.png` (180x180)
- `safari-pinned-tab.svg` (monocromático)

### 6. Actualizar HTML Head
**En `app/layout.tsx` agregar links:**
```tsx
<head>
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/manifest.json" />
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#1e40af" />
  <meta name="msapplication-TileColor" content="#1e40af" />
  <meta name="theme-color" content="#1e40af" />
</head>
```

### 7. robots.txt y sitemap.xml
**`public/robots.txt`**
```
User-agent: *
Allow: /
Sitemap: https://mediclaboral.com/sitemap.xml
```

**`app/sitemap.ts`**
```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://mediclaboral.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
```

### 8. README Profesional
Actualizar README.md con:
- Logo/banner
- Badges (Next.js, TypeScript, Vercel)
- Screenshots
- Features destacados
- Instrucciones claras
- Créditos a AGAPAI

---

## IMPORTANTE
- Mantener toda la funcionalidad existente del v2
- Solo agregar/mejorar lo listado arriba
- Código limpio y comentado
- Todo funcional antes de commit

## Al terminar
1. `git init`
2. `git add -A`
3. `git commit -m "feat: cotizador profesional con meta tags y favicon"`
4. Crear repo `mediclaboral-cotizador` en GitHub
5. Push
6. Deploy a Vercel
7. Configurar dominio custom si está disponible

---

**Ejecutar completamente. No dejar nada sin hacer.**
