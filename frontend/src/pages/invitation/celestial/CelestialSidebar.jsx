import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function CelestialSidebar({ groomName, brideName, eventDate }) {
  const { t } = useTranslation()
  const [activeSection, setActiveSection] = useState('acasa')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['acasa', 'noi-doi', 'eveniment', 'unde-cand', 'confirmare']

      for (const id of sections) {
        const element = document.getElementById(id)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const formatDate = (isoDate) => {
    if (!isoDate) return ''
    const date = new Date(isoDate)
    return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <aside className="cel-sidebar">
      <div className="cel-sidebar__header">
        <div className="cel-sidebar__leaf-icon">
          <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
            <path d="M10 20C10 20 15 10 20 8C25 6 30 10 30 15C30 10 35 6 40 8C45 10 50 20 50 20" stroke="#8a7a6a" strokeWidth="1.5" fill="none"/>
            <path d="M20 8C20 8 22 12 25 15M40 8C40 8 38 12 35 15" stroke="#8a7a6a" strokeWidth="1" fill="none"/>
          </svg>
        </div>
        <h1 className="cel-sidebar__title">
          {groomName} <span>&</span> {brideName}
        </h1>
        <p className="cel-sidebar__date">{formatDate(eventDate)}</p>
      </div>

      <nav className="cel-sidebar__nav">
        <button
          className={`cel-sidebar__nav-item ${activeSection === 'acasa' ? 'active' : ''}`}
          onClick={() => scrollToSection('acasa')}
        >
          {t('celestial.nav.home')}
        </button>
        <button
          className={`cel-sidebar__nav-item ${activeSection === 'noi-doi' ? 'active' : ''}`}
          onClick={() => scrollToSection('noi-doi')}
        >
          {t('celestial.nav.couple')}
        </button>
        <button
          className={`cel-sidebar__nav-item ${activeSection === 'eveniment' ? 'active' : ''}`}
          onClick={() => scrollToSection('eveniment')}
        >
          {t('celestial.nav.event')}
        </button>
        <button
          className={`cel-sidebar__nav-item ${activeSection === 'unde-cand' ? 'active' : ''}`}
          onClick={() => scrollToSection('unde-cand')}
        >
          {t('celestial.nav.location')}
        </button>
        <button
          className={`cel-sidebar__nav-item ${activeSection === 'confirmare' ? 'active' : ''}`}
          onClick={() => scrollToSection('confirmare')}
        >
          {t('celestial.nav.rsvp')}
        </button>
      </nav>
    </aside>
  )
}
