import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import './LanguageSelector.css'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ro', label: 'Română', flag: '🇷🇴' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
]

export default function LanguageSelector() {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Check for lang query parameter
    const params = new URLSearchParams(window.location.search)
    const langParam = params.get('lang')

    if (langParam && ['en', 'ro', 'uk'].includes(langParam)) {
      i18n.changeLanguage(langParam)
      localStorage.setItem('lang', langParam)
    }
  }, [i18n])

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode)
    localStorage.setItem('lang', langCode)

    // Update URL with new language parameter
    const params = new URLSearchParams(window.location.search)
    params.set('lang', langCode)
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', newUrl)
  }

  return (
    <div className="lang-selector">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          className={`lang-selector__btn ${i18n.language === lang.code ? 'active' : ''}`}
          onClick={() => handleLanguageChange(lang.code)}
          title={lang.label}
        >
          <span className="lang-selector__flag">{lang.flag}</span>
          <span className="lang-selector__code">{lang.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  )
}
