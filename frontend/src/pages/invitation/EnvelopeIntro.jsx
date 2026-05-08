import { useState } from 'react'

const envelopeCss = `
  .ti-env{position:fixed;inset:0;z-index:50;display:grid;place-items:center;background:radial-gradient(circle at 50% 35%,var(--ti-surface) 0%,var(--ti-bg) 100%);transition:opacity .65s ease;animation:envFadeIn .4s ease-out}.ti-env--opening{opacity:0;pointer-events:none}@keyframes envFadeIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}.ti-env__stack{text-align:center;display:grid;gap:1.4rem}.ti-env__title{color:var(--ti-accent);font-size:1rem;letter-spacing:.18em;text-transform:uppercase;opacity:.9;font-weight:500;cursor:pointer}.ti-env__wrapper{position:relative;width:320px;height:220px;cursor:pointer;perspective:1200px}.ti-env__body{position:relative;width:100%;height:100%;background:linear-gradient(180deg,color-mix(in srgb,var(--ti-surface) 88%,var(--ti-accent)) 0%,color-mix(in srgb,var(--ti-surface) 82%,var(--ti-accent)) 100%);box-shadow:0 8px 32px rgba(0,0,0,.18);overflow:hidden}.ti-env__flap{position:absolute;top:0;left:0;width:100%;height:60%;background:linear-gradient(180deg,color-mix(in srgb,var(--ti-surface) 95%,var(--ti-accent)) 0%,color-mix(in srgb,var(--ti-surface) 88%,var(--ti-accent)) 100%);clip-path:polygon(0 0,100% 0,50% 85%);transform-origin:50% 0;transition:transform .7s cubic-bezier(.34,.05,.25,1) .4s;z-index:10;box-shadow:0 4px 16px rgba(0,0,0,.15)}.ti-env__flap::after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.12) 0%,transparent 50%);clip-path:polygon(0 0,100% 0,50% 85%)}.ti-env__letter{position:absolute;left:50%;top:100%;transform:translate(-50%,0);width:170px;height:180px;background:linear-gradient(180deg,#fffef9 0%,#faf8f0 100%);box-shadow:0 4px 16px rgba(0,0,0,.2);padding:18px 14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.45rem;font-family:'Playfair Display',Georgia,serif;font-size:14px;color:var(--ti-text);line-height:1.6;text-align:center;transition:all .85s cubic-bezier(.34,.05,.25,1);z-index:5;border:1px solid rgba(0,0,0,.08)}.ti-env__letter-date{font-family:'Inter',system-ui,sans-serif;font-size:9px;letter-spacing:.14em;text-transform:uppercase;opacity:.62;line-height:1.4}.ti-env__heart{position:absolute;top:52%;left:50%;width:18px;height:18px;background:var(--ti-accent);z-index:15;transform:translate(-50%,-50%) rotate(-45deg);opacity:1;transition:transform .6s cubic-bezier(.34,.05,.25,1) .3s,opacity .35s ease-in-out .7s;box-shadow:0 3px 10px rgba(0,0,0,.25);cursor:pointer;user-select:none}.ti-env__heart::before,.ti-env__heart::after{content:"";position:absolute;width:18px;height:18px;background:var(--ti-accent);border-radius:50%}.ti-env__heart::before{top:-9px;left:0}.ti-env__heart::after{top:0;right:-9px}.ti-env--open .ti-env__flap{transform:rotateX(175deg);z-index:1}.ti-env--open .ti-env__letter{top:10%;transform:translate(-50%,0) scale(1.35);transition-delay:.5s}.ti-env--open .ti-env__heart{transform:translate(-50%,-320%);opacity:0}.ti-env--elegant .ti-env__flap{transition-duration:1.2s;transition-delay:.6s}.ti-env--elegant .ti-env__letter{transition-duration:1.4s}.ti-env--elegant .ti-env__heart{transition-duration:.8s;transition-delay:1s}.ti-env--elegant.ti-env--opening{transition-duration:1s}.ti-env--minimal{animation:envFadeIn .5s ease-out}.ti-env--minimal.ti-env--opening{transition-duration:.4s}.ti-env__simple{padding:2rem;background:var(--ti-surface);border:2px solid var(--ti-border,rgba(0,0,0,.12));border-radius:24px;cursor:pointer;transition:all .3s ease;box-shadow:0 12px 36px rgba(0,0,0,.1)}.ti-env__simple:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,.15)}.ti-env__simple-icon{font-size:4rem;margin-bottom:1rem;line-height:1}.ti-env__simple-text{font-family:'Playfair Display',Georgia,serif;font-size:1.25rem;color:var(--ti-text)}
  @media(max-width:700px){.ti-env__stack{gap:1rem}.ti-env__title{font-size:.85rem;letter-spacing:.14em}.ti-env__wrapper{width:260px;height:180px}.ti-env__letter{width:140px;height:150px;font-size:12px;padding:14px 10px}.ti-env__heart{width:15px;height:15px}.ti-env__heart::before,.ti-env__heart::after{width:15px;height:15px}.ti-env__heart::before{top:-7.5px}.ti-env__heart::after{right:-7.5px}}
  @media(prefers-reduced-motion:reduce){@keyframes envFadeIn{from{opacity:0}to{opacity:1}}.ti-env{animation-duration:.2s}.ti-env__flap,.ti-env__letter,.ti-env__heart{transition-duration:.25s}.ti-env--open .ti-env__heart{transform:translate(-50%,-320%);opacity:0}}
`

