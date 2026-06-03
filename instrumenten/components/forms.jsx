/* forms.jsx — herbruikbaar geboorteformulier met wereldwijde plaatskiezer */

function Label({ children }) { return <div className="label">{children}</div>; }

/* --- wereldwijde plaatskiezer met zoek + handmatige invoer --- */
function PlacePicker({ value, onChange }) {
  const CITIES = window.QP.places;
  const [query, setQuery] = React.useState(value ? `${value.name}` : '');
  const [open, setOpen] = React.useState(false);
  const [manual, setManual] = React.useState(false);
  const [lat, setLat] = React.useState('');
  const [lon, setLon] = React.useState('');
  const zones = React.useMemo(() => {
    try { return Intl.supportedValuesOf('timeZone'); } catch (e) { return ['UTC', 'Europe/Brussels', 'Asia/Shanghai', 'America/New_York', 'Asia/Tokyo']; }
  }, []);
  const [zone, setZone] = React.useState(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { return 'UTC'; }
  });

  const matches = (query.trim()
    ? CITIES.filter((c) => `${c.n} ${c.c}`.toLowerCase().includes(query.toLowerCase()))
    : CITIES).slice(0, 9);

  function selectCity(c) {
    onChange({ name: `${c.n}, ${c.c}`, lat: c.lat, lon: c.lon, zone: c.z });
    setQuery(`${c.n}, ${c.c}`); setOpen(false);
  }
  function applyManual(nlat, nlon, nzone) {
    const la = parseFloat(nlat), lo = parseFloat(nlon);
    if (!isNaN(la) && !isNaN(lo) && nzone) {
      onChange({ name: `${la.toFixed(2)}°, ${lo.toFixed(2)}° · ${nzone.split('/').pop().replace(/_/g, ' ')}`, lat: la, lon: lo, zone: nzone });
    }
  }

  if (manual) {
    return (
      <div>
        <div className="row">
          <div>
            <input className="input" type="number" step="0.01" placeholder="Breedte (bv. 50.85)" value={lat}
              onChange={(e) => { setLat(e.target.value); applyManual(e.target.value, lon, zone); }} />
            <div className="hint">Noord = +, Zuid = −</div>
          </div>
          <div>
            <input className="input" type="number" step="0.01" placeholder="Lengte (bv. 4.35)" value={lon}
              onChange={(e) => { setLon(e.target.value); applyManual(lat, e.target.value, zone); }} />
            <div className="hint">Oost = +, West = −</div>
          </div>
        </div>
        <select className="select" style={{ marginTop: 12 }} value={zone}
          onChange={(e) => { setZone(e.target.value); applyManual(lat, lon, e.target.value); }}>
          {zones.map((z) => <option key={z} value={z}>{z.replace(/_/g, ' ')}</option>)}
        </select>
        <button type="button" className="backlink" style={{ marginTop: 12 }}
          onClick={() => { setManual(false); }}>← Kies uit de lijst</button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <input className="input" value={query} placeholder="Zoek stad of land…" autoComplete="off"
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)} />
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20, marginTop: 4,
          background: 'var(--card)', border: '1px solid var(--line-2)', borderRadius: 'var(--r)',
          boxShadow: '0 14px 32px -16px oklch(0.3 0.03 270 / 0.5)', overflow: 'hidden',
        }}>
          {matches.map((c, i) => (
            <div key={i} onMouseDown={(e) => { e.preventDefault(); selectCity(c); }}
              style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--paper-2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              <span style={{ fontSize: '0.92rem' }}>{c.n}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{c.c}</span>
            </div>
          ))}
          <div onMouseDown={(e) => { e.preventDefault(); setManual(true); setOpen(false); }}
            style={{ padding: '11px 14px', cursor: 'pointer', fontSize: '0.84rem', color: 'var(--gold-deep)', fontWeight: 600 }}>
            + Andere locatie (handmatige coördinaten)
          </div>
        </div>
      )}
    </div>
  );
}

