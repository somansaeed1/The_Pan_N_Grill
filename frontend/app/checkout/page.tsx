'use client';

import { FormEvent, ReactNode, useRef, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/Cart/CartProvider';
import OrderSummary from '@/components/Checkout/OrderSummary';
import SuccessModal, { PlacedOrder } from '@/components/Checkout/SuccessModal';
import { useDeliveryZone } from '@/hooks/useDeliveryZone';
import { API_URL, submitOrder } from '@/lib/api';
import { formatPrice, showToast } from '@/lib/cartUtils';
import { buildWhatsAppMessage, buildWhatsAppUrl } from '@/lib/order';
import { CheckoutErrors, CheckoutField, CheckoutForm, LIMITS, validateCheckout, validateField } from '@/lib/validation';

const INITIAL_FORM: CheckoutForm = {
  fullName: '',
  phone: '',
  method: 'Delivery',
  payment: 'Cash',
  deliveryAddress: '',
  orderNotes: '',
};

const PAYMENT_OPTIONS = [
  { value: 'Cash', label: 'Cash', hint: 'Pay on delivery or at the shop' },
  { value: 'Card', label: 'Card', hint: 'Pay on delivery or at the shop' },
  { value: 'Other', label: 'Other', hint: 'We will confirm on WhatsApp' },
];

const inputClass = (invalid: boolean) =>
  `mt-1 block min-h-[48px] w-full rounded-md border bg-white px-3 text-base text-primary-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 ${
    invalid ? 'border-primary-600 bg-primary-50' : 'border-gray-300 focus:border-primary-600'
  }`;

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold uppercase tracking-wide text-primary-900">
        {label}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm font-semibold text-primary-600">
          {error}
        </p>
      )}
    </div>
  );
}