export function useEnvelopePhase(envelopeType = 'classic') {
  const skip = envelopeType === 'none'
  const [phase, setPhase] = useState(skip ? 'open' : 'closed')

  const handleOpen = () => {
    if (phase !== 'closed') return
    setPhase('opening')
    const timings = {
      classic: { fadeout: 1600, open: 2200 },
      elegant: { fadeout: 2400, open: 3200 },
      minimal: { fadeout: 400, open: 800 },
    }
    const t = timings[envelopeType] || timings.classic
    window.setTimeout(() => setPhase('fadeout'), t.fadeout)
    window.setTimeout(() => setPhase('open'), t.open)
  }

  return { phase, handleOpen }
}

export default function EnvelopeIntro({ phase, onOpen, envelopeType = 'classic', cssVars = {}, letterText = "You're Invited", dateText = '' }) {
  const isOpening = phase === 'opening' || phase === 'fadeout'
  const isFadingOut = phase === 'fadeout'

  const defaultVars = {
    '--ti-surface': '#ffffff',
    '--ti-bg': '#fef7fc',
    '--ti-accent': '#f97baa',
    '--ti-text': '#1a0d2e',
    ...cssVars,
  }

  if (envelopeType === 'minimal') {
    return (
      <div
        className={`ti-env ti-env--minimal${isFadingOut ? ' ti-env--opening' : ''}`}
        role="button"
        aria-label="Open invitation"
        onClick={onOpen}
        style={defaultVars}
      >
        <style>{envelopeCss}</style>
        <div className="ti-env__stack">
          <div className="ti-env__title">Open your invitation</div>
          <div className="ti-env__simple">
            <div className="ti-env__simple-icon">✉️</div>
            <div className="ti-env__simple-text">You're Invited</div>
          </div>
        </div>
      </div>
    )
  }

  const envClass = `ti-env ti-env--${envelopeType}${isFadingOut ? ' ti-env--opening' : ''}`

  return (
    <div className={envClass} role="button" aria-label="Open invitation" style={defaultVars}>
      <style>{envelopeCss}</style>
      <div className="ti-env__stack">
        <div className="ti-env__title" onClick={onOpen}>Open your invitation</div>
        <div className={`ti-env__wrapper${isOpening ? ' ti-env--open' : ''}`} onClick={onOpen}>
          <div className="ti-env__body">
            <div className="ti-env__letter">
              <div>{letterText}</div>
              {dateText && <div className="ti-env__letter-date">{dateText}</div>}
            </div>
            <div className="ti-env__flap" />
          </div>
          <div className="ti-env__heart" />
        </div>
      </div>
    </div>
  )
}
