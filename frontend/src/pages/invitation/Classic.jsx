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
  .cl-page { font-family: 'Inter', system-ui, sans-serif; color: #1c1c1c; background: #faf8f4; }

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
  .cl-event__map {
    width: 100%; height: 180px; border: 0; display: block; margin-top: .9rem;
  }

  /* ── RSVP ─────────────────────────────────────── */
  .cl-rsvp { padding: 4rem 0 5rem; }
  .cl-rsvp__head { text-align:center; margin-bottom:2.5rem; }
  .cl-rsvp__title {
    font-family:'Playfair Display',serif; font-size:clamp(1.8rem,4vw,2.6rem);
    font-weight:400; color:#1c1c1c; margin-bottom:.4rem;
  }
  .cl-rsvp__sub { font-size:.82rem; color:#999; letter-spacing:.08em; }

  /* ── Form ─────────────────────────────────────── */
  .cl-form { background:#fff; border:1px solid #e8e2d8; padding:clamp(1.5rem,4vw,2.5rem); }
  .cl-field { margin-bottom:1.8rem; }
  .cl-label {
    display:block; font-size:.6rem; letter-spacing:.25em; text-transform:uppercase;
    color:#888; margin-bottom:.75rem;
  }
  .cl-toggle-row { display:flex; gap:.5rem; flex-wrap:wrap; }
  .cl-toggle-btn {
    flex:1; min-width:120px; padding:.65rem 1rem; border:1px solid #ddd;
    background:#fff; color:#777; font-size:.85rem; cursor:pointer;
    font-family:'Playfair Display',serif; transition:all .18s; text-align:center;
  }
  .cl-toggle-btn.active { background:#1c1c1c; color:#f5f0e8; border-color:#1c1c1c; }
  .cl-menu-row { display:flex; gap:.5rem; flex-wrap:wrap; }
  .cl-menu-btn {
    padding:.55rem 1.3rem; border:1px solid #ddd; background:#fff;
    color:#777; font-size:.82rem; cursor:pointer; font-family:'Playfair Display',serif; transition:all .18s;
  }
  .cl-menu-btn.active { background:#c9a96e; color:#fff; border-color:#c9a96e; }
  .cl-children-row { display:flex; align-items:center; gap:1rem; flex-wrap:wrap; }
  .cl-child-label { font-size:.75rem; color:#888; }
  .cl-number-input {
    width:75px; padding:.5rem .6rem; border:1px solid #ddd;
    font-size:.9rem; font-family:'Playfair Display',serif; outline:none;
  }
  .cl-textarea {
    width:100%; padding:.8rem; border:1px solid #ddd; font-size:.88rem;
    font-family:'Inter',sans-serif; resize:vertical; min-height:100px;
    outline:none; color:#1c1c1c; line-height:1.6;
  }
  .cl-cta-row { display:flex; gap:.75rem; margin-top:2rem; flex-wrap:wrap; }
  .cl-btn-primary {
    flex:1; min-width:140px; padding:.9rem 2rem; background:#1c1c1c; color:#f5f0e8;
    border:1px solid #1c1c1c; font-size:.72rem; letter-spacing:.22em; text-transform:uppercase;
    cursor:pointer; font-family:'Inter',sans-serif; font-weight:500; transition:background .18s;
  }
  .cl-btn-primary:hover { background:#333; }
  .cl-btn-secondary {
    flex:1; min-width:140px; padding:.9rem 2rem; background:#fff; color:#555;
    border:1px solid #ccc; font-size:.72rem; letter-spacing:.22em; text-transform:uppercase;
    cursor:pointer; font-family:'Inter',sans-serif; font-weight:500; transition:all .18s;
  }
  .cl-btn-secondary:hover { border-color:#888; color:#333; }
`

function RsvpForm({ rsvpDeadline }) {
  const [attending, setAttending]   = useState(null)
  const [menu, setMenu]             = useState(null)
  const [plusOne, setPlusOne]       = useState(null)
  const [children, setChildren]     = useState(null)
  const [childCount, setChildCount] = useState(1)
  const [transport, setTransport]   = useState(null)
  const [notes, setNotes]           = useState('')

  return (
    <div className="cl-form">
      <div className="cl-field">
        <label className="cl-label">Will you attend?</label>
        <div className="cl-toggle-row">
          <button className={`cl-toggle-btn${attending==='yes'?' active':''}`} onClick={()=>setAttending('yes')}>Yes, I will attend</button>
          <button className={`cl-toggle-btn${attending==='no'?' active':''}`}  onClick={()=>setAttending('no')}>Unable to attend</button>
        </div>
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
        <label className="cl-label">Attending with a +1?</label>
        <div className="cl-toggle-row">
          <button className={`cl-toggle-btn${plusOne==='yes'?' active':''}`} onClick={()=>setPlusOne('yes')}>Yes</button>
          <button className={`cl-toggle-btn${plusOne==='no'?' active':''}`}  onClick={()=>setPlusOne('no')}>No</button>
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
      <div className="cl-field">
        <label className="cl-label">Questions or Comments</label>
        <textarea className="cl-textarea" placeholder="Dietary restrictions, special requests, or a note for the couple..." value={notes} onChange={e=>setNotes(e.target.value)}/>
      </div>
      <div className="cl-cta-row">
        <button className="cl-btn-primary">Accept Invitation</button>
        <button className="cl-btn-secondary">Decline</button>
      </div>
    </div>
  )
}

export default function ClassicInvitation() {
  const { slug } = useParams()
  const [inv, setInv] = useState(null)

  useEffect(() => {
    fetch(`/api/v2/invitations/${slug}`)
      .then(r => r.json())
      .then(setInv)
      .catch(console.error)
  }, [slug])

  if (!inv) return <div className="cl-page" style={{minHeight:'100svh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading…</div>

  const heroGradient = 'linear-gradient(to bottom, rgba(10,8,5,.55) 0%, rgba(10,8,5,.3) 40%, rgba(10,8,5,.72) 100%)'

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
            <span className="cl-divider__gem">✦ ✦ ✦</span>
            <div className="cl-divider__line"/>
          </div>
          <p className="cl-hero__date">{fmtDate(inv.eventDate)}</p>
        </div>
        <div className="cl-scroll-hint">Scroll</div>
      </section>

      <div className="cl-wrap">
        {/* Families */}
        <div className="cl-section">
          <p className="cl-section__title">With the Blessings of</p>
          <div className="cl-families">
            <div className="cl-family-card">
              <span className="cl-family-card__role">Parents of the Groom</span>
              <p className="cl-family-card__name">{inv.groomParents}</p>
            </div>
            <div className="cl-family-card">
              <span className="cl-family-card__role">Parents of the Bride</span>
              <p className="cl-family-card__name">{inv.brideParents}</p>
            </div>
            {inv.godparents && (
              <div className="cl-family-card">
                <span className="cl-family-card__role">Godparents</span>
                <p className="cl-family-card__name">{inv.godparents}</p>
              </div>
            )}
          </div>
        </div>

        {/* Events */}
        <div className="cl-section">
          <p className="cl-section__title">Order of Celebrations</p>
          <div className="cl-events">
            <div className="cl-event">
              {inv.ceremonyPhotoUrl && <img className="cl-event__photo" src={inv.ceremonyPhotoUrl} alt={inv.ceremonyVenue}/>}
              <div className="cl-event__body">
                <span className="cl-event__type">Holy Ceremony</span>
                <p className="cl-event__name">{inv.ceremonyVenue}</p>
                <p className="cl-event__detail">{inv.ceremonyAddress}<br/>{fmtDate(inv.eventDate)}</p>
                <span className="cl-event__time-pill">{inv.ceremonyTime}</span>
                {inv.ceremonyMapUrl && <iframe className="cl-event__map" src={inv.ceremonyMapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Church location"/>}
              </div>
            </div>
            <div className="cl-event">
              {inv.receptionPhotoUrl && <img className="cl-event__photo" src={inv.receptionPhotoUrl} alt={inv.receptionVenue}/>}
              <div className="cl-event__body">
                <span className="cl-event__type">Reception &amp; Dinner</span>
                <p className="cl-event__name">{inv.receptionVenue}</p>
                <p className="cl-event__detail">{inv.receptionAddress}<br/>{fmtDate(inv.eventDate)}</p>
                <span className="cl-event__time-pill">{inv.receptionTime}</span>
                {inv.receptionMapUrl && <iframe className="cl-event__map" src={inv.receptionMapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Party location"/>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP */}
      <div className="cl-rsvp">
        <div className="cl-wrap">
          <div className="cl-rsvp__head">
            <div className="cl-divider" style={{maxWidth:200,margin:'0 auto 1.5rem'}}>
              <div className="cl-divider__line" style={{background:'#ddd4c0'}}/>
              <span className="cl-divider__gem">✦</span>
              <div className="cl-divider__line" style={{background:'#ddd4c0'}}/>
            </div>
            <h2 className="cl-rsvp__title">Kindly Reply</h2>
            {inv.rsvpDeadline && <p className="cl-rsvp__sub">Please respond by {inv.rsvpDeadline}</p>}
          </div>
          <RsvpForm rsvpDeadline={inv.rsvpDeadline}/>
        </div>
      </div>
    </div>
  )
}
