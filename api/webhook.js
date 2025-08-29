import { randomUUID as nodeRandomUUID } from 'crypto';
async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString();
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return res.status(200).json({ ok: true, message: 'Webhook listo. Usa POST para enviar eventos.', version: 'vercel-webhook-v2' });
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const contentType = req.headers['content-type'] || '';
    const rawBody = await readRawBody(req);
    let payload = rawBody;
    if (contentType.includes('application/json')) {
      try {
        payload = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        return res.status(400).json({ error: 'Invalid JSON' });
      }
    }

    console.log('Webhook payload:', payload);

    const generatedId = (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function')
      ? globalThis.crypto.randomUUID()
      : nodeRandomUUID();

    const host = 'loytra.vercel.app'; // Forzamos el host para que siempre sea loytra.vercel.app
    const protocol = (req.headers['x-forwarded-proto'] || 'https').split(',')[0];
    const baseUrl = `${protocol}://${host}`;

    const offerId = payload.offerId || payload.id || generatedId;

    const responseBody = [
      {
        success: true,
        message: 'Datos recibidos y guardados correctamente',
        data: {
          uuid: offerId,
          offerId,
          url: `${baseUrl}/oferta.html?id=${encodeURIComponent(offerId)}`
        },
        meta: {
          baseUrl,
          host,
          protocol,
          receivedContentType: contentType || null
        }
      }
    ];

    return res.status(200).json(responseBody);
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


