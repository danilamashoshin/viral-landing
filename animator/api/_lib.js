import crypto from 'crypto';

export function sha256LowerTrim(input) {
  if (!input || typeof input !== 'string') return undefined;
  const normalized = input.trim().toLowerCase();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

export function normalizePhoneE164(phone) {
  if (!phone) return undefined;
  const digits = String(phone).replace(/[^0-9+]/g, '');
  return digits.startsWith('+') ? digits : undefined;
}

export function lemonVerify(rawBody, signature, secret) {
  if (!secret || !signature) return true;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(rawBody || '').digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function sendToFacebookCAPI({ eventName, value, currency, email, productName, sourceUrl }) {
  const pixelId = process.env.FB_PIXEL_ID;
  const accessToken = process.env.FB_ACCESS_TOKEN;
  const apiVersion = process.env.FB_API_VERSION || 'v19.0';
  if (!pixelId || !accessToken) return { ok: false, error: 'Missing FB config' };

  const url = `https://graph.facebook.com/${apiVersion}/${pixelId}/events?access_token=${accessToken}`;
  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: sourceUrl || 'https://animator',
        user_data: { em: email ? [sha256LowerTrim(email)] : undefined },
        custom_data: {
          currency: currency || 'USD',
          value: typeof value === 'number' ? Number(Number(value).toFixed(2)) : undefined,
          content_name: productName || 'Event',
          content_type: 'product'
        }
      }
    ]
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await resp.json().catch(() => ({}));
  return resp.ok ? { ok: true, json } : { ok: false, status: resp.status, json };
}


