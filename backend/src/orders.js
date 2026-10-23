const express = require('express');
const { priceOrder } = require('./pricing');
const { normalizePhone, validateCustomer } = require('./validation');
const { distanceFromRestaurant, isValidCoordinate, deliveryRuleFor } = require('./delivery');
const db = require('./db');

const router = express.Router();

const rs = (amount) => `Rs ${amount.toLocaleString('en-PK')}`;

function newOrderId() {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 36 ** 3).toString(36).toUpperCase().padStart(3, '0');
  return `PNG-${time}-${rand}`;
}

function buildMessage(orderId, customer, priced) {
  const lines = ['New Order - The Pan N Grill', `Ref: ${orderId}`, '', 'Items:'];
  for (const l of priced.lines) {
    const size = l.size !== 'regular' ? ` [${l.size}]` : '';
    const extras = l.addOns.length > 0 ? ` + ${l.addOns.join(', ')}` : '';
    lines.push(`- ${l.name}${size}${extras} (x${l.quantity}) - ${rs(l.lineTotal)}`);
  }
  lines.push('', `Total: ${rs(priced.total)}`, '', 'Customer:');
  lines.push(`Name: ${customer.fullName}`);
  lines.push(`Phone: +${customer.phone}`);
  lines.push(`Method: ${customer.method}`);
  if (customer.method === 'Delivery') lines.push(`Address: ${customer.deliveryAddress}`);
  lines.push(`Payment: ${customer.payment}`);
  if (customer.orderNotes) lines.push(`Notes: ${customer.orderNotes}`);
  lines.push('', 'Please confirm the order and time. Thank you!');
  return lines.join('\n');
}

/**
 * POST /api/orders
 * Validates the order, prices it from the server's menu and returns the confirmed
 * order plus the WhatsApp message. When DATABASE_URL is set the order is also saved
 * to PostgreSQL; otherwise nothing is stored.
 */
router.post('/', async (req, res, next) => {
  try {
    await handleOrder(req, res);
  } catch (err) {
    next(err);
  }
});

async function handleOrder(req, res) {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'bad_request', message: 'Send the order as a JSON object.' });
  }

  const fields = validateCustomer(body.customer);
  const priced = priceOrder(body.items);

  let itemErrors = [];
  if (priced.errors) {
    itemErrors = priced.errors;
    fields.items = priced.errors[0].message;
  }

  let delivery = null;
  if (body.customer?.method === 'Delivery' && body.location != null) {
    const { lat, lng } = body.location;
    if (!isValidCoordinate(lat, lng)) {
      fields.delivery = 'Your location could not be read. Set it again or choose pickup.';
    } else {
      delivery = deliveryRuleFor(distanceFromRestaurant(lat, lng));
      if (!delivery.allowed) {
        fields.delivery = 'Sorry, we do not deliver to your location. You can choose pickup instead.';
      } else if (priced.total !== undefined && delivery.minOrder > priced.total) {
        fields.delivery = `Delivery to your area needs a minimum order of ${rs(delivery.minOrder)}. Add ${rs(delivery.minOrder - priced.total)} more or choose pickup.`;
      }
    }
  }

  if (Object.keys(fields).length > 0) {
    return res.status(422).json({
      error: 'validation_failed',
      message: 'Some details need fixing before we can accept the order.',
      fields,
      itemErrors,
    });
  }

  const c = body.customer;
  const customer = {
    fullName: c.fullName.trim(),
    phone: normalizePhone(c.phone),
    method: c.method,
    payment: c.payment,
    deliveryAddress: c.method === 'Delivery' ? c.deliveryAddress.trim() : '',
    orderNotes: typeof c.orderNotes === 'string' ? c.orderNotes.trim() : '',
  };

  const orderId = newOrderId();
  const order = {
    customer,
    items: priced.lines,
    itemsSubtotal: priced.itemsSubtotal,
    addOnsTotal: priced.addOnsTotal,
    total: priced.total,
    delivery,
  };

  if (db.isConfigured()) {
    try {
      await db.saveOrder(orderId, order);
    } catch (err) {
      console.error('Could not save order:', err.message);
      return res.status(503).json({ error: 'storage_unavailable', message: 'We could not save your order right now. Please try again.' });
    }
  }

  res.status(201).json({ orderId, order, message: buildMessage(orderId, customer, priced), stored: db.isConfigured() });
}

/** GET /api/orders/summary: order count and recent references, with no customer details. */
router.get('/summary', async (_req, res) => {
  if (!db.isConfigured()) return res.json({ stored: false });
  try {
    res.json({ stored: true, ...(await db.orderSummary()) });
  } catch (err) {
    console.error('Could not read orders:', err.message);
    res.status(503).json({ error: 'storage_unavailable', message: 'The order database is not reachable.' });
  }
});

module.exports = router;
