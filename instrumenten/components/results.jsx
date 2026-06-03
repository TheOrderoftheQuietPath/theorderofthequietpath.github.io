/* results.jsx — resultaatweergaven per tool + gedeelde stukken */

const CONTACT_URL = 'https://theorderofthequietpath.github.io/#contact';
const EL_VAR = { Hout: 'var(--el-Hout)', Vuur: 'var(--el-Vuur)', Aarde: 'var(--el-Aarde)', Metaal: 'var(--el-Metaal)', Water: 'var(--el-Water)' };

/* ------------ Premium gate ------------ */
function PremiumGate({ ctx, label, children }) {
  const premium = ctx && ctx.premium;
  if (premium) return <>{children}</>;
  return (
    <div className="premium-gate">
      <div className="gate-blur" aria-hidden="true">{children}</div>
      <div className="gate-overlay">
        <div className="gate-badge">✦ Premium</div>
        {label && <p className="gate-label">{label}</p>}
        <button className="btn btn-gold btn-sm" onClick={() => ctx && ctx.onUnlock()}>
          Ontgrendel volledig rapport →
        </button>
      </div>
    </div>
  );
}

/* ------------ Grote Gelukspilaren (BaZi/Saju) ------------ */
function LuckCyclePillars({ cycles, withInterpretation }) {
  const C = window.QP.content;
  return (
    <div className={withInterpretation ? 'luck-cycles-rich' : 'luck-cycles'}>
      {cycles.map((c, i) => {
        const interp = withInterpretation && C.luckStemInterpretations && C.luckStemInterpretations[c.pillar.stem.cn];
        if (withInterpretation) {
          return (
            <div key={i} className="luck-rich-item">
              <div className="lri-header">
                <div className="lri-age">{c.age}+</div>
                <div className="lri-cn" style={{ color: EL_VAR[c.pillar.stem.el] }}>{c.pillar.cn}</div>
                <div className="lri-meta">
                  <div className="lri-title" style={{ color: EL_VAR[c.pillar.stem.el] }}>{interp ? interp.title : `${c.pillar.stem.pol} ${c.pillar.stem.el}`}</div>
                  <div className="lri-year">{c.yearRange} · {c.pillar.branch.an}</div>
                </div>
              </div>
              {interp && <div className="lri-body">{interp.body}</div>}
            </div>
          );
        }
        return (
          <div key={i} className="luck-pillar">
            <div className="lp-age">{c.age}+</div>
            <div className="lp-year">{c.yearRange}</div>
            <div className="lp-cn" style={{ color: EL_VAR[c.pillar.stem.el] }}>{c.pillar.cn}</div>
            <div className="lp-py">{c.pillar.py}</div>
            <div className="lp-el" style={{ color: EL_VAR[c.pillar.stem.el] }}>{c.pillar.stem.pol} {c.pillar.stem.el}</div>
            <div className="lp-an">{c.pillar.branch.an}</div>
          </div>
        );
      })}
    </div>
  );
}

function LuckCycles({ luckCycles, ctx }) {
  if (!luckCycles) return null;
  const { startAge, forward, cycles } = luckCycles;
  const free = cycles.slice(0, 4);
  const locked = cycles.slice(4);
  return (
    <Reveal title="Grote Gelukspilaren — je levensritme per 10 jaar">
      <p style={{ marginBottom: 16, color: 'var(--ink-soft)' }}>
        Je eerste gelukspilaar begint op leeftijd <b style={{ color: 'var(--ink)' }}>{Math.floor(startAge)}</b> jaar.
        De pilaren bewegen <b style={{ color: 'var(--ink)' }}>{forward ? 'voorwaarts' : 'achterwaarts'}</b> door de 60-cyclus —
        elke periode van 10 jaar brengt een nieuw elementair thema.
      </p>
      <LuckCyclePillars cycles={free} />
      {locked.length > 0 && (
        <PremiumGate ctx={ctx} label="Volledige interpretatie van alle 8 gelukspilaren — wat elke decade voor jou betekent">
          <LuckCyclePillars cycles={cycles} withInterpretation />
        </PremiumGate>
      )}
      <p className="disc" style={{ marginTop: 14 }}>
        Berekend op basis van de afstand tot de volgende jie-grens op je geboortedatum. 3 dagen = 1 levensjaar.
      </p>
    </Reveal>
  );
}

