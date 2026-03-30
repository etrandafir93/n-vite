import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './Templates.css'

const DEMO_REF = 'joe-and-jane'

const themeVisuals = {
  classic: { gradient: 'linear-gradient(165deg, #2a1a0e 0%, #5b3721 56%, #c9a07a 100%)', accent: '#d9b28b' },
  romantic: { gradient: 'linear-gradient(165deg, #340d19 0%, #8b3050 58%, #d4788a 100%)', accent: '#f0b7c3' },
  modern: { gradient: 'linear-gradient(165deg, #101824 0%, #213f66 56%, #f5a623 100%)', accent: '#ffd274' },
  natural: { gradient: 'linear-gradient(165deg, #1d2b20 0%, #356246 56%, #7a9e7e 100%)', accent: '#b9d1b6' },
}

const fallbackSteps = [
  { title: 'Welcome cover', subtitle: 'Names, date and venue in one elegant opener.', points: ['Emma & James', '14 Sep 2026'] },
  { title: 'Day schedule', subtitle: 'Clear timings so guests know what happens next.', points: ['16:00 Ceremony', '18:00 Dinner'] },
]

const getStepPoints = (step) => {
  if (Array.isArray(step?.points) && step.points.length > 0) {
    return step.points.slice(0, 2)
  }
  return []
}

export default function Templates() {
  const { t } = useTranslation()
  const themes = t('templates.themes', { returnObjects: true })
  const i18nSteps = t('templates.preview_steps', { returnObjects: true })
  const previewSteps = useMemo(() => {
    if (Array.isArray(i18nSteps) && i18nSteps.length > 0) {
      return i18nSteps
    }
    return fallbackSteps
  }, [i18nSteps])

  const [activeKey, setActiveKey] = useState(null)
  const [loadedLive, setLoadedLive] = useState({})

  return (
    <section className="templates" id="templates">
      <div className="container">
        <div className="templates__header">
          <span className="section-label">{t('templates.label')}</span>
          <h2 className="templates__title">{t('templates.title')}</h2>
          <p className="templates__subtitle">{t('templates.subtitle')}</p>
        </div>

        <div className="templates__grid">
          {themes.map((theme, idx) => {
            const v = themeVisuals[theme.key]
            const isActive = activeKey === theme.key
            const demoUrl = `/invitations/${DEMO_REF}/${theme.key}?preview=true`
            const baseStep = previewSteps[idx % previewSteps.length] || previewSteps[0] || fallbackSteps[0]
            const nextStep = previewSteps[(idx + 1) % previewSteps.length] || baseStep
            const stepPoints = getStepPoints(baseStep)

            return (
              <article
                key={theme.key}
                className="template-card"
                onMouseEnter={() => setActiveKey(theme.key)}
                onMouseLeave={() => setActiveKey((prev) => (prev === theme.key ? null : prev))}
                onFocus={() => setActiveKey(theme.key)}
                onBlur={() => setActiveKey((prev) => (prev === theme.key ? null : prev))}
              >
                <div className="template-card__preview" style={{ background: v.gradient, '--preview-accent': v.accent }}>
                  <span className="template-card__bloom template-card__bloom--a" />
                  <span className="template-card__bloom template-card__bloom--b" />
                  <span className="template-card__bloom template-card__bloom--c" />

                  <div className="template-phone" aria-hidden="true">
                    <div className="template-phone__top">
                      <span className="template-phone__camera" />
                      <span className="template-phone__speaker" />
                    </div>

                    <div className="template-phone__screen">
                      {!isActive && (
                        <>
                          <div className="template-phone__cover" style={{ background: v.gradient }}>
                            <p className="template-phone__invite">{t('templates.preview_invite')}</p>
                            <p className="template-phone__names">Emma &amp; James</p>
                            <p className="template-phone__date">14 Sep 2026</p>
                          </div>

                          <div className="template-phone__feed">
                            <div className="template-phone__section template-phone__section--primary">
                              <h4 className="template-phone__section-title">{baseStep.title}</h4>
                              <p className="template-phone__section-subtitle">{baseStep.subtitle}</p>
                              <div className="template-phone__chips">
                                {(stepPoints.length > 0 ? stepPoints : [baseStep.subtitle]).map((point, pointIdx) => (
                                  <span key={`${theme.key}-point-${pointIdx}`} className="template-phone__chip">{point}</span>
                                ))}
                              </div>
                            </div>

                            <div className="template-phone__section template-phone__section--secondary">
                              <h5 className="template-phone__next-title">{nextStep.title}</h5>
                              <p className="template-phone__next-subtitle">{nextStep.subtitle}</p>
                            </div>
                          </div>
                        </>
                      )}

                      {isActive && (
                        <div className="template-phone__live-wrap">
                          {!loadedLive[theme.key] && (
                            <div className="template-phone__loading">{t('templates.preview_loading')}</div>
                          )}
                          <iframe
                            title={`${theme.name} live preview`}
                            src={demoUrl}
                            className={`template-phone__live ${loadedLive[theme.key] ? 'is-ready' : ''}`}
                            onLoad={() => {
                              setLoadedLive((prev) => ({ ...prev, [theme.key]: true }))
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="template-card__body">
                  <h3 className="template-card__name">{theme.name}</h3>
                  <p className="template-card__tagline">{theme.tagline}</p>
                  <div className="template-card__meta">
                    <span className="template-card__hint">{t('templates.preview_hint')}</span>
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
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
