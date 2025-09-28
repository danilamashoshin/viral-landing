const { lemonVerify, sendToFacebookCAPI } = require('./_lib.js');

async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const signature = req.headers['x-signature'] || req.headers['X-Signature'];
  const raw = req.rawBody || JSON.stringify(req.body || {});
  let payload = req.body || {};

  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!lemonVerify(raw, signature, secret)) {
    res.status(401).json({ ok: false, error: 'invalid signature' });
    return;
  }

  const event = payload?.meta?.event || payload?.event || '';

  if (event && (event.includes('order') || event.includes('subscription_payment'))) {
    const attrs = payload?.data?.attributes || {};
    const email = attrs.email || attrs.user_email || payload?.meta?.customer_email;
    const totalCents = attrs.total || attrs.subtotal || 0;
    const currency = attrs.currency || attrs.currency_code || 'USD';
    const productName = attrs.first_order_item?.product_name || attrs.product_name || 'Purchase';
    const value = Math.round(Number(totalCents || 0)) / 100;

    await sendToFacebookCAPI({ eventName: 'Purchase', value, currency, email, productName, sourceUrl: process.env.EVENT_SOURCE_URL });
    await sendToFacebookCAPI({ eventName: 'Оплата', value, currency, email, productName, sourceUrl: process.env.EVENT_SOURCE_URL });
  }

  res.status(200).json({ ok: true });
}

module.exports = handler;




