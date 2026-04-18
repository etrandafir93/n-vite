import { useTranslation } from 'react-i18next'

export default function CelestialCouple({ groomName, brideName, backgroundImageUrl, godparents }) {
  const { t } = useTranslation()

  // For now, we'll use the background image as a fallback for couple photos
  // In the future, these could be separate fields

  return (
    <section id="noi-doi" className="cel-section cel-couple">
      <div className="cel-section__inner">
        <div className="cel-couple__grid">
          <div className="cel-couple__person">
            <div className="cel-couple__photo-wrapper">
              <img
                src={backgroundImageUrl}
                alt={groomName}
                className="cel-couple__photo"
              />
            </div>
            <h3 className="cel-couple__name">
              {groomName} <span className="cel-couple__heart">♡</span>
            </h3>
            <p className="cel-couple__role">{t('celestial.couple.bride_role')}</p>
            <p className="cel-couple__quote">
              {t('celestial.couple.bride_quote')}
            </p>
          </div>

          <div className="cel-couple__person">
            <div className="cel-couple__photo-wrapper">
              <img
                src={backgroundImageUrl}
                alt={brideName}
                className="cel-couple__photo"
              />
            </div>
            <h3 className="cel-couple__name">
              {brideName} <span className="cel-couple__heart">♡</span>
            </h3>
            <p className="cel-couple__role">{t('celestial.couple.groom_role')}</p>
            <p className="cel-couple__quote">
              {t('celestial.couple.groom_quote')}
            </p>
          </div>
        </div>

        {godparents && (
          <div className="cel-godparents">
            <h3 className="cel-godparents__title">{t('celestial.couple.godparents_title')}</h3>
            <p className="cel-godparents__names">{godparents}</p>
          </div>
        )}
      </div>
    </section>
  )
}
