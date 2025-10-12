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
    const base = columns.base ?? 2;
    const md = columns.md ?? 3;
    const lg = columns.lg ?? 4;
    const xl = columns.xl;

    const gridClasses = `grid grid-cols-${base} md:grid-cols-${md} lg:grid-cols-${lg}` +
      (xl ? ` xl:grid-cols-${xl}` : '') +
      ' gap-4';
    return (
      <section ref={ref} className="mb-16">
        <h2 className="text-3xl font-heading font-bold text-primary-900 mb-8 border-b-2 border-gold-500 pb-4">
          {category.name}
        </h2>
        <div className={gridClasses}>
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