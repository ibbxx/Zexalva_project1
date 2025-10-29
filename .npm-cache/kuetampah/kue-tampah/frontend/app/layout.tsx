import type { Metadata } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';

import { AppProviders } from '@/components/AppProviders';
import { Footer } from '@/components/Footer';
import { FloatingCart } from '@/components/FloatingCart';
import { Navbar } from '@/components/Navbar';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-brand',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Kue Tampah | Katering & Kue Tradisional',
    template: '%s | Kue Tampah',
  },
  description:
    'Pesan kue tampah, jajan pasar, dan tumpeng mini dengan mudah. Checkout via WhatsApp atau QRIS dan nikmati pengingat otomatis.',
  keywords: [
    'kue tampah',
    'jajan pasar',
    'katering tradisional',
    'kue nusantara',
    'pesan kue bandung',
  ],
  metadataBase: new URL('https://kue-tampah.example.com'),
  openGraph: {
    title: 'Kue Tampah',
    description:
      'Koleksi kue tradisional premium dengan pengalaman pemesanan yang mudah dan cepat.',
    url: 'https://kue-tampah.example.com',
    siteName: 'Kue Tampah',
    images: [{ url: '/hero-dessert.jpg', width: 1200, height: 630, alt: 'Kue Tampah' }],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kue Tampah',
    description: 'Pemesanan kue tradisional modern & cepat.',
    images: ['/hero-dessert.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="bg-[var(--brand-surface)]">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec407a" />
      </head>
      <body className={`${poppins.variable} ${playfair.variable} font-sans bg-background text-foreground antialiased`}>
        <AppProviders>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
          <FloatingCart />
        </AppProviders>
      </body>
    </html>
  );
}
