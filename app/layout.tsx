import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/Cart/CartProvider';
import LayoutShell from '@/components/LayoutShell';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body bg-white text-gray-800">
        <CartProvider>
          <LayoutShell>{children}</LayoutShell>
        </CartProvider>
      </body>
    </html>
  );
}
