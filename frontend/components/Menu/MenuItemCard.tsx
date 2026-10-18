'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MenuItem } from '@/types';
import { useCart } from '../Cart/CartProvider';

export default function MenuItemCard({ item }: { item: MenuItem }) {
  const { addToCart } = useCart();
  const sizes = item.sizes ? Object.keys(item.sizes) : [];
  const [size, setSize] = useState(sizes[0] ?? 'regular');
  const price = item.price ?? item.sizes?.[size] ?? 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold uppercase leading-tight text-primary-900">{item.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600" title={item.description}>
          {item.description}
        </p>

        {sizes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label={`${item.name} size`}>
            {sizes.map((s) => (
              <button
                key={s}
                role="radio"
                aria-checked={size === s}
                onClick={() => setSize(s)}
                className={`min-h-[36px] min-w-[36px] rounded-full px-3 text-sm font-bold transition ${
                  size === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-xl font-bold text-primary-600">₨{price}</span>
          <button
            onClick={() => addToCart({ id: item.id, name: item.name, price, size, image: item.image })}
            className="btn-primary !px-4 !py-2"
            aria-label={`Add ${item.name} to cart`}
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
