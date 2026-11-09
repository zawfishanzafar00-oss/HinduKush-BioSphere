async function preparePlantUpload(file) {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1500 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not prepare the photograph.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(result => result ? resolve(result) : reject(new Error('Could not convert the plant photograph.')), 'image/jpeg', 0.78);
    });
    if (blob.size > 2 * 1024 * 1024) throw new Error('Photo is still too large. Please choose a smaller image.');
    const imageBase64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1]);
      reader.onerror = () => reject(new Error('Could not read the photograph.'));
      reader.readAsDataURL(blob);
    });
    return { imageBase64, mimeType: 'image/jpeg', filename: 'plant-photo.jpg' };
  } finally { bitmap.close(); }
}

(()=>{'use strict';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&','<':'<','>':'>','"':'"',"'":'&#39;'}[c]));

// Exact-taxon image lookup: GBIF records first, then Commons exact-name search. Never substitute a generic flower.

const exactPhotoCache=new Map();

async function exactPlantPhotos(latin){if(exactPhotoCache.has(latin))return exactPhotoCache.get(latin);const task=(async()=>{let out=[];try{const m=await fetch('https\://api.gbif.org/v1/species/match?name='+encodeURIComponent(latin)+'&strict=true').then(r=>r.json());if(m.usageKey&&m.rank==='SPECIES'&&String(m.scientificName).toLowerCase()===latin.toLowerCase()){const d=await fetch(`https\://api.gbif.org/v1/occurrence/search?taxonKey=${m.usageKey}&mediaType=StillImage&limit=100`).then(r=>r.json());for(const rec of d.results||[]){if(String(rec.species||rec.scientificName||'').toLowerCase()!==latin.toLowerCase())continue;for(const med of rec.media||[]){const lic=String(med.license||'').toLowerCase();if(!med.identifier||!/^https?:/i.test(med.identifier)||!(lic.includes('cc0')||lic.includes('creativecommons.org/licenses/by/')||lic.includes('cc by')||lic.includes('cc-by')))continue;out.push({src:med.identifier,href:med.references||`https\://www.gbif.org/occurrence/${rec.key}`,credit:med.creator||'GBIF contributor',license:med.license||'Open licence'});}}}}catch(e){}

if(!out.length){try{const q=await fetch('https\://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch='+encodeURIComponent('"'+latin+'"')+'&gsrnamespace=6&gsrlimit=30&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=900&format=json&origin=*').then(r=>r.json());for(const pg of Object.values(q.query?.pages||{})){const ii=pg.imageinfo?.[0],md=ii?.extmetadata||{};const title=(pg.title||'').toLowerCase(),desc=String(md.ImageDescription?.value||'').replace(/<[^>]*>/g,' ').toLowerCase();if(!ii||(!title.includes(latin.toLowerCase())&&!desc.includes(latin.toLowerCase())))continue;const lic=String(md.LicenseShortName?.value||'');if(!lic)continue;out.push({src:ii.thumburl||ii.url,href:ii.descriptionurl,credit:String(md.Artist?.value||'Contributor').replace(/<[^>]*>/g,' '),license:lic});}}catch(e){}}

return out;})();exactPhotoCache.set(latin,task);return task;}

if(typeof species!=='undefined'&&typeof loadSpeciesPhoto!=='undefined'){


loadSpeciesPhoto = async function(plant, target) {
  if (!plant) return;

  const prefix = target.slice(1) + '-';
  const img = $('#species-image-' + prefix + plant.id);
  const placeholder = $('#placeholder-' + prefix + plant.id);
  const credit = $('#photo-credit-' + prefix + plant.id);

  if (!img || img.dataset.localTried === '1') return;

  img.dataset.localTried = '1';

  // Convert scientific name into a local image filename.
  const slug = plant.latin
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  img.onload = () => {
    img.classList.remove('hidden');
    placeholder?.classList.add('hidden');

    if (credit) {
      credit.textContent = 'Local species image';
    }
  };

  img.onerror = () => {
    img.classList.add('hidden');

    if (credit) {
      credit.textContent = 'Local image not added yet.';
    }

    img.dataset.localTried = '0';
  };

  img.src = `assets/flora/${slug}.webp`;
};


// Force the replacement loader to run after the original page renderer.

setTimeout(()=>{if(typeof renderSpecies==='function'){renderSpecies('#species-grid');renderSpecies('#atlas-grid');}},100);

}

// Pl@ntNet species identification surfaced directly inside Plant Health Lab. It is not disease diagnosis.

const hp=$('#health-plantnet-photo'),hb=$('#health-plantnet-identify'),hr=$('#health-plantnet-results');let healthPlantFile=null;

hp?.addEventListener('change',()=>{healthPlantFile=hp.files?.[0]||null;if(!healthPlantFile)return;if(!/^image\/(jpeg|png|webp)$/.test(healthPlantFile.type)||healthPlantFile.size>8*1024*1024){alert('Choose a JPG, PNG or WebP image under 8 MB.');hp.value='';healthPlantFile=null;return;}$('#health-plantnet-preview').src=URL.createObjectURL(healthPlantFile);$('#health-plantnet-preview-wrap').classList.remove('hidden');});

hb?.addEventListener('click',async()=>{if(!healthPlantFile){alert('Choose a plant photo first.');return;}hb.disabled=true;hb.textContent='Identifying…';hr.classList.remove('hidden');hr.textContent='Connecting to the Pl@ntNet endpoint…';try{const upload=await preparePlantUpload(healthPlantFile);const res=await fetch('/api/plant-identify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(upload)});const data=await res.json();if(!res.ok)throw Error(data.error||'Plant identification is unavailable');hr.innerHTML='<h3>Candidate plant identities</h3><p>These are species suggestions, not a disease result.</p>'+(data.results||[]).slice(0,5).map((r,i)=>{const t=r.species||{};return `<article class="plantnet-result"><b>${i+1}. ${esc(t.commonNames?.[0]||t.scientificName||'Unknown')}</b><i>${esc(t.scientificName||'')}</i><small>Model score: ${Number(r.score||0).toFixed(3)}</small></article>`}).join('');}catch(e){hr.innerHTML=`<div class="notice warning"><b>Online identification unavailable</b><p>${esc(e.message)}</p><p>On Vercel, add <code>PLANTNET_API_KEY</code> privately in Project Settings → Environment Variables, then redeploy. Local static preview does not run the Vercel API route.</p></div>`;}finally{hb.disabled=false;hb.textContent='Identify plant →';}});

// Safe fauna field observation: no diagnosis, treatment or handling instructions.

$('#fauna-health-assess')?.addEventListener('click',()=>{const group=$('#fauna-health-group').value,sign=$('#fauna-health-sign').value,notes=$('#fauna-health-notes').value.trim();const guidance={unknown:'Record the date, broad habitat and what you could observe from a distance. Do not approach to get a clearer view.',injury:'Keep away and do not handle the animal. Contact the relevant wildlife authority or a qualified veterinarian promptly.',breathing:'Do not approach or attempt to capture the animal. Record only what is visible from a safe distance and contact wildlife professionals.',weak:'Avoid disturbing, feeding or moving the animal. Notify the wildlife department or a qualified veterinarian.',skin:'Do not touch feathers, fur, skin or any animal material. Document from a distance and ask wildlife professionals to assess.',behaviour:'Do not approach or corner the animal. Note the behaviour, time and broad habitat and report it to wildlife professionals.'};const box=$('#fauna-health-result');box.classList.remove('hidden');box.innerHTML=`<b>Observation note created · ${esc(group)}</b><p><b>Selected sign:</b> ${esc($('#fauna-health-sign').selectedOptions[0].textContent)}</p><p>${esc(guidance[sign])}</p><p><b>Field note:</b> ${esc(notes||'No additional notes supplied.')}</p><small>This is not a veterinary diagnosis. If an animal appears distressed or injured, contact qualified local professionals.</small>`;});

// Urdu mode: comprehensive high-priority UI translation and stable reversible toggling.

const urdu={

'Overview':'جائزہ','Home':'صفحہ اول','WORKSPACE':'کام کی جگہ','Explore biodiversity':'حیاتیاتی تنوع دریافت کریں','A living archive':'ایک زندہ ریکارڈ','of mountain life.':'پہاڑی حیات کا','Good day, explorer':'خوش آمدید، محقق','Explore the Biodiversity Atlas':'حیاتیاتی تنوع کا اطلس دیکھیں','Plant Detection':'پودوں کی شناخت','Regional Field Map':'علاقائی نقشہ','Explore the Flora Atlas':'نباتاتی اطلس دیکھیں','Search plants & topics...':'پودوں اور موضوعات کی تلاش کریں...','Search scientific or local names...':'سائنسی یا مقامی نام تلاش کریں...','Search common or scientific names...':'عام یا سائنسی نام تلاش کریں...','Upload plant photo':'پودے کی تصویر اپ لوڈ کریں','Upload animal photo':'جانور کی تصویر اپ لوڈ کریں','Use camera':'کیمرہ استعمال کریں','Plant-health journal':'پودوں کی صحت کا ریکارڈ','Saved observations':'محفوظ مشاہدات','Record a biodiversity observation':'حیاتیاتی تنوع کا مشاہدہ درج کریں','All plants':'تمام پودے','All wildlife':'تمام جنگلی حیات','Mammals':'ممالیہ','Birds':'پرندے','Conservation Fieldnotes':'تحفظ کے میدانی نوٹس','References & Sources':'حوالہ جات اور ذرائع','Explore plants and wildlife':'پودوں اور جنگلی حیات کو دریافت کریں','Your biodiversity workspace':'آپ کا حیاتیاتی تنوع کا مرکز','What would you like to discover today?':'آج آپ کیا دریافت کرنا چاہیں گے؟','Where would you like to begin?':'آپ کہاں سے آغاز کرنا چاہیں گے؟','Overview':'جائزہ','Plant Health Lab':'پودوں کی صحت کی تجربہ گاہ','Plant Detection':'پودوں کی شناخت','Biodiversity Atlas':'حیاتیاتی تنوع کا اطلس','Fauna Atlas':'حیوانات کا اطلس','Regional Map':'علاقائی نقشہ','Conservation':'تحفظ','Bio-Observations':'حیاتیاتی مشاہدات','Solve MCQs':'کثیر الانتخابی سوالات حل کریں','Learning Lab':'تعلیمی مرکز','QUESTION 1 OF 10':'سوال ۱۰ میں سے ۱','Score:':'اسکور:','Quiz complete':'مشق مکمل ہوئی','Find matching species':'مماثل انواع تلاش کریں','Show us your plant':'اپنا پودا دکھائیں',"Choose the plant\\'s visible traits":'پودے کی نظر آنے والی خصوصیات منتخب کریں','Growth form':'نشوونما کی شکل','Leaf appearance':'پتے کی ساخت','Flower / visible colour':'پھول / نظر آنے والا رنگ','Typical setting':'عام ماحول','Regional species collection':'علاقائی انواع کا مجموعہ','Flora Atlas':'نباتاتی اطلس','Fauna Atlas':'حیوانات کا اطلس','References':'حوالہ جات','A living archive':'ایک زندہ ریکارڈ','of mountain life.':'پہاڑی حیات کا','Explore biodiversity':'حیاتیاتی تنوع دریافت کریں','Plant Health':'پودوں کی صحت','Fauna':'حیوانات','Identify the plant in your health report':'اپنی رپورٹ میں پودے کی شناخت کریں','Choose plant photo':'پودے کی تصویر منتخب کریں','Identify plant →':'پودے کی شناخت کریں ←','Select the visible symptoms':'نظر آنے والی علامات منتخب کریں','Find possible disease matches':'ممکنہ بیماریوں کی تلاش کریں','What animal is in your photograph?':'آپ کی تصویر میں کون سا جانور ہے؟','Record visible signs — without disturbing the animal':'جانور کو پریشان کیے بغیر نظر آنے والی علامات درج کریں','Create safe observation note →':'محفوظ مشاہدے کا نوٹ بنائیں ←','Botany':'نباتات','Interactive':'انٹرایکٹو','MCQ Lab':'سوالات کی مشق','Restart':'دوبارہ شروع کریں','Next question →':'اگلا سوال ←','Finish quiz':'مشق مکمل کریں','Your biodiversity workspace':'آپ کا حیاتیاتی تنوع کا مرکز','What would you like to discover today?':'آج آپ کیا دریافت کرنا چاہتے ہیں؟','Where would you like to begin?':'آپ کہاں سے آغاز کرنا چاہیں گے؟','Flora Atlas':'نباتاتی اطلس','Markhor':'مارخور','Snow leopard':'برفانی چیتا','Observe · Understand · Conserve':'مشاہدہ کریں · سمجھیں · تحفظ کریں','Open regional map':'علاقائی نقشہ کھولیں','Start quiz':'سوالات شروع کریں','Online':'آن لائن','Offline':'آف لائن'};

let urduOn=false;const lang=$('#language-toggle');const textNodes=[];const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const n=walker.currentNode;if(n.nodeValue.trim())textNodes.push({n,en:n.nodeValue});}

const attrNodes=[];$$('input[placeholder],textarea[placeholder],button[aria-label]').forEach(el=>['placeholder','aria-label'].forEach(a=>{if(el.hasAttribute(a))attrNodes.push({el,a,en:el.getAttribute(a)});}));

lang?.addEventListener('click',()=>{urduOn=!urduOn;document.documentElement.lang=urduOn?'ur':'en';document.documentElement.dir=urduOn?'rtl':'ltr';document.body.classList.toggle('urdu-mode',urduOn);lang.textContent=urduOn?'English':'اردو';for(const x of textNodes){const key=x.en.trim();if(urduOn&&urdu[key])x.n.nodeValue=x.en.replace(key,urdu[key]);else if(!urduOn)x.n.nodeValue=x.en;}for(const x of attrNodes){if(urduOn&&urdu[x.en])x.el.setAttribute(x.a,urdu[x.en]);else if(!urduOn)x.el.setAttribute(x.a,x.en);}if(urduOn){const b=$('.brand b');if(b)b.innerHTML='ہندوکش<span>بایوسفیئر</span>';}else{const b=$('.brand b');if(b)b.innerHTML='HinduKush<br><i>BioSphere</i>';}});

})();

// Plant disease photo screening: Pl@ntNet online route + transparent offline pixel-pattern aid.

(() => {

  const fileInput=document.querySelector('#disease-photo');

  const onlineBtn=document.querySelector('#disease-online-check');

  const offlineBtn=document.querySelector('#disease-offline-check');

  const output=document.querySelector('#disease-photo-results');

  if(!fileInput||!onlineBtn||!offlineBtn||!output)return;

  const escHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&','<':'<','>':'>','"':'"',"'":'&#39;'}[c]));

  function show(html){output.innerHTML=html;output.classList.remove('hidden');}

  function getPhoto(){return fileInput.files?.[0]||null;}

  onlineBtn.addEventListener('click',async()=>{

    const f=getPhoto();

    if(!f){show('<b>Choose a plant photo first.</b><p>Select a clear close-up image of the affected plant.</p>');return;}

    if(!/^image\/(jpeg|png|webp)$/i.test(f.type)||f.size>8*1024*1024){show('<b>Unsupported image.</b><p>Use a JPG, PNG or WebP photo under 8 MB.</p>');return;}

    onlineBtn.disabled=true;onlineBtn.textContent='Analysing photograph…';

    show('<b>Sending photo securely to Pl@ntNet…</b><p>The image is sent to the online disease-identification service. The API key remains on the server.</p>');

    try{

      const prepared=await preparePlantUpload(f);
      const response=await fetch('/api/plant-disease',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(prepared)});

      const data=await response.json().catch(()=>({}));if(!response.ok)throw Error(data.error||`Disease service returned HTTP ${response.status}.`);

      const results=Array.isArray(data.results)?data.results:[];

      if(!results.length){show(`<b>No supported disease match was returned.</b><p>${escHtml(data.coverageNote||'This does not prove the plant is healthy. The service may not cover this crop or condition.')}</p><p>Try the offline symptom guide and seek local agricultural advice if the plant is deteriorating.</p>`);return;}

      show(`<h3>Possible disease results · Pl@ntNet</h3><p class="muted">AI-generated candidates, not a confirmed diagnosis. Coverage is limited. Scores are ranking scores, not calibrated probabilities.</p>${results.slice(0,5).map((r,i)=>`<article class="result-item"><span class="result-score">${(Number(r.score||0)*100).toFixed(1)}% model score</span><b>${i+1}. ${escHtml(r.description||r.name||'Unlabelled condition')}</b><p>EPPO code: ${escHtml(r.name||'Not supplied')}</p>${(r.images||[]).slice(0,2).map(im=>`<p class="muted">Reference image: ${escHtml(im.author||'Author not supplied')} · ${escHtml(im.license||'Licence not supplied')} · <a href="${escHtml(im.url?.m||im.url?.o||'#')}" target="_blank" rel="noopener">view source</a></p>`).join('')}</article>`).join('')}<p class="muted">Engine: ${escHtml(data.version||'version not supplied')} · Remaining daily requests: ${data.remainingIdentificationRequests===null?'not reported':escHtml(data.remainingIdentificationRequests)}</p><p><b>Next step:</b> compare these candidates with the plant, crop and symptoms; consult an agricultural extension worker before treatment.</p>`);

    }catch(err){show(`<div class="notice warning"><b>Online photo screening unavailable</b><p>${escHtml(err.message)}</p><p>For deployment, configure <code>PLANTNET_API_KEY</code> privately in Vercel and redeploy. The static <code>npm.cmd start</code> preview does not execute Vercel API routes; use the offline tool below while testing locally.</p></div>`);}

    finally{onlineBtn.disabled=false;onlineBtn.textContent='Analyse photo online →';}

  });

  offlineBtn.addEventListener('click',async()=>{

    const f=getPhoto();if(!f){show('<b>Choose a plant photo first.</b>');return;}

    if(!/^image\/(jpeg|png|webp)$/i.test(f.type)||f.size>8*1024*1024){show('<b>Unsupported image.</b><p>Use a JPG, PNG or WebP photo under 8 MB.</p>');return;}

    offlineBtn.disabled=true;offlineBtn.textContent='Checking image locally…';

    try{

      const bitmap=await createImageBitmap(f);const c=document.createElement('canvas');c.width=96;c.height=96;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(bitmap,0,0,96,96);bitmap.close();

      const {data}=ctx.getImageData(0,0,96,96);let yellow=0,brown=0,white=0,orange=0,green=0,red=0,gray=0,edge=0,prev=0;

      for(let i=0;i<data.length;i+=4){const r=data[i],g=data[i+1],b=data[i+2];const max=Math.max(r,g,b),min=Math.min(r,g,b);if(r>145&&g>125&&b<115&&r>g*1.04)yellow++;if(r>65&&r<175&&g<125&&b<100&&r>g*1.18) brown++;if(min>185&&max-min<48)white++;if(r>155&&g>55&&g<155&&b<85&&r>g*1.25)orange++;if(g>r*1.12&&g>b*1.08&&g>65)green++;if(r>145&&g<105&&b<105)red++;if(max-min<25&&max<175)gray++;const lum=(r+g+b)/3;if(i% (96*4)===0){if(prev&&Math.abs(lum-prev)>42)edge++;prev=lum;}}

      const n=96*96;const signals=[{label:'yellowing / chlorosis-like colour',key:'yellowing',v:yellow/n},{label:'brown or dark lesion-like colour',key:'dark_patches',v:brown/n},{label:'white surface-like patches',key:'white_powder',v:white/n},{label:'orange / rust-like colour',key:'orange_pustules',v:orange/n},{label:'green leaf tissue',key:null,v:green/n},{label:'reddish discolouration',key:'purple_spots',v:red/n}].sort((a,b)=>b.v-a.v);

      const visible=signals.filter(x=>x.v>.035).slice(0,4);const matched=visible.filter(x=>x.key);

      matched.forEach(x=>{const btn=document.querySelector(`#symptom-options [data-sym="${x.key}"]`);if(btn&&!btn.classList.contains('selected'))btn.click();});

      const pct=x=>(x.v*100).toFixed(1);

      show(`<h3>Offline photo-pattern comparison</h3><p class="muted">Processed entirely on this device. No upload or internet connection was used.</p>${visible.length?visible.map(x=>`<article class="result-item"><b>${escHtml(x.label)}</b><span class="result-score">${pct(x)}% pixels</span><p>Visual signal detected in the resized image; this is not a disease probability.</p></article>`).join(''):'<p>No strong colour pattern was detected. Try a closer, brighter photo of one affected leaf.</p>'}<div class="notice warning"><b>Important limitation</b><p>This offline tool measures broad pixel-colour patterns only. It is not a trained plant-disease model and cannot distinguish diseases reliably. ${matched.length?'Related symptom options were selected below for the offline symptom matcher.':'No symptom was auto-selected; use the symptom checklist if appropriate.'}</p></div><p>For a more meaningful result, use online Pl@ntNet photo screening when connected and compare the result with crop-specific symptoms.</p>`);

    }catch(e){show(`<b>Could not analyse this image locally.</b><p>${escHtml(e.message||'Try another JPG, PNG or WebP image.')}</p>`);}

    finally{offlineBtn.disabled=false;offlineBtn.textContent='Compare photo offline';}

  });

})();