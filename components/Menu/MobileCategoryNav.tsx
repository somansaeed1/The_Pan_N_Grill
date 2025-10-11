'use client';

import { useState } from 'react';

interface MobileCategoryNavProps {
  categories: string[];
  categoryNames: { [key: string]: string };
  activeCategory: string | null;
  onCategoryClick: (categoryId: string) => void;
}

export default function MobileCategoryNav({
  categories,
  categoryNames,
  activeCategory,
  onCategoryClick,
}: MobileCategoryNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-95 z-[1000]' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-[280px] bg-black transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-6 text-white text-4xl"
            aria-label="Close categories menu"
          >
            &times;
          </button>

          <div className="pt-16 px-5">
            <h3 className="text-white text-2xl font-bold pb-3">Items Available</h3>
            {categories.map((categoryId) => (
              <button
                key={categoryId}
                onClick={() => {
                  onCategoryClick(categoryId);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-5 py-3 transition-colors ${
                  activeCategory === categoryId
                    ? 'bg-gold-500 text-white rounded-md'
                    : 'text-white hover:bg-white/5'
                }`}
              >
                {categoryNames[categoryId]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        className="fixed top-[90px] left-5 z-50 bg-primary-800 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
        aria-label="Open food categories"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>
    </div>
  );
}