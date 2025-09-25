import { sendToFacebookCAPI } from './_lib.js';

export const config = {
  runtime: 'edge'
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders() });
  }

  const bodyText = await req.text();
  let body = {};
  try { body = bodyText ? JSON.parse(bodyText) : {}; } catch {}

  const email = body.email;
  const value = Number(body.value || 0) || undefined;
  const currency = body.currency || 'USD';
  const productName = body.package || 'Lead';

  await sendToFacebookCAPI({ eventName: 'Lead', value, currency, email, productName, sourceUrl: process.env.EVENT_SOURCE_URL });
  await sendToFacebookCAPI({ eventName: 'ЗаполненнаяЗаявка', value, currency, email, productName, sourceUrl: process.env.EVENT_SOURCE_URL });

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...corsHeaders(), 'content-type': 'application/json' } });
}

function corsHeaders() {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'POST,GET,OPTIONS'
  };
}


