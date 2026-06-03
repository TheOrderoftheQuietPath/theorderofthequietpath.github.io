/* app.jsx — hub, routing, opslag, delen */

const TOOLS = [
  {
    id: 'humandesign', glyph: '◈', name: 'Human Design', meta: 'sinds 1987',
    tag: 'Type · Strategie · Autoriteit · Bodygraph',
    reads: 'Je energetische ontwerp — hoe je beslist, handelt en je energie het best gebruikt.',
    fields: ['name', 'time', 'place'], requireTime: true,
    compute: (b) => window.QP.humandesign.compute(b),
    render: (data, birth, ctx) => <HDResult data={data} ctx={ctx} />,
  },
  {
    id: 'bazi', glyph: '☯', name: 'BaZi', meta: '3000+ jaar',
    tag: 'Vier Pilaren van Lot · Dagmeester',
    reads: 'Je geboortepatroon in vier pilaren — je kernkarakter en je elementen.',
    fields: ['name', 'time', 'place', 'gender'], requireTime: false,
    compute: (b) => window.QP.bazi.compute(b),
    render: (data, birth, ctx) => <BaziLike data={data} ctx={ctx} />,
  },
  {
    id: 'saju', glyph: '\uBA85', name: 'Saju', meta: 'Korea',
    tag: 'Koreaanse Vier Pilaren',
    reads: 'Dezelfde pilaren, Koreaanse stijl — gericht op karakter en relaties.',
    fields: ['name', 'time', 'place', 'gender'], requireTime: false,
    compute: (b) => window.QP.bazi.computeSaju(b),
    render: (data, birth, ctx) => <BaziLike data={data} korean ctx={ctx} />,
  },
  {
    id: 'numerology', glyph: '\u221E', name: 'Numerologie', meta: 'Pythagoras',
    tag: 'Levenspad · Zielsdrang · Bestemming',
    reads: 'Je naam en geboortedatum, herleid tot de getallen achter je karakter.',
    fields: ['name', 'nameRequired'], requireTime: false,
    compute: (b) => window.QP.numerology.compute(b),
    render: (data, birth, ctx) => <NumerologyResult data={data} name={birth.name} birth={birth} ctx={ctx} />,
  },
  {
    id: 'astrology', glyph: '\u2726', name: 'Astrologie', meta: 'Westers',
    tag: 'Horoscoop · Ascendant · Planeten',
    reads: 'De stand van zon, maan en planeten op het moment van je eerste ademhaling.',
    fields: ['name', 'time', 'place', 'ascendant'], requireTime: false,
    compute: (b) => window.QP.astrology.compute(b),
    render: (data, birth, ctx) => <AstrologyResult data={data} birth={birth} ctx={ctx} />,
  },
];
const toolById = (id) => TOOLS.find((t) => t.id === id);

/* --- premium --- */
const PREMIUM_URL = 'https://theorderofthequietpath.github.io/#rapport';

function validateCode(raw) {
  const c = (raw || '').trim().toUpperCase();
  // Geldige codes: HSP-XXXX-XXXX (verkocht via betaalsysteem)
  // Demo code: HSP-DEMO-2025
  if (c === 'HSP-DEMO-2025') return true;
  return /^HSP-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(c);
}

function UnlockModal({ onUnlock, onClose }) {
  const [code, setCode] = React.useState('');
  const [err, setErr] = React.useState('');
  function tryUnlock(e) {
    e.preventDefault();
    if (!onUnlock(code)) setErr('Ongeldige code — controleer je aankoop-e-mail.');
  }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="label" style={{ marginBottom: 12 }}>✦ &nbsp;Premium rapport</div>
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: '1.7rem', marginBottom: 10 }}>
          Ontgrendel je volledige blauwdruk
        </h2>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem', marginBottom: 20 }}>
          Voer je licentiecode in. Je ontvangt deze na aankoop via e-mail.
        </p>
        <form onSubmit={tryUnlock}>
          <input className="input" value={code} autoFocus
            onChange={(e) => { setCode(e.target.value); setErr(''); }}
            placeholder="HSP-XXXX-XXXX"
            style={{ fontFamily: 'var(--mono)', letterSpacing: '0.12em', fontSize: '1rem' }} />
          {err && <div className="note-warn" style={{ marginTop: 10 }}>{err}</div>}
          <button className="btn btn-gold" type="submit"
            style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>
            Ontgrendelen →
          </button>
        </form>
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          <a href={PREMIUM_URL} target="_blank" rel="noopener"
            style={{ fontSize: '0.82rem', color: 'var(--gold-deep)' }}>
            Nog geen code? Koop hier het volledige rapport →
          </a>
        </div>
        <button className="backlink" onClick={onClose} style={{ display: 'block', marginTop: 14 }}>
          Annuleren
        </button>
      </div>
    </div>
  );
}

