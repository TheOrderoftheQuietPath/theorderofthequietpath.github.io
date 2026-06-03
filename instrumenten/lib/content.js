/* ===========================================================================
   content.js — uitleg in gewone taal (NL). Warm, helder, beginnervriendelijk.
=========================================================================== */
(function () {
  const hdTypes = {
    'Generator': {
      pct: '~37% van de mensen',
      tagline: 'De bouwer met een motor die nooit leegloopt — zolang je het juiste werk doet.',
      plain: 'Jij hebt levensenergie te over. Als je doet waar je écht zin in hebt, lijkt je energie eindeloos. Doe je werk dat niet bij je past, dan raak je uitgeput en gefrustreerd. Jouw kompas is een lichamelijk “ja” of “nee” — een buikgevoel dat reageert op wat op je pad komt.',
      strategyWhy: 'Wachten om te reageren betekent: niet bedenken wat je wilt, maar opmerken waar je lijf “ja” op zegt. Het leven brengt je dingen; jij voelt wat klopt.',
    },
    'Manifesterende Generator': {
      pct: '~33% van de mensen',
      tagline: 'Snel, veelzijdig, ongeduldig met omwegen — je doet vaak drie dingen tegelijk.',
      plain: 'Jij combineert de motor van een Generator met de snelheid van een Manifestor. Je springt sneller dan anderen, slaat stappen over en hebt vaak meerdere passies tegelijk. Dat is geen gebrek aan focus — zo ben je ontworpen. Je leert door te dóen en bij te sturen.',
      strategyWhy: 'Reageer eerst op wat je aantrekt, en informeer dan de mensen om je heen voor je losgaat — dat voorkomt weerstand en bespaart je het terugdraaien van stappen.',
    },
    'Projector': {
      pct: '~20% van de mensen',
      tagline: 'De gids die mensen en systemen doorgrondt — gemaakt om te sturen, niet om te zwoegen.',
      plain: 'Jij ziet hoe anderen werken, vaak scherper dan zij zelf. Je hebt geen constante werkmotor; jouw kracht is inzicht, overzicht en de juiste mensen begeleiden. Wanneer je gezien en gevraagd wordt, bloei je. Dring je jezelf op, dan stuit je op weerstand en raak je verbitterd.',
      strategyWhy: 'Wachten op de uitnodiging klinkt passief, maar betekent: jouw gaven worden pas echt benut als ze herkend en gevraagd worden. Maak jezelf zichtbaar, en laat de juiste uitnodigingen naar je toe komen.',
    },
    'Manifestor': {
      pct: '~9% van de mensen',
      tagline: 'De initiator — jij zet dingen in gang die anderen daarna dragen.',
      plain: 'Jij bent hier om te beginnen. Ideeën, projecten, bewegingen — jij brengt ze tot leven zonder op toestemming te wachten. Je werkt in pieken, niet in een constante stroom. Vrijheid is je zuurstof; tegenwerking je grootste irritatie.',
      strategyWhy: 'Informeren vóór je handelt is geen toestemming vragen — het is de mensen om je heen meenemen, zodat je niet op onnodige weerstand stuit en vrij kunt blijven bewegen.',
    },
    'Reflector': {
      pct: '~1% van de mensen',
      tagline: 'De spiegel van de gemeenschap — zeldzaam, gevoelig, een barometer voor je omgeving.',
      plain: 'Jij hebt geen vaste innerlijke definitie; je proeft en weerspiegelt de energie om je heen. Daardoor voel je haarfijn aan of een plek of groep gezond is. Je bent geen vaste constante — je bent een wisselend, wijs spiegelbeeld. Je omgeving kiezen is voor jou het allerbelangrijkst.',
      strategyWhy: 'Wachten een maancyclus (≈28 dagen) bij grote beslissingen geeft je de tijd om een keuze van alle kanten te voelen, in plaats van mee te bewegen met de stemming van het moment.',
    },
  };

  const hdAuthority = {
    'Emotioneel': 'Jouw waarheid komt door de tijd, niet in het moment. Een “ja” voelt vandaag anders dan morgen. Slaap er een nacht (of langer) over — helderheid komt als de emotionele golf is gaan liggen. Er bestaat voor jou geen waarheid in het nu.',
    'Sacraal': 'Jouw lijf weet het meteen. Een spontane “uh-huh” (ja) of “uh-uh” (nee) uit je buik is betrouwbaarder dan elke gedachte. Vertrouw die directe lichamelijke respons — je hoofd praat hem vaak weg.',
    'Splenisch': 'Jouw weten is een stille, eenmalige flits van intuïtie — zacht, in het hier en nu. Het herhaalt zich niet en schreeuwt nooit. Leren luisteren naar die eerste, vluchtige hint is jouw levensles.',
    'Ego': 'Jij beslist vanuit je wil en je hart: wat wíl je écht, en heb je er de energie en het verlangen voor? Als je het hardop zegt, hoor je of je het meent. Beloof alleen wat je hart draagt.',
    'Zelf-geprojecteerd': 'Jouw waarheid zit in je stem. Praat erover — met iemand die alleen luistert — en hoor wat je zegt. Niet de inhoud, maar de klank van jouw eigen woorden wijst je de richting.',
    'Mentaal (klankbord)': 'Jij hebt geen innerlijke autoriteit; je helderheid ontstaat in gesprek. Praat met vertrouwde klankborden in de juiste omgeving. Zij beslissen niet voor jou — het uitspreken zelf brengt je antwoord naar boven.',
    'Lunair': 'Als Reflector neem je grote beslissingen niet snel. Laat een keuze een volle maancyclus rijpen en bespreek hem met verschillende mensen. Helderheid komt na de cyclus, niet ervoor.',
  };

  const hdProfileLines = {
    1: { name: 'De Onderzoeker', text: 'je hebt een stevig fundament nodig — eerst de basis snappen, dan pas zekerheid.' },
    2: { name: 'De Kluizenaar', text: 'je hebt tijd alleen nodig om je natuurlijke talent te laten rijpen; anderen roepen je eruit.' },
    3: { name: 'De Martelaar', text: 'je leert door vallen en opstaan — wat “mislukt” is voor jou waardevol onderzoek.' },
    4: { name: 'De Opportunist', text: 'jouw kansen komen via je netwerk; relaties en vriendschappen zijn je fundament.' },
    5: { name: 'De Ketter', text: 'mensen projecteren verwachtingen op je; je bent hier om praktische oplossingen te brengen.' },
    6: { name: 'Het Rolmodel', text: 'je leeft in drie fases en groeit naar een wijs, levend voorbeeld voor anderen.' },
  };

  const hdCenters = {
    head: 'inspiratie & mentale druk',
    ajna: 'denken & concepten',
    throat: 'communicatie & manifestatie',
    g: 'identiteit, liefde & richting',
    heart: 'wilskracht, ego & waarde',
    sacral: 'levenskracht & werk',
    solar: 'emoties & gevoeligheid',
    spleen: 'intuïtie, gezondheid & angst',
    root: 'druk, stress & drive',
  };

  // Numerologie — kerngetallen
  const numbers = {
    1: { title: 'De Pionier', essence: 'Leiderschap, onafhankelijkheid en initiatief. Je bent hier om je eigen weg te gaan en dingen te beginnen.', shadow: 'koppigheid, eenzaamheid, te veel ego.', gift: 'moed om als eerste te gaan.' },
    2: { title: 'De Verbinder', essence: 'Gevoeligheid, samenwerking en evenwicht. Je voelt anderen aan en brengt harmonie.', shadow: 'jezelf wegcijferen, besluiteloosheid.', gift: 'diplomatie en zachte kracht.' },
    3: { title: 'De Verteller', essence: 'Creativiteit, expressie en levensvreugde. Je brengt kleur, woorden en plezier.', shadow: 'oppervlakkigheid, verstrooidheid.', gift: 'mensen optillen met je uitstraling.' },
    4: { title: 'De Bouwer', essence: 'Structuur, betrouwbaarheid en hard werk. Je legt fundamenten die blijven staan.', shadow: 'rigiditeit, te streng voor jezelf.', gift: 'orde scheppen uit chaos.' },
    5: { title: 'De Avonturier', essence: 'Vrijheid, verandering en zintuiglijkheid. Je bent hier om te ervaren en te bewegen.', shadow: 'rusteloosheid, overdaad, vluchten.', gift: 'aanpassingsvermogen en vuur.' },
    6: { title: 'De Verzorger', essence: 'Verantwoordelijkheid, liefde en zorg. Je draagt voor familie, gemeenschap, schoonheid.', shadow: 'controle, jezelf verliezen in zorgen.', gift: 'warmte die anderen heelt.' },
    7: { title: 'De Zoeker', essence: 'Wijsheid, analyse en spiritualiteit. Je zoekt de waarheid achter de feiten en hebt stilte nodig.', shadow: 'afstandelijkheid, eenzaamheid, twijfel.', gift: 'diep inzicht waar anderen niet komen.' },
    8: { title: 'De Regisseur', essence: 'Kracht, ambitie en materiële meesterschap. Je bent hier om te leiden en te manifesteren.', shadow: 'machtsstrijd, werkverslaving.', gift: 'visie omzetten in resultaat.' },
    9: { title: 'De Humanist', essence: 'Mededogen, idealisme en afronding. Je draagt een breder geheel en laat los wat af is.', shadow: 'martelaarschap, niet kunnen loslaten.', gift: 'onbaatzuchtige liefde voor het geheel.' },
    11: { title: 'De Verlichter (meester)', essence: 'Een 2 op hoog voltage: intuïtie, inspiratie en spirituele gevoeligheid. Je bent een kanaal.', shadow: 'overprikkeling, angst, zelftwijfel.', gift: 'mensen inspireren door je enkele aanwezigheid.' },
    22: { title: 'De Meesterbouwer', essence: 'Een 4 op hoog voltage: grote dromen concreet máken in de wereld.', shadow: 'druk, overweldiging, zelfsabotage.', gift: 'het onmogelijke praktisch realiseren.' },
    33: { title: 'De Meesterleraar', essence: 'Een 6 op hoog voltage: onvoorwaardelijke liefde en heling in dienst van velen.', shadow: 'jezelf opofferen, te zwaar dragen.', gift: 'liefde die een gemeenschap draagt.' },
  };
  const numberPositions = {
    lifePath: 'Je Levenspad — de rode draad en de les van je hele leven.',
    expression: 'Je Uitdrukkingsgetal — je aangeboren talenten en hoe je je in de wereld zet.',
    soulUrge: 'Je Zielsdrang — wat je hart diep vanbinnen écht wil.',
    personality: 'Je Persoonlijkheidsgetal — hoe anderen je op het eerste gezicht ervaren.',
    birthday: 'Je Geboortedaggetal — een specifiek talent dat je meekreeg.',
  };

  // BaZi — vijf elementen & dagmeester
  const elements = {
    Hout: { traits: 'groei, visie, vriendelijkheid, doorzetten', plain: 'Hout groeit naar het licht: je bent gericht op vooruitgang, plannen en ontwikkeling. Sterk Hout is een boom (vastberaden), zacht Hout is een rank (flexibel, verbindend).' },
    Vuur: { traits: 'passie, expressie, warmte, zichtbaarheid', plain: 'Vuur straalt en verwarmt: je brengt energie, inspiratie en zichtbaarheid. Sterk Vuur is de zon (groots), zacht Vuur is een vlam (intiem, verfijnd).' },
    Aarde: { traits: 'stabiliteit, zorg, betrouwbaarheid, geduld', plain: 'Aarde draagt en voedt: je bent het stabiele midden waar anderen op steunen. Sterke Aarde is een berg (onwrikbaar), zachte Aarde is vruchtbare grond (verzorgend).' },
    Metaal: { traits: 'helderheid, principe, precisie, rechtvaardigheid', plain: 'Metaal snijdt en verfijnt: je houdt van helderheid, kwaliteit en rechtvaardigheid. Sterk Metaal is een zwaard (scherp), zacht Metaal is sieraad (elegant, waardevol).' },
    Water: { traits: 'wijsheid, intuïtie, beweging, aanpassing', plain: 'Water stroomt en doorgrondt: je bent intuïtief, diep en aanpasbaar. Sterk Water is een rivier (krachtig), zacht Water is dauw (subtiel, voedend).' },
  };

  function dayMasterText(stem) {
    const e = elements[stem.el];
    return `Jouw Dagmeester is ${stem.pol} ${stem.el} (${stem.cn} ${stem.py}) — de kern van wie je bent. ${e.plain}`;
  }

  // Astrologie — zonnetekens (kort)
  const signs = {
    Ram: 'Pionier en aanvoerder: direct, moedig, vol initiatief. Je gaat als eerste.',
    Stier: 'Aards en standvastig: geniet van het tastbare, bouwt traag maar zeker.',
    Tweelingen: 'Nieuwsgierig en beweeglijk: leeft van ideeën, woorden en verbinding.',
    Kreeft: 'Gevoelig en zorgzaam: thuis, familie en emotie staan centraal.',
    Leeuw: 'Warm en stralend: gemaakt om gezien te worden en hart te geven.',
    Maagd: 'Precies en dienstbaar: ziet detail, verbetert, zorgt met aandacht.',
    Weegschaal: 'Harmonieus en relationeel: zoekt schoonheid, balans en eerlijkheid.',
    Schorpioen: 'Diep en intens: gaat naar de bodem, transformeert, laat zich niet afschepen.',
    Boogschutter: 'Vrij en filosofisch: zoekt betekenis, verte en waarheid.',
    Steenbok: 'Ambitieus en gedisciplineerd: bouwt geduldig aan iets blijvends.',
    Waterman: 'Origineel en onafhankelijk: denkt vooruit, dient het collectief.',
    Vissen: 'Dromerig en meelevend: voelt alles, kunstzinnig, grenzeloos van hart.',
  };
  const elementAstro = {
    Vuur: 'spontaan, enthousiast, gedreven door inspiratie',
    Aarde: 'praktisch, betrouwbaar, gedreven door het tastbare',
    Lucht: 'mentaal, sociaal, gedreven door ideeën',
    Water: 'gevoelig, intuïtief, gedreven door emotie',
  };
  const modeAstro = {
    Hoofd: 'initiërend — je start dingen',
    Vast: 'volhardend — je houdt vol en verdiept',
    Beweeglijk: 'aanpasbaar — je beweegt en schakelt mee',
  };

  // Human Design kanalen — korte omschrijving per kanaal
  const hdChannels = {
    'Inspiratie':       'Creëren met impact. Je draagt een uniek creatief signaal dat anderen direct raakt.',
    'De Sleutel':       'De richtingwijzer van het lichaam. Andere types volgen jou onbewust naar het juiste leven.',
    'Mutatie':          'Verandering door structurele druk. Jij muteert waar anderen vasthouden.',
    'Logica':           'Patronen doorgronden en helder formuleren. Je brengt antwoorden die standhouden.',
    'Ritme':            'In harmonie leven met de universele cycli. Jij aanvaardt alle vormen van leven.',
    'Intimiteit':       'Seksuele en creatieve verbindingsenergie. Jij continueert het leven in al zijn vormen.',
    'Leiderschap':      'De stem van het collectief. Je leidt democratisch naar een betere toekomst.',
    'Concentratie':     'Stilte en diepe focus op detail. Jij ziet wat anderen missen door geduldig te observeren.',
    'Ontwaken':         'Bewust leven in het nu. Zelfliefde die zich uitdrukt als authentieke aanwezigheid.',
    'Verkenning':       'Krachtig handelen vanuit diepste overtuigingen. Jij toont de weg door het te leven.',
    'Volmaakte Vorm':   'Intuïtief weten hoe je jezelf in stand houdt. Je overleeft en bloeit met zachte precisie.',
    'Nieuwsgierigheid': 'Ideeën omzetten in inspirerende verhalen. Jij deelt kennis op een manier die blijft hangen.',
    'Openheid':         'Emotioneel spreken op het juiste moment. Wanneer de tijd klopt, breng je iets moois.',
    'De Verkwister':    'Luisteren en herinneren. Jij draagt verhalen en geheimen — de keeper van het verleden.',
    'Het Talent':       'Enthousiaste bekwaamheid. Aangeboren diepte wordt expressie zodra je het deelt.',
    'Aanvaarding':      'Meningen organiseren in bruikbare woorden. Jij maakt het abstracte concreet en deelbaar.',
    'Oordeel':          'Verbeteren door scherpe kritiek. Jij corrigeert het systeem zodat het beter functioneert.',
    'Synthese':         'Behoefte en revolutie verbinden. Jij brengt nieuwe sociale principes voor de gemeenschap.',
    'Charisma':         'Kracht die spreekt in het moment. Jij handelt nu, met zichtbaar en aanstekelijk momentum.',
    'De Hersengolf':    'Zachte intuïtie die resoneren. Jij spreekt op het juiste moment — het wordt gehoord.',
    'Geld':             'Controle over gemeenschappelijke middelen. Jij beheert bronnen voor de gemeenschap.',
    'Structureren':     'Het vreemde vertalen naar het begrijpelijke. Jij geeft vorm aan inzichten die anders verloren gaan.',
    'Bewustzijn':       'Rationele processen die leiden tot ware kennis. Jij verbindt logica met universeel begrip.',
    'Initiatie':        'De spirituele strijder. Jij doorstaat initiatieprocessen en wekt geloof bij anderen.',
    'Overgave':         'Geheugen en handelstactieken doorgeven. Jij verkoopt het verleden als waardevolle les.',
    'Behoud':           'Voedende verantwoordelijkheid. Jij zorgt voor anderen en voor de continuïteit van de gemeenschap.',
    'De Worsteling':    'De strijd voor zingeving. Jij zet door ondanks weerstand — obstakels zijn jouw brandstof.',
    'Ontdekking':       'Volledig ja zeggen aan het leven. Jij springt in het diepe en ontdekt wat anderen mislopen.',
    'Herkenning':       'Dromen en ervaringen bundelen. Emotionele kracht om nieuwe cycli te beginnen.',
    'Transformatie':    'Ambitie omzetten over de tijd. Jij transformeert de drang naar verbetering in blijvende groei.',
    'Kracht':           'Machtige intuïtieve kracht in het nu. Jij weet instinctief wanneer en hoe je handelt.',
    'Vergankelijkheid': 'Crisis en diepgaande ervaring. Jij groeit door emotionele intensiteit — niet ondanks haar.',
    'Gemeenschap':      'Familie en werk verbinden door afspraken. Jij bouwt gemeenschap via wederzijdse inzet.',
    'Emoties':          'Emotionele vrijmaking door provocatie. Jij bevrijd de geest van beperkende patronen.',
    'Volwassenwording': 'Cyclisch groeien door voltooiing. Jij realiseert groei door processen tot het einde te dragen.',
    'Abstractie':       'Verleden verwerken tot universeel begrip. Jij synthetiseert wat anderen niet kunnen verbinden.',
  };

  // BaZi gelukspilaar-interpretaties per stam (10 hemelse stammen)
  // Gebruikt in de premium luck cycle weergave
  const luckStemInterpretations = {
    '甲': { title: 'Yang Hout — De jonge boom', body: 'Een periode van groei, expansie en nieuwe beginnen. Je stuwt omhoog met vastberadenheid. Ideaal voor het starten van projecten, het opbouwen van identiteit en het uitbreiden van je invloedssfeer. Gevaar: te snel groeien zonder wortels.' },
    '乙': { title: 'Yin Hout — De ranke', body: 'Een periode van flexibele groei en subtiele verbinding. Je vindt je weg om obstakels heen in plaats van erdoorheen te breken. Relaties en samenwerking bloeien. Ideaal voor netwerken, creatieve projecten en emotionele verdieping.' },
    '丙': { title: 'Yang Vuur — De zon', body: 'Een periode van zichtbaarheid, uitstraling en expansie. Je staat in het middelpunt en trekt anderen aan. Ideaal voor leiderschap, publiciteit en grote stappen. Gevaar: overkill en uitputting door te veel geven.' },
    '丁': { title: 'Yin Vuur — De vlam', body: 'Een periode van verfijning, intimiteit en diep inzicht. Zoals kaarslicht: niet alles verlichting, maar het juiste moment helder. Ideaal voor creatieve expressie, spirituele groei en diepgaande relaties.' },
    '戊': { title: 'Yang Aarde — De berg', body: 'Een periode van stabiliteit, consolidatie en betrouwbaarheid. Je bouwt fundamenten die blijven. Ideaal voor vastgoed, carrière-opbouw en langetermijnprojecten. Gevaar: te rigide worden en kansen missen door overvoorzichtigheid.' },
    '己': { title: 'Yin Aarde — Vruchtbare grond', body: 'Een periode van voeden, zorg en subtiele invloed. Zoals rijke bodem: niet spectaculair, maar alles groeit wat je plant. Ideaal voor gezin, zorg voor anderen, en het rijpen van ideeën die eerder gezaaid zijn.' },
    '庚': { title: 'Yang Metaal — Het zwaard', body: 'Een periode van precisie, herstructurering en duidelijke keuzes. Je snijdt weg wat niet meer dient. Ideaal voor reorganisaties, zakelijke doorbraken en het stellen van grenzen. Kan scherp aanvoelen, maar leidt tot helderheid.' },
    '辛': { title: 'Yin Metaal — Het sieraad', body: 'Een periode van verfijning, esthetiek en waarde-erkenning. Zoals edelmetaal: zeldzaam en precies. Ideaal voor artistieke projecten, financiële groei en het polijsten van je reputatie.' },
    '壬': { title: 'Yang Water — De rivier', body: 'Een periode van beweging, wijsheid en onweerstaanbare stroom. Je passeert obstakels door ze te omarmen. Ideaal voor reizen, filosofisch denken, spirituele verdieping en grote levensveranderingen.' },
    '癸': { title: 'Yin Water — Dauw en regen', body: 'Een periode van intuïtie, innerlijke stem en subtiele voeding. Zoals regen: onzichtbaar werkzaam, maar alles voedt het. Ideaal voor reflectie, healing, artistieke inspiratie en het luisteren naar wat je binnenste zegt.' },
  };

  // Astrologische aspect-betekenissen (planeet1 + aspect + planeet2)
  const aspectMeanings = {
    'Conjunctie': 'De twee planetaire krachten versmelten tot één krachtig thema. Ze versterken elkaar — of botsen, afhankelijk van de planeten. Bijzonder intens en bepalend voor je karakter.',
    'Trigoon':    'Een vloeiende, harmonische verbinding tussen twee krachten. Talenten komen hier moeiteloos naar boven. Dit aspect geeft aangeboren gaven — let op: soms zo vanzelfsprekend dat je ze niet bewust benut.',
    'Sextiel':    'Een zachte, gunstige wisselwerking. Kansen die zich aandienen als je bewust handelt. Dit aspect vraagt iets meer initiatief dan een trigoon, maar geeft wel duurzamere resultaten.',
    'Oppositie':  'Een spanning tussen twee tegenovergestelde krachten. Vaak voelbaar in relaties: je trekt mensen aan die belichamen wat je zelf nog integreert. De uitdaging is beide polen te omarmen in plaats van te kiezen.',
    'Vierkant':   'Wrijving en spanning die tot actie aanzet. Dit aspect dwingt je te groeien — niet altijd comfortabel, maar vaak de motor achter je grootste prestaties. Onopgeloste vierkanten herhalen zich als terugkerende obstakels.',
  };

  // Planeet-betekenissen voor aspect-interpretaties
  const planetMeanings = {
    sun:      'je kern en vitaliteit', moon:    'je gevoelsleven en onderbewuste',
    mercury:  'je denken en communicatie', venus: 'je liefde en waarden',
    mars:     'je daadkracht en verlangens', jupiter: 'je groei en geluk',
    saturn:   'je discipline en begrenzingen', uranus: 'je originaliteit en doorbraken',
    neptune:  'je intuïtie en spiritualiteit', pluto: 'je transformatie en diepste drijfveren',
  };

  // HD open centra conditionering — wat je opneemt van anderen
  const hdOpenCenters = {
    head:   { title: 'Open Hoofd', body: 'Je wordt geconditioneerd door de mentale druk van anderen — hun vragen, twijfels en inspiraties voelen als de jouwe. Je valkuil: je hoofd vol houden met problemen die jou niet toebehoren. Je wijsheid: je herkent mentale druk van buitenaf beter dan wie dan ook.' },
    ajna:   { title: 'Open Ajna', body: 'Je denken is flexibel en meervoudig — je kunt overal een mening over hebben, maar geen mening hoeft vast te zijn. Je valkuil: anderen overtuigen dat je zeker bent, terwijl je dat niet bent. Je wijsheid: open geest die meerdere perspectieven tegelijk omarmt.' },
    throat: { title: 'Open Keel', body: 'Je stem is variabel — soms sterk, soms stil. Je valkuil: spreken om aandacht te trekken, of jezelf forceren te manifesteren. Je wijsheid: wanneer je spreekt vanuit innerlijke impuls (niet vanuit druk), resoneer je krachtiger dan gedefinieerde kelen.' },
    g:      { title: 'Open G-centrum', body: 'Je identiteit en richting zijn niet vast — ze worden beïnvloed door de omgeving. Je valkuil: jezelf verliezen in anderen of omgevingen. Je wijsheid: je bent een barometer voor de liefde en richting in een ruimte. De juiste omgeving kiezen is cruciaal.' },
    heart:  { title: 'Open Wil', body: 'Je wilskracht is niet constant beschikbaar — je kunt het niet "oproepen" wanneer nodig. Je valkuil: beloften maken die je niet kunt nakomen, of je waarde bewijzen. Je wijsheid: je weet beter dan wie ook hoe uitputtend het is om continu te presteren zonder motivatie.' },
    sacral: { title: 'Open Sacraal', body: 'Je levenskracht-energie is niet consistent — je absorbeert de sacrale energie van Generators en raakt daardoor overkonditioneerd. Je valkuil: doorgaan lang nadat je uitgeput bent. Je wijsheid: weten wanneer genoeg genoeg is, voor jou én voor anderen.' },
    solar:  { title: 'Open Zonnevlecht', body: 'Je emoties zijn gevoelig voor de emoties van anderen — je voelt hun emotionele golven als de jouwe. Je valkuil: conflicten vermijden om de vrede te bewaren, of meegaan in andermans emotionele drama. Je wijsheid: emotionele wijsheid door alles te hebben gevoeld wat er te voelen valt.' },
    spleen: { title: 'Open Milt', body: 'Je hebt geen constante intuïtieve stem — je valkuil is vasthouden aan dingen (relaties, gewoontes, werk) die niet meer goed voor je zijn, uit angst. Je wijsheid: je leert van iedereen hoe ze hun welzijn bewaken, en wordt daarin uiterst wijs.' },
    root:   { title: 'Open Wortel', body: 'Je ervaart druk en stress van anderen als jouw eigen urgentie. Je valkuil: altijd in rush modus zijn om de druk weg te werken. Je wijsheid: je herkent wanneer mensen handelen vanuit stress versus vanuit keuze — en leert daarin innerlijke vrijheid.' },
  };

  window.QP = window.QP || {};
  window.QP.content = {
    hdTypes, hdAuthority, hdProfileLines, hdCenters,
    numbers, numberPositions, elements, dayMasterText,
    signs, elementAstro, modeAstro, hdChannels,
    luckStemInterpretations, aspectMeanings, planetMeanings, hdOpenCenters,
  };
})();
