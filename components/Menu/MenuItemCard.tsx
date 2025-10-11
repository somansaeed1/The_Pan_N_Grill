'use client';

import { useState } from 'react';
import { MenuItem } from '@/types';
import { useCart } from '../Cart/CartProvider';

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(
    item.sizes ? Object.keys(item.sizes)[0] : 'regular'
  );
  const [isLoading, setIsLoading] = useState(false);

  const getPrice = () => {
    if (item.price) return item.price;
    if (item.sizes && selectedSize) return item.sizes[selectedSize];
    return 0;
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const cartItem = {
      id: item.id,
      name: item.name,
      price: getPrice(),
      size: selectedSize || 'regular',
      image: item.image || '',
    };
    addToCart(cartItem);
    setIsLoading(false);
  };

  return (
    <article className="menu-item-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
      <div className="aspect-w-16 aspect-h-12 flex-shrink-0">
        <img
          src={item.image || `/placeholder.svg?height=200&width=300`}
          alt={`${item.name} - Authentic Pakistani cuisine at The Pan N Grill`}
          className="w-full h-full object-cover object-center"
          style={{ height: '180px' }}
        />
      </div>

      <div className="p-4 md:p-6 flex flex-col flex-1">
        <h3 className="text-base md:text-xl font-heading font-semibold text-primary-900 mb-2">
          {item.name}
        </h3>

        {item.sizes && (
          <div className="mb-4">
            <fieldset>
              <legend className="text-sm text-gray-600 mb-2">Size:</legend>
              <div className="flex space-x-2" role="radiogroup">
                {Object.keys(item.sizes).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'bg-gold-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    role="radio"
                    aria-checked={selectedSize === size}
                    aria-label={`Size ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        <div className="flex items-center justify-between mb-4 mt-auto">
          <div>
            {item.price ? (
              <span className="text-xl md:text-2xl font-bold text-gold-600">₨{item.price}</span>
            ) : item.sizes ? (
              <div>
                <span className="text-xl md:text-2xl font-bold text-gold-600">
                  ₨{item.sizes[selectedSize]}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full bg-primary-900 hover:bg-primary-800 disabled:bg-gray-400 text-white py-2 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-colors mt-auto"
          aria-label={`Add ${item.name} to cart`}
        >
          {isLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
}