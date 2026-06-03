/* ===========================================================================
   convergence.js — multi-dimensionele convergentie-analyse.
   Vijf systemen, vijf dimensies. Waar ze samenvallen, staat de waarheid.
=========================================================================== */
(function () {

  /* ── Dimensies ─────────────────────────────────────────────────────────── */
  const DIMS = ['kern', 'energie', 'beslissen', 'relaties', 'bestemming'];

  const DIM_LABELS = {
    kern:       'Wie je bent',
    energie:    'Hoe je werkt',
    beslissen:  'Hoe je beslist',
    relaties:   'Wat je verbindt',
    bestemming: 'Waarom je hier bent',
  };

  /* ── Thema-mapping per systeem ─────────────────────────────────────────── */

  function hdThemes(hd) {
    const t = {};
    // Kern
    t.kern = {
      'Generator':              'jij bent levenskracht — reageren op wat klopt',
      'Manifesterende Generator':'jij bent levenskracht én snelheid — springen en bijsturen',
      'Projector':              'jij bent waarnemer — systemen en mensen doorzien',
      'Manifestor':             'jij bent initiator — beweging in gang zetten',
      'Reflector':              'jij bent spiegel — de omgeving weerspiegelen',
    }[hd.type] || null;

    // Energie
    t.energie = hd.definition === 'Enkel gedefinieerd'
      ? 'stabiele, consistente energie — zelfstandig'
      : hd.definition === 'Dubbel gedefinieerd'
        ? 'stabiele energie — externe verbinding nodig'
        : 'variabele energie — omgeving bepaalt het ritme';

    // Beslissen
    const authMap = {
      'Emotioneel':   'tijd nemen — gevoel over meerdere golven volgen',
      'Sacraal':      'onmiddellijk lichamelijk "ja" of "nee"',
      'Splenisch':    'stille intuïtieve flits in het moment',
      'Ego':          'wilskracht en wat jij werkelijk wilt',
      'Zelf-geprojecteerd': 'hardop spreken om je eigen waarheid te horen',
      'Mentaal':      'klankborden — externe omgeving als spiegel gebruiken',
      'Maanautoriteit': '28 dagen wachten op het maanritme',
    };
    t.beslissen = authMap[hd.authority] || null;

    // Relaties
    t.relaties = {
      'Emotioneel': 'diepte en intimiteit — maar tijd nodig voor duidelijkheid',
      'Sacraal':    'loyaliteit en aanwezigheid — jij geeft energie als het klopt',
      'Splenisch':  'spontaan en beschermend — anderen voelen jouw warmte direct',
    }[hd.authority] || 'selectief verbinden — wacht op de juiste uitnodiging';

    // Bestemming (profiel)
    const profileDest = {
      '1/3': 'fundering leggen door ervaring en fouten',
      '1/4': 'kennis verankeren en verspreiden via netwerk',
      '2/4': 'gaven delen die anderen in jou zien — via relaties',
      '2/5': 'universele oplossingen brengen voor anderen',
      '3/5': 'wijsheid door vallen en opstaan — praktische gids',
      '3/6': 'van experimenteren naar voorbeeld worden',
      '4/6': 'vertrouwen opbouwen en rolmodel zijn',
      '4/1': 'stevige fundering en invloedrijk netwerk',
      '5/1': 'praktische redder — anderen oplossen',
      '5/2': 'universeel toepasbaar zijn — gevonden worden',
      '6/2': 'van experiment naar levend voorbeeld',
      '6/3': 'rolmodel worden na bewust te hebben geleefd',
    };
    t.bestemming = profileDest[hd.profile] || `profiel ${hd.profile} — uniek levenspad`;

    return t;
  }

  function baziThemes(bazi) {
    const t = {};
    const el = bazi.dayMaster?.el || bazi.strongest?.el;
    const pol = bazi.dayMaster?.pol;

    const elKern = {
      Hout:   pol === 'Yang' ? 'doelgericht groeien — pionier en visionair' : 'buigzaam groeien — aanpassen en verbinden',
      Vuur:   pol === 'Yang' ? 'uitstralen en leiden — warmte en richting geven' : 'verfijnen en inspireren — subtiel aansteken',
      Aarde:  pol === 'Yang' ? 'stabiel fundament zijn — betrouwbaar en standvastig' : 'voeden en verzorgen — aarde die draagt',
      Metaal: pol === 'Yang' ? 'helder en rechtlijnig — principes boven compromis' : 'verfijnde scherpte — precisie en elegantie',
      Water:  pol === 'Yang' ? 'diepte en beweging — weten en stromen' : 'stille wijsheid — voelen en absorberen',
    };
    t.kern = elKern[el] || null;

    const elEnergie = {
      Hout: 'groeit in pieken — springt vooruit, heeft rust nodig',
      Vuur: 'intensief aanwezig — hoog gevolgd door rust',
      Aarde: 'langzaam en steady — marathonloper, geen sprinter',
      Metaal: 'geconcentreerd en nauwkeurig — kwaliteit boven kwantiteit',
      Water: 'eb en vloed — diep werken, dan opladen in stilte',
    };
    t.energie = elEnergie[el] || null;

    const elBeslissen = {
      Hout: 'intuïtief vooruit — ziet de richting en gaat',
      Vuur: 'vanuit passie en helderheid in het moment',
      Aarde: 'grondig en langzaam — overweegt alle kanten',
      Metaal: 'analytisch en principegedreven — zwart of wit',
      Water: 'vanuit diepe kennis en gevoel — flows naar helderheid',
    };
    t.beslissen = elBeslissen[el] || null;

    const elRelaties = {
      Hout: 'loyaal en groeiend — inspireert anderen om beter te worden',
      Vuur: 'warm en magnetisch — anderen koesteren zich in jouw aanwezigheid',
      Aarde: 'stabiel en trouw — de rots waarop anderen bouwen',
      Metaal: 'eerlijk en diep — weinig maar intense verbindingen',
      Water: 'empathisch en begrijpend — mensen voelen zich gezien',
    };
    t.relaties = elRelaties[el] || null;

    // Huidige gelukspilaar als bestemming-context
    if (bazi.luckCycles?.cycles) {
      const now = new Date().getFullYear();
      const cur = bazi.luckCycles.cycles.find(c => {
        const [s, e] = (c.yearRange || '').split('–').map(Number);
        return now >= s && now <= e;
      });
      if (cur) {
        t.bestemming = `nu in ${cur.pillar.stem.pol} ${cur.pillar.stem.el}-periode (${cur.yearRange}) — ${cur.pillar.branch.an}-jaar`;
      }
    }

    return t;
  }

  function astrologyThemes(astro) {
    const t = {};
    const sun  = astro.sun?.sign;
    const moon = astro.moon?.sign;
    const asc  = astro.ascendant?.sign;

    const elKern = {
      Vuur: 'zichtbaar zijn en leiden — enthousiasme als brandstof',
      Aarde: 'bouwen en belichamen — het tastbare scheppen',
      Lucht: 'verbinden en denken — ideeën als levensadem',
      Water: 'voelen en begrijpen — diepte als thuis',
    };
    if (sun?.element) t.kern = elKern[sun.element] || null;

    const moonNeed = {
      Vuur: 'aanmoediging en beweging',
      Aarde: 'rust, structuur en veiligheid',
      Lucht: 'gesprek en mentale stimulatie',
      Water: 'emotionele diepte en begrip',
    };
    if (moon?.element) t.relaties = `emotioneel heeft ${sun?.name || 'jij'} behoefte aan ${moonNeed[moon.element] || 'verbinding'}`;

    if (asc?.name) t.energie = `naar buiten toe: ${asc.name}-energie — de eerste indruk die jij achterlaat`;

    if (sun?.name) t.bestemming = `zonne-energie in ${sun.name} — kernidentiteit en levensthema`;

    return t;
  }

  function numerologyThemes(num) {
    const t = {};
    const lp = num.lifePath;

    const lpKern = {
      1: 'onafhankelijk en pionierend — jij baant nieuwe wegen',
      2: 'verbindend en diplomatisch — jij brengt harmonie',
      3: 'creatief en expressief — jij deelt schoonheid en vreugde',
      4: 'structurerend en betrouwbaar — jij legt funderingen',
      5: 'vrij en avontuurlijk — jij ervaart en leert door verandering',
      6: 'zorgend en harmonieuze — jij heelt en verbindt families',
      7: 'zoekend en analytisch — jij ontdekt de diepere waarheid',
      8: 'krachtig en ambitieus — jij bouwt iets blijvends',
      9: 'wijs en universeel — jij draagt een grotere missie',
      11: 'intuïtief en inspirerend — jij verlicht anderen',
      22: 'visionair en uitvoerend — jij bouwt op grote schaal',
      33: 'liefdevol en helend — jij bent meesterleraar',
    };
    t.kern = lpKern[lp] || null;

    const lpBeslissen = {
      1: 'zelfstandig en snel — vertrouw je eigen oordeel',
      2: 'na overleg — andermans perspectief weegt mee',
      3: 'vanuit inspiratie — gevoel en creativiteit leiden',
      4: 'methodisch en doorwrocht — stap voor stap',
      5: 'spontaan en flexibel — rigiditeit is je vijand',
      6: 'vanuit verantwoordelijkheid — wat is goed voor allen?',
      7: 'na diepe analyse en alleen-zijn — integratie duurt',
      8: 'daadkrachtig en strategisch — kansen zien en grijpen',
      9: 'vanuit het grotere geheel — wat dient de mensheid?',
    };
    t.beslissen = lpBeslissen[lp] || null;

    t.bestemming = lpKern[lp] || null;

    const soul = num.soulUrge;
    const soulRelaties = {
      2: 'diepe behoefte aan verbinding en partnerschap',
      6: 'liefde en zorgen zijn jouw zuurstof in relaties',
      9: 'universele liefde — jij geeft onvoorwaardelijk',
    };
    if (soul && soulRelaties[soul]) t.relaties = soulRelaties[soul];

    return t;
  }

  /* ── Kern-analyse: waar komen systemen samen? ──────────────────────────── */
  function analyze(results) {
    const contributions = {};
    const systemNames   = [];

    if (results.humandesign) {
      contributions.humandesign = { name: 'Human Design', themes: hdThemes(results.humandesign) };
      systemNames.push('Human Design');
    }
    if (results.bazi) {
      contributions.bazi = { name: 'BaZi', themes: baziThemes(results.bazi) };
      systemNames.push('BaZi');
    }
    if (results.saju && !results.bazi) {
      contributions.saju = { name: 'Saju', themes: baziThemes(results.saju) };
      systemNames.push('Saju');
    }
    if (results.astrology) {
      contributions.astrology = { name: 'Astrologie', themes: astrologyThemes(results.astrology) };
      systemNames.push('Astrologie');
    }
    if (results.numerology) {
      contributions.numerology = { name: 'Numerologie', themes: numerologyThemes(results.numerology) };
      systemNames.push('Numerologie');
    }

    const systems = Object.values(contributions);

    // Per dimensie: verzamel alle bijdragen
    const dimensions = DIMS.map(dim => {
      const entries = systems
        .map(s => ({ system: s.name, text: s.themes[dim] }))
        .filter(e => e.text);

      // Zoek overlappende woorden/concepten als convergentie-indicator
      const wordSets = entries.map(e =>
        new Set(e.text.toLowerCase().replace(/[—·]/g, ' ').split(/[\s,]+/).filter(w => w.length > 4))
      );
      let overlap = 0;
      if (wordSets.length >= 2) {
        const base = wordSets[0];
        wordSets.slice(1).forEach(set => {
          set.forEach(w => { if (base.has(w)) overlap++; });
        });
      }

      return {
        id: dim,
        label: DIM_LABELS[dim],
        entries,
        strength: entries.length, // hoeveel systemen iets zeggen
        overlap,
        converges: entries.length >= 2 && overlap > 0,
      };
    });

    // Sterkste convergentie dimensie
    const strongest = [...dimensions].sort((a, b) => (b.overlap + b.strength) - (a.overlap + a.strength))[0];

    return {
      systemCount: systems.length,
      systemNames,
      dimensions,
      strongest,
      hasConvergence: dimensions.some(d => d.converges),
    };
  }

  /* ── Teaser (bestaande functie, uitgebreid) ────────────────────────────── */
  function teaser(results) {
    const full = analyze(results);

    // Bouw gedeelde woorden voor achterwaartse compatibiliteit
    const wordMap = {};
    full.dimensions.forEach(dim => {
      dim.entries.forEach(({ system, text }) => {
        text.toLowerCase().split(/[\s,&—·]+/).filter(w => w.length > 4).forEach(w => {
          wordMap[w] = wordMap[w] || new Set();
          wordMap[w].add(system);
        });
      });
    });
    const shared = Object.entries(wordMap)
      .map(([w, set]) => ({ word: w, systems: Array.from(set) }))
      .filter(x => x.systems.length >= 2)
      .sort((a, b) => b.systems.length - a.systems.length)
      .slice(0, 3);

    return {
      count: full.systemCount,
      systems: full.systemNames,
      shared,
      hasOverlap: shared.length > 0,
      analysis: full,
    };
  }

  window.QP = window.QP || {};
  window.QP.convergence = { teaser, analyze, DIMS, DIM_LABELS };
})();
