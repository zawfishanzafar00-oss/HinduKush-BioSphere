/* HinduKush BioSphere — research-grade feature extensions.
   External model predictions are explicitly labelled and never presented as verified records. */
(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fauna = [
    {common:'Markhor',scientific:'Capra falconeri',group:'mammal',family:'Bovidae',habitat:'Steep, rugged mountain slopes and cliffs',diet:'Leaves, shoots, grasses and shrubs',range:'Hindu Kush and adjoining mountain ranges; confirm locality records before attributing a valley-level presence',behaviour:'Sure-footed mountain caprine; often uses steep escape terrain',role:'Browser and prey species within mountain food webs',status:'Near Threatened (verify current IUCN assessment date)',threats:'Habitat pressure, disturbance and illegal hunting; threat intensity varies by population',image:'https://upload.wikimedia.org/wikipedia/commons/f/f5/Markhor.jpg',source:'https://commons.wikimedia.org/wiki/File:Markhor.jpg',credit:'F. Spangenberg (Der Irbis) · CC BY-SA 3.0 / GFDL · Berlin Zoo reference photo'},
    {common:'Snow leopard',scientific:'Panthera uncia',group:'mammal',family:'Felidae',habitat:'High-altitude rocky terrain, alpine zones and steep mountain systems',diet:'Wild ungulates and other available prey',range:'Mountain ranges of Central and South Asia, including the Hindu Kush region',behaviour:'Solitary, elusive large cat adapted to cold, rugged terrain',role:'Apex predator; contributes to prey population dynamics',status:'Vulnerable (verify current IUCN assessment date)',threats:'Prey depletion, habitat fragmentation, conflict and illegal killing',image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Snow_leopard%28Panthera_uncia%29.jpg/960px-Snow_leopard%28Panthera_uncia%29.jpg',source:'https://commons.wikimedia.org/wiki/File:Snow_leopard_(Panthera_uncia).jpg',credit:'PeCeT_full · CC BY-SA 2.0 · zoo reference photo'},
    {common:'Himalayan ibex',scientific:'Capra sibirica',group:'mammal',family:'Bovidae',habitat:'Rocky slopes, cliffs, alpine meadows and open high mountain terrain',diet:'Grasses, herbs, leaves and shrubs',range:'Central Asian and Himalayan mountain systems; regional records should be checked',behaviour:'Herd-forming wild goat; males carry long, backward-curving horns',role:'Mountain herbivore and prey species',status:'Least Concern globally (verify current IUCN assessment date)',threats:'Local hunting pressure, disturbance and changes in alpine habitat',image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Siberian_Ibex.jpg/960px-Siberian_Ibex.jpg',source:'https://commons.wikimedia.org/wiki/File:Siberian_Ibex.jpg',credit:'Quinet · CC BY 3.0 · Berlin Zoo reference photo'},
    {common:'Himalayan monal',scientific:'Lophophorus impejanus',group:'bird',family:'Phasianidae',habitat:'Montane forests, forest edges, scrub and alpine meadows',diet:'Roots, tubers, seeds, berries, insects and other invertebrates',range:'Himalayan region and adjoining highlands; confirm local distribution with regional records',behaviour:'Ground-foraging pheasant; males have iridescent plumage and a crest',role:'Omnivorous forest-floor forager and seed consumer',status:'Least Concern globally (verify current IUCN assessment date)',threats:'Habitat change and hunting pressure in parts of its range',image:'https://upload.wikimedia.org/wikipedia/commons/0/08/Himalayan_Monal_2025.jpg',source:'https://commons.wikimedia.org/wiki/File:Himalayan_Monal_2025.jpg',credit:'Gurung pratap · CC BY-SA 4.0 · Sagarmatha National Park, Nepal'}
  ];
  const faunaGrid = $('#fauna-grid');
  const detailModal = document.createElement('div');
  detailModal.className = 'species-modal hidden';
  detailModal.id = 'species-detail-modal';
  detailModal.setAttribute('role','dialog');
  detailModal.setAttribute('aria-modal','true');
  detailModal.innerHTML = '<div class="species-modal-backdrop" data-modal-close></div><article class="species-modal-card"><button class="modal-close" type="button" data-modal-close aria-label="Close">×</button><div id="species-modal-content"></div></article>';
  document.body.appendChild(detailModal);
  detailModal.addEventListener('click', e => { if(e.target.closest('[data-modal-close]')) detailModal.classList.add('hidden'); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') detailModal.classList.add('hidden'); });

  function faunaCard(item, index) {
    return `<article class="fauna-flip-card" data-kind="${item.group}" data-name="${esc((item.common+' '+item.scientific).toLowerCase())}">
      <div class="fauna-flip-inner">
        <div class="fauna-face fauna-front">
          <div class="fauna-photo-wrap"><img class="fauna-photo" loading="${index < 2 ? 'eager':'lazy'}" src="${item.image}" alt="${esc(item.common)}" data-taxon="${esc(item.scientific)}"><span class="photo-source-label">REFERENCE PHOTOGRAPH</span></div><p class="fauna-image-credit">${esc(item.credit)} · <a href="${item.source}" target="_blank" rel="noopener">Image source ↗</a></p>
          <div class="fauna-card-copy"><span class="species-meta-tag">${item.group.toUpperCase()} · ${esc(item.family)}</span><h2>${esc(item.common)}</h2><i>${esc(item.scientific)}</i><p>${esc(item.habitat)}</p><button type="button" class="btn btn-outline flip-fauna">Flip card ↻</button></div>
        </div>
        <div class="fauna-face fauna-back">
          <span class="mini-label">FIELD PROFILE · ${String(index+1).padStart(2,'0')}</span><h2>${esc(item.common)}</h2><i>${esc(item.scientific)}</i>
          <dl><dt>Diet</dt><dd>${esc(item.diet)}</dd><dt>Behaviour</dt><dd>${esc(item.behaviour)}</dd><dt>Conservation</dt><dd>${esc(item.status)}</dd></dl>
          <div class="fauna-card-actions"><button type="button" class="btn btn-primary view-fauna-details">View features & details →</button><button type="button" class="btn btn-outline flip-fauna">Back ↻</button></div>
        </div>
      </div>
    </article>`;
  }
  function renderFauna() {
    if (!faunaGrid) return;
    const query = ($('#fauna-search')?.value || '').trim().toLowerCase();
    const filter = document.querySelector('#fauna-filters .active')?.dataset.faunaFilter || 'all';
    const results = fauna.filter(x => (filter === 'all' || x.group === filter) && `${x.common} ${x.scientific} ${x.family} ${x.habitat}`.toLowerCase().includes(query));
    faunaGrid.innerHTML = results.map(faunaCard).join('') || '<div class="panel">No wildlife profiles match that search. Try another common or scientific name.</div>';
    $('#fauna-count') && ($('#fauna-count').textContent = String(fauna.length).padStart(2,'0'));
    faunaGrid.querySelectorAll('.fauna-photo').forEach(img => {
      img.addEventListener('error', () => {
        // Exact-name fallback via iNaturalist taxonomy photo. It is a real taxon image, not an illustration.
        loadTaxonPhoto(img.dataset.taxon, img);
      }, {once:true});
    });
  }
  function openFaunaDetails(item) {
    const fields = [['Family',item.family],['Habitat',item.habitat],['Diet',item.diet],['Geographic distribution',item.range],['Behaviour',item.behaviour],['Ecological role',item.role],['Conservation status',item.status],['Known pressures',item.threats]];
    $('#species-modal-content').innerHTML = `<img class="modal-species-image" src="${item.image}" alt="${esc(item.common)}"><span class="mini-label">HINDU KUSH FAUNA ATLAS</span><h2>${esc(item.common)}</h2><i>${esc(item.scientific)}</i><dl class="modal-species-facts">${fields.map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl><p class="photo-credit">Image credit: ${esc(item.credit)}. <a href="${item.source}" target="_blank" rel="noopener">Open image source and licence ↗</a></p><p class="muted">This is an educational profile. Distribution and conservation fields should be checked against current regional research and IUCN assessment records before formal publication.</p>`;
    detailModal.classList.remove('hidden');
  }
  if (faunaGrid) {
    renderFauna();
    $('#fauna-search')?.addEventListener('input', renderFauna);
    $('#fauna-filters')?.addEventListener('click', e => {
      const btn = e.target.closest('[data-fauna-filter]');
      if (!btn) return;
      $('#fauna-filters').querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn));
      renderFauna();
    });
    faunaGrid.addEventListener('click', e => {
      const card = e.target.closest('.fauna-flip-card');
      if (!card) return;
      const idx = [...faunaGrid.querySelectorAll('.fauna-flip-card')].indexOf(card);
      const item = fauna.find(x => `${x.common} ${x.scientific}`.toLowerCase() === card.dataset.name);
      if (e.target.closest('.flip-fauna')) card.classList.toggle('is-flipped');
      if (e.target.closest('.view-fauna-details') && item) openFaunaDetails(item);
    });
  }

  async function loadTaxonPhoto(scientificName, img) {
    try {
      const url = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(scientificName)}&rank=species&per_page=8`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Taxonomy photo service unavailable');
      const data = await response.json();
      const exact = (data.results || []).find(t => t.name?.toLowerCase() === scientificName.toLowerCase());
      const photo = exact?.default_photo?.medium_url || exact?.default_photo?.square_url;
      if (!photo) throw new Error('No taxon reference image');
      img.src = photo;
      img.dataset.photoSource = exact.default_photo.attribution || 'iNaturalist taxon photo';
      const faunaCredit = img.closest('.fauna-flip-card')?.querySelector('.fauna-image-credit');
      if (faunaCredit) faunaCredit.innerHTML = `Reference image from iNaturalist · <a href="https://www.inaturalist.org/taxa/${exact.id}" target="_blank" rel="noopener">taxon photo and attribution ↗</a>`;
    } catch (_) {
      img.classList.add('photo-unavailable');
      const note = document.createElement('span');
      note.className = 'photo-unavailable-note';
      note.textContent = 'Reference photograph unavailable on this connection';
      img.parentElement?.appendChild(note);
    }
  }

  const curatedPlantPhotos = {
    'Primula denticulata': {src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Primula_Denticulata.jpg/960px-Primula_Denticulata.jpg', credit:'Tejvan Pettinger · CC BY 2.0 · Wikimedia Commons', page:'https://commons.wikimedia.org/wiki/File:Primula_Denticulata.jpg'},
    'Rhododendron arboreum': {src:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Rhododendron_arboreum_flowers.jpg/960px-Rhododendron_arboreum_flowers.jpg', credit:'R.M.S. Ratnayake · CC BY-SA 4.0 · Wikimedia Commons', page:'https://commons.wikimedia.org/wiki/File:Rhododendron_arboreum_flowers.jpg'}
  };

  // Replace the old photo lookup with a resilient exact-taxon sequence.
  // iNaturalist's taxon default photo is used only when its scientific-name match is exact.
  loadSpeciesPhoto = async function(plant, target) {
    if (!plant) return;
    const prefix = target.slice(1) + '-';
    const img = $('#species-image-' + prefix + plant.id);
    const placeholder = $('#placeholder-' + prefix + plant.id);
    const credit = $('#photo-credit-' + prefix + plant.id);
    if (!img || img.dataset.bioLoading === '1') return;
    img.dataset.bioLoading = '1';
    if (credit) credit.textContent = 'Loading verified reference photograph…';
    const curated = curatedPlantPhotos[plant.latin];
    if (curated) {
      img.onload = () => { img.classList.remove('hidden'); placeholder?.classList.add('hidden'); if(credit)credit.innerHTML=`Photo: ${esc(curated.credit)} · <a href="${curated.page}" target="_blank" rel="noopener">image source & licence</a>`; };
      img.onerror = () => { img.dataset.bioLoading='0'; loadTaxonPhoto(plant.latin,img); };
      img.src = curated.src;
      return;
    }
    try {
      let candidates = [];
      try { candidates = await gbifPhotos(plant.latin); } catch (_) {}
      if (candidates.length) {
        const item = candidates[0];
        img.onload = () => {
          img.classList.remove('hidden'); placeholder?.classList.add('hidden');
          if (credit) credit.innerHTML = `Photo: ${esc(item.author)} · ${esc(item.license)} · <a href="${esc(item.url)}" target="_blank" rel="noopener">GBIF record & licence</a>`;
        };
        img.onerror = () => { img.dataset.bioLoading = '0'; loadTaxonPhoto(plant.latin,img).then(()=>{if(img.src && !img.classList.contains('photo-unavailable')){img.classList.remove('hidden');placeholder?.classList.add('hidden');if(credit)credit.textContent='Reference photograph from iNaturalist taxon record; open source attribution on the taxon page.';}}); };
        img.src = item.src; return;
      }
      const taxonResponse = await fetch(`https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(plant.latin)}&rank=species&per_page=8`);
      if (!taxonResponse.ok) throw new Error('Taxonomy photo service unavailable');
      const taxonData = await taxonResponse.json();
      const taxon = (taxonData.results || []).find(t => t.name?.toLowerCase() === plant.latin.toLowerCase());
      const photo = taxon?.default_photo?.medium_url || taxon?.default_photo?.square_url;
      if (photo) {
        img.onload = () => {
          img.classList.remove('hidden'); placeholder?.classList.add('hidden');
          if (credit) credit.innerHTML = `Reference photograph · <a href="https://www.inaturalist.org/taxa/${taxon.id}" target="_blank" rel="noopener">iNaturalist taxon record & attribution</a>`;
        };
        img.onerror = async () => {
          try {
            const commons = await commonsPhotos(plant.latin);
            if (!commons.length) throw new Error('No Commons image');
            const item = commons[0];
            img.onload = () => {
              img.classList.remove('hidden'); placeholder?.classList.add('hidden');
              if (credit) credit.innerHTML = `Photo: ${esc(item.author)} · ${esc(item.license)} · <a href="${esc(item.url)}" target="_blank" rel="noopener">Wikimedia Commons source</a>`;
            };
            img.onerror = () => { if(credit)credit.textContent='No exact-species photo could be loaded.'; };
            img.src = item.src;
          } catch (_) { if(credit)credit.textContent='No exact-species photograph is available from the connected sources.'; }
        };
        img.src = photo;
      } else {
        const commons = await commonsPhotos(plant.latin);
        if (!commons.length) throw new Error('No exact taxon photo');
        const item = commons[0];
        img.onload = () => {
          img.classList.remove('hidden'); placeholder?.classList.add('hidden');
          if (credit) credit.innerHTML = `Photo: ${esc(item.author)} · ${esc(item.license)} · <a href="${esc(item.url)}" target="_blank" rel="noopener">Wikimedia Commons source</a>`;
        };
        img.onerror = () => { if(credit)credit.textContent='No exact-species photo could be loaded.'; };
        img.src = item.src;
      }
    } catch (_) {
      if (credit) credit.textContent = 'No exact-species photograph is available from the connected biodiversity sources right now.';
      img.dataset.bioLoading = '0';
    }
  };
  // Re-render the two plant collections so this resilient loader is used for every visible card.
  if (typeof renderSpecies === 'function') {
    renderSpecies('#species-grid');
    renderSpecies('#atlas-grid');
  }

  // Upgrade the existing 55-plant image retrieval: GBIF exact records first, then exact iNaturalist taxon photo.
  // Existing Commons fallback is retained by the original project.
  const plantPhotoObserver = new MutationObserver(() => {
    document.querySelectorAll('.species-photo[data-species-id]').forEach(img => {
      if (img.dataset.bioPhotoHooked) return;
      img.dataset.bioPhotoHooked = '1';
      img.addEventListener('error', () => {
        const plant = species.find(s => String(s.id) === img.dataset.speciesId);
        if (plant?.latin) loadTaxonPhoto(plant.latin, img);
      }, {once:true});
    });
  });
  ['#species-grid','#atlas-grid'].forEach(sel => { const el=$(sel); if(el) plantPhotoObserver.observe(el,{childList:true,subtree:true}); });

  // Flip interaction for the existing plant atlas cards; preserves the original detailed profile content.
  function enhancePlantCards() {
    document.querySelectorAll('.species-card').forEach(card => {
      if (card.dataset.flipReady) return;
      const photo = card.querySelector('.species-photo-wrap');
      const body = card.querySelector('.species-card-body');
      if (!photo || !body) return;
      card.dataset.flipReady = '1';
      const inner = document.createElement('div'); inner.className = 'plant-flip-inner';
      const front = document.createElement('div'); front.className = 'plant-flip-front';
      const back = document.createElement('div'); back.className = 'plant-flip-back';
      const title = body.querySelector('h3')?.cloneNode(true);
      const latin = body.querySelector('.latin')?.cloneNode(true);
      front.append(photo);
      if (title) front.append(title);
      if (latin) front.append(latin);
      const flip = document.createElement('button'); flip.className='btn btn-outline plant-flip-toggle'; flip.type='button'; flip.textContent='Flip for details ↻';
      front.append(flip);
      const backTitle = document.createElement('h3'); backTitle.textContent='Species profile';
      back.append(backTitle,body);
      const backFlip=document.createElement('button');backFlip.className='btn btn-outline plant-flip-toggle';backFlip.type='button';backFlip.textContent='Back to photograph ↻';
      back.append(backFlip);
      inner.append(front,back);card.replaceChildren(inner);
      card.classList.add('plant-flip-card');
    });
  }
  const cardObserver = new MutationObserver(enhancePlantCards);
  ['#species-grid','#atlas-grid'].forEach(sel=>{const el=$(sel);if(el)cardObserver.observe(el,{childList:true,subtree:true});});
  document.addEventListener('click', e => {
    if(e.target.closest('.plant-flip-toggle')) e.target.closest('.species-card')?.classList.toggle('is-flipped');
  });
  enhancePlantCards();

  // Pl@ntNet online plant identification. API key is only held by the Vercel serverless function.
  const pnInput = $('#plantnet-photo'), pnButton = $('#plantnet-identify'), pnResults = $('#plantnet-results');
  let pnFile = null;
  pnInput?.addEventListener('change', () => {
    pnFile = pnInput.files?.[0] || null;
    if (!pnFile) return;
    if (!/^image\/(jpeg|png|webp)$/.test(pnFile.type) || pnFile.size > 8*1024*1024) {
      alert('Choose a JPG, PNG or WebP image under 8 MB.'); pnInput.value=''; pnFile=null; return;
    }
    $('#plantnet-preview').src = URL.createObjectURL(pnFile);
    $('#plantnet-preview-wrap').classList.remove('hidden');
    pnResults.classList.add('hidden');
  });
  pnButton?.addEventListener('click', async () => {
    if (!pnFile) { alert('Choose a plant photograph first.'); return; }
    pnButton.disabled=true;pnButton.textContent='Analysing photograph…';
    pnResults.classList.remove('hidden');pnResults.textContent='Sending image securely to the configured Pl@ntNet endpoint…';
    try {
      const upload = await preparePlantUpload(pnFile);

const res = await fetch('/api/plant-identify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(upload)
});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error || 'Plant identification service unavailable.');
      const candidates=data.results || [];
      if(!candidates.length) throw new Error('The model returned no candidate species for this image.');
      pnResults.innerHTML=`<h3>Pl@ntNet candidate results</h3><p class="muted">AI suggestions only — confirm with a botanist or regional field guide.</p>${candidates.slice(0,5).map((r,i)=>{const tax=r.species||{};return `<article class="plantnet-result"><b>${i+1}. ${esc(tax.commonNames?.[0]||tax.scientificNameWithoutAuthor||tax.scientificName||'Unresolved taxon')}</b><i>${esc(tax.scientificName||'Scientific name not returned')}</i><span>Model score: ${Number(r.score||0).toFixed(3)}</span><small>Family: ${esc(tax.family?.scientificName||'Not supplied by API')}</small></article>`}).join('')}<p class="photo-credit">Powered by Pl@ntNet. Scores are model ranking scores, not probabilities of certainty.</p>`;
    } catch(err) {
      pnResults.innerHTML=`<div class="notice warning"><b>Identification unavailable</b><p>${esc(err.message)}</p><p>For Vercel, add <code>PLANTNET_API_KEY</code> in Project Settings → Environment Variables, then redeploy. The key is never placed in browser code.</p></div>`;
    } finally {pnButton.disabled=false;pnButton.textContent='Identify plant online →';}
  });

  // Browser-side pretrained MobileNet image classifier for broad fauna screening.
  let mobileNetPromise = null, mobileNetModel = null, faunaFile = null;
  const faunaInput = $('#fauna-photo'), faunaCameraInput = $('#fauna-camera-photo');
  const faunaPreview = $('#fauna-preview'), faunaPreviewWrap = $('#fauna-preview-wrap');
  const faunaButton = $('#fauna-identify'), faunaResults = $('#fauna-results'), modelStatus = $('#fauna-model-status');
  function chooseFaunaFile(file) {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type) || file.size > 10*1024*1024) { alert('Choose a JPG, PNG, WebP or AVIF image under 10 MB.'); return; }
    faunaFile=file;faunaPreview.src=URL.createObjectURL(file);faunaPreviewWrap.classList.remove('hidden');faunaResults.classList.add('hidden');
  }
  faunaInput?.addEventListener('change',()=>chooseFaunaFile(faunaInput.files?.[0]));
  faunaCameraInput?.addEventListener('change',()=>chooseFaunaFile(faunaCameraInput.files?.[0]));
  async function loadMobileNet() {
    if (mobileNetModel) return mobileNetModel;
    if (mobileNetPromise) return mobileNetPromise;
    mobileNetPromise=(async()=>{
      modelStatus.textContent='Loading TensorFlow.js and pretrained MobileNet weights…';
      const addScript=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=()=>reject(new Error('Could not load model library. Connect to the internet and try again.'));document.head.appendChild(s);});
      if (!window.tf) await addScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js');
      if (!window.mobilenet) await addScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1');
      mobileNetModel=await window.mobilenet.load({version:2,alpha:1.0});
      modelStatus.textContent='MobileNet loaded · predictions run locally in this browser. Model files may be cached for later offline use.';
      return mobileNetModel;
    })().catch(err=>{mobileNetPromise=null;modelStatus.textContent=err.message;throw err;});
    return mobileNetPromise;
  }
  faunaButton?.addEventListener('click',async()=>{
    if(!faunaFile){alert('Upload or capture an animal photograph first.');return;}
    faunaButton.disabled=true;faunaButton.textContent='Loading model…';faunaResults.classList.remove('hidden');faunaResults.textContent='Preparing local image classification…';
    try {
      const model=await loadMobileNet();
      const predictions=await model.classify(faunaPreview,5);
      const localMap=[
        {match:/snow leopard/i,name:'Snow leopard',scientific:'Panthera uncia'},
        {match:/ibex|wild goat|mountain goat/i,name:'Himalayan ibex / wild goat group',scientific:'Capra spp.'},
        {match:/markhor/i,name:'Markhor',scientific:'Capra falconeri'},
        {match:/monal|pheasant/i,name:'Pheasant group (not species-confirmed)',scientific:'Phasianidae'}
      ];
      const p=predictions.map(x=>({...x,percent:Math.round(x.probability*1000)/10}));
      const bestLocal=p.map(pred=>({pred,local:localMap.find(m=>m.match.test(pred.className))})).find(x=>x.local);
      faunaResults.innerHTML=`<h3>On-device model output</h3><p class="muted">General ImageNet classifier · top labels, not a specialist wildlife model.</p><ol class="prediction-list">${p.map(x=>`<li><span>${esc(x.className)}</span><b>${x.percent.toFixed(1)}%</b></li>`).join('')}</ol>${bestLocal?`<div class="notice info"><b>Possible regional group to investigate: ${esc(bestLocal.local.name)}</b><p>${esc(bestLocal.local.scientific)} · Model label: ${esc(bestLocal.pred.className)}. This is not a confirmed species identification.</p></div>`:'<div class="notice warning"><b>No supported Hindu Kush species label in the top results.</b><p>Do not infer a local species from a broad animal label. Ask a qualified identifier to review the image.</p></div>'}<p class="muted">Scores are classifier scores, not field-confirmation probabilities. Similar species and captive-animal images can be misclassified.</p>`;
    } catch(err) {faunaResults.innerHTML=`<div class="notice warning"><b>Model unavailable</b><p>${esc(err.message)}</p></div>`;}
    finally {faunaButton.disabled=false;faunaButton.textContent='Run local image model →';}
  });

  const plantOfflineButton = $('#plantnet-offline');
  plantOfflineButton?.addEventListener('click', async () => {
    if (!pnFile) { alert('Choose a plant photograph first.'); return; }
    plantOfflineButton.disabled=true;plantOfflineButton.textContent='Loading offline model…';
    pnResults.classList.remove('hidden');pnResults.textContent='Running the general-purpose model locally in this browser…';
    try {
      const model=await loadMobileNet();
      const predictions=await model.classify($('#plantnet-preview'),5);
      pnResults.innerHTML=`<h3>On-device visual model output</h3><p class="muted">MobileNet V2 / ImageNet · general visual classification, not a specialist Chitral flora model.</p><ol class="prediction-list">${predictions.map(x=>`<li><span>${esc(x.className)}</span><b>${(x.probability*100).toFixed(1)}%</b></li>`).join('')}</ol><div class="notice warning"><b>Interpret carefully</b><p>This model may identify broad plant or object classes but cannot reliably identify local species or plant diseases. Use Pl@ntNet online for a specialist plant-species suggestion, or the offline trait guide for a local shortlist.</p></div>`;
    } catch(err) {pnResults.innerHTML=`<div class="notice warning"><b>Offline model unavailable</b><p>${esc(err.message)}</p><p>Download the model once while connected, then retry. The local trait matcher remains available.</p></div>`;}
    finally {plantOfflineButton.disabled=false;plantOfflineButton.textContent='Run offline visual model';}
  });

  // Add explicit "image screening" context to the plant health photo preview without claiming pixel diagnosis.
  const diseaseNotice = document.querySelector('#view-disease .notice.warning');
  if (diseaseNotice) diseaseNotice.innerHTML = '<b>What is genuinely available:</b> symptom-based offline matching is active. The uploaded photograph is stored only as a local preview; this release does not contain a validated plant-disease image model or a free, open disease-diagnosis API. Never treat a photo-only prediction as a diagnosis.';

  // Network state and language status additions.
  window.addEventListener('online',()=>document.body.classList.remove('network-offline'));
  window.addEventListener('offline',()=>document.body.classList.add('network-offline'));
  if(!navigator.onLine)document.body.classList.add('network-offline');
})();
