'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  RESTAURANT_COORDS,
  DELIVERY_CITY,
  OrderLimitRule,
  calculateDistance,
  getCityFromCoordinates,
  getOrderLimit,
  getUserLocation,
  isDeliveryAvailable,
  isDeliveryAvailableByDistance,
} from '@/lib/deliveryZoneUtils';
import { formatPrice, showToast } from '@/lib/cartUtils';

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => <div className="h-[320px] animate-pulse rounded-lg bg-primary-900/10" aria-label="Loading map" />,
});

interface ZoneResult {
  coords: { lat: number; lng: number };
  city: string | null;
  distanceKm: number;
  rule: OrderLimitRule;
  allowed: boolean;
}

const SAVED_KEY = 'panngrill-location';

async function checkCoordinates(lat: number, lng: number): Promise<ZoneResult> {
  const city = await getCityFromCoordinates(lat, lng).catch(() => null);
  const distanceKm = calculateDistance(lat, lng);
  return {
    coords: { lat, lng },
    city,
    distanceKm,
    rule: getOrderLimit(distanceKm),
    allowed: isDeliveryAvailable(city) && isDeliveryAvailableByDistance(distanceKm),
  };
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-md bg-cream p-4">
      <dt className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl uppercase text-primary-900">{value}</dd>
      {note && <p className="mt-0.5 text-xs text-gray-600">{note}</p>}
    </div>
  );
}

export default function CheckDeliveryZone() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ZoneResult | null>(null);
  const [error, setError] = useState('');
  const [manual, setManual] = useState({ lat: '', lng: '' });

  const run = async (task: () => Promise<ZoneResult>) => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      setResult(await task());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not check your location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const detect = () => run(async () => {
    const { lat, lng } = await getUserLocation();
    return checkCoordinates(lat, lng);
  });

  const checkManual = () => {
    const lat = parseFloat(manual.lat);
    const lng = parseFloat(manual.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      setError('Enter valid latitude and longitude values.');
      setResult(null);
      return;
    }
    run(() => checkCoordinates(lat, lng));
  };

  const useForOrder = () => {
    if (!result) return;
    try {
      localStorage.setItem(
        SAVED_KEY,
        JSON.stringify({
          hasLocation: true,
          lat: result.coords.lat,
          lng: result.coords.lng,
          name: result.city,
          distanceKm: result.distanceKm,
          allowed: result.allowed,
          deliveryAllowed: result.allowed,
          minOrder: result.rule.minOrder,
          message: result.rule.message,
          orderRule: result.rule,
        })
      );
      showToast('We will use it to check delivery and minimum order at checkout.', 'success', { title: 'Location saved' });
    } catch {
      showToast('Your browser would not let us save it. Check that private browsing is off.', 'error', { title: 'Location not saved' });
    }
  };

  const inputClass = 'min-h-[44px] w-full rounded-md border border-gray-300 px-3 focus:border-primary-600 focus:ring-primary-600';

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-primary-900/10 bg-white p-6 shadow-card">
        <h2 className="text-3xl uppercase text-primary-900">Check your address</h2>
        <p className="mt-1 text-gray-600">Share your location and we will tell you straight away whether we deliver to you and if there is a minimum order.</p>

        <button onClick={detect} disabled={loading} className="btn-primary mt-5 w-full sm:w-auto">
          {loading ? 'Checking...' : 'Use my current location'}
        </button>

        {error && (
          <p role="alert" className="mt-4 rounded-md border-l-4 border-primary-600 bg-primary-50 p-3 text-sm font-semibold text-primary-900">
            {error}
          </p>
        )}

        <details className="mt-5 text-sm">
          <summary className="cursor-pointer font-bold uppercase text-primary-600">Location not working? Enter coordinates</summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <input aria-label="Latitude" inputMode="decimal" placeholder="Latitude, e.g. 31.2777" value={manual.lat} onChange={(e) => setManual({ ...manual, lat: e.target.value })} className={inputClass} />
            <input aria-label="Longitude" inputMode="decimal" placeholder="Longitude, e.g. 72.3213" value={manual.lng} onChange={(e) => setManual({ ...manual, lng: e.target.value })} className={inputClass} />
            <button onClick={checkManual} disabled={loading} className="btn border-2 border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white">
              Check
            </button>
          </div>
        </details>
      </section>

      {result && (
        <section className="rounded-lg border border-primary-900/10 bg-white p-6 shadow-card" aria-live="polite">
          <p
            className={`inline-block rounded-full px-4 py-1 text-sm font-bold uppercase tracking-wide ${
              result.allowed ? 'bg-secondary-100 text-secondary-700' : 'bg-primary-50 text-primary-700'
            }`}
          >
            {result.allowed ? 'We deliver to you' : 'Delivery not available'}
          </p>
          {!result.allowed && (
            <p className="mt-3 text-gray-700">
              {isDeliveryAvailable(result.city)
                ? 'You are outside our delivery distance. You are welcome to order for pickup.'
                : `We currently deliver only within ${DELIVERY_CITY}.`}
            </p>
          )}

          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <Stat label="Your city" value={result.city ?? 'Unknown'} />
            <Stat label="Distance" value={`${result.distanceKm.toFixed(1)} km`} note="from our shop" />
            {result.allowed && (
              <Stat label="Minimum order" value={result.rule.minOrder === 0 ? 'None' : formatPrice(result.rule.minOrder)} />
            )}
          </dl>

          {result.allowed && (
            <button onClick={useForOrder} className="btn-primary mt-5 w-full sm:w-auto">
              Use this location for my order
            </button>
          )}

          <div className="mt-6 overflow-hidden rounded-lg">
            <LeafletMap userLocation={result.coords} restaurantLocation={RESTAURANT_COORDS} distance={result.distanceKm} />
          </div>
        </section>
      )}
    </div>
  );
}
