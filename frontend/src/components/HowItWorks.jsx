import { useTranslation } from 'react-i18next'
import './HowItWorks.css'

const STEP_NUMBERS = ['01', '02', '03', '04', '05']

export default function HowItWorks() {
  const { t } = useTranslation()
  const steps = t('hiw.steps', { returnObjects: true })

  return (
    <section className="hiw" id="how-it-works">
      <div className="container">
        <div className="hiw__header">
          <span className="section-label">{t('hiw.label')}</span>
          <h2 className="hiw__title">{t('hiw.title')}</h2>
          <p className="hiw__subtitle">{t('hiw.subtitle')}</p>
        </div>

        <div className="hiw__steps">
          {steps.map((step, i) => (
            <div className="hiw__step" key={STEP_NUMBERS[i]}>
              <div className="hiw__step-number">{STEP_NUMBERS[i]}</div>
              <div className="hiw__step-content">
                <h3 className="hiw__step-title">{step.title}</h3>
                <p className="hiw__step-desc">{step.description}</p>
              </div>
              {i < steps.length - 1 && <div className="hiw__step-connector" />}
            </div>
          ))}
        </div>

        <div className="hiw__cta">
          <a href="#pricing" className="btn btn--primary">{t('hiw.cta')}</a>
        </div>
      </div>
    </section>
  )
}
