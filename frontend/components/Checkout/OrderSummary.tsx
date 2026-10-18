import Image from 'next/image';
import { CartItem } from '@/types';
import { CartSummary, formatPrice, lineTotal, unitPrice } from '@/lib/cartUtils';

interface OrderSummaryProps {
  items: CartItem[];
  summary: CartSummary;
  /** Minimum order for delivery to the customer's area; 0 means none. */
  minOrder: number;
}

export default function OrderSummary({ items, summary, minOrder }: OrderSummaryProps) {
  const progress = minOrder > 0 ? Math.min(100, Math.round((summary.total / minOrder) * 100)) : 100;

  return (
    <div>
      <ul className="divide-y divide-primary-900/10">
        {items.map((item) => (
          <li key={item.lineId} className="flex gap-3 py-3 first:pt-0">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
              {item.image && <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />}
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-bl-md bg-primary-900 px-1 text-xs font-bold text-white">
                {item.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-bold uppercase text-primary-900">{item.name}</p>
              {item.size !== 'regular' && <p className="text-gray-500">Size {item.size}</p>}
              {item.addOns.length > 0 && <p className="text-gray-500">+ {item.addOns.map((a) => a.name).join(', ')}</p>}
              <p className="text-gray-500">
                {formatPrice(unitPrice(item))} &times; {item.quantity}
              </p>
            </div>
            <p className="text-sm font-bold text-primary-900">{formatPrice(lineTotal(item))}</p>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-1.5 border-t border-primary-900/10 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-600">Items</dt>
          <dd>{formatPrice(summary.itemsSubtotal)}</dd>
        </div>
        {summary.addOnsSubtotal > 0 && (
          <div className="flex justify-between">
            <dt className="text-gray-600">Add-ons</dt>
            <dd>{formatPrice(summary.addOnsSubtotal)}</dd>
          </div>
        )}
        <div className="flex justify-between border-t border-primary-900/10 pt-3 text-xl text-primary-900">
          <dt className="font-heading uppercase">Total</dt>
          <dd className="font-heading text-primary-600">{formatPrice(summary.total)}</dd>
        </div>
      </dl>

      {minOrder > 0 && (
        <div className="mt-4" role="status">
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full rounded-full bg-primary-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-gray-600">
            {summary.total >= minOrder
              ? `Minimum order of ${formatPrice(minOrder)} reached.`
              : `Add ${formatPrice(minOrder - summary.total)} more to reach the ${formatPrice(minOrder)} delivery minimum.`}
          </p>
        </div>
      )}
    </div>
  );
}
