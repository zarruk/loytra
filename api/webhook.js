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
      return res.status(200).json({ ok: true, message: 'Webhook listo. Usa POST para enviar eventos.' });
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
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


