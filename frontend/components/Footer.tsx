'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white py-6 sm:py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo and Description */}
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-logo font-normal text-gold-400 mb-3 sm:mb-4">
              The Pan N Grill
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-3 max-w-md leading-relaxed">
              Experience authentic Pakistani cuisine in the heart of Jhang. We serve traditional
              flavors with modern presentation, creating memorable dining experiences for our valued
              customers.
            </p>
            <div className="flex space-x-3 sm:space-x-2">
              <motion.a
                href="https://www.facebook.com/share/1AgzKa1R8s/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold-400 transition-colors p-2"
                aria-label="Facebook"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </motion.a>
              <motion.a
                href="https://wa.me/923456500649"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold-400 transition-colors p-2"
                aria-label="WhatsApp"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3">Quick Links</h4>
            <ul className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm md:text-base">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/menu", label: "Menu" },
                { href: "/contact", label: "Contact Us" }
              ].map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                >
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-gold-400 transition-all duration-300 inline-block py-1"
                  >
                    <motion.span
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3">Contact Info</h4>
            <div className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm md:text-base text-gray-300">
              <p>
                Phone:{' '}
                <a href="tel:03181717763" className="hover:text-gold-400 transition-colors">
                  0318-1717763
                </a>
              </p>
              <p>
                Phone:{' '}
                <a href="tel:03217320055" className="hover:text-gold-400 transition-colors">
                  0321-7320055
                </a>
              </p>
              <p>
                WhatsApp:{' '}
                <a
                  href="https://wa.me/923456500649"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 transition-colors"
                >
                  0345-6500649
                </a>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Copyright Section - Fixed visibility */}
        <div className="border-t border-gray-800 mt-5 sm:mt-6 md:mt-8 pt-4 sm:pt-5 md:pt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-300">
            &copy; 2025 The Pan N Grill. All rights reserved. | Authentic Pakistani Cuisine
          </p>
        </div>
      </div>
    </footer>
  );
}
