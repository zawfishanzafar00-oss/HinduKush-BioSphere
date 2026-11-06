const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

const STORAGE={obs:'flora_hindukush_observations_v1',journal:'flora_hindukush_journal_v1'};

const plantImages={};

const species=[

['Bankhor','Aesculus indica','Tree','Woodland / moist slopes','Traditional reports mention use of seeds and bark; not for self-medication.','horse'],

['Boi Baro','Achillea wilhelmsii','Herb','Dry rocky slopes','Reported in regional traditional-use records; preparation and safety require expert verification.','yarrow'],

['Wild Kach','Allium barszczewskii','Herb','Mountain meadows','Wild onion relative; traditionally gathered as a food/seasoning in some areas.','allium'],

['Drumstick Primrose','Primula denticulata','Herb','Moist alpine meadows','Primarily an ornamental and ecological species; avoid unsupported medicinal claims.','primula'],

['Buransh','Rhododendron arboreum','Shrub / tree','Woodland','Flowers are used in food traditions in parts of the Himalaya; species-specific local use needs confirmation.','primula'],

['Kashmal','Berberis lycium','Shrub','Dry slopes / woodland edges','Roots and fruits appear in ethnobotanical records; medicinal use is not a safety recommendation.','yarrow'],

['Pashanbhed','Bergenia ciliata','Herb','Rock crevices / moist slopes','Recorded in Himalayan traditional medicine; clinical effectiveness and safe dose are not established here.','primula'],

['Kala Zeera','Bunium persicum','Herb','High mountain grassland','Aromatic seeds used as a spice in regional food traditions.','allium'],

['Banaksha','Viola canescens','Herb','Moist meadows','Reported in Himalayan folk-use literature; verify local names and uses with community sources.','primula'],

['Chirchita','Achyranthes aspera','Herb','Roadside / disturbed ground','Traditional-use reports exist across South Asia; not a treatment recommendation.','yarrow'],

['Mulethi','Glycyrrhiza glabra','Herb','Cultivated / dry valleys','Root is used traditionally as a flavouring and in herbal preparations; excessive intake can be harmful.','horse2'],

['Banafsha','Viola odorata','Herb','Gardens / moist shaded sites','Flowers and leaves have traditional uses in some regions; local occurrence needs confirmation.','primula'],

['Jangli Podina','Mentha longifolia','Herb','Riversides / moist ground','Aromatic leaves used as a culinary herb and in traditional infusions.','yarrow'],

['Afsanteen','Artemisia absinthium','Herb','Dry slopes','Aromatic plant with historical traditional uses; concentrated preparations can be unsafe.','yarrow'],

['Barg-e-Gulab','Rosa webbiana','Shrub','Mountain slopes','Wild rose supports pollinators; rose hips of some Rosa species are used as food.','primula'],

['Zarishk','Berberis brandisiana','Shrub','Mountain scrub','Berberis fruits are traditionally used in foods in some regions; exact local use requires confirmation.','yarrow'],

['Banafsha (wild violet)','Viola biflora','Herb','Moist alpine sites','Ecological and ornamental interest; no medicinal use asserted.','primula'],

['Nettle','Urtica dioica','Herb','Moist nutrient-rich ground','Young leaves are cooked as food in some mountain communities; proper preparation matters.','horse2'],

['Plantain','Plantago major','Herb','Paths / moist disturbed ground','Leaves have documented folk uses in many regions; this entry is not medical advice.','yarrow'],

['Dandelion','Taraxacum officinale','Herb','Meadows / fields','Young leaves are used as food in some cultures; identification should be confirmed.','primula'],

['Wild Thyme','Thymus linearis','Herb','Dry rocky slopes','Aromatic leaves are used as seasoning and in traditional infusions in Himalayan areas.','yarrow'],

['Himalayan Juniper','Juniperus communis','Shrub','Open mountain slopes','Important ecological shrub; traditional uses vary and should be locally verified.','horse2'],

['Walnut','Juglans regia','Tree','Orchards / cultivated slopes','Nuts are an important food crop; leaves and husks have traditional non-food uses.','horse'],

['Apricot','Prunus armeniaca','Tree','Orchards / valley settlements','Fruit and kernels are used as food; kernels can contain naturally occurring toxic compounds.','horse'],

['Hippophae','Hippophae rhamnoides','Shrub','River terraces / dry slopes','Berries are used as food in some mountain regions; local distribution should be checked.','yarrow']

].map((p,i)=>({id:i+1,local:p[0],latin:p[1],habit:p[2],habitat:p[3],use:p[4],img:plantImages[p[5]],traits:traitFor(i)}));

function traitFor(i){const habits=['tree','herb','herb','herb','shrub','shrub','herb','herb','herb','herb','herb','herb','herb','herb','shrub','shrub','herb','herb','herb','herb','herb','shrub','tree','tree','shrub'];const leaves=['compound','narrow','narrow','broad','broad','lobed','broad','narrow','broad','broad','compound','broad','broad','lobed','lobed','broad','lobed','broad','broad','lobed','narrow','needle','compound','broad','narrow'];const flowers=['white','yellow','purple','purple','pink','yellow','pink','white','purple','green','purple','purple','purple','pink','yellow','purple','green','green','yellow','yellow','purple','green','green','pink','yellow'];const habitats=['woodland','dry','mountain','river','woodland','dry','river','mountain','river','field','dry','river','river','mountain','dry','mountain','river','field','field','field','dry','woodland','field','field','dry'];return{habit:habits[i],leaf:leaves[i],flower:flowers[i],habitat:habitats[i]}}

const diseases=[

['Early blight','Tomato / Potato',['brown_rings','yellow_halo','lower_leaves','dry_patches'],'Older leaves develop brown target-like rings, often with yellowing.','Remove badly affected leaves, avoid wetting foliage and seek local extension advice.'],

['Late blight','Tomato / Potato',['water_soaked','dark_patches','white_growth','rapid_spread'],'Water-soaked dark patches may expand quickly; pale growth can appear in humid conditions.','Treat as urgent crop issue; isolate affected material and consult an agricultural extension worker promptly.'],

['Powdery mildew','Cucumber / Tomato',['white_powder','leaf_curl','yellowing'],'White powder-like growth appears on leaf surfaces.','Improve spacing and airflow; confirm diagnosis before choosing any control.'],

['Downy mildew','Cucumber',['yellow_patches','purple_growth','leaf_underside'],'Angular yellow patches with grey or purplish growth underneath in humid weather.','Avoid prolonged leaf wetness and get local diagnosis.'],

['Bacterial wilt','Tomato / Potato',['wilting','brown_stem','one_sided_wilt'],'Plant wilts despite moist soil; vascular tissue may appear discoloured.','Do not move suspect soil or plant material; ask an extension worker to confirm.'],

['Fusarium wilt','Tomato',['wilting','yellowing','one_sided_wilt'],'Progressive yellowing and wilting, sometimes stronger on one side.','Use clean planting material and seek confirmation; symptoms overlap with water stress.'],

['Septoria leaf spot','Tomato',['small_spots','dark_rings','lower_leaves'],'Many small circular spots, sometimes with pale centres, begin on older leaves.','Remove affected debris and improve airflow; confirm before treatment.'],

['Anthracnose','Bean / Tomato',['sunken_spots','dark_patches','fruit_lesions'],'Dark sunken lesions may develop on pods or fruit.','Avoid handling wet plants and remove infected debris responsibly.'],

['Rust','Bean',['orange_pustules','yellowing','small_spots'],'Orange, rust-coloured raised pustules appear, often on leaf undersides.','Avoid spreading spores between plants; seek crop-specific guidance.'],

['Leaf curl virus complex','Tomato',['leaf_curl','yellowing','stunted_growth'],'Leaves curl or become distorted and plants may be stunted.','Several causes look similar; check for insect vectors and obtain expert confirmation.'],

['Mosaic virus','Cucumber / Tomato',['mosaic_pattern','leaf_curl','stunted_growth'],'Mottled light and dark green mosaic pattern with possible distortion.','Avoid reusing suspect tools and seek diagnosis; there is no simple curative spray.'],

['Apple scab','Apple',['olive_spots','dark_patches','fruit_lesions'],'Olive-brown spots on leaves and dark scabby lesions on fruit.','Remove fallen infected leaves and ask local horticulture staff for advice.'],

['Fire blight','Apple',['blackened_shoots','wilting','stem_lesions'],'Blossom and shoot tips may blacken and bend in a shepherd-hook shape.','Report suspected cases to a local plant-health specialist before pruning.'],

['Onion purple blotch','Onion',['purple_spots','yellowing','leaf_tip_burn'],'Elongated purple-brown lesions with yellow margins on leaves.','Use healthy planting stock and reduce prolonged leaf wetness.'],

['Potato black scurf','Potato',['black_sclerotia','poor_emergence','stem_lesions'],'Dark soil-like crusts may cling to tubers; emergence can be uneven.','Use clean seed tubers and consult local agricultural advice.']

].map((d,i)=>({id:i,name:d[0],crops:d[1].split(' / '),sym:d[2],desc:d[3],care:d[4]}));

const symptoms=[['brown_rings','Brown rings / target spots'],['yellow_halo','Yellow halo around spots'],['lower_leaves','Older lower leaves affected'],['water_soaked','Water-soaked patches'],['dark_patches','Dark brown / black patches'],['white_growth','White growth underneath leaves'],['white_powder','White powder on surface'],['leaf_curl','Curled or distorted leaves'],['yellowing','Yellow leaves'],['purple_growth','Grey / purple growth underneath'],['wilting','Wilting despite watering'],['brown_stem','Brown stem tissue'],['one_sided_wilt','One side wilts first'],['small_spots','Many tiny round spots'],['sunken_spots','Sunken spots on fruit / pods'],['fruit_lesions','Fruit lesions'],['orange_pustules','Orange raised pustules'],['stunted_growth','Stunted growth'],['mosaic_pattern','Mottled light/dark mosaic pattern'],['olive_spots','Olive spots on apple leaves'],['blackened_shoots','Blackened shoot tips'],['purple_spots','Purple elongated spots'],['leaf_tip_burn','Leaf tip burn'],['black_sclerotia','Dark crusts on tubers'],['poor_emergence','Poor or uneven emergence'],['stem_lesions','Stem lesions']];

const quizzes=[['Which feature is especially useful when identifying a plant?',['Only flower colour','Leaf arrangement and habitat','The tallest nearby tree','Soil colour alone'],1,'Combining leaf arrangement, flower structure and habitat is more reliable than one feature alone.'],['What is a herbarium specimen?',['A preserved plant sample with collection data','A type of fertilizer','A plant disease','A greenhouse'],0,'Herbarium specimens preserve plant material with information such as collector, date and location.'],['Why record the date of a plant observation?',['It changes the species name','It helps document seasonal timing','It proves medicinal value','It replaces a photograph'],1,'Dates help researchers understand flowering, fruiting and seasonal distribution.'],['What does endemic mean?',['Found everywhere','Restricted naturally to a particular region','Always medicinal','An invasive crop'],1,'Endemic species are naturally restricted to a defined geographic area.'],['Why should rare plant locations be protected?',['To hide all science','To reduce risk of disturbance or collection','Because maps cannot show plants','Because plants move'],1,'Sensitive location data can expose vulnerable plants to disturbance or collection.'],['What is a scientific name made of in binomial nomenclature?',['Family and order','Genus and species','Habitat and colour','Local name and region'],1,'A binomial scientific name contains a genus name and a specific epithet.'],['Why is a community plant record marked unverified?',['It is automatically false','Its identification has not yet been reviewed','It has no photograph','It is not useful'],1,'Review helps separate observations from confirmed species records.'],['Can traditional use alone prove a plant is clinically safe?',['Yes, always','No, it is not enough evidence','Only if the plant is common','Only if the leaves look healthy'],1,'Traditional-use records are culturally important but do not establish clinical safety or effectiveness.']];

// FLORA HINDUKUSH research expansion — transparent, source-labelled records.

