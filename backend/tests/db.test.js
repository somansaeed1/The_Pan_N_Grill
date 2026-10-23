const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { newDb } = require('pg-mem');
const db = require('../src/db');
const app = require('../src/app');

let server;
let base;

const customer = {
  fullName: 'Ali Raza',
  phone: '0300-1234567',
  method: 'Delivery',
  payment: 'Cash',
  deliveryAddress: 'House 12, Street 3, near Adhiwal Chowk',
  orderNotes: 'No onions',
};
const order = { customer, items: [{ id: 'oppa-fries', size: 'regular', quantity: 2 }] };

const post = (body) =>
  fetch(`${base}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

before(async () => {
  const { Pool } = newDb().adapters.createPg();
  db.setPool(new Pool());
  await db.init({ attempts: 1, delayMs: 0 });
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test('health reports the database as up', async () => {
  const res = await fetch(`${base}/api/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: 'ok', database: 'up' });
});

test('a valid order is stored and counted', async () => {
  const before = await (await fetch(`${base}/api/orders/summary`)).json();
  assert.equal(before.stored, true);
  assert.equal(before.count, 0);

  const res = await post(order);
  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.stored, true);

  const after = await (await fetch(`${base}/api/orders/summary`)).json();
  assert.equal(after.count, 1);
  assert.equal(after.recent[0].ref, data.orderId);
  assert.equal(after.recent[0].total, 300);
});

test('the summary never exposes customer details', async () => {
  const text = await (await fetch(`${base}/api/orders/summary`)).text();
  for (const secret of ['Ali Raza', '923001234567', 'Adhiwal', 'No onions']) {
    assert.ok(!text.includes(secret), `summary leaked "${secret}"`);
  }
});

test('invalid orders are not stored', async () => {
  const res = await post({ ...order, customer: { ...customer, phone: '123' } });
  assert.equal(res.status, 422);
  const summary = await (await fetch(`${base}/api/orders/summary`)).json();
  assert.equal(summary.count, 1);
});

test('when the database fails the API reports it instead of losing the order', async () => {
  const working = db.getPool();
  db.setPool({ query: async () => { throw new Error('connection refused'); } });
  try {
    const orderRes = await post(order);
    assert.equal(orderRes.status, 503);
    assert.equal((await orderRes.json()).error, 'storage_unavailable');

    const health = await fetch(`${base}/api/health`);
    assert.equal(health.status, 503);
    assert.equal((await health.json()).database, 'down');
  } finally {
    db.setPool(working);
  }
});