/* ------------ Geactiveerde HD kanalen ------------ */
function ChannelItems({ channels }) {
  const C = window.QP.content;
  return (
    <div className="channel-list">
      {channels.map((ch, i) => {
        const desc = C.hdChannels && C.hdChannels[ch.name];
        return (
          <div key={i} className="channel-item">
            <div className="ch-header">
              <span className="ch-name">{ch.name}</span>
              <span className="ch-gates">{ch.a}–{ch.b} · {window.QP.hdData.CENTERS[ch.centers[0]].label}↔{window.QP.hdData.CENTERS[ch.centers[1]].label}</span>
            </div>
            {desc && <div className="ch-desc">{desc}</div>}
          </div>
        );
      })}
    </div>
  );
}

function ChannelList({ channels, ctx }) {
  if (!channels || channels.length === 0) return null;
  const free = channels.slice(0, 2);
  const locked = channels.slice(2);
  return (
    <Reveal title={`Geactiveerde kanalen (${channels.length})`}>
      <p style={{ marginBottom: 16, color: 'var(--ink-soft)' }}>
        Kanalen verbinden twee centra volledig en creëren een consistente, betrouwbare kwaliteit in je ontwerp.
      </p>
      <ChannelItems channels={free} />
      {locked.length > 0 && (
        <PremiumGate ctx={ctx} label={`${locked.length} verdere kanalen met volledige beschrijving`}>
          <ChannelItems channels={locked} />
        </PremiumGate>
      )}
    </Reveal>
  );
}

/* ------------ Astrologische aspecten ------------ */
function computeAspects(positions) {
  const ASPECTS = [
    { name: 'Conjunctie', angle: 0,   orb: 8, color: 'var(--gold-deep)',  glyph: '☌', harmony: true  },
    { name: 'Trigoon',    angle: 120,  orb: 7, color: 'var(--el-Hout)',   glyph: '△', harmony: true  },
    { name: 'Sextiel',    angle: 60,   orb: 5, color: 'var(--el-Water)',  glyph: '⚹', harmony: true  },
    { name: 'Oppositie',  angle: 180,  orb: 8, color: 'var(--el-Vuur)',   glyph: '☍', harmony: false },
    { name: 'Vierkant',   angle: 90,   orb: 6, color: 'var(--el-Vuur)',   glyph: '□', harmony: false },
  ];
  const results = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const raw = ((positions[i].lon - positions[j].lon) % 360 + 360) % 360;
      const angle = raw > 180 ? 360 - raw : raw;
      for (const asp of ASPECTS) {
        const orb = Math.abs(angle - asp.angle);
        if (orb <= asp.orb) {
          results.push({ p1: positions[i], p2: positions[j], aspect: asp, orb: Math.round(orb * 10) / 10 });
          break;
        }
      }
    }
  }
  return results.sort((a, b) => a.orb - b.orb).slice(0, 14);
}

