/* blueprint.jsx — Zielsblauwdruk bestelflow */

const BACKEND_URL = window.QP_BACKEND_URL || 'https://toqp-backend.onrender.com';

const REPORTS = [
  {
    id: 'full',
    name: 'Persoonlijk Zielsblauwdruk',
    subtitle: 'Alle vijf systemen gecombineerd',
    price: '€39',
    gumroad: 'https://toqp.gumroad.com/l/Blauwdrukvandeziel',
    pages: '30–40 pagina\'s',
    description: 'Eén coherent rapport dat Human Design, BaZi, Astrologie, Saju en Numerologie combineert tot jouw persoonlijk levensverhaal.',
    highlight: true,
  },
  {
    id: 'humandesign',
    name: 'Human Design',
    subtitle: 'Type · Autoriteit · Kanalen · Centra',
    price: '€15',
    gumroad: 'https://toqp.gumroad.com/l/HumanDesignRapport',
    pages: '15–20 pagina\'s',
    description: 'Diepgaand rapport over jouw energietype, strategie, autoriteit, profiel, alle centra en kanalen.',
  },
  {
    id: 'astrology',
    name: 'Westerse Astrologie',
    subtitle: 'Zon · Maan · Ascendant · Planeten',
    price: '€15',
    gumroad: 'https://toqp.gumroad.com/l/AstrologieRapport',
    pages: '12–18 pagina\'s',
    description: 'Volledig rapport over je geboortehoroscoop — alle planeten, aspecten en wat ze zeggen over je karakter en leven.',
  },
  {
    id: 'bazi',
    name: 'BaZi — Vier Pilaren',
    subtitle: 'Dagmeester · Elementen · Gelukspilaren',
    price: '€12',
    gumroad: 'https://toqp.gumroad.com/l/BaZiRapport',
    pages: '12–16 pagina\'s',
    description: 'Je geboortepatroon in vier pilaren — dagmeester, elementbalans en alle gelukspilaren decade per decade.',
  },
  {
    id: 'saju',
    name: 'Saju — Koreaanse Vier Pilaren',
    subtitle: 'Karakter · Relaties · Timing',
    price: '€12',
    gumroad: 'https://toqp.gumroad.com/l/SajuRapport',
    pages: '12–16 pagina\'s',
    description: 'Dezelfde vier pilaren als BaZi, maar in de Koreaanse stijl — met nadruk op karakter, relaties en geslachtsgebonden energierichting.',
  },
  {
    id: 'numerology',
    name: 'Numerologie',
    subtitle: 'Levenspad · Uitdrukking · Zielsdrang',
    price: '€9',
    gumroad: 'https://toqp.gumroad.com/l/NumerologieRapport',
    pages: '8–12 pagina\'s',
    description: 'Jouw kerngetallen en hoe ze samenwerken — levenspad, uitdrukking, zielsdrang, persoonlijkheid en persoonlijk jaar.',
  },
];

