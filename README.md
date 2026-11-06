# HinduKush BioSphere — Biodiversity Field Atlas

**Observe · Understand · Conserve**

An offline-first regional biodiversity research prototype for Chitral and the Hindu Kush. This release adds a real online Pl@ntNet proxy, a browser-side pretrained MobileNet fauna classifier, image-led wildlife profiles, and more resilient species-photo retrieval.

## Run locally

1. Extract the ZIP.
2. Open the project folder in VS Code.
3. Run `npm.cmd start` for the static preview.
4. Open the local URL. Camera access requires localhost or HTTPS.

The static preview does not execute Vercel serverless API routes. To test the API locally, install/use the Vercel CLI and run `npx vercel dev`; create a private `.env.local` file containing `PLANTNET_API_KEY=your_key_here` (never commit or share it).

## Features in this release

- **Online plant-disease photo screening:** `/api/plant-disease` securely proxies uploaded JPEG/PNG photographs to Pl@ntNet disease identification. It returns ranked candidate conditions, model scores and available reference-image credits. Coverage is limited to supported species/pathologies; an empty result does not mean healthy. Uses the same `PLANTNET_API_KEY` and daily quota as plant species identification.
- **Offline photo-pattern screening:** the browser analyses broad pixel-colour patterns locally (yellowing-like, brown lesion-like, white patch-like, orange/rust-like signals) and can preselect related symptom tags. This is a lightweight visual heuristic, not a trained AI model and not a disease diagnosis.
- Existing plant health symptom matcher remains available offline and can be used alongside either photo workflow, with a local plant-health journal.
- Existing 55-plant regional candidate catalogue and offline trait-matching workflow.
- Plant species photographs retrieved from exact-name GBIF records, with exact-name iNaturalist taxon-photo fallback.
- **Online plant identification:** `/api/plant-identify` securely proxies images to Pl@ntNet. Configure `PLANTNET_API_KEY` in Vercel environment variables. The key is not exposed to browser JavaScript.
- **Fauna Atlas:** markhor, snow leopard, Siberian ibex and Himalayan monal profiles with real reference photographs, image credits, habitat, diet, range, behaviour, ecological role, conservation notes and threats.
- Interactive fauna flashcards with a flip interaction and expanded profile modal.
- **Offline image screening:** TensorFlow.js + pretrained MobileNet V2 can classify plant and animal photographs in the browser and displays its actual ImageNet top labels. It is a broad general-purpose classifier, not a specialist Chitral flora/fauna model. It may not distinguish local species and cannot diagnose disease. Results are not verified identifications.
- English/Urdu toggle and existing RTL behaviour (translation coverage remains partial).
- Regional Leaflet / OpenStreetMap context map.
- Existing local observation notebook and local plant-health journal.
- PWA shell with runtime caching for selected image and model hosts after they have been loaded online.

## What works offline

- Existing symptom-based plant-health matching.
- Offline photo-pattern screening (basic pixel feature analysis only; not a trained classifier).
- Existing trait-based plant identification workflow.
- Previously visited same-origin app shell.
- Previously downloaded GBIF / iNaturalist / Wikimedia photographs when the browser service worker has cached them.
- MobileNet inference after its JS libraries and model weights have successfully downloaded and been cached by the browser.
- Local journals and observations saved in the same browser.

**Offline caveat:** this is a cache-after-first-visit architecture. The first visit, first photograph retrieval and first model download require internet. Browser storage eviction can remove cached model or image files.

## Online services and configuration

### Pl@ntNet plant and disease identification

1. Create a free developer account at https://my.plantnet.org/.
2. Copy the API key.
3. In Vercel, open Project Settings → Environment Variables.
4. Add `PLANTNET_API_KEY` with the key as its value.
5. Redeploy the project.

The Pl@ntNet developer site currently advertises a free allowance of 500 identifications per day. Quotas and terms can change; check the official pricing and quota pages before a research event:
- https://my.plantnet.org/pricing
- https://my.plantnet.org/doc/api/quota

The API returns candidate species and model scores. Scores are not certainty estimates.

The same key also powers the separate `/api/plant-disease` endpoint. Pl@ntNet documents disease routes at https://my.plantnet.org/doc/api/diseases. Its disease feature currently supports only a limited list of species and pathologies; each disease request consumes the same quota as one species identification. Results are possible matches, not confirmed diagnoses. Check the official documentation and account quota before a field event.

### Fauna model

The fauna screen uses the open-source MobileNet V2 model through TensorFlow.js. It runs inference in the browser; no image is uploaded to a third-party server by the classifier. Model assets are downloaded from jsDelivr / TensorFlow-hosted model storage and cached for repeat use where browser storage allows.

This is **not** a trained Hindu Kush fauna model. It cannot support a claim of validated markhor, ibex, snow leopard or monal recognition. A specialist classifier would require a licensed, labelled regional dataset and independent evaluation.