/* --- opslag & delen --- */
const b64e = (s) => btoa(unescape(encodeURIComponent(s)));
const b64d = (s) => decodeURIComponent(escape(atob(s)));
function encodeState(toolId, birth) { return b64e(JSON.stringify({ t: toolId, b: birth })); }
function decodeState(h) { try { return JSON.parse(b64d(h)); } catch (e) { return null; } }

function loadSaved() {
  try { return JSON.parse(localStorage.getItem('qp_saved') || '[]'); } catch (e) { return []; }
}
function persistSaved(list) { localStorage.setItem('qp_saved', JSON.stringify(list)); }

function fmtDate(b) {
  const p = (n) => String(n).padStart(2, '0');
  let s = `${p(b.day)}.${p(b.month)}.${b.year}`;
  if (b.hour != null && b.hasExactTime) s += ` · ${p(b.hour)}:${p(b.minute || 0)}`;
  if (b.place) s += ` · ${b.place}`;
  return s;
}

/* --- Toast --- */
function useToast() {
  const [msg, setMsg] = React.useState('');
  const show = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2200); };
  const node = <div className={'toast' + (msg ? ' show' : '')}>{msg}</div>;
  return [show, node];
}

/* --- Convergentie-teaser --- */
function ConvergenceTeaser({ saved, onOpen }) {
  const groups = {};
  saved.forEach((s) => {
    const key = (s.name || 'jij').toLowerCase().trim() || 'jij';
    (groups[key] = groups[key] || []).push(s);
  });
  let best = null;
  Object.values(groups).forEach((g) => {
    const tools = new Set(g.map((x) => x.toolId));
    if (tools.size >= 2 && (!best || tools.size > best.tools.size)) best = { g, tools, name: g[0].name };
  });
  if (!best) return null;

  const results = {};
  best.g.forEach((s) => {
    const t = toolById(s.toolId);
    if (t) results[s.toolId] = t.compute(s.birth);
  });
  const tz = window.QP.convergence.teaser(results);

  return (
    <div className="converge">
      <div className="label">De volledige blauwdruk</div>
      <h3>{best.tools.size} systemen, één patroon{best.name ? ` — ${best.name}` : ''}</h3>
      {tz.hasOverlap ? (
        <>
          <p style={{ color: 'var(--ink-soft)' }}>Je gedraaide systemen wijzen niet toevallig in dezelfde richting. Waar ze samenvallen:</p>
          <div className="words">
            {tz.shared.map((w, i) => (
              <span className="word" key={i}><b>{w.word}</b> &nbsp;· {w.systems.join(' + ')}</span>
            ))}
          </div>
        </>
      ) : (
        <p style={{ color: 'var(--ink-soft)' }}>Je hebt {best.tools.size} systemen gelezen. Wanneer ze naast elkaar worden gelegd, verschijnen de rode draden die geen losse tool kan tonen.</p>
      )}
      <p style={{ fontSize: '0.9rem', marginTop: 14 }}>Dit is waar echte helderheid ontstaat — de combinatiereading legt alle systemen over elkaar.</p>
      <a className="btn btn-ghost btn-sm" href={CONTACT_URL} target="_blank" rel="noopener" style={{ marginTop: 16 }}>Vraag de volledige blauwdruk aan →</a>
    </div>
  );
}

