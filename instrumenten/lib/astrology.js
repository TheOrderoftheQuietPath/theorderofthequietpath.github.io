/* ===========================================================================
   astrology.js — westerse geboortehoroscoop op basis van een echte efemeride
   (Astronomy Engine). Zon, Maan, planeten en ascendant van datum, tropisch.
=========================================================================== */
(function () {
  const { astro } = window.QP;

  const PLANETS = [
    { key: 'sun', nl: 'Zon', glyph: '☉', body: 'Sun' },
    { key: 'moon', nl: 'Maan', glyph: '☽', body: 'Moon' },
    { key: 'mercury', nl: 'Mercurius', glyph: '☿', body: 'Mercury' },
    { key: 'venus', nl: 'Venus', glyph: '♀', body: 'Venus' },
    { key: 'mars', nl: 'Mars', glyph: '♂', body: 'Mars' },
    { key: 'jupiter', nl: 'Jupiter', glyph: '♃', body: 'Jupiter' },
    { key: 'saturn', nl: 'Saturnus', glyph: '♄', body: 'Saturn' },
    { key: 'uranus', nl: 'Uranus', glyph: '♅', body: 'Uranus' },
    { key: 'neptune', nl: 'Neptunus', glyph: '♆', body: 'Neptune' },
    { key: 'pluto', nl: 'Pluto', glyph: '♇', body: 'Pluto' },
  ];

  function compute(birth) {
    const date = astro.makeUTCDate(birth);
    const positions = PLANETS.map((p) => {
      const lon = astro.lonOf(p.body, date);
      return { key: p.key, nl: p.nl, glyph: p.glyph, lon, sign: astro.signFromLongitude(lon) };
    });

    let asc = null;
    if (birth.lat != null && birth.lon != null && birth.hasExactTime) {
      const aLon = astro.ascendant(date, birth.lat, birth.lon);
      asc = { lon: aLon, sign: astro.signFromLongitude(aLon) };
    }

    const sun = positions[0], moon = positions[1];
    return {
      positions, sun, moon, ascendant: asc,
      bigThree: { sun: sun.sign, moon: moon.sign, rising: asc ? asc.sign : null },
      hasTime: birth.hasExactTime, hasPlace: asc != null,
    };
  }

  window.QP = window.QP || {};
  window.QP.astrology = { compute };
})();
