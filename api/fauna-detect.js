
// Secure Animal Detect API proxy.
// The API key stays on the server, never in browser code.

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Use POST to submit a wildlife photograph.'
    });
  }

  const key = process.env.ANIMAL_DETECT_API_KEY;

  if (!key) {
    return res.status(503).json({
      error: 'Animal Detect is not configured. Add ANIMAL_DETECT_API_KEY to your environment variables.'
    });
  }

  try {
    const {
      imageBase64,
      mimeType,
      filename
    } = req.body || {};

    if (
      typeof imageBase64 !== 'string' ||
      !imageBase64 ||
      !['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)
    ) {
      return res.status(400).json({
        error: 'A valid JPG, PNG, or WebP image is required.'
      });
    }

  const cleanBase64 = imageBase64.replace(
  /^data:image\/[a-zA-Z0-9.+-]+;base64,/,
  ''
);

    if (
      !/^[A-Za-z0-9+/]+={0,2}$/.test(cleanBase64) ||
      cleanBase64.length > 3500000
    ) {
      return res.status(400).json({
        error: 'Invalid image or image too large. Please choose a smaller photograph.'
      });
    }

    const imageBytes = Buffer.from(cleanBase64, 'base64');

    if (!imageBytes.length || imageBytes.length > 2500000) {
      return res.status(400).json({
        error: 'Image must be smaller than 2.5 MB.'
      });
    }

    const form = new FormData();

    form.append(
      'image',
      new Blob([imageBytes], { type: mimeType }),
      filename || 'wildlife-photo.jpg'
    );

    form.append('country', 'Pakistan');
    form.append('threshold', '0.2');
    form.append('classify', 'true');
    form.append('top_candidate', '3');

    const upstream = await fetch(
      'https://api.animaldetect.com/v1/detect',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'User-Agent': 'HinduKush-BioSphere/1.0'
        },
        body: form
      }
    );

    const result = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      console.error(
        'Animal Detect API error:',
        upstream.status,
        result
      );

      return res.status(502).json({
        error:
          upstream.status === 401
            ? 'Animal Detect rejected the API key. Check your environment variable.'
            : upstream.status === 402
            ? 'Animal Detect quota is unavailable or exhausted.'
            : upstream.status === 429
            ? 'Animal Detect rate limit reached. Please try again later.'
            : result.detail || result.error || 'Wildlife identification service returned an error.'
      });
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error('Fauna identification error:', error);

    return res.status(500).json({
      error: 'The wildlife identification request could not be completed.'
    });
  }
}