function AspectRows({ aspects, withMeaning }) {
  const C = window.QP.content;
  return (
    <div className="aspect-list">
      {aspects.map((a, i) => (
        <div key={i} className={withMeaning ? 'aspect-row aspect-row-rich' : 'aspect-row'}>
          <span className="asp-glyph" style={{ color: a.aspect.color }}>{a.aspect.glyph}</span>
          <span className="asp-planets">{a.p1.glyph} {a.p1.nl} — {a.p2.glyph} {a.p2.nl}</span>
          <span className="asp-name" style={{ color: a.aspect.color }}>{a.aspect.name}</span>
          <span className="asp-orb">{a.orb}°</span>
          {withMeaning && C.aspectMeanings && C.planetMeanings && (
            <div className="asp-meaning">
              <b>{a.p1.nl} en {a.p2.nl}</b> — {C.planetMeanings[a.p1.key] || a.p1.nl} ontmoet {C.planetMeanings[a.p2.key] || a.p2.nl}.{' '}
              {C.aspectMeanings[a.aspect.name]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AspectList({ positions, ctx }) {
  const aspects = computeAspects(positions);
  if (aspects.length === 0) return null;
  const free = aspects.slice(0, 3);
  const locked = aspects.slice(3);
  return (
    <Reveal title="Aspecten — hoe je planeten met elkaar praten">
      <p style={{ marginBottom: 14, color: 'var(--ink-soft)' }}>
        Aspecten zijn de hoekrelaties tussen planeten. Harmonische aspecten (△ ⚹ ☌) vloeien mee;
        uitdagende aspecten (□ ☍) creëren spanning die groei aanjaagt.
      </p>
      <AspectRows aspects={free} />
      {locked.length > 0 && (
        <PremiumGate ctx={ctx} label="Volledige aspect-analyse — wat elk planetair gesprek voor jou betekent">
          <AspectRows aspects={aspects} withMeaning />
        </PremiumGate>
      )}
    </Reveal>
  );
}

function Reveal({ title, children, open }) {
  return (
    <details className="disclosure" open={open}>
      <summary><h4>{title}</h4><span className="plus">+</span></summary>
      <div className="body">{children}</div>
    </details>
  );
}

function CTA({ label, title, text, button }) {
  return (
    <div className="cta">
      <div className="label">{label}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <a className="btn btn-gold" href={CONTACT_URL} target="_blank" rel="noopener">{button} →</a>
    </div>
  );
}

function HeroStat({ items }) {
  return (
    <div className="hero-stat">
      {items.map((it, i) => (
        <div className="cell" key={i}>
          <div className="k">{it.k}</div>
          <div className="v">{it.v} {it.sub && <small>{it.sub}</small>}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Human Design ---------------- */
function HDResult({ data, ctx }) {
  const C = window.QP.content;
  const t = C.hdTypes[data.type] || {};
  const pl = data.profile.split('/').map(Number);
  return (
    <div className="fade-in">
      <HeroStat items={[
        { k: 'Type', v: data.type },
        { k: 'Strategie', v: data.strategy },
        { k: 'Autoriteit', v: data.authority },
        { k: 'Profiel', v: data.profile },
        { k: 'Definitie', v: data.definition },
      ]} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 340px) 1fr', gap: 36, marginTop: 30, alignItems: 'start' }} className="hd-split">
        <Bodygraph centers={data.centers} channels={data.channels} />
        <div className="explain" style={{ marginTop: 0 }}>
          <p className="lead">{t.tagline}</p>
          <p style={{ marginTop: 16 }}>{t.plain}</p>
          <p className="disc" style={{ marginTop: 14 }}>{t.pct} · berekend met een professionele efemeride · een exacte geboortetijd blijft bepalend</p>
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        <Reveal title="Je strategie — hoe je correct handelt" open>
          <p><b>{data.strategy}.</b> {t.strategyWhy}</p>
        </Reveal>
        <Reveal title={`Je autoriteit — ${data.authority}`}>
          <p>{C.hdAuthority[data.authority]}</p>
        </Reveal>
        <Reveal title={`Je profiel — ${data.profile}`}>
          <p style={{ marginBottom: 10 }}>Je profiel is de combinatie van twee lijnen: hoe je naar binnen leeft (bewust) en hoe je naar buiten werkt (onbewust).</p>
          {pl.map((line, i) => (
            <p key={i} style={{ marginTop: 8 }}>
              <b>Lijn {line} — {C.hdProfileLines[line].name}:</b> {C.hdProfileLines[line].text}
            </p>
          ))}
        </Reveal>
        <Reveal title="Gedefinieerde & open centra">
          <p style={{ marginBottom: 12 }}>Gedefinieerde centra zijn vast en betrouwbaar in jou. Open centra zijn waar je gevoelig bent, leert en de energie van anderen oppikt — vaak je grootste wijsheid én je grootste conditionering.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div>
              <div className="mono" style={{ color: 'var(--gold-deep)', marginBottom: 8 }}>Gedefinieerd</div>
              {data.centers.map((c) => <div key={c} style={{ fontSize: '0.9rem' }}>{window.QP.hdData.CENTERS[c].label} — <span style={{ color: 'var(--muted)' }}>{C.hdCenters[c]}</span></div>)}
            </div>
            <div>
              <div className="mono" style={{ marginBottom: 8 }}>Open</div>
              {Object.keys(window.QP.hdData.CENTERS).filter((c) => !data.centers.includes(c)).map((c) => <div key={c} style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>{window.QP.hdData.CENTERS[c].label}</div>)}
            </div>
          </div>
        </Reveal>
        <Reveal title="Incarnatiekruis — je levensthema">
          <p>Gevormd door je Zon en Aarde bij geboorte (bewust) en in je Design (onbewust): poorten <b>{data.cross.pSun}/{data.cross.pEarth}</b> en <b>{data.cross.dSun}/{data.cross.dEarth}</b>. Dit kruis beschrijft het overkoepelende thema van je leven — de rol die je hier komt vervullen.</p>
        </Reveal>
        <Reveal title="Planetaire activaties — de volledige kaart">
          <p style={{ marginBottom: 12 }}>Je bodygraph komt voort uit twee momenten: <b>Persoonlijkheid</b> (geboorte, bewust) en <b>Design</b> (~88° eerder, onbewust). Elke planeet activeert een poort.line.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '6px 18px', fontSize: '0.84rem', fontFamily: 'var(--mono)' }}>
            <div className="mono" style={{ color: 'var(--ink-soft)' }}>Planeet</div>
            <div className="mono" style={{ color: 'var(--gold-deep)', textAlign: 'right' }}>Design</div>
            <div className="mono" style={{ textAlign: 'right' }}>Persoonlijkheid</div>
            {data.planetOrder.map((p) => (
              <React.Fragment key={p}>
                <div>{data.planetGlyph[p]} {data.planetNL[p]}</div>
                <div style={{ textAlign: 'right', color: 'var(--gold-deep)' }}>{data.design[p].gate}.{data.design[p].line}</div>
                <div style={{ textAlign: 'right' }}>{data.personality[p].gate}.{data.personality[p].line}</div>
              </React.Fragment>
            ))}
          </div>
        </Reveal>
        <ChannelList channels={data.channels} ctx={ctx} />

        {(() => {
          const C = window.QP.content;
          const allCenters = Object.keys(window.QP.hdData.CENTERS);
          const openCenters = allCenters.filter((c) => !data.centers.includes(c));
          if (openCenters.length === 0 || !C.hdOpenCenters) return null;
          return (
            <PremiumGate ctx={ctx} label="Jouw open centra uitgelegd — wat je absorbeert, waar je valkuil ligt en waar je wijsheid zit">
              <div style={{ marginTop: 8 }}>
                <div className="label" style={{ marginBottom: 14 }}>Open centra — conditionering & wijsheid</div>
                <div className="open-centers-list">
                  {openCenters.map((c) => {
                    const oc = C.hdOpenCenters[c];
                    if (!oc) return null;
                    return (
                      <div key={c} className="oc-item">
                        <div className="oc-title">{oc.title}</div>
                        <div className="oc-body">{oc.body}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--gold-tint)', borderRadius: 'var(--r)', borderLeft: '2px solid var(--gold)' }}>
                  <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', margin: 0 }}>
                    <b style={{ color: 'var(--ink)' }}>Not-self thema:</b> {window.QP.content.hdTypes[data.type] ? `Als ${data.type} is je not-self thema: ${data.notSelf}. ` : ''} Dit gevoel geeft aan dat je handelt vanuit conditionering in plaats van vanuit je ware ontwerp.
                  </p>
                </div>
              </div>
            </PremiumGate>
          );
        })()}
      </div>

      <CTA label="Persoonlijke reading"
        title="Je bodygraph geduid in de context van jóuw leven"
        text="De calculator geeft je de ruwe kaart. Een persoonlijke Human Design reading vertaalt je type, strategie, autoriteit en kanalen naar hoe jij werkt, beslist en relaties aangaat — afgestemd op je echte vragen."
        button="Vraag een Human Design reading aan" />
    </div>
  );
}

/* ---------------- Pillars (BaZi/Saju) ---------------- */
function Pillars({ pillars, hasHour }) {
  const order = [['Jaar', pillars.year], ['Maand', pillars.month], ['Dag', pillars.day, true], ['Uur', hasHour ? pillars.hour : null]];
  return (
    <div className="pillars">
      {order.map(([label, p, master], i) => (
        <div key={i} className={'pillar' + (master ? ' master' : '')}>
          <div className="ptop">{label}{master ? ' · Dagmeester' : ''}</div>
          {p ? <>
            <div className="cn" style={{ color: EL_VAR[p.stem.el] }}>{p.cn}</div>
            <div className="py">{p.py}</div>
            <div className="el" style={{ color: EL_VAR[p.stem.el] }}>{p.stem.pol} {p.stem.el}</div>
            <div className="anim">{p.branch.an}</div>
          </> : <>
            <div className="cn" style={{ color: 'var(--faint)' }}>—</div>
            <div className="py" style={{ color: 'var(--muted)' }}>geen tijd</div>
          </>}
        </div>
      ))}
    </div>
  );
}

function Balance({ balance }) {
  const max = Math.max(...balance.map((b) => b.count), 1);
  return (
    <div className="balance">
      {balance.map((b) => (
        <div className="bal-row" key={b.el}>
          <div className="bn">{b.el}</div>
          <div className="bal-track">
            <div className="bal-fill" style={{ width: `${(b.count / max) * 100}%`, background: EL_VAR[b.el] }}></div>
          </div>
          <div className="bc">{b.count}</div>
        </div>
      ))}
    </div>
  );
}

function BaziLike({ data, korean, ctx }) {
  const C = window.QP.content;
  const dm = data.dayMaster;
  return (
    <div className="fade-in">
      <Pillars pillars={data.pillars} hasHour={data.hasHour} />
      {!data.hasHour && <p className="disc" style={{ marginTop: 12 }}>Zonder exacte geboortetijd ontbreekt de uurpilaar — vul je tijd in voor de volledige kaart.</p>}

      <div className="explain">
        <p className="lead">{C.dayMasterText(dm)}</p>
        <p style={{ marginTop: 14 }}>Je sterkste element is <b style={{ color: EL_VAR[data.strongest.el] }}>{data.strongest.el}</b> ({data.strongest.count} van de 8 tekens). {C.elements[data.strongest.el].plain}</p>
        {korean && <p style={{ marginTop: 14 }}>Als <b>{data.gender}</b> verlopen je gelukspilaren <b>{data.luckDirection}</b> in de tijd — Saju houdt rekening met geslacht voor de energierichting.</p>}
      </div>

      <Reveal title="Je elementbalans" open>
        <Balance balance={data.balance} />
        {data.missing.length > 0
          ? <p style={{ marginTop: 16 }}>Je hebt geen <b>{data.missing.join(' en ')}</b> in je kaart. Dat is geen gebrek — vaak zoek je die energie juist op in werk, mensen of omgeving. Een reading laat zien hoe je dat in balans brengt.</p>
          : <p style={{ marginTop: 16 }}>Alle vijf de elementen zijn aanwezig — een relatief evenwichtige kaart.</p>}
      </Reveal>
      <Reveal title="De vier pilaren uitgelegd">
        <p>Elke pilaar staat voor een laag van je leven: <b>Jaar</b> (afkomst, voorouders, de buitenwereld), <b>Maand</b> (ouders, carrière, je twintiger–veertiger jaren), <b>Dag</b> (jijzelf en je partner — de stam is je Dagmeester) en <b>Uur</b> (je kinderen, je latere leven, je innerlijke ambities). Samen vormen ze acht tekens: je "acht karakters".</p>
      </Reveal>

      <LuckCycles luckCycles={data.luckCycles} ctx={ctx} />

      <CTA label={korean ? 'Saju reading' : 'BaZi reading'}
        title={korean ? 'Wat zegt je Saju over karakter, relaties en timing?' : 'Je Dagmeester en je lopende gelukspilaren, geduid'}
        text={korean
          ? 'De gratis kaart toont je pilaren. Een persoonlijke Saju-lezing duidt je karakterstructuur, je relaties en de huidige levensperiode — met de Koreaanse interpretatiestijl.'
          : 'De gratis kaart toont je pilaren en elementbalans. Een persoonlijke BaZi-reading duikt in je Dagmeester en je gelukspilaren per tien jaar — van loopbaan tot relaties tot het beste moment om te handelen.'}
        button={korean ? 'Vraag een Saju reading aan' : 'Vraag een BaZi reading aan'} />
    </div>
  );
}

/* ---------------- Numerologie ---------------- */
function NumCard({ n, posKey }) {
  const C = window.QP.content;
  const meaning = C.numbers[n];
  return (
    <div className="num-card">
      <div className="nh">
        <div className="nbig">{n}</div>
        <div>
          <div className="nlab">{C.numberPositions[posKey].split(' — ')[0]}</div>
          <div className="ntitle">{meaning.title}</div>
        </div>
      </div>
      <div className="ntext">{meaning.essence}</div>
      <div className="npos">{C.numberPositions[posKey]}</div>
    </div>
  );
}

function NumerologyResult({ data, name, birth, ctx }) {
  const C = window.QP.content;
  const lp = C.numbers[data.lifePath];
  return (
    <div className="fade-in">
      <div className="explain" style={{ marginTop: 0, marginBottom: 24 }}>
        <p className="lead">Je Levenspad is <b style={{ color: 'var(--gold-deep)' }}>{data.lifePath} — {lp.title}</b>. {lp.essence}</p>
        <p style={{ marginTop: 12 }}><b>Gave:</b> {lp.gift} &nbsp;·&nbsp; <b>Schaduw:</b> {lp.shadow}</p>
      </div>
      <div className="num-grid">
        <NumCard n={data.lifePath} posKey="lifePath" />
        {data.hasName && <NumCard n={data.expression} posKey="expression" />}
        {data.hasName && <NumCard n={data.soulUrge} posKey="soulUrge" />}
        {data.hasName && <NumCard n={data.personality} posKey="personality" />}
        {!data.hasName && <NumCard n={data.birthday} posKey="birthday" />}
      </div>
      {!data.hasName && <p className="disc" style={{ marginTop: 14 }}>Vul je volledige naam in voor je Uitdrukkings-, Zielsdrang- en Persoonlijkheidsgetal.</p>}

      {birth && (() => {
        const nr = window.QP.numerology;
        const cy = new Date().getFullYear();
        const py = nr.reduce(nr.reduce(birth.day) + nr.reduce(birth.month) + nr.reduce(cy));
        const pm = nr.reduce(py + nr.reduce(birth.month));
        const C2 = window.QP.content;
        const pyData = C2.numbers[py];
        return (
          <PremiumGate ctx={ctx} label="Je persoonlijk jaar & maand — wat 2025 voor jou betekent">
            <div className="num-personal" style={{ marginTop: 20 }}>
              <div className="section-head" style={{ marginBottom: 14 }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 400 }}>Persoonlijk jaar {cy}</h3>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                <div className="num-card" style={{ flex: 1 }}>
                  <div className="nh"><div className="nbig">{py}</div><div><div className="nlab">Persoonlijk jaar</div><div className="ntitle">{pyData ? pyData.title : ''}</div></div></div>
                  <div className="ntext">{pyData ? pyData.essence : ''}</div>
                </div>
                <div className="num-card" style={{ flex: 1 }}>
                  <div className="nh"><div className="nbig">{pm}</div><div><div className="nlab">Persoonlijke maand</div><div className="ntitle">{C2.numbers[pm] ? C2.numbers[pm].title : ''}</div></div></div>
                  <div className="ntext">{C2.numbers[pm] ? C2.numbers[pm].essence : ''}</div>
                </div>
              </div>
            </div>
          </PremiumGate>
        );
      })()}

      <CTA label="Numerologie analyse"
        title="Je getallen spreken pas echt in hun samenspel"
        text="Een los getal is een woord; je volledige profiel is een zin. Een persoonlijke lezing duidt hoe je kerngetallen op elkaar inwerken — waar ze elkaar versterken en waar ze schuren."
        button="Vraag een numerologie-analyse aan" />
    </div>
  );
}

/* ---------------- Astrologie ---------------- */
function ChartWheel({ positions }) {
  const R = 130, cx = 150, cy = 150, inner = 96;
  const ang = (lon) => (180 - lon) * Math.PI / 180; // 0° Ram links
  const pt = (lon, r) => [cx + r * Math.cos(ang(lon)), cy - r * Math.sin(ang(lon))];
  const glyphs = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  return (
    <svg viewBox="0 0 300 300" width="260" height="260" style={{ flex: 'none' }}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--line-2)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={inner} fill="none" stroke="var(--line)" strokeWidth="1" />
      {Array.from({ length: 12 }).map((_, i) => {
        const [x1, y1] = pt(i * 30, inner);
        const [x2, y2] = pt(i * 30, R);
        const [gx, gy] = pt(i * 30 + 15, (R + inner) / 2);
        return <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--line)" strokeWidth="1" />
          <text x={gx} y={gy} fontSize="13" textAnchor="middle" dominantBaseline="central" fill="var(--muted)">{glyphs[i]}</text>
        </g>;
      })}
      {positions.map((p, i) => {
        const [x, y] = pt(p.lon, inner - 22);
        return <text key={i} x={x} y={y} fontSize="13" textAnchor="middle" dominantBaseline="central" fill="var(--ink)">{p.glyph}</text>;
      })}
      <circle cx={cx} cy={cy} r="2" fill="var(--gold)" />
    </svg>
  );
}

function AstrologyResult({ data, birth, ctx }) {
  const C = window.QP.content;
  const s = data.sun.sign;
  return (
    <div className="fade-in">
      <div className="wheel-wrap">
        <ChartWheel positions={data.positions} />
        <div className="bigthree">
          <div className="b3"><div className="k">Zon</div><div className="g">{data.sun.sign.glyph}</div><div className="s">{data.sun.sign.name}</div></div>
          <div className="b3"><div className="k">Maan</div><div className="g">{data.moon.sign.glyph}</div><div className="s">{data.moon.sign.name}</div></div>
          {data.ascendant && <div className="b3"><div className="k">Ascendant</div><div className="g">{data.ascendant.sign.glyph}</div><div className="s">{data.ascendant.sign.name}</div></div>}
        </div>
      </div>

      <div className="explain">
        <p className="lead">Je Zon staat in <b>{s.name}</b> {s.glyph} — {C.signs[s.name]}</p>
        <p style={{ marginTop: 12 }}>Dat maakt je in de kern <b>{C.elementAstro[s.element]}</b> ({s.element}) en <b>{C.modeAstro[s.mode]}</b> ({s.mode.toLowerCase()}). Je Zon is wie je in essentie bent; je Maan ({data.moon.sign.name}) kleurt je gevoelsleven{data.ascendant ? `, en je Ascendant (${data.ascendant.sign.name}) hoe je op anderen overkomt` : ''}.</p>
        <p className="disc" style={{ marginTop: 12 }}>Berekend met een echte efemeride (Astronomy Engine). De ascendant verschijnt alleen bij een exacte geboortetijd en plaats.</p>
      </div>

      <Reveal title="Je planeetposities" open>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
          {data.positions.map((p) => (
            <div key={p.key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid var(--line)', padding: '7px 0' }}>
              <span>{p.glyph} {p.nl}</span>
              <span style={{ color: 'var(--ink-soft)' }}>{p.sign.glyph} {p.sign.name} {Math.floor(p.sign.degree)}°</span>
            </div>
          ))}
        </div>
      </Reveal>

      <AspectList positions={data.positions} ctx={ctx} />

      <CTA label="Astrologische reading"
        title="Je horoscoop verbonden met je leven en je andere systemen"
        text="Een professionele reading legt je geboortehoroscoop naast je Human Design en BaZi — en laat zien waar de hemel, je type en je pilaren naar hetzelfde patroon wijzen."
        button="Vraag een astrologische reading aan" />
    </div>
  );
}

Object.assign(window, { Reveal, CTA, HeroStat, HDResult, BaziLike, NumerologyResult, AstrologyResult, ChartWheel, Pillars, Balance });
