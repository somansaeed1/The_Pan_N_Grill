export type DeliveryMethod = 'Delivery' | 'Pickup';

export interface CheckoutForm {
  fullName: string;
  phone: string;
  method: DeliveryMethod;
  payment: string;
  deliveryAddress: string;
  orderNotes: string;
}

export type CheckoutField = keyof CheckoutForm;
export type CheckoutErrors = Partial<Record<CheckoutField | 'cart' | 'delivery', string>>;

export interface CheckoutContext {
  itemCount: number;
  total: number;
  /** Whether the customer has told us where they are (or chose to skip). */
  hasLocation: boolean;
  deliveryAllowed: boolean;
  minOrder: number;
}

export const LIMITS = { nameMin: 2, nameMax: 60, addressMin: 10, addressMax: 200, notesMax: 300 } as const;

/**
 * Normalises a Pakistani mobile number to international digits (923XXXXXXXXX).
 * Accepts 03XX-XXXXXXX, 3XXXXXXXXX, +92 3XX XXXXXXX and 923XXXXXXXXX.
 * Returns null when the number is not a valid mobile number.
 */
export function normalizePhone(raw: string): string | null {
  let digits = raw.replace(/[\s()-]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  if (!/^\d+$/.test(digits)) return null;
  if (digits.startsWith('0092')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = `92${digits.slice(1)}`;
  else if (digits.startsWith('3')) digits = `92${digits}`;
  return /^923\d{9}$/.test(digits) ? digits : null;
}

export function validateField(field: CheckoutField, form: CheckoutForm): string {
  switch (field) {
    case 'fullName': {
      const name = form.fullName.trim();
      if (!name) return 'Please enter your name.';
      if (name.length < LIMITS.nameMin) return 'Your name looks too short.';
      if (name.length > LIMITS.nameMax) return `Please keep your name under ${LIMITS.nameMax} characters.`;
      if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(name)) return 'Use letters only in your name.';
      return '';
    }
    case 'phone':
      if (!form.phone.trim()) return 'Please enter your phone number.';
      return normalizePhone(form.phone) ? '' : 'Enter a valid mobile number, for example 0300 1234567.';
    case 'deliveryAddress': {
      if (form.method !== 'Delivery') return '';
      const address = form.deliveryAddress.trim();
      if (!address) return 'Please enter your delivery address.';
      if (address.length < LIMITS.addressMin) return 'Add a bit more detail, such as street, area and a landmark.';
      if (address.length > LIMITS.addressMax) return `Please keep the address under ${LIMITS.addressMax} characters.`;
      return '';
    }
    case 'orderNotes':
      return form.orderNotes.length > LIMITS.notesMax ? `Notes can be up to ${LIMITS.notesMax} characters.` : '';
    default:
      return '';
  }
}

const FIELDS: CheckoutField[] = ['fullName', 'phone', 'deliveryAddress', 'orderNotes'];

export function validateCheckout(form: CheckoutForm, ctx: CheckoutContext): CheckoutErrors {
  const errors: CheckoutErrors = {};

  for (const field of FIELDS) {
    const message = validateField(field, form);
    if (message) errors[field] = message;
  }

  if (ctx.itemCount === 0) errors.cart = 'Your cart is empty.';

  if (form.method === 'Delivery' && ctx.itemCount > 0) {
    if (!ctx.hasLocation) {
      errors.delivery = 'Tell us your location so we can check that we deliver to you, or choose pickup.';
    } else if (!ctx.deliveryAllowed) {
      errors.delivery = 'Sorry, we do not deliver to your location. You can choose pickup instead.';
    } else if (ctx.minOrder > ctx.total) {
      errors.delivery = `Delivery to your area needs a minimum order of Rs ${ctx.minOrder.toLocaleString('en-PK')}. Add Rs ${(ctx.minOrder - ctx.total).toLocaleString('en-PK')} more or choose pickup.`;
    }
  }

  return errors;
}
