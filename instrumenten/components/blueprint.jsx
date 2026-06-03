/* blueprint.jsx — Zielsblauwdruk rapport flow */

// Pas dit aan naar jouw Render URL zodra deployed
const BACKEND_URL = window.QP_BACKEND_URL || 'https://toqp-backend.onrender.com';

/* ── Comprehensive birth form voor alle systemen ── */
function BlueprintForm({ onSubmit }) {
  const CITIES = window.QP.places;
  const [name, setName]   = React.useState('');
  const [date, setDate]   = React.useState('');
  const [time, setTime]   = React.useState('');
  const [place, setPlace] = React.useState({
    name: `${CITIES[0].n}, ${CITIES[0].c}`,
    lat: CITIES[0].lat, lon: CITIES[0].lon, zone: CITIES[0].z,
  });
  const [gender, setGender] = React.useState('m');
  const [err, setErr] = React.useState('');

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return setErr('Vul je voornaam in.');
    if (!date) return setErr('Vul je geboortedatum in.');
    const [y, m, d] = date.split('-').map(Number);
    if (!y || !m || !d) return setErr('Controleer je geboortedatum.');

    let hour = null, minute = 0;
    if (time) {
      const [hh, mm] = time.split(':').map(Number);
      hour = hh; minute = mm || 0;
    }

    onSubmit({
      name: name.trim(), year: y, month: m, day: d,
      hour, minute, zone: place.zone,
      lat: place.lat, lon: place.lon, place: place.name,
      gender, hasExactTime: !!time,
    });
  }

  return (
    <div className="blueprint-form-wrap">
      <div className="hub-hero" style={{ paddingBottom: 24 }}>
        <div className="label">Het Stille Pad · Persoonlijk Rapport</div>
        <h1 style={{ marginTop: 18, fontSize: 'clamp(1.9rem,4vw,2.9rem)' }}>
          Jouw <em>Zielsblauwdruk</em>
        </h1>
        <p className="lede">
          Eén geboorteformulier. Vijf systemen berekend.
          Een persoonlijk rapport van 30-40 pagina's — geschreven over <em>jou</em>.
        </p>
        <div className="reassure" style={{ marginTop: 18 }}>
          <span><span className="dot"></span>Human Design</span>
          <span><span className="dot"></span>BaZi & Saju</span>
          <span><span className="dot"></span>Westerse astrologie</span>
          <span><span className="dot"></span>Numerologie</span>
        </div>
      </div>

      <form className="form-shell stack" style={{ '--g': '0px' }} onSubmit={submit}>
        <div className="field">
          <label>Jouw naam</label>
          <input className="input" value={name} autoComplete="off"
            onChange={e => setName(e.target.value)} placeholder="Voornaam" />
        </div>

        <div className="row">
          <div className="field">
            <label>Geboortedatum</label>
            <input className="input" type="date" value={date}
              min="1900-01-01" max="2035-12-31"
              onChange={e => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label>Geboortetijd <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(aanbevolen)</span></label>
            <input className="input" type="time" value={time}
              onChange={e => setTime(e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label>Geboorteplaats</label>
          <PlacePicker value={place} onChange={setPlace} />
          <div className="hint">Bepaalt tijdzone, ascendant en lokale zonnetijd voor BaZi.</div>
        </div>

        <div className="field">
          <label>Geslacht</label>
          <div className="segmented">
            <button type="button" className={gender === 'm' ? 'on' : ''} onClick={() => setGender('m')}>Man</button>
            <button type="button" className={gender === 'v' ? 'on' : ''} onClick={() => setGender('v')}>Vrouw</button>
          </div>
          <div className="hint">Gebruikt voor BaZi/Saju energierichting.</div>
        </div>

        {!time && (
          <div className="note-warn">
            Een exacte geboortetijd geeft een rijker rapport — ascendant, Human Design en BaZi uurpilaar
            zijn dan beschikbaar. Zonder tijd rekenen we op 12:00.
          </div>
        )}

        {err && (
          <div className="note-warn" style={{ borderColor: 'var(--el-Vuur)', background: 'oklch(0.93 0.04 33)' }}>
            {err}
          </div>
        )}

        <button className="btn btn-gold" type="submit"
          style={{ marginTop: 28, width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '16px 24px' }}>
          Bereken & genereer mijn Zielsblauwdruk →
        </button>
        <div className="center" style={{ marginTop: 12 }}>
          <span className="disc">Alle berekeningen gebeuren in je browser · rapport via beveiligde verbinding</span>
        </div>
      </form>
    </div>
  );
}

/* ── Laadscherm tijdens generatie ── */
function BlueprintLoading({ name }) {
  const steps = [
    'Human Design kaart berekenen…',
    'BaZi Vier Pilaren bepalen…',
    'Astrologie posities berekenen…',
    'Numerologie analyseren…',
    'Kruisverbanden leggen…',
    'Rapport schrijven…',
  ];
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setStep(i), i * 5500)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="blueprint-loading">
      <div className="bl-spinner"></div>
      <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, marginTop: 24 }}>
        Jouw Zielsblauwdruk wordt samengesteld{name ? `, ${name}` : ''}
      </h2>
      <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
        Dit duurt 30-60 seconden — we analyseren vijf systemen tegelijk.
      </p>
      <div className="bl-steps">
        {steps.map((s, i) => (
          <div key={i} className={'bl-step' + (i < step ? ' done' : i === step ? ' active' : '')}>
            <span className="bl-dot"></span>
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Rapport weergave ── */
function BlueprintReport({ html, birth, onBack, onRetry }) {
  function printReport() {
    document.body.classList.add('premium-print');
    window.print();
    setTimeout(() => document.body.classList.remove('premium-print'), 500);
  }

  return (
    <div className="blueprint-report-wrap">
      <div className="blueprint-report-actions no-print">
        <button className="backlink" onClick={onBack}>← Terug</button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={onRetry}>Opnieuw genereren</button>
          <button className="btn btn-gold" onClick={printReport}>✦ Download PDF</button>
        </div>
      </div>

      <div className="blueprint-report"
        dangerouslySetInnerHTML={{ __html: html }} />

      <div className="blueprint-report-actions no-print" style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost btn-sm" onClick={onRetry}>Opnieuw genereren</button>
          <button className="btn btn-gold" onClick={printReport}>✦ Download PDF</button>
        </div>
      </div>
    </div>
  );
}

/* ── Hoofd Blueprint component ── */
function Blueprint({ ctx, onBack }) {
  const [phase, setPhase] = React.useState('form'); // form | loading | report | error
  const [reportHTML, setReportHTML] = React.useState('');
  const [currentBirth, setCurrentBirth] = React.useState(null);
  const [errMsg, setErrMsg] = React.useState('');

  async function generateReport(birth) {
    setCurrentBirth(birth);
    setPhase('loading');

    // Bereken alle systemen in de browser
    const systems = {};
    try {
      systems.humandesign = window.QP.humandesign.compute(birth);
    } catch(e) { console.warn('HD error:', e); }
    try {
      systems.bazi = window.QP.bazi.compute(birth);
    } catch(e) { console.warn('BaZi error:', e); }
    try {
      systems.saju = window.QP.bazi.computeSaju(birth);
    } catch(e) {}
    try {
      systems.astrology = window.QP.astrology.compute(birth);
    } catch(e) { console.warn('Astro error:', e); }
    try {
      systems.numerology = window.QP.numerology.compute(birth);
    } catch(e) { console.warn('Num error:', e); }

    // Stuur naar backend
    try {
      const res = await fetch(`${BACKEND_URL}/api/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birth, systems }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrMsg(data.error || 'Onbekende fout.');
        setPhase('error');
        return;
      }

      setReportHTML(data.report);
      setPhase('report');
      window.scrollTo(0, 0);

    } catch (e) {
      console.error(e);
      setErrMsg('Verbinding mislukt. Controleer je internetverbinding en probeer opnieuw.');
      setPhase('error');
    }
  }

  if (phase === 'form') {
    return <BlueprintForm onSubmit={generateReport} />;
  }

  if (phase === 'loading') {
    return <BlueprintLoading name={currentBirth?.name} />;
  }

  if (phase === 'error') {
    return (
      <div style={{ maxWidth: 560, margin: '60px auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, marginBottom: 16 }}>
          Rapport generatie mislukt
        </h2>
        <div className="note-warn" style={{ textAlign: 'left', marginBottom: 24 }}>{errMsg}</div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={onBack}>← Terug</button>
          <button className="btn btn-gold" onClick={() => generateReport(currentBirth)}>
            Opnieuw proberen →
          </button>
        </div>
      </div>
    );
  }

  return (
    <BlueprintReport
      html={reportHTML}
      birth={currentBirth}
      onBack={onBack}
      onRetry={() => generateReport(currentBirth)}
    />
  );
}

window.Blueprint = Blueprint;
window.BlueprintForm = BlueprintForm;
