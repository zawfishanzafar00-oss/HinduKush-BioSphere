/* HinduKush BioSphere — research-grade feature extensions.
   AI outputs are suggestions, not verified field records. */
(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  // Exact-name iNaturalist fallback shared by Flora and Fauna Atlas cards.
  async function loadTaxonPhoto(scientificName, img) {
    if (!img || !scientificName || img.dataset.photoLoading === '1') return;
    img.dataset.photoLoading = '1';

    const target = img.dataset.target || '';
    const speciesId = img.dataset.speciesId || '';
    const prefix = target.replace(/^#/, '');
    const placeholder = target && speciesId
      ? document.getElementById(`placeholder-${prefix}-${speciesId}`) : null;
    const credit = target && speciesId
      ? document.getElementById(`photo-credit-${prefix}-${speciesId}`) : null;
    const faunaCredit = img.closest('.fauna-flip-card')
      ?.querySelector('.fauna-image-credit');

    try {
      const url = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(scientificName)}&rank=species&per_page=8`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Taxonomy photo service unavailable');

      const data = await response.json();
      const exact = (data.results || []).find(
        taxon => taxon.name?.toLowerCase() === scientificName.toLowerCase()
      );
      const photo = exact?.default_photo?.medium_url ||
        exact?.default_photo?.square_url;
      if (!photo) throw new Error('No exact taxon photo');

      img.onload = () => {
        img.classList.remove('hidden', 'photo-unavailable');
        placeholder?.classList.add('hidden');
        if (credit) {
          credit.textContent = `Reference photograph: ${exact.name} · iNaturalist`;
        }
        if (faunaCredit) {
          faunaCredit.innerHTML = `Reference image from iNaturalist · <a href="https://www.inaturalist.org/taxa/${exact.id}" target="_blank" rel="noopener">taxon record and attribution ↗</a>`;
        }
        img.dataset.photoLoading = '0';
      };
      img.onerror = () => {
        img.classList.add('photo-unavailable');
        img.classList.add('hidden');
        placeholder?.classList.remove('hidden');
        if (credit) credit.textContent = 'The reference photograph could not be loaded.';
        if (faunaCredit) faunaCredit.textContent = 'Reference photograph unavailable from iNaturalist.';
        img.dataset.photoLoading = '0';
      };
      img.src = photo;
      img.dataset.photoSource = exact.default_photo?.attribution || 'iNaturalist';
    } catch (_) {
      img.classList.add('photo-unavailable');
      if (target && speciesId) {
        img.classList.add('hidden');
        placeholder?.classList.remove('hidden');
      }
      if (credit) credit.textContent = 'No exact-species photograph is available right now.';
      if (faunaCredit) faunaCredit.textContent = 'Exact-taxon reference photograph unavailable.';
      img.dataset.photoLoading = '0';
    }
  }

  // -------------------- FAUNA ATLAS --------------------
  const fauna = [
    {common:'Markhor',scientific:'Capra falconeri',group:'mammal',family:'Bovidae',habitat:'Steep, rugged mountain slopes and cliffs',diet:'Leaves, shoots, grasses and shrubs',range:'Hindu Kush; Chitral Gol National Park records',behaviour:'Sure-footed mountain goat; uses steep terrain',role:'Mountain herbivore and prey species',status:'Near Threatened (verify current assessment)',threats:'Habitat pressure, disturbance and illegal hunting',image:'https://upload.wikimedia.org/wikipedia/commons/f/f5/Markhor.jpg',source:'https://commons.wikimedia.org/wiki/File:Markhor.jpg',credit:'Wikimedia Commons reference photograph'},
    {common:'Snow leopard',scientific:'Panthera uncia',group:'mammal',family:'Felidae',habitat:'High-altitude rocky terrain and alpine mountains',diet:'Wild ungulates and other available prey',range:'Hindu Kush and wider Central and South Asian mountains',behaviour:'Solitary, elusive mountain cat',role:'Apex predator',status:'Vulnerable (verify current assessment)',threats:'Prey depletion, habitat fragmentation and conflict',image:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Snow_leopard%28Panthera_uncia%29.jpg/960px-Snow_leopard%28Panthera_uncia%29.jpg',source:'https://commons.wikimedia.org/wiki/File:Snow_leopard_(Panthera_uncia).jpg',credit:'Wikimedia Commons reference photograph'},
    {common:'Himalayan ibex',scientific:'Capra sibirica',group:'mammal',family:'Bovidae',habitat:'Rocky slopes, cliffs and alpine meadows',diet:'Grasses, herbs, leaves and shrubs',range:'Torkhow Valley and wider Hindu Kush mountain systems',behaviour:'Herd-forming wild goat with curved horns',role:'Mountain herbivore and snow leopard prey',status:'Least Concern globally (verify current assessment)',threats:'Hunting pressure and habitat disturbance',image:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Siberian_Ibex.jpg/960px-Siberian_Ibex.jpg',source:'https://commons.wikimedia.org/wiki/File:Siberian_Ibex.jpg',credit:'Wikimedia Commons reference photograph'},
    {common:'Himalayan monal',scientific:'Lophophorus impejanus',group:'bird',family:'Phasianidae',habitat:'Montane forests, scrub and alpine meadows',diet:'Roots, seeds, berries and insects',range:'Himalayan region; local distribution requires verification',behaviour:'Ground-foraging pheasant; males have iridescent plumage',role:'Forest-floor forager and seed consumer',status:'Least Concern globally (verify current assessment)',threats:'Habitat change and hunting pressure',image:'https://upload.wikimedia.org/wikipedia/commons/0/08/Himalayan_Monal_2025.jpg',source:'https://commons.wikimedia.org/wiki/File:Himalayan_Monal_2025.jpg',credit:'Wikimedia Commons reference photograph'},
    {common:'Grey wolf',scientific:'Canis lupus',group:'mammal',family:'Canidae',habitat:'Mountain valleys, open slopes and alpine terrain',diet:'Wild prey and other available food',range:'Recorded in the Torkhow Valley study and Chitral Gol research',behaviour:'Social canid that may live and hunt in family groups',role:'Large predator in mountain ecosystems',status:'Not assessed here; check current regional status',threats:'Conflict with livestock owners and habitat pressure',image:'',source:'https://psa.pastic.gov.pk/article/2478/status-of-snow-leopard-and-prey-species-in-torkhow-valley-district-chitral',credit:'Exact-taxon photograph lookup'},
    {common:'Golden jackal',scientific:'Canis aureus',group:'mammal',family:'Canidae',habitat:'Valleys, scrub, woodland edges and open country',diet:'Small animals, insects and other available food',range:'Recorded in Torkhow Valley and Chitral Gol research',behaviour:'Adaptable canid, often active around dawn and dusk',role:'Scavenger and small-animal predator',status:'Not assessed here; check current assessment',threats:'Habitat change and conflict',image:'',source:'https://researcherslinks.com/current-issues/Relative-Abundance-Mammalian-Fauna-Chitral-Gol-National-Park-Pakistan/20/1/5508/html',credit:'Exact-taxon photograph lookup'},
    {common:'Red fox',scientific:'Vulpes vulpes',group:'mammal',family:'Canidae',habitat:'Mountain slopes, scrub and open valleys',diet:'Small mammals, birds, insects and fruit',range:'Recorded in Torkhow Valley and Chitral Gol National Park',behaviour:'Solitary and adaptable; often active at night',role:'Controls small-animal populations',status:'Least Concern globally (verify current assessment)',threats:'Local disturbance and habitat change',image:'',source:'https://researcherslinks.com/current-issues/Relative-Abundance-Mammalian-Fauna-Chitral-Gol-National-Park-Pakistan/20/1/5508/html',credit:'Exact-taxon photograph lookup'},
    {common:'Himalayan lynx',scientific:'Lynx lynx',group:'mammal',family:'Felidae',habitat:'Remote rocky slopes and mountain forests',diet:'Hares, rodents and other small mammals',range:'Recorded in Chitral Gol research and regional wildlife reports',behaviour:'Elusive wild cat with distinctive ear tufts',role:'Predator of small and medium-sized animals',status:'Verify current regional assessment',threats:'Habitat disturbance and declining prey',image:'',source:'https://researcherslinks.com/current-issues/Relative-Abundance-Mammalian-Fauna-Chitral-Gol-National-Park-Pakistan/20/1/5508/html',credit:'Exact-taxon photograph lookup'},
    {common:'Common leopard',scientific:'Panthera pardus',group:'mammal',family:'Felidae',habitat:'Woodland, rocky slopes and forested valleys',diet:'Medium-sized mammals and other prey',range:'Camera-trap record from Chitral Gol National Park',behaviour:'Solitary, adaptable large cat',role:'Predator that helps regulate prey populations',status:'Vulnerable globally (verify current assessment)',threats:'Habitat fragmentation and conflict',image:'',source:'https://researcherslinks.com/current-issues/Relative-Abundance-Mammalian-Fauna-Chitral-Gol-National-Park-Pakistan/20/1/5508/html',credit:'Exact-taxon photograph lookup'},
    {common:'Leopard cat',scientific:'Prionailurus bengalensis',group:'mammal',family:'Felidae',habitat:'Scrub, woodland and forest edges',diet:'Small mammals, birds and reptiles',range:'Camera-trap record from Chitral Gol National Park',behaviour:'Small, mostly nocturnal wild cat',role:'Predator of rodents and other small animals',status:'Least Concern globally (verify current assessment)',threats:'Habitat change and disturbance',image:'',source:'https://researcherslinks.com/current-issues/Relative-Abundance-Mammalian-Fauna-Chitral-Gol-National-Park-Pakistan/20/1/5508/html',credit:'Exact-taxon photograph lookup'},
    {common:'Stone marten',scientific:'Martes foina',group:'mammal',family:'Mustelidae',habitat:'Rocky areas, woodland edges and settlements',diet:'Small mammals, birds, insects and fruit',range:'Camera-trap record from Chitral Gol National Park',behaviour:'Agile, mostly nocturnal member of the weasel family',role:'Small-animal predator and scavenger',status:'Not assessed here; check current assessment',threats:'Habitat change and human disturbance',image:'',source:'https://researcherslinks.com/current-issues/Relative-Abundance-Mammalian-Fauna-Chitral-Gol-National-Park-Pakistan/20/1/5508/html',credit:'Exact-taxon photograph lookup'},
    {common:'Golden marmot',scientific:'Marmota caudata',group:'mammal',family:'Sciuridae',habitat:'High mountain grasslands and rocky slopes',diet:'Grasses, herbs and other vegetation',range:'Camera-trap record from Chitral Gol National Park',behaviour:'Social burrowing rodent; may hibernate seasonally',role:'Important prey and soil ecosystem engineer',status:'Verify current assessment',threats:'Habitat disturbance and local pressures',image:'',source:'https://researcherslinks.com/current-issues/Relative-Abundance-Mammalian-Fauna-Chitral-Gol-National-Park-Pakistan/20/1/5508/html',credit:'Exact-taxon photograph lookup'},
    {common:'Kashmir flying squirrel',scientific:'Eoglaucomys fimbriatus',group:'mammal',family:'Sciuridae',habitat:'Mountain forests with suitable trees and nesting sites',diet:'Seeds, nuts, buds and other plant material',range:'Camera-trap record from Chitral Gol National Park',behaviour:'Nocturnal squirrel that glides between trees',role:'Forest food-web member and seed consumer',status:'Verify current assessment',threats:'Loss and fragmentation of forest habitat',image:'',source:'https://researcherslinks.com/current-issues/Relative-Abundance-Mammalian-Fauna-Chitral-Gol-National-Park-Pakistan/20/1/5508/html',credit:'Exact-taxon photograph lookup'},
    {common:'Himalayan wood mouse',scientific:'Apodemus pallipes',group:'mammal',family:'Muridae',habitat:'Mountain vegetation, woodland and rocky ground',diet:'Seeds, plant material and small invertebrates',range:'Small-mammal record in Chitral Gol research',behaviour:'Small rodent, generally active at night',role:'Prey for owls and small carnivores',status:'Verify species-level identification and current assessment',threats:'Local habitat changes',image:'',source:'https://researcherslinks.com/current-issues/Relative-Abundance-Mammalian-Fauna-Chitral-Gol-National-Park-Pakistan/20/1/5508/html',credit:'Exact-taxon photograph lookup'},
    {common:'Cape hare',scientific:'Lepus capensis',group:'mammal',family:'Leporidae',habitat:'Open slopes, grassland and scrub',diet:'Grasses and other vegetation',range:'Recorded in Chitral Gol camera-trap research; taxonomy should be checked',behaviour:'Fast-running herbivore, usually active at low light',role:'Prey for large and medium-sized predators',status:'Verify current assessment and local taxonomy',threats:'Habitat change and hunting pressure',image:'',source:'https://researcherslinks.com/current-issues/Relative-Abundance-Mammalian-Fauna-Chitral-Gol-National-Park-Pakistan/20/1/5508/html',credit:'Exact-taxon photograph lookup'},
    {common:'Himalayan snowcock',scientific:'Tetraogallus himalayensis',group:'bird',family:'Phasianidae',habitat:'High alpine slopes, rocky ridges and open mountain terrain',diet:'Seeds, shoots and other plant material',range:'Listed in the Torkhow Valley regional fauna records',behaviour:'Ground-dwelling mountain gamebird',role:'Part of the alpine bird community',status:'Verify current assessment',threats:'Disturbance and habitat pressure',image:'',source:'https://psa.pastic.gov.pk/article/2478/status-of-snow-leopard-and-prey-species-in-torkhow-valley-district-chitral',credit:'Exact-taxon photograph lookup'},
    {common:'Chukar partridge',scientific:'Alectoris chukar',group:'bird',family:'Phasianidae',habitat:'Dry rocky slopes, scrub and open hillsides',diet:'Seeds, shoots and insects',range:'Listed in the Torkhow Valley and Chitral Gol regional fauna records',behaviour:'Ground-foraging bird, often found in coveys',role:'Seed consumer and prey species',status:'Least Concern globally (verify current assessment)',threats:'Hunting pressure and habitat disturbance',image:'',source:'https://psa.pastic.gov.pk/article/2478/status-of-snow-leopard-and-prey-species-in-torkhow-valley-district-chitral',credit:'Exact-taxon photograph lookup'},
    {common:'Golden eagle',scientific:'Aquila chrysaetos',group:'bird',family:'Accipitridae',habitat:'Mountain cliffs, open valleys and alpine terrain',diet:'Small and medium-sized animals',range:'Listed in the Terich Valley regional fauna records',behaviour:'Large soaring raptor with excellent eyesight',role:'Top avian predator',status:'Least Concern globally (verify current assessment)',threats:'Disturbance and changes in prey availability',image:'',source:'https://doi.org/10.36899/JAPS.2021.6.0376',credit:'Exact-taxon photograph lookup'},
    {common:'Brown bear',scientific:'Ursus arctos',group:'mammal',family:'Ursidae',habitat:'Remote mountain forests, alpine meadows and valleys',diet:'Omnivorous; plants, insects and available animal food',range:'Listed in the Terich Valley regional fauna records',behaviour:'Large, generally solitary omnivore',role:'Important large mammal in mountain ecosystems',status:'Verify current regional assessment',threats:'Habitat disturbance and human-wildlife conflict',image:'',source:'https://doi.org/10.36899/JAPS.2021.6.0376',credit:'Exact-taxon photograph lookup'},
    {common:'Himalayan black bear',scientific:'Ursus thibetanus',group:'mammal',family:'Ursidae',habitat:'Forested mountain slopes and wooded valleys',diet:'Omnivorous; fruits, plants, insects and other food',range:'Broader Chitral district wildlife references; not confirmed for every valley',behaviour:'Mostly solitary bear that can climb trees',role:'Seed disperser and forest ecosystem member',status:'Vulnerable globally (verify current assessment)',threats:'Forest loss and human-wildlife conflict',image:'',source:'https://portals.iucn.org/library/sites/library/files/documents/WCS-PK-035.pdf',credit:'Exact-taxon photograph lookup'}
  ];
    // -------------------- FAUNA ATLAS DISPLAY --------------------
  const faunaGrid = $('#fauna-grid');

  const detailModal = document.createElement('div');
  detailModal.className = 'species-modal hidden';
  detailModal.id = 'species-detail-modal';
  detailModal.setAttribute('role', 'dialog');
  detailModal.setAttribute('aria-modal', 'true');
  detailModal.innerHTML = `
    <div class="species-modal-backdrop" data-modal-close></div>
    <article class="species-modal-card">
      <button class="modal-close" type="button" data-modal-close aria-label="Close">×</button>
      <div id="species-modal-content"></div>
    </article>`;
  document.body.appendChild(detailModal);

  detailModal.addEventListener('click', event => {
    if (event.target.closest('[data-modal-close]')) {
      detailModal.classList.add('hidden');
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') detailModal.classList.add('hidden');
  });

  function faunaCard(item, index) {
    return `
      <article class="fauna-flip-card"
        data-kind="${item.group}"
        data-name="${esc((item.common + ' ' + item.scientific).toLowerCase())}">
        <div class="fauna-flip-inner">
          <div class="fauna-face fauna-front">
            <div class="fauna-photo-wrap">
              <img class="fauna-photo"
                loading="${index < 2 ? 'eager' : 'lazy'}"
                ${item.image ? `src="${item.image}"` : ''}
                alt="${esc(item.common)}"
                data-taxon="${esc(item.scientific)}">
              <span class="photo-source-label">REFERENCE PHOTOGRAPH</span>
            </div>
            <p class="fauna-image-credit">
              ${esc(item.credit)} ·
              <a href="${item.source}" target="_blank" rel="noopener">Source ↗</a>
            </p>
            <div class="fauna-card-copy">
              <span class="species-meta-tag">${item.group.toUpperCase()} · ${esc(item.family)}</span>
              <h2>${esc(item.common)}</h2>
              <i>${esc(item.scientific)}</i>
              <p>${esc(item.habitat)}</p>
              <button type="button" class="btn btn-outline flip-fauna">Flip card ↻</button>
            </div>
          </div>

          <div class="fauna-face fauna-back">
            <span class="mini-label">FIELD PROFILE · ${String(index + 1).padStart(2, '0')}</span>
            <h2>${esc(item.common)}</h2>
            <i>${esc(item.scientific)}</i>
            <dl>
              <dt>Diet</dt><dd>${esc(item.diet)}</dd>
              <dt>Behaviour</dt><dd>${esc(item.behaviour)}</dd>
              <dt>Conservation</dt><dd>${esc(item.status)}</dd>
            </dl>
            <div class="fauna-card-actions">
              <button type="button" class="btn btn-primary view-fauna-details">View features & details →</button>
              <button type="button" class="btn btn-outline flip-fauna">Back ↻</button>
            </div>
          </div>
        </div>
      </article>`;
  }

  function openFaunaDetails(item) {
    const fields = [
      ['Family', item.family],
      ['Habitat', item.habitat],
      ['Diet', item.diet],
      ['Geographic distribution', item.range],
      ['Behaviour', item.behaviour],
      ['Ecological role', item.role],
      ['Conservation status', item.status],
      ['Known pressures', item.threats]
    ];

    const imageMarkup = item.image
      ? `<img class="modal-species-image" src="${item.image}" alt="${esc(item.common)}">`
      : '';

    $('#species-modal-content').innerHTML = `
      ${imageMarkup}
      <span class="mini-label">HINDU KUSH FAUNA ATLAS</span>
      <h2>${esc(item.common)}</h2>
      <i>${esc(item.scientific)}</i>
      <dl class="modal-species-facts">
        ${fields.map(([key, value]) =>
          `<dt>${esc(key)}</dt><dd>${esc(value)}</dd>`
        ).join('')}
      </dl>
      <p class="photo-credit">
        Image credit: ${esc(item.credit)}.
        <a href="${item.source}" target="_blank" rel="noopener">Open source ↗</a>
      </p>
      <p class="muted">
        Educational profile. Check regional distribution and current conservation
        assessments before using this entry as a formal field record.
      </p>`;

    detailModal.classList.remove('hidden');
  }

  function renderFauna() {
    if (!faunaGrid) return;

    const query = ($('#fauna-search')?.value || '').trim().toLowerCase();
    const filter = document.querySelector('#fauna-filters .active')
      ?.dataset.faunaFilter || 'all';

    const results = fauna.filter(item =>
      (filter === 'all' || item.group === filter) &&
      `${item.common} ${item.scientific} ${item.family} ${item.habitat}`
        .toLowerCase().includes(query)
    );

    faunaGrid.innerHTML = results.map(faunaCard).join('') ||
      '<div class="panel">No wildlife profiles match that search.</div>';

    const count = $('#fauna-count');
    if (count) count.textContent = String(fauna.length).padStart(2, '0');

    faunaGrid.querySelectorAll('.fauna-photo').forEach(img => {
      img.addEventListener('error', () => {
        loadTaxonPhoto(img.dataset.taxon, img);
      }, { once: true });

      if (!img.getAttribute('src')) {
        loadTaxonPhoto(img.dataset.taxon, img);
      }
    });
  }

  if (faunaGrid) {
    renderFauna();

    $('#fauna-search')?.addEventListener('input', renderFauna);

    $('#fauna-filters')?.addEventListener('click', event => {
      const button = event.target.closest('[data-fauna-filter]');
      if (!button) return;

      $('#fauna-filters').querySelectorAll('button').forEach(item => {
        item.classList.toggle('active', item === button);
      });

      renderFauna();
    });

    faunaGrid.addEventListener('click', event => {
      const card = event.target.closest('.fauna-flip-card');
      if (!card) return;

      const item = fauna.find(entry =>
        `${entry.common} ${entry.scientific}`.toLowerCase() === card.dataset.name
      );

      if (event.target.closest('.flip-fauna')) {
        card.classList.toggle('is-flipped');
      }

      if (event.target.closest('.view-fauna-details') && item) {
        openFaunaDetails(item);
      }
    });
  }

  // -------------------- FLORA ATLAS PHOTOGRAPHS --------------------
  const curatedPlantPhotos = {
    'Primula denticulata': {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Primula_Denticulata.jpg/960px-Primula_Denticulata.jpg',
      credit: 'Tejvan Pettinger · CC BY 2.0 · Wikimedia Commons',
      page: 'https://commons.wikimedia.org/wiki/File:Primula_Denticulata.jpg'
    },
    'Rhododendron arboreum': {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Rhododendron_arboreum_flowers.jpg/960px-Rhododendron_arboreum_flowers.jpg',
      credit: 'R.M.S. Ratnayake · CC BY-SA 4.0 · Wikimedia Commons',
      page: 'https://commons.wikimedia.org/wiki/File:Rhododendron_arboreum_flowers.jpg'
    }
  };

  // Use the project's existing GBIF and Wikimedia lookup helpers when available.
  // If those helpers are unavailable, use an exact iNaturalist taxon match.
  window.loadSpeciesPhoto = async function(plant, target) {
    if (!plant || !target) return;

    const prefix = target.replace(/^#/, '') + '-';
    const img = $('#species-image-' + prefix + plant.id);
    const placeholder = $('#placeholder-' + prefix + plant.id);
    const credit = $('#photo-credit-' + prefix + plant.id);

    if (!img || img.dataset.bioLoading === '1') return;

    img.dataset.bioLoading = '1';
    if (credit) credit.textContent = 'Searching for an exact-species reference photograph…';

    function showPhoto(src, caption) {
      img.onload = () => {
        img.classList.remove('hidden', 'photo-unavailable');
        placeholder?.classList.add('hidden');
        if (credit) credit.innerHTML = caption;
        img.dataset.bioLoading = '0';
      };

      img.onerror = () => {
        img.classList.add('hidden');
        placeholder?.classList.remove('hidden');
        if (credit) credit.textContent = 'This reference photograph could not be loaded.';
        img.dataset.bioLoading = '0';
      };

      img.src = src;
    }

    const curated = curatedPlantPhotos[plant.latin];

    if (curated) {
      showPhoto(
        curated.src,
        `Photo: ${esc(curated.credit)} · <a href="${curated.page}" target="_blank" rel="noopener">Image source and licence</a>`
      );
      return;
    }

    try {
      if (typeof gbifPhotos === 'function') {
        const candidates = await gbifPhotos(plant.latin);

        if (candidates?.length) {
          const item = candidates[0];
          showPhoto(
            item.src,
            `Photo: ${esc(item.author || 'Contributor not supplied')} · ${esc(item.license || 'Licence not supplied')} · <a href="${esc(item.url)}" target="_blank" rel="noopener">GBIF record</a>`
          );
          return;
        }
      }

      const response = await fetch(
        `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(plant.latin)}&rank=species&per_page=8`
      );

      if (!response.ok) throw new Error('iNaturalist unavailable');

      const data = await response.json();
      const taxon = (data.results || []).find(entry =>
        entry.name?.toLowerCase() === plant.latin.toLowerCase()
      );

      const photo = taxon?.default_photo?.medium_url ||
        taxon?.default_photo?.square_url;

      if (photo) {
        showPhoto(
          photo,
          `Reference photograph · <a href="https://www.inaturalist.org/taxa/${taxon.id}" target="_blank" rel="noopener">iNaturalist taxon record and attribution</a>`
        );
        return;
      }

      if (typeof commonsPhotos === 'function') {
        const commons = await commonsPhotos(plant.latin);

        if (commons?.length) {
          const item = commons[0];
          showPhoto(
            item.src,
            `Photo: ${esc(item.author || 'Contributor not supplied')} · ${esc(item.license || 'Licence not supplied')} · <a href="${esc(item.url)}" target="_blank" rel="noopener">Wikimedia Commons source</a>`
          );
          return;
        }
      }

      throw new Error('No exact photograph found');
    } catch (_) {
      img.classList.add('hidden');
      placeholder?.classList.remove('hidden');
      if (credit) credit.textContent = 'No exact-species photograph is available from the connected sources right now.';
      img.dataset.bioLoading = '0';
    }
  };

  // Refresh Flora Atlas cards so they use the photograph loader above.
  if (typeof renderSpecies === 'function') {
    renderSpecies('#species-grid');
    renderSpecies('#atlas-grid');
  }

  // -------------------- PLANT CARD FLIP INTERACTION --------------------
  function enhancePlantCards() {
    document.querySelectorAll('.species-card').forEach(card => {
      if (card.dataset.flipReady) return;

      const photo = card.querySelector('.species-photo-wrap');
      const body = card.querySelector('.species-card-body');
      if (!photo || !body) return;

      card.dataset.flipReady = '1';

      const inner = document.createElement('div');
      inner.className = 'plant-flip-inner';

      const front = document.createElement('div');
      front.className = 'plant-flip-front';

      const back = document.createElement('div');
      back.className = 'plant-flip-back';

      const title = body.querySelector('h3')?.cloneNode(true);
      const latin = body.querySelector('.latin')?.cloneNode(true);

      front.append(photo);
      if (title) front.append(title);
      if (latin) front.append(latin);

      const flip = document.createElement('button');
      flip.className = 'btn btn-outline plant-flip-toggle';
      flip.type = 'button';
      flip.textContent = 'Flip for details ↻';
      front.append(flip);

      const backTitle = document.createElement('h3');
      backTitle.textContent = 'Species profile';
      back.append(backTitle, body);

      const backFlip = document.createElement('button');
      backFlip.className = 'btn btn-outline plant-flip-toggle';
      backFlip.type = 'button';
      backFlip.textContent = 'Back to photograph ↻';
      back.append(backFlip);

      inner.append(front, back);
      card.replaceChildren(inner);
      card.classList.add('plant-flip-card');
    });
  }

  const cardObserver = new MutationObserver(enhancePlantCards);

  ['#species-grid', '#atlas-grid'].forEach(selector => {
    const element = $(selector);
    if (element) {
      cardObserver.observe(element, { childList: true, subtree: true });
    }
  });

  document.addEventListener('click', event => {
    if (event.target.closest('.plant-flip-toggle')) {
      event.target.closest('.species-card')?.classList.toggle('is-flipped');
    }
  });

  enhancePlantCards();
    // -------------------- PLANTNET ONLINE IDENTIFICATION --------------------
  // Pl@ntNet online plant identification. API key is only held by the Vercel serverless function.
  const pnInput = $('#plantnet-photo');
  const pnButton = $('#plantnet-identify');
  const pnResults = $('#plantnet-results');
  let pnFile = null;

  pnInput?.addEventListener('change', () => {
    pnFile = pnInput.files?.[0] || null;
    if (!pnFile) return;
if (!/^image\/(jpeg|png|webp)$/.test(pnFile.type) || pnFile.size > 8 * 1024 * 1024) {
    alert('Choose a JPG, PNG or WebP image under 8 MB.'); pnInput.value=''; pnFile=null; return;
    }

    $('#plantnet-preview').src = URL.createObjectURL(pnFile);
    $('#plantnet-preview-wrap').classList.remove('hidden');
    pnResults.classList.add('hidden');
  });

  async function preparePlantUpload(file) {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 1500 / Math.max(bitmap.width, bitmap.height));

    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext('2d');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    let blob = await new Promise(resolve =>
      canvas.toBlob(resolve, 'image/jpeg', 0.78)
    );

    if (!blob || blob.size > 2000000) {
      blob = await new Promise(resolve =>
        canvas.toBlob(resolve, 'image/jpeg', 0.60)
      );
    }

    if (!blob || blob.size > 2000000) {
      throw new Error('Image is too large. Choose a smaller photograph.');
    }

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Could not read photograph.'));
      reader.readAsDataURL(blob);
    });

    return {
      imageBase64: dataUrl.split(',')[1],
      mimeType: 'image/jpeg',
      filename: 'plant-photo.jpg'
    };
  }

pnButton?.addEventListener('click', async () => {
    if (!pnFile) { alert('Choose a plant photograph first.'); return; }
    pnButton.disabled = true;
pnButton.textContent = 'Analysing photograph...';
pnResults.classList.remove('hidden');
pnResults.textContent = 'Sending image securely to Pl@ntNet...';

    try {
      const upload = await preparePlantUpload(pnFile);

      const response = await fetch('/api/plant-identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(upload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Plant identification service unavailable.');
      }

      const candidates = data.results || [];

      if (!candidates.length) {
        throw new Error('The model returned no candidate species.');
      }

      pnResults.innerHTML = `
        <h3>Pl@ntNet candidate results</h3>
        <p class="muted">
          AI suggestions only. Confirm identifications using a regional
          field guide or qualified botanist.
        </p>
        ${candidates.slice(0, 5).map((result, index) => {
          const taxon = result.species || {};
          return `
            <article class="plantnet-result">
              <b>${index + 1}. ${esc(
                taxon.commonNames?.[0] ||
                taxon.scientificNameWithoutAuthor ||
                taxon.scientificName ||
                'Unresolved taxon'
              )}</b>
              <i>${esc(taxon.scientificName || 'Scientific name not returned')}</i>
              <span>Model score: ${Number(result.score || 0).toFixed(3)}</span>
              <small>Family: ${esc(taxon.family?.scientificName || 'Not supplied')}</small>
            </article>`;
        }).join('')}
        <p class="photo-credit">
          Powered by Pl@ntNet. Model scores are not certainty probabilities.
        </p>`;
    } catch (error) {
      pnResults.innerHTML = `
        <div class="notice warning">
          <b>Identification unavailable</b>
          <p>${esc(error.message)}</p>
          <p>
            Check that PLANTNET_API_KEY is configured in your Vercel
            project environment variables.
          </p>
        </div>`;
    } finally {
      pnButton.disabled = false;
      pnButton.textContent = 'Identify plant online →';
    }
  });

  // -------------------- OFFLINE MOBILENET MODEL --------------------
  let mobileNetPromise = null;
  let mobileNetModel = null;
  let faunaFile = null;

  const faunaInput = $('#fauna-photo');
  const faunaCameraInput = $('#fauna-camera-photo');
  const faunaPreview = $('#fauna-preview');
  const faunaPreviewWrap = $('#fauna-preview-wrap');
  const faunaButton = $('#fauna-identify');
  const faunaResults = $('#fauna-results');
  const modelStatus = $('#fauna-model-status');

  function chooseFaunaFile(file) {
    if (!file) return;

    if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type) ||
        file.size > 10 * 1024 * 1024) {
      alert('Choose a JPG, PNG, WebP or AVIF image under 10 MB.');
      return;
    }

    faunaFile = file;
    faunaPreview.src = URL.createObjectURL(file);
    faunaPreviewWrap?.classList.remove('hidden');
    faunaResults?.classList.add('hidden');
  }

  faunaInput?.addEventListener('change', () =>
    chooseFaunaFile(faunaInput.files?.[0])
  );

  faunaCameraInput?.addEventListener('change', () =>
    chooseFaunaFile(faunaCameraInput.files?.[0])
  );

  async function loadMobileNet() {
    if (mobileNetModel) return mobileNetModel;
    if (mobileNetPromise) return mobileNetPromise;

    mobileNetPromise = (async () => {
      if (modelStatus) {
        modelStatus.textContent = 'Loading TensorFlow.js and MobileNet…';
      }

      const addScript = src => new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(
          new Error('Could not load the model library. Check your internet connection.')
        );
        document.head.appendChild(script);
      });

      if (!window.tf) {
        await addScript(
          'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js'
        );
      }

      if (!window.mobilenet) {
        await addScript(
          'https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1'
        );
      }

      mobileNetModel = await window.mobilenet.load({
        version: 2,
        alpha: 1.0
      });

      if (modelStatus) {
        modelStatus.textContent =
          'MobileNet loaded. Predictions run locally in this browser.';
      }

      return mobileNetModel;
    })().catch(error => {
      mobileNetPromise = null;
      if (modelStatus) modelStatus.textContent = error.message;
      throw error;
    });

    return mobileNetPromise;
  }

  faunaButton?.addEventListener('click', async () => {
    if (!faunaFile) {
      alert('Upload or capture an animal photograph first.');
      return;
    }

    faunaButton.disabled = true;
    faunaButton.textContent = 'Loading model…';
    faunaResults.classList.remove('hidden');
    faunaResults.textContent = 'Preparing local image classification…';

    try {
      const model = await loadMobileNet();
      const predictions = await model.classify(faunaPreview, 5);

      const localMap = [
        { match: /snow leopard/i, name: 'Snow leopard', scientific: 'Panthera uncia' },
        { match: /ibex|wild goat|mountain goat/i, name: 'Himalayan ibex / wild goat group', scientific: 'Capra spp.' },
        { match: /markhor/i, name: 'Markhor', scientific: 'Capra falconeri' },
        { match: /monal|pheasant/i, name: 'Pheasant group', scientific: 'Phasianidae' }
      ];

      const formatted = predictions.map(item => ({
        ...item,
        percent: Math.round(item.probability * 1000) / 10
      }));

      const possibleLocal = formatted
        .map(prediction => ({
          prediction,
          local: localMap.find(entry => entry.match.test(prediction.className))
        }))
        .find(entry => entry.local);

      faunaResults.innerHTML = `
        <h3>On-device model output</h3>
        <p class="muted">
          General ImageNet classifier. These are not specialist wildlife results.
        </p>
        <ol class="prediction-list">
          ${formatted.map(item => `
            <li>
              <span>${esc(item.className)}</span>
              <b>${item.percent.toFixed(1)}%</b>
            </li>
          `).join('')}
        </ol>
        ${possibleLocal ? `
          <div class="notice info">
            <b>Possible regional group to investigate: ${esc(possibleLocal.local.name)}</b>
            <p>
              ${esc(possibleLocal.local.scientific)} ·
              Model label: ${esc(possibleLocal.prediction.className)}.
              This is not a confirmed identification.
            </p>
          </div>
        ` : `
          <div class="notice warning">
            <b>No supported Hindu Kush species label in the top results.</b>
            <p>Do not infer a local species from a broad animal label.</p>
          </div>
        `}
        <p class="muted">
          Model scores are classifier scores, not field-confirmation probabilities.
        </p>`;
    } catch (error) {
      faunaResults.innerHTML = `
        <div class="notice warning">
          <b>Model unavailable</b>
          <p>${esc(error.message)}</p>
        </div>`;
    } finally {
      faunaButton.disabled = false;
      faunaButton.textContent = 'Run local image model →';
    }
  });

  // -------------------- ANIMAL DETECT ONLINE IDENTIFICATION --------------------
  const faunaOnlineButton = $('#fauna-online-identify');

  async function prepareFaunaUpload(file) {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 1500 / Math.max(bitmap.width, bitmap.height));

    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext('2d');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    let blob = await new Promise(resolve =>
      canvas.toBlob(resolve, 'image/jpeg', 0.78)
    );

    if (!blob || blob.size > 2400000) {
      blob = await new Promise(resolve =>
        canvas.toBlob(resolve, 'image/jpeg', 0.60)
      );
    }

    if (!blob || blob.size > 2400000) {
      throw new Error('Image is too large. Choose a smaller photograph.');
    }

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Could not read photograph.'));
      reader.readAsDataURL(blob);
    });

    return {
      imageBase64: dataUrl.split(',')[1],
      mimeType: 'image/jpeg',
      filename: 'wildlife-photo.jpg'
    };
  }

  faunaOnlineButton?.addEventListener('click', async () => {
    if (!faunaFile) {
      alert('Upload or capture an animal photograph first.');
      return;
    }

    faunaOnlineButton.disabled = true;
    faunaOnlineButton.textContent = 'Identifying online…';
    faunaResults.classList.remove('hidden');
    faunaResults.textContent = 'Preparing photograph…';

    try {
      const upload = await prepareFaunaUpload(faunaFile);
      faunaResults.textContent = 'Contacting Animal Detect…';

      const response = await fetch('/api/fauna-detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(upload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Online identification failed.');
      }

      const annotations = Array.isArray(data.annotations)
        ? data.annotations : [];

      if (!annotations.length) {
        faunaResults.innerHTML = `
          <div class="notice warning">
            <b>No animals detected.</b>
            <p>Try a clearer photograph with the animal visible.</p>
          </div>`;
        return;
      }

      // Group duplicate detections and keep the highest available score.
      const grouped = new Map();

      annotations.forEach(animal => {
        const label = String(animal.label || 'Unknown animal').trim();
        const taxonomy = animal.taxonomy || {};

        const scientific = [
          taxonomy.genus,
          taxonomy.species
        ].filter(Boolean).join(' ');

        const key = `${label.toLowerCase()}|${scientific.toLowerCase()}`;
        const score = Number(animal.score);

        if (!grouped.has(key)) {
          grouped.set(key, { label, scientific, score, count: 1 });
        } else {
          const existing = grouped.get(key);
          existing.count++;

          if (Number.isFinite(score) &&
              (!Number.isFinite(existing.score) || score > existing.score)) {
            existing.score = score;
          }
        }
      });

      const results = [...grouped.values()]
        .sort((a, b) => (b.score || 0) - (a.score || 0));

      faunaResults.innerHTML = `
        <h3>Online wildlife identification results</h3>
        <p class="muted">Animal Detect · Automated suggestions</p>
        <ol class="prediction-list">
          ${results.map(animal => {
            const broad = /\b(order|family|class|phylum)\b/i.test(animal.label);
            const percent = Number.isFinite(animal.score)
              ? (animal.score * 100).toFixed(1) + '%'
              : 'Unavailable';

            return `
              <li>
                <span>
                  <b>${esc(animal.label)}</b>
                  ${animal.scientific
                    ? `<small>${esc(animal.scientific)}</small>` : ''}
                  ${animal.count > 1
                    ? `<small>${animal.count} detections grouped</small>` : ''}
                  ${broad ? '<small>Broad taxonomic group</small>' : ''}
                </span>
                <b>${percent}</b>
              </li>`;
          }).join('')}
        </ol>
        <p class="muted">
          Results may identify broad taxonomic groups rather than exact species.
          They are not confirmed field identifications.
        </p>`;
    } catch (error) {
      faunaResults.innerHTML = `
        <div class="notice warning">
          <b>Online identification unavailable</b>
          <p>${esc(error.message)}</p>
        </div>`;
    } finally {
      faunaOnlineButton.disabled = false;
      faunaOnlineButton.textContent = 'Identify wildlife online →';
    }
  });

  // -------------------- OFFLINE PLANT VISUAL MODEL --------------------
  const plantOfflineButton = $('#plantnet-offline');

  plantOfflineButton?.addEventListener('click', async () => {
    if (!pnFile) {
      alert('Choose a plant photograph first.');
      return;
    }

    plantOfflineButton.disabled = true;
    plantOfflineButton.textContent = 'Loading offline model…';
    pnResults.classList.remove('hidden');
    pnResults.textContent = 'Running the general-purpose model locally…';

    try {
      const model = await loadMobileNet();
      const predictions = await model.classify($('#plantnet-preview'), 5);

      pnResults.innerHTML = `
        <h3>On-device visual model output</h3>
        <p class="muted">
          MobileNet V2 / ImageNet · general visual classification,
          not a specialist Chitral flora model.
        </p>
        <ol class="prediction-list">
          ${predictions.map(item => `
            <li>
              <span>${esc(item.className)}</span>
              <b>${(item.probability * 100).toFixed(1)}%</b>
            </li>
          `).join('')}
        </ol>
        <div class="notice warning">
          <b>Interpret carefully</b>
          <p>
            This model cannot reliably identify local plant species or
            plant diseases. Use Pl@ntNet online for specialist plant suggestions.
          </p>
        </div>`;
    } catch (error) {
      pnResults.innerHTML = `
        <div class="notice warning">
          <b>Offline model unavailable</b>
          <p>${esc(error.message)}</p>
        </div>`;
    } finally {
      plantOfflineButton.disabled = false;
      plantOfflineButton.textContent = 'Run offline visual model';
    }
  });

  // -------------------- PLANT HEALTH NOTICE --------------------
  const diseaseNotice = document.querySelector('#view-disease .notice.warning');

  if (diseaseNotice) {
    diseaseNotice.innerHTML = `
      <b>What is available:</b>
      Symptom-based offline matching is active. The uploaded photograph
      is a local preview. This release does not contain a validated
      plant-disease image diagnosis model. Do not treat a photo-only
      prediction as a diagnosis.`;
  }

  // -------------------- NETWORK STATUS --------------------
  window.addEventListener('online', () => {
    document.body.classList.remove('network-offline');
  });

  window.addEventListener('offline', () => {
    document.body.classList.add('network-offline');
  });

  if (!navigator.onLine) {
    document.body.classList.add('network-offline');
  }

})();


    