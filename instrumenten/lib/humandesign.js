/* ===========================================================================
   humandesign.js — type, strategie, autoriteit, profiel, incarnatiekruis en
   de bodygraph-definitie, op basis van een echte efemeride (Astronomy Engine).
=========================================================================== */
(function () {
  const { astro, hdData } = window.QP;
  const { GATE_CENTER, CHANNELS, GATE_WHEEL, WHEEL_ANCHOR, MOTORS } = hdData;
  const GATE_SIZE = 360 / 64;   // 5.625°
  const LINE_SIZE = GATE_SIZE / 6;

  function gateAndLine(longitude) {
    const off = astro.norm360(longitude - WHEEL_ANCHOR);
    const idx = Math.floor(off / GATE_SIZE) % 64;
    const gate = GATE_WHEEL[idx];
    const within = off - idx * GATE_SIZE;
    const line = Math.min(6, Math.floor(within / LINE_SIZE) + 1);
    return { gate, line };
  }

  // 13 activeringen per moment
  const PLANET_ORDER = ['sun', 'earth', 'moon', 'north_node', 'south_node',
    'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  const PLANET_GLYPH = {
    sun: '☉', earth: '⊕', moon: '☽', north_node: '☊', south_node: '☋',
    mercury: '☿', venus: '♀', mars: '♂', jupiter: '♃', saturn: '♄',
    uranus: '♅', neptune: '♆', pluto: '♇',
  };
  const PLANET_NL = {
    sun: 'Zon', earth: 'Aarde', moon: 'Maan',
    north_node: 'Noordknoop', south_node: 'Zuidknoop', mercury: 'Mercurius',
    venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturnus',
    uranus: 'Uranus', neptune: 'Neptunus', pluto: 'Pluto',
  };
  const BODY = { sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus',
    mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus',
    neptune: 'Neptune', pluto: 'Pluto' };

  function activationsAt(date) {
    const sun = astro.sunLon(date);
    const node = astro.nodeLon(date);
    const lon = {
      sun, earth: astro.norm360(sun + 180),
      moon: astro.lonOf('Moon', date),
      north_node: node, south_node: astro.norm360(node + 180),
    };
    ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']
      .forEach((p) => { lon[p] = astro.lonOf(BODY[p], date); });
    const out = {};
    PLANET_ORDER.forEach((p) => (out[p] = { ...gateAndLine(lon[p]), lon: lon[p] }));
    return out;
  }

  function definedCentersAndChannels(activeGates) {
    const set = new Set(activeGates);
    const channels = [], centers = new Set();
    CHANNELS.forEach(([a, b, name]) => {
      if (set.has(a) && set.has(b)) {
        channels.push({ a, b, name, centers: [GATE_CENTER[a], GATE_CENTER[b]] });
        centers.add(GATE_CENTER[a]); centers.add(GATE_CENTER[b]);
      }
    });
    return { centers, channels };
  }

  function connectedToThroat(centers, channels, fromCenters) {
    if (!centers.has('throat')) return false;
    const adj = {};
    channels.forEach(({ centers: [x, y] }) => {
      (adj[x] = adj[x] || []).push(y); (adj[y] = adj[y] || []).push(x);
    });
    const seen = new Set(); const stack = ['throat'];
    while (stack.length) {
      const n = stack.pop();
      if (seen.has(n)) continue;
      seen.add(n); (adj[n] || []).forEach((m) => stack.push(m));
    }
    return fromCenters.some((m) => seen.has(m));
  }

  function deriveType(centers, channels) {
    if (centers.size === 0) return 'Reflector';
    const motorToThroat = connectedToThroat(centers, channels, MOTORS.filter((m) => m !== 'sacral'));
    const sacralToThroat = connectedToThroat(centers, channels, ['sacral']);
    if (centers.has('sacral')) return (motorToThroat || sacralToThroat) ? 'Manifesterende Generator' : 'Generator';
    if (centers.has('throat') && motorToThroat) return 'Manifestor';
    return 'Projector';
  }

  function deriveAuthority(centers, type) {
    if (type === 'Reflector') return 'Lunair';
    if (centers.has('solar')) return 'Emotioneel';
    if (centers.has('sacral')) return 'Sacraal';
    if (centers.has('spleen')) return 'Splenisch';
    if (centers.has('heart')) return 'Ego';
    if (centers.has('g')) return 'Zelf-geprojecteerd';
    return 'Mentaal (klankbord)';
  }

  const STRATEGY = {
    'Generator': 'Wachten om te reageren',
    'Manifesterende Generator': 'Reageren, dan informeren',
    'Manifestor': 'Informeren vóór je handelt',
    'Projector': 'Wachten op de uitnodiging',
    'Reflector': 'Wachten een volledige maancyclus',
  };
  const SIGNATURE = { 'Generator': 'Voldoening', 'Manifesterende Generator': 'Voldoening', 'Manifestor': 'Vrede', 'Projector': 'Succes', 'Reflector': 'Verrassing' };
  const NOT_SELF = { 'Generator': 'Frustratie', 'Manifesterende Generator': 'Frustratie & woede', 'Manifestor': 'Woede', 'Projector': 'Bitterheid', 'Reflector': 'Teleurstelling' };

  function definitionType(centers, channels) {
    if (centers.size === 0) return 'Geen (Reflector)';
    const adj = {}; centers.forEach((c) => (adj[c] = []));
    channels.forEach(({ centers: [x, y] }) => { adj[x].push(y); adj[y].push(x); });
    const seen = new Set(); let groups = 0;
    centers.forEach((c) => {
      if (seen.has(c)) return; groups++;
      const st = [c];
      while (st.length) { const n = st.pop(); if (seen.has(n)) continue; seen.add(n); (adj[n] || []).forEach((m) => st.push(m)); }
    });
    return ['Geen', 'Enkelvoudig', 'Tweevoudig gesplitst', 'Drievoudig gesplitst', 'Viervoudig gesplitst'][groups] || `${groups}-voudig`;
  }

  function compute(birth) {
    const birthDate = astro.makeUTCDate(birth);
    const birthSun = astro.sunLon(birthDate);
    const designDate = astro.solveDesign(birthDate, birthSun);

    const personality = activationsAt(birthDate);
    const design = activationsAt(designDate);

    const activeGates = [];
    PLANET_ORDER.forEach((p) => activeGates.push(personality[p].gate, design[p].gate));

    const { centers, channels } = definedCentersAndChannels(activeGates);
    const type = deriveType(centers, channels);
    const authority = deriveAuthority(centers, type);
    const profile = `${personality.sun.line}/${design.sun.line}`;
    const cross = {
      pSun: personality.sun.gate, pEarth: personality.earth.gate,
      dSun: design.sun.gate, dEarth: design.earth.gate,
    };

    return {
      type, strategy: STRATEGY[type], authority, profile,
      signature: SIGNATURE[type], notSelf: NOT_SELF[type],
      definition: definitionType(centers, channels), cross,
      centers: Array.from(centers), channels,
      activeGates: Array.from(new Set(activeGates)),
      personality, design,
      planetOrder: PLANET_ORDER, planetGlyph: PLANET_GLYPH, planetNL: PLANET_NL,
      exactTime: !!birth.hasExactTime,
    };
  }

  window.QP.humandesign = { compute, gateAndLine };
})();
