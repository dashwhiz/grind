import type { Metadata, Viewport } from 'next'
import { Roboto, Orbitron, Roboto_Mono } from 'next/font/google'
import './globals.css'

const roboto = Roboto({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-roboto',
})

const orbitron = Orbitron({
  weight: ['700'],
  subsets: ['latin'],
  variable: '--font-orbitron',
})

const robotoMono = Roboto_Mono({
  weight: ['600'],
  subsets: ['latin'],
  variable: '--font-roboto-mono',
})

export const metadata: Metadata = {
  title: 'Interval Timer',
  description: 'CrossFit & HIIT Interval Timer',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0F0F0F' },
    { media: '(prefers-color-scheme: dark)', color: '#0F0F0F' },
  ],
  // viewport-fit=cover lets content extend under the notch/home indicator
  // so env(safe-area-inset-*) can be used for padding
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${roboto.variable} ${orbitron.variable} ${robotoMono.variable}`} style={{ fontFamily: 'var(--font-roboto), sans-serif' }}>
      <body style={{ fontFamily: 'var(--font-roboto), sans-serif', margin: 0, padding: 0, background: '#0F0F0F', minHeight: '100vh' }}>
        {/* Safari samples these fixed elements for toolbar tinting */}
        <div id="safari-top" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 1, background: '#0F0F0F', zIndex: 999999, pointerEvents: 'none' }} />
        <div id="safari-bottom" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 1, background: '#0F0F0F', zIndex: 999999, pointerEvents: 'none' }} />
        {children}
      </body>
    </html>
  )
}
