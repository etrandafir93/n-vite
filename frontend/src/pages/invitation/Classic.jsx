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
  .cl-page * { box-sizing: border-box; margin: 0; padding: 0; }
  .cl-page { font-family: 'Inter', system-ui, sans-serif; color: #1c1c1c; background: #faf8f4; scroll-behavior: smooth; }

  /* ── Hero ─────────────────────────────────────── */
  .cl-hero {
    position: relative; min-height: 100svh; display: flex;
    align-items: center; justify-content: center; text-align: center; overflow: hidden;
  }
  .cl-hero__bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center top;
  }
  .cl-hero__frame {
    position: relative; z-index: 1; border: 1px solid rgba(201,169,110,.55);
    padding: clamp(2rem,6vw,4rem) clamp(2rem,8vw,5rem); max-width: min(640px,92vw); margin: 0 auto;
  }
  .cl-hero__label {
    font-size: .65rem; letter-spacing: .35em; text-transform: uppercase;
    color: #c9a96e; margin-bottom: 1.5rem; display: block;
  }
  .cl-hero__names {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2.4rem,7vw,4.5rem); font-weight: 400; line-height: 1.1; color: #fff;
  }
  .cl-hero__amp {
    display: block; font-size: clamp(1.3rem,3vw,2rem); color: #c9a96e; font-style: italic; margin: .35rem 0;
  }
  .cl-divider { display: flex; align-items: center; gap: 1rem; margin: 1.5rem 0; }
  .cl-divider__line { flex: 1; height: 1px; background: rgba(201,169,110,.45); }
  .cl-divider__gem { color: #c9a96e; font-size: .7rem; letter-spacing: .3em; }
  .cl-hero__date {
    font-size: clamp(.78rem,2vw,.95rem); color: rgba(255,255,255,.82);
    letter-spacing: .12em; text-transform: uppercase;
  }
  .cl-scroll-hint {
    position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
    z-index: 1; display: flex; flex-direction: column; align-items: center; gap: .4rem;
    color: rgba(255,255,255,.4); font-size: .58rem; letter-spacing: .15em; text-transform: uppercase;
  }
  .cl-scroll-hint::after {
    content: ''; display: block; width: 1px; height: 36px;
    background: linear-gradient(to bottom, rgba(201,169,110,.7), transparent);
    animation: clScroll 2s ease-in-out infinite;
  }
  @keyframes clScroll {
    0%,100%{transform:scaleY(0);transform-origin:top;opacity:0}
    40%{opacity:1;transform:scaleY(1);transform-origin:top}
    80%{opacity:0;transform:scaleY(1);transform-origin:bottom}
  }

  /* ── Navigation ───────────────────────────────── */
  .cl-nav {
    position: sticky; top: 0; z-index: 100; background: rgba(250,248,244,0.95);
    backdrop-filter: blur(8px); border-bottom: 1px solid #e8e2d8;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .cl-nav__inner {
    max-width: 800px; margin: 0 auto; padding: 0 1.25rem;
    display: flex; justify-content: center; gap: 2rem;
  }
  .cl-nav__link {
    font-size: .7rem; letter-spacing: .2em; text-transform: uppercase;
    color: #888; padding: 1rem 0; text-decoration: none;
    transition: color .2s; border-bottom: 2px solid transparent;
  }
  .cl-nav__link:hover { color: #c9a96e; border-bottom-color: #c9a96e; }
  @media(max-width:600px){
    .cl-nav__inner { gap: 1rem; }
    .cl-nav__link { font-size: .6rem; padding: .85rem 0; }
  }

  /* ── Layout ───────────────────────────────────── */
  .cl-wrap { max-width: 800px; margin: 0 auto; padding: 0 1.25rem; }
  .cl-section { padding: 3.5rem 0; border-bottom: 1px solid #e8e2d8; }
  .cl-section__title {
    text-align: center; font-size: .6rem; letter-spacing: .3em; text-transform: uppercase;
    color: #c9a96e; margin-bottom: 2rem;
    display: flex; align-items: center; justify-content: center; gap: 1rem;
  }
  .cl-section__title::before,.cl-section__title::after {
    content:''; flex:1; max-width:60px; height:1px; background:#ddd4c0;
  }

  /* ── Families ─────────────────────────────────── */
  .cl-families {
    display: flex; flex-wrap: wrap; background: #fff;
    border: 1px solid #e8e2d8;
  }
  .cl-family-card {
    flex: 1; min-width: 160px; padding: 1.6rem 1.4rem; text-align: center;
    border-right: 1px solid #e8e2d8;
  }
  .cl-family-card:last-child { border-right: none; }
  @media(max-width:600px){
    .cl-family-card { flex-basis: 100%; border-right: none; border-bottom: 1px solid #e8e2d8; }
    .cl-family-card:last-child { border-bottom: none; }
  }
  .cl-family-card__role {
    font-size:.58rem; letter-spacing:.22em; text-transform:uppercase;
    color:#c9a96e; display:block; margin-bottom:.5rem;
  }
  .cl-family-card__name {
    font-family:'Playfair Display',serif; font-size:1rem; font-weight:400; color:#1c1c1c;
  }

  /* ── Event cards with photo ───────────────────── */
  .cl-events { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
  @media(max-width:600px){ .cl-events { grid-template-columns:1fr; } }
  .cl-event {
    background: #fff; border: 1px solid #e8e2d8;
    box-shadow: 0 2px 16px rgba(0,0,0,.05); overflow: hidden;
  }
  .cl-event:only-child { grid-column: 1 / -1; max-width: 500px; margin: 0 auto; }
  .cl-event__photo {
    width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block;
  }
  .cl-event__body { padding: 1.4rem; }
  .cl-event__type {
    font-size:.58rem; letter-spacing:.25em; text-transform:uppercase;
    color:#c9a96e; display:block; margin-bottom:.4rem;
  }
  .cl-event__name {
    font-family:'Playfair Display',serif; font-size:1.1rem; font-weight:400;
    color:#1c1c1c; margin-bottom:.3rem;
  }
  .cl-event__detail { font-size:.83rem; color:#777; line-height:1.7; margin-bottom:.9rem; }
  .cl-event__time-pill {
    display: inline-block; padding: .3rem .9rem; background: #1c1c1c;
    color: #f5f0e8; font-size: .68rem; letter-spacing: .15em; text-transform: uppercase;
  }
  .cl-event__map-link {
    display:inline-flex; align-items:center; gap:.4rem; margin-top:.9rem;
    font-size:.82rem; color:#c9a96e; text-decoration:none; transition:color .2s;
  }
  .cl-event__map-link:hover { color:#b8906b; text-decoration:underline; }

  /* ── RSVP ─────────────────────────────────────── */
  .cl-rsvp { padding: 4rem 0 5rem; }
  .cl-rsvp__head { text-align:center; margin-bottom:2.5rem; }
  .cl-rsvp__title {
    font-family:'Playfair Display',serif; font-size:clamp(1.8rem,4vw,2.6rem);
    font-weight:400; color:#1c1c1c; margin-bottom:.4rem;
  }
  .cl-rsvp__sub { font-size:.82rem; color:#999; letter-spacing:.08em; }

  /* ── Form ─────────────────────────────────────── */
  .cl-form { background:rgba(255,255,255,0.6); border:1px solid rgba(61,20,33,0.05); padding:clamp(1.5rem,4vw,2.5rem); border-radius:16px; }
  .cl-field { margin-bottom:1.8rem; }
  .cl-label {
    display:block; font-size:.75rem; font-weight:400; letter-spacing:.02em;
    color:#888; margin-bottom:.75rem;
  }
  .cl-toggle-row { display:flex; gap:.5rem; flex-wrap:wrap; }
  .cl-toggle-btn {
    flex:1; min-width:120px; padding:.65rem 1rem; border:1px solid rgba(61,20,33,0.08);
    background:rgba(255,255,255,0.4); color:#666; font-size:.85rem; cursor:pointer;
    font-family:'Inter',sans-serif; font-weight:400; transition:all .18s; text-align:center; border-radius:8px;
  }
  .cl-toggle-btn.active { background:rgba(201,169,110,0.12); color:#555; border-color:rgba(201,169,110,0.4); }
  .cl-menu-row { display:flex; gap:.5rem; flex-wrap:wrap; }
  .cl-menu-btn {
    padding:.55rem 1.3rem; border:1px solid rgba(61,20,33,0.08); background:rgba(255,255,255,0.4);
    color:#666; font-size:.82rem; cursor:pointer; font-family:'Inter',sans-serif; font-weight:400; transition:all .18s; border-radius:8px;
  }
  .cl-menu-btn.active { background:rgba(201,169,110,0.12); color:#555; border-color:rgba(201,169,110,0.4); }
  .cl-children-row { display:flex; align-items:center; gap:1rem; flex-wrap:wrap; }
  .cl-child-label { font-size:.75rem; color:#888; }
  .cl-number-input {
    width:75px; padding:.5rem .6rem; border:1px solid rgba(61,20,33,0.08); border-radius:6px;
    font-size:.9rem; font-family:'Inter',sans-serif; outline:none; background:rgba(255,255,255,0.4);
  }
  .cl-textarea {
    width:100%; padding:.8rem; border:1px solid rgba(61,20,33,0.08); font-size:.88rem; border-radius:10px;
    font-family:'Inter',sans-serif; resize:vertical; min-height:100px;
    outline:none; color:#1c1c1c; line-height:1.6; background:rgba(255,255,255,0.4);
  }
  .cl-cta-row { display:flex; gap:.75rem; margin-top:2rem; flex-wrap:wrap; }
  .cl-btn-primary {
    flex:1; min-width:140px; padding:.9rem 2rem; background:rgba(201,169,110,0.85); color:#fff;
    border:none; font-size:.8rem; letter-spacing:.02em; border-radius:10px;
    cursor:pointer; font-family:'Inter',sans-serif; font-weight:500; transition:all .18s;
  }
  .cl-btn-primary:hover { background:rgba(201,169,110,1); box-shadow:0 2px 8px rgba(201,169,110,0.3); }
  .cl-btn-secondary {
    flex:1; min-width:140px; padding:.9rem 2rem; background:rgba(255,255,255,0.5); color:#666;
    border:1px solid rgba(61,20,33,0.08); font-size:.8rem; letter-spacing:.02em; border-radius:10px;
    cursor:pointer; font-family:'Inter',sans-serif; font-weight:500; transition:all .18s;
  }
  .cl-btn-secondary:hover { border-color:rgba(201,169,110,0.4); color:#555; }
`

function RsvpForm({ rsvpDeadline, invitationRef }) {
  const [guestName, setGuestName]   = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [attending, setAttending]   = useState(null)
  const [menu, setMenu]             = useState(null)
  const [plusOne, setPlusOne]       = useState(null)
  const [children, setChildren]     = useState(null)
  const [childCount, setChildCount] = useState(1)
  const [transport, setTransport]   = useState(null)
  const [notes, setNotes]           = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)

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
      <div className="cl-form" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#1c1c1c', marginBottom: '1rem' }}>
          Thank You!
        </h3>
        <p style={{ fontSize: '.9rem', color: '#666', lineHeight: '1.6' }}>
          Your response has been recorded. We look forward to celebrating with you!
        </p>
      </div>
    )
  }

  return (
    <div className="cl-form">
      <div className="cl-field">
        <label className="cl-label">Your Name *</label>
        <input
          className="cl-number-input"
          type="text"
          placeholder="Enter your full name"
          value={guestName}
          onChange={e => setGuestName(e.target.value)}
          style={{ width: '100%', fontSize: '.88rem', padding: '.8rem' }}
        />
      </div>
      <div className="cl-field">
        <label className="cl-label">Will you attend?</label>
        <div className="cl-toggle-row">
          <button className={`cl-toggle-btn${attending==='yes'?' active':''}`} onClick={()=>setAttending('yes')}>Yes, I will attend</button>
          <button className={`cl-toggle-btn${attending==='no'?' active':''}`}  onClick={()=>setAttending('no')}>Unable to attend</button>
        </div>
      </div>

      {attending === 'yes' && (
        <>
          <div className="cl-field">
            <label className="cl-label">Attending with a +1?</label>
            <div className="cl-toggle-row">
              <button className={`cl-toggle-btn${plusOne==='yes'?' active':''}`} onClick={()=>setPlusOne('yes')}>Yes</button>
              <button className={`cl-toggle-btn${plusOne==='no'?' active':''}`}  onClick={()=>setPlusOne('no')}>No</button>
            </div>
            {plusOne === 'yes' && (
              <input
                className="cl-number-input"
                type="text"
                placeholder="Partner's name"
                value={partnerName}
                onChange={e => setPartnerName(e.target.value)}
                style={{ width: '100%', fontSize: '.88rem', padding: '.8rem', marginTop: '.75rem' }}
              />
            )}
          </div>
          <div className="cl-field">
            <label className="cl-label">Menu Preference</label>
            <div className="cl-menu-row">
              {['Meat','Fish','Vegetarian'].map(m=>(
                <button key={m} className={`cl-menu-btn${menu===m?' active':''}`} onClick={()=>setMenu(m)}>{m}</button>
              ))}
            </div>
          </div>
          <div className="cl-field">
            <label className="cl-label">Bringing children?</label>
            <div className="cl-children-row">
              <div className="cl-toggle-row">
                <button className={`cl-toggle-btn${children==='yes'?' active':''}`} onClick={()=>setChildren('yes')}>Yes</button>
                <button className={`cl-toggle-btn${children==='no'?' active':''}`}  onClick={()=>setChildren('no')}>No</button>
              </div>
              {children==='yes'&&(<>
                <span className="cl-child-label">How many?</span>
                <input className="cl-number-input" type="number" min={1} max={10} value={childCount} onChange={e=>setChildCount(e.target.value)}/>
              </>)}
            </div>
          </div>
          <div className="cl-field">
            <label className="cl-label">Do you need transportation?</label>
            <div className="cl-toggle-row">
              <button className={`cl-toggle-btn${transport==='yes'?' active':''}`} onClick={()=>setTransport('yes')}>Yes please</button>
              <button className={`cl-toggle-btn${transport==='no'?' active':''}`}  onClick={()=>setTransport('no')}>No, thank you</button>
            </div>
          </div>
        </>
      )}

      {attending === 'no' && (
        <div className="cl-field">
          <label className="cl-label">Message (Optional)</label>
          <textarea className="cl-textarea" placeholder="Let the couple know why you can't attend..." value={notes} onChange={e=>setNotes(e.target.value)}/>
        </div>
      )}

      {attending === 'yes' && (
        <div className="cl-field">
          <label className="cl-label">Questions or Comments (Optional)</label>
          <textarea className="cl-textarea" placeholder="Dietary restrictions, special requests, or a note for the couple..." value={notes} onChange={e=>setNotes(e.target.value)}/>
        </div>
      )}

      {attending && (
        <div className="cl-cta-row">
          {attending === 'yes' && (
            <button
              className="cl-btn-primary"
              onClick={() => handleSubmit('ACCEPTED')}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Accept Invitation'}
            </button>
          )}
          {attending === 'no' && (
            <button
              className="cl-btn-secondary"
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

export default function ClassicInvitation({ invitationRef, invitationData }) {
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

  if (!inv) return <div className="cl-page" style={{minHeight:'100svh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading…</div>

  const heroGradient = 'linear-gradient(to bottom, rgba(10,8,5,.55) 0%, rgba(10,8,5,.3) 40%, rgba(10,8,5,.72) 100%)'
  const isDraft = inv.status === 'DRAFT'
  const isPastEvent = inv.eventDate && new Date(inv.eventDate) < new Date()

  return (
    <div className="cl-page">
      <style>{css}</style>

      <section className="cl-hero">
        <div className="cl-hero__bg" style={{backgroundImage:`${heroGradient}, url('${inv.backgroundImageUrl}')`}}/>
        <div className="cl-hero__frame">
          <span className="cl-hero__label">Together with their families</span>
          <h1 className="cl-hero__names">
            {inv.groomName}
            <span className="cl-hero__amp">&amp;</span>
            {inv.brideName}
          </h1>
          <div className="cl-divider">
            <div className="cl-divider__line"/>
            <span className="cl-divider__gem">···</span>
            <div className="cl-divider__line"/>
          </div>
          <p className="cl-hero__date">{fmtDate(inv.eventDate)}</p>
        </div>
        <div className="cl-scroll-hint"></div>
      </section>

      <nav className="cl-nav">
        <div className="cl-nav__inner">
          {(inv.groomParents || inv.brideParents || inv.godparents) && (
            <a href="#families" className="cl-nav__link">Families</a>
          )}
          {(inv.ceremonyVenue || inv.receptionVenue) && (
            <a href="#celebrations" className="cl-nav__link">Celebrations</a>
          )}
          <a href="#rsvp" className="cl-nav__link">RSVP</a>
        </div>
      </nav>

      <div className="cl-wrap">
        {/* Families */}
        {(inv.groomParents || inv.brideParents || inv.godparents) && (
          <div className="cl-section" id="families">
            <p className="cl-section__title">With the Blessings of</p>
            <div className="cl-families">
              {inv.groomParents && (
                <div className="cl-family-card">
                  <span className="cl-family-card__role">Parents of the Groom</span>
                  <p className="cl-family-card__name">{inv.groomParents}</p>
                </div>
              )}
              {inv.brideParents && (
                <div className="cl-family-card">
                  <span className="cl-family-card__role">Parents of the Bride</span>
                  <p className="cl-family-card__name">{inv.brideParents}</p>
                </div>
              )}
              {inv.godparents && (
                <div className="cl-family-card">
                  <span className="cl-family-card__role">Godparents</span>
                  <p className="cl-family-card__name">{inv.godparents}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Events */}
        {(inv.ceremonyVenue || inv.receptionVenue) && (
          <div className="cl-section" id="celebrations">
            <p className="cl-section__title">Order of Celebrations</p>
            <div className="cl-events">
              {inv.ceremonyVenue && (
                <div className="cl-event">
                  {inv.ceremonyPhotoUrl && <img className="cl-event__photo" src={inv.ceremonyPhotoUrl} alt={inv.ceremonyVenue}/>}
                  <div className="cl-event__body">
                    <span className="cl-event__type">Holy Ceremony</span>
                    <p className="cl-event__name">{inv.ceremonyVenue}</p>
                    {inv.ceremonyAddress && <p className="cl-event__detail">{inv.ceremonyAddress}<br/>{fmtDate(inv.eventDate)}</p>}
                    {!inv.ceremonyAddress && <p className="cl-event__detail">{fmtDate(inv.eventDate)}</p>}
                    {inv.ceremonyTime && <span className="cl-event__time-pill">{inv.ceremonyTime}</span>}
                    {inv.ceremonyMapUrl && <a className="cl-event__map-link" href={inv.ceremonyMapUrl} target="_blank" rel="noreferrer" title="View on map"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></a>}
                  </div>
                </div>
              )}
              {inv.receptionVenue && (
                <div className="cl-event">
                  {inv.receptionPhotoUrl && <img className="cl-event__photo" src={inv.receptionPhotoUrl} alt={inv.receptionVenue}/>}
                  <div className="cl-event__body">
                    <span className="cl-event__type">Reception &amp; Dinner</span>
                    <p className="cl-event__name">{inv.receptionVenue}</p>
                    {inv.receptionAddress && <p className="cl-event__detail">{inv.receptionAddress}<br/>{fmtDate(inv.eventDate)}</p>}
                    {!inv.receptionAddress && <p className="cl-event__detail">{fmtDate(inv.eventDate)}</p>}
                    {inv.receptionTime && <span className="cl-event__time-pill">{inv.receptionTime}</span>}
                    {inv.receptionMapUrl && <a className="cl-event__map-link" href={inv.receptionMapUrl} target="_blank" rel="noreferrer" title="View on map"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></a>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RSVP */}
      <div className="cl-rsvp" id="rsvp">
        <div className="cl-wrap">
          {isDraft ? (
            <div className="cl-form" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div className="cl-divider" style={{maxWidth:200,margin:'0 auto 1.5rem'}}>
                <div className="cl-divider__line" style={{background:'#ddd4c0'}}/>
                <span className="cl-divider__gem">·</span>
                <div className="cl-divider__line" style={{background:'#ddd4c0'}}/>
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#1c1c1c', marginBottom: '1rem' }}>
                Coming Soon
              </h3>
              <p style={{ fontSize: '.9rem', color: '#666', lineHeight: '1.6' }}>
                This invitation has not been published yet.
              </p>
            </div>
          ) : isPastEvent ? (
            <div className="cl-form" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div className="cl-divider" style={{maxWidth:200,margin:'0 auto 1.5rem'}}>
                <div className="cl-divider__line" style={{background:'#ddd4c0'}}/>
                <span className="cl-divider__gem">·</span>
                <div className="cl-divider__line" style={{background:'#ddd4c0'}}/>
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#1c1c1c', marginBottom: '1rem' }}>
                Thank You
              </h3>
              <p style={{ fontSize: '.9rem', color: '#666', lineHeight: '1.6', marginBottom: '1rem' }}>
                We hope you enjoyed celebrating with us!
              </p>
              <p style={{ fontSize: '.85rem', color: '#888', lineHeight: '1.6' }}>
                Your presence made our special day even more memorable.
              </p>
            </div>
          ) : (
            <>
              <div className="cl-rsvp__head">
                <div className="cl-divider" style={{maxWidth:200,margin:'0 auto 1.5rem'}}>
                  <div className="cl-divider__line" style={{background:'#ddd4c0'}}/>
                  <span className="cl-divider__gem">·</span>
                  <div className="cl-divider__line" style={{background:'#ddd4c0'}}/>
                </div>
                <h2 className="cl-rsvp__title">Kindly Reply</h2>
                {inv.rsvpDeadline && <p className="cl-rsvp__sub">Please respond by {inv.rsvpDeadline}</p>}
              </div>
              <RsvpForm rsvpDeadline={inv.rsvpDeadline} invitationRef={invitationRef || slug}/>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
