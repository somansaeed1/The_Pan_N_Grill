'use client';

import { forwardRef } from 'react';
import { MenuCategory as MenuCategoryType } from '@/types';
import MenuItemCard from './MenuItemCard';

interface MenuCategoryProps {
  categoryId: string;
  category: MenuCategoryType;
}

const MenuCategory = forwardRef<HTMLElement, MenuCategoryProps>(
  ({ categoryId, category }, ref) => {
    return (
      <section ref={ref} className="mb-16">
        <h2 className="text-3xl font-heading font-bold text-primary-900 mb-8 border-b-2 border-gold-500 pb-4">
          {category.name}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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