function Section({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-primary-900/10 bg-white p-5 shadow-card sm:p-6">
      <h2 className="mb-4 flex items-center gap-3 text-2xl uppercase text-primary-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-base text-white">{step}</span>
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export default function CheckoutPage() {
  const { cartItems, summary, clearCart, isReady } = useCart();
  const { orderRule, deliveryAllowed, hasLocation, userLocation } = useDeliveryZone();

  const [form, setForm] = useState<CheckoutForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const itemCount = cartItems.reduce((n, i) => n + i.quantity, 0);
  const minOrder = form.method === 'Delivery' && hasLocation && orderRule ? orderRule.minOrder : 0;
  const context = { itemCount, total: summary.total, hasLocation, deliveryAllowed, minOrder };

  const update = (field: CheckoutField, value: string) => {
    const next = { ...form, [field]: value } as CheckoutForm;
    setForm(next);
    // Clear a shown error as soon as the field becomes valid.
    if (errors[field] && !validateField(field, next)) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (errors.delivery) setErrors((prev) => ({ ...prev, delivery: undefined }));
  };

  const checkField = (field: CheckoutField) => setErrors((prev) => ({ ...prev, [field]: validateField(field, form) || undefined }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const found = validateCheckout(form, context);
    setErrors(found);

    const firstField = (['fullName', 'phone', 'deliveryAddress', 'orderNotes'] as const).find((f) => found[f]);
    if (firstField) {
      formRef.current?.querySelector<HTMLElement>(`#${firstField}`)?.focus();
      showToast('Some details are missing or incorrect. Check the highlighted fields.', 'error', { title: 'Cannot place order yet' });
      return;
    }
    if (found.cart || found.delivery) {
      showToast(found.cart ?? found.delivery!, 'error', { title: found.cart ? 'Your cart is empty' : 'Delivery problem' });
      return;
    }

    setSubmitting(true);
    let message = buildWhatsAppMessage(form, cartItems, summary);
    let total = summary.total;

    // When an order API is configured it re-checks the order and prices it from the menu.
    if (API_URL) {
      const result = await submitOrder(form, cartItems, form.method === 'Delivery' ? userLocation : null);

      if (result.kind === 'invalid') {
        setErrors(result.errors);
        setSubmitting(false);
        const field = (['fullName', 'phone', 'deliveryAddress', 'orderNotes'] as const).find((f) => result.errors[f]);
        if (field) formRef.current?.querySelector<HTMLElement>(`#${field}`)?.focus();
        showToast(result.errors.cart ?? result.errors.delivery ?? result.message, 'error', { title: 'We could not accept the order' });
        return;
      }

      if (result.kind === 'ok') {
        message = result.message;
        if (result.total !== summary.total) {
          total = result.total;
          showToast(`The total is now ${formatPrice(result.total)} to match current menu prices.`, 'info', { title: 'Price updated' });
        }
      } else {
        showToast('Our order server did not respond, so we are sending your order straight to WhatsApp.', 'info', { title: 'Sending directly' });
      }
    }

    const whatsappUrl = buildWhatsAppUrl(message);
    const whatsappTab = window.open(whatsappUrl, '_blank');
    if (whatsappTab) {
      whatsappTab.opener = null;
      showToast('Press send in WhatsApp to confirm your order.', 'success', { title: 'Order opened in WhatsApp' });
    } else {
      showToast('Your browser blocked the WhatsApp window. Use the button on the next screen to open it.', 'error', { title: 'WhatsApp did not open' });
    }

    setPlacedOrder({ name: form.fullName.trim(), method: form.method, itemCount, total, whatsappUrl });
    clearCart();
    setSubmitting(false);
  };

  if (!isReady) {
    return (
      <div className="container-page py-10" aria-busy="true" aria-label="Loading checkout">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-lg bg-primary-900/10" />
            ))}
          </div>
          <div className="h-80 animate-pulse rounded-lg bg-primary-900/10" />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !placedOrder) {
    return (
      <div className="container-page flex min-h-[70vh] flex-col items-center justify-center text-center">
        <h1 className="text-4xl uppercase text-primary-900">Your cart is empty</h1>
        <p className="mt-2 text-gray-600">Add something from the menu before checking out.</p>
        <Link href="/menu" className="btn-primary mt-6">Browse the menu</Link>
      </div>
    );
  }

  const deliveryProblem = form.method === 'Delivery' ? validateCheckout(form, context).delivery : undefined;
  const aria = (field: CheckoutField) => ({
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  });

  const summaryBlock = <OrderSummary items={cartItems} summary={summary} minOrder={minOrder} />;

  return (
    <div className="pb-28 lg:pb-12">
      <header className="border-b border-primary-900/10 bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/menu" className="flex items-center gap-1 text-sm font-bold uppercase text-primary-900 hover:text-primary-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Menu
          </Link>
          <p className="font-heading text-2xl uppercase text-primary-900">Checkout</p>
          <span className="w-12" aria-hidden="true" />
        </div>
      </header>

      <div className="container-page mt-6 grid gap-6 lg:grid-cols-[1fr_400px] lg:items-start">
        <form id="checkout-form" ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
          <details className="rounded-lg border border-primary-900/10 bg-white p-4 shadow-card lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between font-bold uppercase text-primary-900">
              <span>Order summary ({itemCount})</span>
              <span className="text-primary-600">{formatPrice(summary.total)}</span>
            </summary>
            <div className="mt-4">{summaryBlock}</div>
          </details>

          <Section step={1} title="Your details">
            <Field id="fullName" label="Full name" error={errors.fullName}>
              <input
                id="fullName"
                name="name"
                type="text"
                autoComplete="name"
                value={form.fullName}
                maxLength={LIMITS.nameMax}
                onChange={(e) => update('fullName', e.target.value)}
                onBlur={() => checkField('fullName')}
                placeholder="Your name"
                className={inputClass(!!errors.fullName)}
                {...aria('fullName')}
              />
            </Field>
            <Field id="phone" label="Mobile number" error={errors.phone} hint="We will call or message this number about your order.">
              <input
                id="phone"
                name="tel"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                onBlur={() => checkField('phone')}
                placeholder="0300 1234567"
                className={inputClass(!!errors.phone)}
                {...aria('phone')}
              />
            </Field>
          </Section>

          <Section step={2} title="Delivery or pickup">
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Order type">
              {(['Delivery', 'Pickup'] as const).map((method) => (
                <label
                  key={method}
                  className={`flex min-h-[48px] cursor-pointer items-center justify-center rounded-md border-2 px-3 text-center font-bold uppercase transition ${
                    form.method === method ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-gray-300 text-gray-700 hover:border-primary-900'
                  }`}
                >
                  <input type="radio" name="method" value={method} checked={form.method === method} onChange={() => update('method', method)} className="sr-only" />
                  {method}
                </label>
              ))}
            </div>

            {form.method === 'Delivery' ? (
              <>
                <Field id="deliveryAddress" label="Delivery address" error={errors.deliveryAddress} hint="Street, area and a nearby landmark.">
                  <textarea
                    id="deliveryAddress"
                    name="address"
                    rows={3}
                    autoComplete="street-address"
                    value={form.deliveryAddress}
                    maxLength={LIMITS.addressMax}
                    onChange={(e) => update('deliveryAddress', e.target.value)}
                    onBlur={() => checkField('deliveryAddress')}
                    className={`${inputClass(!!errors.deliveryAddress)} py-2`}
                    {...aria('deliveryAddress')}
                  />
                </Field>
                {(errors.delivery || deliveryProblem) && (
                  <p role="alert" className="rounded-md border-l-4 border-primary-600 bg-primary-50 p-3 text-sm text-primary-900">
                    {errors.delivery ?? deliveryProblem}{' '}
                    {!hasLocation && (
                      <Link href="/delivery-zone" className="font-bold text-primary-600 underline">
                        Check delivery zone
                      </Link>
                    )}
                  </p>
                )}
              </>
            ) : (
              <p className="rounded-md bg-cream p-3 text-sm text-primary-800">Pick your order up at Adhiwal Chowk, Sargodha Road, Jhang Sadar. We will message you when it is ready.</p>
            )}
          </Section>

          <Section step={3} title="Payment">
            <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Payment method">
              {PAYMENT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-md border-2 p-3 transition ${
                    form.payment === option.value ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-primary-900'
                  }`}
                >
                  <input type="radio" name="payment" value={option.value} checked={form.payment === option.value} onChange={() => update('payment', option.value)} className="sr-only" />
                  <span className="block font-bold uppercase text-primary-900">{option.label}</span>
                  <span className="block text-xs text-gray-600">{option.hint}</span>
                </label>
              ))}
            </div>
          </Section>

          <Section step={4} title="Anything else?">
            <Field id="orderNotes" label="Order notes (optional)" error={errors.orderNotes}>
              <textarea
                id="orderNotes"
                name="notes"
                rows={2}
                value={form.orderNotes}
                onChange={(e) => update('orderNotes', e.target.value)}
                onBlur={() => checkField('orderNotes')}
                placeholder="No onions, extra spicy, ring the bell..."
                className={`${inputClass(!!errors.orderNotes)} py-2`}
                {...aria('orderNotes')}
              />
              <p className="mt-1 text-right text-xs text-gray-500">{form.orderNotes.length}/{LIMITS.notesMax}</p>
            </Field>
          </Section>
        </form>

        <aside className="hidden rounded-lg border border-primary-900/10 bg-white p-6 shadow-card lg:sticky lg:top-6 lg:block">
          <h2 className="mb-4 text-2xl uppercase text-primary-900">Your order</h2>
          {summaryBlock}
          <button type="submit" form="checkout-form" disabled={submitting} className="btn-primary mt-6 w-full">
            {submitting ? 'Sending...' : 'Place order on WhatsApp'}
          </button>
          <p className="mt-3 text-center text-xs text-gray-500">Your order opens in WhatsApp. Nothing is sent until you press send there.</p>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-primary-900/10 bg-white p-3 shadow-lift lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-4">
          <div>
            <p className="text-xs uppercase text-gray-500">Total</p>
            <p className="text-2xl leading-none text-primary-600">{formatPrice(summary.total)}</p>
          </div>
          <button type="submit" form="checkout-form" disabled={submitting} className="btn-primary flex-1">
            {submitting ? 'Sending...' : 'Place order'}
          </button>
        </div>
      </div>

      {placedOrder && <SuccessModal order={placedOrder} />}
    </div>
  );
}