const extraSpecies = [

 ['Himalayan Cedar','Cedrus deodara','Tree','Pinaceae','Tall evergreen conifer; needle leaves in clusters and large upright cones.','Needle-like evergreen foliage; woody cones.','Not applicable','Needles in dense clusters.','Mountain forests and slopes','Himalaya and Hindu Kush region','Regional range is broad; this profile does not assert a village record.','No specific Chitral locality assigned in this project.','Timber and ecological shelter; no medicinal claim.','Not assessed here','https://powo.science.kew.org/results?q=Cedrus%20deodara'],

 ['Blue Pine','Pinus wallichiana','Tree','Pinaceae','Evergreen conifer with long drooping needles and elongated cones.','Long, slender blue-green needles in bundles.','Not applicable','Needle-like, grouped in fascicles.','Montane forests','Himalaya, Hindu Kush and adjacent mountains','Himalayan-Hindu Kush range; exact local records require herbarium confirmation.','No village-level record asserted.','Important forest and watershed species.','Not assessed here','https://powo.science.kew.org/results?q=Pinus%20wallichiana'],

 ['Oriental Plane','Platanus orientalis','Tree','Platanaceae','Large deciduous tree with broad palmately lobed leaves and distinctive peeling bark.','Small spherical flower/fruit heads.','Greenish, inconspicuous flowers','Broad, palmately lobed leaves.','Riverbanks, moist valleys and planted avenues','Southeastern Europe to western and central Asia','Documented in Lotkuh ethnobotanical research; not a precise collection point.','Lotkuh study area (regional study record).','Reported as highly cited in the Lotkuh ethnobotanical study; traditional context only.','Not assessed here','https://pmc.ncbi.nlm.nih.gov/articles/PMC11102610/'],

 ['Sea Buckthorn','Hippophae rhamnoides','Shrub','Elaeagnaceae','Thorny shrub with narrow silvery leaves and orange berries.','Small flowers; orange berry-like fruits.','Greenish, inconspicuous','Narrow, silvery, alternate leaves.','River terraces, gravel bars and dry slopes','Europe and temperate Asia','Regional suitability is not proof of a Chitral record; verify locally.','No village-level record asserted.','Fruit is used as food in some regions; do not infer medicinal efficacy.','Not assessed here','https://powo.science.kew.org/results?q=Hippophae%20rhamnoides'],

 ['Ephedra','Ephedra gerardiana','Shrub','Ephedraceae','Low, jointed shrub with green photosynthetic stems and very small scale leaves.','Small cones; not showy flowers.','Not showy','Tiny scale-like leaves; green segmented stems.','Dry alpine and subalpine slopes','Himalaya and Hindu Kush','Reported as vulnerable to harvesting pressure in Chitral Gol National Park research.','Chitral Gol National Park (published study context).','Harvesting pressure noted in a Chitral Gol study; no use instructions.','Study reported vulnerable to harvesting; not a current IUCN assessment.','https://pakbs.org/pjbot/paper_details.php?id=2710'],

 ['Ferula','Ferula narthex','Herb','Apiaceae','Large perennial aromatic herb with tall flowering stalk and finely divided leaves.','Large compound umbels.','Yellow','Finely divided, fern-like leaves.','Dry mountain slopes and open high-altitude ground','Hindu Kush and adjoining Central/South Asia','Reported as vulnerable to harvesting in Chitral Gol National Park research.','Chitral Gol National Park (published study context).','Harvesting pressure noted in a Chitral Gol study; no medicinal advice.','Study reported vulnerable to harvesting; not a current IUCN assessment.','https://pakbs.org/pjbot/paper_details.php?id=2710'],

 ['Sea Holly / Wild Carrot family herb','Bunium persicum','Herb','Apiaceae','Aromatic perennial with finely divided leaves and small white flowers; seeds are used as a spice.','Small flowers in compound umbels.','White','Finely divided leaves.','Dry alpine meadows and mountain grassland','West and Central Asia','A regional food-use claim requires checking the specific local ethnobotanical source before attributing it to a village.','No village-level record asserted.','Seeds are a culinary spice in parts of the region; not a medical claim.','Not assessed here','https://powo.science.kew.org/results?q=Bunium%20persicum'],

 ['Himalayan Yew','Taxus wallichiana','Tree','Taxaceae','Evergreen tree with flat needle-like leaves and fleshy red arils around seeds.','Cones reduced; red arils on female plants.','Not applicable','Flat, linear needles.','Cool temperate Himalayan forests','Himalaya and adjacent mountains','No specific Chitral record asserted in this profile.','No village-level record asserted.','Ecologically important; toxic plant parts and specialised pharmaceutical compounds make unsupervised use unsafe.','Threatened in parts of its range; check current assessment before citing status.','https://powo.science.kew.org/results?q=Taxus%20wallichiana'],

 ['Common Dandelion','Taraxacum officinale','Herb','Asteraceae','Rosette-forming herb with hollow flowering stalks and wind-dispersed fruits.','Single composite flower head on a leafless stalk.','Yellow','Basal rosette, usually toothed leaves.','Lawns, meadows and disturbed ground','Widespread in temperate regions','International profile; no Chitral occurrence claim.','Not documented here.','Food uses are reported in some cultures; safe identification and food hygiene matter.','Not assessed here','https://powo.science.kew.org/results?q=Taraxacum%20officinale'],

 ['Common Plantain','Plantago major','Herb','Plantaginaceae','Low rosette herb with parallel-veined broad leaves and slender flower spikes.','Dense spike of tiny flowers.','Greenish-brown','Broad oval leaves with prominent parallel veins.','Paths, lawns and moist disturbed ground','Widespread','International profile; no Chitral occurrence claim.','Not documented here.','Traditional uses are reported in many regions; not evidence of clinical benefit.','Not assessed here','https://powo.science.kew.org/results?q=Plantago%20major'],

 ['Garden Mint','Mentha spicata','Herb','Lamiaceae','Aromatic cultivated perennial with opposite leaves and square stems.','Terminal spikes of small flowers.','Lilac to pink','Opposite, toothed, aromatic leaves.','Gardens and moist cultivated ground','Cultivated widely; native range debated','International cultivated profile; local cultivation not verified.','Not documented here.','Culinary herb; no medicinal claim.','Not assessed here','https://powo.science.kew.org/results?q=Mentha%20spicata'],

 ['Sunflower','Helianthus annuus','Herb','Asteraceae','Tall annual crop with rough broad leaves and large composite flower heads.','Large radiate flower head.','Yellow','Broad, rough, alternate leaves.','Cultivated fields and gardens','Native to North America; cultivated worldwide','International crop profile; not a Chitral wild record.','Not documented here.','Seeds and oil are food products.','Not assessed here','https://powo.science.kew.org/results?q=Helianthus%20annuus'],

 ['Maize','Zea mays','Grass','Poaceae','Tall annual cereal with broad blade leaves, tassel and cob.','Separate male tassel and female ear.','Green/yellow reproductive structures','Long parallel-veined leaves.','Cultivated fields','Domesticated in the Americas; cultivated globally','International crop profile; no local cultivation claim.','Not documented here.','Major food and fodder crop.','Not assessed here','https://powo.science.kew.org/results?q=Zea%20mays'],

 ['Bread Wheat','Triticum aestivum','Grass','Poaceae','Annual cereal grass with hollow stems and compact grain-bearing spikes.','Spikelets arranged along an ear.','Green to golden','Narrow, parallel-veined leaves.','Cultivated fields','Domesticated in Southwest Asia; cultivated globally','International crop profile; no village-level record asserted.','Not documented here.','Major staple cereal crop.','Not assessed here','https://powo.science.kew.org/results?q=Triticum%20aestivum'],

 ['Potato','Solanum tuberosum','Herb','Solanaceae','Perennial crop grown as an annual; underground tubers are storage organs.','Star-shaped flowers in clusters.','White, pink, purple or blue','Compound leaves with leaflets.','Cool-climate cultivated fields','Originated in the Andes; cultivated worldwide','International crop profile; no Chitral-specific record asserted.','Not documented here.','Important food crop; green parts and sprouts should not be eaten.','Not assessed here','https://powo.science.kew.org/results?q=Solanum%20tuberosum'],

 ['Tomato','Solanum lycopersicum','Herb','Solanaceae','Tender crop with compound leaves, yellow flowers and fleshy berries.','Small star-shaped flowers.','Yellow','Compound, often hairy and aromatic leaves.','Gardens and cultivated fields','Originated in western South America; cultivated worldwide','International crop profile; no Chitral-specific record asserted.','Not documented here.','Food crop.','Not assessed here','https://powo.science.kew.org/results?q=Solanum%20lycopersicum'],

 ['Oak','Quercus baloot','Tree','Fagaceae','Evergreen or semi-evergreen oak with leathery leaves and acorns.','Small flowers; acorns are the fruit.','Greenish','Leathery, variable margins.','Dry temperate woodland and mountain slopes','Western Himalaya and adjoining regions','Regional taxon; exact Chitral records should be tied to herbarium specimens.','No village-level record asserted.','Provides habitat and watershed benefits.','Not assessed here','https://powo.science.kew.org/results?q=Quercus%20baloot'],

 ['Common Nettle','Urtica dioica','Herb','Urticaceae','Perennial herb with opposite serrated leaves and stinging hairs.','Small clusters of green flowers.','Green','Opposite, toothed leaves with stinging hairs.','Moist nutrient-rich soils, stream edges and disturbed ground','Widespread in temperate regions','International profile; local presence needs confirmation.','Not documented here.','Young leaves are eaten in some cultures after appropriate preparation; do not handle unknown plants.','Not assessed here','https://powo.science.kew.org/results?q=Urtica%20dioica'],

 ['Wild Rose','Rosa webbiana','Shrub','Rosaceae','Mountain rose shrub with prickly stems, compound leaves and rose hips.','Five-petalled flowers.','Pink to white','Pinnate leaves with toothed leaflets.','Mountain slopes and scrub','Himalaya and Hindu Kush','Recorded as dominant in Chitral Gol ethnobotanical research.','Chitral Gol National Park (published study context).','Ethnobotanical and ecological importance documented; use details vary by source.','Not assessed here','https://pakbs.org/pjbot/paper_details.php?id=2710'],

 ['Sea Wormwood','Artemisia maritima','Herb','Asteraceae','Aromatic perennial with finely divided grey-green foliage and small flower heads.','Small clustered flower heads.','Yellowish','Fine, divided, often silvery leaves.','Dry slopes and saline or sandy habitats','Eurasia; distribution varies by subspecies','Reported as dominant in Chitral Gol ethnobotanical research.','Chitral Gol National Park (published study context).','Ethnobotanical context only; no treatment or preparation advice.','Not assessed here','https://pakbs.org/pjbot/paper_details.php?id=2710'],

 ['Wormwood','Artemisia brevifolia','Herb','Asteraceae','Aromatic mountain herb with small divided leaves and inconspicuous flower heads.','Small clustered heads.','Yellowish','Short, divided leaves.','Dry alpine and subalpine slopes','Central and South Asian mountains','Reported as dominant in Chitral Gol ethnobotanical research.','Chitral Gol National Park (published study context).','Ethnobotanical context only; no treatment or preparation advice.','Not assessed here','https://pakbs.org/pjbot/paper_details.php?id=2710'],

 ['Common Walnut','Juglans regia','Tree','Juglandaceae','Large deciduous orchard tree with pinnate leaves and edible nuts.','Male catkins and small female flowers.','Greenish','Pinnate compound leaves.','Orchards and temperate valleys','Native from southeastern Europe to western Asia; cultivated widely','Documented as highly cited in Lotkuh ethnobotanical research.','Lotkuh study area (regional study record).','Nut is a food; the Lotkuh paper records broad community use categories.','Not assessed here','https://pmc.ncbi.nlm.nih.gov/articles/PMC11102610/']

];

const toTraits = (habit,leaf,flower,habitat)=>({habit,leaf,flower,habitat});

const extraTraitSets=[

 ['tree','needle','green','mountain'],['tree','needle','green','mountain'],['tree','lobed','green','river'],['shrub','narrow','yellow','dry'],['shrub','needle','green','dry'],['herb','narrow','yellow','dry'],['herb','narrow','white','mountain'],['tree','needle','green','woodland'],['herb','lobed','yellow','field'],['herb','broad','green','field'],['herb','broad','purple','river'],['herb','broad','yellow','field'],['herb','narrow','green','field'],['herb','narrow','green','field'],['herb','compound','purple','field'],['herb','compound','yellow','field'],['tree','lobed','green','woodland'],['herb','broad','green','river'],['shrub','lobed','pink','mountain'],['herb','narrow','yellow','dry'],['herb','narrow','yellow','dry'],['tree','compound','green','field']

];