/* --- Hub --- */
function Hub({ onPick, saved, onOpenSaved, onDeleteSaved }) {
  return (
    <div className="fade-in">
      <div className="hub-hero">
        <div className="label">Het Stille Pad · gratis instrumenten</div>
        <h1 style={{ marginTop: 18 }}>Lees de blauwdruk waarmee je <em>geboren</em> bent.</h1>
        <p className="lede">Kies een systeem. Vul je geboortegegevens in. Lees in gewone taal wat het over je zegt — direct, gratis, zonder account.</p>
        <div className="reassure">
          <span><span className="dot"></span>Vijf systemen</span>
          <span><span className="dot"></span>Begrijpelijke uitleg</span>
          <span><span className="dot"></span>Geen registratie</span>
        </div>
      </div>

      <div className="section-head">
        <h2>Kies je systeem</h2>
        <span className="mono">05 instrumenten</span>
      </div>
      <div className="tool-grid">
        {TOOLS.map((t) => (
          <div key={t.id} className="tool-card" onClick={() => onPick(t.id)}>
            <span className="corner">{t.meta}</span>
            <div className="glyph">{t.glyph}</div>
            <h3>{t.name}</h3>
            <div className="sub">{t.reads}</div>
            <div className="go">Openen →</div>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.15rem', color: 'var(--ink-soft)', marginTop: 36, maxWidth: '40ch' }}>
        Jij bent niet kapot. Jij bent ongelezen.
      </p>

      {saved.length > 0 && (
        <div style={{ marginTop: 50 }}>
          <div className="section-head"><h2>Eerder gelezen</h2></div>
          <div className="saved-strip">
            {saved.slice().reverse().map((s) => {
              const t = toolById(s.toolId);
              return (
                <div className="saved-chip" key={s.key} onClick={() => onOpenSaved(s)}>
                  <span className="sg">{t ? t.glyph : '·'}</span>
                  <div>
                    <div className="sn">{s.name || 'Jij'} · {t ? t.name : ''}</div>
                    <div className="sd">{fmtDate(s.birth)}</div>
                  </div>
                  <span className="x" onClick={(e) => { e.stopPropagation(); onDeleteSaved(s.key); }}>✕</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 24 }}>
            <ConvergenceTeaser saved={saved} />
          </div>
        </div>
      )}
    </div>
  );
}

/* --- App --- */
function App() {
  const [view, setView] = React.useState('hub');     // hub | form | result | blueprint
  const [toolId, setToolId] = React.useState(null);
  const [birth, setBirth] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [saved, setSaved] = React.useState(loadSaved());
  const [toast, toastNode] = useToast();
  const [premium, setPremium] = React.useState(() => localStorage.getItem('qp_premium') === '1');
  const [showUnlock, setShowUnlock] = React.useState(false);

  function unlock(code) {
    if (validateCode(code)) {
      localStorage.setItem('qp_premium', '1');
      setPremium(true);
      setShowUnlock(false);
      toast('✦ Premium ontgrendeld');
      return true;
    }
    return false;
  }

  function printPremium() {
    document.body.classList.add('premium-print');
    window.print();
    setTimeout(() => document.body.classList.remove('premium-print'), 500);
  }

  const ctx = { premium, onUnlock: () => setShowUnlock(true), printPremium };

  // deep-link laden
  React.useEffect(() => {
    const h = location.hash.replace(/^#r=/, '');
    if (h && location.hash.startsWith('#r=')) {
      const st = decodeState(h);
      if (st && toolById(st.t)) runTool(st.t, st.b, false);
    }
  }, []);

  function saveChart(tid, b) {
    const key = `${tid}|${(b.name || '').toLowerCase()}|${b.year}-${b.month}-${b.day}`;
    setSaved((prev) => {
      const next = prev.filter((s) => s.key !== key);
      next.push({ key, toolId: tid, name: b.name, birth: b, ts: Date.now() });
      const trimmed = next.slice(-12);
      persistSaved(trimmed);
      return trimmed;
    });
  }

  function runTool(tid, b, save = true) {
    const t = toolById(tid);
    const result = t.compute(b);
    setToolId(tid); setBirth(b); setData(result); setView('result');
    if (save) saveChart(tid, b);
    window.scrollTo(0, 0);
  }

  function pick(tid) { setToolId(tid); setView('form'); window.scrollTo(0, 0); }
  function goHub() { setView('hub'); history.replaceState(null, '', location.pathname); window.scrollTo(0, 0); }

  function share() {
    const enc = encodeState(toolId, birth);
    const url = location.origin + location.pathname + '#r=' + enc;
    history.replaceState(null, '', '#r=' + enc);
    navigator.clipboard?.writeText(url).then(
      () => toast('Deel-link gekopieerd ✓'),
      () => toast('Kon link niet kopiëren')
    );
  }
  function deleteSaved(key) {
    setSaved((prev) => { const n = prev.filter((s) => s.key !== key); persistSaved(n); return n; });
  }

  const tool = toolId ? toolById(toolId) : null;

  return (
    <div className="app">
      <div className="wrap">
        <div className="topbar">
          <div className="brand" onClick={goHub}>
            <span className="brand-mark"><b>Het Stille Pad</b></span>
          </div>
          <nav className="topnav">
            <a onClick={goHub} style={{ cursor: 'pointer' }}>Instrumenten</a>
            <a onClick={() => { setView('blueprint'); window.scrollTo(0,0); }}
               style={{ cursor: 'pointer', color: 'var(--gold-deep)', fontWeight: 600 }}>
              ✦ Zielsblauwdruk
            </a>
            <a href={CONTACT_URL} target="_blank" rel="noopener">Contact</a>
          </nav>
        </div>
        <hr className="hairline" />

        <div style={{ paddingTop: 8 }}>
          {view === 'hub' && (
            <>
              <Hub onPick={pick} saved={saved}
                onOpenSaved={(s) => runTool(s.toolId, s.birth, false)}
                onDeleteSaved={deleteSaved} />
              <div className="blueprint-teaser" onClick={() => { setView('blueprint'); window.scrollTo(0,0); }}>
                <div className="label" style={{ marginBottom: 10 }}>✦ &nbsp;Nieuw</div>
                <h2>Persoonlijk Zielsblauwdruk Rapport</h2>
                <p>Vijf systemen. Eén coherent verhaal over wie jij bent — geschreven over jou persoonlijk. 30-40 pagina's coachingstaal.</p>
                <span className="btn btn-gold btn-sm" style={{ marginTop: 14, display: 'inline-flex' }}>
                  Ontdek jouw Zielsblauwdruk →
                </span>
              </div>
            </>
          )}

          {view === 'blueprint' && (
            <div className="fade-in" style={{ paddingTop: 14 }}>
              <Blueprint ctx={ctx} onBack={goHub} />
            </div>
          )}

          {view === 'form' && tool && (
            <div className="fade-in" style={{ paddingTop: 14 }}>
              <button className="backlink" onClick={goHub}>← Alle instrumenten</button>
              <div className="form-shell">
                <div className="tool-header" style={{ marginTop: 18 }}>
                  <div className="glyph">{tool.glyph}</div>
                  <div>
                    <div className="label" style={{ marginBottom: 8 }}>{tool.tag}</div>
                    <h1>{tool.name}</h1>
                    <div className="reads">{tool.reads}</div>
                  </div>
                </div>
              </div>
              <BirthForm tool={tool} fields={tool.fields} requireTime={tool.requireTime}
                onSubmit={(b) => runTool(tool.id, b)} />
            </div>
          )}

          {view === 'result' && tool && data && (
            <div className="fade-in" style={{ paddingTop: 14 }}>
              <button className="backlink" onClick={goHub}>← Alle instrumenten</button>
              <div className="result-head">
                <div className="who">
                  <div className="label" style={{ marginBottom: 10 }}>{tool.glyph} &nbsp;{tool.name}</div>
                  <h1>{birth.name ? birth.name : `Jouw ${tool.name}`}</h1>
                  <div className="meta">{fmtDate(birth)}</div>
                </div>
                <div className="result-actions">
                  <button className="btn btn-ghost btn-sm" onClick={share}>Deel link</button>
                  {premium
                    ? <button className="btn btn-gold btn-sm" onClick={printPremium}>✦ Premium PDF</button>
                    : <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>Bewaar PDF</button>
                  }
                  {!premium && (
                    <button className="btn btn-ghost btn-sm" onClick={() => setShowUnlock(true)}
                      style={{ borderColor: 'var(--gold)', color: 'var(--gold-deep)' }}>
                      ✦ Ontgrendel
                    </button>
                  )}
                  <button className="btn btn-sm" onClick={() => pick(tool.id)}>Opnieuw</button>
                </div>
              </div>
              {tool.render(data, birth, ctx)}
            </div>
          )}
        </div>

        {showUnlock && <UnlockModal onUnlock={unlock} onClose={() => setShowUnlock(false)} />}

        <div className="foot">
          <div>
            <div className="fm">Het Stille Pad</div>
            <div className="fc">Kosmische zelfkennis · gratis instrumenten</div>
          </div>
          <div className="fl">
            <a href="https://www.instagram.com/theorderofthequietpath" target="_blank" rel="noopener">Instagram</a>
            <a href="https://tiktok.com/@theorderofthequietpath" target="_blank" rel="noopener">TikTok</a>
            <a href={CONTACT_URL} target="_blank" rel="noopener">Contact</a>
          </div>
        </div>
      </div>
      {toastNode}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