## Important limitations — not claimed as completed

- **Online plant disease:** Pl@ntNet has a real disease-identification route, but its coverage is limited. It may not recognise many Chitral crops, local varieties or disease conditions. A no-result response is not proof of plant health.
- **Offline plant photo:** the local pixel-pattern tool is a heuristic that highlights broad colour patterns and suggests symptom tags. It is not a trained disease classifier, does not compare against a full verified reference-photo library, and cannot diagnose a disease. A validated offline model would require a suitable licensed dataset, model training, field testing and independent evaluation.
- **Animal health:** no validated livestock or wildlife disease image model has been integrated. A photograph alone is not a reliable veterinary diagnosis. This release does not claim animal health screening.
- **Offline specialist flora/fauna AI:** the included MobileNet is a broad ImageNet classifier, not a local species classifier. The offline plant workflow also retains the trait-based regional shortlist.
- **Fauna photo coverage:** four flagship profiles have explicit reference image sources. Plant photos depend on external taxon/occurrence services until cached; there is no full local photo archive in this ZIP.
- **Map:** the map is a regional orientation map, not a verified species distribution map. No wildlife sightings or coordinates are fabricated.
- **Observations:** existing records are local to the current browser and are not synchronized to a shared backend or automatically verified.
- **Urdu:** the existing translation toggle and RTL direction are retained, but complete translation of every paragraph/profile is not finished.
- **Mobile camera, real browser caching and Vercel deployment:** syntax and static project checks are performed here, but device/browser and production deployment checks must be completed on the target hosting account.

## Sources

- Pl@ntNet API: https://my.plantnet.org/
- iNaturalist taxon API: https://api.inaturalist.org/v1/docs/
- GBIF: https://www.gbif.org/
- Wikimedia Commons: https://commons.wikimedia.org/
- IUCN Red List: https://www.iucnredlist.org/
- TensorFlow.js: https://www.tensorflow.org/js
- Leaflet: https://leafletjs.com/
- OpenStreetMap: https://www.openstreetmap.org/copyright

## Vercel deployment

- Project root: `HinduKush_BioSphere`
- Framework preset: Other
- Build command: none required
- Output directory: `.`
- Add `PLANTNET_API_KEY` as an environment variable before deployment to enable Pl@ntNet.
- Deploy with `npx vercel --prod`.

## Project structure

```text
HinduKush_BioSphere/
  index.html
  style.css
  script.js
  biosphere-upgrades.js
  sw.js
  manifest.webmanifest
  package.json
  vercel.json
  README.md
  QA_REPORT.md
  api/
    chat.js
    plant-identify.js
```


## 2.2 visual and workflow update
- Reworked the homepage around a locally bundled Chitral Valley landscape image and an emerald/forest-green plant identity; fauna pages use an earthy brown/green palette.
- Added an explicit interactive MCQ navigation entry and kept the existing quiz engine.
- Added a Pl@ntNet species-identification panel inside Plant Health Lab. Important: this identifies plant species, not disease. The disease symptom matcher remains rule-based because no free, validated Chitral crop-disease diagnosis API is available in this build.
- Added a conservative fauna health observation checklist. It is not veterinary diagnosis and does not claim to classify animal disease.
- Added broad protected-area reference markers for Chitral Gol National Park and the UNESCO Chitral Bashkar Garmchashm Biosphere Reserve. These are not current endangered-animal sightings; exact sensitive wildlife coordinates are not shown.
- Added a wider Urdu UI dictionary and RTL handling for core navigation and workflow labels. Translation coverage is improved but should still be reviewed by a fluent Urdu speaker before public research use.
- Plant photo lookup prioritizes exact-taxon GBIF records with open licences, then exact-name Wikimedia Commons records. Some species may still have no legally reusable exact photo; the interface states this rather than substituting an unrelated image.

## Important configuration and scientific limitations
The online Pl@ntNet endpoint only works after `PLANTNET_API_KEY` is added privately to Vercel and the site is redeployed. The local `npm start` static server does not execute Vercel serverless API routes. The plant-health symptom matcher is not a disease-diagnosis API. The fauna health panel is an observation/referral aid, not diagnosis. The fauna image model remains general-purpose and is not validated for local species.

## 2.3 immersive visual rebuild
The 2.3 rebuild uses a continuous, locally bundled Hindu Kush landscape background across the site's sections and a locally bundled markhor-and-vines emblem. These are generated decorative assets, not documentary species evidence. See `PHOTO_AND_MODEL_STATUS.md` for the exact current state of photographs, offline matching and disease identification.

**Important:** Pl@ntNet identifies plant species; it does not diagnose plant diseases. The Plant Health Lab remains a symptom-matching guide. The current offline plant finder is a trait-based catalogue guide, not offline photo recognition. Do not describe these features as AI disease diagnosis or offline AI identification.
