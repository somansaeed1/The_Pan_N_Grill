const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');
const { normalizePhone } = require('../src/validation');
const { priceOrder } = require('../src/pricing');
const { catalog } = require('../src/catalog');

let server;
let base;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

const customer = {
  fullName: 'Ali Raza',
  phone: '0300-1234567',
  method: 'Delivery',
  payment: 'Cash',
  deliveryAddress: 'House 12, Street 3, near Adhiwal Chowk',
  orderNotes: '',
};

const post = (body, raw) =>
  fetch(`${base}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: raw ?? JSON.stringify(body),
  });

test('normalizePhone accepts common Pakistani mobile formats', () => {
  for (const input of ['0300 1234567', '0300-1234567', '+92 300 1234567', '923001234567', '3001234567', '00923001234567']) {
    assert.equal(normalizePhone(input), '923001234567', input);
  }
  for (const input of ['12345', '0200 1234567', 'abc', '', '03001234567890']) {
    assert.equal(normalizePhone(input), null, input);
  }
});

test('priceOrder uses server prices for size and add-ons', () => {
  const result = priceOrder([
    { id: 'oppa-fries', size: 'regular', addOnIds: ['extra-cheese'], quantity: 2 },
    { id: 'tikka-pizza', size: 'M', quantity: 1 },
  ]);
  assert.equal(result.errors, undefined);
  assert.equal(result.itemsSubtotal, 150 * 2 + 1000);
  assert.equal(result.addOnsTotal, 100 * 2);
  assert.equal(result.total, 1500);
});

test('priceOrder rejects unknown items, bad sizes, bad add-ons and bad quantities', () => {
  const cases = [
    [{ id: 'nope', quantity: 1 }, /no longer on the menu/],
    [{ id: 'tikka-pizza', size: 'XXL', quantity: 1 }, /valid size/],
    [{ id: 'oppa-fries', size: 'regular', addOnIds: ['extra-toppings'], quantity: 1 }, /add-on/],
    [{ id: 'oppa-fries', quantity: 0 }, /quantity/],
    [{ id: 'oppa-fries', quantity: catalog.maxLineQuantity + 1 }, /up to/],
  ];
  for (const [line, pattern] of cases) {
    const result = priceOrder([line]);
    assert.match(result.errors[0].message, pattern);
  }
  assert.match(priceOrder([]).errors[0].message, /empty/);
});

test('priceOrder rejects sold-out items', () => {
  const item = catalog.menu.fries.items.find((i) => i.id === 'oppa-fries');
  item.available = false;
  try {
    assert.match(priceOrder([{ id: 'oppa-fries', quantity: 1 }]).errors[0].message, /sold out/);
  } finally {
    delete item.available;
  }
});

test('POST /api/orders accepts a valid order and ignores client prices', async () => {
  const res = await post({
    customer,
    items: [{ id: 'oppa-fries', size: 'regular', addOnIds: ['extra-cheese'], quantity: 2, price: 1, unitPrice: 1 }],
  });
  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.order.total, 500);
  assert.equal(data.order.customer.phone, '923001234567');
  assert.match(data.orderId, /^PNG-/);
  assert.match(data.message, /Oppa Fries \+ Extra cheese \(x2\) - Rs 500/);
});

test('POST /api/orders returns per-field errors', async () => {
  const res = await post({
    customer: { ...customer, fullName: '', phone: '123', deliveryAddress: 'x' },
    items: [],
  });
  assert.equal(res.status, 422);
  const data = await res.json();
  assert.equal(data.error, 'validation_failed');
  for (const field of ['fullName', 'phone', 'deliveryAddress', 'items']) {
    assert.ok(data.fields[field], `missing error for ${field}`);
  }
});

test('pickup orders do not need an address', async () => {
  const res = await post({
    customer: { ...customer, method: 'Pickup', deliveryAddress: '' },
    items: [{ id: 'oppa-fries', size: 'regular', quantity: 1 }],
  });
  assert.equal(res.status, 201);
});

test('delivery rules apply by distance', async () => {
  const items = [{ id: 'oppa-fries', size: 'regular', quantity: 1 }];
  const near = await post({ customer, items, location: { lat: 31.27, lng: 72.33 } });
  assert.equal(near.status, 201);

  const mid = await post({ customer, items, location: { lat: 31.3381, lng: 72.3317 } });
  assert.equal(mid.status, 422);
  assert.match((await mid.json()).fields.delivery, /minimum order of Rs 2,000/);

  const far = await post({ customer, items, location: { lat: 31.7, lng: 72.33 } });
  assert.equal(far.status, 422);
  assert.match((await far.json()).fields.delivery, /do not deliver/);

  const pickup = await post({ customer: { ...customer, method: 'Pickup' }, items, location: { lat: 31.7, lng: 72.33 } });
  assert.equal(pickup.status, 201);
});

test('malformed JSON, wrong content and unknown routes return JSON errors', async () => {
  const bad = await post(null, '{not json');
  assert.equal(bad.status, 400);
  assert.equal((await bad.json()).error, 'bad_request');

  const array = await post([]);
  assert.equal(array.status, 400);

  const missing = await fetch(`${base}/api/nothing`);
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).error, 'not_found');
});
