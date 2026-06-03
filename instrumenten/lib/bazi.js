/* ===========================================================================
   bazi.js — Vier Pilaren van Lot (BaZi) + Saju (Koreaans).
   ---------------------------------------------------------------------------
   Nauwkeurige, "Chinese" rekenwijze:
   • Jaar- en maandpilaar volgen de ECHTE zonnetermen (de tropische lengte
     van de Zon op het geboortemoment), niet vaste kalenderdata.
     - Jaargrens = 立春 Lichun (Zon op 315°).
     - Maandgrenzen = de 12 "jie" op veelvouden van 30° vanaf 315°.
   • Dag- en uurpilaar volgen de LOKALE WARE ZONNETIJD op de geboorteplaats
     (lengtecorrectie + tijdsvereffening), met de 23:00-grens van het Zi-uur
     (晚子时 → volgende dagstam). Dit is de traditionele Chinese correctie.
=========================================================================== */
(function () {
  const STEMS = [
    { cn: '甲', py: 'Jiǎ', el: 'Hout',   pol: 'Yang' },
    { cn: '乙', py: 'Yǐ',  el: 'Hout',   pol: 'Yin'  },
    { cn: '丙', py: 'Bǐng',el: 'Vuur',   pol: 'Yang' },
    { cn: '丁', py: 'Dīng',el: 'Vuur',   pol: 'Yin'  },
    { cn: '戊', py: 'Wù',  el: 'Aarde',  pol: 'Yang' },
    { cn: '己', py: 'Jǐ',  el: 'Aarde',  pol: 'Yin'  },
    { cn: '庚', py: 'Gēng',el: 'Metaal', pol: 'Yang' },
    { cn: '辛', py: 'Xīn', el: 'Metaal', pol: 'Yin'  },
    { cn: '壬', py: 'Rén', el: 'Water',  pol: 'Yang' },
    { cn: '癸', py: 'Guǐ', el: 'Water',  pol: 'Yin'  },
  ];
  const BRANCHES = [
    { cn: '子', py: 'Zǐ',   an: 'Rat',    el: 'Water'  },
    { cn: '丑', py: 'Chǒu', an: 'Os',     el: 'Aarde'  },
    { cn: '寅', py: 'Yín',  an: 'Tijger', el: 'Hout'   },
    { cn: '卯', py: 'Mǎo',  an: 'Konijn', el: 'Hout'   },
    { cn: '辰', py: 'Chén', an: 'Draak',  el: 'Aarde'  },
    { cn: '巳', py: 'Sì',   an: 'Slang',  el: 'Vuur'   },
    { cn: '午', py: 'Wǔ',   an: 'Paard',  el: 'Vuur'   },
    { cn: '未', py: 'Wèi',  an: 'Geit',   el: 'Aarde'  },
    { cn: '申', py: 'Shēn', an: 'Aap',    el: 'Metaal' },
    { cn: '酉', py: 'Yǒu',  an: 'Haan',   el: 'Metaal' },
    { cn: '戌', py: 'Xū',   an: 'Hond',   el: 'Aarde'  },
    { cn: '亥', py: 'Hài',  an: 'Varken', el: 'Water'  },
  ];
  const ELEMENTS = ['Hout', 'Vuur', 'Aarde', 'Metaal', 'Water'];

  function cycleIdx60(stemIdx, branchIdx) {
    const si = ((stemIdx % 10) + 10) % 10;
    const bi = ((branchIdx % 12) + 12) % 12;
    for (let i = 0; i < 60; i++) {
      if (i % 10 === si && i % 12 === bi) return i;
    }
    return 0;
  }

  function computeLuckCycles(birth, monthStemIdx, monthBranchIdx, forward) {
    const { astro } = window.QP;
    const utc = astro.makeUTCDate(birth);
    const birthSunL = astro.sunLon(utc);
    const pos = ((birthSunL - 315 + 360) % 360);
    const currentJieIdx = Math.floor(pos / 30);
    let targetLon, approxDays;
    if (forward) {
      targetLon = (315 + (currentJieIdx + 1) * 30) % 360;
      approxDays = (30 - pos % 30) / 0.985647;
    } else {
      targetLon = (315 + currentJieIdx * 30) % 360;
      approxDays = -(pos % 30) / 0.985647;
    }
    const nearDate = new Date(utc.getTime() + approxDays * 86400000);
    const jieDate = astro.solveSunLon(targetLon, nearDate);
    const diffDays = Math.abs((jieDate - utc) / 86400000);
    const startAge = Math.round(diffDays / 3 * 10) / 10;
    const mCycle = cycleIdx60(monthStemIdx, monthBranchIdx);
    const cycles = [];
    for (let i = 0; i < 8; i++) {
      const offset = forward ? i + 1 : -(i + 1);
      const ci = ((mCycle + offset) % 60 + 60) % 60;
      const age = Math.round(startAge + i * 10);
      cycles.push({
        age,
        yearRange: `${birth.year + age}–${birth.year + age + 9}`,
        pillar: pillar(ci % 10, ci % 12),
      });
    }
    return { startAge, forward, cycles };
  }

  function jdnAtNoon(y, m, d) {
    if (m <= 2) { y -= 1; m += 12; }
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524;
  }
  function pillar(stemIdx, branchIdx) {
    const s = STEMS[((stemIdx % 10) + 10) % 10];
    const b = BRANCHES[((branchIdx % 12) + 12) % 12];
    return { stem: s, branch: b, cn: s.cn + b.cn, py: `${s.py} ${b.py}` };
  }

  function compute(birth) {
    const { astro } = window.QP;
    const utc = astro.makeUTCDate(birth);
    const sunL = astro.sunLon(utc);                      // echte zonnelengte van datum
    const hasHour = birth.hour != null && birth.hasExactTime;

    // --- JAARPILAAR (grens = Lichun, Zon op 315°) ---
    let solarYear = birth.year;
    if (birth.month === 1) solarYear -= 1;
    else if (birth.month === 2 && sunL < 315 && sunL > 270) solarYear -= 1;
    const yearP = pillar((solarYear - 4) % 10, (solarYear - 4) % 12);

    // --- MAANDPILAAR (12 jie op veelvouden van 30° vanaf 315°) ---
    const k = Math.floor((((sunL - 315) % 360) + 360) % 360 / 30); // 0 = 寅-maand
    const mBranchIdx = (k + 2) % 12;
    const firstMonthStem = ((((solarYear - 4) % 5) + 5) % 5) * 2 + 2; // stam van 寅-maand
    const monthStemIdx = ((firstMonthStem + k) % 10 + 10) % 10;
    const monthP = pillar(monthStemIdx, mBranchIdx);

    // --- LOKALE WARE ZONNETIJD (alleen voor BaZi/Saju debug-info) ---
    const lon = birth.lon != null ? birth.lon : 0;
    const eot = astro.eqOfTime(utc);
    const lonCorrMin = (lon / 15) * 60;
    const solarMs = utc.getTime() + (lonCorrMin + eot) * 60000;
    const solarDate = new Date(solarMs);
    const smin = hasHour ? solarDate.getUTCMinutes() : 0;

    // Dag/uurpilaar op LOKALE KLOKTIJD (zoals vrijwel alle BaZi-calculators).
    // Jaar/maandpilaar blijven op zonnelengte (jie-grenzen zijn zonneterm-gebonden).
    const clockH = hasHour ? birth.hour : 12;
    const clockMin = birth.minute || 0;

    // --- DAGPILAAR (sexagenaire dag, met 23:00 Zi-grens op kloktijd) ---
    let jdn = jdnAtNoon(birth.year, birth.month, birth.day);
    if (hasHour && clockH >= 23) jdn += 1;               // late Zi-uur → volgende dagstam
    const sx = ((jdn + 49) % 60 + 60) % 60;
    const dStem = sx % 10, dBranch = sx % 12;
    const dayP = pillar(dStem, dBranch);

    // --- UURPILAAR ---
    let hourP = null;
    if (hasHour) {
      const hB = Math.floor(((clockH + 1) % 24) / 2) % 12;
      const hS = ((dStem % 5) * 2 + hB) % 10;
      hourP = pillar(hS, hB);
    }

    // --- ELEMENTBALANS ---
    const counts = { Hout: 0, Vuur: 0, Aarde: 0, Metaal: 0, Water: 0 };
    const used = [yearP, monthP, dayP].concat(hourP ? [hourP] : []);
    used.forEach((p) => { counts[p.stem.el]++; counts[p.branch.el]++; });
    const total = used.length * 2;
    const balance = ELEMENTS.map((el) => ({ el, count: counts[el], pct: Math.round((counts[el] / total) * 100) }));
    const strongest = balance.slice().sort((a, b) => b.count - a.count)[0];
    const missing = balance.filter((b) => b.count === 0).map((b) => b.el);

    const yangYear = yearP.stem.pol === 'Yang';
    const male = (birth.gender || 'm') === 'm';
    const luckForward = (yangYear && male) || (!yangYear && !male);
    const luckCycles = computeLuckCycles(birth, monthStemIdx, mBranchIdx, luckForward);

    return {
      pillars: { hour: hourP, day: dayP, month: monthP, year: yearP },
      dayMaster: { ...dayP.stem },
      balance, strongest, missing, hasHour,
      luckCycles,
      solarTime: {
        hour: clockH, minute: clockMin,
        eot: Math.round(eot),
        lonCorr: Math.round(lonCorrMin),
        clock: hasHour ? `${String(birth.hour).padStart(2, '0')}:${String(birth.minute || 0).padStart(2, '0')}` : null,
      },
    };
  }

  // Saju = zelfde pilaren; richting van de gelukspilaren hangt van geslacht + jaar-polariteit
  function computeSaju(birth) {
    const base = compute(birth);
    const yangYear = base.pillars.year.stem.pol === 'Yang';
    const male = (birth.gender || 'm') === 'm';
    const forward = (yangYear && male) || (!yangYear && !male);
    return { ...base, luckDirection: forward ? 'voorwaarts' : 'achterwaarts', gender: male ? 'man' : 'vrouw' };
  }

  window.QP = window.QP || {};
  window.QP.bazi = { compute, computeSaju, STEMS, BRANCHES, ELEMENTS };
})();
