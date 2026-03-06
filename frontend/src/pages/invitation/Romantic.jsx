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
  .rom-page * { box-sizing: border-box; margin: 0; padding: 0; }
  .rom-page { font-family: 'Inter', system-ui, sans-serif; color: #3a2030; background: #fdf6f0; scroll-behavior: smooth; }

  /* Hero */
  .rom-hero {
    position: relative; min-height: 100svh; display: flex;
    align-items: flex-end; justify-content: center; overflow: hidden;
  }
  .rom-hero__photo {
    position: absolute; inset: 0;
    background-size: cover; background-position: center top;
  }
  .rom-hero__overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(240,200,215,0.15) 0%,
      rgba(180,80,110,0.12) 30%,
      rgba(60,15,35,0.65) 65%,
      rgba(40,10,25,0.88) 100%
    );
  }
  .rom-hero__content {
    position: relative; z-index: 1; text-align: center;
    padding: clamp(3rem,8vw,5rem) clamp(1.5rem,5vw,3rem);
    width: 100%;
  }
  .rom-hero__petal { font-size: 1rem; color: rgba(255,200,215,0.6); letter-spacing: 1rem; display: block; margin-bottom: 1.5rem; }
  .rom-hero__label {
    font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(255,210,220,0.8); margin-bottom: 1rem; display: block; font-style: italic;
  }
  .rom-hero__names {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2.6rem,8vw,5rem); font-weight: 400; font-style: italic;
    line-height: 1.05; color: #fff; margin-bottom: 0.5rem;
    text-shadow: 0 2px 24px rgba(0,0,0,0.4);
  }
  .rom-hero__amp {
    display: block; font-size: clamp(1.2rem,3vw,1.8rem); color: #f4c0cc;
    font-style: normal; margin: 0.4rem 0; letter-spacing: 0.5rem;
  }
  .rom-hero__date {
    margin-top: 1.2rem; font-size: clamp(0.82rem,2vw,0.95rem);
    color: rgba(255,225,230,0.85); letter-spacing: 0.14em; font-style: italic;
  }
  .rom-hero__flowers {
    position: absolute; top: 0; right: 0;
    font-size: 3rem; opacity: 0.18; color: #fff; line-height: 1;
    padding: 1rem; user-select: none; pointer-events: none;
  }
  .rom-hero__flowers-bl {
    position: absolute; bottom: 0; left: 0;
    font-size: 3rem; opacity: 0.18; color: #fff; line-height: 1;
    padding: 1rem; user-select: none; pointer-events: none; transform: scaleX(-1);
  }

  /* Navigation */
  .rom-nav {
    position: sticky; top: 0; z-index: 100; background: rgba(253,246,240,0.95);
    backdrop-filter: blur(8px); border-bottom: 1px solid #f0dde6;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .rom-nav__inner {
    max-width: 720px; margin: 0 auto; padding: 0 1.25rem;
    display: flex; justify-content: center; gap: 2rem;
  }
  .rom-nav__link {
    font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: #9b7080; padding: 1rem 0; text-decoration: none;
    transition: color 0.2s; border-bottom: 2px solid transparent;
  }
  .rom-nav__link:hover { color: #d4788a; border-bottom-color: #d4788a; }
  @media(max-width:600px){
    .rom-nav__inner { gap: 1rem; }
    .rom-nav__link { font-size: 0.6rem; padding: 0.85rem 0; }
  }

  /* Layout */
  .rom-wrap { max-width: 720px; margin: 0 auto; padding: 0 1.25rem; }
  .rom-section { padding: 3.5rem 0; border-bottom: 1px solid #f0dde6; }
  .rom-section__title {
    text-align: center; font-family: 'Playfair Display', serif; font-style: italic;
    font-size: 1.2rem; font-weight: 400; color: #b85670; margin-bottom: 2rem;
  }

  /* Families */
  .rom-families {
    display: flex; flex-wrap: wrap;
    background: #fff; border-radius: 20px; border: 1px solid #f0dde6;
    box-shadow: 0 4px 20px rgba(184,86,112,0.07); overflow: hidden;
  }
  .rom-family-card {
    flex: 1; min-width: 160px; padding: 1.6rem 1.2rem; text-align: center;
    border-right: 1px solid #f0dde6;
  }
  .rom-family-card:last-child { border-right: none; }
  @media (max-width: 600px) {
    .rom-family-card { flex-basis: 100%; border-right: none; border-bottom: 1px solid #f0dde6; }
    .rom-family-card:last-child { border-bottom: none; }
  }
  .rom-family-card__top { font-size: 1.4rem; margin-bottom: 0.6rem; }
  .rom-family-card__role {
    font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: #d4788a; display: block; margin-bottom: 0.4rem;
  }
  .rom-family-card__name {
    font-family: 'Playfair Display', serif; font-style: italic;
    font-size: 0.95rem; color: #3a2030;
  }

  /* Events */
  .rom-events { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
  @media (max-width: 600px) { .rom-events { grid-template-columns: 1fr; } }
  .rom-event {
    background: #fff; border-radius: 20px; overflow: hidden;
    border: 1px solid #f0dde6; box-shadow: 0 4px 24px rgba(184,86,112,0.08);
  }
  .rom-event:only-child { grid-column: 1 / -1; max-width: 500px; margin: 0 auto; }
  .rom-event__photo { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
  .rom-event__body { padding: 1.4rem; }
  .rom-event__type {
    font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
    color: #d4788a; display: block; margin-bottom: 0.4rem;
  }
  .rom-event__name {
    font-family: 'Playfair Display', serif; font-style: italic;
    font-size: 1.1rem; color: #3a2030; margin-bottom: 0.35rem;
  }
  .rom-event__detail { font-size: 0.83rem; color: #9b7080; line-height: 1.7; margin-bottom: 0.9rem; }
  .rom-event__time-pill {
    display: inline-block; padding: 0.3rem 1rem; border-radius: 20px;
    background: linear-gradient(135deg, #f2c4ce, #d4788a); color: #7a2040;
    font-size: 0.72rem; letter-spacing: 0.1em; font-style: italic;
    font-family: 'Playfair Display', serif;
  }
  .rom-event__map-link {
    display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 0.9rem;
    font-size: 0.82rem; color: #d4788a; text-decoration: none; transition: color 0.2s;
  }
  .rom-event__map-link:hover { color: #b85670; text-decoration: underline; }

  /* RSVP */
  .rom-rsvp { padding: 4rem 0 5rem; }
  .rom-rsvp__head { text-align: center; margin-bottom: 2.5rem; }
  .rom-rsvp__petals { font-size: 1.2rem; color: #d4788a; opacity: 0.5; margin-bottom: 0.8rem; letter-spacing: 0.5rem; }
  .rom-rsvp__title {
    font-family: 'Playfair Display', serif; font-style: italic;
    font-size: clamp(1.8rem,4vw,2.6rem); font-weight: 400; color: #3a2030; margin-bottom: 0.4rem;
  }
  .rom-rsvp__sub { font-size: 0.82rem; color: #b09098; font-style: italic; }

  /* Form */
  .rom-form {
    background: rgba(255,255,255,0.6); border-radius: 24px; border: 1px solid rgba(184,86,112,0.08);
    padding: clamp(1.5rem,4vw,2.5rem); box-shadow: 0 2px 12px rgba(184,86,112,0.05);
  }
  .rom-field { margin-bottom: 1.8rem; }
  .rom-label {
    display: block; font-size: 0.75rem; color: #9b7080; margin-bottom: 0.8rem;
    font-weight: 400; letter-spacing: 0.02em;
  }
  .rom-toggle-row { display: flex; gap: 0.6rem; flex-wrap: wrap; }
  .rom-toggle-btn {
    flex: 1; min-width: 120px; padding: 0.7rem 1rem; border-radius: 30px;
    border: 1px solid rgba(184,86,112,0.15); background: rgba(255,255,255,0.4); color: #9b7080;
    font-size: 0.85rem; cursor: pointer;
    font-family: 'Inter', sans-serif; font-weight: 400; transition: all 0.2s; text-align: center;
  }
  .rom-toggle-btn.active {
    border-color: rgba(184,86,112,0.4); background: rgba(212,120,138,0.12); color: #7a2040;
  }
  .rom-menu-row { display: flex; gap: 0.6rem; flex-wrap: wrap; }
  .rom-menu-btn {
    padding: 0.6rem 1.4rem; border-radius: 30px; border: 1px solid rgba(184,86,112,0.15);
    background: rgba(255,255,255,0.4); color: #9b7080; font-size: 0.85rem;
    cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 400; transition: all 0.2s;
  }
  .rom-menu-btn.active { background: rgba(212,120,138,0.12); color: #7a2040; border-color: rgba(184,86,112,0.4); }
  .rom-children-row { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .rom-child-label { font-size: 0.78rem; color: #b09098; font-weight: 400; }
  .rom-number-input {
    width: 75px; padding: 0.5rem 0.6rem; border: 1px solid rgba(184,86,112,0.15); border-radius: 10px;
    font-size: 0.9rem; font-family: 'Inter', sans-serif; outline: none; color: #3a2030; background: rgba(255,255,255,0.4);
  }
  .rom-textarea {
    width: 100%; padding: 0.9rem; border: 1px solid rgba(184,86,112,0.15); border-radius: 14px;
    font-size: 0.88rem; font-family: 'Inter', sans-serif; resize: vertical; min-height: 100px;
    outline: none; color: #3a2030; line-height: 1.6; background: rgba(255,255,255,0.4);
  }
  .rom-cta-row { display: flex; gap: 0.75rem; margin-top: 2rem; flex-wrap: wrap; }
  .rom-btn-primary {
    flex: 1; min-width: 150px; padding: 0.95rem 2rem; border-radius: 30px;
    background: rgba(184,86,112,0.85); color: #fff; border: none;
    font-size: 0.85rem; letter-spacing: 0.02em; cursor: pointer;
    font-family: 'Inter', sans-serif; font-weight: 500;
    box-shadow: 0 2px 8px rgba(184,86,112,0.2); transition: all 0.2s;
  }
  .rom-btn-primary:hover { background: rgba(184,86,112,1); box-shadow: 0 4px 12px rgba(184,86,112,0.3); }
  .rom-btn-secondary {
    flex: 1; min-width: 150px; padding: 0.95rem 2rem; border-radius: 30px;
    background: rgba(255,255,255,0.5); color: #9b7080; border: 1px solid rgba(184,86,112,0.15);
    font-size: 0.85rem; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 500; transition: all 0.2s;
  }
  .rom-btn-secondary:hover { border-color: rgba(184,86,112,0.4); color: #7a2040; }
`

function RsvpForm({ invitationRef }) {
  const [guestName, setGuestName] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [attending, setAttending] = useState(null)
  const [menu, setMenu] = useState(null)
  const [plusOne, setPlusOne] = useState(null)
  const [children, setChildren] = useState(null)
  const [childCount, setChildCount] = useState(1)
  const [transport, setTransport] = useState(null)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (answer) => {
    if (!guestName.trim()) {
      alert('Please enter your name')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/invitations/${invitationRef}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: guestName.trim(),
          answer,
          partnerName: plusOne === 'yes' ? partnerName.trim() : null,
          menuPreference: menu,
          children: children === 'yes' ? parseInt(childCount) : null,
          transport: transport === 'yes' ? true : transport === 'no' ? false : null,
          notes: notes.trim() || null
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit RSVP')
      }

      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      alert('Failed to submit RSVP. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="rom-form" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '1.8rem', color: '#b85670', marginBottom: '1rem' }}>
          Thank You!
        </h3>
        <p style={{ fontSize: '.9rem', color: '#9b7080', lineHeight: '1.6' }}>
          Your response has been recorded with love. We look forward to celebrating with you!
        </p>
      </div>
    )
  }

  return (
    <div className="rom-form">
      <div className="rom-field">
        <label className="rom-label">Your Name *</label>
        <input
          className="rom-number-input"
          type="text"
          placeholder="Enter your full name"
          value={guestName}
          onChange={e => setGuestName(e.target.value)}
          style={{ width: '100%', fontSize: '.88rem', padding: '.8rem' }}
        />
      </div>
      <div className="rom-field">
        <label className="rom-label">Will you be joining us?</label>
        <div className="rom-toggle-row">
          <button className={`rom-toggle-btn${attending === 'yes' ? ' active' : ''}`} onClick={() => setAttending('yes')}>Yes, with joy!</button>
          <button className={`rom-toggle-btn${attending === 'no' ? ' active' : ''}`} onClick={() => setAttending('no')}>Unable to attend</button>
        </div>
      </div>

      {attending === 'yes' && (
        <>
          <div className="rom-field">
            <label className="rom-label">Will you bring a +1?</label>
            <div className="rom-toggle-row">
              <button className={`rom-toggle-btn${plusOne === 'yes' ? ' active' : ''}`} onClick={() => setPlusOne('yes')}>Yes</button>
              <button className={`rom-toggle-btn${plusOne === 'no' ? ' active' : ''}`} onClick={() => setPlusOne('no')}>No</button>
            </div>
            {plusOne === 'yes' && (
              <input
                className="rom-number-input"
                type="text"
                placeholder="Partner's name"
                value={partnerName}
                onChange={e => setPartnerName(e.target.value)}
                style={{ width: '100%', fontSize: '.88rem', padding: '.8rem', marginTop: '.75rem' }}
              />
            )}
          </div>
          <div className="rom-field">
            <label className="rom-label">Your menu preference</label>
            <div className="rom-menu-row">
              {['Meat', 'Fish', 'Vegetarian'].map(m => (
                <button key={m} className={`rom-menu-btn${menu === m ? ' active' : ''}`} onClick={() => setMenu(m)}>{m}</button>
              ))}
            </div>
          </div>
          <div className="rom-field">
            <label className="rom-label">Are you bringing little ones?</label>
            <div className="rom-children-row">
              <div className="rom-toggle-row">
                <button className={`rom-toggle-btn${children === 'yes' ? ' active' : ''}`} onClick={() => setChildren('yes')}>Yes</button>
                <button className={`rom-toggle-btn${children === 'no' ? ' active' : ''}`} onClick={() => setChildren('no')}>No</button>
              </div>
              {children === 'yes' && (
                <>
                  <span className="rom-child-label">How many?</span>
                  <input className="rom-number-input" type="number" min={1} max={10} value={childCount} onChange={e => setChildCount(e.target.value)} />
                </>
              )}
            </div>
          </div>
          <div className="rom-field">
            <label className="rom-label">Do you need transportation?</label>
            <div className="rom-toggle-row">
              <button className={`rom-toggle-btn${transport === 'yes' ? ' active' : ''}`} onClick={() => setTransport('yes')}>Yes, please</button>
              <button className={`rom-toggle-btn${transport === 'no' ? ' active' : ''}`} onClick={() => setTransport('no')}>No, thank you</button>
            </div>
          </div>
        </>
      )}

      {attending === 'no' && (
        <div className="rom-field">
          <label className="rom-label">Message (Optional)</label>
          <textarea className="rom-textarea" placeholder="Let the couple know why you can't attend..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
      )}

      {attending === 'yes' && (
        <div className="rom-field">
          <label className="rom-label">Any wishes or questions for us? (Optional)</label>
          <textarea className="rom-textarea" placeholder="Dietary needs, special requests, or a loving note..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
      )}

      {attending && (
        <div className="rom-cta-row">
          {attending === 'yes' && (
            <button
              className="rom-btn-primary"
              onClick={() => handleSubmit('ACCEPTED')}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Accept with Love'}
            </button>
          )}
          {attending === 'no' && (
            <button
              className="rom-btn-secondary"
              onClick={() => handleSubmit('DECLINED')}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Decline'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function RomanticInvitation({ invitationRef, invitationData }) {
  const { slug } = useParams()
  const [inv, setInv] = useState(invitationData || null)

  useEffect(() => {
    // If data is already provided via props, don't fetch
    if (invitationData) {
      setInv(invitationData)
      return
    }
    // Otherwise fetch using slug from params
    const ref = invitationRef || slug
    if (!ref) return

    fetch(`/api/invitations/${ref}`)
      .then(r => r.json())
      .then(setInv)
      .catch(console.error)
  }, [slug, invitationRef, invitationData])

  if (!inv) return <div className="rom-page" style={{minHeight:'100svh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading…</div>

  const heroOverlay = 'linear-gradient(to bottom, rgba(240,200,215,0.15) 0%, rgba(180,80,110,0.12) 30%, rgba(60,15,35,0.65) 65%, rgba(40,10,25,0.88) 100%)'
  const isPastEvent = inv.eventDate && new Date(inv.eventDate) < new Date()

  return (
    <div className="rom-page">
      <style>{css}</style>

      {/* Hero */}
      <section className="rom-hero">
        <div className="rom-hero__photo" style={{backgroundImage:`url('${inv.backgroundImageUrl}')`}} />
        <div className="rom-hero__overlay" />
        <div className="rom-hero__flowers">🌸🌺</div>
        <div className="rom-hero__flowers-bl">🌸🌺</div>
        <div className="rom-hero__content">
          <span className="rom-hero__petal">···</span>
          <span className="rom-hero__label">Together with their families, joyfully invite you to celebrate</span>
          <h1 className="rom-hero__names">
            {inv.groomName}
            <span className="rom-hero__amp">❧</span>
            {inv.brideName}
          </h1>
          <p className="rom-hero__date">{fmtDate(inv.eventDate)}</p>
        </div>
      </section>

      <nav className="rom-nav">
        <div className="rom-nav__inner">
          {(inv.groomParents || inv.brideParents || inv.godparents) && (
            <a href="#families" className="rom-nav__link">Families</a>
          )}
          {(inv.ceremonyVenue || inv.receptionVenue) && (
            <a href="#celebrations" className="rom-nav__link">Celebrations</a>
          )}
          <a href="#rsvp" className="rom-nav__link">RSVP</a>
        </div>
      </nav>

      {/* Families */}
      <div className="rom-wrap">
        {(inv.groomParents || inv.brideParents || inv.godparents) && (
          <div className="rom-section" id="families">
            <p className="rom-section__title">~ With the blessings of their families ~</p>
            <div className="rom-families">
              {inv.groomParents && (
                <div className="rom-family-card">
                  <span className="rom-family-card__role">Parents of the Groom</span>
                  <p className="rom-family-card__name">{inv.groomParents}</p>
                </div>
              )}
              {inv.brideParents && (
                <div className="rom-family-card">
                  <span className="rom-family-card__role">Parents of the Bride</span>
                  <p className="rom-family-card__name">{inv.brideParents}</p>
                </div>
              )}
              {inv.godparents && (
                <div className="rom-family-card">
                  <span className="rom-family-card__role">Godparents</span>
                  <p className="rom-family-card__name">{inv.godparents}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Events */}
        {(inv.ceremonyVenue || inv.receptionVenue) && (
          <div className="rom-section" id="celebrations">
            <p className="rom-section__title">~ The day's celebrations ~</p>
            <div className="rom-events">
              {inv.ceremonyVenue && (
                <div className="rom-event">
                  {inv.ceremonyPhotoUrl && <img className="rom-event__photo" src={inv.ceremonyPhotoUrl} alt={inv.ceremonyVenue} />}
                  <div className="rom-event__body">
                    <span className="rom-event__type">Holy Ceremony</span>
                    <p className="rom-event__name">{inv.ceremonyVenue}</p>
                    {inv.ceremonyAddress && <p className="rom-event__detail">{inv.ceremonyAddress}<br />{fmtDate(inv.eventDate)}</p>}
                    {!inv.ceremonyAddress && <p className="rom-event__detail">{fmtDate(inv.eventDate)}</p>}
                    {inv.ceremonyTime && <span className="rom-event__time-pill">{inv.ceremonyTime}</span>}
                    {inv.ceremonyMapUrl && <a className="rom-event__map-link" href={inv.ceremonyMapUrl} target="_blank" rel="noreferrer" title="View on map"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></a>}
                  </div>
                </div>
              )}
              {inv.receptionVenue && (
                <div className="rom-event">
                  {inv.receptionPhotoUrl && <img className="rom-event__photo" src={inv.receptionPhotoUrl} alt={inv.receptionVenue} />}
                  <div className="rom-event__body">
                    <span className="rom-event__type">Reception &amp; Dinner</span>
                    <p className="rom-event__name">{inv.receptionVenue}</p>
                    {inv.receptionAddress && <p className="rom-event__detail">{inv.receptionAddress}<br />{fmtDate(inv.eventDate)}</p>}
                    {!inv.receptionAddress && <p className="rom-event__detail">{fmtDate(inv.eventDate)}</p>}
                    {inv.receptionTime && <span className="rom-event__time-pill">{inv.receptionTime}</span>}
                    {inv.receptionMapUrl && <a className="rom-event__map-link" href={inv.receptionMapUrl} target="_blank" rel="noreferrer" title="View on map"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></a>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RSVP */}
      <div className="rom-rsvp" id="rsvp">
        <div className="rom-wrap">
          {isPastEvent ? (
            <div className="rom-form" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div className="rom-rsvp__petals" style={{marginBottom: '1rem'}}>···</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '1.8rem', color: '#b85670', marginBottom: '1rem' }}>
                Thank You
              </h3>
              <p style={{ fontSize: '.9rem', color: '#9b7080', lineHeight: '1.6', marginBottom: '1rem' }}>
                We hope you enjoyed celebrating with us!
              </p>
              <p style={{ fontSize: '.85rem', color: '#b09098', lineHeight: '1.6' }}>
                Your presence made our special day even more memorable.
              </p>
            </div>
          ) : (
            <>
              <div className="rom-rsvp__head">
                <div className="rom-rsvp__petals">···</div>
                <h2 className="rom-rsvp__title">Kindly Reply</h2>
                {inv.rsvpDeadline && <p className="rom-rsvp__sub">Please respond by {inv.rsvpDeadline}</p>}
              </div>
              <RsvpForm invitationRef={invitationRef || slug} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