extraSpecies.forEach((p,i)=>{if(species.some(s=>s.latin===p[1]))return;species.push({id:species.length+1,local:p[0],latin:p[1],habit:p[2],family:p[3],description:p[4],features:p[5],flower:p[6],leaf:p[7],habitat:p[8],distribution:p[9],chitral:p[10],locality:p[11],use:p[12],conservation:p[13],reference:p[14],img:null,traits:toTraits(...extraTraitSets[i])})});

const globalProfiles=[

 ['Rice','Oryza sativa','Grass','Poaceae','Annual cereal grass cultivated in flooded or rain-fed fields; produces grain in panicles.','Narrow leaves and grain-bearing panicles.','Green to golden','Long, narrow, parallel-veined leaves.','Cultivated paddies and fields','Domesticated in Asia; cultivated worldwide','International crop profile; no Chitral-specific claim.','Not documented here.','Staple food crop.','Not assessed here','https://powo.science.kew.org/results?q=Oryza%20sativa',['herb','narrow','green','field']],

 ['Barley','Hordeum vulgare','Grass','Poaceae','Annual cereal with a characteristic spike and long awns in many cultivars.','Dense grain spike with awns.','Green to golden','Narrow, parallel-veined leaves.','Cultivated fields','Domesticated in Southwest Asia; cultivated widely','International crop profile; local cultivation not assessed.','Not documented here.','Food, feed and malting crop.','Not assessed here','https://powo.science.kew.org/results?q=Hordeum%20vulgare',['herb','narrow','green','field']],

 ['Garden Pea','Pisum sativum','Herb','Fabaceae','Annual climbing or bushy legume with tendrils and pods.','White, pink or purple flowers.','White, pink or purple','Compound leaves ending in tendrils.','Cultivated gardens and fields','Cultivated across temperate regions','International crop profile; no Chitral-specific claim.','Not documented here.','Edible seeds and pods.','Not assessed here','https://powo.science.kew.org/results?q=Pisum%20sativum',['herb','compound','white','field']],

 ['Chickpea','Cicer arietinum','Herb','Fabaceae','Annual legume with small leaflets, pods and a deep root system.','Solitary pea-like flowers.','White, pink or purple','Pinnate leaves with small toothed leaflets.','Dry cultivated fields','Originated in Southwest Asia; cultivated widely','International crop profile; no Chitral-specific claim.','Not documented here.','Edible pulse crop.','Not assessed here','https://powo.science.kew.org/results?q=Cicer%20arietinum',['herb','compound','pink','dry']],

 ['Cabbage','Brassica oleracea','Herb','Brassicaceae','Cultivated biennial leafy vegetable selected for a compact head.','Four-petalled flowers in clusters if allowed to flower.','Yellow','Broad waxy leaves forming a head.','Cultivated gardens and fields','Cultivated worldwide','International crop profile; no Chitral-specific claim.','Not documented here.','Food crop.','Not assessed here','https://powo.science.kew.org/results?q=Brassica%20oleracea',['herb','broad','yellow','field']],

 ['Cucumber','Cucumis sativus','Climber','Cucurbitaceae','Annual trailing or climbing vine with tendrils and elongated fruits.','Separate male and female flowers.','Yellow','Large rough, palmately lobed leaves.','Cultivated gardens and fields','Cultivated worldwide','International crop profile; no Chitral-specific claim.','Not documented here.','Food crop.','Not assessed here','https://powo.science.kew.org/results?q=Cucumis%20sativus',['climber','lobed','yellow','field']],

 ['Sweet Pepper','Capsicum annuum','Herb','Solanaceae','Cultivated plant with simple leaves and hollow berries in varied colours.','Small star-shaped flowers.','White','Simple, smooth-edged leaves.','Cultivated gardens and fields','Native to the Americas; cultivated worldwide','International crop profile; no Chitral-specific claim.','Not documented here.','Food crop.','Not assessed here','https://powo.science.kew.org/results?q=Capsicum%20annuum',['herb','broad','white','field']],

 ['Dog Rose','Rosa canina','Shrub','Rosaceae','Deciduous thorny shrub with pinnate leaves, five-petalled flowers and red hips.','Five-petalled flowers.','Pink to white','Pinnate leaves with toothed leaflets.','Hedgerows, scrub and woodland edges','Europe and western Asia','International profile; no Chitral occurrence claim.','Not documented here.','Rose hips are used as food in some regions; no medical claim.','Not assessed here','https://powo.science.kew.org/results?q=Rosa%20canina',['shrub','compound','pink','woodland']],

 ['English Lavender','Lavandula angustifolia','Shrub','Lamiaceae','Aromatic evergreen subshrub with narrow grey-green leaves and flower spikes.','Dense terminal flower spikes.','Purple to blue','Narrow, opposite leaves.','Dry sunny gardens and rocky slopes','Western Mediterranean; cultivated widely','International cultivated profile; no Chitral wild record asserted.','Not documented here.','Aromatic ornamental and culinary plant; no therapeutic claim.','Not assessed here','https://powo.science.kew.org/results?q=Lavandula%20angustifolia',['shrub','narrow','purple','dry']],

 ['Scots Pine','Pinus sylvestris','Tree','Pinaceae','Evergreen conifer with paired needles and woody cones.','Cones; no showy flowers.','Not applicable','Needles in pairs.','Boreal and temperate forests','Europe and northern Asia','International profile; no Chitral occurrence claim.','Not documented here.','Important forest species.','Not assessed here','https://powo.science.kew.org/results?q=Pinus%20sylvestris',['tree','needle','green','woodland']],

 ['Himalayan Birch','Betula utilis','Tree','Betulaceae','Deciduous mountain tree with pale peeling bark and serrated leaves.','Catkins.','Greenish','Simple ovate leaves with serrated margins.','Subalpine Himalayan woodland','Himalaya','Himalayan range profile; exact Chitral locality not asserted.','No village-level record asserted.','Important high-altitude woodland species.','Not assessed here','https://powo.science.kew.org/results?q=Betula%20utilis',['tree','broad','green','mountain']],

 ['Himalayan Spruce','Picea smithiana','Tree','Pinaceae','Large evergreen conifer with drooping branchlets and long hanging cones.','Cones; no showy flowers.','Not applicable','Single stiff needles attached to woody pegs.','Himalayan montane forests','Himalaya and Hindu Kush region','Regional range only; exact Chitral records need specimen verification.','No village-level record asserted.','Forest and watershed species.','Not assessed here','https://powo.science.kew.org/results?q=Picea%20smithiana',['tree','needle','green','woodland']],

 ['Cultivated Apple','Malus domestica','Tree','Rosaceae','Deciduous fruit tree with simple serrated leaves and pome fruits.','Five-petalled blossoms in clusters.','White to pink','Simple, alternate, serrated leaves.','Orchards and temperate gardens','Cultivated worldwide; domestication in Central Asia region','Cultivated crop profile; not a specific Chitral wild record.','Orchard cultivation requires local confirmation.','Fruit crop.','Not assessed here','https://powo.science.kew.org/results?q=Malus%20domestica',['tree','broad','white','field']],

 ['Peach','Prunus persica','Tree','Rosaceae','Deciduous fruit tree with lance-shaped leaves and fuzzy stone fruits.','Five-petalled blossoms.','Pink','Narrow, lance-shaped, serrated leaves.','Orchards and temperate gardens','Originated in China; cultivated widely','Cultivated crop profile; no village-level Chitral claim.','Not documented here.','Fruit crop.','Not assessed here','https://powo.science.kew.org/results?q=Prunus%20persica',['tree','narrow','pink','field']],

 ['Garden Rose','Rosa × hybrida','Shrub','Rosaceae','A large group of cultivated rose hybrids with variable flower forms.','Often many-petalled flowers.','Many colours','Compound leaves with toothed leaflets.','Gardens and parks','Cultivated worldwide','International horticultural profile; not a wild Chitral species.','Not documented here.','Ornamental plant.','Not assessed here','https://powo.science.kew.org/results?q=Rosa%20hybrida',['shrub','compound','pink','field']]

];

globalProfiles.forEach((p)=>{if(species.some(s=>s.latin===p[1]))return;species.push({id:species.length+1,local:p[0],latin:p[1],habit:p[2],family:p[3],description:p[4],features:p[5],flower:p[6],leaf:p[7],habitat:p[8],distribution:p[9],chitral:p[10],locality:p[11],use:p[12],conservation:p[13],reference:p[14],img:null,traits:toTraits(...p[15])})});

