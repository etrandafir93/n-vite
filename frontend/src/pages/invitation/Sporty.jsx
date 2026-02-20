import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const wd = d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })
  const rest = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  return `${wd}, ${rest}`
}

const css = `
  .spt-page * { box-sizing: border-box; margin: 0; padding: 0; }
  .spt-page { font-family: 'Inter', system-ui, sans-serif; background: #0d1b2a; color: #e8f0f8; scroll-behavior: smooth; }

  /* Hero – full bleed split layout on desktop, stacked on mobile */
  .spt-hero {
    position: relative; min-height: 100svh; display: grid;
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 720px) { .spt-hero { grid-template-columns: 1fr; } }

  .spt-hero__photo-side {
    position: relative; min-height: 50svh; overflow: hidden;
  }
  .spt-hero__photo-side img {
    width: 100%; height: 100%; object-fit: cover; object-position: center;
    display: block;
  }
  .spt-hero__photo-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(13,27,42,0.5) 0%, rgba(13,27,42,0.1) 100%);
  }

  .spt-hero__text-side {
    background: #0d1b2a; display: flex; flex-direction: column; justify-content: center;
    padding: clamp(2.5rem,6vw,5rem) clamp(2rem,5vw,4rem);
    border-left: 1px solid #1e3450;
  }
  @media (max-width: 720px) {
    .spt-hero__text-side { padding: 2.5rem 1.5rem 3rem; border-left: none; border-top: 3px solid #f5a623; }
  }

  .spt-hero__eyebrow {
    font-size: 0.6rem; font-weight: 700; letter-spacing: 0.35em; text-transform: uppercase;
    color: #f5a623; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;
  }
  .spt-hero__eyebrow::before { content: ''; display: block; width: 32px; height: 2px; background: #f5a623; }

  .spt-hero__names {
    font-size: clamp(2.4rem,5vw,4rem); font-weight: 900; line-height: 1.0;
    text-transform: uppercase; letter-spacing: -0.02em; color: #fff; margin-bottom: 0.8rem;
  }
  .spt-hero__names span { color: #f5a623; }
  .spt-hero__and { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.4em; color: #4a6880; margin: 0.6rem 0; display: block; }

  .spt-hero__meta {
    margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #1e3450;
    display: flex; flex-direction: column; gap: 0.6rem;
  }
  .spt-hero__meta-row { display: flex; align-items: center; gap: 0.75rem; }
  .spt-hero__meta-dot { width: 6px; height: 6px; border-radius: 50%; background: #f5a623; flex-shrink: 0; }
  .spt-hero__meta-text { font-size: 0.82rem; color: #6a90b0; font-weight: 500; }
  .spt-hero__meta-text strong { color: #c8dce8; font-weight: 600; }

  /* Navigation */
  .spt-nav {
    position: sticky; top: 0; z-index: 100; background: rgba(13,27,42,0.95);
    backdrop-filter: blur(8px); border-bottom: 1px solid #1a2e42;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  .spt-nav__inner {
    max-width: 860px; margin: 0 auto; padding: 0 1.25rem;
    display: flex; justify-content: center; gap: 2rem;
  }
  .spt-nav__link {
    font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: #6a90b0; padding: 1rem 0; text-decoration: none;
    transition: color 0.2s; border-bottom: 2px solid transparent;
  }
  .spt-nav__link:hover { color: #f5a623; border-bottom-color: #f5a623; }
  @media(max-width:600px){
    .spt-nav__inner { gap: 1rem; }
    .spt-nav__link { font-size: 0.6rem; padding: 0.85rem 0; }
  }

  /* Layout */
  .spt-wrap { max-width: 860px; margin: 0 auto; padding: 0 1.25rem; }
  .spt-section { padding: 3.5rem 0; border-bottom: 1px solid #1a2e42; }
  .spt-section-label {
    font-size: 0.58rem; font-weight: 700; letter-spacing: 0.35em; text-transform: uppercase;
    color: #f5a623; margin-bottom: 1.8rem;
    display: flex; align-items: center; gap: 1rem;
  }
  .spt-section-label::after { content: ''; flex: 1; height: 1px; background: #1a2e42; }

  /* Families */
  .spt-families {
    display: flex; flex-wrap: wrap;
    background: #122033; border: 1px solid #1a2e42;
  }
  .spt-family-card {
    flex: 1; min-width: 160px; padding: 1.5rem 1.4rem;
    border-right: 1px solid #1a2e42;
  }
  .spt-family-card:last-child { border-right: none; }
  @media (max-width: 600px) {
    .spt-family-card { flex-basis: 100%; border-right: none; border-bottom: 1px solid #1a2e42; }
    .spt-family-card:last-child { border-bottom: none; }
  }
  .spt-family-card__role {
    font-size: 0.55rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
    color: #4a6880; display: block; margin-bottom: 0.4rem;
  }
  .spt-family-card__name { font-size: 0.9rem; font-weight: 500; color: #c8dce8; }

  /* Events */
  .spt-events { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  @media (max-width: 600px) { .spt-events { grid-template-columns: 1fr; } }
  .spt-event {
    background: #122033; border: 1px solid #1a2e42; overflow: hidden;
    position: relative;
  }
  .spt-event__photo { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
  .spt-event__body { padding: 1.4rem; position: relative; }
  .spt-event__body::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: #f5a623;
  }
  .spt-event__type {
    font-size: 0.55rem; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase;
    color: #4a6880; display: block; margin-bottom: 0.5rem;
  }
  .spt-event__name { font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; color: #fff; margin-bottom: 0.35rem; }
  .spt-event__detail { font-size: 0.82rem; color: #4a6880; line-height: 1.7; margin-bottom: 1rem; }
  .spt-event__time {
    display: inline-block; background: #f5a623; color: #0d1b2a;
    font-size: 0.72rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.35rem 0.9rem;
  }
  .spt-event__map-link {
    display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 1rem;
    font-size: 0.82rem; color: #f5a623; text-decoration: none; transition: color 0.2s;
  }
  .spt-event__map-link:hover { color: #ffb84d; text-decoration: underline; }

  /* RSVP */
  .spt-rsvp { padding: 4rem 0 5rem; }
  .spt-rsvp__head { margin-bottom: 2rem; }
  .spt-rsvp__title {
    font-size: clamp(2rem,5vw,3.2rem); font-weight: 900; text-transform: uppercase;
    letter-spacing: -0.02em; color: #fff; line-height: 1;
  }
  .spt-rsvp__title span { color: #f5a623; }
  .spt-rsvp__sub {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase;
    color: #4a6880; margin-top: 0.5rem;
  }

  /* Form */
  .spt-form { background: rgba(18,32,51,0.7); border: 1px solid rgba(26,46,66,0.5); padding: clamp(1.5rem,4vw,2.5rem); border-radius: 12px; }
  .spt-field { margin-bottom: 1.8rem; }
  .spt-label {
    display: block; font-size: 0.75rem; font-weight: 400; letter-spacing: 0.02em;
    color: #6a90b0; margin-bottom: 0.75rem;
  }
  .spt-toggle-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .spt-toggle-btn {
    flex: 1; min-width: 110px; padding: 0.7rem 1rem; border: 1px solid rgba(74,104,128,0.3);
    background: rgba(26,46,66,0.3); color: #6a90b0; font-size: 0.85rem; font-weight: 400;
    letter-spacing: 0.02em; cursor: pointer;
    font-family: 'Inter', sans-serif; transition: all 0.15s; text-align: center; border-radius: 8px;
  }
  .spt-toggle-btn.active { background: rgba(245,166,35,0.15); color: #f5a623; border-color: rgba(245,166,35,0.5); }
  .spt-menu-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .spt-menu-btn {
    padding: 0.6rem 1.2rem; border: 1px solid rgba(74,104,128,0.3); background: rgba(26,46,66,0.3);
    color: #6a90b0; font-size: 0.85rem; font-weight: 400; letter-spacing: 0.02em;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; border-radius: 8px;
  }
  .spt-menu-btn.active { background: rgba(245,166,35,0.15); color: #f5a623; border-color: rgba(245,166,35,0.5); }
  .spt-children-row { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .spt-child-label { font-size: 0.75rem; font-weight: 400; letter-spacing: 0.02em; color: #6a90b0; }
  .spt-number-input {
    width: 75px; padding: 0.5rem 0.6rem; border: 1px solid rgba(74,104,128,0.3); background: rgba(26,46,66,0.3);
    color: #c8dce8; font-size: 0.9rem; font-family: 'Inter', sans-serif; outline: none; border-radius: 6px;
  }
  .spt-textarea {
    width: 100%; padding: 0.85rem; border: 1px solid rgba(74,104,128,0.3); background: rgba(26,46,66,0.3);
    color: #c8dce8; font-size: 0.88rem; font-family: 'Inter', sans-serif;
    resize: vertical; min-height: 100px; outline: none; line-height: 1.6; border-radius: 10px;
  }
  .spt-cta-row { display: flex; gap: 0.75rem; margin-top: 2rem; flex-wrap: wrap; }
  .spt-btn-primary {
    flex: 1; min-width: 140px; padding: 0.95rem 2rem; background: rgba(245,166,35,0.9); color: #0d1b2a;
    border: none; font-size: 0.85rem; font-weight: 500; letter-spacing: 0.02em; border-radius: 10px;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s;
  }
  .spt-btn-primary:hover { background: rgba(245,166,35,1); box-shadow: 0 2px 8px rgba(245,166,35,0.3); }
  .spt-btn-secondary {
    flex: 1; min-width: 140px; padding: 0.95rem 2rem; background: rgba(26,46,66,0.3); color: #6a90b0;
    border: 1px solid rgba(74,104,128,0.3); font-size: 0.85rem; font-weight: 500; letter-spacing: 0.02em; border-radius: 10px;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s;
  }
  .spt-btn-secondary:hover { border-color: rgba(74,104,128,0.5); color: #8ab0c8; }
`

