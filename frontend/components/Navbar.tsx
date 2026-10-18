'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from './Cart/CartProvider';
import { CartIcon } from './icons';
import { NAV_ITEMS, SITE } from '@/lib/site';

export default function Navbar() {
  const pathname = usePathname();
  const { getTotalItems, setIsCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const count = getTotalItems();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  if (pathname?.startsWith('/checkout')) return null;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white transition-shadow ${scrolled ? 'shadow-card' : 'border-b border-gray-100'}`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <Image src="/images/pan_n_grill_logo.jpg" alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
          <span className="font-heading text-xl font-bold uppercase tracking-wide text-primary-900 sm:text-2xl">
            {SITE.name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Main">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`border-b-2 py-1 text-sm font-semibold uppercase tracking-wide transition-colors ${
                  active ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-700 hover:text-primary-600'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-primary-900 hover:bg-gray-100"
            aria-label={`Open cart, ${count} items`}
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-primary-900 hover:bg-gray-100 md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-gray-100 bg-white md:hidden" aria-label="Mobile">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-6 py-3 font-heading text-lg uppercase ${
                pathname === item.href ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