const plantMeta = [

['Aesculus indica','Sapindaceae','Large deciduous tree; palmately compound leaves and upright flower panicles.','White flowers with pink/yellow markings.','Large palmately compound leaves.','Himalayan forests and moist slopes','Himalaya and adjacent mountain regions','Chitral/Hindukush candidate; source-level locality needs confirmation.','No village-level record asserted.','Traditional reports require specific ethnobotanical citation; not medical advice.','Not assessed here'],

['Achillea wilhelmsii','Asteraceae','Aromatic perennial herb with finely divided leaves and flat-topped flower clusters.','Small white to cream heads.','Finely divided, aromatic leaves.','Dry rocky slopes and open ground','West and Central Asia','Regional candidate; no exact Chitral locality asserted.','No village-level record asserted.','Use reports need a species-specific citation.','Not assessed here'],

['Allium barszczewskii','Amaryllidaceae','Wild onion relative with narrow basal leaves and an umbel of flowers.','Star-shaped flowers in an umbel.','Narrow, basal leaves.','Mountain meadows and rocky slopes','Central Asian mountain regions','No Chitral record verified in this build.','Not documented here.','No use claim made.','Not assessed here'],

['Primula denticulata','Primulaceae','Perennial alpine herb with a basal rosette and rounded flower head on a leafless stalk.','Rounded head, often purple, pink or white.','Wrinkled, toothed basal leaves.','Moist alpine meadows and stream margins','Himalaya and neighbouring mountains','Himalayan range only; Chitral occurrence not asserted.','Not documented here.','Primarily ecological/ornamental context.','Not assessed here'],

['Rhododendron arboreum','Ericaceae','Evergreen shrub or tree with leathery leaves and showy flower clusters.','Red to pink, sometimes white.','Leathery leaves, often clustered near branch tips.','Temperate Himalayan woodland','Himalaya','No specific Chitral record asserted.','Not documented here.','Flowers have food traditions in some Himalayan areas; no local claim here.','Not assessed here'],

['Berberis lycium','Berberidaceae','Thorny shrub with yellow flowers and dark berries.','Yellow clusters.','Small, simple leaves; spines at nodes.','Dry slopes and woodland edges','Himalaya and western Asia','Documented in Koh Valley Chitral ethnobotanical study.','Koh Valley (study area; not a village-level coordinate).','Traditional-use reports are ethnobotanical only; do not consume or self-medicate.','Not assessed here'],

['Bergenia ciliata','Saxifragaceae','Rhizomatous perennial with thick leaves and clusters of flowers.','Pink to purple.','Large, leathery, often toothed leaves.','Rock crevices and moist mountain slopes','Himalaya','No specific Chitral locality verified in this build.','Not documented here.','Traditional use requires source-specific interpretation.','Not assessed here'],

['Bunium persicum','Apiaceae','Aromatic perennial herb with finely divided leaves and small umbels.','Small white flowers.','Finely divided leaves.','High mountain grassland','West and Central Asia','No exact Chitral locality verified in this build.','Not documented here.','Seeds are used as a spice in some regional cuisines; no medical claim.','Not assessed here'],

['Viola canescens','Violaceae','Small perennial violet with basal leaves and distinctive five-petalled flowers.','Usually violet/purple.','Heart-shaped to oval leaves.','Moist meadows and shaded slopes','Himalaya','No specific Chitral locality asserted.','Not documented here.','No medicinal claim made.','Not assessed here'],

['Achyranthes aspera','Amaranthaceae','Erect herb with opposite leaves and slender spikes of small flowers.','Small greenish flowers.','Opposite, simple leaves.','Disturbed ground and roadsides','Tropical and subtropical Old World','No Chitral record asserted.','Not documented here.','Traditional reports are not clinical evidence.','Not assessed here'],

['Glycyrrhiza glabra','Fabaceae','Perennial herb with pinnate leaves, purple-blue flowers and underground roots.','Blue to purple.','Pinnate compound leaves.','Cultivated and dry valley settings','Europe and Asia','No specific Chitral record asserted.','Not documented here.','Root is used as flavouring in some products; concentrated use can affect health.','Not assessed here'],

['Viola odorata','Violaceae','Low perennial with fragrant violet flowers and creeping runners.','Violet or white.','Heart-shaped leaves.','Gardens and moist shaded ground','Europe and western Asia; cultivated widely','No specific Chitral record asserted.','Not documented here.','Traditional-use reports are not proof of safety.','Not assessed here'],

['Mentha longifolia','Lamiaceae','Aromatic perennial with square stems and opposite leaves.','Small flowers in terminal spikes.','Opposite, toothed, aromatic leaves.','Riversides and moist ground','Europe, Africa and Asia','Regional candidate; exact locality not established here.','No village-level record asserted.','Culinary/traditional reports require local source attribution.','Not assessed here'],

['Artemisia absinthium','Asteraceae','Aromatic perennial with silvery divided leaves and small flower heads.','Small yellowish heads.','Silvery, deeply divided leaves.','Dry slopes and disturbed ground','Europe and temperate Asia','No Chitral locality verified in this build.','Not documented here.','Contains biologically active compounds; no medicinal use advice.','Not assessed here'],

['Rosa webbiana','Rosaceae','Wild mountain rose with prickly stems and pinnate leaves.','Pink to white.','Pinnate leaves with toothed leaflets.','Mountain slopes and scrub','Himalaya and Hindu Kush','Documented in Chitral Gol National Park study.','Chitral Gol National Park (study context).','Ethnobotanical use must be checked against the cited study.','Not assessed here'],

['Berberis brandisiana','Berberidaceae','Thorny shrub with simple leaves, yellow flowers and berries.','Yellow.','Small, simple leaves.','Mountain scrub','South Asian mountain regions','No Chitral record verified in this build.','Not documented here.','No use claim made.','Not assessed here'],

['Viola biflora','Violaceae','Small alpine violet with yellow flowers and rounded leaves.','Yellow.','Rounded to heart-shaped leaves.','Moist alpine sites','Northern temperate mountains','No specific Chitral record asserted.','Not documented here.','No medicinal claim made.','Not assessed here'],

['Urtica dioica','Urticaceae','Perennial herb with stinging hairs and opposite serrated leaves.','Small green flowers.','Opposite, toothed leaves with stinging hairs.','Moist nutrient-rich ground','Widespread temperate regions','No Chitral locality verified in this build.','Not documented here.','Food use reported in some cultures after proper preparation; not an identification or preparation guide.','Not assessed here'],

['Plantago major','Plantaginaceae','Rosette-forming herb with broad leaves and slender flower spikes.','Tiny flowers on spikes.','Broad oval leaves with parallel veins.','Paths and moist disturbed ground','Widespread','No Chitral record asserted.','Not documented here.','Traditional uses reported; not clinical evidence.','Not assessed here'],

['Taraxacum officinale','Asteraceae','Rosette herb with yellow composite flower heads and wind-dispersed fruits.','Yellow composite heads.','Basal rosette with toothed leaves.','Meadows and disturbed ground','Widespread temperate regions','No Chitral record asserted.','Not documented here.','Food uses reported in some cultures; correct identification matters.','Not assessed here'],

['Thymus linearis','Lamiaceae','Low aromatic subshrub with tiny leaves and clusters of small flowers.','Pink to lilac.','Small, opposite leaves.','Dry rocky slopes','Himalaya and Central Asia','No exact Chitral locality asserted.','Not documented here.','Culinary and traditional reports need local verification.','Not assessed here'],

['Juniperus communis','Cupressaceae','Evergreen coniferous shrub or small tree with needle-like leaves and berry-like cones.','Not applicable','Sharp needles, often in whorls.','Open mountain slopes and heath','Northern Hemisphere','No specific Chitral record asserted.','Not documented here.','Ecological importance; no medicinal claim.','Not assessed here'],

['Juglans regia','Juglandaceae','Large deciduous tree with pinnate leaves and edible nuts.','Male catkins and female flowers.','Pinnate compound leaves.','Orchards and temperate valleys','Southeastern Europe to western Asia; widely cultivated','Documented in Lotkuh ethnobotanical research.','Lotkuh study area (regional study record).','Food and cultural use reported; not a medicinal recommendation.','Not assessed here'],

['Prunus armeniaca','Rosaceae','Deciduous fruit tree with spring blossoms and orange stone fruit.','White to pale pink.','Simple, oval, serrated leaves.','Orchards and valley settlements','Central Asia / China region; cultivated widely','No specific Chitral locality source attached in this build.','Not documented here.','Fruit is food; kernels may contain cyanogenic compounds and should not be treated as safe.','Not assessed here'],

['Hippophae rhamnoides','Elaeagnaceae','Thorny shrub with narrow silvery leaves and orange fruits.','Small inconspicuous flowers.','Narrow, silvery leaves.','River terraces and dry slopes','Europe and temperate Asia','No precise Chitral record asserted.','Not documented here.','Fruit is used as food in some regions; no medical claim.','Not assessed here']

];

species.forEach(s=>{const m=plantMeta.find(x=>x[0]===s.latin);if(m){s.family=m[1];s.description=m[2];s.features=m[2];s.flower=m[3];s.leaf=m[4];s.habitat=m[5];s.distribution=m[6];s.chitral=m[7];s.locality=m[8];s.use=m[9];s.conservation=m[10];s.reference='https://powo.science.kew.org/results?q='+encodeURIComponent(s.latin)}else{s.family=s.family||'Family requires taxonomic verification';s.description=s.description||'Starter profile; verify morphology and taxonomy against a flora or herbarium record.';s.features=s.features||'See the linked taxonomic reference.';s.flower=s.flower||'Not recorded in this prototype';s.leaf=s.leaf||'Not recorded in this prototype';s.distribution=s.distribution||'Requires source verification';s.chitral=s.chitral||'Not confirmed at village level in this project.';s.locality=s.locality||'No village-level record asserted.';s.conservation=s.conservation||'Not assessed here';s.reference=s.reference||'https://powo.science.kew.org/results?q='+encodeURIComponent(s.latin)}});

const newSymptoms=[

 ['fruit_rot','Fruit rot'],['stem_lesions','Stem lesions'],['root_discoloration','Root discoloration'],['mould_growth','Visible mould growth'],['premature_leaf_fall','Premature leaf fall'],['blossom_blight','Blighted blossoms'],['orange_pustules','Orange / reddish pustules'],['white_powder','White powdery coating'],['dry_patches','Dry patches'],['rapid_spread','Rapid symptom spread'],['yellow_patches','Yellow patches'],['leaf_underside','Growth on leaf underside'],['dark_rings','Dark rings around spots'],['swollen_galls','Swollen galls on stems or ears']

];

newSymptoms.forEach(x=>{if(!symptoms.some(s=>s[0]===x[0]))symptoms.push(x)});

const moreDiseases=[

 {name:'Apple powdery mildew',crops:['Apple'],sym:['white_powder','leaf_curl','yellowing'],cause:'Fungus Podosphaera leucotricha',desc:'White powdery growth on young leaves and shoots; leaves may curl and shoots may be stunted.',progress:'Can persist on buds and recur on new growth.',conditions:'Mild temperatures and humid air favour infection; free water is not required for spore germination.',lookalikes:'Dust, spray residue and other leaf-surface fungi.',prevention:'Use healthy planting material; prune for airflow and monitor susceptible shoots.',care:'Seek local horticultural advice before selecting a control. Remove only confirmed affected material using locally recommended practice.',refs:'https://ipm.ucanr.edu/agriculture/apple/'},

 {name:'Grape downy mildew',crops:['Grape'],sym:['yellowing','water_soaked','mould_growth'],cause:'Oomycete Plasmopara viticola',desc:'Yellow oil-like spots on upper leaf surfaces; downy white growth may appear beneath leaves in humid conditions.',progress:'Lesions can enlarge and leaves may drop; clusters can be affected.',conditions:'Warm, wet weather and prolonged leaf wetness.',lookalikes:'Powdery mildew, nutrient stress and other leaf spots.',prevention:'Canopy airflow, sanitation and regular monitoring.',care:'Confirm locally; disease-specific fungicide decisions belong with agricultural extension guidance.',refs:'https://extension.psu.edu/grape-disease-management'},

 {name:'Bean anthracnose',crops:['Bean'],sym:['sunken_spots','dark_patches','fruit_lesions'],cause:'Colletotrichum lindemuthianum',desc:'Dark sunken lesions may occur on pods, stems and leaves; lesions can show darker margins.',progress:'Can spread from infected seed and crop residue during wet periods.',conditions:'Cool to moderate wet weather and prolonged leaf wetness.',lookalikes:'Bacterial blights and other pod spots.',prevention:'Use clean seed, rotate crops and avoid working among wet plants.',care:'Remove infected crop debris appropriately and seek local advice; do not rely on symptom match alone.',refs:'https://www.apsnet.org/edcenter/disandpath/fungalbasidio/pdlessons/Pages/BeanAnthracnose.aspx'},

 {name:'Botrytis grey mould',crops:['Grape','Tomato','Bean','Flower'],sym:['mould_growth','fruit_rot','dark_patches'],cause:'Botrytis cinerea',desc:'Soft rots and grey fuzzy mould may develop on flowers, fruit, stems or damaged tissue.',progress:'May begin on damaged or ageing tissue and spread in storage or humid conditions.',conditions:'High humidity, poor airflow and prolonged wetness.',lookalikes:'Other fruit rots and bacterial soft rots.',prevention:'Improve spacing and airflow; handle produce carefully and remove decaying debris.',care:'Confirm the cause and use crop-specific extension advice for management.',refs:'https://www.apsnet.org/edcenter/disandpath/fungalbasidio/pdlessons/Pages/Botrytis.aspx'},

 {name:'Fusarium wilt of banana',crops:['Banana'],sym:['wilting','yellowing','root_discoloration'],cause:'Fusarium oxysporum f. sp. cubense species complex',desc:'Older leaves yellow and wilt; vascular tissues may show brown discoloration.',progress:'Symptoms can progress to collapse; the pathogen can persist in soil.',conditions:'Warm soil and movement of contaminated planting material or soil.',lookalikes:'Water stress and other vascular wilts.',prevention:'Use clean planting material and avoid moving soil from suspect sites.',care:'Seek official plant-health advice; do not transport suspect planting material.',refs:'https://www.apsnet.org/edcenter/disandpath/fungalbasidio/pdlessons/Pages/FusariumWilt.aspx'},

 {name:'Damping-off',crops:['Tomato','Bean','Flower'],sym:['wilting','stem_lesions','root_discoloration','mould_growth'],cause:'Several soilborne fungi/oomycetes, including Pythium and Rhizoctonia',desc:'Seeds may fail to emerge or young seedlings develop stem constrictions and collapse near the soil line.',progress:'Patchy seedling loss may occur before or after emergence.',conditions:'Wet growing media, poor drainage, crowding and contaminated trays.',lookalikes:'Drying, salt injury and seed-quality problems.',prevention:'Clean trays, well-drained media, careful watering and adequate spacing.',care:'Inspect roots and stem bases; ask a horticulture specialist if losses continue.',refs:'https://extension.umn.edu/solve-problem/how-prevent-seedling-damping'}

 ,{name:'Blossom-end rot (physiological disorder)',crops:['Tomato'],sym:['dark_patches','fruit_rot'],cause:'Physiological calcium-related disorder associated with irregular water supply and calcium movement; not an infectious pathogen',desc:'A dark, sunken leathery patch develops at the blossom end of fruit.',progress:'May enlarge as fruit develops; secondary organisms can colonise damaged tissue.',conditions:'Irregular watering, rapid growth and conditions limiting calcium movement to fruit.',lookalikes:'Anthracnose and other fruit rots.',prevention:'Maintain even soil moisture and balanced crop nutrition; avoid excessive fertiliser.',care:'Check irrigation and soil conditions; do not apply pesticides for this disorder.',refs:'https://extension.umn.edu/plant-diseases/tomato-disorders'}

];

moreDiseases.forEach((d,i)=>diseases.push({...d,id:diseases.length+i}));

