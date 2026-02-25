# MedicLaboral IPS — Cotizador Web

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)
![License](https://img.shields.io/badge/Licencia-Privada-red)

Cotizador premium de servicios de salud ocupacional para **MedicLaboral IPS**.
Formulario multi-step con diseño glassmorphism, animaciones suaves, generación de PDF profesional y botón de WhatsApp.

---

## Características

- **Formulario multi-step** — 5 pasos guiados con barra de progreso animada
- **Cotización instantánea** — cálculo en tiempo real con IVA
- **PDF profesional** — descarga con logo, desglose de servicios y datos de contacto
- **Compartir por WhatsApp** — mensaje pre-armado con el resumen de la cotización
- **SEO completo** — Open Graph, Twitter Card, manifest PWA, sitemap, robots.txt
- **Diseño responsive** — glassmorphism, optimizado para móvil y escritorio
- **Exámenes en 1 hora · Resultados en 4 horas**

---

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 16 (App Router) | Framework principal |
| TypeScript | 5 | Tipado estático |
| Tailwind CSS | 4 | Estilos utilitarios |
| Framer Motion | 12 | Animaciones y transiciones |
| jsPDF | 4 | Generación de PDF |
| Lucide React | 0.575 | Iconografía |

---

## Estructura del proyecto

```
app/
├── components/
│   ├── ProgressBar.tsx        # Barra de progreso multi-step
│   ├── Step1Empresa.tsx       # Paso 1: datos empresa + validación
│   ├── Step2Examenes.tsx      # Paso 2: exámenes ocupacionales
│   ├── Step3Adicionales.tsx   # Paso 3: audio / visio / espiro
│   ├── Step4Laboratorio.tsx   # Paso 4: paquete de laboratorio
│   ├── Step5SST.tsx           # Paso 5: servicios SST
│   ├── QuotationResult.tsx    # Vista de cotización + acciones
│   └── Toast.tsx              # Sistema de notificaciones
├── lib/
│   └── calculos.ts            # Precios, cálculos y formateo
├── types/
│   └── index.ts               # Interfaces TypeScript
├── utils/
│   └── pdf.ts                 # Generador de PDF con jsPDF
├── globals.css                # Tokens de diseño, glassmorphism
├── layout.tsx                 # Layout raíz + metadata SEO completa
├── sitemap.ts                 # Sitemap dinámico para buscadores
└── page.tsx                   # Orquestador del formulario

public/
├── favicon.ico                # Favicon principal
├── favicon-16x16.png          # Favicon 16px
├── favicon-32x32.png          # Favicon 32px
├── apple-touch-icon.png       # Ícono iOS 180x180
├── android-chrome-192x192.png # Ícono Android 192px
├── android-chrome-512x512.png # Ícono Android 512px
├── safari-pinned-tab.svg      # Safari pinned tab (monocromático)
├── og-image.png               # Preview WhatsApp/redes 1200x630
├── manifest.json              # PWA manifest
└── robots.txt                 # Instrucciones para buscadores
```

---

## Servicios y precios

| Servicio | Precio | Unidad |
|---|---|---|
| Examen ocupacional ingreso | $45.000 | Por empleado |
| Examen ocupacional periódico | $40.000 | Por empleado |
| Examen ocupacional egreso | $35.000 | Por empleado |
| Audiometría | $20.000 | Por empleado |
| Visiometría | $15.000 | Por empleado |
| Espirometría | $25.000 | Por empleado |
| Laboratorio básico | $25.000 | Por empleado |
| Laboratorio completo | $45.000 | Por empleado |
| SST básico | $150.000 | Precio fijo |
| SST completo | $500.000 | Precio fijo |

> Para actualizar precios edite `app/lib/calculos.ts` → objeto `PRECIOS`.

---

## Flujo del cotizador

1. **Empresa** — nombre, NIT, contacto, teléfono, email, # empleados
2. **Exámenes** — ingreso / periódico / egreso (selección múltiple)
3. **Paraclínicos** — audiometría / visiometría / espirometría
4. **Laboratorio** — ninguno / básico / completo
5. **SST** — ninguno / básico / completo
6. **Resultado** — desglose, total con IVA, PDF, WhatsApp

---

## Inicio rápido

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Personalización

### Cambiar precios

```ts
// app/lib/calculos.ts
export const PRECIOS = {
  examenes: {
    ingreso: 45000,  // ← editar aquí
    ...
  },
  ...
};
```

### Cambiar número de WhatsApp

```ts
// app/components/QuotationResult.tsx
window.open(`https://wa.me/57XXXXXXXXXX?text=${mensaje}`, '_blank');
```

### Cambiar datos de contacto en el PDF

```ts
// app/utils/pdf.ts  — sección "CTA"
doc.text('601 700 0000  ·  info@mediclaboral.com', ...);
```

### Regenerar assets de imagen

```bash
node scripts/generate-assets.mjs
```

---

## Build de producción

```bash
npm run build
npm start
```

---

## Deploy en Vercel

1. Conectar repositorio en [vercel.com](https://vercel.com)
2. Framework: **Next.js** (detectado automáticamente)
3. Variables de entorno: ninguna requerida
4. Deploy automático en cada push a `main`

---

## Créditos

Desarrollado por **AGAPAI** para MedicLaboral IPS.

---

## Licencia

Uso interno — MedicLaboral IPS © 2025
