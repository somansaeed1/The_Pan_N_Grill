'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MenuItem } from '@/types';
import { ADD_ONS_BY_CATEGORY, UNAVAILABLE_ITEM_IDS } from '@/lib/catalog';
import { formatPrice } from '@/lib/cartUtils';
import { useCart } from '../Cart/CartProvider';

interface MenuItemCardProps {
  item: MenuItem;
  categoryId: string;
}

export default function MenuItemCard({ item, categoryId }: MenuItemCardProps) {
  const { addToCart } = useCart();
  const sizes = item.sizes ? Object.keys(item.sizes) : [];
  const addOnOptions = ADD_ONS_BY_CATEGORY[categoryId] ?? [];
  const available = item.available !== false && !UNAVAILABLE_ITEM_IDS.has(item.id);

  const [size, setSize] = useState(sizes[0] ?? 'regular');
  const [selected, setSelected] = useState<string[]>([]);

  const basePrice = item.price ?? item.sizes?.[size] ?? 0;
  const chosenAddOns = addOnOptions.filter((a) => selected.includes(a.id));
  const price = basePrice + chosenAddOns.reduce((sum, a) => sum + a.price, 0);

  const toggleAddOn = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleAdd = () => {
    addToCart({ id: item.id, name: item.name, price: basePrice, size, addOns: chosenAddOns, image: item.image });
    setSelected([]);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, 50vw"
          className={`object-cover transition duration-500 group-hover:scale-110 ${available ? '' : 'grayscale'}`}
        />
        {!available && (
          <span className="absolute left-3 top-3 rounded-full bg-primary-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Sold out
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold uppercase leading-tight text-primary-900">{item.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600" title={item.description}>
          {item.description}
        </p>

        {available && sizes.length > 0 && (
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

        {available && addOnOptions.length > 0 && (
          <fieldset className="mt-3 space-y-1">
            <legend className="sr-only">{item.name} add-ons</legend>
            {addOnOptions.map((addOn) => (
              <label key={addOn.id} className="flex min-h-[32px] cursor-pointer items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={selected.includes(addOn.id)}
                  onChange={() => toggleAddOn(addOn.id)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                />
                <span className="flex-1">{addOn.name}</span>
                <span className="text-gray-500">+{formatPrice(addOn.price)}</span>
              </label>
            ))}
          </fieldset>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="text-xl font-bold text-primary-600">{formatPrice(price)}</span>
          <button
            onClick={handleAdd}
            disabled={!available}
            className="btn-primary !px-4 !py-2"
            aria-label={available ? `Add ${item.name} to cart` : `${item.name} is sold out`}
          >
            {available ? 'Add' : 'Sold out'}
          </button>
        </div>
      </div>
    </article>
  );
}
