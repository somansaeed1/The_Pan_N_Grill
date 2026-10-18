'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';
import { MAX_LINE_QUANTITY } from '@/lib/catalog';
import { formatPrice, lineTotal, showToast, unitPrice } from '@/lib/cartUtils';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
}

const stepper = 'flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg font-bold hover:bg-gray-200 disabled:opacity-40';

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <li className="flex gap-3 rounded-2xl bg-gray-50 p-3">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
        {item.image && <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="truncate font-bold uppercase text-primary-900">{item.name}</h4>
          <button
            onClick={() => {
              onRemove(item.lineId);
              showToast(`${item.name} removed`);
            }}
            className="-mr-1 -mt-1 rounded-full p-2 text-gray-400 hover:bg-primary-50 hover:text-primary-600"
            aria-label={`Remove ${item.name}`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {item.size !== 'regular' && <p className="text-xs text-gray-500">Size {item.size}</p>}
        {item.addOns.length > 0 && (
          <p className="text-xs text-gray-500">+ {item.addOns.map((a) => a.name).join(', ')}</p>
        )}
        <p className="text-xs text-gray-500">{formatPrice(unitPrice(item))} each</p>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className={stepper} onClick={() => onUpdateQuantity(item.lineId, item.quantity - 1)} aria-label={`Decrease ${item.name}`}>
              &minus;
            </button>
            <span className="w-6 text-center font-bold" aria-live="polite">{item.quantity}</span>
            <button
              className={stepper}
              onClick={() => onUpdateQuantity(item.lineId, item.quantity + 1)}
              disabled={item.quantity >= MAX_LINE_QUANTITY}
              aria-label={`Increase ${item.name}`}
            >
              +
            </button>
          </div>
          <span className="font-bold text-primary-600">{formatPrice(lineTotal(item))}</span>
        </div>
      </div>
    </li>
  );
}
