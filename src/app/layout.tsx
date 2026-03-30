import type { Metadata, Viewport } from 'next'
import { Roboto, Orbitron, Roboto_Mono } from 'next/font/google'
import BfcacheGuard from '@/components/BfcacheGuard'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'

const roboto = Roboto({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

const orbitron = Orbitron({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
})

const robotoMono = Roboto_Mono({
  weight: ['600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

const SITE_URL = 'https://grind-timer.fit'
const TITLE = 'Grind — Free Interval Timer for HIIT, Tabata, CrossFit & Custom Workouts'
const DESCRIPTION = 'Free online interval timer for HIIT, Tabata, CrossFit EMOM, AMRAP, boxing rounds, and custom workouts. No downloads, no ads, no account required. Build your own intervals, share with friends, and train anywhere — works on mobile and desktop.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s | Grind Timer',
  },
  description: DESCRIPTION,
  keywords: [
    'interval timer', 'HIIT timer', 'Tabata timer', 'CrossFit timer',
    'EMOM timer', 'AMRAP timer', 'workout timer', 'boxing timer',
    'round timer', 'custom interval timer', 'free workout timer',
    'online timer', 'fitness timer', 'training timer', 'circuit timer',
    'rest timer', 'exercise timer', 'gym timer', 'Pomodoro timer',
  ],
  manifest: '/manifest.json',
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Grind',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/Icon-192.png',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'Grind',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/icons/Icon-512.png',
        width: 512,
        height: 512,
        alt: 'Grind Interval Timer',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/icons/Icon-512.png'],
  },
  category: 'fitness',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0d1117' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1117' },
  ],
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${roboto.variable} ${orbitron.variable} ${robotoMono.variable}`} style={{ fontFamily: 'var(--font-roboto), sans-serif' }}>
      <body style={{ fontFamily: 'var(--font-roboto), sans-serif', margin: 0, padding: 0, background: '#0d1117', minHeight: '100vh' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Grind',
            url: SITE_URL,
            description: DESCRIPTION,
            applicationCategory: 'HealthApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'Custom interval timers',
              'HIIT and Tabata presets',
              'CrossFit EMOM and AMRAP timers',
              'Boxing round timer',
              'Shareable workouts via link',
              'Works offline as PWA',
              'No account required',
            ],
          }) }}
        />
        <GoogleAnalytics />
        <BfcacheGuard />
        {children}
      </body>
    </html>
  )
}
