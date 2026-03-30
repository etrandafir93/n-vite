import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TemplatePhonePreview from './templates/TemplatePhonePreview'
import { resolveThemeVisual } from './templates/themeRegistry'
import './Templates.css'

const DEMO_REF = 'joe-and-jane'

const fallbackSteps = [
  { title: 'Welcome cover', subtitle: 'Names, date and venue in one elegant opener.', points: ['Emma & James', '14 Sep 2026'] },
]

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
            const visual = resolveThemeVisual(theme.key)
            const isActive = activeKey === theme.key

            return (
              <article
                key={theme.key}
                className="template-card"
                onMouseEnter={() => setActiveKey(theme.key)}
                onMouseLeave={() => setActiveKey((prev) => (prev === theme.key ? null : prev))}
                onFocus={() => setActiveKey(theme.key)}
                onBlur={() => setActiveKey((prev) => (prev === theme.key ? null : prev))}
              >
                <TemplatePhonePreview
                  theme={theme}
                  visual={visual}
                  isActive={isActive}
                  demoRef={DEMO_REF}
                  previewSteps={previewSteps}
                  labels={{
                    previewInvite: t('templates.preview_invite'),
                    previewLoading: t('templates.preview_loading'),
                    previewLive: t('templates.preview_live'),
                  }}
                />

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
