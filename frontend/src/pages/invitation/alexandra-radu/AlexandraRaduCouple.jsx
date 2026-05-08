import { useTranslation } from 'react-i18next'

export default function AlexandraRaduCouple({ groomName, brideName, groomParents, brideParents, groomImageUrl, brideImageUrl, backgroundImageUrl, godparents }) {
  const { t } = useTranslation()

  const groomPhoto = groomImageUrl || backgroundImageUrl
  const bridePhoto = brideImageUrl || backgroundImageUrl

  return (
    <section id="noi-doi" className="cel-section cel-couple">
      <div className="cel-section__inner">
        <div className="cel-couple__grid">
          <div className="cel-couple__person">
            <div className="cel-couple__photo-wrapper">
              <img
                src={groomPhoto}
                alt={groomName}
                className="cel-couple__photo"
              />
            </div>
            <h3 className="cel-couple__name">
              {groomName} <span className="cel-couple__heart">♡</span>
            </h3>
            <p className="cel-couple__quote">
              {t('celestial.couple.groom_quote')}
            </p>
          </div>

          <div className="cel-couple__person">
            <div className="cel-couple__photo-wrapper">
              <img
                src={bridePhoto}
                alt={brideName}
                className="cel-couple__photo"
              />
            </div>
            <h3 className="cel-couple__name">
              {brideName} <span className="cel-couple__heart">♡</span>
            </h3>
            <p className="cel-couple__quote">
              {t('celestial.couple.bride_quote')}
            </p>
          </div>
        </div>

        {(groomParents || brideParents || godparents) && (
          <div className="cel-ar-family">
            {(groomParents || brideParents) && (
              <div className="cel-ar-family__block">
                <p className="cel-ar-family__intro">Alături de părinții care ne-au călăuzit pașii în viață,</p>
                {groomParents && <p className="cel-ar-family__names">{groomParents}</p>}
                {brideParents && <p className="cel-ar-family__names">{brideParents}</p>}
              </div>
            )}
            {godparents && (
              <div className="cel-ar-family__block">
                <p className="cel-ar-family__intro">Sub ocrotirea nașilor noștri dragi,</p>
                <p className="cel-ar-family__names">{godparents}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
