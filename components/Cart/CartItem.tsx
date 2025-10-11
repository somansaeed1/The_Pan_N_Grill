'use client';

import { CartItem as CartItemType } from '@/types';
import { showToast } from '@/lib/cartUtils';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, size: string, newQuantity: number) => void;
  onRemove: (itemId: string, size: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4 min-h-[100px]">
      {/* Item Image */}
      <div className="flex-shrink-0 flex items-center justify-center h-16 w-16">
        <img
          src={item.image || `/placeholder.svg?height=60&width=60`}
          alt={item.name}
          className="rounded-lg bg-white object-contain"
          style={{ width: '60px', height: '60px' }}
        />
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
        <h4 className="text-sm font-semibold text-primary-900 truncate">
          {item.name}
        </h4>
        {item.size !== 'regular' && (
          <p className="text-xs text-gray-500">Size: {item.size}</p>
        )}
        <p className="text-sm font-semibold text-gold-600">₨{item.price}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-center space-y-1">
        <button
          onClick={() => onUpdateQuantity(item.id, item.size, item.quantity - 1)}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
          aria-label={`Decrease quantity of ${item.name}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.size, item.quantity + 1)}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
          aria-label={`Increase quantity of ${item.name}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => {
          onRemove(item.id, item.size);
          showToast(`${item.name} removed from cart`);
        }}
        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2"
        aria-label={`Remove ${item.name} from cart`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}