/* ── Rapport kiezen ── */
function ReportPicker({ selected, onSelect }) {
  return (
    <div className="report-picker">
      {REPORTS.map((r) => (
        <div key={r.id}
          className={'rp-card' + (selected === r.id ? ' selected' : '') + (r.highlight ? ' highlight' : '')}
          onClick={() => onSelect(r.id)}>
          {r.highlight && <div className="rp-badge">Meest volledig</div>}
          <div className="rp-header">
            <div>
              <div className="rp-name">{r.name}</div>
              <div className="rp-sub">{r.subtitle}</div>
            </div>
            <div className="rp-price">{r.price}</div>
          </div>
          <div className="rp-desc">{r.description}</div>
          <div className="rp-pages">{r.pages}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Bestelformulier ── */
function OrderForm({ onSubmit }) {
  const CITIES = window.QP.places;
  const [reportId, setReportId] = React.useState('full');
  const [step, setStep]         = React.useState(1); // 1 = kies, 2 = betaal, 3 = gegevens
  const [name, setName]         = React.useState('');
  const [date, setDate]         = React.useState('');
  const [time, setTime]         = React.useState('');
  const [place, setPlace]       = React.useState({
    name: `${CITIES[0].n}, ${CITIES[0].c}`,
    lat: CITIES[0].lat, lon: CITIES[0].lon, zone: CITIES[0].z,
  });
  const [gender, setGender]     = React.useState('m');
  const [email, setEmail]       = React.useState('');
  const [err, setErr]           = React.useState('');
  const [loading, setLoading]   = React.useState(false);

  const report = REPORTS.find(r => r.id === reportId);

  function goToPay() {
    if (!reportId) return setErr('Kies een rapport.');
    setErr('');
    setStep(2);
  }

  function openGumroad() {
    window.open(report.gumroad, '_blank', 'noopener');
  }

  async function submitOrder(e) {
    e.preventDefault();
    if (!name.trim())  return setErr('Vul je naam in.');
    if (!email.trim()) return setErr('Vul je e-mailadres in.');
    if (!date)         return setErr('Vul je geboortedatum in.');

    const [y, m, d] = date.split('-').map(Number);
    let hour = null, minute = 0;
    if (time) { const [hh, mm] = time.split(':').map(Number); hour = hh; minute = mm || 0; }

    const birth = {
      name: name.trim(), year: y, month: m, day: d,
      hour, minute, zone: place.zone, lat: place.lat, lon: place.lon,
      place: place.name, gender, hasExactTime: !!time,
    };

    // Bereken systemen in de browser
    const systems = {};
    try { systems.humandesign = window.QP.humandesign.compute(birth); } catch(e) {}
    try { systems.bazi        = window.QP.bazi.compute(birth);        } catch(e) {}
    try { systems.saju        = window.QP.bazi.computeSaju(birth);    } catch(e) {}
    try { systems.astrology   = window.QP.astrology.compute(birth);   } catch(e) {}
    try { systems.numerology  = window.QP.numerology.compute(birth);  } catch(e) {}

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birth, systems, reportType: reportId, customerEmail: email }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || 'Fout bij verzenden.'); setLoading(false); return; }
      onSubmit({ name: name.trim(), email, rapportNaam: report.name });
    } catch(e) {
      setErr('Verbinding mislukt. Probeer opnieuw.');
      setLoading(false);
    }
  }

  // Stap 1: Kies rapport
  if (step === 1) return (
    <div className="blueprint-form-wrap">
      <div className="hub-hero" style={{ paddingBottom: 20 }}>
        <div className="label">Het Stille Pad · Persoonlijke Rapporten</div>
        <h1 style={{ marginTop: 16, fontSize: 'clamp(1.8rem,4vw,2.7rem)' }}>
          Kies jouw <em>rapport</em>
        </h1>
        <p className="lede">Geschreven over jou. Verstuurd naar je e-mail. Binnen 24 uur.</p>
      </div>
      <ReportPicker selected={reportId} onSelect={setReportId} />
      {err && <div className="note-warn" style={{ marginTop: 16 }}>{err}</div>}
      <button className="btn btn-gold" onClick={goToPay}
        style={{ marginTop: 24, width: '100%', justifyContent: 'center', padding: '16px 24px' }}>
        Verder met {report?.name} ({report?.price}) →
      </button>
    </div>
  );

  // Stap 2: Betalen
  if (step === 2) return (
    <div className="blueprint-form-wrap">
      <button className="backlink" style={{ marginBottom: 24 }} onClick={() => setStep(1)}>← Terug</button>
      <div className="order-step-card">
        <div className="ost-num">Stap 1</div>
        <h2>Betaal via Gumroad</h2>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 20 }}>
          Klik op de knop om naar de beveiligde betaalpagina te gaan.
          Na betaling kom je automatisch terug om je gegevens in te vullen.
        </p>
        <div className="order-summary">
          <span>{report.name}</span>
          <strong>{report.price}</strong>
        </div>
        <button className="btn btn-gold" onClick={openGumroad}
          style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}>
          Betaal {report.price} via Gumroad →
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }}></div>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>al betaald?</span>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }}></div>
        </div>
        <button className="btn btn-ghost" onClick={() => setStep(3)}
          style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>
          Ik heb betaald — vul mijn gegevens in →
        </button>
      </div>
    </div>
  );

  // Stap 3: Geboortegegevens
  return (
    <div className="blueprint-form-wrap">
      <button className="backlink" style={{ marginBottom: 24 }} onClick={() => setStep(2)}>← Terug</button>
      <div className="order-step-card">
        <div className="ost-num">Stap 2</div>
        <h2>Jouw geboortegegevens</h2>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 20 }}>
          We gebruiken deze gegevens uitsluitend voor het opstellen van jouw rapport.
        </p>
      </div>

      <form className="form-shell stack" style={{ '--g': '0px', marginTop: 24 }} onSubmit={submitOrder}>
        <div className="field">
          <label>Jouw naam</label>
          <input className="input" value={name} autoComplete="off"
            onChange={e => setName(e.target.value)} placeholder="Voornaam (of volledige naam)" />
        </div>

        <div className="field">
          <label>E-mailadres <span style={{ color: 'var(--el-Vuur)', fontSize: '0.8rem' }}>zelfde als bij Gumroad</span></label>
          <input className="input" type="email" value={email}
            onChange={e => setEmail(e.target.value)} placeholder="jouw@email.com" />
          <div className="hint">Hier ontvang je het rapport.</div>
        </div>

        <div className="row">
          <div className="field">
            <label>Geboortedatum</label>
            <input className="input" type="date" value={date}
              min="1900-01-01" max="2035-12-31" onChange={e => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label>Geboortetijd <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(aanbevolen)</span></label>
            <input className="input" type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label>Geboorteplaats</label>
          <PlacePicker value={place} onChange={setPlace} />
        </div>

        <div className="field">
          <label>Geslacht</label>
          <div className="segmented">
            <button type="button" className={gender === 'm' ? 'on' : ''} onClick={() => setGender('m')}>Man</button>
            <button type="button" className={gender === 'v' ? 'on' : ''} onClick={() => setGender('v')}>Vrouw</button>
          </div>
        </div>

        {!time && (
          <div className="note-warn">
            Een exacte geboortetijd geeft een rijker rapport — ascendant en uurpilaar zijn dan beschikbaar.
          </div>
        )}

        {err && <div className="note-warn" style={{ borderColor: 'var(--el-Vuur)', background: 'oklch(0.93 0.04 33)' }}>{err}</div>}

        <button className="btn btn-gold" type="submit" disabled={loading}
          style={{ marginTop: 28, width: '100%', justifyContent: 'center', padding: '16px 24px' }}>
          {loading ? 'Bevestiging verzenden…' : 'Verstuur mijn bestelling →'}
        </button>
        <div className="center" style={{ marginTop: 12 }}>
          <span className="disc">Jouw gegevens worden enkel gebruikt voor dit rapport · nooit gedeeld</span>
        </div>
      </form>
    </div>
  );
}

