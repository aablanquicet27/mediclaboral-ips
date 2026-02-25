import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#1e40af',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://mediclaboral.com'),
  title: 'Cotizador - MedicLaboral IPS | Salud Ocupacional',
  description:
    'Cotizador automático de servicios de salud ocupacional. Exámenes ocupacionales, laboratorio clínico, SST. Exámenes en 1 hora, resultados en 4 horas.',
  keywords:
    'salud ocupacional, exámenes ocupacionales, laboratorio, SST, Cartagena, Colombia, cotizador, MedicLaboral',

  // Open Graph — WhatsApp, Facebook, LinkedIn
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://mediclaboral.com',
    title: 'MedicLaboral IPS - Cotizador de Salud Ocupacional',
    description:
      'Cotice servicios de salud ocupacional al instante. Exámenes en 1 hora, resultados en 4 horas.',
    siteName: 'MedicLaboral IPS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MedicLaboral IPS - Cotizador de Salud Ocupacional',
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

  // Favicons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [{ rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#1e40af' }],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  // Verificación Google (reemplazar con el token real cuando esté disponible)
  verification: {
    google: 'pendiente',
  },

  // Metadatos adicionales
  other: {
    'msapplication-TileColor': '#1e40af',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
