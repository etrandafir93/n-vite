import { useMemo, useState } from 'react'

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
  const [loadedLive, setLoadedLive] = useState(false)
  const demoUrl = `/invitations/${demoRef}/${theme.key}?preview=true&embed=true`

  const [baseStep, nextStep] = useMemo(() => {
    const steps = previewSteps?.length > 0 ? previewSteps : fallbackSteps
    const current = steps[0] || fallbackSteps[0]
    const next = steps[1] || current
    return [current, next]
  }, [previewSteps])

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
          {!isActive && (
            <>
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
            </>
          )}

          {isActive && (
            <div className="template-phone__live-wrap">
              <div className={`template-phone__live-badge ${loadedLive ? 'is-ready' : ''}`}>
                <span className="template-phone__live-dot" />
                {labels.previewLive}
              </div>
              {!loadedLive && (
                <div className="template-phone__loading">{labels.previewLoading}</div>
              )}
              <iframe
                title={`${theme.name} live preview`}
                src={demoUrl}
                className={`template-phone__live ${loadedLive ? 'is-ready' : ''}`}
                onLoad={(event) => {
                  injectNoScrollbarStyles(event.currentTarget)
                  setLoadedLive(true)
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
