# HinduKush BioSphere — photo and model status (2.3 visual rebuild)

## Visual assets bundled locally
- `assets/hindukush-fullscape.webp`: generated decorative Chitral/Hindu Kush-inspired landscape used as the continuous full-page background. It is artwork, not a documentary photograph or evidence of a real species occurrence.
- `assets/markhor-vine-emblem.webp`: generated markhor-and-vines brand emblem. It is a logo illustration, not a wildlife photograph.

## Identification and disease boundaries
- The Vercel endpoint `/api/plant-identify` calls Pl@ntNet for **plant species identification** when `PLANTNET_API_KEY` is configured. Pl@ntNet species identification is not plant-disease diagnosis.
- The Plant Health Lab currently compares selected symptoms and host-plant information against local rules. It does not analyse the uploaded leaf image to diagnose disease.
- The plant traits wizard works offline as a guided catalogue filter. It is not offline AI image recognition.
- A reliable offline photo matcher requires a locally bundled, correctly labelled reference-image dataset and a validated similarity/classification model. This release does not claim to provide that yet.
- Fauna Health Lab is a safe observation/referral aid, not an animal disease diagnostic model.

## Species photographs
- Existing species-photo retrieval remains dependent on GBIF / Wikimedia Commons / iNaturalist connections where configured in the source. Those images are not all bundled locally in this release. The service worker can cache successfully fetched images for later visits, but a first visit without connectivity cannot fetch them.
- Do not use the decorative full-page background as a species-card photograph. Keep specimen imagery separate and accurately attributed.
- Every reused Wikimedia Commons image must retain its individual author, file-page link and licence terms. Licences differ by file; verify each file record before publication.

## Next data work required
1. Curate and download one verified, reusable image per taxon in the plant and fauna catalogues.
2. Store them in `assets/species/` with a source/creator/licence manifest.
3. Pre-cache those exact local assets in `sw.js`.
4. Train/test an offline image-similarity or classification model against a correctly labelled reference set, and report accuracy and limitations.
5. Add a separate disease-image model only after disease-labelled data and validation are available.