function RsvpForm() {
  const [attending, setAttending] = useState(null)
  const [menu, setMenu] = useState(null)
  const [plusOne, setPlusOne] = useState(null)
  const [children, setChildren] = useState(null)
  const [childCount, setChildCount] = useState(1)
  const [transport, setTransport] = useState(null)
  const [notes, setNotes] = useState('')

  return (
    <div className="spt-form">
      <div className="spt-field">
        <label className="spt-label">Will you attend?</label>
        <div className="spt-toggle-row">
          <button className={`spt-toggle-btn${attending === 'yes' ? ' active' : ''}`} onClick={() => setAttending('yes')}>Yes, I'm in</button>
          <button className={`spt-toggle-btn${attending === 'no' ? ' active' : ''}`} onClick={() => setAttending('no')}>Can't make it</button>
        </div>
      </div>
      <div className="spt-field">
        <label className="spt-label">Menu preference</label>
        <div className="spt-menu-row">
          {['Meat', 'Fish', 'Vegetarian'].map(m => (
            <button key={m} className={`spt-menu-btn${menu === m ? ' active' : ''}`} onClick={() => setMenu(m)}>{m}</button>
          ))}
        </div>
      </div>
      <div className="spt-field">
        <label className="spt-label">Coming with a +1?</label>
        <div className="spt-toggle-row">
          <button className={`spt-toggle-btn${plusOne === 'yes' ? ' active' : ''}`} onClick={() => setPlusOne('yes')}>Yes</button>
          <button className={`spt-toggle-btn${plusOne === 'no' ? ' active' : ''}`} onClick={() => setPlusOne('no')}>No</button>
        </div>
      </div>
      <div className="spt-field">
        <label className="spt-label">Bringing kids?</label>
        <div className="spt-children-row">
          <div className="spt-toggle-row">
            <button className={`spt-toggle-btn${children === 'yes' ? ' active' : ''}`} onClick={() => setChildren('yes')}>Yes</button>
            <button className={`spt-toggle-btn${children === 'no' ? ' active' : ''}`} onClick={() => setChildren('no')}>No</button>
          </div>
          {children === 'yes' && (
            <>
              <span className="spt-child-label">How many?</span>
              <input className="spt-number-input" type="number" min={1} max={10} value={childCount} onChange={e => setChildCount(e.target.value)} />
            </>
          )}
        </div>
      </div>
      <div className="spt-field">
        <label className="spt-label">Need transportation?</label>
        <div className="spt-toggle-row">
          <button className={`spt-toggle-btn${transport === 'yes' ? ' active' : ''}`} onClick={() => setTransport('yes')}>Yes</button>
          <button className={`spt-toggle-btn${transport === 'no' ? ' active' : ''}`} onClick={() => setTransport('no')}>No</button>
        </div>
      </div>
      <div className="spt-field">
        <label className="spt-label">Questions or comments</label>
        <textarea className="spt-textarea" placeholder="Anything you'd like us to know..." value={notes} onChange={e => setNotes(e.target.value)} />
      </div>
      <div className="spt-cta-row">
        <button className="spt-btn-primary">Accept</button>
        <button className="spt-btn-secondary">Decline</button>
      </div>
    </div>
  )
}

