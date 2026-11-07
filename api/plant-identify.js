// Secure Pl@ntNet species identification proxy.
// The API key stays on the server.

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Use POST to submit a plant photograph.'
    });
  }

  const key = process.env.PLANTNET_API_KEY;
  console.log('[PlantNet] API key available:', Boolean(key));

  if (!key) {
    return res.status(503).json({
      error: 'Pl@ntNet is not configured. Add PLANTNET_API_KEY to Vercel Environment Variables.'
    });
  }

  try {
    const body = req.body || {};
    const base64 = body.imageBase64;
    const mimeType = body.mimeType;
    console.log('[PlantNet] Request diagnostic:', {
  bodyType: typeof req.body,
  bodyKeys: body && typeof body === 'object' ? Object.keys(body) : [],
  imageType: typeof base64,
  imageLength: typeof base64 === 'string' ? base64.length : 0,
  mimeType
});
    const filename = body.filename || 'plant-photo.jpg';

    if (
      typeof base64 !== 'string' ||
      !base64.length ||
      base64.length > 3 * 1024 * 1024
    ) {
      return res.status(400).json({
        error: 'Missing image or image is too large. Please choose a smaller photograph.'
      });
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
      return res.status(415).json({
        error: 'Only JPEG, PNG and WebP images are supported.'
      });
    }

    const imageBytes = Buffer.from(base64, 'base64');

    if (!imageBytes.length) {
      return res.status(400).json({
        error: 'The uploaded image could not be decoded.'
      });
    }

    const form = new FormData();

    form.append(
      'images',
      new Blob([imageBytes], { type: mimeType }),
      filename
    );

    form.append('organs', 'auto');

    const upstream = await fetch(
      `https://my-api.plantnet.org/v2/identify/all?api-key=${encodeURIComponent(key)}`,
      {
        method: 'POST',
        body: form,
        headers: { Accept: 'application/json' }
      }
    );

    const payload = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      const message = upstream.status === 429
        ? 'The Pl@ntNet daily identification quota has been reached.'
        : (payload.message || `Pl@ntNet returned HTTP ${upstream.status}.`);

      return res.status(upstream.status === 429 ? 429 : 502).json({
        error: message
      });
    }

    return res.status(200).json({
      results: payload.results || [],
      query: payload.query || null,
      modelVersion: payload.version || null,
      source: 'Pl@ntNet'
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Could not process the uploaded image.'
    });
  }
}