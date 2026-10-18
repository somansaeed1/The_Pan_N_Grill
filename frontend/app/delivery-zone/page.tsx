import type { Metadata } from 'next';
import CheckDeliveryZone from '@/components/CheckDeliveryZone';
import { DELIVERY_CITY, ORDER_LIMIT_RULES } from '@/lib/deliveryZoneUtils';
import { formatPrice } from '@/lib/cartUtils';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Delivery zone | The Pan N Grill',
  description: `Check whether The Pan N Grill delivers to your address in ${DELIVERY_CITY}.`,
};

const rangeLabel = (min: number, max: number) =>
  max === Infinity ? `Over ${Math.floor(min)} km` : `${Math.ceil(min) === 0 ? 0 : Math.floor(min)} to ${max} km`;

const ruleText = (minOrder: number, message: string) =>
  message.toLowerCase().includes('not available') ? 'Not available' : minOrder === 0 ? 'No minimum order' : `Minimum order ${formatPrice(minOrder)}`;

export default function DeliveryZonePage() {
  return (
    <div className="pt-16">
      <section className="bg-primary-900 py-12 text-center text-white sm:py-16">
        <div className="container-page">
          <h1 className="mb-3 text-5xl uppercase sm:text-6xl">Delivery zone</h1>
          <p className="mx-auto max-w-2xl text-lg text-white/90">See if we deliver to your address in {DELIVERY_CITY}.</p>
        </div>
      </section>

      <div className="container-page grid gap-6 py-10 lg:grid-cols-[1fr_340px] lg:items-start">
        <CheckDeliveryZone />

        <aside className="space-y-6">
          <section className="rounded-lg border border-primary-900/10 bg-white p-6 shadow-card">
            <h2 className="text-2xl uppercase text-primary-900">How far we deliver</h2>
            <ul className="mt-4 divide-y divide-primary-900/10 text-sm">
              {ORDER_LIMIT_RULES.map((rule) => (
                <li key={rule.minDistance} className="flex items-baseline justify-between gap-3 py-2.5">
                  <span className="font-bold text-primary-900">{rangeLabel(rule.minDistance, rule.maxDistance)}</span>
                  <span className="text-right text-gray-600">{ruleText(rule.minOrder, rule.message)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-gray-500">We deliver within {DELIVERY_CITY} only.</p>
          </section>

          <section className="rounded-lg border border-primary-900/10 bg-white p-6 shadow-card">
            <h2 className="text-2xl uppercase text-primary-900">Questions?</h2>
            <address className="mt-3 space-y-3 text-sm not-italic text-gray-700">
              <p>
                {SITE.address[0]}
                <br />
                {SITE.address[1]}
              </p>
              <p>
                {SITE.phones.map((phone) => (
                  <a key={phone.href} href={phone.href} className="block font-semibold hover:text-primary-600">{phone.label}</a>
                ))}
              </p>
            </address>
          </section>
        </aside>
      </div>
    </div>
  );
}