export default function SportyInvitation({ invitationRef, invitationData }) {
  const { slug } = useParams()
  const [inv, setInv] = useState(invitationData || null)

  useEffect(() => {
    if (invitationData) {
      setInv(invitationData)
      return
    }
    const ref = invitationRef || slug
    if (!ref) return

    fetch(`/api/v2/invitations/${ref}`)
      .then(r => r.json())
      .then(setInv)
      .catch(console.error)
  }, [slug, invitationRef, invitationData])

  if (!inv) return <div className="spt-page" style={{minHeight:'100svh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading…</div>

  const year = inv.eventDate ? new Date(inv.eventDate).getUTCFullYear() : ''

  return (
    <div className="spt-page">
      <style>{css}</style>

      {/* Hero – split */}
      <section className="spt-hero">
        <div className="spt-hero__photo-side">
          <img src={inv.backgroundImageUrl} alt="Wedding couple" />
          <div className="spt-hero__photo-overlay" />
        </div>
        <div className="spt-hero__text-side">
          <span className="spt-hero__eyebrow">Wedding Invitation · {year}</span>
          <h1 className="spt-hero__names">
            <span>{inv.groomName.split(' ')[0]}</span> {inv.groomName.split(' ').slice(1).join(' ')}
            <span className="spt-hero__and">— &amp; —</span>
            <span>{inv.brideName.split(' ')[0]}</span> {inv.brideName.split(' ').slice(1).join(' ')}
          </h1>
          <div className="spt-hero__meta">
            <div className="spt-hero__meta-row">
              <div className="spt-hero__meta-dot" />
              <span className="spt-hero__meta-text">{fmtDate(inv.eventDate)}</span>
            </div>
            {(inv.ceremonyTime || inv.receptionTime) && (
              <div className="spt-hero__meta-row">
                <div className="spt-hero__meta-dot" />
                <span className="spt-hero__meta-text">
                  {inv.ceremonyTime && <>Ceremony <strong>{inv.ceremonyTime}</strong></>}
                  {inv.ceremonyTime && inv.receptionTime && ' · '}
                  {inv.receptionTime && <>Reception <strong>{inv.receptionTime}</strong></>}
                </span>
              </div>
            )}
            {(inv.ceremonyVenue || inv.receptionVenue) && (
              <div className="spt-hero__meta-row">
                <div className="spt-hero__meta-dot" />
                <span className="spt-hero__meta-text">
                  {inv.ceremonyVenue}{inv.ceremonyVenue && inv.receptionVenue ? ' & ' : ''}{inv.receptionVenue}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <nav className="spt-nav">
        <div className="spt-nav__inner">
          <a href="#families" className="spt-nav__link">Families</a>
          <a href="#schedule" className="spt-nav__link">Schedule</a>
          <a href="#rsvp" className="spt-nav__link">RSVP</a>
        </div>
      </nav>

      {/* Families */}
      <div className="spt-wrap">
        <div className="spt-section" id="families">
          <div className="spt-section-label">Families</div>
          <div className="spt-families">
            <div className="spt-family-card">
              <span className="spt-family-card__role">Parents of the Groom</span>
              <p className="spt-family-card__name">{inv.groomParents}</p>
            </div>
            <div className="spt-family-card">
              <span className="spt-family-card__role">Parents of the Bride</span>
              <p className="spt-family-card__name">{inv.brideParents}</p>
            </div>
            {inv.godparents && (
              <div className="spt-family-card">
                <span className="spt-family-card__role">Godparents</span>
                <p className="spt-family-card__name">{inv.godparents}</p>
              </div>
            )}
          </div>
        </div>

        {/* Events */}
        <div className="spt-section" id="schedule">
          <div className="spt-section-label">Schedule</div>
          <div className="spt-events">
            <div className="spt-event">
              {inv.ceremonyPhotoUrl && <img className="spt-event__photo" src={inv.ceremonyPhotoUrl} alt={inv.ceremonyVenue} />}
              <div className="spt-event__body">
                <span className="spt-event__type">Ceremony</span>
                <p className="spt-event__name">{inv.ceremonyVenue}</p>
                <p className="spt-event__detail">{inv.ceremonyAddress}<br />{fmtDate(inv.eventDate)}</p>
                <span className="spt-event__time">{inv.ceremonyTime}</span>
                {inv.ceremonyMapUrl && <a className="spt-event__map-link" href={inv.ceremonyMapUrl} target="_blank" rel="noreferrer">View on map</a>}
              </div>
            </div>
            <div className="spt-event">
              {inv.receptionPhotoUrl && <img className="spt-event__photo" src={inv.receptionPhotoUrl} alt={inv.receptionVenue} />}
              <div className="spt-event__body">
                <span className="spt-event__type">Reception</span>
                <p className="spt-event__name">{inv.receptionVenue}</p>
                <p className="spt-event__detail">{inv.receptionAddress}<br />{fmtDate(inv.eventDate)}</p>
                <span className="spt-event__time">{inv.receptionTime}</span>
                {inv.receptionMapUrl && <a className="spt-event__map-link" href={inv.receptionMapUrl} target="_blank" rel="noreferrer">View on map</a>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP */}
      <div className="spt-rsvp" id="rsvp">
        <div className="spt-wrap">
          <div className="spt-rsvp__head">
            <div className="spt-section-label" style={{ marginBottom: '1rem' }}>RSVP</div>
            <h2 className="spt-rsvp__title">Your <span>Response</span></h2>
            {inv.rsvpDeadline && <p className="spt-rsvp__sub">Deadline · {inv.rsvpDeadline}</p>}
          </div>
          <RsvpForm />
        </div>
      </div>
    </div>
  )
}