/* ── Bevestigingspagina ── */
function OrderConfirmation({ name, email, rapportNaam, onBack }) {
  return (
    <div className="blueprint-loading" style={{ textAlign: 'center', maxWidth: 500, margin: '60px auto', padding: '0 20px' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 20 }}>✦</div>
      <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: '1.8rem', marginBottom: 12 }}>
        Bedankt, {name}.
      </h2>
      <p style={{ color: 'var(--ink-soft)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 8 }}>
        Je bestelling voor het <strong>{rapportNaam}</strong> is ontvangen.
      </p>
      <p style={{ color: 'var(--ink-soft)', fontSize: '1rem', lineHeight: 1.7 }}>
        Je ontvangt jouw persoonlijk rapport <strong>binnen 24 uur</strong> op <strong>{email}</strong>.
      </p>
      <div style={{
        marginTop: 32, padding: '20px 24px', background: 'var(--gold-tint)',
        border: '1px solid var(--gold)', borderRadius: 'var(--r)',
        fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--ink-soft)',
        fontSize: '0.95rem',
      }}>
        "Jij bent niet kapot. Jij bent ongelezen."
      </div>
      <button className="backlink" style={{ marginTop: 28 }} onClick={onBack}>← Terug naar instrumenten</button>
    </div>
  );
}

/* ── Hoofd Blueprint component ── */
function Blueprint({ ctx, onBack }) {
  const [phase, setPhase]     = React.useState('form'); // form | confirmed
  const [orderInfo, setOrder] = React.useState(null);

  if (phase === 'confirmed') {
    return <OrderConfirmation
      name={orderInfo.name}
      email={orderInfo.email}
      rapportNaam={orderInfo.rapportNaam}
      onBack={onBack} />;
  }

  return (
    <OrderForm onSubmit={(info) => { setOrder(info); setPhase('confirmed'); }} />
  );
}

window.Blueprint = Blueprint;
