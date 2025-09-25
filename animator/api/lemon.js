import { lemonVerify, sendToFacebookCAPI } from './_lib.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders() });
  }

  const signature = req.headers.get('x-signature');
  const raw = await req.text();
  let payload = {};
  try { payload = raw ? JSON.parse(raw) : {}; } catch {}

  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!lemonVerify(raw, signature, secret)) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid signature' }), { status: 401, headers: { ...corsHeaders(), 'content-type': 'application/json' } });
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

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...corsHeaders(), 'content-type': 'application/json' } });
}

function corsHeaders() {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'content-type,x-signature',
    'access-control-allow-methods': 'POST,GET,OPTIONS'
  };
}


