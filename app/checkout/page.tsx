'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/types';
import { showToast } from '@/lib/cartUtils';

const WHATSAPP_NUMBER = '923456500649';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartData, setCartData] = useState<{ items: CartItem[]; total: number } | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    orderNotes: '',
    method: 'Delivery',
    payment: 'Cash on Delivery',
    deliveryAddress: '',
  });
  const [errors, setErrors] = useState({
    fullName: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('checkoutData');
      if (raw) {
        const parsed = JSON.parse(raw);

        // Normalize for backward compatibility: older snapshots used `qty`.
        if (parsed && Array.isArray(parsed.items)) {
          const normalizedItems = parsed.items.map((it: any) => ({
            id: it.id,
            name: it.name,
            // ensure numeric price
            price: typeof it.price === 'number' ? it.price : Number(it.price) || 0,
            // support legacy `qty` field
            quantity: typeof it.quantity === 'number' ? it.quantity : Number(it.qty) || 0,
            size: it.size || 'regular',
            image: it.image || '',
          }));

          setCartData({ items: normalizedItems, total: Number(parsed.total) || 0 });
        } else {
          setCartData(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to parse checkoutData', e);
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = { fullName: '', phone: '', address: '' };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
      valid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
      valid = false;
    } else {
      let norm = formData.phone.replace(/\s|-/g, '');
      if (/^0\d{6,}$/.test(norm)) {
        norm = '92' + norm.slice(1);
      }
      if (!/^\+?\d{6,15}$/.test(norm)) {
        newErrors.phone = 'Please enter a valid phone number.';
        valid = false;
      }
    }

    if (formData.method === 'Delivery' && !formData.deliveryAddress.trim()) {
      newErrors.address = 'Delivery address is required for Delivery method.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const buildWhatsAppMessage = (): string => {
    if (!cartData) return '';

    const lines = [];
    lines.push('New Order - The Pan N Grill');
    lines.push('');
    lines.push('Items:');
    cartData.items.forEach((it) => {
      const lineTotal = it.price * it.quantity;
      lines.push(`- ${it.name} (x${it.quantity}) - Rs${lineTotal}`);
    });

    lines.push('');
    lines.push(`Total: Rs${cartData.total}`);
    lines.push('');
    lines.push('Customer Info:');
    lines.push(`Name: ${formData.fullName}`);
    lines.push(`Phone: ${formData.phone}`);
    lines.push(`Method: ${formData.method}`);
    if (formData.method === 'Delivery') {
      lines.push(`Address: ${formData.deliveryAddress}`);
    }
    if (formData.orderNotes) {
      lines.push(`Notes: ${formData.orderNotes}`);
    }

    lines.push('');
    lines.push('Please confirm the order and delivery time. Thank you!');

    return lines.join('\n');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!cartData || cartData.items.length === 0) {
      showToast('Your cart is empty!', 'error');
      return;
    }

    if (!validateForm()) return;

    const message = buildWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    try {
      localStorage.removeItem('checkoutData');
      localStorage.removeItem('panngrill-cart');
    } catch (e) {}

    window.open(link, '_blank');
    showToast('Opening WhatsApp...');

    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  const handleClearCart = () => {
    if (confirm('Clear cart?')) {
      localStorage.removeItem('checkoutData');
      setCartData({ items: [], total: 0 });
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-3 py-2 rounded-md text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Form column */}
          <div className="lg:col-span-2 bg-white border rounded-lg shadow-sm p-6 h-full flex flex-col">
            <h2 className="text-2xl font-heading font-semibold mb-4">Checkout</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                />
                {errors.fullName && (
                  <div className="text-sm text-red-600 mt-1">{errors.fullName}</div>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="92300XXXXXXX or +92300XXXXXXX"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                />
                {errors.phone && <div className="text-sm text-red-600 mt-1">{errors.phone}</div>}
              </div>

              <div>
                <label htmlFor="orderNotes" className="block text-sm font-medium text-gray-700">
                  Order Notes (optional)
                </label>
                <input
                  id="orderNotes"
                  name="orderNotes"
                  type="text"
                  value={formData.orderNotes}
                  onChange={handleInputChange}
                  placeholder="Any instruction"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="method" className="block text-sm font-medium text-gray-700">
                    Method
                  </label>
                  <select
                    id="method"
                    name="method"
                    value={formData.method}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                    <option value="Delivery">Delivery</option>
                    <option value="Pickup">Pickup</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="payment" className="block text-sm font-medium text-gray-700">
                    Payment
                  </label>
                  <select
                    id="payment"
                    name="payment"
                    value={formData.payment}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                    <option>Cash on Delivery</option>
                    <option>Card on Delivery</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {formData.method === 'Delivery' && (
                <div>
                  <label
                    htmlFor="deliveryAddress"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Delivery Location / Address *
                  </label>
                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="Address, landmark..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                  {errors.address && (
                    <div className="text-sm text-red-600 mt-1">{errors.address}</div>
                  )}
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3 rounded-lg font-semibold"
                >
                  Place Order via WhatsApp
                </button>
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="w-full mt-3 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-semibold"
                >
                  Clear Cart
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Your cart contents will be sent via WhatsApp. No information is submitted to a
                server by this form.
              </p>
            </form>
          </div>

          {/* Summary column */}
          <aside className="bg-white border rounded-lg shadow-sm p-6 h-full flex flex-col lg:sticky lg:top-24">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="sr-only">
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cartData && cartData.items.length > 0 ? (
                    cartData.items.map((item, idx) => (
                      <tr key={idx} className="py-3">
                        <td className="py-2">
                          <div className="font-medium text-gray-800">{item.name}</div>
                          <div className="text-gray-500 text-xs">
                            Rs{item.price} × {item.quantity}
                          </div>
                        </td>
                        <td className="py-2 text-right pr-6">{item.quantity}</td>
                        <td className="py-2 text-right font-semibold text-gray-800">
                          Rs{item.price * item.quantity}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-red-600">
                        Your cart is empty
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 border-t pt-4 flex items-center justify-between">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="font-semibold text-gold-600">
                Rs{cartData?.total || 0}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}