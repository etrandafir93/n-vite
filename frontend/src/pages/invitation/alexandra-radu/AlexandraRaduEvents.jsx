export default function AlexandraRaduEvents({
  eventDate,
  ceremonyVenue,
  ceremonyAddress,
  ceremonyTime,
  ceremonyPhotoUrl,
  ceremonyMapUrl,
  receptionVenue,
  receptionAddress,
  receptionTime,
  receptionPhotoUrl,
  receptionMapUrl,
}) {
  const formatDate = (isoDate) => {
    if (!isoDate) return ''
    return new Date(isoDate).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const formatTime = (isoTime) => {
    if (!isoTime) return ''
    const part = isoTime.includes('T') ? isoTime.split('T')[1] : isoTime
    return `ora ${part.substring(0, 5)}`
  }

  return (
    <section id="unde-cand" className="cel-section cel-events">
      <div className="cel-section__inner">
        <h2 className="cel-section__title">Unde și când</h2>

        <div className="cel-events__grid">
          {ceremonyVenue && (
            <div className="cel-event-card">
              {ceremonyPhotoUrl && <img src={ceremonyPhotoUrl} alt={ceremonyVenue} className="cel-event-card__photo" />}
              <div className="cel-event-card__icon">💒</div>
              <h3 className="cel-event-card__title">Ceremonia</h3>
              <p className="cel-event-card__venue">{ceremonyVenue}</p>
              {ceremonyAddress && ceremonyAddress !== ceremonyVenue && (
                <p className="cel-event-card__address">{ceremonyAddress}</p>
              )}
              <p className="cel-event-card__datetime">
                {formatDate(eventDate)}{ceremonyTime && ` • ${formatTime(ceremonyTime)}`}
              </p>
              {ceremonyMapUrl && (
                <a href={ceremonyMapUrl} target="_blank" rel="noopener noreferrer" className="cel-event-card__map-link">
                  Vezi pe hartă →
                </a>
              )}
            </div>
          )}

          {receptionVenue && (
            <div className="cel-event-card">
              {receptionPhotoUrl && <img src={receptionPhotoUrl} alt={receptionVenue} className="cel-event-card__photo" />}
              <div className="cel-event-card__icon">🥂</div>
              <h3 className="cel-event-card__title">Petrecerea</h3>
              <p className="cel-event-card__venue">{receptionVenue}</p>
              {receptionAddress && receptionAddress !== receptionVenue && (
                <p className="cel-event-card__address">{receptionAddress}</p>
              )}
              <p className="cel-event-card__datetime">
                {formatDate(eventDate)}{receptionTime && ` • ${formatTime(receptionTime)}`}
              </p>
              {receptionMapUrl && (
                <a href={receptionMapUrl} target="_blank" rel="noopener noreferrer" className="cel-event-card__map-link">
                  Vezi pe hartă →
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
