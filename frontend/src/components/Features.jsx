import { useTranslation } from 'react-i18next'
import './Features.css'

const icons = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" key="rsvp">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" key="device">
    <path d="M12 18.5A6.5 6.5 0 1 0 5.5 12H3m9 6.5V21m0-2.5 2.5-2.5M12 18.5 9.5 16" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 12h.01M12 12h.01M16 12h.01" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" key="map">
    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" key="design">
    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" key="notif">
    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" key="edit">
    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
]

export default function Features() {
  const { t } = useTranslation()
  const items = t('features.items', { returnObjects: true })

  return (
    <section className="features" id="features">
      <div className="container">
        <div className="features__header">
          <span className="section-label">{t('features.label')}</span>
          <h2 className="features__title">{t('features.title')}</h2>
          <p className="features__subtitle">{t('features.subtitle')}</p>
        </div>

        <div className="features__grid">
          {items.map((item, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-card__icon">{icons[i]}</div>
              <h3 className="feature-card__title">{item.title}</h3>
              <p className="feature-card__desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
