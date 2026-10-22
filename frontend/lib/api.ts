import { CartItem } from '@/types';
import { CheckoutErrors, CheckoutForm } from './validation';

/** Base URL of the order API. When unset, checkout works without a server. */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');

const TIMEOUT_MS = 8000;

export type OrderResult =
  | { kind: 'ok'; orderId: string; message: string; total: number }
  | { kind: 'invalid'; message: string; errors: CheckoutErrors }
  | { kind: 'unavailable' };

/** Maps the API's field names onto the checkout form's error keys. */
function toFormErrors(fields: Record<string, string>): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (fields.fullName) errors.fullName = fields.fullName;
  if (fields.phone) errors.phone = fields.phone;
  if (fields.deliveryAddress) errors.deliveryAddress = fields.deliveryAddress;
  if (fields.orderNotes) errors.orderNotes = fields.orderNotes;
  if (fields.items) errors.cart = fields.items;
  if (fields.delivery) errors.delivery = fields.delivery;
  return errors;
}

/**
 * Sends the order to the API for validation and pricing.
 * Network problems, timeouts and server errors all return `unavailable`, so the
 * caller can fall back to sending the order straight to WhatsApp.
 */
export async function submitOrder(
  form: CheckoutForm,
  items: CartItem[],
  location: { lat: number; lng: number } | null
): Promise<OrderResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        customer: form,
        items: items.map((i) => ({ id: i.id, size: i.size, addOnIds: i.addOns.map((a) => a.id), quantity: i.quantity })),
        location,
      }),
    });

    if (response.status === 422) {
      const data = await response.json();
      return { kind: 'invalid', message: data.message, errors: toFormErrors(data.fields ?? {}) };
    }
    if (!response.ok) return { kind: 'unavailable' };

    const data = await response.json();
    return { kind: 'ok', orderId: data.orderId, message: data.message, total: data.order.total };
  } catch {
    return { kind: 'unavailable' };
  } finally {
    clearTimeout(timer);
  }
}
