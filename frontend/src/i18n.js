import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ro from './locales/ro.json'
import uk from './locales/uk.json'
import es from './locales/es.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ro: { translation: ro },
      uk: { translation: uk },
      es: { translation: es },
    },
    lng: localStorage.getItem('lang') || navigator.language?.split('-')[0] || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n
