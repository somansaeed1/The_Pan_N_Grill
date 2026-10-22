const { catalog } = require('./catalog');

const EARTH_RADIUS_KM = 6371;
const toRad = (deg) => (deg * Math.PI) / 180;

/** Great-circle distance in km between the restaurant and a point. */
function distanceFromRestaurant(lat, lng) {
  const { lat: rLat, lng: rLng } = catalog.restaurant;
  const dLat = toRad(lat - rLat);
  const dLng = toRad(lng - rLng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(rLat)) * Math.cos(toRad(lat)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.asin(Math.sqrt(a));
}

const isValidCoordinate = (lat, lng) =>
  typeof lat === 'number' && typeof lng === 'number' && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

/**
 * Applies the delivery rules for a customer's location.
 * The open-ended last rule (maxDistance null) means delivery is not available.
 */
function deliveryRuleFor(distanceKm) {
  const rule = catalog.deliveryRules.find((r) => r.maxDistance === null || distanceKm <= r.maxDistance);
  return { distanceKm, minOrder: rule.minOrder, allowed: rule.maxDistance !== null, message: rule.message };
}

module.exports = { distanceFromRestaurant, isValidCoordinate, deliveryRuleFor };
