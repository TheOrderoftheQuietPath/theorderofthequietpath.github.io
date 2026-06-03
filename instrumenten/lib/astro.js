/* ===========================================================================
   astro.js — astronomische kern op basis van Astronomy Engine (echte efemeride).
   Levert tropische, geocentrische, schijnbare ecliptica-lengtes van datum
   (arcseconde-nauwkeurig) voor Zon, Maan en planeten, plus ascendant en
   de Human-Design "Design"-tijd (88° zonneboog vóór geboorte).
   ---------------------------------------------------------------------------
   Vereist dat het globale object `Astronomy` geladen is (CDN).
=========================================================================== */
(function () {
  const D2R = Math.PI / 180;
  const norm360 = (x) => ((x % 360) + 360) % 360;
  const norm180 = (x) => { let v = norm360(x); return v > 180 ? v - 360 : v; };

  function jdFromDate(date) { return date.getTime() / 86400000 + 2440587.5; }

  /* --- Europese zomertijd (EU-regel, vanaf 1977): laatste zo. maart .. okt --- */
  function lastSundayDOM(year, month1) {
    const last = new Date(Date.UTC(year, month1, 0)); // laatste dag v/d maand
    return last.getUTCDate() - last.getUTCDay();
  }
  function isEUDST(b) {
    if (b.tz !== 0 && b.tz !== 1) return false;   // alleen West/Centraal-Europa
    if (b.year < 1977) return false;
    const { year, month, day } = b;
    if (month > 3 && month < 10) return true;
    if (month === 3) return day >= lastSundayDOM(year, 3);
    if (month === 10) return day < lastSundayDOM(year, 10);
    return false;
  }

  // Bouw exact UTC-tijdstip uit lokale geboortegegevens.
  // Voorkeur: IANA-zone via Intl (correcte, historische zomertijd wereldwijd).
  function zoneOffsetMinutes(zone, utcDate) {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: zone, hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    const p = {};
    dtf.formatToParts(utcDate).forEach((x) => (p[x.type] = x.value));
    let h = +p.hour; if (h === 24) h = 0;
    const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, h, +p.minute, +p.second);
    return (asUTC - utcDate.getTime()) / 60000; // zone ligt N minuten vóór UTC
  }

  function makeUTCDate(b) {
    const hour = (b.hour == null ? 12 : b.hour);
    const min = b.minute || 0;
    if (b.zone) {
      try {
        const guess = Date.UTC(b.year, b.month - 1, b.day, hour, min);
        let off = zoneOffsetMinutes(b.zone, new Date(guess));
        let utc = guess - off * 60000;
        off = zoneOffsetMinutes(b.zone, new Date(utc)); // verfijn over DST-grens
        utc = guess - off * 60000;
        return new Date(utc);
      } catch (e) { /* val terug op numerieke offset */ }
    }
    let tz = b.tz != null ? b.tz : 1;
    if (isEUDST(b)) tz += 1;
    const ms = Date.UTC(b.year, b.month - 1, b.day, hour, min) - tz * 3600000;
    return new Date(ms);
  }

  // Tijdsvereffening (Meeus 28) — minuten waarmee ware zonnetijd vóór de
  // gemiddelde zonnetijd loopt. Voor lokale ware zonnetijd (BaZi/Saju).
  function eqOfTime(date) {
    const T = (jdFromDate(date) - 2451545.0) / 36525.0;
    const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T) * D2R;
    const M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T) * D2R;
    const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
    const eps = obliquity(date) * D2R;
    const y = Math.tan(eps / 2) ** 2;
    const E = y * Math.sin(2 * L0) - 2 * e * Math.sin(M)
      + 4 * e * y * Math.sin(M) * Math.cos(2 * L0)
      - 0.5 * y * y * Math.sin(4 * L0) - 1.25 * e * e * Math.sin(2 * M);
    return (E / D2R) * 4; // minuten
  }

  /* --- ecliptica-lengte van datum (tropisch) voor een lichaam --- */
  function lonOf(bodyName, date) {
    const body = Astronomy.Body[bodyName];
    const gv = Astronomy.GeoVector(body, date, true);   // EQJ, met aberratie
    const ecl = Astronomy.Ecliptic(gv);                 // ware ecliptica van datum
    return norm360(ecl.elon);
  }
  const sunLon = (date) => lonOf('Sun', date);

  // Gemiddelde noordelijke Maansknoop (van datum)
  function nodeLon(date) {
    const T = (jdFromDate(date) - 2451545.0) / 36525.0;
    return norm360(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T);
  }

  // Verfijnde obliquiteit van datum
  function obliquity(date) {
    const T = (jdFromDate(date) - 2451545.0) / 36525.0;
    return 23.4392911 - 0.0130042 * T - 1.64e-7 * T * T;
  }

  // Ascendant (oostpunt op de ecliptica) — vereist breedte/lengte
  function ascendant(date, latDeg, lonDeg) {
    const gast = Astronomy.SiderealTime(date);          // uren (Greenwich app. sterrentijd)
    const lst = norm360(gast * 15 + lonDeg);            // lokale sterrentijd in graden = RAMC
    const ramc = lst * D2R;
    const eps = obliquity(date) * D2R;
    const phi = latDeg * D2R;
    let asc = norm360(Math.atan2(
      Math.cos(ramc),
      -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps))
    ) / D2R);
    // Kies de wortel die in het OOSTEN opkomt (uurhoek tussen -180° en 0°).
    const lr = asc * D2R;
    const ra = norm360(Math.atan2(Math.cos(eps) * Math.sin(lr), Math.cos(lr)) / D2R);
    let H = norm360(lst - ra); if (H > 180) H -= 360;
    if (H > 0) asc = norm360(asc + 180);                // anders is het de Descendant
    return asc;
  }

  // Design-tijd: moment waarop de Zon exact 88° vóór de geboorte-Zon stond
  function solveDesign(birthDate, birthSunLon) {
    const target = norm360(birthSunLon - 88);
    let t = new Date(birthDate.getTime() - (88 / 0.985647) * 86400000);
    for (let i = 0; i < 8; i++) {
      const diff = norm180(sunLon(t) - target);
      t = new Date(t.getTime() - (diff / 0.985647) * 86400000);
      if (Math.abs(diff) < 1e-5) break;
    }
    return t;
  }

  // Zoek datum waarop de Zon een gegeven ecliptica-lengte bereikt, startend vanuit nearDate.
  function solveSunLon(targetLon, nearDate) {
    let t = new Date(nearDate.getTime());
    for (let i = 0; i < 16; i++) {
      const diff = norm180(sunLon(t) - norm360(targetLon));
      t = new Date(t.getTime() - (diff / 0.985647) * 86400000);
      if (Math.abs(diff) < 1e-6) break;
    }
    return t;
  }

  /* --- tekens --- */
  const SIGNS = ['Ram','Stier','Tweelingen','Kreeft','Leeuw','Maagd','Weegschaal','Schorpioen','Boogschutter','Steenbok','Waterman','Vissen'];
  const SIGN_GLYPH = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  const SIGN_ELEMENT = ['Vuur','Aarde','Lucht','Water','Vuur','Aarde','Lucht','Water','Vuur','Aarde','Lucht','Water'];
  const SIGN_MODE = ['Hoofd','Vast','Beweeglijk','Hoofd','Vast','Beweeglijk','Hoofd','Vast','Beweeglijk','Hoofd','Vast','Beweeglijk'];
  const SIGN_RULER = ['Mars','Venus','Mercurius','Maan','Zon','Mercurius','Venus','Pluto','Jupiter','Saturnus','Uranus','Neptunus'];

  function signFromLongitude(lon) {
    const i = Math.floor(norm360(lon) / 30);
    return { index: i, name: SIGNS[i], glyph: SIGN_GLYPH[i], element: SIGN_ELEMENT[i], mode: SIGN_MODE[i], ruler: SIGN_RULER[i], degree: norm360(lon) % 30 };
  }

  window.QP = window.QP || {};
  window.QP.astro = {
    norm360, norm180, makeUTCDate, lonOf, sunLon, nodeLon, eqOfTime,
    ascendant, solveDesign, solveSunLon, signFromLongitude, isEUDST, SIGNS,
  };
})();
