'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './Cart/CartProvider';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  // Hide the Navbar completely on checkout page to create a distraction-free experience
  if (pathname?.startsWith('/checkout')) return null;
  const { getTotalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  const navItems = [
    { id: '/', label: 'Home' },
    { id: '/about', label: 'About' },
    { id: '/menu', label: 'Menu' },
    { id: '/gallery', label: 'Gallery' },
    { id: '/contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <img
              src="/images/pan_n_grill_logo.jpg"
              alt="The Pan N Grill Logo"
              className="h-16 w-16 md:h-16 md:w-16 object-contain"
            />
            <Link
              href="/"
              className="text-xl sm:text-2xl md:text-3xl font-logo font-normal text-primary-900 hover:text-primary-700 transition-colors"
            >
              The Pan N Grill
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.id}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === item.id
                      ? 'text-primary-900 border-b-2 border-gold-500'
                      : 'text-gray-700 hover:text-primary-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-primary-900 transition-colors"
              aria-label={`View cart - ${getTotalItems()} items`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
                />
              </svg>
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-primary-900 transition-colors"
                aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.id}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors ${
                    pathname === item.id
                      ? 'text-primary-900 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}