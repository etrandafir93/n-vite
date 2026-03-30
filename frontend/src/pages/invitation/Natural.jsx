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
  .nat-page * { box-sizing: border-box; margin: 0; padding: 0; }
  .nat-page { font-family: 'Inter', system-ui, sans-serif; color: #2e2a24; background: #faf7f2; scroll-behavior: smooth; }

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

  /* Countdown */
  .nat-countdown { display: flex; gap: 1.5rem; justify-content: center; margin-top: 1.75rem; }
  .nat-countdown__unit { text-align: center; }
  .nat-countdown__num { display: block; font-family: 'Playfair Display', Georgia, serif; font-size: 2.2rem; color: #fff; line-height: 1; font-weight: 400; }
  .nat-countdown__label { display: block; font-size: 0.55rem; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(168,197,171,0.65); margin-top: 0.3rem; }
  .nat-countdown__sep { font-size: 1.4rem; color: rgba(168,197,171,0.4); align-self: center; padding-bottom: 0.6rem; }
  @media(max-width:600px){ .nat-countdown { gap: 1rem; } .nat-countdown__num { font-size: 1.7rem; } }

  /* Navigation */
  .nat-nav {
    position: sticky; top: 0; z-index: 100; background: rgba(250,247,242,0.95);
    backdrop-filter: blur(8px); border-bottom: 1px solid #e8e0d4;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .nat-nav__inner {
    max-width: 740px; margin: 0 auto; padding: 0 1.25rem;
    display: flex; justify-content: center; gap: 2rem;
  }
  .nat-nav__link {
    font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: #8a7d6e; padding: 1rem 0; text-decoration: none;
    transition: color 0.2s; border-bottom: 2px solid transparent;
  }
  .nat-nav__link:hover { color: #7a9e7e; border-bottom-color: #7a9e7e; }
  @media(max-width:600px){
    .nat-nav__inner { gap: 1rem; }
    .nat-nav__link { font-size: 0.6rem; padding: 0.85rem 0; }
  }

  /* Layout */
  .nat-wrap { max-width: 740px; margin: 0 auto; padding: 0 clamp(1rem, 5vw, 1.5rem); }
  .nat-section { padding: clamp(2.5rem, 6vw, 3.5rem) 0; border-bottom: 1px solid #e8e0d4; }
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
  .nat-event:only-child { grid-column: 1 / -1; max-width: 500px; margin: 0 auto; }
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
  .nat-event__map-link {
    display: inline-flex; align-items: center; gap: 0.45rem; margin-top: 1.1rem;
    padding: 0.42rem 1.1rem; border: 1px solid #7a9e7e; border-radius: 50px;
    font-size: 0.72rem; letter-spacing: 0.06em;
    color: #7a9e7e; text-decoration: none; transition: background 0.2s, color 0.2s;
  }
  .nat-event__map-link:hover { background: #7a9e7e; color: #fff; }

  /* RSVP */
  .nat-rsvp { padding: clamp(2.5rem, 8vw, 5rem) 0 clamp(3rem, 10vw, 5rem); }
  .nat-rsvp__head { text-align: center; margin-bottom: 2.5rem; }
  .nat-rsvp__leaves { font-size: 1.2rem; color: #7a9e7e; opacity: 0.45; margin-bottom: 0.8rem; letter-spacing: 0.6rem; }
  .nat-rsvp__title {
    font-family: 'Playfair Display', serif; font-size: clamp(1.8rem,4vw,2.6rem);
    font-weight: 400; color: #2e2a24; margin-bottom: 0.4rem;
  }
  .nat-rsvp__sub { font-size: 0.82rem; color: #a09080; }

  /* Form */
  .nat-form {
    background: rgba(255,255,255,0.6); border-radius: 20px; border: 1px solid rgba(122,158,126,0.08);
    padding: clamp(1.5rem,4vw,2.5rem); box-shadow: 0 2px 12px rgba(122,158,126,0.05);
  }
  .nat-field { margin-bottom: 1.8rem; }
  .nat-label {
    display: block; font-size: 0.75rem; font-weight: 400; letter-spacing: 0.02em;
    color: #8a7d6e; margin-bottom: 0.75rem;
  }
  .nat-toggle-row { display: flex; gap: 0.6rem; flex-wrap: wrap; }
  .nat-toggle-btn {
    flex: 1; min-width: 120px; padding: 0.75rem 1rem; border-radius: 10px;
    border: 1px solid rgba(122,158,126,0.15); background: rgba(255,255,255,0.4); color: #6a7d6e;
    font-size: 0.85rem; cursor: pointer; font-family: 'Inter', sans-serif;
    font-weight: 400; transition: all 0.18s; text-align: center;
  }
  .nat-toggle-btn.active {
    background: rgba(122,158,126,0.12); color: #5a7d5e; border-color: rgba(122,158,126,0.4);
  }
  .nat-menu-row { display: flex; gap: 0.6rem; flex-wrap: wrap; }
  .nat-menu-btn {
    padding: 0.65rem 1.3rem; border-radius: 10px; border: 1px solid rgba(122,158,126,0.15);
    background: rgba(255,255,255,0.4); color: #6a7d6e; font-size: 0.85rem; cursor: pointer;
    font-family: 'Inter', sans-serif; font-weight: 400; transition: all 0.18s;
  }
  .nat-menu-btn.active { background: rgba(122,158,126,0.12); color: #5a7d5e; border-color: rgba(122,158,126,0.4); }
  .nat-children-row { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .nat-child-label { font-size: 0.72rem; color: #a09080; font-weight: 400; }
  .nat-number-input {
    width: 75px; padding: 0.5rem 0.6rem; border: 1px solid rgba(122,158,126,0.15); border-radius: 8px;
    font-size: 0.9rem; font-family: 'Inter', sans-serif; outline: none; color: #2e2a24; background: rgba(255,255,255,0.4);
  }
  .nat-textarea {
    width: 100%; padding: 0.9rem; border: 1px solid rgba(122,158,126,0.15); border-radius: 12px;
    font-size: 0.88rem; font-family: 'Inter', sans-serif; resize: vertical; min-height: 100px;
    outline: none; color: #2e2a24; line-height: 1.6; background: rgba(255,255,255,0.4);
  }
  .nat-cta-row { display: flex; gap: 0.75rem; margin-top: 2rem; flex-wrap: wrap; }
  .nat-rsvp-errors {
    background: #fff5f5; border: 1.5px solid #f0c0c0; border-radius: 8px;
    padding: .85rem 1.1rem; margin-bottom: 1.2rem; font-size: .82rem; color: #a03030;
  }
  .nat-rsvp-errors p { font-weight: 600; margin: 0 0 .35rem; }
  .nat-rsvp-errors ul { margin: 0; padding-left: 1.1rem; }
  .nat-rsvp-errors li + li { margin-top: .15rem; }
  .nat-field--error > .nat-label { color: #a03030; }
  .nat-field--error .nat-input { border-color: #e5a0a0 !important; background: #fff8f8 !important; }
  .nat-field--error .nat-toggle-row, .nat-field--error .nat-menu-row { border-radius: 8px; outline: 1.5px solid #a03030; }
  .nat-btn-primary {
    flex: 1; min-width: 150px; padding: 0.95rem 2rem; border-radius: 12px;
    background: rgba(122,158,126,0.85); color: #fff; border: none;
    font-size: 0.85rem; font-weight: 500; letter-spacing: 0.02em;
    cursor: pointer; font-family: 'Inter', sans-serif;
    box-shadow: 0 2px 8px rgba(122,158,126,0.2); transition: all 0.18s;
  }
  .nat-btn-primary:hover { background: rgba(122,158,126,1); box-shadow: 0 4px 12px rgba(122,158,126,0.3); }
  .nat-btn-secondary {
    flex: 1; min-width: 150px; padding: 0.95rem 2rem; border-radius: 12px;
    background: rgba(255,255,255,0.5); color: #6a7d6e; border: 1px solid rgba(122,158,126,0.15);
    font-size: 0.85rem; font-weight: 500; letter-spacing: 0.02em;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.18s;
  }
  .nat-btn-secondary:hover { border-color: rgba(122,158,126,0.4); color: #5a7d5e; }

  /* ── Envelope Intro ──────────────────────────── */
  .nat-env-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: radial-gradient(ellipse at 50% 40%, #faf7f0 0%, #e8e0d0 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem;
    cursor: pointer; transition: opacity 0.7s ease 0.4s;
  }
  .nat-env-overlay--opening { opacity: 0; pointer-events: none; }
  .nat-env-overlay__deco { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
  .nat-env-overlay__deco span {
    position: absolute; opacity: 0; color: #7a9e7e;
    animation: natEnvFloat 8s ease-in-out infinite;
  }
  .nat-env-overlay__deco span:nth-child(1) { left: 9%; top: 20%; font-size: 1.1rem; animation-delay: 0s; }
  .nat-env-overlay__deco span:nth-child(2) { left: 83%; top: 14%; font-size: .85rem; animation-delay: 1.9s; }
  .nat-env-overlay__deco span:nth-child(3) { left: 71%; top: 70%; font-size: .95rem; animation-delay: 3.1s; }
  .nat-env-overlay__deco span:nth-child(4) { left: 19%; top: 75%; font-size: .7rem; animation-delay: 1.3s; }
  .nat-env-overlay__deco span:nth-child(5) { left: 46%; top: 8%; font-size: .7rem; animation-delay: 4.1s; }
  .nat-env-overlay__deco span:nth-child(6) { left: 4%; top: 51%; font-size: .65rem; animation-delay: 2.3s; }
  @keyframes natEnvFloat { 0%,100%{opacity:0;transform:translateY(6px) rotate(-12deg)} 40%,60%{opacity:.45} 50%{transform:translateY(-9px) rotate(12deg)} }
  .nat-env-title {
    font-family: 'Playfair Display','Georgia',serif;
    font-size: clamp(.85rem,3vw,1.05rem);
    color: #5a7d5e; font-weight: 400; font-style: italic;
    letter-spacing: .04em;
  }
  .nat-env { position: relative; width: clamp(260px,72vw,380px); height: clamp(172px,50vw,258px); filter: drop-shadow(0 14px 42px rgba(70,90,50,.12)) drop-shadow(0 2px 8px rgba(0,0,0,.06)); }
  .nat-env__body {
    position: absolute; inset: 0;
    background: linear-gradient(160deg, #fefaf3 0%, #f5edd8 100%);
    border: 1px solid #c8bda6;
    display: flex; align-items: center; justify-content: center;
  }
  .nat-env__body::before {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; top: 40%;
    background:
      linear-gradient(to bottom right, transparent 49%, #e6dcca 50%) left / 50.5% 100% no-repeat,
      linear-gradient(to bottom left,  transparent 49%, #e0d4bc 50%) right / 50.5% 100% no-repeat;
  }
  .nat-env__body::after {
    content: ''; position: absolute; inset: 7px; border: 1px dashed rgba(122,158,126,.3); pointer-events: none;
  }
  .nat-env__seal {
    position: relative; z-index: 2; width: 52px; height: 52px; border-radius: 50%;
    background: radial-gradient(circle at 34% 34%, #8fb892, #4a7a50);
    display: flex; align-items: center; justify-content: center;
    color: #f0f8f1; font-size: 1.15rem;
    box-shadow: 0 3px 14px rgba(55,100,60,.4), inset 0 1px 2px rgba(200,240,200,.3);
  }
  .nat-env__seal::before { content: ''; position: absolute; inset: 4px; border-radius: 50%; border: 1px solid rgba(200,240,200,.38); }
  .nat-env__flap {
    position: absolute; top: -1px; left: -1px; right: -1px; height: 55%;
    background: linear-gradient(175deg, #ede5d0, #e4d9c0);
    border: 1px solid #c8bda6;
    clip-path: polygon(0 0,100% 0,50% 80%);
    transform-origin: top; transform: perspective(800px) rotateX(0deg);
    transition: transform .65s cubic-bezier(.4,0,.2,1); z-index: 10;
  }
  .nat-env--open .nat-env__flap { transform: perspective(800px) rotateX(-172deg); }
  .nat-env__letter {
    position: absolute; bottom: 8%; left: 14%; right: 14%; height: 70%;
    background: linear-gradient(to bottom, #fefcf7, #faf5ea);
    border: 1px solid #dad0bc;
    transform: translateY(0); transition: transform .5s ease .2s; z-index: 1;
  }
  .nat-env__letter::before {
    content: ''; position: absolute; left: 14%; right: 14%; top: 28%; height: 1px;
    background: rgba(122,158,126,.18);
    box-shadow: 0 10px 0 rgba(122,158,126,.13), 0 20px 0 rgba(122,158,126,.10), 0 30px 0 rgba(122,158,126,.07);
  }
  .nat-env--open .nat-env__letter { transform: translateY(-26%); }
  .nat-env__hint { font-size: .62rem; letter-spacing: .3em; text-transform: uppercase; color: #7a9e7e; animation: natEnvPulse 2s ease-in-out infinite; }
  @keyframes natEnvPulse { 0%,100%{opacity:.4} 50%{opacity:1} }

  /* ── Dress Code ───────────────────────────────── */
  .nat-dress-code { display: flex; gap: 1.5rem; align-items: flex-start; flex-wrap: wrap; }
  .nat-dress-code__photo { width: clamp(120px,30%,200px); aspect-ratio: 3/4; object-fit: cover; flex-shrink: 0; border-radius: 12px; }
  .nat-dress-code__info { flex: 1; min-width: 180px; }
  .nat-dress-code__row { margin-bottom: 1rem; }
  .nat-dress-code__label { font-size: .55rem; font-weight: 600; letter-spacing: .22em; text-transform: uppercase; color: #7a9e7e; display: block; margin-bottom: .3rem; }
  .nat-dress-code__value { font-size: .88rem; color: #2e2a24; line-height: 1.6; }
  .nat-dress-code__swatches { display: flex; gap: .5rem; flex-wrap: wrap; margin-top: .4rem; }
  .nat-dress-code__swatch { padding: .25rem .8rem; border: 1px solid #e8e0d4; font-size: .75rem; color: #5a7d5e; background: #f0ebe2; border-radius: 20px; }
  .nat-dress-code__note { font-size: .82rem; color: #8a7d6e; line-height: 1.7; font-style: italic; border-left: 2px solid #7a9e7e; padding-left: .75rem; margin-top: .75rem; }

  /* ── Accommodation ────────────────────────────── */
  .nat-hotels { display: grid; grid-template-columns: repeat(auto-fill,minmax(200px,1fr)); gap: 1rem; }
  .nat-hotel { background: #fff; border: 1px solid #e8e0d4; padding: 1.25rem 1.2rem; border-radius: 14px; box-shadow: 0 2px 12px rgba(122,158,126,.06); }
  .nat-hotel__name { font-family: 'Playfair Display',serif; font-size: 1rem; color: #2e2a24; margin-bottom: .4rem; }
  .nat-hotel__dist { font-size: .72rem; color: #7a9e7e; font-weight: 600; margin-bottom: .5rem; }
  .nat-hotel__note { font-size: .8rem; color: #8a7d6e; line-height: 1.6; margin-bottom: .75rem; }
  .nat-hotel__link { display: inline-block; font-size: .7rem; color: #7a9e7e; text-decoration: none; border-bottom: 1px solid rgba(122,158,126,.3); transition: border-color .2s; }
  .nat-hotel__link:hover { border-bottom-color: #7a9e7e; }

  /* ── Day Schedule ─────────────────────────────── */
  .nat-schedule { position: relative; padding-left: 1.5rem; }
  .nat-schedule::before { content: ''; position: absolute; left: .35rem; top: .5rem; bottom: .5rem; width: 1px; background: linear-gradient(to bottom, #7a9e7e, rgba(122,158,126,.15)); }
  .nat-schedule__item { position: relative; display: flex; gap: 1rem; align-items: baseline; margin-bottom: 1.4rem; }
  .nat-schedule__item:last-child { margin-bottom: 0; }
  .nat-schedule__item::before { content: ''; position: absolute; left: -1.15rem; top: .42rem; width: 7px; height: 7px; border-radius: 50%; background: #7a9e7e; }
  .nat-schedule__time { font-size: .7rem; font-weight: 600; letter-spacing: .08em; color: #7a9e7e; white-space: nowrap; min-width: 60px; }
  .nat-schedule__label { font-size: .88rem; color: #2e2a24; line-height: 1.5; }
`

function EnvelopeIntro({ opening, onOpen }) {
  return (
    <div className={`nat-env-overlay${opening ? ' nat-env-overlay--opening' : ''}`} onClick={onOpen} role="button" aria-label="Open invitation">
      <div className="nat-env-overlay__deco" aria-hidden="true">
        <span>✿</span><span>❧</span><span>✿</span><span>❧</span><span>✿</span><span>❧</span>
      </div>
      <p className="nat-env-title">A note for you</p>
      <div className={`nat-env${opening ? ' nat-env--open' : ''}`}>
        <div className="nat-env__body"><div className="nat-env__seal">✦</div></div>
        <div className="nat-env__flap" />
        <div className="nat-env__letter" />
      </div>
      {!opening && <p className="nat-env__hint">Tap to open</p>}
    </div>
  )
}

const DEFAULT_MENU_OPTIONS = ['Meat', 'Fish', 'Vegetarian']

function RsvpForm({ invitationRef, menuOptions }) {
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
      setSubmitError('We could not save your response right now. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="nat-form" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <h3 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#2d5016', marginBottom: '1rem' }}>
          Thank You!
        </h3>
        <p style={{ fontSize: '.9rem', color: '#5a7a3c', lineHeight: '1.6' }}>
          Your response has been received. We look forward to seeing you!
        </p>
        <button
          className="nat-btn-secondary"
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
    <div className="nat-form">
      <div className={`nat-field${errors.guestName ? ' nat-field--error' : ''}`}>
        <label className="nat-label">Your Name *</label>
        <input
          className="nat-number-input"
          type="text"
          placeholder="Enter your full name"
          value={guestName}
          onChange={e => setGuestName(e.target.value)}
          style={{ width: '100%', fontSize: '.88rem', padding: '.8rem' }}
        />
      </div>
      <div className={`nat-field${errors.attending ? ' nat-field--error' : ''}`}>
        <label className="nat-label">Will you attend?</label>
        <div className="nat-toggle-row">
          <button className={`nat-toggle-btn${attending === 'yes' ? ' active' : ''}`} onClick={() => setAttending('yes')}>Yes, I'll be there</button>
          <button className={`nat-toggle-btn${attending === 'no' ? ' active' : ''}`} onClick={() => setAttending('no')}>Unable to attend</button>
        </div>
      </div>

      {attending === 'yes' && (
        <>
          <div className={`nat-field${errors.partnerName ? ' nat-field--error' : ''}`}>
            <label className="nat-label">Bringing a +1?</label>
            <div className="nat-toggle-row">
              <button className={`nat-toggle-btn${plusOne === 'yes' ? ' active' : ''}`} onClick={() => setPlusOne('yes')}>Yes</button>
              <button className={`nat-toggle-btn${plusOne === 'no' ? ' active' : ''}`} onClick={() => setPlusOne('no')}>No</button>
            </div>
            {plusOne === 'yes' && (
              <input
                className="nat-number-input"
                type="text"
                placeholder="Partner's name"
                value={partnerName}
                onChange={e => setPartnerName(e.target.value)}
                style={{ width: '100%', fontSize: '.88rem', padding: '.8rem', marginTop: '.75rem' }}
              />
            )}
          </div>
          <div className={`nat-field${errors.menu ? ' nat-field--error' : ''}`}>
            <label className="nat-label">Menu preference</label>
            <div className="nat-menu-row">
              {menuChoices.map(m => (
                <button key={m} className={`nat-menu-btn${menu === m ? ' active' : ''}`} onClick={() => setMenu(m)}>{m}</button>
              ))}
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
            <label className="nat-label">Do you have any food allergies?</label>
            <div className="nat-toggle-row">
              <button className={`nat-toggle-btn${allergies === 'yes' ? ' active' : ''}`} onClick={() => setAllergies('yes')}>Yes</button>
              <button className={`nat-toggle-btn${allergies === 'no' ? ' active' : ''}`} onClick={() => setAllergies('no')}>No</button>
            </div>
            {allergies === 'yes' && (
              <input
                className="nat-number-input"
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
        <div className="nat-field">
          <label className="nat-label">Message (Optional)</label>
          <textarea className="nat-textarea" placeholder="Let the couple know why you can't attend..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
      )}

      {attending === 'yes' && (
        <div className="nat-field">
          <label className="nat-label">Questions or comments (Optional)</label>
          <textarea className="nat-textarea" placeholder="Dietary needs, special requests, or a note for the couple..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="nat-rsvp-errors">
          <p>Please fill in the following:</p>
          <ul>
            {Object.values(errors).map((msg, i) => <li key={i}>{msg}</li>)}
          </ul>
        </div>
      )}
      {submitError && (
        <div className="nat-rsvp-errors" role="alert" style={{ marginTop: '.6rem' }}>
          <p>{submitError}</p>
        </div>
      )}

      {attending && (
        <div className="nat-cta-row">
          {attending === 'yes' && (
            <button
              className="nat-btn-primary"
              onClick={() => handleSubmit('ACCEPTED')}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Accept Invitation'}
            </button>
          )}
          {attending === 'no' && (
            <button
              className="nat-btn-secondary"
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

export default function NaturalInvitation({ invitationRef, invitationData }) {
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

  if (!inv) return <div className="nat-page" style={{minHeight:'100svh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading…</div>

  const isDraft = inv.status === 'DRAFT'
  const isPastEvent = inv.eventDate && new Date(inv.eventDate) < new Date()
  const countdown = useCountdown(inv.eventDate)
  const findSection = (type) => (inv.sections || []).find(s => s.type === type) || null
  const dressCode = findSection('DRESS_CODE')
  const accommodation = findSection('ACCOMMODATION')
  const daySchedule = findSection('DAY_SCHEDULE')

  return (
    <div className="nat-page">
      <style>{css}</style>
      {phase !== 'open' && <EnvelopeIntro opening={phase === 'opening'} onOpen={handleOpen} />}

      {/* Hero */}
      <section className="nat-hero">
        <div className="nat-hero__photo" style={{backgroundImage:`url('${inv.backgroundImageUrl}')`}} />
        <div className="nat-hero__overlay" />
        <div className="nat-hero__content">
          <span className="nat-hero__leaf">···</span>
          <span className="nat-hero__label">Together with their families</span>
          <h1 className="nat-hero__names">
            {inv.groomName}
            <span className="nat-hero__amp">✦</span>
            {inv.brideName}
          </h1>
          <p className="nat-hero__date">{fmtDate(inv.eventDate)}</p>
          {countdown && (
            <div className="nat-countdown">
              <div className="nat-countdown__unit">
                <span className="nat-countdown__num">{String(countdown.days).padStart(2,'0')}</span>
                <span className="nat-countdown__label">Days</span>
              </div>
              <span className="nat-countdown__sep">·</span>
              <div className="nat-countdown__unit">
                <span className="nat-countdown__num">{String(countdown.hours).padStart(2,'0')}</span>
                <span className="nat-countdown__label">Hours</span>
              </div>
              <span className="nat-countdown__sep">·</span>
              <div className="nat-countdown__unit">
                <span className="nat-countdown__num">{String(countdown.minutes).padStart(2,'0')}</span>
                <span className="nat-countdown__label">Min</span>
              </div>
              <span className="nat-countdown__sep">·</span>
              <div className="nat-countdown__unit">
                <span className="nat-countdown__num">{String(countdown.seconds).padStart(2,'0')}</span>
                <span className="nat-countdown__label">Sec</span>
              </div>
            </div>
          )}
          {(inv.ceremonyTime || inv.receptionTime) && (
            <div className="nat-hero__badge">
              {inv.ceremonyTime && <>Ceremony {inv.ceremonyTime}</>}
              {inv.ceremonyTime && inv.receptionTime && ' · '}
              {inv.receptionTime && <>Reception {inv.receptionTime}</>}
            </div>
          )}
        </div>
      </section>

      <nav className="nat-nav">
        <div className="nat-nav__inner">
          {(inv.groomParents || inv.brideParents || inv.godparents) && (
            <a href="#families" className="nat-nav__link">Families</a>
          )}
          {(inv.ceremonyVenue || inv.receptionVenue) && (
            <a href="#celebrations" className="nat-nav__link">Celebrations</a>
          )}
          {dressCode && <a href="#dress-code" className="nat-nav__link">Dress Code</a>}
          {accommodation && <a href="#accommodation" className="nat-nav__link">Stay</a>}
          {daySchedule && <a href="#schedule" className="nat-nav__link">Schedule</a>}
          <a href="#rsvp" className="nat-nav__link">RSVP</a>
        </div>
      </nav>

      {/* Families */}
      <div className="nat-wrap">
        {(inv.groomParents || inv.brideParents || inv.godparents) && (
          <div className="nat-section" id="families">
            <p className="nat-section__title">With the Blessings of</p>
            <div className="nat-families">
              {inv.groomParents && (
                <div className="nat-family-card">
                  <span className="nat-family-card__role">Parents of the Groom</span>
                  <p className="nat-family-card__name">{inv.groomParents}</p>
                </div>
              )}
              {inv.brideParents && (
                <div className="nat-family-card">
                  <span className="nat-family-card__role">Parents of the Bride</span>
                  <p className="nat-family-card__name">{inv.brideParents}</p>
                </div>
              )}
              {inv.godparents && (
                <div className="nat-family-card">
                  <span className="nat-family-card__role">Godparents</span>
                  <p className="nat-family-card__name">{inv.godparents}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Events */}
        {(inv.ceremonyVenue || inv.receptionVenue) && (
          <div className="nat-section" id="celebrations">
            <p className="nat-section__title">The Celebrations</p>
            <div className="nat-events">
              {inv.ceremonyVenue && (
                <div className="nat-event">
                  {inv.ceremonyPhotoUrl && <img className="nat-event__photo" src={inv.ceremonyPhotoUrl} alt={inv.ceremonyVenue} />}
                  <div className="nat-event__body">
                    <span className="nat-event__type">Ceremony</span>
                    <p className="nat-event__name">{inv.ceremonyVenue}</p>
                    {inv.ceremonyAddress && <p className="nat-event__detail">{inv.ceremonyAddress}<br />{fmtDate(inv.eventDate)}</p>}
                    {!inv.ceremonyAddress && <p className="nat-event__detail">{fmtDate(inv.eventDate)}</p>}
                    {inv.ceremonyTime && <span className="nat-event__time-pill">{inv.ceremonyTime}</span>}
                    {inv.ceremonyMapUrl && <a className="nat-event__map-link" href={inv.ceremonyMapUrl} target="_blank" rel="noreferrer"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>View on map</a>}
                  </div>
                </div>
              )}
              {inv.receptionVenue && (
                <div className="nat-event">
                  {inv.receptionPhotoUrl && <img className="nat-event__photo" src={inv.receptionPhotoUrl} alt={inv.receptionVenue} />}
                  <div className="nat-event__body">
                    <span className="nat-event__type">Reception &amp; Dinner</span>
                    <p className="nat-event__name">{inv.receptionVenue}</p>
                    {inv.receptionAddress && <p className="nat-event__detail">{inv.receptionAddress}<br />{fmtDate(inv.eventDate)}</p>}
                    {!inv.receptionAddress && <p className="nat-event__detail">{fmtDate(inv.eventDate)}</p>}
                    {inv.receptionTime && <span className="nat-event__time-pill">{inv.receptionTime}</span>}
                    {inv.receptionMapUrl && <a className="nat-event__map-link" href={inv.receptionMapUrl} target="_blank" rel="noreferrer"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>View on map</a>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dress Code */}
        {dressCode && (
          <div className="nat-section" id="dress-code">
            <p className="nat-section__title">Dress Code</p>
            <div className="nat-dress-code">
              {dressCode.dressCodeImageUrl && <img className="nat-dress-code__photo" src={dressCode.dressCodeImageUrl} alt="Dress code"/>}
              <div className="nat-dress-code__info">
                {dressCode.dressCodeFormality && (
                  <div className="nat-dress-code__row">
                    <span className="nat-dress-code__label">Formality</span>
                    <span className="nat-dress-code__value">{dressCode.dressCodeFormality}</span>
                  </div>
                )}
                {dressCode.dressCodeColours && (
                  <div className="nat-dress-code__row">
                    <span className="nat-dress-code__label">Colour Palette</span>
                    <div className="nat-dress-code__swatches">
                      {dressCode.dressCodeColours.split(',').map(c => <span key={c} className="nat-dress-code__swatch">{c.trim()}</span>)}
                    </div>
                  </div>
                )}
                {dressCode.dressCodeNote && <p className="nat-dress-code__note">{dressCode.dressCodeNote}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Accommodation */}
        {accommodation && accommodation.hotels && accommodation.hotels.length > 0 && (
          <div className="nat-section" id="accommodation">
            <p className="nat-section__title">Where to Stay</p>
            <div className="nat-hotels">
              {accommodation.hotels.map((h, i) => (
                <div key={i} className="nat-hotel">
                  <p className="nat-hotel__name">{h.name}</p>
                  {h.distance && <p className="nat-hotel__dist">{h.distance} from venue</p>}
                  {h.note && <p className="nat-hotel__note">{h.note}</p>}
                  {h.bookingLink && <a className="nat-hotel__link" href={h.bookingLink} target="_blank" rel="noreferrer">Book Now ↗</a>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Day Schedule */}
        {daySchedule && daySchedule.scheduleItems && daySchedule.scheduleItems.length > 0 && (
          <div className="nat-section" id="schedule">
            <p className="nat-section__title">Day Schedule</p>
            <div className="nat-schedule">
              {daySchedule.scheduleItems.map((item, i) => (
                <div key={i} className="nat-schedule__item">
                  <span className="nat-schedule__time">{item.time}</span>
                  <span className="nat-schedule__label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RSVP */}
      <div className="nat-rsvp" id="rsvp">
        <div className="nat-wrap">
          {isDraft ? (
            <div className="nat-form" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div className="nat-rsvp__leaves" style={{marginBottom: '1rem'}}>···</div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#2d5016', marginBottom: '1rem' }}>
                Coming Soon
              </h3>
              <p style={{ fontSize: '.9rem', color: '#5a6e4a', lineHeight: '1.6' }}>
                This invitation has not been published yet.
              </p>
            </div>
          ) : isPastEvent ? (
            <div className="nat-form" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div className="nat-rsvp__leaves" style={{marginBottom: '1rem'}}>···</div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#2d5016', marginBottom: '1rem' }}>
                Thank You
              </h3>
              <p style={{ fontSize: '.9rem', color: '#5a6e4a', lineHeight: '1.6', marginBottom: '1rem' }}>
                We hope you enjoyed celebrating with us!
              </p>
              <p style={{ fontSize: '.85rem', color: '#6d7d5d', lineHeight: '1.6' }}>
                Your presence made our special day even more memorable.
              </p>
            </div>
          ) : (
            <>
              <div className="nat-rsvp__head">
                <div className="nat-rsvp__leaves">···</div>
                <h2 className="nat-rsvp__title">Kindly Reply</h2>
                {inv.rsvpDeadline && <p className="nat-rsvp__sub">Please respond by {inv.rsvpDeadline}</p>}
              </div>
              <RsvpForm invitationRef={invitationRef || slug} menuOptions={inv.menuOptions} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