moreDiseases.push(

 {name:'Walnut anthracnose',crops:['Walnut'],sym:['dark_patches','yellowing','premature_leaf_fall'],cause:'Ophiognomonia leptostyla (fungus)',desc:'Dark, often angular leaf spots may develop on leaflets; severe infection can lead to premature leaf fall.',progress:'Lesions enlarge during wet periods; fallen infected leaves can carry the pathogen between seasons.',conditions:'Rainy weather, prolonged leaf wetness and infected leaf litter.',lookalikes:'Bacterial blight, sun scorch and other leaf spots.',prevention:'Collect and manage fallen diseased leaves where practical; maintain tree health and airflow.',care:'Confirm with local horticultural services before considering any crop treatment.',refs:'https://extension.psu.edu/walnut-diseases'},

 {name:'Apricot brown rot',crops:['Apricot'],sym:['fruit_rot','mould_growth','blossom_blight'],cause:'Monilinia species (fungi)',desc:'Blossoms may blight and fruit can develop brown, spreading rot; greyish spore masses may appear in humid conditions.',progress:'Infected blossoms and mummified fruit can provide inoculum for later infection.',conditions:'Wet weather around bloom and fruit ripening, especially where fruit is damaged or crowded.',lookalikes:'Other fruit rots and physical injury.',prevention:'Remove mummified fruit and dead infected material; reduce fruit injury and improve canopy airflow.',care:'Ask local fruit-tree extension staff for a crop-specific diagnosis and management plan.',refs:'https://ipm.ucanr.edu/agriculture/stone-fruit/brown-rot/'},

 {name:'Wheat stripe rust',crops:['Wheat'],sym:['orange_pustules','yellowing','premature_leaf_fall'],cause:'Puccinia striiformis f. sp. tritici (fungus)',desc:'Yellow-orange rust pustules commonly form in stripes along wheat leaves; severe infection reduces green leaf area.',progress:'Can spread rapidly under favourable cool, moist conditions and may reach upper leaves and heads.',conditions:'Cool temperatures, dew and susceptible wheat varieties.',lookalikes:'Other wheat rusts and nutrient-related yellow streaking.',prevention:'Use locally recommended resistant varieties and monitor crops during cool, moist periods.',care:'Seek agricultural extension guidance before selecting any disease-control action.',refs:'https://www.apsnet.org/edcenter/disandpath/fungalbasidio/pdlessons/Pages/StripeRust.aspx'}

);

moreDiseases.slice(-3).forEach((d,i)=>diseases.push({...d,id:diseases.length+i}));

const diseaseMeta = {

 'Early blight':['Alternaria solani','Tomato, potato','Warm weather, leaf wetness and stressed plants','Septoria leaf spot, nutrient stress','Rotate crops, remove infected debris, avoid overhead irrigation.','https://extension.umn.edu/disease-management/early-blight-tomato-and-potato'],

 'Late blight':['Phytophthora infestans (oomycete)','Potato, tomato','Cool to mild wet weather and prolonged leaf wetness','Frost injury and other leaf blights','Use healthy seed tubers, monitor forecasts, avoid moving suspect plants.','https://extension.umn.edu/disease-management/late-blight'],

 'Powdery mildew':['Various powdery mildew fungi','Cucumber, tomato and many crops','Moderate temperatures, humid air and crowded canopies','Dust, spray deposits, downy mildew','Improve spacing and airflow; choose resistant cultivars where available.','https://extension.umn.edu/plant-diseases/powdery-mildew'],

 'Downy mildew':['Crop-specific oomycetes (for example Pseudoperonospora cubensis)','Cucumber and other hosts','High humidity and leaf wetness','Powdery mildew and angular leaf spot','Improve airflow and avoid extended leaf wetness.','https://extension.umn.edu/plant-diseases/downy-mildew'],

 'Bacterial wilt':['Ralstonia solanacearum species complex','Tomato, potato and other hosts','Warm wet soils and contaminated planting material','Fusarium wilt and drought stress','Use clean planting material and avoid moving contaminated soil.','https://www.apsnet.org/edcenter/disandpath/prokaryote/pdlessons/Pages/BacterialWilt.aspx'],

 'Fusarium wilt':['Fusarium oxysporum species complexes','Tomato and host-specific crops','Warm soil and susceptible cultivars','Bacterial wilt and water stress','Use resistant varieties where available and rotate with non-host crops.','https://www.apsnet.org/edcenter/disandpath/fungalbasidio/pdlessons/Pages/FusariumWilt.aspx'],

 'Septoria leaf spot':['Septoria lycopersici','Tomato','Warm wet weather and splash dispersal','Early blight and bacterial spot','Remove crop debris and reduce leaf wetness.','https://extension.umn.edu/disease-management/septoria-leaf-spot-tomato'],

 'Anthracnose':['Colletotrichum species','Beans, tomato and many fruits','Warm wet conditions and infected seed/debris','Bacterial spots and sun injury','Use clean seed and sanitation; rotate crops.','https://www.apsnet.org/edcenter/disandpath/fungalbasidio/pdlessons/Pages/Anthracnose.aspx'],

 'Rust':['Host-specific rust fungi (Pucciniales)','Beans and many other plants','Moist conditions and susceptible hosts','Orange leaf spots, mites and nutrient injury','Remove volunteer hosts where advised and avoid handling wet foliage.','https://www.apsnet.org/edcenter/disandpath/fungalbasidio/pdlessons/Pages/Rust.aspx'],

 'Apple scab':['Venturia inaequalis','Apple','Cool wet spring weather and infected leaf litter','Frog-eye leaf spot and other fruit blemishes','Remove fallen leaves and use resistant cultivars where suitable.','https://ipm.ucanr.edu/agriculture/apple/apple-scab/'],

 'Fire blight':['Erwinia amylovora','Apple, pear and other Rosaceae','Warm wet bloom periods','Frost injury and shoot blights','Use clean planting stock and consult local plant-health authorities.','https://ipm.ucanr.edu/agriculture/apple/fire-blight/'],

 'Botrytis grey mould':['Botrytis cinerea','Grapes, vegetables, flowers and fruit','High humidity and damaged tissue','Other soft rots','Improve airflow and remove decaying material.','https://www.apsnet.org/edcenter/disandpath/fungalbasidio/pdlessons/Pages/Botrytis.aspx']

};

const regionalRefs={'Berberis lycium':'https://ethnobotanyjournal.org/index.php/era/article/view/5933','Platanus orientalis':'https://pmc.ncbi.nlm.nih.gov/articles/PMC11102610/','Juglans regia':'https://pmc.ncbi.nlm.nih.gov/articles/PMC11102610/','Rosa webbiana':'https://pakbs.org/pjbot/paper_details.php?id=2710','Artemisia maritima':'https://pakbs.org/pjbot/paper_details.php?id=2710','Artemisia brevifolia':'https://pakbs.org/pjbot/paper_details.php?id=2710','Ephedra gerardiana':'https://pakbs.org/pjbot/paper_details.php?id=2710','Ferula narthex':'https://pakbs.org/pjbot/paper_details.php?id=2710'};species.forEach(s=>{if(regionalRefs[s.latin])s.reference=regionalRefs[s.latin]});

diseases.forEach(d=>{const m=diseaseMeta[d.name];if(m){d.cause=m[0];d.crops=m[1].split(', ');d.conditions=m[2];d.lookalikes=m[3];d.prevention=m[4];d.refs=m[5]}else{d.cause=d.cause||'Cause needs crop-specific confirmation; see the reference.';d.conditions=d.conditions||'Conditions vary with crop, climate and pathogen.';d.lookalikes=d.lookalikes||'Other leaf spots, nutrient disorders, water stress and pest injury may look similar.';d.prevention=d.prevention||'Use clean planting material, sanitation, crop rotation where appropriate and avoid prolonged leaf wetness.';d.refs=d.refs||'https://www.apsnet.org/'}d.progress=d.progress||'Symptoms may progress differently by cultivar and growing conditions.'});

const bananaProfileIndex=diseases.findIndex(d=>d.name==='Fusarium wilt of banana');

if(bananaProfileIndex>=0)diseases.splice(bananaProfileIndex,1);

diseases.push(

 {id:101,name:'Phytophthora root and crown rot',crops:['Apple','Apricot','Grape'],sym:['root_discoloration','wilting','yellowing','stunted_growth'],cause:'Phytophthora species (oomycetes)',desc:'Roots and crown tissue may become discoloured and decayed; above-ground symptoms can include poor growth, yellowing and wilting.',progress:'Root damage can increase over time, particularly where soil remains saturated.',conditions:'Poor drainage, waterlogged soil and susceptible rootstocks.',lookalikes:'Armillaria root disease, drought stress and nutrient problems.',prevention:'Improve drainage where feasible and use locally recommended planting material.',care:'Have roots and crown tissue examined by an agricultural specialist; avoid applying treatments based only on symptoms.',refs:'https://ipm.ucanr.edu/agriculture/apple/phytophthora-root-and-crown-rot/'},

 {id:102,name:'Maize common smut',crops:['Maize'],sym:['swollen_galls','stem_lesions'],cause:'Ustilago maydis (fungus)',desc:'Irregular swollen galls can form on ears, tassels, leaves or stems; young galls may be pale and later darken as spores develop.',progress:'Galls enlarge on affected tissues and eventually release dark spores.',conditions:'Wounds, plant stress and warm growing conditions can favour infection.',lookalikes:'Insect injury, other ear rots and abnormal growths.',prevention:'Use healthy seed, reduce avoidable plant injury and manage crop residues according to local advice.',care:'Confirm the problem before making crop-management decisions; consult local agricultural extension staff.',refs:'https://www.apsnet.org/edcenter/disandpath/fungalbasidio/pdlessons/Pages/CornSmut.aspx'}

);

const extraQuiz=[

 ['Which part of a plant usually absorbs water and mineral ions from soil?',['Flower','Root','Fruit','Petal'],1,'Root hairs increase the surface area for absorption.'],

 ['Which statement best describes blossom-end rot in tomato?',['A viral infection','A fungal disease','A physiological disorder','An insect infestation'],2,'It is a physiological disorder linked to calcium movement and inconsistent water supply, not an infectious disease.']

];

extraQuiz.forEach(q=>quizzes.push(q));

function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}

function nav(view){$$('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+view));$$('.side-link').forEach(b=>b.classList.toggle('active',b.dataset.view===view));$('#current-section').textContent=({home:'Overview',disease:'Plant Health Lab',identify:'Plant Detection',atlas:'Flora Atlas',community:'Bio-Observations',learn:'Learning Lab',sources:'References',fauna:'Fauna Atlas',map:'Regional Map',conservation:'Conservation'})[view]||'Overview';$('#sidebar').classList.remove('open');if(view==='identify')renderSpecies('#species-grid',$('#plant-search').value,plantFilter);if(view==='atlas')renderSpecies('#atlas-grid',$('#atlas-search').value,atlasFilter);window.scrollTo({top:0,behavior:'smooth'})}

$$('[data-view]').forEach(b=>b.addEventListener('click',()=>nav(b.dataset.view)));$$('[data-go]').forEach(b=>b.addEventListener('click',()=>nav(b.dataset.go)));$('#mobile-menu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));

$('#today-label').textContent=new Intl.DateTimeFormat(undefined,{dateStyle:'full'}).format(new Date());$('#year').textContent=new Date().getFullYear();if($('#stat-diseases'))$('#stat-diseases').textContent=diseases.length;

function renderSpecies(target,query='',filter='all'){

 const q=query.toLowerCase();

 const found=species.filter(s=>{

  const text=[s.local,s.latin,s.habit,s.habitat,s.family,s.distribution].join(' ').toLowerCase();

  const categoryOk=filter==='all'||(filter==='chitral'?/documented in|reported as dominant|reported as vulnerable/i.test(s.chitral):filter==='medicinal'?/documented in|reported as/i.test(s.chitral):filter==='trees'?/tree/i.test(s.habit):filter==='shrubs'?/shrub/i.test(s.habit):filter==='herbs'?/herb|grass/i.test(s.habit):filter==='flowers'?/flower|herb/i.test(s.habit):filter==='alpine'?/alpine|mountain|himalaya/i.test(s.habitat+' '+s.distribution):true);

  return text.includes(q)&&categoryOk;

 });

 $(target).innerHTML=found.map(s=>`<article class="species-card">

  <div class="species-photo-wrap"><div class="species-placeholder" id="placeholder-${target.slice(1)}-${s.id}"><span>✿</span><small>Species photograph not yet verified</small></div><img loading="lazy" id="species-image-${target.slice(1)}-${s.id}" data-species-id="${s.id}" data-target="${target}" class="species-photo hidden" alt="${esc(s.latin)} botanical photograph"><small class="photo-caption" id="photo-credit-${target.slice(1)}-${s.id}">Searching GBIF / Wikimedia Commons for an exact scientific-name record…</small></div>

  <div class="species-card-body"><h3>${esc(s.local)}</h3><div class="latin">${esc(s.latin)}</div><div class="species-meta"><span>${esc(s.family)}</span><span>${esc(s.habit)}</span></div>

  <p>${esc(s.description)}</p><details><summary>View botanical profile</summary><dl class="plant-details">

   <dt>Distinguishing features</dt><dd>${esc(s.features)}</dd><dt>Flower</dt><dd>${esc(s.flower)}</dd><dt>Leaves</dt><dd>${esc(s.leaf)}</dd><dt>Habitat</dt><dd>${esc(s.habitat)}</dd><dt>Global distribution</dt><dd>${esc(s.distribution)}</dd><dt>Chitral evidence</dt><dd>${esc(s.chitral)}</dd><dt>Documented locality</dt><dd>${esc(s.locality)}</dd><dt>Traditional / other uses</dt><dd>${esc(s.use)}</dd><dt>Conservation</dt><dd>${esc(s.conservation)}</dd></dl></details>

  <p class="source-link"><a href="${esc(s.reference)}" target="_blank" rel="noopener">Open species reference ↗</a></p></div></article>`).join('')||'<div class="panel">No matching plants found. Try another name or filter.</div>';

 $('#stat-species').textContent=species.length;

 const section=$(target)?.closest('.view');

 if(section?.classList.contains('active'))$$(`${target} img[data-species-id]`).forEach(img=>{const marker=$('#placeholder-'+target.slice(1)+'-'+img.dataset.speciesId);if(commonsObserver&&marker){marker.dataset.speciesId=img.dataset.speciesId;marker.dataset.target=target;commonsObserver.observe(marker)}else loadSpeciesPhoto(species.find(s=>s.id===Number(img.dataset.speciesId)),target)});

}

const photoCache=new Map();

// Observe the visible placeholder, not the hidden image. An image with

// display:none cannot intersect, so observing it prevented photo loading.

const commonsObserver=typeof IntersectionObserver!=='undefined'?new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const marker=entry.target;commonsObserver.unobserve(marker);const item=species.find(s=>s.id===Number(marker.dataset.speciesId));if(item)loadSpeciesPhoto(item,marker.dataset.target)}),{rootMargin:'240px'}):null;

