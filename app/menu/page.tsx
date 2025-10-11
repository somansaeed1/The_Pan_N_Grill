'use client';

import { useState, useEffect, useRef } from 'react';
import { menuData } from '@/lib/menuData';
import MenuCategory from '@/components/Menu/MenuCategory';
import MobileCategoryNav from '@/components/Menu/MobileCategoryNav';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const categories = Object.keys(menuData);

  const scrollToCategory = (categoryId: string) => {
    const element = categoryRefs.current[categoryId];
    if (element) {
      const navHeight = 160;
      const elementPosition = element.offsetTop - navHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
      setActiveCategory(categoryId);
    }
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY < 120) {
            ticking = false;
            return;
          }
          const scrollPosition = window.scrollY + 200;
          for (const categoryId of categories) {
            const element = categoryRefs.current[categoryId];
            if (
              element &&
              element.offsetTop <= scrollPosition &&
              element.offsetTop + element.offsetHeight > scrollPosition
            ) {
              setActiveCategory(categoryId);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  const filteredMenuData = search.trim()
    ? Object.fromEntries(
        categories
          .map((categoryId) => {
            const category = menuData[categoryId];
            const filteredItems = category.items.filter((item) =>
              item.name.toLowerCase().includes(search.trim().toLowerCase())
            );
            return [categoryId, { ...category, items: filteredItems }];
          })
          .filter(([_, cat]) => typeof cat === 'object' && cat !== null && 'items' in cat && cat.items.length > 0)
      )
    : menuData;

  const filteredCategories = Object.keys(filteredMenuData);

  return (
    <div className="pt-20">
      {/* Menu Header */}
      <section className="bg-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Our Menu</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Discover our authentic Pakistani cuisine with traditional flavors and modern presentation
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center py-6">
          <div className="relative w-full max-w-md mx-auto">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu items..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors text-lg"
            />
          </div>
        </div>
      </div>

      {/* Desktop Category Navigation */}
      <div className="hidden md:block menu-category-nav bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 space-x-6">
            {filteredCategories.map((categoryId) => (
              <button
                key={categoryId}
                onClick={() => scrollToCategory(categoryId)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === categoryId
                    ? 'bg-gold-500 text-white'
                    : 'text-gray-600 hover:text-primary-900 hover:bg-gray-100'
                }`}
              >
                {filteredMenuData[categoryId].name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Category Navigation */}
      <MobileCategoryNav
        categories={filteredCategories}
        categoryNames={Object.fromEntries(
          filteredCategories.map((id) => [id, filteredMenuData[id].name])
        )}
        activeCategory={activeCategory}
        onCategoryClick={scrollToCategory}
      />

      {/* Menu Categories Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredCategories.length === 0 ? (
          <div className="text-center text-gray-500 text-xl py-20">No menu items found.</div>
        ) : (
          filteredCategories.map((categoryId) => (
            <MenuCategory
              key={categoryId}
              categoryId={categoryId}
              category={filteredMenuData[categoryId]}
              ref={(el) => {
                categoryRefs.current[categoryId] = el;
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}