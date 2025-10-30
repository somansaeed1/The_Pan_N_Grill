'use client';

import { forwardRef } from 'react';
import { MenuCategory as MenuCategoryType } from '@/types';
import MenuItemCard from './MenuItemCard';

interface MenuCategoryProps {
  categoryId: string;
  category: MenuCategoryType;
  /** Optional responsive column counts. Example: { base: 2, md: 3, lg: 4 } */
  columns?: {
    base?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

const MenuCategory = forwardRef<HTMLElement, MenuCategoryProps>(
  ({ categoryId, category, columns = {} }, ref) => {
    // Use fixed grid classes instead of dynamic ones for Tailwind
    return (
      <section ref={ref} className="mb-12 sm:mb-14 md:mb-16">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary-900 mb-6 sm:mb-8 border-b-2 border-gold-500 pb-3 sm:pb-4">
          {category.name}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
          {category.items.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    );
  }
);

MenuCategory.displayName = 'MenuCategory';

export default MenuCategory;