function cleanMeta(value){return String(value||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&#160;/g,' ').replace(/\s+/g,' ').trim()}

function nameKey(value){return String(value||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}

async function gbifPhotos(latin){

 const binomial=nameKey(latin).split(' ').slice(0,2).join(' ');

 if(binomial.split(' ').length!==2)return [];

 const matchResponse=await fetch(

  'https://api.gbif.org/v1/species/match?name='+encodeURIComponent(latin)

 );

 if(!matchResponse.ok)throw Error('GBIF taxonomy lookup unavailable');

 const match=await matchResponse.json();

 const matchedName=nameKey(match.scientificName||'').split(' ').slice(0,2).join(' ');

 if(!match.usageKey||match.rank!=='SPECIES'||matchedName!==binomial)return [];

 const url='https://api.gbif.org/v1/occurrence/search?taxonKey='+

  encodeURIComponent(match.usageKey)+'&mediaType=StillImage&limit=100';

 const response=await fetch(url);

 if(!response.ok)throw Error('GBIF occurrence search unavailable');

 const data=await response.json();

 const candidates=[];

 for(const record of (data.results||[])){

  const recordName=nameKey(record.species||record.scientificName||'')

   .split(' ').slice(0,2).join(' ');

  if(recordName!==binomial)continue;

  for(const media of (record.media||[])){

   if(!media.identifier||!/^https?:\/\//i.test(media.identifier))continue;

   candidates.push({

    src:media.identifier,

    url:media.references||('https://www.gbif.org/occurrence/'+record.key),

    author:media.creator||'Contributor not stated',

    license:media.license||'Licence not stated',

    source:'GBIF occurrence'

   });

  }

 }

 return candidates;

}

async function commonsPhotos(latin){

 const words=nameKey(latin).split(' ').slice(0,2);

 if(words.length!==2)return [];

 const searches=[words.join(' '),'"'+words.join(' ')+'"'];

 for(const term of searches){

  const url='https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch='+

   encodeURIComponent(term)+

   '&gsrnamespace=6&gsrlimit=40&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1000&format=json&origin=*';

  const response=await fetch(url);

  if(!response.ok)continue;

  const data=await response.json();

  const pages=Object.values(data.query?.pages||{});

  const items=[];

  for(const page of pages){

   const info=page.imageinfo?.[0];

   if(!info)continue;

   const meta=info.extmetadata||{};

   const title=nameKey(page.title);

   const description=nameKey(cleanMeta(meta.ImageDescription?.value));

   const titleMatches=words.every(word=>title.includes(word));

   const descriptionMatches=words.every(word=>description.includes(word));

   if(!titleMatches&&!descriptionMatches)continue;

   items.push({

    src:info.thumburl||info.url,

    url:info.descriptionurl,

    author:cleanMeta(meta.Artist?.value)||'Unknown contributor',

    license:cleanMeta(meta.LicenseShortName?.value)||'Licence not stated',

    source:'Wikimedia Commons'

   });

  }

  if(items.length)return items;

 }

 return [];

}

async function loadSpeciesPhoto(s,target){

 if(!s)return;const prefix=target.slice(1)+'-';const img=$('#species-image-'+prefix+s.id),placeholder=$('#placeholder-'+prefix+s.id),credit=$('#photo-credit-'+prefix+s.id);

 if(!img||img.dataset.loaded==='1')return;img.dataset.loaded='1';if(credit)credit.textContent='Checking exact-species records (GBIF / Wikimedia Commons)…';

 try{

  let pending=photoCache.get(s.latin);

  if(!pending){pending=(async()=>{let candidates=[];try{candidates=await gbifPhotos(s.latin)}catch(e){}if(!candidates.length){try{candidates=await commonsPhotos(s.latin)}catch(e){}}return candidates;})();photoCache.set(s.latin,pending);}

  const candidates=await pending;if(!candidates.length)throw Error('No exact-name image record found');

  const tryCandidate=index=>{if(index>=candidates.length)throw Error('All candidate images failed to load');const item=candidates[index];img.onload=()=>{img.classList.remove('hidden');placeholder?.classList.add('hidden');if(credit)credit.innerHTML=`Photo: ${esc(item.author)} · ${esc(item.license)} · <a href="${esc(item.url)}" target="_blank" rel="noopener">view ${esc(item.source)} record & licence</a>`;};img.onerror=()=>tryCandidate(index+1);img.src=item.src;};

  tryCandidate(0);

 }catch(e){if(credit)credit.textContent='No verified photo available from GBIF / Wikimedia right now. Try again later; no unrelated image is shown.';img.dataset.loaded='0';}

}

let plantFilter='all',atlasFilter='all';

renderSpecies('#species-grid');renderSpecies('#atlas-grid');

$('#plant-filters')?.addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;plantFilter=b.dataset.filter;$$('#plant-filters [data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderSpecies('#species-grid',$('#plant-search').value,plantFilter)});

$('#atlas-filters')?.addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;atlasFilter=b.dataset.filter;$$('#atlas-filters [data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderSpecies('#atlas-grid',$('#atlas-search').value,atlasFilter)});$('#plant-search').addEventListener('input',e=>renderSpecies('#species-grid',e.target.value,plantFilter));$('#atlas-search').addEventListener('input',e=>renderSpecies('#atlas-grid',e.target.value,atlasFilter));$('#global-search').addEventListener('keydown',e=>{if(e.key==='Enter'){nav('atlas');$('#atlas-search').value=e.target.value;renderSpecies('#atlas-grid',e.target.value,atlasFilter)}});

function setupPreview(input,wrap,img,clear){$(input).addEventListener('change',()=>{const f=$(input).files[0];if(!f)return;if(!/^image\/(jpeg|png|webp)$/.test(f.type)||f.size>8*1024*1024){toast('Choose a JPG, PNG or WebP image under 8 MB.');$(input).value='';return}$(img).src=URL.createObjectURL(f);$(wrap).classList.remove('hidden')});$(clear).addEventListener('click',()=>{$(wrap).classList.add('hidden');$(input).value='';$(img).removeAttribute('src')})}

setupPreview('#disease-photo','#disease-preview-wrap','#disease-preview','#clear-disease-photo');setupPreview('#plant-photo','#identify-preview-wrap','#identify-preview','#clear-identify-photo');

let stream=null;$('#start-camera').addEventListener('click',async()=>{try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false});$('#camera-video').srcObject=stream;$('#camera-box').classList.remove('hidden')}catch(e){toast('Camera unavailable. Use image upload or allow camera permission on HTTPS/localhost.')}});function stopCamera(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}$('#camera-video').srcObject=null;$('#camera-box').classList.add('hidden')}$('#stop-camera').addEventListener('click',stopCamera);window.addEventListener('beforeunload',stopCamera);$('#capture-photo').addEventListener('click',()=>{const v=$('#camera-video');if(!v.videoWidth){toast('Wait for the camera image to load.');return}const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);$('#identify-preview').src=c.toDataURL('image/jpeg',.88);$('#identify-preview-wrap').classList.remove('hidden');stopCamera();toast('Photo captured. Now choose the visible traits.')});

const traitOptions={habit:['herb','shrub','tree','climber'],leaf:['needle','broad','compound','narrow','lobed'],flower:['purple','white','yellow','pink','green'],habitat:['mountain','river','woodland','field','dry']};$('#identify-plant').addEventListener('click',()=>{const chosen={habit:$('#trait-habit').value,leaf:$('#trait-leaf').value,flower:$('#trait-flower').value,habitat:$('#trait-habitat').value};const active=Object.values(chosen).filter(Boolean).length;if(!active){toast('Choose at least one visible trait first.');return}const ranked=species.map(s=>{let score=0,total=0;Object.entries(chosen).forEach(([k,v])=>{if(v){total++;if(s.traits[k]===v)score++}});return{s,score:Math.round(score/total*100)}}).sort((a,b)=>b.score-a.score).slice(0,5);$('#identify-results').classList.remove('hidden');$('#identify-results').innerHTML='<b>Possible trait matches — not AI image recognition</b><p class="muted">These scores measure agreement with your selected traits only; they are not probabilities.</p>'+ranked.map(r=>{const photo=$('#species-image-species-grid-'+r.s.id);const src=photo&&!photo.classList.contains('hidden')?photo.src:'';return `<div class="result-item identify-match">${src?`<img src="${src}" alt="${esc(r.s.latin)}">`:`<div class="match-placeholder">Photo not yet verified</div>`}<div><span class="result-score">${r.score}% trait match</span><b>${esc(r.s.local)} · <i>${esc(r.s.latin)}</i></b><p>${esc(r.s.description||r.s.habitat)}</p><p>${esc(r.s.family||'Family not verified')} · ${esc(r.s.habitat||'Habitat not recorded')}</p></div></div>`}).join('');$('#identify-results').scrollIntoView({behavior:'smooth',block:'nearest'})});

$('#symptom-options').innerHTML=symptoms.map(s=>`<button class="symptom-option" type="button" data-sym="${s[0]}">${s[1]}</button>`).join('');let selected=new Set();$('#symptom-options').addEventListener('click',e=>{const b=e.target.closest('[data-sym]');if(!b)return;if(b.dataset.unsure!==undefined){selected.clear();$$('#symptom-options [data-sym]').forEach(x=>x.classList.remove('selected'));$('#symptom-count').textContent='Not sure';$('#disease-results').classList.remove('hidden');$('#disease-results').innerHTML='<b>Not sure about the symptoms?</b><p>Do not guess. Take clear photos of the whole plant and affected parts, note the crop and when symptoms began, and ask a local agricultural extension worker or plant-health specialist. This matching tool cannot diagnose a plant.</p>';return}const k=b.dataset.sym;selected.has(k)?selected.delete(k):selected.add(k);b.classList.toggle('selected',selected.has(k));$('#symptom-count').textContent=selected.size+' selected'});$('#symptoms-unsure').addEventListener('click',()=>{selected.clear();$$('#symptom-options [data-sym]').forEach(x=>x.classList.remove('selected'));$('#symptom-count').textContent='Not sure';$('#disease-results').classList.remove('hidden');$('#disease-results').innerHTML='<b>Not sure about the symptoms?</b><p>Do not guess. Take clear photos of the whole plant and affected parts, note the crop and when symptoms began, and ask a local agricultural extension worker or plant-health specialist. This matching tool cannot diagnose a plant.</p>'});

$('#disease-list').innerHTML=diseases.map(d=>`<button type="button" data-disease="${d.id}"><b>${d.name}</b><br><span class="muted">${d.crops.join(', ')}</span></button>`).join('');$('#disease-list').addEventListener('click',e=>{const b=e.target.closest('[data-disease]');if(!b)return;const d=diseases.find(x=>x.id==b.dataset.disease);$('#disease-results').classList.remove('hidden');$('#disease-results').innerHTML=`<b>${esc(d.name)}</b><p><b>Cause:</b> ${esc(d.cause||'Requires confirmation')}</p><p>${esc(d.desc)}</p><p><b>Progression:</b> ${esc(d.progress||'Varies')}</p><p><b>Favouring conditions:</b> ${esc(d.conditions||'Varies')}</p><p><b>Lookalikes:</b> ${esc(d.lookalikes||'Other crop problems')}</p><p><b>Prevention:</b> ${esc(d.prevention||'Crop hygiene and local advice')}</p><p><b>General management:</b> ${esc(d.care||'Seek local agricultural advice')}</p><p><a href="${esc(d.refs||'https://www.apsnet.org/')}" target="_blank" rel="noopener">Reference ↗</a></p><small>Educational profile only. Not a confirmed diagnosis.</small>`});

$('#match-disease').addEventListener('click',()=>{if(!selected.size){toast('Select one or more visible symptoms.');return}const crop=$('#disease-crop').value;const ranked=diseases.map(d=>{const matches=d.sym.filter(x=>selected.has(x)).length;const cropOk=crop==='any'||d.crops.includes(crop)||d.crops.includes('Tomato / Potato')||d.crops.includes('Tomato, potato')||d.crops.some(c=>c.toLowerCase().includes(crop.toLowerCase())&&crop!=='any');return{d,matches,cropOk,score:Math.round(matches/Math.max(1,selected.size)*100),miss:d.sym.filter(x=>!selected.has(x)),unmatched:[...selected].filter(x=>!d.sym.includes(x))}}).filter(x=>x.matches>0&&x.cropOk).sort((a,b)=>b.matches-a.matches||b.score-a.score).slice(0,5);$('#disease-results').classList.remove('hidden');$('#disease-results').innerHTML=ranked.length?'<b>Possible symptom overlaps</b><p class="muted">Rule-based match score = matching profile symptoms ÷ symptoms you selected. It is not a probability or diagnosis.</p>'+ranked.map(r=>`<div class="result-item"><span class="result-score">${r.score}% rule match</span><b>${r.d.name}</b><p><b>Cause:</b> ${esc(r.d.cause||'Not specified')}</p><p>${esc(r.d.desc)}</p><p><b>Profile symptoms not selected:</b> ${esc(r.miss.join(', ')||'None')}</p><p><b>Your selected symptoms not represented:</b> ${esc(r.unmatched.map(k=>symptoms.find(x=>x[0]===k)?.[1]||k).join(', ')||'None')}</p><p><b>Progression:</b> ${esc(r.d.progress||'Varies')}</p><p><b>Favouring conditions:</b> ${esc(r.d.conditions||'Varies')}</p><p><b>Lookalikes:</b> ${esc(r.d.lookalikes||'Other disorders')}</p><p><b>Prevention:</b> ${esc(r.d.prevention||'Use crop hygiene')}</p><p><b>General management:</b> ${esc(r.d.care||'Seek local advice')}</p><p><a href="${esc(r.d.refs||'https://www.apsnet.org/')}" target="_blank" rel="noopener">Reference ↗</a></p></div>`).join(''):'No close profile match. The symptoms may have another cause; ask an agricultural extension worker.';});

function readStore(k){try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return[]}}function writeStore(k,v){localStorage.setItem(k,JSON.stringify(v))}function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function renderJournal(){const arr=readStore(STORAGE.journal);$('#stat-notes').textContent=arr.length;$('#journal-list').innerHTML=arr.map(x=>`<div class="journal-item"><b>${esc(x.plant)}</b> · ${esc(x.date)}<p>${esc(x.note)}</p></div>`).join('')||'<p class="muted">No notes saved yet.</p>'}$('#save-journal').addEventListener('click',()=>{const plant=$('#journal-plant').value.trim(),note=$('#journal-text').value.trim(),date=$('#journal-date').value;if(!plant||!note||!date){toast('Complete the plant, date and notes fields.');return}const a=readStore(STORAGE.journal);a.unshift({plant,note,date});writeStore(STORAGE.journal,a.slice(0,100));$('#journal-plant').value='';$('#journal-text').value='';renderJournal();toast('Field note saved on this device.')});renderJournal();

