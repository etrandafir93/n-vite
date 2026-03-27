import { useTranslation } from 'react-i18next'
import './SectionsCatalogue.css'

const FREE_COUNT = 4

export default function SectionsCatalogue() {
  const { t } = useTranslation()
  const items = t('sections.items', { returnObjects: true })
  const paidCount = items.length - FREE_COUNT

  return (
    <section className="sections-catalogue" id="sections">
      <div className="container">
        <div className="sections-catalogue__header">
          <span className="section-label">{t('sections.label')}</span>
          <h2 className="sections-catalogue__title">{t('sections.title')}</h2>
          <p className="sections-catalogue__subtitle">
            {t('sections.subtitle', { freeCount: FREE_COUNT, paidCount })}
          </p>
        </div>

        <div className="sections-catalogue__grid">
          {items.map((item, idx) => (
            <article className="section-chip" key={item}>
              <span className="section-chip__name">{item}</span>
              <span className={`section-chip__price ${idx < FREE_COUNT ? 'section-chip__price--free' : ''}`}>
                {idx < FREE_COUNT ? t('sections.free_badge') : t('sections.paid_badge')}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
