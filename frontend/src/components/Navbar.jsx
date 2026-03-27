import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './Navbar.css'
import { version } from '../../package.json'

const LANGS = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'ro', label: 'RO', flag: '🇷🇴' },
  { code: 'uk', label: 'UK', flag: '🇺🇦' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [authState, setAuthState] = useState({ loading: true, authenticated: false, name: null })
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/api/auth/me')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch auth state')
        return response.json()
      })
      .then(data => {
        setAuthState({
          loading: false,
          authenticated: !!data.authenticated,
          name: data.name || null,
        })
      })
      .catch(() => {
        setAuthState({ loading: false, authenticated: false, name: null })
      })
  }, [])

  function changeLang(code) {
    i18n.changeLanguage(code)
    localStorage.setItem('lang', code)
    setLangOpen(false)
  }

  const currentLang = LANGS.find(l => l.code === i18n.language) || LANGS[0]

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a href="#" className="navbar__logo">
          n<span>·</span>vite <span style={{ fontSize: '0.7rem', verticalAlign: 'super' }}>v{version}</span>
        </a>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <li><a href="#how-it-works" onClick={() => setMenuOpen(false)}>{t('nav.how_it_works')}</a></li>
          <li><a href="#templates" onClick={() => setMenuOpen(false)}>{t('nav.templates')}</a></li>
          <li><a href="#features" onClick={() => setMenuOpen(false)}>{t('nav.features')}</a></li>
          <li><a href="#pricing" onClick={() => setMenuOpen(false)}>{t('nav.pricing')}</a></li>
        </ul>

        <div className="navbar__actions">
          <div className="lang-switcher">
            <button
              className="lang-switcher__btn"
              onClick={() => setLangOpen(o => !o)}
              aria-label="Switch language"
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.label}</span>
              <svg className={`lang-switcher__chevron ${langOpen ? 'lang-switcher__chevron--open' : ''}`} viewBox="0 0 12 12" fill="currentColor">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {langOpen && (
              <ul className="lang-switcher__dropdown">
                {LANGS.map(lang => (
                  <li key={lang.code}>
                    <button
                      className={`lang-switcher__option ${lang.code === i18n.language ? 'lang-switcher__option--active' : ''}`}
                      onClick={() => changeLang(lang.code)}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {!authState.loading && authState.authenticated && (
            <>
              <span className="navbar__user">{authState.name}</span>
              <a href="/events" className="navbar__login">{t('nav.my_invitations')}</a>
              <a href="/events/builder" className="navbar__cta">{t('nav.create_invitation')}</a>
            </>
          )}
          {!authState.loading && !authState.authenticated && (
            <>
              <a href="/oauth2/authorization/google" className="navbar__login">{t('nav.log_in')}</a>
              <a href="#pricing" className="navbar__cta">{t('nav.get_started')}</a>
            </>
          )}
        </div>

        <button
          className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  )
}