function renderObservations(){const a=readStore(STORAGE.obs);$('#stat-observations').textContent=a.length;$('#observation-list').innerHTML=a.map(x=>`<div class="journal-item">${x.photo?`<img class="observation-thumb" src="${x.photo}" alt="Unverified submitted plant observation">`:''}<b>${esc(x.name)}</b> <span class="soft-tag">${esc(x.category||'Plant')}</span> ${x.scientific?`<i>${esc(x.scientific)}</i>`:''}<p>${esc(x.date)} · ${esc(x.habitat)} · ${esc(x.area||'Area not given')}</p><p>${esc(x.notes||'No notes')}</p><span class="soft-tag">Unverified observation</span></div>`).join('')||'<p class="muted">No observations yet.</p>'}$('#obs-date').value=new Date().toISOString().slice(0,10);$('#observation-form').addEventListener('submit',e=>{e.preventDefault();if(!$('#obs-consent').checked){toast('Please confirm the local-only storage notice.');return}const file=$('#obs-photo')?.files?.[0];if(file&&(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size>2*1024*1024)){toast('Observation photo must be JPG, PNG or WebP under 2 MB.');return}const save=(photo='')=>{const a=readStore(STORAGE.obs);a.unshift({category:$('#obs-category')?.value||'Plant',name:$('#obs-name').value.trim(),scientific:$('#obs-scientific').value.trim(),date:$('#obs-date').value,habitat:$('#obs-habitat').value,area:$('#obs-area').value.trim(),elevation:$('#obs-elevation').value,notes:$('#obs-notes').value.trim(),photo});try{writeStore(STORAGE.obs,a.slice(0,200));e.target.reset();$('#obs-date').value=new Date().toISOString().slice(0,10);renderObservations();toast('Observation saved locally as unverified.')}catch(err){toast('Browser storage is full. Remove older photos or export your notes.')}};if(file){const reader=new FileReader();reader.onload=()=>save(reader.result);reader.onerror=()=>toast('Could not read the selected photo.');reader.readAsDataURL(file)}else save()});;renderObservations();$('#export-observations').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(readStore(STORAGE.obs),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='flora-hindukush-observations.json';a.click();URL.revokeObjectURL(a.href)});

let qi=0,score=0,answered=false;function showQuiz(){const q=quizzes[qi];$('#quiz-step').textContent=`QUESTION ${qi+1} OF ${quizzes.length}`;$('#quiz-score').textContent=score;$('#quiz-progress').style.width=((qi+1)/quizzes.length*100)+'%';$('#quiz-question').textContent=q[0];$('#quiz-options').innerHTML=q[1].map((x,i)=>`<button type="button" data-answer="${i}">${String.fromCharCode(65+i)}. ${x}</button>`).join('');$('#quiz-feedback').classList.add('hidden');$('#quiz-next').disabled=true;answered=false;$('#quiz-next').textContent=qi===quizzes.length-1?'Finish quiz':'Next question →'}$('#quiz-options').addEventListener('click',e=>{const b=e.target.closest('[data-answer]');if(!b||answered)return;answered=true;const q=quizzes[qi],n=Number(b.dataset.answer);if(n===q[2])score++;$$('#quiz-options button').forEach((x,i)=>{x.disabled=true;if(i===q[2])x.classList.add('correct');else if(i===n)x.classList.add('incorrect')});$('#quiz-score').textContent=score;$('#quiz-feedback').textContent=(n===q[2]?'Correct! ':'Not quite. ')+q[3];$('#quiz-feedback').classList.remove('hidden');$('#quiz-next').disabled=false});$('#quiz-next').addEventListener('click',()=>{if(!answered)return;if(qi<quizzes.length-1){qi++;showQuiz()}else{$('#quiz-question').textContent=`Quiz complete — ${score} / ${quizzes.length}`;$('#quiz-options').innerHTML='<p>Great work exploring plant science.</p>';$('#quiz-feedback').textContent='Restart to try again.';$('#quiz-feedback').classList.remove('hidden');$('#quiz-next').disabled=true;$('#quiz-next').textContent='Completed'}});$('#quiz-restart').addEventListener('click',()=>{qi=0;score=0;showQuiz()});showQuiz();

// HinduKush BioSphere additions: network state, regional map and interface language.

