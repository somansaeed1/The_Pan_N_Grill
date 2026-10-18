'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/cartUtils';

export interface PlacedOrder {
  name: string;
  method: string;
  itemCount: number;
  total: number;
  whatsappUrl: string;
}

export default function SuccessModal({ order }: { order: PlacedOrder }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="order-success-title" className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lift">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <h2 id="order-success-title" ref={headingRef} tabIndex={-1} className="mt-4 text-3xl uppercase text-primary-900 outline-none">
          Order ready to send
        </h2>
        <p className="mt-2 text-gray-600">
          Thanks, {order.name.split(' ')[0]}. Your {order.method.toLowerCase()} order of {order.itemCount}{' '}
          {order.itemCount === 1 ? 'item' : 'items'} ({formatPrice(order.total)}) has opened in WhatsApp. Press send there and we will confirm the time.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <a href={order.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Open WhatsApp again
          </a>
          <Link href="/menu" className="btn border-2 border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white">
            Back to menu
          </Link>
        </div>
      </div>
    </div>
  );
}
