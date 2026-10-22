const LIMITS = { nameMin: 2, nameMax: 60, addressMin: 10, addressMax: 200, notesMax: 300 };
const METHODS = ['Delivery', 'Pickup'];
const PAYMENTS = ['Cash', 'Card', 'Other'];

/**
 * Normalises a Pakistani mobile number to international digits (923XXXXXXXXX).
 * Mirrors frontend/lib/validation.ts so both sides accept the same formats.
 */
function normalizePhone(raw) {
  if (typeof raw !== 'string') return null;
  let digits = raw.replace(/[\s()-]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  if (!/^\d+$/.test(digits)) return null;
  if (digits.startsWith('0092')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = `92${digits.slice(1)}`;
  else if (digits.startsWith('3')) digits = `92${digits}`;
  return /^923\d{9}$/.test(digits) ? digits : null;
}

/** Returns an object of field -> message. Empty when the customer details are valid. */
function validateCustomer(customer) {
  const errors = {};
  if (!customer || typeof customer !== 'object') return { customer: 'Customer details are required.' };

  const text = (value) => (typeof value === 'string' ? value.trim() : '');
  const name = text(customer.fullName);
  if (!name) errors.fullName = 'Please enter your name.';
  else if (name.length < LIMITS.nameMin) errors.fullName = 'Your name looks too short.';
  else if (name.length > LIMITS.nameMax) errors.fullName = `Please keep your name under ${LIMITS.nameMax} characters.`;
  else if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(name)) errors.fullName = 'Use letters only in your name.';

  if (!text(customer.phone)) errors.phone = 'Please enter your phone number.';
  else if (!normalizePhone(customer.phone)) errors.phone = 'Enter a valid mobile number, for example 0300 1234567.';

  if (!METHODS.includes(customer.method)) errors.method = 'Choose delivery or pickup.';
  if (!PAYMENTS.includes(customer.payment)) errors.payment = 'Choose a payment method.';

  if (customer.method === 'Delivery') {
    const address = text(customer.deliveryAddress);
    if (!address) errors.deliveryAddress = 'Please enter your delivery address.';
    else if (address.length < LIMITS.addressMin) errors.deliveryAddress = 'Add a bit more detail, such as street, area and a landmark.';
    else if (address.length > LIMITS.addressMax) errors.deliveryAddress = `Please keep the address under ${LIMITS.addressMax} characters.`;
  }

  const notes = typeof customer.orderNotes === 'string' ? customer.orderNotes : '';
  if (notes.length > LIMITS.notesMax) errors.orderNotes = `Notes can be up to ${LIMITS.notesMax} characters.`;

  return errors;
}

module.exports = { LIMITS, METHODS, PAYMENTS, normalizePhone, validateCustomer };
