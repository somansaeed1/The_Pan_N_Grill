const express = require('express');
const cors = require('cors');
const orders = require('./orders');
const rateLimit = require('./rateLimit');
const db = require('./db');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '100kb' }));

// Used by the load balancer: reports unhealthy when a configured database is unreachable.
app.get('/api/health', async (_req, res) => {
  const database = await db.ping();
  const healthy = database !== 'down';
  res.status(healthy ? 200 : 503).json({ status: healthy ? 'ok' : 'degraded', database });
});

app.use('/api/orders', rateLimit({ windowMs: 60_000, max: 30 }), orders);

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'not_found', message: 'Not found' });
});

// Malformed JSON and unexpected errors get a JSON response instead of an HTML page.
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'bad_request', message: 'The request body is not valid JSON.' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'too_large', message: 'The request is too large.' });
  }
  console.error(err);
  res.status(500).json({ error: 'server_error', message: 'Something went wrong on our side. Please try again.' });
});

module.exports = app;
