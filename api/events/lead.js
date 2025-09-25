import { sendToFacebookCAPI } from '../../_lib.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const body = req.body || {};
  const email = body.email;
  const value = Number(body.value || 0) || undefined;
  const currency = body.currency || 'USD';
  const productName = body.package || 'Lead';

  await sendToFacebookCAPI({ eventName: 'Lead', value, currency, email, productName, sourceUrl: process.env.EVENT_SOURCE_URL });
  await sendToFacebookCAPI({ eventName: 'ЗаполненнаяЗаявка', value, currency, email, productName, sourceUrl: process.env.EVENT_SOURCE_URL });

  res.status(200).json({ ok: true });
}


