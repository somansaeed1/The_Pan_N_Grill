const { catalog, findItem, isAvailable, addOnsFor } = require('./catalog');

const MAX_LINES = 30;

/**
 * Prices an order from the server's own menu, ignoring any prices the client may send.
 * Returns { lines, itemsSubtotal, addOnsTotal, total } or { errors: [{ index, message }] }.
 */
function priceOrder(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { errors: [{ index: null, message: 'Your cart is empty.' }] };
  }
  if (rawItems.length > MAX_LINES) {
    return { errors: [{ index: null, message: `An order can have at most ${MAX_LINES} different items.` }] };
  }

  const errors = [];
  const lines = [];

  rawItems.forEach((raw, index) => {
    const fail = (message) => errors.push({ index, message });
    if (!raw || typeof raw !== 'object') return fail('Invalid item.');

    const found = findItem(raw.id);
    if (!found) return fail('One of the items is no longer on the menu.');
    const { item, categoryId } = found;

    if (!isAvailable(item)) return fail(`${item.name} is sold out.`);

    const quantity = raw.quantity;
    if (!Number.isInteger(quantity) || quantity < 1) return fail(`Choose a quantity for ${item.name}.`);
    if (quantity > catalog.maxLineQuantity) {
      return fail(`You can order up to ${catalog.maxLineQuantity} of ${item.name}.`);
    }

    let size = 'regular';
    let unitPrice;
    if (item.sizes) {
      size = typeof raw.size === 'string' ? raw.size : '';
      if (!Object.hasOwn(item.sizes, size)) return fail(`Choose a valid size for ${item.name}.`);
      unitPrice = item.sizes[size];
    } else {
      unitPrice = item.price;
    }

    const addOnIds = raw.addOnIds === undefined ? [] : raw.addOnIds;
    if (!Array.isArray(addOnIds) || new Set(addOnIds).size !== addOnIds.length) {
      return fail(`The add-ons for ${item.name} are not valid.`);
    }
    const allowed = addOnsFor(categoryId);
    const addOns = [];
    for (const id of addOnIds) {
      const addOn = allowed.find((a) => a.id === id);
      if (!addOn) return fail(`An add-on you chose is not available for ${item.name}.`);
      addOns.push(addOn);
    }

    const addOnsPerUnit = addOns.reduce((sum, a) => sum + a.price, 0);
    lines.push({
      id: item.id,
      name: item.name,
      size,
      addOns: addOns.map((a) => a.name),
      quantity,
      unitPrice: unitPrice + addOnsPerUnit,
      itemsTotal: unitPrice * quantity,
      addOnsTotal: addOnsPerUnit * quantity,
      lineTotal: (unitPrice + addOnsPerUnit) * quantity,
    });
  });

  if (errors.length > 0) return { errors };

  const itemsSubtotal = lines.reduce((sum, l) => sum + l.itemsTotal, 0);
  const addOnsTotal = lines.reduce((sum, l) => sum + l.addOnsTotal, 0);
  return { lines, itemsSubtotal, addOnsTotal, total: itemsSubtotal + addOnsTotal };
}

module.exports = { priceOrder, MAX_LINES };
