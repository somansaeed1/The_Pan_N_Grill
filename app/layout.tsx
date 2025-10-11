import type { Metadata } from 'next';
import { Poppins, Playfair_Display, Dancing_Script, Great_Vibes, Allura, Alex_Brush } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/Cart/CartProvider';
import LayoutShell from '@/components/LayoutShell';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
});

const dancing = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dancing',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes',
});

const allura = Allura({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-allura',
});

const alexBrush = Alex_Brush({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-alex-brush',
});

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${playfair.variable} ${dancing.variable} ${greatVibes.variable} ${allura.variable} ${alexBrush.variable}`}>
      <body className="font-body bg-white text-gray-800">
        <CartProvider>
          <LayoutShell>{children}</LayoutShell>
        </CartProvider>
      </body>
    </html>
  );
}
