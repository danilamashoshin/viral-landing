import { lemonVerify, sendToFacebookCAPI } from './_lib.js';

export default async function handler(req, res) {
  console.log('=== LEMON WEBHOOK RECEIVED ===');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));

  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request, returning 204');
    res.status(204).end();
    return;
  }
  
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    res.status(405).end('Method Not Allowed');
    return;
  }

  const signature = req.headers['x-signature'] || req.headers['X-Signature'];
  const raw = req.rawBody || JSON.stringify(req.body || {});
  let payload = req.body || {};

  console.log('Signature:', signature);
  console.log('Raw body:', raw);

  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  console.log('Secret exists:', !!secret);
  
  if (!lemonVerify(raw, signature, secret)) {
    console.log('Invalid signature, returning 401');
    res.status(401).json({ ok: false, error: 'invalid signature' });
    return;
  }

  console.log('Signature verified successfully');

  const event = payload?.meta?.event || payload?.event || '';
  console.log('Event type:', event);

  if (event && (event.includes('order') || event.includes('subscription_payment'))) {
    console.log('Processing payment event:', event);
    
    const attrs = payload?.data?.attributes || {};
    const email = attrs.email || attrs.user_email || payload?.meta?.customer_email;
    const totalCents = attrs.total || attrs.subtotal || 0;
    const currency = attrs.currency || attrs.currency_code || 'USD';
    const productName = attrs.first_order_item?.product_name || attrs.product_name || 'Purchase';
    const value = Math.round(Number(totalCents || 0)) / 100;

    console.log('Payment data:', { email, totalCents, currency, productName, value });

    try {
      const purchaseResult = await sendToFacebookCAPI({ 
        eventName: 'Purchase', 
        value, 
        currency, 
        email, 
        productName, 
        sourceUrl: process.env.EVENT_SOURCE_URL 
      });
      console.log('Purchase event sent:', purchaseResult);

      const paymentResult = await sendToFacebookCAPI({ 
        eventName: 'Оплата', 
        value, 
        currency, 
        email, 
        productName, 
        sourceUrl: process.env.EVENT_SOURCE_URL 
      });
      console.log('Payment event sent:', paymentResult);
    } catch (error) {
      console.error('Error sending events to Facebook:', error);
    }
  } else {
    console.log('Event not a payment event, skipping:', event);
  }

  console.log('Webhook processed successfully');
  res.status(200).json({ ok: true });
}







