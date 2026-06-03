/* ===========================================================================
   hd-data.js — Human Design tabellen: 64 poorten, 9 centra, 36 kanalen.
=========================================================================== */
(function () {
  // Poort -> centrum
  const GATE_CENTER = {};
  const C = {
    head:   [64, 61, 63],
    ajna:   [47, 24, 4, 17, 43, 11],
    throat: [62, 23, 56, 16, 20, 31, 8, 33, 35, 12, 45],
    g:      [1, 13, 25, 46, 2, 15, 10, 7],
    heart:  [21, 40, 26, 51],
    sacral: [34, 5, 14, 29, 59, 9, 3, 42, 27],
    solar:  [6, 37, 30, 55, 49, 22, 36],
    spleen: [48, 57, 44, 50, 32, 28, 18],
    root:   [58, 38, 54, 53, 60, 52, 19, 39, 41],
  };
  Object.entries(C).forEach(([center, gates]) =>
    gates.forEach((g) => (GATE_CENTER[g] = center))
  );

  // 36 kanalen: [poortA, poortB, naam]
  const CHANNELS = [
    [1, 8, 'Inspiratie'], [2, 14, 'De Sleutel'], [3, 60, 'Mutatie'],
    [4, 63, 'Logica'], [5, 15, 'Ritme'], [6, 59, 'Intimiteit'],
    [7, 31, 'Leiderschap'], [9, 52, 'Concentratie'], [10, 20, 'Ontwaken'],
    [10, 34, 'Verkenning'], [10, 57, 'Volmaakte Vorm'], [11, 56, 'Nieuwsgierigheid'],
    [12, 22, 'Openheid'], [13, 33, 'De Verkwister'], [16, 48, 'Het Talent'],
    [17, 62, 'Aanvaarding'], [18, 58, 'Oordeel'], [19, 49, 'Synthese'],
    [20, 34, 'Charisma'], [20, 57, 'De Hersengolf'], [21, 45, 'Geld'],
    [23, 43, 'Structureren'], [24, 61, 'Bewustzijn'], [25, 51, 'Initiatie'],
    [26, 44, 'Overgave'], [27, 50, 'Behoud'], [28, 38, 'De Worsteling'],
    [29, 46, 'Ontdekking'], [30, 41, 'Herkenning'], [32, 54, 'Transformatie'],
    [34, 57, 'Kracht'], [35, 36, 'Vergankelijkheid'], [37, 40, 'Gemeenschap'],
    [39, 55, 'Emoties'], [42, 53, 'Volwassenwording'], [47, 64, 'Abstractie'],
  ];

  // Centra: positie (genormaliseerd 0-1), vorm, label
  const CENTERS = {
    head:   { label: 'Hoofd',           shape: 'triangle-up',   x: 0.5,  y: 0.05, motor: false },
    ajna:   { label: 'Ajna',            shape: 'triangle-down', x: 0.5,  y: 0.19, motor: false },
    throat: { label: 'Keel',            shape: 'square',        x: 0.5,  y: 0.34, motor: false },
    g:      { label: 'G / Identiteit',  shape: 'diamond',       x: 0.5,  y: 0.50, motor: false },
    heart:  { label: 'Wil / Ego',       shape: 'triangle-right',x: 0.70, y: 0.55, motor: true  },
    spleen: { label: 'Milt',            shape: 'triangle-left', x: 0.18, y: 0.62, motor: false },
    solar:  { label: 'Zonnevlecht',     shape: 'triangle-right',x: 0.82, y: 0.62, motor: true  },
    sacral: { label: 'Sacraal',         shape: 'square',        x: 0.5,  y: 0.66, motor: true  },
    root:   { label: 'Wortel',          shape: 'square',        x: 0.5,  y: 0.84, motor: true  },
  };

  // Poortwiel (Rave Mandala): volgorde van poorten langs de dierenriem,
  // beginnend bij Poort 41 op 302° tropisch (2° Waterman). Dit anker plaatst
  // Poort 25 op het Ram-punt (0° Ram) — de gangbare Human-Designconventie.
  const GATE_WHEEL = [
    41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
    27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
    31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
    28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60,
  ];
  const WHEEL_ANCHOR = 302.0; // tropische lengte waar Poort 41 begint

  const MOTORS = ['sacral', 'heart', 'solar', 'root'];

  window.QP = window.QP || {};
  window.QP.hdData = { GATE_CENTER, CHANNELS, CENTERS, GATE_WHEEL, WHEEL_ANCHOR, MOTORS, C };
})();
