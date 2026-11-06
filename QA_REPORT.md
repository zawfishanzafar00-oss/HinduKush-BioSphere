# QA report — HinduKush BioSphere 2.4

## Checks performed in this build environment
- JavaScript syntax checks for the main scripts and both serverless API routes.
- Automated mocked-request tests for `/api/plant-identify` and `/api/plant-disease`, including missing-key handling and successful upstream-response handling.
- ZIP archive integrity check after packaging.

## Implemented
- Online Pl@ntNet plant-species identification proxy.
- Online Pl@ntNet disease-photo screening proxy (`/api/plant-disease`) using the same private `PLANTNET_API_KEY`.
- Offline local pixel-pattern photo screening, with related symptom tags preselected where broad visual signals are detected.
- Existing offline symptom matching retained.
- Explicit limitations and safe-use messaging.

## Not verified here
- A live Pl@ntNet request (requires the user's private API key and network access).
- Real-world disease accuracy on Chitral crops or local plant varieties. Pl@ntNet documents limited disease coverage.
- Clinical/agronomic validity of the offline pixel-pattern heuristic; it is not a trained model.
- Full Vercel deployment, camera testing on a phone, and complete offline browser storage behaviour.

Do not present any screening result as a confirmed diagnosis or use it alone to choose treatment.
