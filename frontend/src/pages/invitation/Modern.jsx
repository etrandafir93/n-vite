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
  .mdn-page * { box-sizing: border-box; margin: 0; padding: 0; }
  .mdn-page { font-family: 'Inter', system-ui, sans-serif; background: #0d1b2a; color: #e8f0f8; scroll-behavior: smooth; }

  /* Hero – full bleed split layout on desktop, stacked on mobile */
  .mdn-hero {
    position: relative; min-height: 100svh; display: grid;
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 720px) { .spt-hero { grid-template-columns: 1fr; } }

  .mdn-hero__photo-side {
    position: relative; min-height: 50svh; overflow: hidden;
  }
  .mdn-hero__photo-side img {
    width: 100%; height: 100%; object-fit: cover; object-position: center;
    display: block;
  }
  .mdn-hero__photo-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(13,27,42,0.5) 0%, rgba(13,27,42,0.1) 100%);
  }

  .mdn-hero__text-side {
    background: #0d1b2a; display: flex; flex-direction: column; justify-content: center;
    padding: clamp(2.5rem,6vw,5rem) clamp(2rem,5vw,4rem);
    border-left: 1px solid #1e3450;
  }
  @media (max-width: 720px) {
    .mdn-hero__text-side { padding: 2.5rem 1.5rem 3rem; border-left: none; border-top: 3px solid #f5a623; }
  }

  .mdn-hero__eyebrow {
    font-size: 0.6rem; font-weight: 700; letter-spacing: 0.35em; text-transform: uppercase;
    color: #f5a623; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;
  }
  .mdn-hero__eyebrow::before { content: ''; display: block; width: 32px; height: 2px; background: #f5a623; }

  .mdn-hero__names {
    font-size: clamp(2.4rem,5vw,4rem); font-weight: 900; line-height: 1.0;
    text-transform: uppercase; letter-spacing: -0.02em; color: #fff; margin-bottom: 0.8rem;
  }
  .mdn-hero__names span { color: #f5a623; }
  .mdn-hero__and { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.4em; color: #4a6880; margin: 0.6rem 0; display: block; }

  .mdn-hero__meta {
    margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #1e3450;
    display: flex; flex-direction: column; gap: 0.6rem;
  }
  .mdn-hero__meta-row { display: flex; align-items: center; gap: 0.75rem; }
  .mdn-hero__meta-dot { width: 6px; height: 6px; border-radius: 50%; background: #f5a623; flex-shrink: 0; }
  .mdn-hero__meta-text { font-size: 0.82rem; color: #6a90b0; font-weight: 500; }
  .mdn-hero__meta-text strong { color: #c8dce8; font-weight: 600; }

  /* Navigation */
  .mdn-nav {
    position: sticky; top: 0; z-index: 100; background: rgba(13,27,42,0.95);
    backdrop-filter: blur(8px); border-bottom: 1px solid #1a2e42;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  .mdn-nav__inner {
    max-width: 860px; margin: 0 auto; padding: 0 1.25rem;
    display: flex; justify-content: center; gap: 2rem;
  }
  .mdn-nav__link {
    font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: #6a90b0; padding: 1rem 0; text-decoration: none;
    transition: color 0.2s; border-bottom: 2px solid transparent;
  }
  .mdn-nav__link:hover { color: #f5a623; border-bottom-color: #f5a623; }
  @media(max-width:600px){
    .mdn-nav__inner { gap: 1rem; }
    .mdn-nav__link { font-size: 0.6rem; padding: 0.85rem 0; }
  }

  /* Layout */
  .mdn-wrap { max-width: 860px; margin: 0 auto; padding: 0 1.25rem; }
  .mdn-section { padding: 3.5rem 0; border-bottom: 1px solid #1a2e42; }
  .mdn-section-label {
    font-size: 0.58rem; font-weight: 700; letter-spacing: 0.35em; text-transform: uppercase;
    color: #f5a623; margin-bottom: 1.8rem;
    display: flex; align-items: center; gap: 1rem;
  }
  .mdn-section-label::after { content: ''; flex: 1; height: 1px; background: #1a2e42; }

  /* Families */
  .mdn-families {
    display: flex; flex-wrap: wrap;
    background: #122033; border: 1px solid #1a2e42;
  }
  .mdn-family-card {
    flex: 1; min-width: 160px; padding: 1.5rem 1.4rem;
    border-right: 1px solid #1a2e42;
  }
  .mdn-family-card:last-child { border-right: none; }
  @media (max-width: 600px) {
    .mdn-family-card { flex-basis: 100%; border-right: none; border-bottom: 1px solid #1a2e42; }
    .mdn-family-card:last-child { border-bottom: none; }
  }
  .mdn-family-card__role {
    font-size: 0.55rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
    color: #4a6880; display: block; margin-bottom: 0.4rem;
  }
  .mdn-family-card__name { font-size: 0.9rem; font-weight: 500; color: #c8dce8; }

  /* Events */
  .mdn-events { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  @media (max-width: 600px) { .spt-events { grid-template-columns: 1fr; } }
  .mdn-event {
    background: #122033; border: 1px solid #1a2e42; overflow: hidden;
    position: relative;
  }
  .mdn-event:only-child { grid-column: 1 / -1; max-width: 500px; margin: 0 auto; }
  .mdn-event__photo { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
  .mdn-event__body { padding: 1.4rem; position: relative; }
  .mdn-event__body::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: #f5a623;
  }
  .mdn-event__type {
    font-size: 0.55rem; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase;
    color: #4a6880; display: block; margin-bottom: 0.5rem;
  }
  .mdn-event__name { font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; color: #fff; margin-bottom: 0.35rem; }
  .mdn-event__detail { font-size: 0.82rem; color: #4a6880; line-height: 1.7; margin-bottom: 1rem; }
  .mdn-event__time {
    display: inline-block; background: #f5a623; color: #0d1b2a;
    font-size: 0.72rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.35rem 0.9rem;
  }
  .mdn-event__map-link {
    display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 1rem;
    font-size: 0.82rem; color: #f5a623; text-decoration: none; transition: color 0.2s;
  }
  .mdn-event__map-link:hover { color: #ffb84d; text-decoration: underline; }

  /* RSVP */
  .mdn-rsvp { padding: 4rem 0 5rem; }
  .mdn-rsvp__head { margin-bottom: 2rem; }
  .mdn-rsvp__title {
    font-size: clamp(2rem,5vw,3.2rem); font-weight: 900; text-transform: uppercase;
    letter-spacing: -0.02em; color: #fff; line-height: 1;
  }
  .mdn-rsvp__title span { color: #f5a623; }
  .mdn-rsvp__sub {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase;
    color: #4a6880; margin-top: 0.5rem;
  }

  /* Form */
  .mdn-form { background: rgba(18,32,51,0.7); border: 1px solid rgba(26,46,66,0.5); padding: clamp(1.5rem,4vw,2.5rem); border-radius: 12px; }
  .mdn-field { margin-bottom: 1.8rem; }
  .mdn-label {
    display: block; font-size: 0.75rem; font-weight: 400; letter-spacing: 0.02em;
    color: #6a90b0; margin-bottom: 0.75rem;
  }
  .mdn-toggle-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .mdn-toggle-btn {
    flex: 1; min-width: 110px; padding: 0.7rem 1rem; border: 1px solid rgba(74,104,128,0.3);
    background: rgba(26,46,66,0.3); color: #6a90b0; font-size: 0.85rem; font-weight: 400;
    letter-spacing: 0.02em; cursor: pointer;
    font-family: 'Inter', sans-serif; transition: all 0.15s; text-align: center; border-radius: 8px;
  }
  .mdn-toggle-btn.active { background: rgba(245,166,35,0.15); color: #f5a623; border-color: rgba(245,166,35,0.5); }
  .mdn-menu-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .mdn-menu-btn {
    padding: 0.6rem 1.2rem; border: 1px solid rgba(74,104,128,0.3); background: rgba(26,46,66,0.3);
    color: #6a90b0; font-size: 0.85rem; font-weight: 400; letter-spacing: 0.02em;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; border-radius: 8px;
  }
  .mdn-menu-btn.active { background: rgba(245,166,35,0.15); color: #f5a623; border-color: rgba(245,166,35,0.5); }
  .mdn-children-row { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .mdn-child-label { font-size: 0.75rem; font-weight: 400; letter-spacing: 0.02em; color: #6a90b0; }
  .mdn-number-input {
    width: 75px; padding: 0.5rem 0.6rem; border: 1px solid rgba(74,104,128,0.3); background: rgba(26,46,66,0.3);
    color: #c8dce8; font-size: 0.9rem; font-family: 'Inter', sans-serif; outline: none; border-radius: 6px;
  }
  .mdn-textarea {
    width: 100%; padding: 0.85rem; border: 1px solid rgba(74,104,128,0.3); background: rgba(26,46,66,0.3);
    color: #c8dce8; font-size: 0.88rem; font-family: 'Inter', sans-serif;
    resize: vertical; min-height: 100px; outline: none; line-height: 1.6; border-radius: 10px;
  }
  .mdn-cta-row { display: flex; gap: 0.75rem; margin-top: 2rem; flex-wrap: wrap; }
  .mdn-btn-primary {
    flex: 1; min-width: 140px; padding: 0.95rem 2rem; background: rgba(245,166,35,0.9); color: #0d1b2a;
    border: none; font-size: 0.85rem; font-weight: 500; letter-spacing: 0.02em; border-radius: 10px;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s;
  }
  .mdn-btn-primary:hover { background: rgba(245,166,35,1); box-shadow: 0 2px 8px rgba(245,166,35,0.3); }
  .mdn-btn-secondary {
    flex: 1; min-width: 140px; padding: 0.95rem 2rem; background: rgba(26,46,66,0.3); color: #6a90b0;
    border: 1px solid rgba(74,104,128,0.3); font-size: 0.85rem; font-weight: 500; letter-spacing: 0.02em; border-radius: 10px;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s;
  }
  .mdn-btn-secondary:hover { border-color: rgba(74,104,128,0.5); color: #8ab0c8; }
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
      <div className="mdn-form" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', marginBottom: '1rem', textTransform: 'uppercase' }}>
          Confirmed!
        </h3>
        <p style={{ fontSize: '.9rem', color: '#6a90b0', lineHeight: '1.6' }}>
          Your response has been recorded. See you soon!
        </p>
      </div>
    )
  }

  return (
    <div className="mdn-form">
      <div className="mdn-field">
        <label className="mdn-label">Your Name *</label>
        <input
          className="mdn-number-input"
          type="text"
          placeholder="Enter your full name"
          value={guestName}
          onChange={e => setGuestName(e.target.value)}
          style={{ width: '100%', fontSize: '.88rem', padding: '.8rem' }}
        />
      </div>
      <div className="mdn-field">
        <label className="mdn-label">Will you attend?</label>
        <div className="mdn-toggle-row">
          <button className={`mdn-toggle-btn${attending === 'yes' ? ' active' : ''}`} onClick={() => setAttending('yes')}>Yes, I'm in</button>
          <button className={`mdn-toggle-btn${attending === 'no' ? ' active' : ''}`} onClick={() => setAttending('no')}>Can't make it</button>
        </div>
      </div>

      {attending === 'yes' && (
        <>
          <div className="mdn-field">
            <label className="mdn-label">Coming with a +1?</label>
            <div className="mdn-toggle-row">
              <button className={`mdn-toggle-btn${plusOne === 'yes' ? ' active' : ''}`} onClick={() => setPlusOne('yes')}>Yes</button>
              <button className={`mdn-toggle-btn${plusOne === 'no' ? ' active' : ''}`} onClick={() => setPlusOne('no')}>No</button>
            </div>
            {plusOne === 'yes' && (
              <input
                className="mdn-number-input"
                type="text"
                placeholder="Partner's name"
                value={partnerName}
                onChange={e => setPartnerName(e.target.value)}
                style={{ width: '100%', fontSize: '.88rem', padding: '.8rem', marginTop: '.75rem' }}
              />
            )}
          </div>
          <div className="mdn-field">
            <label className="mdn-label">Menu preference</label>
            <div className="mdn-menu-row">
              {['Meat', 'Fish', 'Vegetarian'].map(m => (
                <button key={m} className={`mdn-menu-btn${menu === m ? ' active' : ''}`} onClick={() => setMenu(m)}>{m}</button>
              ))}
            </div>
          </div>
          <div className="mdn-field">
            <label className="mdn-label">Bringing kids?</label>
            <div className="mdn-children-row">
              <div className="mdn-toggle-row">
                <button className={`mdn-toggle-btn${children === 'yes' ? ' active' : ''}`} onClick={() => setChildren('yes')}>Yes</button>
                <button className={`mdn-toggle-btn${children === 'no' ? ' active' : ''}`} onClick={() => setChildren('no')}>No</button>
              </div>
              {children === 'yes' && (
                <>
                  <span className="mdn-child-label">How many?</span>
                  <input className="mdn-number-input" type="number" min={1} max={10} value={childCount} onChange={e => setChildCount(e.target.value)} />
                </>
              )}
            </div>
          </div>
          <div className="mdn-field">
            <label className="mdn-label">Need transportation?</label>
            <div className="mdn-toggle-row">
              <button className={`mdn-toggle-btn${transport === 'yes' ? ' active' : ''}`} onClick={() => setTransport('yes')}>Yes</button>
              <button className={`mdn-toggle-btn${transport === 'no' ? ' active' : ''}`} onClick={() => setTransport('no')}>No</button>
            </div>
          </div>
        </>
      )}

      {attending === 'no' && (
        <div className="mdn-field">
          <label className="mdn-label">Message (Optional)</label>
          <textarea className="mdn-textarea" placeholder="Let the couple know why you can't attend..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
      )}

      {attending === 'yes' && (
        <div className="mdn-field">
          <label className="mdn-label">Questions or comments (Optional)</label>
          <textarea className="mdn-textarea" placeholder="Anything you'd like us to know..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
      )}

      {attending && (
        <div className="mdn-cta-row">
          {attending === 'yes' && (
            <button
              className="mdn-btn-primary"
              onClick={() => handleSubmit('ACCEPTED')}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Accept'}
            </button>
          )}
          {attending === 'no' && (
            <button
              className="mdn-btn-secondary"
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

export default function ModernInvitation({ invitationRef, invitationData }) {
  const { slug } = useParams()
  const [inv, setInv] = useState(invitationData || null)

  useEffect(() => {
    if (invitationData) {
      setInv(invitationData)
      return
    }
    const ref = invitationRef || slug
    if (!ref) return

    fetch(`/api/invitations/${ref}`)
      .then(r => r.json())
      .then(setInv)
      .catch(console.error)
  }, [slug, invitationRef, invitationData])

  if (!inv) return <div className="mdn-page" style={{minHeight:'100svh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading…</div>

  const year = inv.eventDate ? new Date(inv.eventDate).getUTCFullYear() : ''
  const isDraft = inv.status === 'DRAFT'
  const isPastEvent = inv.eventDate && new Date(inv.eventDate) < new Date()

  return (
    <div className="mdn-page">
      <style>{css}</style>

      {/* Hero – split */}
      <section className="mdn-hero">
        <div className="mdn-hero__photo-side">
          <img src={inv.backgroundImageUrl} alt="Wedding couple" />
          <div className="mdn-hero__photo-overlay" />
        </div>
        <div className="mdn-hero__text-side">
          <span className="mdn-hero__eyebrow">Wedding Invitation · {year}</span>
          <h1 className="mdn-hero__names">
            <span>{inv.groomName.split(' ')[0]}</span> {inv.groomName.split(' ').slice(1).join(' ')}
            <span className="mdn-hero__and">— &amp; —</span>
            <span>{inv.brideName.split(' ')[0]}</span> {inv.brideName.split(' ').slice(1).join(' ')}
          </h1>
          <div className="mdn-hero__meta">
            <div className="mdn-hero__meta-row">
              <div className="mdn-hero__meta-dot" />
              <span className="mdn-hero__meta-text">{fmtDate(inv.eventDate)}</span>
            </div>
            {(inv.ceremonyTime || inv.receptionTime) && (
              <div className="mdn-hero__meta-row">
                <div className="mdn-hero__meta-dot" />
                <span className="mdn-hero__meta-text">
                  {inv.ceremonyTime && <>Ceremony <strong>{inv.ceremonyTime}</strong></>}
                  {inv.ceremonyTime && inv.receptionTime && ' · '}
                  {inv.receptionTime && <>Reception <strong>{inv.receptionTime}</strong></>}
                </span>
              </div>
            )}
            {(inv.ceremonyVenue || inv.receptionVenue) && (
              <div className="mdn-hero__meta-row">
                <div className="mdn-hero__meta-dot" />
                <span className="mdn-hero__meta-text">
                  {inv.ceremonyVenue}{inv.ceremonyVenue && inv.receptionVenue ? ' & ' : ''}{inv.receptionVenue}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <nav className="mdn-nav">
        <div className="mdn-nav__inner">
          {(inv.groomParents || inv.brideParents || inv.godparents) && (
            <a href="#families" className="mdn-nav__link">Families</a>
          )}
          {(inv.ceremonyVenue || inv.receptionVenue) && (
            <a href="#schedule" className="mdn-nav__link">Schedule</a>
          )}
          <a href="#rsvp" className="mdn-nav__link">RSVP</a>
        </div>
      </nav>

      {/* Families */}
      <div className="mdn-wrap">
        {(inv.groomParents || inv.brideParents || inv.godparents) && (
          <div className="mdn-section" id="families">
            <div className="mdn-section-label">Families</div>
            <div className="mdn-families">
              {inv.groomParents && (
                <div className="mdn-family-card">
                  <span className="mdn-family-card__role">Parents of the Groom</span>
                  <p className="mdn-family-card__name">{inv.groomParents}</p>
                </div>
              )}
              {inv.brideParents && (
                <div className="mdn-family-card">
                  <span className="mdn-family-card__role">Parents of the Bride</span>
                  <p className="mdn-family-card__name">{inv.brideParents}</p>
                </div>
              )}
              {inv.godparents && (
                <div className="mdn-family-card">
                  <span className="mdn-family-card__role">Godparents</span>
                  <p className="mdn-family-card__name">{inv.godparents}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Events */}
        {(inv.ceremonyVenue || inv.receptionVenue) && (
          <div className="mdn-section" id="schedule">
            <div className="mdn-section-label">Schedule</div>
            <div className="mdn-events">
              {inv.ceremonyVenue && (
                <div className="mdn-event">
                  {inv.ceremonyPhotoUrl && <img className="mdn-event__photo" src={inv.ceremonyPhotoUrl} alt={inv.ceremonyVenue} />}
                  <div className="mdn-event__body">
                    <span className="mdn-event__type">Ceremony</span>
                    <p className="mdn-event__name">{inv.ceremonyVenue}</p>
                    {inv.ceremonyAddress && <p className="mdn-event__detail">{inv.ceremonyAddress}<br />{fmtDate(inv.eventDate)}</p>}
                    {!inv.ceremonyAddress && <p className="mdn-event__detail">{fmtDate(inv.eventDate)}</p>}
                    {inv.ceremonyTime && <span className="mdn-event__time">{inv.ceremonyTime}</span>}
                    {inv.ceremonyMapUrl && <a className="mdn-event__map-link" href={inv.ceremonyMapUrl} target="_blank" rel="noreferrer" title="View on map"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></a>}
                  </div>
                </div>
              )}
              {inv.receptionVenue && (
                <div className="mdn-event">
                  {inv.receptionPhotoUrl && <img className="mdn-event__photo" src={inv.receptionPhotoUrl} alt={inv.receptionVenue} />}
                  <div className="mdn-event__body">
                    <span className="mdn-event__type">Reception</span>
                    <p className="mdn-event__name">{inv.receptionVenue}</p>
                    {inv.receptionAddress && <p className="mdn-event__detail">{inv.receptionAddress}<br />{fmtDate(inv.eventDate)}</p>}
                    {!inv.receptionAddress && <p className="mdn-event__detail">{fmtDate(inv.eventDate)}</p>}
                    {inv.receptionTime && <span className="mdn-event__time">{inv.receptionTime}</span>}
                    {inv.receptionMapUrl && <a className="mdn-event__map-link" href={inv.receptionMapUrl} target="_blank" rel="noreferrer" title="View on map"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></a>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RSVP */}
      <div className="mdn-rsvp" id="rsvp">
        <div className="mdn-wrap">
          {isDraft ? (
            <div className="mdn-form" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div className="mdn-section-label" style={{ marginBottom: '1rem' }}>COMING SOON</div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                Coming <span style={{color: '#f5a623'}}>Soon</span>
              </h3>
              <p style={{ fontSize: '.9rem', color: '#6a90b0', lineHeight: '1.6' }}>
                This invitation has not been published yet.
              </p>
            </div>
          ) : isPastEvent ? (
            <div className="mdn-form" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div className="mdn-section-label" style={{ marginBottom: '1rem' }}>THANK YOU</div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                Thank <span style={{color: '#f5a623'}}>You</span>
              </h3>
              <p style={{ fontSize: '.9rem', color: '#6a90b0', lineHeight: '1.6', marginBottom: '1rem' }}>
                We hope you enjoyed celebrating with us!
              </p>
              <p style={{ fontSize: '.85rem', color: '#4a6880', lineHeight: '1.6' }}>
                Your presence made our special day even more memorable.
              </p>
            </div>
          ) : (
            <>
              <div className="mdn-rsvp__head">
                <div className="mdn-section-label" style={{ marginBottom: '1rem' }}>RSVP</div>
                <h2 className="mdn-rsvp__title">Your <span>Response</span></h2>
                {inv.rsvpDeadline && <p className="mdn-rsvp__sub">Deadline · {inv.rsvpDeadline}</p>}
              </div>
              <RsvpForm invitationRef={invitationRef || slug} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
