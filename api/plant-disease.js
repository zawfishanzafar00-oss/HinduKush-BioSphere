// Secure Pl@ntNet plant disease identification proxy.

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Use POST to submit a plant photograph.'
    });
  }

  const key = process.env.PLANTNET_API_KEY;

  if (!key) {
    return res.status(503).json({
      error: 'Plant disease screening is not configured. Add PLANTNET_API_KEY to Vercel Environment Variables.'
    });
  }

  try {
    const body = req.body || {};
    const base64 = body.imageBase64;
    const mimeType = body.mimeType;
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

    if (!['image/jpeg', 'image/png'].includes(mimeType)) {
      return res.status(415).json({
        error: 'The disease service accepts JPEG or PNG images.'
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

    const url =
      `https://my-api.plantnet.org/v2/diseases/identify?api-key=${encodeURIComponent(key)}&lang=en&nb-results=5&include-related-images=true`;

    const upstream = await fetch(url, {
      method: 'POST',
      body: form,
      headers: { Accept: 'application/json' }
    });

    const payload = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      const message = upstream.status === 429
        ? 'The shared Pl@ntNet daily quota has been reached. Try again after the quota resets.'
        : (payload.message || payload.error || `Pl@ntNet returned HTTP ${upstream.status}.`);

      return res.status(upstream.status === 429 ? 429 : 502).json({
        error: message
      });
    }

    return res.status(200).json({
      results: payload.results || [],
      version: payload.version || null,
      remainingIdentificationRequests: payload.remainingIdentificationRequests ?? null,
      source: 'Pl@ntNet disease identification',
      coverageNote: 'Pl@ntNet supports only a limited list of plant species and diseases. An empty or low-scoring result does not mean the plant is healthy.'
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Could not process the uploaded photograph.'
    });
  }
}