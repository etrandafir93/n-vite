import { useTranslation } from 'react-i18next'

export default function CelestialEvents({
  eventDate,
  ceremonyVenue,
  ceremonyAddress,
  ceremonyTime,
  ceremonyMapUrl,
  receptionVenue,
  receptionAddress,
  receptionTime,
  receptionMapUrl
}) {
  const { t } = useTranslation()
  const formatDate = (isoDate) => {
    if (!isoDate) return ''
    const date = new Date(isoDate)
    return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <section id="unde-cand" className="cel-section cel-events">
      <div className="cel-section__inner">
        <h2 className="cel-section__title">{t('celestial.events.title')}</h2>

        <div className="cel-events__grid">
          {ceremonyVenue && (
            <div className="cel-event-card">
              <div className="cel-event-card__icon">💒</div>
              <h3 className="cel-event-card__title">{t('celestial.events.ceremony')}</h3>
              <p className="cel-event-card__venue">{ceremonyVenue}</p>
              {ceremonyAddress && <p className="cel-event-card__address">{ceremonyAddress}</p>}
              <p className="cel-event-card__datetime">
                {formatDate(eventDate)} {ceremonyTime && `• ${ceremonyTime}`}
              </p>
              {ceremonyMapUrl && (
                <a
                  href={ceremonyMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cel-event-card__map-link"
                >
                  {t('celestial.events.map_link')} →
                </a>
              )}
            </div>
          )}

          {receptionVenue && (
            <div className="cel-event-card">
              <div className="cel-event-card__icon">🥂</div>
              <h3 className="cel-event-card__title">{t('celestial.events.reception')}</h3>
              <p className="cel-event-card__venue">{receptionVenue}</p>
              {receptionAddress && <p className="cel-event-card__address">{receptionAddress}</p>}
              <p className="cel-event-card__datetime">
                {formatDate(eventDate)} {receptionTime && `• ${receptionTime}`}
              </p>
              {receptionMapUrl && (
                <a
                  href={receptionMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cel-event-card__map-link"
                >
                  {t('celestial.events.map_link')} →
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
