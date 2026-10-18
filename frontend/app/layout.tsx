import type { Metadata, Viewport } from 'next';
import { Oswald, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/Cart/CartProvider';
import LayoutShell from '@/components/LayoutShell';

const heading = Oswald({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  title: 'The Pan N Grill',
  description:
    'Experience authentic Pakistani cuisine at The Pan N Grill in Jhang. Fresh pizzas, shawarmas, burgers, and traditional dishes. Order online or visit us at Adhiwal Chowk.',
  keywords: 'Pakistani restaurant, Jhang, pizza, shawarma, burger, authentic cuisine, delivery',
  openGraph: {
    title: 'The Pan N Grill - Authentic Pakistani Taste',
    description:
      'Experience authentic Pakistani cuisine at The Pan N Grill in Jhang. Fresh pizzas, shawarmas, burgers, and traditional dishes.',
    url: 'https://thepanngrill.com',
    siteName: 'The Pan N Grill',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="font-body">
        <CartProvider>
          <LayoutShell>{children}</LayoutShell>
        </CartProvider>
      </body>
    </html>
  );
}
