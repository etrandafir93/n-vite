import { useTranslation } from 'react-i18next'
import './Hero.css'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section className="hero">
      <div className="hero__bg" />

      <div className="hero__inner container">
        <div className="hero__content">
          <span className="section-label">{t('hero.label')}</span>
          <h1 className="hero__title">
            {t('hero.title_pre')} <em>{t('hero.title_em')}</em>
          </h1>
          <p className="hero__subtitle">{t('hero.subtitle')}</p>
          <div className="hero__actions">
            <a href="#pricing" className="btn btn--primary">{t('hero.cta_create')}</a>
            <a href="#how-it-works" className="btn btn--ghost">{t('hero.cta_how')}</a>
          </div>
          <div className="hero__stats">
            <div className="hero__stat">
              <strong>{t('hero.stat_invitations_value')}</strong>
              <span>{t('hero.stat_invitations_label')}</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <strong>{t('hero.stat_satisfaction_value')}</strong>
              <span>{t('hero.stat_satisfaction_label')}</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <strong>{t('hero.stat_speed_value')}</strong>
              <span>{t('hero.stat_speed_label')}</span>
            </div>
          </div>
        </div>

        <div className="hero__visual">
          <div className="phone-mockup">
            <div className="phone-mockup__frame">
              <div className="phone-mockup__notch" />
              <div className="phone-mockup__screen">
                <div className="invite-preview">
                  <div className="invite-preview__header">
                    <p className="invite-preview__label">{t('hero.preview.invite_label')}</p>
                    <div className="invite-preview__ornament">✦</div>
                  </div>
                  <div className="invite-preview__center">
                    <h3 className="invite-preview__names">
                      Emma<br />
                      <span className="invite-preview__amp">&amp;</span><br />
                      James
                    </h3>
                  </div>
                  <div className="invite-preview__footer">
                    <div className="invite-preview__divider-line" />
                    <p className="invite-preview__date">{t('hero.preview.date')}</p>
                    <p className="invite-preview__location">{t('hero.preview.location')}</p>
                    <div className="invite-preview__rsvp">
                      <button className="invite-preview__btn invite-preview__btn--accept">{t('hero.preview.accept')}</button>
                      <button className="invite-preview__btn invite-preview__btn--decline">{t('hero.preview.decline')}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="phone-mockup__glow" />
          </div>

          <div className="hero__badge hero__badge--rsvp">
            <span className="hero__badge-icon">✓</span>
            <div>
              <strong>{t('hero.preview.badge_rsvp_title')}</strong>
              <p>{t('hero.preview.badge_rsvp_text')}</p>
            </div>
          </div>

          <div className="hero__badge hero__badge--guests">
            <span className="hero__badge-icon">👥</span>
            <div>
              <strong>{t('hero.preview.badge_guests_title')}</strong>
              <p>{t('hero.preview.badge_guests_text')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__scroll-hint">
        <span />
      </div>
    </section>
  )
}
