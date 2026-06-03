/* ===========================================================================
   numerology.js — Pythagoreaanse numerologie (volledig nauwkeurig).
   Levenspad, Uitdrukking, Zielsdrang, Persoonlijkheid.
=========================================================================== */
(function () {
  const VAL = {
    A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
    J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
    S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8,
  };
  const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);
  const MASTERS = new Set([11, 22, 33]);

  function reduce(n) {
    while (n > 9 && !MASTERS.has(n)) {
      n = String(n).split('').reduce((s, d) => s + +d, 0);
    }
    return n;
  }

  function clean(name) {
    return (name || '').toUpperCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // accenten weg
      .replace(/[^A-Z]/g, '');
  }

  function sumLetters(str, filterFn) {
    let total = 0;
    for (const ch of clean(str)) {
      if (!filterFn || filterFn(ch)) total += VAL[ch] || 0;
    }
    return reduce(total);
  }

  function lifePath(year, month, day) {
    const r = reduce(year) + reduce(month) + reduce(day);
    return reduce(r);
  }

  function compute({ name, year, month, day }) {
    const expression = sumLetters(name);                       // alle letters
    const soul = sumLetters(name, (c) => VOWELS.has(c));        // klinkers
    const personality = sumLetters(name, (c) => !VOWELS.has(c));// medeklinkers
    const path = lifePath(year, month, day);

    // Geboortedag-getal (rauw, gereduceerd)
    const birthday = reduce(day);

    return {
      lifePath: path,
      expression,
      soulUrge: soul,
      personality,
      birthday,
      hasName: clean(name).length > 0,
    };
  }

  window.QP = window.QP || {};
  window.QP.numerology = { compute, reduce };
})();