(function biosphereEnhancements(){

  const status=document.getElementById('connection-status');

  function updateNetwork(){if(!status)return;status.textContent=navigator.onLine?'● Online':'● Offline';status.classList.toggle('is-offline',!navigator.onLine)}

  window.addEventListener('online',updateNetwork);window.addEventListener('offline',updateNetwork);updateNetwork();

  const mapEl=document.getElementById('regional-map');

  let mapStarted=false;

  function loadMap(){

    if(!mapEl||mapStarted)return;mapStarted=true;

    const init=()=>{if(!window.L){mapEl.innerHTML='<div class="map-fallback"><b>Map library unavailable.</b><p>Connect to the internet to load the OpenStreetMap view. Your local field notebook is unaffected.</p></div>';return}

      const map=L.map(mapEl,{scrollWheelZoom:false}).setView([35.85,71.78],8);window.hkRegionalMap=map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);

     const studyAreas = [

  {

    name: 'Torkhow Valley',

    coords: [36.45309, 72.42228],

    note: 'Upper Chitral biodiversity research area.',

    flora: [

      'Himalayan birch — Betula utilis',

      'Juniper — Juniperus excelsa',

      'Willow — Salix spp.',

      'Poplar — Populus spp.',

      'Ephedra — Ephedra spp.',

      'Artemisia — Artemisia spp.'

    ],

    fauna: [

      'Snow leopard — Panthera uncia',

      'Himalayan ibex — Capra sibirica',

      'Grey wolf — Canis lupus',

      'Golden jackal — Canis aureus',

      'Red fox — Vulpes vulpes',

      'Long-tailed marmot — Marmota caudata',

      'Cape hare — Lepus capensis',

      'Himalayan snowcock — Tetraogallus himalayensis',

      'Chukar — Alectoris chukar'

    ],

    research: 'Din and Nawaz (2011), based on field surveys conducted in 2007.',

    source: 'https://psa.pastic.gov.pk/article/2478/status-of-snow-leopard-and-prey-species-in-torkhow-valley-district-chitral-pakistan'

  },

  {

    name: 'Terich Valley',

    coords: [36.34458, 72.13311],

    note: 'Upper Chitral biodiversity research area, extending towards Tirich Mir.',

    flora: [

      'Himalayan birch — Betula utilis',

      'Sea buckthorn — Hippophae rhamnoides',

      'Willow — Salix acmophylla',

      'Wild thyme — Thymus linearis',

      'Common wormwood — Artemisia absinthium',

      'Stinging nettle — Urtica dioica',

      'Wild mint — Mentha longifolia',

      'Ephedra — Ephedra gerardiana',

      'Astragalus species — Astragalus spp.',

      'Kobresia species — Kobresia spp.'

    ],

    fauna: [

      'Snow leopard — Panthera uncia',

      'Siberian ibex — Capra sibirica',

      'Brown bear — Ursus arctos',

      'Eurasian lynx — Lynx lynx',

      'Red fox — Vulpes vulpes',

      'Grey wolf — Canis lupus',

      'Himalayan monal — Lophophorus impejanus',

      'Golden eagle — Aquila chrysaetos'

    ],

    research: 'Floristic survey (2017–2019): 445 plant species, 272 genera and 71 families. Irano-Turanian was the dominant chorotype. Fauna entries are regional reports requiring locality-specific verification.',

    source: 'https://doi.org/10.36899/JAPS.2021.6.0376'

  },

  {

    name: 'Reshun',

    coords: [36.15365, 72.09928],

    note: 'Reshun biodiversity and geological research area, Upper Chitral.',

    flora: [

      'Juniper — Juniperus spp.',

      'Himalayan birch — Betula utilis',

      'Willow — Salix spp.',

      'Wild rose — Rosa spp.',

      'Mulberry — Morus spp.',

      'Walnut — Juglans regia',

      'Apricot — Prunus armeniaca',

      'Apple — Malus domestica'

    ],

    fauna: [

      'Snow leopard — Panthera uncia',

      'Siberian ibex — Capra sibirica',

      'Himalayan lynx — Lynx lynx',

      'Tibetan wolf — Canis lupus chanco',

      'Chukar — Alectoris chukar',

      'Himalayan griffon vulture — Gyps himalayensis',

      'Bearded vulture — Gypaetus barbatus'

    ],

    research: 'Flora and fauna entries are regional research leads supplied for Reshun. Species-level occurrence requires locality-specific verification. Geological formations and fossils should be displayed in a separate geology layer.',

    source: ''

  },

  {

    name: 'Lotkuh Valley',

    coords: [35.99301, 71.55936],

    note: 'Lotkuh ethnobotanical and biodiversity research area.',

    flora: [

      'Astragalus — Astragalus oihorensis',

      'Astragalus — Astragalus owirensis',

      'Cicer — Cicer nuristanicum',

      'Geranium — Geranium parmiricum',

      'Rochelia — Rochelia chitralensis',

      'Oriental plane — Platanus orientalis',

      'Walnut — Juglans regia',

      'Capparis — Capparis spinosa',

      'White mulberry — Morus alba',

      'Wild thyme — Thymus linearis',

      'Holm oak — Quercus baloot'

    ],

    fauna: [],

    research: '2024 ethnobotanical study documented 150 plant species across 59 families, based on interviews and workshops with 120 local respondents. Traditional-use reports are not population counts.',

    source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10865068/'

  },

  {

    name: 'Laspur Valley',

    coords: [36.04784, 72.46796],

    note: 'Laspur Valley floristic and wildlife research area.',

    flora: [

      'Astragalus — Astragalus spp.',

      'Artemisia — Artemisia spp.',

      'Nepeta — Nepeta spp.',

      'Potentilla — Potentilla spp.',

      'Allium — Allium spp.',

      'Birch — Betula spp.',

      'Juniper — Juniperus spp.',

      'Willow — Salix spp.'

    ],

    fauna: [

      'Himalayan brown bear — Ursus arctos isabellinus',

      'Kashmir markhor — Capra falconeri',

      'Siberian ibex — Capra sibirica',

      'Ladakh urial — Ovis vignei',

      'Snow leopard — Panthera uncia',

      'Golden eagle — Aquila chrysaetos',

      'Eurasian griffon vulture — Gyps fulvus'

    ],

    research: 'Floristic study documented 376 vascular plant species, 62 families and 210 genera. Wildlife entries are regional reports requiring locality-specific verification.',

    source: 'https://www.researchgate.net/publication/376_Floristic_studies_biological_spectrum_and_phenology_of_Laspur_Valley'

  },

  {

    name: 'Lower Chitral',

    coords: [35.85, 71.78],

    note: 'Lower Chitral biodiversity research area, including Chitral Gol National Park.',

    flora: [

      'Deodar cedar — Cedrus deodara',

      'Oak — Quercus spp.',

      'Chilgoza pine — Pinus gerardiana',

      'Kail pine — Pinus wallichiana',

      'Wild almond — Prunus spp.'

    ],

    fauna: [

      'Kashmir markhor — Capra falconeri',

      'Himalayan lynx — Lynx lynx isabellinus',

      'Grey wolf — Canis lupus',

      'Red fox — Vulpes vulpes',

      'Golden jackal — Canis aureus',

      'Stone marten — Martes foina',

      'Cape hare — Lepus capensis',

      'Leopard cat — Prionailurus bengalensis',

      'Himalayan monal — Lophophorus impejanus',

      'Chukar — Alectoris chukar',

      'Himalayan snowcock — Tetraogallus himalayensis'

    ],

    research: 'Chitral Gol camera-trap survey (2019) documented mammals and birds including markhor, lynx, wolf, fox, jackal, stone marten, monal, chukar and snowcock. These are park records, not records for every part of Lower Chitral. Snow leopard was not detected in that particular survey.',

    source: 'https://researcherslinks.com/current-issues/Relative-Abundance-Mammalian-Fauna-Chitral-Gol-National-Park-Pakistan/20/1/5508/html'

  },

  {

    name: 'Mastuj Valley',

    coords: [36.28356, 72.51942],

    note: 'Mastuj Valley alpine flora and fauna research area.',

    flora: [

      'Birch — Betula spp.',

      'Juniper — Juniperus excelsa',

      'Willow — Salix spp.',

      'Wild rose — Rosa spp.',

      'Ephedra — Ephedra spp.',

      'Artemisia — Artemisia spp.',

      'Ribes — Ribes spp.',

      'Acantholimon — Acantholimon spp.'

    ],

    fauna: [

      'Markhor — Capra falconeri',

      'Snow leopard — Panthera uncia',

      'Himalayan lynx — Lynx lynx'

    ],

    research: 'Flora inventory documented 571 plant species across 82 families and 334 genera. Alpine vegetation research identified seven plant communities. Fauna entries are reported regional records awaiting locality-specific verification.',

    source: 'https://inis.iaea.org/records/x7g4q-25e06'

  },

  {

    name: 'Mulkhow Valley',

    coords: [36.193173, 72.143999],

    note: 'Upper Chitral medicinal-plant and ethnobotanical research area.',

    flora: [

      'Medicinal herbs — multiple documented species',

      'Medicinal shrubs — multiple documented species',

      'Medicinal trees — multiple documented species',

      'Poplar — Populus spp. (locally planted)',

      'Robinia — Robinia pseudoacacia (locally planted)'

    ],

    fauna: [],

    research: 'One medicinal-plant study documented 41 species from 38 genera and 26 families. A separate ethnobotanical study documented 60 useful plant taxa. Poplar and Robinia are included as locally planted trees, not confirmed native wild flora.',

    source: 'https://academicjournals.org/journal/JMPR/article-in-press-abstract/ethno_botanical_perspective_of_medicinal_plants_in_mulkhow_valley'

  }

];

studyAreas.forEach(area => {

  L.marker(area.coords)

    .addTo(map)

    .bindPopup(`

  <div class="biodiversity-popup">

    <h3>${area.name}</h3>

    <p>${area.note}</p>

    ${area.flora ? `

      <h4>🌿 Flora</h4>

      <ul>

        ${area.flora.map(item => `<li>${item}</li>`).join('')}

      </ul>

    ` : ''}

    ${area.fauna ? `

      <h4>🐾 Fauna</h4>

      <ul>

        ${area.fauna.map(item => `<li>${item}</li>`).join('')}

      </ul>

    ` : ''}

    ${area.research ? `

      <p><strong>Research:</strong> ${area.research}</p>

    ` : ''}

    ${area.source ? `

      <a href="${area.source}" target="_blank" rel="noopener noreferrer">

        Read research source

      </a>

    ` : ''}

    <p><small>Generalized study-area reference, not a precise species sighting. Species records require individual verification.</small></p>

  </div>

`);

});

      L.marker([35.933,71.667]).addTo(map).bindPopup('<b>Chitral Gol National Park</b><br>Published research documents habitat for Kashmir markhor and snow leopard. Protected-area reference, not a current sighting.<br><a href="https://www.pakbs.org/pjbot/PDFs/45%28S1%29/75.pdf" target="_blank" rel="noopener">Research source</a>');

      L.marker([35.9337,71.6487]).addTo(map).bindPopup('<b>Chitral Bashkar Garmchashm Biosphere Reserve</b><br>UNESCO biosphere-reserve reference area with mountain habitats for markhor, ibex and snow leopard. Generalized marker, not a live sighting.<br><a href="https://www.unesco.org/en/mab/chitral-bashkar-garmchashm" target="_blank" rel="noopener">UNESCO source</a>');

      setTimeout(()=>map.invalidateSize(),250);

    };

    if(window.L){init();return}

    const css=document.createElement('link');css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.appendChild(css);

    const s=document.createElement('script');s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';s.onload=init;s.onerror=()=>{mapEl.innerHTML='<div class="map-fallback">Unable to load the map while offline. Try again when connected.</div>'};document.head.appendChild(s);

  }

  document.querySelectorAll('[data-view="map"],[data-go="map"]').forEach(b=>b.addEventListener('click',()=>setTimeout(loadMap,100)));

  const mapView=document.getElementById('view-map');

  if(mapView&&mapView.classList.contains('active'))loadMap();

  const translations={

    "Overview":"جائزہ","Plant Health Lab":"پودوں کی صحت کی تجربہ گاہ","Plant Detection":"پودوں کی شناخت",

    "Biodiversity Atlas":"حیاتیاتی تنوع کا اطلس","Fauna & Wildlife":"حیوانات اور جنگلی حیات","Fauna Atlas":"حیوانات کا اطلس",

    "Regional Map":"علاقائی نقشہ","Conservation":"تحفظ","Bio-Observations":"حیاتیاتی مشاہدات",

    "Learning Lab":"تعلیمی تجربہ گاہ","References":"حوالہ جات",

    "Observe · Understand · Conserve":"مشاہدہ · سمجھیں · تحفظ کریں",

    "HinduKush BioSphere":"ہندوکش بایوسفیئر"

  };

  let urdu=false;

  const langButton=document.getElementById('language-toggle');

  if(langButton)langButton.addEventListener('click',()=>{

    urdu=!urdu;document.documentElement.lang=urdu?'ur':'en';document.documentElement.dir=urdu?'rtl':'ltr';

    langButton.textContent=urdu?'English':'اردو';

    document.querySelectorAll('.side-link').forEach(btn=>{

      const icon=btn.querySelector('span');const label=[...btn.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent.trim()).join(' ');

      const original=btn.dataset.enLabel||(btn.dataset.enLabel=label);

      const translated=translations[original];if(translated){[...btn.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).forEach(n=>{if(n.textContent.trim())n.textContent=' '+(urdu?translated:original)})}

    });

    const brand=document.querySelector('.brand b');if(brand)brand.innerHTML=urdu?'ہندوکش<span>بایوسفیئر</span>':'HinduKush<span>BioSphere</span>';

    document.body.classList.toggle('urdu-mode',urdu);

    const breadcrumb=document.getElementById('current-section');if(breadcrumb){const current=document.querySelector('.side-link.active');const label=current?.dataset.enLabel||current?.textContent.trim();breadcrumb.textContent=urdu?(translations[label]||label):label||'Overview'}

  });

  document.getElementById('year').textContent=new Date().getFullYear();

})();

if('serviceWorker' in navigator && location.protocol!=='file:'){

  window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

}

document.querySelectorAll('.fauna-image img').forEach(img=>img.addEventListener('error',()=>{

  img.parentElement.innerHTML='<div class="map-fallback">Photograph unavailable offline.<br><small>See the linked species source for imagery.</small></div>';

},{once:true}));

// Fetch genuine Commons file pages by species/common name; never substitute an unrelated image.

document.querySelectorAll('.fauna-image img[data-species]').forEach(async img=>{

  const sci=img.dataset.species, common=img.dataset.common;

  const q=encodeURIComponent(`filetype:bitmap "${sci}" OR "${common}"`);

  try{

    const endpoint=`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${q}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=720&format=json&origin=*`;

    const response=await fetch(endpoint);if(!response.ok)throw new Error('Commons request failed');

    const data=await response.json();const pages=Object.values(data.query?.pages||{});

    const tokens=[sci.split(' ')[1].toLowerCase(),common.toLowerCase()];

    const chosen=pages.find(p=>tokens.some(t=>p.title.toLowerCase().includes(t))&&p.imageinfo?.[0]?.thumburl);

    if(!chosen)throw new Error('No exact-name Commons image found');

    img.src=chosen.imageinfo[0].thumburl;

    const meta=chosen.imageinfo[0].extmetadata||{};

    const credit=meta.Artist?.value?.replace(/<[^>]*>/g,'')||'Wikimedia Commons contributor';

    img.dataset.credit=credit;img.dataset.source=`https://commons.wikimedia.org/wiki/${encodeURIComponent(chosen.title.replaceAll(' ','_'))}`;

    const licence=meta.LicenseShortName?.value||'Check file licence';

    const caption=document.createElement('small');caption.className='photo-credit';

    const link=document.createElement('a');link.href=img.dataset.source;link.target='_blank';link.rel='noopener';link.textContent=`Photo: ${credit} · ${licence} · Source`;

    caption.appendChild(link);img.parentElement.appendChild(caption);

  }catch(err){

    img.parentElement.innerHTML='<div class="map-fallback">No exact-name photograph could be retrieved.<br><small>Open the linked species reference for more information.</small></div>';

  }

});