import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCountdown } from './useCountdown'

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

  /* ── Countdown ─────────────────────────────────── */
  .cl-countdown { display: flex; gap: 1.5rem; justify-content: center; margin-top: 1.75rem; }
  .cl-countdown__unit { text-align: center; }
  .cl-countdown__num { display: block; font-family: 'Playfair Display', Georgia, serif; font-size: 2.2rem; color: #fff; line-height: 1; font-weight: 400; }
  .cl-countdown__label { display: block; font-size: 0.55rem; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.55); margin-top: 0.3rem; }
  .cl-countdown__sep { font-size: 1.4rem; color: rgba(201,169,110,0.5); align-self: center; padding-bottom: 0.6rem; }
  @media(max-width:600px){ .cl-countdown { gap: 1rem; } .cl-countdown__num { font-size: 1.7rem; } }

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
  .cl-wrap { max-width: 800px; margin: 0 auto; padding: 0 clamp(1rem, 5vw, 1.5rem); }
  .cl-section { padding: clamp(2.5rem, 6vw, 3.5rem) 0; border-bottom: 1px solid #e8e2d8; }
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
    display: inline-flex; align-items: center; gap: .45rem; margin-top: 1.1rem;
    padding: .42rem 1rem; border: 1px solid #c9a96e; border-radius: 2px;
    font-size: .7rem; letter-spacing: .12em; text-transform: uppercase;
    color: #c9a96e; text-decoration: none; transition: background .2s, color .2s;
  }
  .cl-event__map-link:hover { background: #c9a96e; color: #1c1c1c; }

  /* ── RSVP ─────────────────────────────────────── */
  .cl-rsvp { padding: clamp(2.5rem, 8vw, 5rem) 0 clamp(3rem, 10vw, 5rem); }
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
    flex:1; min-width:120px; padding:.75rem 1rem; border:1px solid rgba(61,20,33,0.08);
    background:rgba(255,255,255,0.4); color:#666; font-size:.85rem; cursor:pointer;
    font-family:'Inter',sans-serif; font-weight:400; transition:all .18s; text-align:center; border-radius:8px;
  }
  .cl-toggle-btn.active { background:rgba(201,169,110,0.12); color:#555; border-color:rgba(201,169,110,0.4); }
  .cl-menu-row { display:flex; gap:.5rem; flex-wrap:wrap; }
  .cl-menu-btn {
    padding:.65rem 1.3rem; border:1px solid rgba(61,20,33,0.08); background:rgba(255,255,255,0.4);
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
  .cl-rsvp-errors {
    background: #fff5f5; border: 1.5px solid #f0c0c0; border-radius: 8px;
    padding: .85rem 1.1rem; margin-bottom: 1.2rem; font-size: .82rem; color: #a83030;
  }
  .cl-rsvp-errors p { font-weight: 600; margin: 0 0 .35rem; }
  .cl-rsvp-errors ul { margin: 0; padding-left: 1.1rem; }
  .cl-rsvp-errors li + li { margin-top: .15rem; }
  .cl-field--error > .cl-label { color: #a83030; }
  .cl-field--error .cl-number-input { border-color: #e5a0a0 !important; background: #fff8f8 !important; }
  .cl-field--error .cl-toggle-row, .cl-field--error .cl-menu-row { border-radius: 8px; outline: 1.5px solid #a83030; }
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

  /* ── Envelope Intro ──────────────────────────── */
  .cl-env-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: radial-gradient(ellipse at 50% 40%, #fdf9f2 0%, #ede6d5 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem;
    cursor: pointer; transition: opacity 0.7s ease 0.4s;
  }
  .cl-env-overlay--opening { opacity: 0; pointer-events: none; }
  .cl-env-overlay__deco { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
  .cl-env-overlay__deco span {
    position: absolute; opacity: 0; color: #c9a96e;
    animation: clEnvFloat 6s ease-in-out infinite;
  }
  .cl-env-overlay__deco span:nth-child(1) { left: 11%; top: 19%; font-size: 1rem; animation-delay: 0s; }
  .cl-env-overlay__deco span:nth-child(2) { left: 81%; top: 14%; font-size: .7rem; animation-delay: 1.3s; }
  .cl-env-overlay__deco span:nth-child(3) { left: 69%; top: 69%; font-size: .95rem; animation-delay: 2.5s; }
  .cl-env-overlay__deco span:nth-child(4) { left: 20%; top: 73%; font-size: .7rem; animation-delay: 0.9s; }
  .cl-env-overlay__deco span:nth-child(5) { left: 49%; top: 9%; font-size: .6rem; animation-delay: 3.1s; }
  @keyframes clEnvFloat { 0%,100%{opacity:0;transform:translateY(0) rotate(0deg)} 40%,60%{opacity:.55} 50%{transform:translateY(-12px) rotate(18deg)} }
  .cl-env-title {
    font-family: 'Cormorant Garamond','Georgia',serif;
    font-size: clamp(.8rem,3vw,1rem); letter-spacing: .28em; text-transform: uppercase;
    color: #8a6a3a; font-weight: 400;
  }
  .cl-env { position: relative; width: clamp(260px,72vw,380px); height: clamp(172px,50vw,258px); filter: drop-shadow(0 14px 44px rgba(120,80,20,.14)) drop-shadow(0 2px 6px rgba(0,0,0,.06)); }
  .cl-env__body {
    position: absolute; inset: 0;
    background: linear-gradient(160deg, #fefcf7 0%, #f8f2e5 100%);
    border: 1px solid #d8ccb0;
    display: flex; align-items: center; justify-content: center;
  }
  .cl-env__body::before {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; top: 40%;
    background:
      linear-gradient(to bottom right, transparent 49%, #ede4ce 50%) left / 50.5% 100% no-repeat,
      linear-gradient(to bottom left,  transparent 49%, #e8dcca 50%) right / 50.5% 100% no-repeat;
  }
  .cl-env__body::after {
    content: ''; position: absolute; inset: 7px; border: 1px dashed rgba(201,169,110,.28); pointer-events: none;
  }
  .cl-env__seal {
    position: relative; z-index: 2; width: 52px; height: 52px; border-radius: 50%;
    background: radial-gradient(circle at 34% 34%, #d4b06a, #9a6e2e);
    display: flex; align-items: center; justify-content: center;
    color: #fff4dc; font-size: 1.1rem;
    box-shadow: 0 3px 14px rgba(130,80,10,.45), inset 0 1px 2px rgba(255,240,180,.3);
  }
  .cl-env__seal::before { content: ''; position: absolute; inset: 4px; border-radius: 50%; border: 1px solid rgba(255,238,180,.35); }
  .cl-env__flap {
    position: absolute; top: -1px; left: -1px; right: -1px; height: 55%;
    background: linear-gradient(175deg, #f4ecda, #eadfC6);
    border: 1px solid #d8ccb0;
    clip-path: polygon(0 0,100% 0,50% 80%);
    transform-origin: top; transform: perspective(800px) rotateX(0deg);
    transition: transform .65s cubic-bezier(.4,0,.2,1); z-index: 10;
  }
  .cl-env--open .cl-env__flap { transform: perspective(800px) rotateX(-172deg); }
  .cl-env__letter {
    position: absolute; bottom: 8%; left: 14%; right: 14%; height: 70%;
    background: linear-gradient(to bottom, #fefefe, #fdf8f0);
    border: 1px solid #e0d8c4;
    transform: translateY(0); transition: transform .5s ease .2s; z-index: 1;
  }
  .cl-env__letter::before {
    content: ''; position: absolute; left: 14%; right: 14%; top: 28%; height: 1px;
    background: rgba(201,169,110,.18);
    box-shadow: 0 10px 0 rgba(201,169,110,.13), 0 20px 0 rgba(201,169,110,.10), 0 30px 0 rgba(201,169,110,.07);
  }
  .cl-env--open .cl-env__letter { transform: translateY(-26%); }
  .cl-env__hint { font-size: .62rem; letter-spacing: .3em; text-transform: uppercase; color: #c9a96e; animation: envPulse 2s ease-in-out infinite; }
  @keyframes envPulse { 0%,100%{opacity:.4} 50%{opacity:1} }

  /* ── Dress Code ───────────────────────────────── */
  .cl-dress-code { display: flex; gap: 1.5rem; align-items: flex-start; flex-wrap: wrap; }
  .cl-dress-code__photo { width: clamp(120px, 30%, 200px); aspect-ratio: 3/4; object-fit: cover; flex-shrink: 0; }
  .cl-dress-code__info { flex: 1; min-width: 180px; }
  .cl-dress-code__row { margin-bottom: 1rem; }
  .cl-dress-code__label { font-size: .58rem; letter-spacing: .22em; text-transform: uppercase; color: #c9a96e; display: block; margin-bottom: .3rem; }
  .cl-dress-code__value { font-size: .88rem; color: #1c1c1c; line-height: 1.6; }
  .cl-dress-code__swatches { display: flex; gap: .5rem; flex-wrap: wrap; margin-top: .4rem; }
  .cl-dress-code__swatch { padding: .25rem .8rem; border: 1px solid #e8e2d8; font-size: .75rem; color: #555; background: #faf8f4; }
  .cl-dress-code__note { font-size: .82rem; color: #777; line-height: 1.7; font-style: italic; border-left: 2px solid #c9a96e; padding-left: .75rem; margin-top: .75rem; }

  /* ── Accommodation ────────────────────────────── */
  .cl-hotels { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
  .cl-hotel { background: #fff; border: 1px solid #e8e2d8; padding: 1.25rem 1.2rem; }
  .cl-hotel__name { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 400; color: #1c1c1c; margin-bottom: .4rem; }
  .cl-hotel__dist { font-size: .72rem; color: #c9a96e; letter-spacing: .08em; margin-bottom: .5rem; }
  .cl-hotel__note { font-size: .8rem; color: #777; line-height: 1.6; margin-bottom: .75rem; }
  .cl-hotel__link { display: inline-block; font-size: .7rem; letter-spacing: .12em; text-transform: uppercase; color: #c9a96e; text-decoration: none; border-bottom: 1px solid rgba(201,169,110,.4); transition: border-color .2s; }
  .cl-hotel__link:hover { border-bottom-color: #c9a96e; }

  /* ── Day Schedule ─────────────────────────────── */
  .cl-schedule { position: relative; padding-left: 1.5rem; }
  .cl-schedule::before { content: ''; position: absolute; left: .35rem; top: .5rem; bottom: .5rem; width: 1px; background: linear-gradient(to bottom, #c9a96e, rgba(201,169,110,.15)); }
  .cl-schedule__item { position: relative; display: flex; gap: 1rem; align-items: baseline; margin-bottom: 1.4rem; }
  .cl-schedule__item:last-child { margin-bottom: 0; }
  .cl-schedule__item::before { content: ''; position: absolute; left: -1.15rem; top: .42rem; width: 7px; height: 7px; border-radius: 50%; background: #c9a96e; flex-shrink: 0; }
  .cl-schedule__time { font-size: .7rem; letter-spacing: .12em; color: #c9a96e; white-space: nowrap; min-width: 60px; }
  .cl-schedule__label { font-size: .88rem; color: #1c1c1c; line-height: 1.5; }
`

function EnvelopeIntro({ opening, onOpen }) {
  return (
    <div className={`cl-env-overlay${opening ? ' cl-env-overlay--opening' : ''}`} onClick={onOpen} role="button" aria-label="Open invitation">
      <div className="cl-env-overlay__deco" aria-hidden="true">
        <span>✦</span><span>◆</span><span>✦</span><span>◆</span><span>✦</span>
      </div>
      <p className="cl-env-title">You're invited</p>
      <div className={`cl-env${opening ? ' cl-env--open' : ''}`}>
        <div className="cl-env__body"><div className="cl-env__seal">♦</div></div>
        <div className="cl-env__flap" />
        <div className="cl-env__letter" />
      </div>
      {!opening && <p className="cl-env__hint">Tap to open</p>}
    </div>
  )
}

const DEFAULT_MENU_OPTIONS = ['Meat', 'Fish', 'Vegetarian']

function RsvpForm({ rsvpDeadline, invitationRef, menuOptions }) {
  const menuChoices = (menuOptions && menuOptions.length > 0) ? menuOptions : DEFAULT_MENU_OPTIONS
  const [guestName, setGuestName]   = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [attending, setAttending]   = useState(null)
  const [menu, setMenu]             = useState(null)
  const [plusOne, setPlusOne]       = useState(null)
  const [children, setChildren]     = useState(null)
  const [childCount, setChildCount] = useState(1)
  const [transport, setTransport]   = useState(null)
  const [allergies, setAllergies]   = useState(null)
  const [allergyDetails, setAllergyDetails] = useState('')
  const [notes, setNotes]           = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)

  const validate = () => {
    const errs = {}
    if (!guestName.trim()) errs.guestName = 'Your name is required'
    if (!attending) errs.attending = 'Please indicate if you will attend'
    if (attending === 'yes') {
      if (plusOne === 'yes' && !partnerName.trim()) errs.partnerName = "Partner's name is required"
      if (!menu) errs.menu = 'Menu preference is required'
    }
    return errs
  }

  const handleSubmit = async (answer) => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setSubmitError(null)
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
          allergies: allergies === 'yes' ? (allergyDetails.trim() || 'Yes') : null,
          notes: notes.trim() || null
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit RSVP')
      }

      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      setSubmitError('We could not save your response right now. Please try again.')
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
        <button
          className="cl-btn-secondary"
          type="button"
          onClick={() => setSubmitted(false)}
          style={{ marginTop: '1.1rem', maxWidth: '220px' }}
        >
          Update response
        </button>
      </div>
    )
  }

  return (
    <div className="cl-form">
      <div className={`cl-field${errors.guestName ? ' cl-field--error' : ''}`}>
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
      <div className={`cl-field${errors.attending ? ' cl-field--error' : ''}`}>
        <label className="cl-label">Will you attend?</label>
        <div className="cl-toggle-row">
          <button className={`cl-toggle-btn${attending==='yes'?' active':''}`} onClick={()=>setAttending('yes')}>Yes, I will attend</button>
          <button className={`cl-toggle-btn${attending==='no'?' active':''}`}  onClick={()=>setAttending('no')}>Unable to attend</button>
        </div>
      </div>

      {attending === 'yes' && (
        <>
          <div className={`cl-field${errors.partnerName ? ' cl-field--error' : ''}`}>
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
          <div className={`cl-field${errors.menu ? ' cl-field--error' : ''}`}>
            <label className="cl-label">Menu Preference</label>
            <div className="cl-menu-row">
              {menuChoices.map(m=>(
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
          <div className="cl-field">
            <label className="cl-label">Do you have any food allergies?</label>
            <div className="cl-toggle-row">
              <button className={`cl-toggle-btn${allergies==='yes'?' active':''}`} onClick={()=>setAllergies('yes')}>Yes</button>
              <button className={`cl-toggle-btn${allergies==='no'?' active':''}`}  onClick={()=>setAllergies('no')}>No</button>
            </div>
            {allergies === 'yes' && (
              <input
                className="cl-number-input"
                type="text"
                placeholder="Please describe your allergies..."
                value={allergyDetails}
                onChange={e => setAllergyDetails(e.target.value)}
                style={{ width: '100%', fontSize: '.88rem', padding: '.8rem', marginTop: '.75rem' }}
              />
            )}
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

      {Object.keys(errors).length > 0 && (
        <div className="cl-rsvp-errors">
          <p>Please fill in the following:</p>
          <ul>
            {Object.values(errors).map((msg, i) => <li key={i}>{msg}</li>)}
          </ul>
        </div>
      )}
      {submitError && (
        <div className="cl-rsvp-errors" role="alert" style={{ marginTop: '.6rem' }}>
          <p>{submitError}</p>
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
  const isPreview = new URLSearchParams(window.location.search).get('preview') === 'true'
  const [phase, setPhase] = useState(isPreview ? 'open' : 'closed')

  const handleOpen = () => {
    if (phase !== 'closed') return
    setPhase('opening')
    setTimeout(() => setPhase('open'), 1100)
  }

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
  const findSection = (type) => (inv.sections || []).find(s => s.type === type) || null
  const dressCode = findSection('DRESS_CODE')
  const accommodation = findSection('ACCOMMODATION')
  const daySchedule = findSection('DAY_SCHEDULE')
  const isPastEvent = inv.eventDate && new Date(inv.eventDate) < new Date()
  const countdown = useCountdown(inv.eventDate)

  return (
    <div className="cl-page">
      <style>{css}</style>
      {phase !== 'open' && <EnvelopeIntro opening={phase === 'opening'} onOpen={handleOpen} />}

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
          {countdown && (
            <div className="cl-countdown">
              <div className="cl-countdown__unit">
                <span className="cl-countdown__num">{String(countdown.days).padStart(2,'0')}</span>
                <span className="cl-countdown__label">Days</span>
              </div>
              <span className="cl-countdown__sep">·</span>
              <div className="cl-countdown__unit">
                <span className="cl-countdown__num">{String(countdown.hours).padStart(2,'0')}</span>
                <span className="cl-countdown__label">Hours</span>
              </div>
              <span className="cl-countdown__sep">·</span>
              <div className="cl-countdown__unit">
                <span className="cl-countdown__num">{String(countdown.minutes).padStart(2,'0')}</span>
                <span className="cl-countdown__label">Min</span>
              </div>
              <span className="cl-countdown__sep">·</span>
              <div className="cl-countdown__unit">
                <span className="cl-countdown__num">{String(countdown.seconds).padStart(2,'0')}</span>
                <span className="cl-countdown__label">Sec</span>
              </div>
            </div>
          )}
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
          {dressCode && <a href="#dress-code" className="cl-nav__link">Dress Code</a>}
          {accommodation && <a href="#accommodation" className="cl-nav__link">Stay</a>}
          {daySchedule && <a href="#schedule" className="cl-nav__link">Schedule</a>}
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
                    {inv.ceremonyMapUrl && <a className="cl-event__map-link" href={inv.ceremonyMapUrl} target="_blank" rel="noreferrer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>View on map</a>}
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
                    {inv.receptionMapUrl && <a className="cl-event__map-link" href={inv.receptionMapUrl} target="_blank" rel="noreferrer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>View on map</a>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Dress Code */}
        {dressCode && (
          <div className="cl-section" id="dress-code">
            <p className="cl-section__title">Dress Code</p>
            <div className="cl-dress-code">
              {dressCode.dressCodeImageUrl && (
                <img className="cl-dress-code__photo" src={dressCode.dressCodeImageUrl} alt="Dress code"/>
              )}
              <div className="cl-dress-code__info">
                {dressCode.dressCodeFormality && (
                  <div className="cl-dress-code__row">
                    <span className="cl-dress-code__label">Formality</span>
                    <span className="cl-dress-code__value">{dressCode.dressCodeFormality}</span>
                  </div>
                )}
                {dressCode.dressCodeColours && (
                  <div className="cl-dress-code__row">
                    <span className="cl-dress-code__label">Colour Palette</span>
                    <div className="cl-dress-code__swatches">
                      {dressCode.dressCodeColours.split(',').map(c => (
                        <span key={c} className="cl-dress-code__swatch">{c.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
                {dressCode.dressCodeNote && (
                  <p className="cl-dress-code__note">{dressCode.dressCodeNote}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Accommodation */}
        {accommodation && accommodation.hotels && accommodation.hotels.length > 0 && (
          <div className="cl-section" id="accommodation">
            <p className="cl-section__title">Where to Stay</p>
            <div className="cl-hotels">
              {accommodation.hotels.map((h, i) => (
                <div key={i} className="cl-hotel">
                  <p className="cl-hotel__name">{h.name}</p>
                  {h.distance && <p className="cl-hotel__dist">{h.distance} from venue</p>}
                  {h.note && <p className="cl-hotel__note">{h.note}</p>}
                  {h.bookingLink && <a className="cl-hotel__link" href={h.bookingLink} target="_blank" rel="noreferrer">Book Now ↗</a>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Day Schedule */}
        {daySchedule && daySchedule.scheduleItems && daySchedule.scheduleItems.length > 0 && (
          <div className="cl-section" id="schedule">
            <p className="cl-section__title">Day Schedule</p>
            <div className="cl-schedule">
              {daySchedule.scheduleItems.map((item, i) => (
                <div key={i} className="cl-schedule__item">
                  <span className="cl-schedule__time">{item.time}</span>
                  <span className="cl-schedule__label">{item.label}</span>
                </div>
              ))}
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
              <RsvpForm rsvpDeadline={inv.rsvpDeadline} invitationRef={invitationRef || slug} menuOptions={inv.menuOptions}/>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
