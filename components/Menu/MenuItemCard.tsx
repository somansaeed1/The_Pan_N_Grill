'use client';

import { useState } from 'react';
import { MenuItem } from '@/types';
import { useCart } from '../Cart/CartProvider';
import { motion } from 'framer-motion';

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
    <motion.article 
      className="menu-item-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20
      }}
    >
      <div className="flex-shrink-0 w-full overflow-hidden">
        <div className="w-full h-56 sm:h-64 md:h-56 lg:h-60 xl:h-64 relative">
          <motion.img
            src={item.image || `/placeholder.svg?height=200&width=300`}
            alt={`${item.name} - Authentic Pakistani cuisine at The Pan N Grill`}
            className="w-full h-full object-cover object-center absolute inset-0"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col flex-1">
        <h3 className="text-base sm:text-lg md:text-xl font-heading font-semibold text-primary-900 mb-1 sm:mb-2">
          {item.name}
        </h3>
        
        <div 
          className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed line-clamp-2 cursor-help relative group"
          title={item.description}
        >
          {item.description}
          {/* Tooltip on hover */}
          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 sm:w-80 bg-gray-900 text-white text-xs sm:text-sm p-3 rounded-lg shadow-xl z-50 pointer-events-none">
            <div className="leading-relaxed">{item.description}</div>
            <div className="absolute left-4 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
          </div>
        </div>

        {item.sizes && (
          <div className="mb-3 sm:mb-4">
            <fieldset>
              <legend className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Size:</legend>
              <div className="flex flex-wrap gap-1.5 sm:gap-2" role="radiogroup">
                {Object.keys(item.sizes).map((size) => (
                  <motion.button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                      selectedSize === size
                        ? 'bg-gold-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    role="radio"
                    aria-checked={selectedSize === size}
                    aria-label={`Size ${size}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        <div className="flex items-center justify-between mb-3 sm:mb-4 mt-auto">
          <div>
            {item.price ? (
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-gold-600">₨{item.price}</span>
            ) : item.sizes ? (
              <div>
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-gold-600">
                  ₨{item.sizes[selectedSize]}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <motion.button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full bg-primary-900 hover:bg-primary-800 disabled:bg-gray-400 text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 mt-auto shadow-lg hover:shadow-xl min-h-[44px] touch-manipulation"
          aria-label={`Add ${item.name} to cart`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.span
            animate={{ opacity: isLoading ? 0.7 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading ? 'Adding...' : 'Add to Cart'}
          </motion.span>
        </motion.button>
      </div>
    </motion.article>
  );
}