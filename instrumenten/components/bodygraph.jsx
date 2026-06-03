/* bodygraph.jsx — Human Design bodygraph als rustige SVG op nachtveld */
function Bodygraph({ centers, channels }) {
  const { CENTERS, CHANNELS, GATE_CENTER } = window.QP.hdData;
  const W = 300, H = 472, S = 38;
  const defined = new Set(centers);

  const pos = {};
  Object.entries(CENTERS).forEach(([k, c]) => { pos[k] = { x: c.x * W, y: c.y * H }; });

  function shapePts(k) {
    const { x, y } = pos[k];
    const sh = CENTERS[k].shape;
    const h = S / 2;
    switch (sh) {
      case 'triangle-up':    return `${x},${y - h} ${x - h},${y + h} ${x + h},${y + h}`;
      case 'triangle-down':  return `${x},${y + h} ${x - h},${y - h} ${x + h},${y - h}`;
      case 'triangle-left':  return `${x - h},${y} ${x + h},${y - h} ${x + h},${y + h}`;
      case 'triangle-right': return `${x + h},${y} ${x - h},${y - h} ${x - h},${y + h}`;
      case 'diamond':        return `${x},${y - h} ${x + h},${y} ${x},${y + h} ${x - h},${y}`;
      default:               return null; // square handled apart
    }
  }

  // achtergrond-bedrading: unieke centrum-paren
  const wiring = [];
  const seen = new Set();
  CHANNELS.forEach(([a, b]) => {
    const ca = GATE_CENTER[a], cb = GATE_CENTER[b];
    if (ca === cb) return;
    const key = [ca, cb].sort().join('-');
    if (seen.has(key)) return;
    seen.add(key);
    wiring.push([ca, cb]);
  });

  const definedPairs = new Set(
    (channels || []).map((c) => c.centers.slice().sort().join('-'))
  );

  return (
    <div className="bodygraph-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320, display: 'block', margin: '0 auto' }}>
        {/* bedrading */}
        {wiring.map(([a, b], i) => {
          const active = definedPairs.has([a, b].sort().join('-'));
          return (
            <line key={'w' + i}
              x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y}
              stroke={active ? 'var(--gold)' : 'oklch(0.40 0.02 270)'}
              strokeWidth={active ? 2.4 : 1}
              strokeLinecap="round" />
          );
        })}
        {/* centra */}
        {Object.keys(CENTERS).map((k) => {
          const on = defined.has(k);
          const fill = on ? 'oklch(0.70 0.085 64)' : 'oklch(0.30 0.030 270)';
          const stroke = on ? 'var(--gold)' : 'oklch(0.46 0.03 270)';
          const textFill = on ? 'oklch(0.20 0.02 60)' : 'oklch(0.65 0.01 270)';
          const common = { fill, stroke, strokeWidth: 1.4 };
          const SHORT = { head: 'HD', ajna: 'AJ', throat: 'KL', g: 'G', heart: 'WL', sacral: 'SC', solar: 'ZV', spleen: 'ML', root: 'WO' };
          const shape = CENTERS[k].shape === 'square'
            ? <rect key={k + '_s'} x={pos[k].x - S / 2} y={pos[k].y - S / 2} width={S} height={S} rx="3" {...common} />
            : <polygon key={k + '_s'} points={shapePts(k)} {...common} />;
          return (
            <g key={k}>
              <title>{CENTERS[k].label}{on ? ' — gedefinieerd' : ' — open'}</title>
              {shape}
              <text x={pos[k].x} y={pos[k].y + 1} fontSize="7" textAnchor="middle"
                dominantBaseline="central" fill={textFill} fontFamily="monospace" letterSpacing="0.04em">
                {SHORT[k]}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="bg-legend">
        <span><span className="sw" style={{ background: 'oklch(0.70 0.085 64)' }}></span>Gedefinieerd — vast in jou</span>
        <span><span className="sw" style={{ background: 'oklch(0.30 0.030 270)', border: '1px solid oklch(0.46 0.03 270)' }}></span>Open — gevoelig, lerend</span>
      </div>
    </div>
  );
}

window.Bodygraph = Bodygraph;
