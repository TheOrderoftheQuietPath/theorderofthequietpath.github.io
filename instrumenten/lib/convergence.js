/* ===========================================================================
   convergence.js — premium-haak: waar wijzen de gedraaide systemen naar
   hetzelfde patroon? Heuristisch; dient als teaser voor de volledige
   (betaalde) synthese-reading.
=========================================================================== */
(function () {
  // map systemen -> thematische tags
  function tagsFor(results) {
    const tags = [];

    if (results.humandesign) {
      const hd = results.humandesign;
      const typeTheme = {
        'Projector': 'observatie & overzicht',
        'Reflector': 'gevoeligheid & spiegelen',
        'Generator': 'levenskracht & werk',
        'Manifesterende Generator': 'levenskracht & tempo',
        'Manifestor': 'initiatief & vrijheid',
      }[hd.type];
      if (typeTheme) tags.push({ system: 'Human Design', tag: typeTheme });
      if (hd.authority === 'Emotioneel') tags.push({ system: 'Human Design', tag: 'timing & gevoel' });
      if (hd.authority === 'Splenisch') tags.push({ system: 'Human Design', tag: 'intuïtie' });
    }

    const elTheme = (el) => ({
      Hout: 'groei & richting', Vuur: 'passie & zichtbaarheid',
      Aarde: 'stabiliteit & zorg', Metaal: 'helderheid & principe',
      Water: 'intuïtie & diepte',
    }[el]);

    if (results.bazi) tags.push({ system: 'BaZi', tag: elTheme(results.bazi.strongest.el) });
    if (results.saju) tags.push({ system: 'Saju', tag: elTheme(results.saju.strongest.el) });

    if (results.astrology) {
      const map = { Vuur: 'passie & zichtbaarheid', Aarde: 'stabiliteit & zorg', Lucht: 'ideeën & verbinding', Water: 'intuïtie & diepte' };
      tags.push({ system: 'Astrologie', tag: map[results.astrology.sun.sign.element] });
    }

    if (results.numerology) {
      const n = results.numerology.lifePath;
      const m = {
        1: 'initiatief & vrijheid', 2: 'verbinding & gevoel', 3: 'expressie & zichtbaarheid',
        4: 'stabiliteit & structuur', 5: 'verandering & vrijheid', 6: 'zorg & verantwoordelijkheid',
        7: 'intuïtie & diepte', 8: 'kracht & richting', 9: 'mededogen & afronding',
        11: 'intuïtie & inspiratie', 22: 'stabiliteit & bouwen', 33: 'zorg & liefde',
      }[n];
      if (m) tags.push({ system: 'Numerologie', tag: m });
    }

    return tags;
  }

  // vind woorden die in meerdere systemen terugkeren
  function teaser(results) {
    const tags = tagsFor(results);
    const systems = Object.keys(results).filter((k) => results[k]);
    const words = {};
    tags.forEach(({ system, tag }) => {
      if (!tag) return;
      tag.split(' & ').forEach((w) => {
        words[w] = words[w] || new Set();
        words[w].add(system);
      });
    });
    const shared = Object.entries(words)
      .map(([w, set]) => ({ word: w, systems: Array.from(set) }))
      .filter((x) => x.systems.length >= 2)
      .sort((a, b) => b.systems.length - a.systems.length);

    return {
      count: systems.length,
      systems,
      shared: shared.slice(0, 3),
      hasOverlap: shared.length > 0,
    };
  }

  window.QP = window.QP || {};
  window.QP.convergence = { teaser, tagsFor };
})();
