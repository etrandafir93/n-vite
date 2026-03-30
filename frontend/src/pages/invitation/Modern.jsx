import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCountdown } from './useCountdown'

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
  @media (max-width: 720px) { .mdn-hero { grid-template-columns: 1fr; } }

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

  /* Countdown */
  .mdn-countdown { display: flex; gap: 1.5rem; margin-top: 2rem; }
  .mdn-countdown__unit { text-align: center; }
  .mdn-countdown__num { display: block; font-size: 2.2rem; font-weight: 900; color: #fff; line-height: 1; letter-spacing: -0.02em; }
  .mdn-countdown__label { display: block; font-size: 0.55rem; letter-spacing: 0.25em; text-transform: uppercase; color: #6a90b0; margin-top: 0.3rem; }
  .mdn-countdown__sep { font-size: 1.6rem; font-weight: 900; color: #f5a623; align-self: center; padding-bottom: 0.5rem; }
  @media(max-width:600px){ .mdn-countdown { gap: 1rem; } .mdn-countdown__num { font-size: 1.7rem; } }

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
  .mdn-wrap { max-width: 860px; margin: 0 auto; padding: 0 clamp(1rem, 5vw, 1.5rem); }
  .mdn-section { padding: clamp(2.5rem, 6vw, 3.5rem) 0; border-bottom: 1px solid #1a2e42; }
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
  @media (max-width: 600px) { .mdn-events { grid-template-columns: 1fr; } }
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
    display: inline-flex; align-items: center; gap: 0.45rem; margin-top: 1.1rem;
    padding: 0.42rem 1rem; border: 2px solid #f5a623; border-radius: 0;
    font-size: 0.7rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
    color: #f5a623; text-decoration: none; transition: background 0.2s, color 0.2s;
  }
  .mdn-event__map-link:hover { background: #f5a623; color: #1a1a2e; }

  /* RSVP */
  .mdn-rsvp { padding: clamp(2.5rem, 8vw, 5rem) 0 clamp(3rem, 10vw, 5rem); }
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
    flex: 1; min-width: 110px; padding: 0.75rem 1rem; border: 1px solid rgba(74,104,128,0.3);
    background: rgba(26,46,66,0.3); color: #6a90b0; font-size: 0.85rem; font-weight: 400;
    letter-spacing: 0.02em; cursor: pointer;
    font-family: 'Inter', sans-serif; transition: all 0.15s; text-align: center; border-radius: 8px;
  }
  .mdn-toggle-btn.active { background: rgba(245,166,35,0.15); color: #f5a623; border-color: rgba(245,166,35,0.5); }
  .mdn-menu-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .mdn-menu-btn {
    padding: 0.65rem 1.2rem; border: 1px solid rgba(74,104,128,0.3); background: rgba(26,46,66,0.3);
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
  .mdn-rsvp-errors {
    background: rgba(200,50,50,0.1); border: 1.5px solid rgba(200,50,50,0.3); border-radius: 8px;
    padding: .85rem 1.1rem; margin-bottom: 1.2rem; font-size: .82rem; color: #ff8080;
  }
  .mdn-rsvp-errors p { font-weight: 600; margin: 0 0 .35rem; }
  .mdn-rsvp-errors ul { margin: 0; padding-left: 1.1rem; }
  .mdn-rsvp-errors li + li { margin-top: .15rem; }
  .mdn-field--error > .mdn-label { color: #ff8080; }
  .mdn-field--error .mdn-input { border-color: rgba(200,50,50,0.5) !important; }
  .mdn-field--error .mdn-toggle-row, .mdn-field--error .mdn-menu-row { border-radius: 8px; outline: 1.5px solid rgba(200,50,50,0.6); }
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

  /* ── Envelope Intro ──────────────────────────── */
  .mdn-env-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: radial-gradient(ellipse at 50% 42%, #142438 0%, #070e18 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem;
    cursor: pointer; transition: opacity 0.7s ease 0.4s;
  }
  .mdn-env-overlay--opening { opacity: 0; pointer-events: none; }
  .mdn-env-overlay__deco { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
  .mdn-env-overlay__deco span {
    position: absolute; opacity: 0; color: #f5a623;
    animation: mdnEnvFloat 5s ease-in-out infinite;
  }
  .mdn-env-overlay__deco span:nth-child(1) { left: 8%; top: 22%; font-size: .45rem; animation-delay: 0s; }
  .mdn-env-overlay__deco span:nth-child(2) { left: 85%; top: 17%; font-size: .38rem; animation-delay: 1.3s; }
  .mdn-env-overlay__deco span:nth-child(3) { left: 72%; top: 73%; font-size: .48rem; animation-delay: 2.5s; }
  .mdn-env-overlay__deco span:nth-child(4) { left: 14%; top: 78%; font-size: .35rem; animation-delay: 0.8s; }
  .mdn-env-overlay__deco span:nth-child(5) { left: 44%; top: 7%; font-size: .4rem; animation-delay: 3.3s; }
  @keyframes mdnEnvFloat { 0%,100%{opacity:0;transform:scale(.7) rotate(0deg)} 50%{opacity:.65;transform:scale(1) rotate(45deg)} }
  .mdn-env-title {
    font-family: 'Inter',sans-serif;
    font-size: clamp(.6rem,2.5vw,.75rem); font-weight: 800; letter-spacing: .35em; text-transform: uppercase;
    color: #f5a623;
  }
  .mdn-env { position: relative; width: clamp(260px,72vw,380px); height: clamp(172px,50vw,258px); filter: drop-shadow(0 16px 52px rgba(0,0,0,.65)) drop-shadow(0 0 28px rgba(245,166,35,.07)); }
  .mdn-env__body {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #162840 0%, #0e1e30 100%);
    border: 1px solid rgba(245,166,35,.22);
    display: flex; align-items: center; justify-content: center;
  }
  .mdn-env__body::before {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; top: 40%;
    background:
      linear-gradient(to bottom right, transparent 49%, #0d1b2a 50%) left / 50.5% 100% no-repeat,
      linear-gradient(to bottom left,  transparent 49%, #0a1520 50%) right / 50.5% 100% no-repeat;
  }
  .mdn-env__body::after {
    content: ''; position: absolute; top: 7px; right: 7px; width: 26px; height: 34px;
    border: 1px solid rgba(245,166,35,.28); pointer-events: none;
  }
  .mdn-env__seal {
    position: relative; z-index: 2; width: 50px; height: 50px; border-radius: 0;
    background: linear-gradient(135deg, #f5a623, #c87d10);
    display: flex; align-items: center; justify-content: center;
    color: #0d1b2a; font-size: 1rem; font-weight: 900;
    box-shadow: 0 3px 18px rgba(245,166,35,.52), 0 0 28px rgba(245,166,35,.1);
    clip-path: polygon(50% 0%,100% 50%,50% 100%,0% 50%);
  }
  .mdn-env__flap {
    position: absolute; top: -1px; left: -1px; right: -1px; height: 55%;
    background: linear-gradient(175deg, #0f2035, #0d1b2a);
    border: 1px solid rgba(245,166,35,.18);
    clip-path: polygon(0 0,100% 0,50% 80%);
    transform-origin: top; transform: perspective(800px) rotateX(0deg);
    transition: transform .65s cubic-bezier(.4,0,.2,1); z-index: 10;
  }
  .mdn-env--open .mdn-env__flap { transform: perspective(800px) rotateX(-172deg); }
  .mdn-env__letter {
    position: absolute; bottom: 8%; left: 14%; right: 14%; height: 70%;
    background: linear-gradient(to bottom, #0e1e30, #0a1622);
    border: 1px solid rgba(245,166,35,.14);
    transform: translateY(0); transition: transform .5s ease .2s; z-index: 1;
  }
  .mdn-env__letter::before {
    content: ''; position: absolute; left: 14%; right: 14%; top: 28%; height: 1px;
    background: rgba(245,166,35,.14);
    box-shadow: 0 10px 0 rgba(245,166,35,.10), 0 20px 0 rgba(245,166,35,.07), 0 30px 0 rgba(245,166,35,.04);
  }
  .mdn-env--open .mdn-env__letter { transform: translateY(-26%); }
  .mdn-env__hint { font-size: .62rem; letter-spacing: .3em; text-transform: uppercase; color: #f5a623; animation: mdnEnvPulse 2s ease-in-out infinite; }
  @keyframes mdnEnvPulse { 0%,100%{opacity:.4} 50%{opacity:1} }

  /* ── Dress Code ───────────────────────────────── */
  .mdn-dress-code { display: flex; gap: 1.5rem; align-items: flex-start; flex-wrap: wrap; }
  .mdn-dress-code__photo { width: clamp(120px,30%,200px); aspect-ratio: 3/4; object-fit: cover; flex-shrink: 0; }
  .mdn-dress-code__info { flex: 1; min-width: 180px; }
  .mdn-dress-code__row { margin-bottom: 1rem; }
  .mdn-dress-code__label { font-size: .55rem; font-weight: 700; letter-spacing: .25em; text-transform: uppercase; color: #f5a623; display: block; margin-bottom: .3rem; }
  .mdn-dress-code__value { font-size: .88rem; color: #c8dce8; line-height: 1.6; }
  .mdn-dress-code__swatches { display: flex; gap: .5rem; flex-wrap: wrap; margin-top: .4rem; }
  .mdn-dress-code__swatch { padding: .25rem .8rem; border: 1px solid #1a2e42; font-size: .75rem; color: #6a90b0; background: #122033; }
  .mdn-dress-code__note { font-size: .82rem; color: #6a90b0; line-height: 1.7; border-left: 2px solid #f5a623; padding-left: .75rem; margin-top: .75rem; }

  /* ── Accommodation ────────────────────────────── */
  .mdn-hotels { display: grid; grid-template-columns: repeat(auto-fill,minmax(200px,1fr)); gap: 1rem; }
  .mdn-hotel { background: #122033; border: 1px solid #1a2e42; padding: 1.25rem 1.2rem; position: relative; }
  .mdn-hotel::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: #f5a623; }
  .mdn-hotel__name { font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: .02em; color: #fff; margin-bottom: .4rem; }
  .mdn-hotel__dist { font-size: .72rem; font-weight: 700; letter-spacing: .08em; color: #f5a623; margin-bottom: .5rem; }
  .mdn-hotel__note { font-size: .8rem; color: #4a6880; line-height: 1.6; margin-bottom: .75rem; }
  .mdn-hotel__link { display: inline-block; font-size: .7rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #f5a623; text-decoration: none; border-bottom: 1px solid rgba(245,166,35,.3); transition: border-color .2s; }
  .mdn-hotel__link:hover { border-bottom-color: #f5a623; }

  /* ── Day Schedule ─────────────────────────────── */
  .mdn-schedule { position: relative; padding-left: 1.5rem; }
  .mdn-schedule::before { content: ''; position: absolute; left: .35rem; top: .5rem; bottom: .5rem; width: 1px; background: linear-gradient(to bottom, #f5a623, rgba(245,166,35,.1)); }
  .mdn-schedule__item { position: relative; display: flex; gap: 1rem; align-items: baseline; margin-bottom: 1.4rem; }
  .mdn-schedule__item:last-child { margin-bottom: 0; }
  .mdn-schedule__item::before { content: ''; position: absolute; left: -1.15rem; top: .42rem; width: 7px; height: 7px; background: #f5a623; }
  .mdn-schedule__time { font-size: .7rem; font-weight: 800; letter-spacing: .12em; color: #f5a623; white-space: nowrap; min-width: 60px; text-transform: uppercase; }
  .mdn-schedule__label { font-size: .88rem; color: #c8dce8; line-height: 1.5; }
`

function EnvelopeIntro({ opening, onOpen }) {
  return (
    <div className={`mdn-env-overlay${opening ? ' mdn-env-overlay--opening' : ''}`} onClick={onOpen} role="button" aria-label="Open invitation">
      <div className="mdn-env-overlay__deco" aria-hidden="true">
        <span>■</span><span>■</span><span>■</span><span>■</span><span>■</span>
      </div>
      <p className="mdn-env-title">Invitation</p>
      <div className={`mdn-env${opening ? ' mdn-env--open' : ''}`}>
        <div className="mdn-env__body"><div className="mdn-env__seal">◆</div></div>
        <div className="mdn-env__flap" />
        <div className="mdn-env__letter" />
      </div>
      {!opening && <p className="mdn-env__hint">Tap to open</p>}
    </div>
  )
}

const DEFAULT_MENU_OPTIONS = ['Meat', 'Fish', 'Vegetarian']

function RsvpForm({ invitationRef, menuOptions }) {
  const { t } = useTranslation()
  const menuChoices = (menuOptions && menuOptions.length > 0) ? menuOptions : DEFAULT_MENU_OPTIONS
  const [guestName, setGuestName] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [attending, setAttending] = useState(null)
  const [menu, setMenu] = useState(null)
  const [plusOne, setPlusOne] = useState(null)
  const [children, setChildren] = useState(null)
  const [childCount, setChildCount] = useState(1)
  const [transport, setTransport] = useState(null)
  const [allergies, setAllergies] = useState(null)
  const [allergyDetails, setAllergyDetails] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
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
      setSubmitError(t('rsvp_common.submit_error'))
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
        <button
          className="mdn-btn-secondary"
          type="button"
          onClick={() => setSubmitted(false)}
          style={{ marginTop: '1.1rem', maxWidth: '220px' }}
        >
          {t('rsvp_common.update_response')}
        </button>
      </div>
    )
  }

  return (
    <div className="mdn-form">
      <div className={`mdn-field${errors.guestName ? ' mdn-field--error' : ''}`}>
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
      <div className={`mdn-field${errors.attending ? ' mdn-field--error' : ''}`}>
        <label className="mdn-label">Will you attend?</label>
        <div className="mdn-toggle-row">
          <button className={`mdn-toggle-btn${attending === 'yes' ? ' active' : ''}`} onClick={() => setAttending('yes')}>Yes, I'm in</button>
          <button className={`mdn-toggle-btn${attending === 'no' ? ' active' : ''}`} onClick={() => setAttending('no')}>Can't make it</button>
        </div>
      </div>

      {attending === 'yes' && (
        <>
          <div className={`mdn-field${errors.partnerName ? ' mdn-field--error' : ''}`}>
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
          <div className={`mdn-field${errors.menu ? ' mdn-field--error' : ''}`}>
            <label className="mdn-label">Menu preference</label>
            <div className="mdn-menu-row">
              {menuChoices.map(m => (
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
          <div className="mdn-field">
            <label className="mdn-label">Any food allergies?</label>
            <div className="mdn-toggle-row">
              <button className={`mdn-toggle-btn${allergies === 'yes' ? ' active' : ''}`} onClick={() => setAllergies('yes')}>Yes</button>
              <button className={`mdn-toggle-btn${allergies === 'no' ? ' active' : ''}`} onClick={() => setAllergies('no')}>No</button>
            </div>
            {allergies === 'yes' && (
              <input
                className="mdn-number-input"
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

      {Object.keys(errors).length > 0 && (
        <div className="mdn-rsvp-errors">
          <p>Please fill in the following:</p>
          <ul>
            {Object.values(errors).map((msg, i) => <li key={i}>{msg}</li>)}
          </ul>
        </div>
      )}
      {submitError && (
        <div className="mdn-rsvp-errors" role="alert" style={{ marginTop: '.6rem' }}>
          <p>{submitError}</p>
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
  const searchParams = new URLSearchParams(window.location.search)
  const isPreview = searchParams.get('preview') === 'true'
  const isEmbeddedPreview = searchParams.get('embed') === 'true'
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

  if (!inv) return <div className="mdn-page" style={{minHeight:'100svh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading…</div>

  const year = inv.eventDate ? new Date(inv.eventDate).getUTCFullYear() : ''
  const isDraft = inv.status === 'DRAFT'
  const findSection = (type) => (inv.sections || []).find(s => s.type === type) || null
  const dressCode = findSection('DRESS_CODE')
  const accommodation = findSection('ACCOMMODATION')
  const daySchedule = findSection('DAY_SCHEDULE')
  const isPastEvent = inv.eventDate && new Date(inv.eventDate) < new Date()
  const countdown = useCountdown(inv.eventDate)

  return (
    <div className="mdn-page">
      <style>{css}</style>
      {phase !== 'open' && <EnvelopeIntro opening={phase === 'opening'} onOpen={handleOpen} />}

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
          {countdown && (
            <div className="mdn-countdown">
              <div className="mdn-countdown__unit">
                <span className="mdn-countdown__num">{String(countdown.days).padStart(2,'0')}</span>
                <span className="mdn-countdown__label">Days</span>
              </div>
              <span className="mdn-countdown__sep">·</span>
              <div className="mdn-countdown__unit">
                <span className="mdn-countdown__num">{String(countdown.hours).padStart(2,'0')}</span>
                <span className="mdn-countdown__label">Hours</span>
              </div>
              <span className="mdn-countdown__sep">·</span>
              <div className="mdn-countdown__unit">
                <span className="mdn-countdown__num">{String(countdown.minutes).padStart(2,'0')}</span>
                <span className="mdn-countdown__label">Min</span>
              </div>
              <span className="mdn-countdown__sep">·</span>
              <div className="mdn-countdown__unit">
                <span className="mdn-countdown__num">{String(countdown.seconds).padStart(2,'0')}</span>
                <span className="mdn-countdown__label">Sec</span>
              </div>
            </div>
          )}
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
          {dressCode && <a href="#dress-code" className="mdn-nav__link">Dress Code</a>}
          {accommodation && <a href="#accommodation" className="mdn-nav__link">Stay</a>}
          {daySchedule && <a href="#day-schedule" className="mdn-nav__link">Timeline</a>}
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
                    {inv.ceremonyMapUrl && <a className="mdn-event__map-link" href={inv.ceremonyMapUrl} target="_blank" rel="noreferrer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>View on map</a>}
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
                    {inv.receptionMapUrl && <a className="mdn-event__map-link" href={inv.receptionMapUrl} target="_blank" rel="noreferrer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>View on map</a>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dress Code */}
        {dressCode && (
          <div className="mdn-section" id="dress-code">
            <div className="mdn-section-label">Dress Code</div>
            <div className="mdn-dress-code">
              {dressCode.dressCodeImageUrl && <img className="mdn-dress-code__photo" src={dressCode.dressCodeImageUrl} alt="Dress code"/>}
              <div className="mdn-dress-code__info">
                {dressCode.dressCodeFormality && (
                  <div className="mdn-dress-code__row">
                    <span className="mdn-dress-code__label">Formality</span>
                    <span className="mdn-dress-code__value">{dressCode.dressCodeFormality}</span>
                  </div>
                )}
                {dressCode.dressCodeColours && (
                  <div className="mdn-dress-code__row">
                    <span className="mdn-dress-code__label">Colour Palette</span>
                    <div className="mdn-dress-code__swatches">
                      {dressCode.dressCodeColours.split(',').map(c => <span key={c} className="mdn-dress-code__swatch">{c.trim()}</span>)}
                    </div>
                  </div>
                )}
                {dressCode.dressCodeNote && <p className="mdn-dress-code__note">{dressCode.dressCodeNote}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Accommodation */}
        {accommodation && accommodation.hotels && accommodation.hotels.length > 0 && (
          <div className="mdn-section" id="accommodation">
            <div className="mdn-section-label">Where to Stay</div>
            <div className="mdn-hotels">
              {accommodation.hotels.map((h, i) => (
                <div key={i} className="mdn-hotel">
                  <p className="mdn-hotel__name">{h.name}</p>
                  {h.distance && <p className="mdn-hotel__dist">{h.distance} from venue</p>}
                  {h.note && <p className="mdn-hotel__note">{h.note}</p>}
                  {h.bookingLink && <a className="mdn-hotel__link" href={h.bookingLink} target="_blank" rel="noreferrer">Book Now ↗</a>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Day Schedule */}
        {daySchedule && daySchedule.scheduleItems && daySchedule.scheduleItems.length > 0 && (
          <div className="mdn-section" id="day-schedule">
            <div className="mdn-section-label">Day Timeline</div>
            <div className="mdn-schedule">
              {daySchedule.scheduleItems.map((item, i) => (
                <div key={i} className="mdn-schedule__item">
                  <span className="mdn-schedule__time">{item.time}</span>
                  <span className="mdn-schedule__label">{item.label}</span>
                </div>
              ))}
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
          ) : isEmbeddedPreview ? (
            <div className="mdn-form" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div className="mdn-section-label" style={{ marginBottom: '1rem' }}>LIVE PREVIEW</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', marginBottom: '.75rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                RSVP <span style={{color: '#f5a623'}}>Preview</span>
              </h3>
              <p style={{ fontSize: '.84rem', color: '#6a90b0', lineHeight: '1.6' }}>
                Open full demo to interact with RSVP fields.
              </p>
            </div>
          ) : (
            <>
              <div className="mdn-rsvp__head">
                <div className="mdn-section-label" style={{ marginBottom: '1rem' }}>RSVP</div>
                <h2 className="mdn-rsvp__title">Your <span>Response</span></h2>
                {inv.rsvpDeadline && <p className="mdn-rsvp__sub">Deadline · {inv.rsvpDeadline}</p>}
              </div>
              <RsvpForm invitationRef={invitationRef || slug} menuOptions={inv.menuOptions} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