function BirthForm({ tool, fields, requireTime, onSubmit, submitLabel }) {
  const CITIES = window.QP.places;
  const [name, setName] = React.useState('');
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [place, setPlace] = React.useState({ name: `${CITIES[0].n}, ${CITIES[0].c}`, lat: CITIES[0].lat, lon: CITIES[0].lon, zone: CITIES[0].z });
  const [gender, setGender] = React.useState('m');
  const [err, setErr] = React.useState('');

  const show = (f) => fields.includes(f);

  function submit(e) {
    e.preventDefault();
    if (show('name') && fields.includes('nameRequired') && !name.trim()) return setErr('Vul je volledige naam in.');
    if (!date) return setErr('Vul je geboortedatum in.');
    const [y, m, d] = date.split('-').map(Number);
    if (!y || !m || !d) return setErr('Controleer je geboortedatum.');

    let hour = null, minute = 0;
    if (time) { const [hh, mm] = time.split(':').map(Number); hour = hh; minute = mm || 0; }
    if (requireTime && hour == null) hour = 12;

    const birth = {
      name: name.trim(), year: y, month: m, day: d,
      hour: hour == null ? null : hour, minute,
      zone: place.zone, lat: place.lat, lon: place.lon, place: place.name,
      gender, hasExactTime: !!time,
    };
    onSubmit(birth);
  }

  return (
    <form className="form-shell stack" style={{ '--g': '0px' }} onSubmit={submit}>
      {show('name') && (
        <div className="field">
          <label>{fields.includes('nameRequired') ? 'Volledige naam (zoals op je geboorteakte)' : 'Naam (optioneel)'}</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Voornaam Achternaam" autoComplete="off" />
          {fields.includes('nameRequired') && <div className="hint">Numerologie rekent met elke letter — gebruik je volledige naam.</div>}
        </div>
      )}

      <div className="row">
        <div className="field">
          <label>Geboortedatum</label>
          <input className="input" type="date" value={date} min="1900-01-01" max="2035-12-31" onChange={(e) => setDate(e.target.value)} />
        </div>
        {show('time') && (
          <div className="field">
            <label>Geboortetijd {requireTime ? '' : '(optioneel)'}</label>
            <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        )}
      </div>

      {show('place') && (
        <div className="field">
          <label>Geboorteplaats</label>
          <PlacePicker value={place} onChange={setPlace} />
          <div className="hint">Wereldwijd. Bepaalt tijdzone{fields.includes('ascendant') ? ', ascendant' : ''}{tool && (tool.id === 'bazi' || tool.id === 'saju') ? ' en lokale zonnetijd' : ''}.</div>
        </div>
      )}

      {show('gender') && (
        <div className="field">
          <label>Geslacht (voor energierichting)</label>
          <div className="segmented">
            <button type="button" className={gender === 'm' ? 'on' : ''} onClick={() => setGender('m')}>Man</button>
            <button type="button" className={gender === 'v' ? 'on' : ''} onClick={() => setGender('v')}>Vrouw</button>
          </div>
        </div>
      )}

      {requireTime && (
        <div className="note-warn">
          Een exacte geboortetijd is essentieel — zelfs één uur verschil kan je uitkomst wijzigen.
          Geen tijd ingevuld? Dan rekenen we op 12:00, en is het resultaat indicatief.
        </div>
      )}

      {err && <div className="note-warn" style={{ borderColor: 'var(--el-Vuur)', background: 'oklch(0.93 0.04 33)' }}>{err}</div>}

      <button className="btn btn-gold" type="submit" style={{ marginTop: 26, width: '100%', justifyContent: 'center' }}>
        {submitLabel || 'Onthul mijn resultaat'} →
      </button>
      <div className="center" style={{ marginTop: 14 }}>
        <span className="disc">Gratis · geen account · niets wordt opgeslagen op een server</span>
      </div>
    </form>
  );
}

window.BirthForm = BirthForm;
window.PlacePicker = PlacePicker;
window.QPLabel = Label;
