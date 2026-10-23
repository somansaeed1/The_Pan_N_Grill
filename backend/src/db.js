const { Pool } = require('pg');

let pool = null;

/** Returns the shared pool, or null when no database is configured (DATABASE_URL unset). */
function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5, connectionTimeoutMillis: 3000 });
    pool.on('error', (err) => console.error('Unexpected database error:', err.message));
  }
  return pool;
}

/** Lets tests supply an in-memory pool. */
function setPool(testPool) {
  pool = testPool;
}

const isConfigured = () => getPool() !== null;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS orders (
    id            SERIAL PRIMARY KEY,
    order_ref     TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    phone         TEXT NOT NULL,
    method        TEXT NOT NULL,
    payment       TEXT NOT NULL,
    address       TEXT,
    notes         TEXT,
    total         INTEGER NOT NULL,
    items         JSONB NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates the table. The database container can take a few seconds to accept
 * connections after it starts, so this retries before giving up.
 */
async function init({ attempts = 20, delayMs = 2000 } = {}) {
  const db = getPool();
  if (!db) return false;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await db.query(SCHEMA);
      console.log('Database ready');
      return true;
    } catch (err) {
      console.log(`Database not ready (attempt ${attempt}/${attempts}): ${err.message}`);
      await wait(delayMs);
    }
  }
  return false;
}

async function ping() {
  const db = getPool();
  if (!db) return 'not_configured';
  try {
    await db.query('SELECT 1');
    return 'up';
  } catch {
    return 'down';
  }
}

/** Stores a confirmed order. `order` is the object returned to the customer. */
async function saveOrder(orderId, order) {
  const c = order.customer;
  await getPool().query(
    `INSERT INTO orders (order_ref, customer_name, phone, method, payment, address, notes, total, items)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [orderId, c.fullName, c.phone, c.method, c.payment, c.deliveryAddress || null, c.orderNotes || null, order.total, JSON.stringify(order.items)]
  );
}

/** Counts and a short list of recent orders, without any customer details. */
async function orderSummary(limit = 5) {
  const db = getPool();
  const count = await db.query('SELECT COUNT(*)::int AS count FROM orders');
  const recent = await db.query(
    'SELECT order_ref, method, total, created_at FROM orders ORDER BY id DESC LIMIT $1',
    [limit]
  );
  return {
    count: count.rows[0].count,
    recent: recent.rows.map((r) => ({ ref: r.order_ref, method: r.method, total: r.total, createdAt: r.created_at })),
  };
}

module.exports = { getPool, setPool, isConfigured, init, ping, saveOrder, orderSummary };
