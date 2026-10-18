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
            className="absolute top-3 right-4 text-white text-4xl min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Close categories menu"
          >
            &times;
          </button>

          <div className="pt-14 sm:pt-16 px-4 sm:px-5">
            <h3 className="text-white text-xl sm:text-2xl font-bold pb-3">Items Available</h3>
            {categories.map((categoryId) => (
              <button
                key={categoryId}
                onClick={() => {
                  onCategoryClick(categoryId);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 sm:px-5 py-2.5 sm:py-3 transition-colors text-sm sm:text-base min-h-[44px] touch-manipulation ${
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
        className="fixed top-[85px] sm:top-[90px] left-3 sm:left-5 z-50 bg-primary-800 text-white p-2.5 sm:p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
        onClick={() => setIsOpen(true)}
        aria-label="Open food categories"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>
    </div>
  );
}