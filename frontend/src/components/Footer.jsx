import { useTranslation } from 'react-i18next'
import './Footer.css'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#" className="footer__logo">n<span>·</span>vite</a>
            <p className="footer__tagline">{t('footer.tagline')}</p>
            <div className="footer__socials">
              <a href="#" aria-label="Facebook" className="footer__social">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="footer__social">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="#" aria-label="TikTok" className="footer__social">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.97a8.22 8.22 0 004.79 1.52V7.04a4.86 4.86 0 01-1.03-.35z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer__links-group">
            <h4>{t('footer.product')}</h4>
            <ul>
              <li><a href="#how-it-works">{t('nav.how_it_works')}</a></li>
              <li><a href="#features">{t('nav.features')}</a></li>
              <li><a href="#pricing">{t('nav.pricing')}</a></li>
              <li><a href="#templates">{t('nav.templates')}</a></li>
            </ul>
          </div>

          <div className="footer__links-group">
            <h4>{t('footer.events')}</h4>
            <ul>
              <li><a href="#">{t('footer.weddings')}</a></li>
              <li><a href="#">{t('footer.baptisms')}</a></li>
              <li><a href="#">{t('footer.anniversaries')}</a></li>
              <li><a href="#">{t('footer.birthdays')}</a></li>
            </ul>
          </div>

          <div className="footer__links-group">
            <h4>{t('footer.company')}</h4>
            <ul>
              <li><a href="#">{t('footer.about')}</a></li>
              <li><a href="#">{t('footer.blog')}</a></li>
              <li><a href="#">{t('footer.contact')}</a></li>
              <li><a href="#">{t('footer.support')}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="footer__legal">
            <a href="#">{t('footer.privacy')}</a>
            <a href="#">{t('footer.terms')}</a>
            <a href="#">{t('footer.cookies')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
