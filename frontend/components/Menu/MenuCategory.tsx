import { MenuCategory as MenuCategoryType } from '@/types';
import MenuItemCard from './MenuItemCard';

interface MenuCategoryProps {
  categoryId: string;
  category: MenuCategoryType;
}

export default function MenuCategory({ categoryId, category }: MenuCategoryProps) {
  return (
    <section id={categoryId} className="mb-12 scroll-mt-40">
      <h2 className="section-title mb-6 inline-block border-b-4 border-primary-600 pb-3">{category.name}</h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {category.items.map((item) => (
          <MenuItemCard key={item.id} item={item} categoryId={categoryId} />
        ))}
      </div>
    </section>
  );
}
