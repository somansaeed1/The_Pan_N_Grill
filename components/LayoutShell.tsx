"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/Cart/CartDrawer';
import ToastContainer from '@/components/Toast';
import LocationProvider from '@/components/LocationProvider';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCheckout = pathname?.startsWith('/checkout');

  return (
    <>
      {/* Show navbar only when not on checkout to create a distraction-free flow */}
      {!isCheckout && <Navbar />}

      {/* Main area. For checkout, center and enlarge content for focus. */}
      <main className={isCheckout ? 'min-h-screen bg-gray-50 pt-50' : 'min-h-screen'}>
        {children}
      </main>

      {/* Footer also hidden on checkout */}
      {!isCheckout && <Footer />}

      {/* Keep these global UI pieces available even on checkout */}
      <CartDrawer />
      <ToastContainer />
      <LocationProvider />
    </>
  );
}
