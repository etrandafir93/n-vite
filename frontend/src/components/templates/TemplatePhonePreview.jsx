import { useEffect, useMemo, useRef, useState } from 'react'

const PREVIEW_SECTION_IDS = ['families', 'celebrations', 'schedule', 'dress-code', 'accommodation', 'day-schedule', 'rsvp']
const MAX_TOUR_MS = 5200

function injectNoScrollbarStyles(iframe) {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (!doc || doc.getElementById('nvite-preview-no-scrollbars')) return

    const style = doc.createElement('style')
    style.id = 'nvite-preview-no-scrollbars'
    style.textContent = `
      html, body, * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      *::-webkit-scrollbar,
      html::-webkit-scrollbar,
      body::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
        display: none !important;
      }
      html, body {
        overflow-x: hidden !important;
      }
    `
    doc.head?.appendChild(style)
  } catch (error) {
    // Ignore cross-document access issues in strict browser contexts.
  }
}

function injectResponsiveEmbedStyles(iframe) {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (!doc || doc.getElementById('nvite-preview-embed-scale')) return

    const frameWidth = iframe.clientWidth || 180
    const scale = frameWidth <= 140 ? 0.68 : frameWidth <= 170 ? 0.74 : 0.8

    const style = doc.createElement('style')
    style.id = 'nvite-preview-embed-scale'
    style.textContent = `
      html, body {
        min-width: 0 !important;
      }
      body {
        transform: scale(${scale});
        transform-origin: top left;
        width: calc(100% / ${scale}) !important;
      }
    `
    doc.head?.appendChild(style)
  } catch (error) {
    // Ignore iframe style injection issues.
  }
}

function buildStops(doc, scroller, maxScroll) {
  const fromSections = PREVIEW_SECTION_IDS
    .map((id) => {
      const section = doc.getElementById(id)
      if (!section) return null

      if (scroller === doc.scrollingElement || scroller === doc.documentElement || scroller === doc.body) {
        return section.offsetTop
      }

      const rootRect = scroller.getBoundingClientRect()
      const sectionRect = section.getBoundingClientRect()
      return scroller.scrollTop + (sectionRect.top - rootRect.top)
    })
    .filter((value) => value !== null)
    .map((value) => Math.min(maxScroll, Math.max(0, value)))

  const fallback = [0, Math.round(maxScroll * 0.2), Math.round(maxScroll * 0.4), Math.round(maxScroll * 0.62), Math.round(maxScroll * 0.82), maxScroll]
  const source = fromSections.length > 0 ? [0, ...fromSections] : fallback

  return source
    .filter((value, idx) => idx === 0 || Math.abs(value - source[idx - 1]) > 35)
    .slice(0, 9)
}

function detectScroller(doc, win) {
  const root = doc.scrollingElement || doc.documentElement || doc.body
  const candidates = [root]
  const withOwnScroll = Array.from(doc.querySelectorAll('*')).filter((element) => {
    const style = win?.getComputedStyle ? win.getComputedStyle(element) : null
    const overflowY = style?.overflowY || ''
    return (overflowY === 'auto' || overflowY === 'scroll') && element.scrollHeight - element.clientHeight > 80
  })
  candidates.push(...withOwnScroll)

  return candidates
    .filter(Boolean)
    .sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight))[0] || root
}

function runAutoTour(iframe, timerRef) {
  if (!iframe) return false
  try {
    const win = iframe.contentWindow
    const doc = iframe.contentDocument || win?.document
    if (!doc) return false

    injectNoScrollbarStyles(iframe)

    const scroller = detectScroller(doc, win)
    if (!scroller) return false

    const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight)
    if (maxScroll <= 80) return false

    const stops = buildStops(doc, scroller, maxScroll)
    const paceMs = Math.max(520, Math.floor(MAX_TOUR_MS / Math.max(1, stops.length - 1)))

    if (win?.scrollTo) {
      win.scrollTo({ top: 0, behavior: 'auto' })
    }
    scroller.scrollTop = 0

    const timers = []
    stops.forEach((top, idx) => {
      timers.push(window.setTimeout(() => {
        if (!iframe.isConnected) return
        if (win?.scrollTo && (scroller === doc.scrollingElement || scroller === doc.documentElement || scroller === doc.body)) {
          win.scrollTo({ top, behavior: 'auto' })
          return
        }
        scroller.scrollTo?.({ top, behavior: 'auto' }) ?? (scroller.scrollTop = top)
      }, idx * paceMs))
    })

    timerRef.current = timers
    return true
  } catch (error) {
    // Ignore preview auto-scroll errors and keep the live preview visible.
    return false
  }
}

