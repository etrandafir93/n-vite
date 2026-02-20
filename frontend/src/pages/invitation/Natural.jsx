import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const wd = d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })
  const rest = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  return `${wd} · ${rest}`
}

const css = `
  .nat-page * { box-sizing: border-box; margin: 0; padding: 0; }
  .nat-page { font-family: 'Inter', system-ui, sans-serif; color: #2e2a24; background: #faf7f2; }

  /* Hero – full height, photo bottom half visible, text layered over */
  .nat-hero {
    position: relative; min-height: 100svh; display: flex;
    flex-direction: column; justify-content: flex-end; overflow: hidden;
  }
  .nat-hero__photo {
    position: absolute; inset: 0;
    background-size: cover; background-position: center 15%;
  }
  .nat-hero__overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(45,35,20,0.1) 0%,
      rgba(90,80,55,0.18) 40%,
      rgba(30,22,12,0.75) 70%,
      rgba(20,15,8,0.92) 100%
    );
  }
  .nat-hero__content {
    position: relative; z-index: 1; padding: clamp(3rem,8vw,5rem) clamp(1.5rem,5vw,3rem);
    text-align: center;
  }
  .nat-hero__leaf { font-size: 1.1rem; color: rgba(168,197,171,0.7); letter-spacing: 0.8rem; display: block; margin-bottom: 1.4rem; }
  .nat-hero__label {
    font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(200,220,180,0.8); margin-bottom: 1.2rem; display: block; font-weight: 500;
  }
  .nat-hero__names {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2.6rem,7.5vw,4.8rem); font-weight: 400; line-height: 1.05;
    color: #fff; margin-bottom: 0.5rem;
    text-shadow: 0 2px 20px rgba(0,0,0,0.5);
  }
  .nat-hero__amp {
    display: block; color: #a8c5ab; font-size: clamp(1.2rem,3vw,1.8rem);
    margin: 0.4rem 0; letter-spacing: 0.4rem;
  }
  .nat-hero__date {
    margin-top: 1.2rem; font-size: clamp(0.8rem,2vw,0.95rem);
    color: rgba(210,225,195,0.85); letter-spacing: 0.12em; font-weight: 400;
  }
  .nat-hero__badge {
    display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem;
    padding: 0.45rem 1.1rem; border: 1px solid rgba(168,197,171,0.4);
    font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: rgba(168,197,171,0.85); font-weight: 500;
  }

  /* Layout */
  .nat-wrap { max-width: 740px; margin: 0 auto; padding: 0 1.25rem; }
  .nat-section { padding: 3.5rem 0; border-bottom: 1px solid #e8e0d4; }
  .nat-section__title {
    display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;
    font-size: 0.6rem; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: #7a9e7e;
  }
  .nat-section__title::before, .nat-section__title::after { content: ''; flex: 1; height: 1px; background: #ddd5c5; }

  /* Families */
  .nat-families {
    display: flex; flex-wrap: wrap;
    background: #fff; border-radius: 14px; border: 1px solid #e8e0d4;
    box-shadow: 0 2px 12px rgba(122,158,126,0.08); overflow: hidden;
    position: relative;
  }
  .nat-families::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #7a9e7e, #a8c5ab);
  }
  .nat-family-card {
    flex: 1; min-width: 160px; padding: 1.5rem 1.2rem; text-align: center;
    border-right: 1px solid #e8e0d4;
  }
  .nat-family-card:last-child { border-right: none; }
  @media (max-width: 600px) {
    .nat-family-card { flex-basis: 100%; border-right: none; border-bottom: 1px solid #e8e0d4; }
    .nat-family-card:last-child { border-bottom: none; }
  }
  .nat-family-card__icon { font-size: 1.3rem; margin-bottom: 0.6rem; display: block; }
  .nat-family-card__role {
    font-size: 0.55rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
    color: #7a9e7e; display: block; margin-bottom: 0.4rem;
  }
  .nat-family-card__name {
    font-family: 'Playfair Display', serif; font-size: 0.92rem; color: #2e2a24;
  }

  /* Events */
  .nat-events { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  @media (max-width: 600px) { .nat-events { grid-template-columns: 1fr; } }
  .nat-event {
    background: #fff; border-radius: 16px; overflow: hidden;
    border: 1px solid #e8e0d4; box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  }
  .nat-event__photo { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
  .nat-event__body { padding: 1.4rem; }
  .nat-event__type {
    font-size: 0.55rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase;
    color: #c4704a; display: block; margin-bottom: 0.4rem;
  }
  .nat-event__name {
    font-family: 'Playfair Display', serif; font-size: 1.05rem; color: #2e2a24; margin-bottom: 0.3rem;
  }
  .nat-event__detail { font-size: 0.83rem; color: #8a7d6e; line-height: 1.7; margin-bottom: 0.9rem; }
  .nat-event__time-pill {
    display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.3rem 0.85rem;
    background: #f0ebe2; border: 1px solid #d5ccbc; border-radius: 20px;
    font-size: 0.72rem; color: #5a7d5e; font-weight: 600;
  }
  .nat-event__map {
    width: 100%; height: 180px; border: 0; display: block; margin-top: 0.9rem; border-radius: 10px; overflow: hidden;
  }

  /* RSVP */
  .nat-rsvp { padding: 4rem 0 5rem; }
  .nat-rsvp__head { text-align: center; margin-bottom: 2.5rem; }
  .nat-rsvp__leaves { font-size: 1.2rem; color: #7a9e7e; opacity: 0.45; margin-bottom: 0.8rem; letter-spacing: 0.6rem; }
  .nat-rsvp__title {
    font-family: 'Playfair Display', serif; font-size: clamp(1.8rem,4vw,2.6rem);
    font-weight: 400; color: #2e2a24; margin-bottom: 0.4rem;
  }
  .nat-rsvp__sub { font-size: 0.82rem; color: #a09080; }

  /* Form */
  .nat-form {
    background: #fff; border-radius: 20px; border: 1px solid #e8e0d4;
    padding: clamp(1.5rem,4vw,2.5rem); box-shadow: 0 8px 40px rgba(122,158,126,0.1);
  }
  .nat-field { margin-bottom: 1.8rem; }
  .nat-label {
    display: block; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
    color: #8a7d6e; margin-bottom: 0.75rem;
  }
  .nat-toggle-row { display: flex; gap: 0.6rem; flex-wrap: wrap; }
  .nat-toggle-btn {
    flex: 1; min-width: 120px; padding: 0.7rem 1rem; border-radius: 10px;
    border: 1.5px solid #e0d8cc; background: #fff; color: #8a7d6e;
    font-size: 0.85rem; cursor: pointer; font-family: 'Inter', sans-serif;
    font-weight: 500; transition: all 0.18s; text-align: center;
  }
  .nat-toggle-btn.active {
    background: #7a9e7e; color: #fff; border-color: #7a9e7e;
    box-shadow: 0 2px 10px rgba(90,125,94,0.3);
  }
  .nat-menu-row { display: flex; gap: 0.6rem; flex-wrap: wrap; }
  .nat-menu-btn {
    padding: 0.6rem 1.3rem; border-radius: 10px; border: 1.5px solid #e0d8cc;
    background: #fff; color: #8a7d6e; font-size: 0.85rem; cursor: pointer;
    font-family: 'Inter', sans-serif; font-weight: 500; transition: all 0.18s;
  }
  .nat-menu-btn.active { background: #c4704a; color: #fff; border-color: #c4704a; }
  .nat-children-row { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .nat-child-label { font-size: 0.72rem; color: #a09080; font-weight: 500; }
  .nat-number-input {
    width: 75px; padding: 0.5rem 0.6rem; border: 1.5px solid #e0d8cc; border-radius: 8px;
    font-size: 0.9rem; font-family: 'Inter', sans-serif; outline: none; color: #2e2a24; background: #faf7f2;
  }
  .nat-textarea {
    width: 100%; padding: 0.9rem; border: 1.5px solid #e0d8cc; border-radius: 12px;
    font-size: 0.88rem; font-family: 'Inter', sans-serif; resize: vertical; min-height: 100px;
    outline: none; color: #2e2a24; line-height: 1.6; background: #faf7f2;
  }
  .nat-cta-row { display: flex; gap: 0.75rem; margin-top: 2rem; flex-wrap: wrap; }
  .nat-btn-primary {
    flex: 1; min-width: 150px; padding: 0.95rem 2rem; border-radius: 12px;
    background: linear-gradient(135deg, #7a9e7e, #5a7d5e); color: #fff; border: none;
    font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    cursor: pointer; font-family: 'Inter', sans-serif;
    box-shadow: 0 4px 16px rgba(90,125,94,0.35); transition: opacity 0.18s;
  }
  .nat-btn-primary:hover { opacity: 0.9; }
  .nat-btn-secondary {
    flex: 1; min-width: 150px; padding: 0.95rem 2rem; border-radius: 12px;
    background: #fff; color: #8a7d6e; border: 1.5px solid #e0d8cc;
    font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.18s;
  }
  .nat-btn-secondary:hover { border-color: #a09080; color: #5a5040; }
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
    <div className="nat-form">
      <div className="nat-field">
        <label className="nat-label">Will you attend?</label>
        <div className="nat-toggle-row">
          <button className={`nat-toggle-btn${attending === 'yes' ? ' active' : ''}`} onClick={() => setAttending('yes')}>Yes, I'll be there</button>
          <button className={`nat-toggle-btn${attending === 'no' ? ' active' : ''}`} onClick={() => setAttending('no')}>Unable to attend</button>
        </div>
      </div>
      <div className="nat-field">
        <label className="nat-label">Menu preference</label>
        <div className="nat-menu-row">
          {['Meat', 'Fish', 'Vegetarian'].map(m => (
            <button key={m} className={`nat-menu-btn${menu === m ? ' active' : ''}`} onClick={() => setMenu(m)}>{m}</button>
          ))}
        </div>
      </div>
      <div className="nat-field">
        <label className="nat-label">Bringing a +1?</label>
        <div className="nat-toggle-row">
          <button className={`nat-toggle-btn${plusOne === 'yes' ? ' active' : ''}`} onClick={() => setPlusOne('yes')}>Yes</button>
          <button className={`nat-toggle-btn${plusOne === 'no' ? ' active' : ''}`} onClick={() => setPlusOne('no')}>No</button>
        </div>
      </div>
      <div className="nat-field">
        <label className="nat-label">Bringing children?</label>
        <div className="nat-children-row">
          <div className="nat-toggle-row">
            <button className={`nat-toggle-btn${children === 'yes' ? ' active' : ''}`} onClick={() => setChildren('yes')}>Yes</button>
            <button className={`nat-toggle-btn${children === 'no' ? ' active' : ''}`} onClick={() => setChildren('no')}>No</button>
          </div>
          {children === 'yes' && (
            <>
              <span className="nat-child-label">How many?</span>
              <input className="nat-number-input" type="number" min={1} max={10} value={childCount} onChange={e => setChildCount(e.target.value)} />
            </>
          )}
        </div>
      </div>
      <div className="nat-field">
        <label className="nat-label">Do you need transportation?</label>
        <div className="nat-toggle-row">
          <button className={`nat-toggle-btn${transport === 'yes' ? ' active' : ''}`} onClick={() => setTransport('yes')}>Yes, please</button>
          <button className={`nat-toggle-btn${transport === 'no' ? ' active' : ''}`} onClick={() => setTransport('no')}>No, thank you</button>
        </div>
      </div>
      <div className="nat-field">
        <label className="nat-label">Questions or comments</label>
        <textarea className="nat-textarea" placeholder="Dietary needs, special requests, or a note for the couple..." value={notes} onChange={e => setNotes(e.target.value)} />
      </div>
      <div className="nat-cta-row">
        <button className="nat-btn-primary">🌿 Accept Invitation</button>
        <button className="nat-btn-secondary">Decline</button>
      </div>
    </div>
  )
}

export default function NaturalInvitation({ invitationRef, invitationData }) {
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

  if (!inv) return <div className="nat-page" style={{minHeight:'100svh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading…</div>

  return (
    <div className="nat-page">
      <style>{css}</style>

      {/* Hero */}
      <section className="nat-hero">
        <div className="nat-hero__photo" style={{backgroundImage:`url('${inv.backgroundImageUrl}')`}} />
        <div className="nat-hero__overlay" />
        <div className="nat-hero__content">
          <span className="nat-hero__leaf">🌿 🌾 🌿</span>
          <span className="nat-hero__label">Together with their families</span>
          <h1 className="nat-hero__names">
            {inv.groomName}
            <span className="nat-hero__amp">✦</span>
            {inv.brideName}
          </h1>
          <p className="nat-hero__date">{fmtDate(inv.eventDate)}</p>
          {(inv.ceremonyTime || inv.receptionTime) && (
            <div className="nat-hero__badge">
              {inv.ceremonyTime && <>🕑 Ceremony {inv.ceremonyTime}</>}
              {inv.ceremonyTime && inv.receptionTime && ' · '}
              {inv.receptionTime && <>🕕 Reception {inv.receptionTime}</>}
            </div>
          )}
        </div>
      </section>

      {/* Families */}
      <div className="nat-wrap">
        <div className="nat-section">
          <p className="nat-section__title">With the Blessings of</p>
          <div className="nat-families">
            <div className="nat-family-card">
              <span className="nat-family-card__icon">🌱</span>
              <span className="nat-family-card__role">Parents of the Groom</span>
              <p className="nat-family-card__name">{inv.groomParents}</p>
            </div>
            <div className="nat-family-card">
              <span className="nat-family-card__icon">🌱</span>
              <span className="nat-family-card__role">Parents of the Bride</span>
              <p className="nat-family-card__name">{inv.brideParents}</p>
            </div>
            {inv.godparents && (
              <div className="nat-family-card">
                <span className="nat-family-card__icon">🕊️</span>
                <span className="nat-family-card__role">Godparents</span>
                <p className="nat-family-card__name">{inv.godparents}</p>
              </div>
            )}
          </div>
        </div>

        {/* Events */}
        <div className="nat-section">
          <p className="nat-section__title">The Celebrations</p>
          <div className="nat-events">
            <div className="nat-event">
              {inv.ceremonyPhotoUrl && <img className="nat-event__photo" src={inv.ceremonyPhotoUrl} alt={inv.ceremonyVenue} />}
              <div className="nat-event__body">
                <span className="nat-event__type">⛪ Ceremony</span>
                <p className="nat-event__name">{inv.ceremonyVenue}</p>
                <p className="nat-event__detail">{inv.ceremonyAddress}<br />{fmtDate(inv.eventDate)}</p>
                <span className="nat-event__time-pill">🕑 {inv.ceremonyTime}</span>
                {inv.ceremonyMapUrl && <iframe className="nat-event__map" src={inv.ceremonyMapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Church location" />}
              </div>
            </div>
            <div className="nat-event">
              {inv.receptionPhotoUrl && <img className="nat-event__photo" src={inv.receptionPhotoUrl} alt={inv.receptionVenue} />}
              <div className="nat-event__body">
                <span className="nat-event__type">🥂 Reception &amp; Dinner</span>
                <p className="nat-event__name">{inv.receptionVenue}</p>
                <p className="nat-event__detail">{inv.receptionAddress}<br />{fmtDate(inv.eventDate)}</p>
                <span className="nat-event__time-pill">🕕 {inv.receptionTime}</span>
                {inv.receptionMapUrl && <iframe className="nat-event__map" src={inv.receptionMapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Party location" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP */}
      <div className="nat-rsvp">
        <div className="nat-wrap">
          <div className="nat-rsvp__head">
            <div className="nat-rsvp__leaves">🌿 🌾 🌿</div>
            <h2 className="nat-rsvp__title">Kindly Reply</h2>
            {inv.rsvpDeadline && <p className="nat-rsvp__sub">Please respond by {inv.rsvpDeadline}</p>}
          </div>
          <RsvpForm />
        </div>
      </div>
    </div>
  )
}
