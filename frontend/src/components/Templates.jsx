import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './Templates.css'

const DEMO_REF = 'joe-and-jane'

const themeVisuals = {
  classic: { gradient: 'linear-gradient(160deg, #2a1a0e 0%, #6b4226 55%, #c9a07a 100%)', accent: '#c9a07a', symbol: '✦' },
  romantic: { gradient: 'linear-gradient(160deg, #2d0a14 0%, #8b3050 55%, #d4788a 100%)', accent: '#d4788a', symbol: '♡' },
  modern: { gradient: 'linear-gradient(160deg, #0d1b2a 0%, #1a3a5c 55%, #f5a623 100%)', accent: '#f5a623', symbol: '◆' },
  natural: { gradient: 'linear-gradient(160deg, #1a2a1a 0%, #3d6b4a 55%, #7a9e7e 100%)', accent: '#7a9e7e', symbol: '❧' },
}

export default function Templates() {
  const { t } = useTranslation()
  const themes = t('templates.themes', { returnObjects: true })
  const [activeKey, setActiveKey] = useState(null)
  const iframeRefs = useRef({})
  const scrollIntervals = useRef({})

  const stopAutoScroll = (key) => {
    const timer = scrollIntervals.current[key]
    if (timer) {
      clearInterval(timer)
      delete scrollIntervals.current[key]
    }
  }

  const startAutoScroll = (key) => {
    stopAutoScroll(key)
    const iframe = iframeRefs.current[key]
    if (!iframe) return

    let direction = 1
    scrollIntervals.current[key] = window.setInterval(() => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (!doc) return
        const scroller = doc.scrollingElement || doc.documentElement || doc.body
        if (!scroller) return

        const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight)
        if (maxScroll <= 0) return

        const next = scroller.scrollTop + direction * 2
        if (next >= maxScroll - 2) direction = -1
        if (next <= 2) direction = 1
        scroller.scrollTop = Math.max(0, Math.min(maxScroll, next))
      } catch (e) {
        stopAutoScroll(key)
      }
    }, 40)
  }

  useEffect(() => {
    Object.keys(scrollIntervals.current).forEach((key) => {
      if (key !== activeKey) {
        stopAutoScroll(key)
      }
    })
    if (!activeKey) return
    startAutoScroll(activeKey)
  }, [activeKey])

  useEffect(() => {
    return () => {
      Object.keys(scrollIntervals.current).forEach(stopAutoScroll)
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
                      <p className="template-card__mini-date">14 · September · 2026</p>
                    </div>
                  )}
                  {isActive && (
                    <iframe
                      ref={el => { iframeRefs.current[theme.key] = el }}
                      title={`${theme.name} demo preview`}
                      src={demoUrl}
                      className="template-card__live"
                      onLoad={() => { if (activeKey === theme.key) startAutoScroll(theme.key) }}
                    />
                  )}
                </div>
                <div className="template-card__body">
                  <div className="template-card__name-row">
                    <h3 className="template-card__name">{theme.name}</h3>
                    <span className="template-card__arrow">→</span>
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
