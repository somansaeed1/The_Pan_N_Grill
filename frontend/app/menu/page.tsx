'use client';

import { useEffect, useMemo, useState } from 'react';
import { menuData } from '@/lib/menuData';
import MenuCategory from '@/components/Menu/MenuCategory';

const ALL = 'all';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [search, setSearch] = useState('');

  // Support deep links such as /menu#fries from the home page.
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash in menuData) setActiveCategory(hash);
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return Object.entries(menuData)
      .filter(([id]) => activeCategory === ALL || id === activeCategory)
      .map(([id, category]) => ({
        id,
        category: {
          ...category,
          items: query ? category.items.filter((item) => item.name.toLowerCase().includes(query)) : category.items,
        },
      }))
      .filter(({ category }) => category.items.length > 0);
  }, [activeCategory, search]);

  const chip = (selected: boolean) =>
    `shrink-0 rounded-full px-4 py-2 min-h-[40px] text-sm font-bold uppercase tracking-wide transition ${
      selected ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <div className="pt-16">
      <section className="bg-primary-600 py-12 text-center text-white sm:py-16">
        <div className="container-page">
          <h1 className="mb-3 text-5xl uppercase sm:text-6xl">Our Menu</h1>
          <p className="mx-auto max-w-2xl text-lg text-white/90">
            Authentic Pakistani flavours, made fresh to order.
          </p>
        </div>
      </section>
      <div className="stripes" aria-hidden="true" />

      <div className="menu-category-nav border-b bg-white shadow-sm">
        <div className="container-page space-y-3 py-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the menu"
            aria-label="Search the menu"
            className="min-h-[44px] w-full rounded-full border border-gray-300 px-5 focus:border-primary-600 focus:ring-primary-600"
          />
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4" role="tablist" aria-label="Categories">
            <button role="tab" aria-selected={activeCategory === ALL} onClick={() => setActiveCategory(ALL)} className={chip(activeCategory === ALL)}>
              All
            </button>
            {Object.entries(menuData).map(([id, category]) => (
              <button key={id} role="tab" aria-selected={activeCategory === id} onClick={() => setActiveCategory(id)} className={chip(activeCategory === id)}>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page py-10">
        {visible.length === 0 ? (
          <p className="py-20 text-center text-xl text-gray-500">No menu items match your search.</p>
        ) : (
          visible.map(({ id, category }) => <MenuCategory key={id} categoryId={id} category={category} />)
        )}
      </div>
    </div>
  );
}