function clearTour(timerRef) {
  timerRef.current.forEach((timer) => window.clearTimeout(timer))
  timerRef.current = []
}

const fallbackSteps = [
  { title: 'Welcome cover', subtitle: 'Names, date and venue in one elegant opener.', points: ['Emma & James', '14 Sep 2026'] },
  { title: 'Day schedule', subtitle: 'Clear timings so guests know what happens next.', points: ['16:00 Ceremony', '18:00 Dinner'] },
]

function getStepPoints(step) {
  if (Array.isArray(step?.points) && step.points.length > 0) {
    return step.points.slice(0, 2)
  }
  return []
}

export default function TemplatePhonePreview({
  theme,
  visual,
  isActive,
  demoRef,
  previewSteps,
  labels,
}) {
  const iframeRef = useRef(null)
  const tourTimers = useRef([])
  const pendingStart = useRef(false)
  const [loadedLive, setLoadedLive] = useState(false)
  const demoUrl = `/invitations/${demoRef}/${theme.key}?preview=true&embed=true`

  const [baseStep, nextStep] = useMemo(() => {
    const steps = previewSteps?.length > 0 ? previewSteps : fallbackSteps
    const current = steps[0] || fallbackSteps[0]
    const next = steps[1] || current
    return [current, next]
  }, [previewSteps])

  useEffect(() => {
    if (!isActive) {
      clearTour(tourTimers)
      pendingStart.current = false
    }
    return () => clearTour(tourTimers)
  }, [isActive])

  useEffect(() => {
    if (!isActive || !iframeRef.current) return
    clearTour(tourTimers)
    const firstTry = window.setTimeout(() => {
      if (!loadedLive) {
        pendingStart.current = true
        return
      }
      runAutoTour(iframeRef.current, tourTimers)
    }, 110)
    return () => window.clearTimeout(firstTry)
  }, [isActive, loadedLive])

  const stepPoints = getStepPoints(baseStep)

  return (
    <div className="template-card__preview" style={{ background: visual.gradient, '--preview-accent': visual.accent }}>
      <span className="template-card__bloom template-card__bloom--a" />
      <span className="template-card__bloom template-card__bloom--b" />
      <span className="template-card__bloom template-card__bloom--c" />

      <div className="template-phone" aria-hidden="true">
        <div className="template-phone__top">
          <span className="template-phone__camera" />
          <span className="template-phone__speaker" />
        </div>

        <div className="template-phone__screen">
          <div className={`template-phone__fallback ${isActive ? 'is-hidden' : ''}`}>
            <div className="template-phone__cover" style={{ background: visual.gradient }}>
              <p className="template-phone__invite">{labels.previewInvite}</p>
              <p className="template-phone__names">Emma &amp; James</p>
              <p className="template-phone__date">14 Sep 2026</p>
            </div>

            <div className="template-phone__feed">
              <div className="template-phone__section template-phone__section--primary">
                <h4 className="template-phone__section-title">{baseStep.title}</h4>
                <p className="template-phone__section-subtitle">{baseStep.subtitle}</p>
                <div className="template-phone__chips">
                  {(stepPoints.length > 0 ? stepPoints : [baseStep.subtitle]).map((point, idx) => (
                    <span key={`${theme.key}-point-${idx}`} className="template-phone__chip">{point}</span>
                  ))}
                </div>
              </div>

              <div className="template-phone__section template-phone__section--secondary">
                <h5 className="template-phone__next-title">{nextStep.title}</h5>
                <p className="template-phone__next-subtitle">{nextStep.subtitle}</p>
              </div>
            </div>
          </div>

          <div className={`template-phone__live-wrap ${isActive ? 'is-active' : ''}`}>
            <div className={`template-phone__live-badge ${loadedLive ? 'is-ready' : ''}`}>
              <span className="template-phone__live-dot" />
              {labels.previewLive}
            </div>
            {!loadedLive && (
              <div className="template-phone__loading">{labels.previewLoading}</div>
            )}
            <iframe
              ref={iframeRef}
              title={`${theme.name} live preview`}
              src={demoUrl}
              className={`template-phone__live ${loadedLive ? 'is-ready' : ''}`}
              onLoad={(event) => {
                injectNoScrollbarStyles(event.currentTarget)
                injectResponsiveEmbedStyles(event.currentTarget)
                setLoadedLive(true)
                if (pendingStart.current || isActive) {
                  pendingStart.current = false
                  const didStart = runAutoTour(event.currentTarget, tourTimers)
                  if (!didStart) {
                    tourTimers.current.push(window.setTimeout(() => runAutoTour(event.currentTarget, tourTimers), 220))
                    tourTimers.current.push(window.setTimeout(() => runAutoTour(event.currentTarget, tourTimers), 520))
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
