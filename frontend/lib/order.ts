import { CartItem } from '@/types';
import { CartSummary, formatPrice, lineTotal } from './cartUtils';
import { CheckoutForm, normalizePhone } from './validation';
import { SITE } from './site';

export function buildWhatsAppMessage(form: CheckoutForm, items: CartItem[], summary: CartSummary): string {
  const lines = ['New Order - The Pan N Grill', '', 'Items:'];

  for (const item of items) {
    const size = item.size !== 'regular' ? ` [${item.size}]` : '';
    const extras = item.addOns.length > 0 ? ` + ${item.addOns.map((a) => a.name).join(', ')}` : '';
    lines.push(`- ${item.name}${size}${extras} (x${item.quantity}) - ${formatPrice(lineTotal(item))}`);
  }

  lines.push('', `Total: ${formatPrice(summary.total)}`, '', 'Customer:');
  lines.push(`Name: ${form.fullName.trim()}`);
  lines.push(`Phone: +${normalizePhone(form.phone) ?? form.phone.trim()}`);
  lines.push(`Method: ${form.method}`);
  if (form.method === 'Delivery') lines.push(`Address: ${form.deliveryAddress.trim()}`);
  lines.push(`Payment: ${form.payment}`);
  if (form.orderNotes.trim()) lines.push(`Notes: ${form.orderNotes.trim()}`);
  lines.push('', 'Please confirm the order and time. Thank you!');

  return lines.join('\n');
}

export const buildWhatsAppUrl = (message: string): string =>
  `https://api.whatsapp.com/send?phone=${SITE.whatsappNumber}&text=${encodeURIComponent(message)}`;
