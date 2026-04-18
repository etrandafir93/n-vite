import { useTranslation } from 'react-i18next'

export default function CelestialHero({ groomName, brideName, eventDate, backgroundImageUrl, ceremonyVenue, receptionVenue }) {
  const { t } = useTranslation()
  const formatDate = (isoDate) => {
    if (!isoDate) return ''
    const date = new Date(isoDate)
    return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const location = ceremonyVenue || receptionVenue || 'București'

  return (
    <section id="acasa" className="cel-hero">
      <div className="cel-hero__overlay" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
        <div className="cel-hero__gradient"></div>
      </div>
      <div className="cel-hero__content">
        <h1 className="cel-hero__names">
          {groomName} <span className="cel-hero__amp">&</span> {brideName}
        </h1>
        <p className="cel-hero__date">{formatDate(eventDate)} – {location}</p>
        <div className="cel-hero__scroll-hint">
          <span>{t('celestial.hero.welcome')}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3V13M8 13L4 9M8 13L12 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </section>
  )
}
