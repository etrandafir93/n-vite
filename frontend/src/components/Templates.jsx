import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './Templates.css'

const DEMO_REF = 'joe-and-jane'
const PREVIEW_SECTION_IDS = ['families', 'celebrations', 'schedule', 'dress-code', 'accommodation', 'day-schedule', 'rsvp']

const themeVisuals = {
  classic: { gradient: 'linear-gradient(160deg, #2a1a0e 0%, #6b4226 55%, #c9a07a 100%)', accent: '#c9a07a', symbol: '*' },
  romantic: { gradient: 'linear-gradient(160deg, #2d0a14 0%, #8b3050 55%, #d4788a 100%)', accent: '#d4788a', symbol: 'o' },
  modern: { gradient: 'linear-gradient(160deg, #0d1b2a 0%, #1a3a5c 55%, #f5a623 100%)', accent: '#f5a623', symbol: '+' },
  natural: { gradient: 'linear-gradient(160deg, #1a2a1a 0%, #3d6b4a 55%, #7a9e7e 100%)', accent: '#7a9e7e', symbol: '#' },
}

export default function Templates() {
  const { t } = useTranslation()
  const themes = t('templates.themes', { returnObjects: true })
  const [activeKey, setActiveKey] = useState(null)
  const iframeRefs = useRef({})
  const iframeLoaded = useRef({})
  const scrollTimers = useRef({})

  const stopAutoScroll = (key) => {
    const timers = scrollTimers.current[key]
    if (timers) {
      timers.forEach(timer => clearTimeout(timer))
      delete scrollTimers.current[key]
    }
  }

  const startAutoScroll = (key) => {
    stopAutoScroll(key)
    const iframe = iframeRefs.current[key]
    if (!iframe) return

    try {
      const win = iframe.contentWindow
      const doc = iframe.contentDocument || win?.document
      if (!doc) return

      if (!doc.getElementById('template-preview-hide-scrollbar')) {
        const style = doc.createElement('style')
        style.id = 'template-preview-hide-scrollbar'
        style.textContent = `
          html, body {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          html::-webkit-scrollbar,
          body::-webkit-scrollbar {
            width: 0 !important;
            height: 0 !important;
            display: none !important;
          }
        `
        doc.head?.appendChild(style)
      }

      const scrollableElements = Array.from(doc.querySelectorAll('*')).filter((el) => {
        const style = win?.getComputedStyle ? win.getComputedStyle(el) : null
        const overflowY = style?.overflowY || ''
        return (overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight - el.clientHeight > 40
      })
      const localScrollable = scrollableElements.sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight))[0]
      const scroller = localScrollable || doc.scrollingElement || doc.documentElement || doc.body
      if (!scroller) return

      const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight)
      if (maxScroll <= 80) return

      const sectionStops = PREVIEW_SECTION_IDS
        .map((id) => {
          const section = doc.getElementById(id)
          if (!section) return null

          if (scroller === doc.scrollingElement || scroller === doc.documentElement || scroller === doc.body) {
            return section.offsetTop
          }

          const scrollRect = scroller.getBoundingClientRect()
          const sectionRect = section.getBoundingClientRect()
          return scroller.scrollTop + (sectionRect.top - scrollRect.top)
        })
        .filter(top => top !== null)
        .map(top => Math.min(maxScroll, Math.max(0, top)))

      const fallbackStops = [0, Math.round(maxScroll * 0.2), Math.round(maxScroll * 0.4), Math.round(maxScroll * 0.62), Math.round(maxScroll * 0.82), maxScroll]
      const sourceStops = sectionStops.length > 0 ? [0, ...sectionStops] : fallbackStops
      const stops = sourceStops.filter((top, index) => index === 0 || Math.abs(top - sourceStops[index - 1]) > 40).slice(0, 9)
      const paceMs = Math.max(850, Math.floor(9800 / Math.max(1, stops.length - 1)))

      const rootScrollable = scroller === doc.scrollingElement || scroller === doc.documentElement || scroller === doc.body
      if (rootScrollable && win?.scrollTo) {
        win.scrollTo({ top: 0, behavior: 'auto' })
      }
      scroller.scrollTop = 0

      const timers = []
      stops.forEach((top, idx) => {
        const timer = window.setTimeout(() => {
          if (!iframeRefs.current[key]) return
          if (rootScrollable && win?.scrollTo) {
            win.scrollTo({ top, behavior: 'smooth' })
          } else {
            scroller.scrollTo?.({ top, behavior: 'smooth' }) ?? (scroller.scrollTop = top)
          }
        }, idx * paceMs)
        timers.push(timer)
      })
      scrollTimers.current[key] = timers
    } catch (e) {
      stopAutoScroll(key)
    }
  }

  useEffect(() => {
    if (!activeKey) return
    if (!iframeLoaded.current[activeKey]) return

    const timer = window.setTimeout(() => startAutoScroll(activeKey), 220)
    return () => clearTimeout(timer)
  }, [activeKey])

  useEffect(() => {
    Object.keys(scrollTimers.current).forEach((key) => {
      if (key !== activeKey) {
        stopAutoScroll(key)
      }
    })
  }, [activeKey])

  useEffect(() => {
    return () => {
      Object.keys(scrollTimers.current).forEach(stopAutoScroll)
    }
  }, [])

  return (
    <section className="templates" id="templates">
      <div className="container">
        <div className="templates__header">
          <span className="section-label">{t('templates.label')}</span>
          <h2 className="templates__title">{t('templates.title')}</h2>
          <p className="templates__subtitle">{t('templates.subtitle')}</p>
        </div>

        <div className="templates__grid">
          {themes.map((theme) => {
            const v = themeVisuals[theme.key]
            const isActive = activeKey === theme.key
            const demoUrl = `/invitations/${DEMO_REF}/${theme.key}?preview=true`

            return (
              <article
                key={theme.key}
                className="template-card"
                onMouseEnter={() => setActiveKey(theme.key)}
                onMouseLeave={() => setActiveKey(prev => (prev === theme.key ? null : prev))}
                onFocus={() => setActiveKey(theme.key)}
                onBlur={() => setActiveKey(prev => (prev === theme.key ? null : prev))}
              >
                <div className="template-card__preview" style={{ background: v.gradient }}>
                  {!isActive && (
                    <div className="template-card__mini">
                      <p className="template-card__mini-label">You are invited to the wedding of</p>
                      <div className="template-card__mini-symbol" style={{ color: v.accent }}>{v.symbol}</div>
                      <p className="template-card__mini-names">Emma &amp; James</p>
                      <p className="template-card__mini-date">14 - September - 2026</p>
                    </div>
                  )}
                  {isActive && (
                    <iframe
                      ref={(el) => { iframeRefs.current[theme.key] = el }}
                      title={`${theme.name} demo preview`}
                      src={demoUrl}
                      className="template-card__live"
                      onLoad={() => {
                        iframeLoaded.current[theme.key] = true
                        if (activeKey === theme.key) {
                          window.setTimeout(() => startAutoScroll(theme.key), 260)
                        }
                      }}
                    />
                  )}
                </div>
                <div className="template-card__body">
                  <div className="template-card__name-row">
                    <h3 className="template-card__name">{theme.name}</h3>
                    <span className="template-card__arrow">-&gt;</span>
                  </div>
                  <p className="template-card__tagline">{theme.tagline}</p>
                  <a
                    href={`/invitations/${DEMO_REF}/${theme.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="template-card__cta"
                    onMouseEnter={() => setActiveKey(theme.key)}
                  >
                    {t('templates.view_demo')}
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
