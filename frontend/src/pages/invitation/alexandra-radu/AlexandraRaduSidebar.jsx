import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function AlexandraRaduSidebar({ groomName, brideName, eventDate, extraNavItems = [] }) {
  const { t } = useTranslation()
  const [activeSection, setActiveSection] = useState('acasa')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['acasa', 'eveniment', 'noi-doi', 'unde-cand', ...extraNavItems.map(i => i.id), 'confirmare']

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
  }, [extraNavItems])

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
          <style>{`
            @keyframes ar-breathe {
              0%, 100% { transform: scale(1); opacity: .75; }
              50% { transform: scale(1.07); opacity: 1; }
            }
            @keyframes ar-sparkle {
              0%, 55%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
              75% { opacity: 1; transform: scale(1) rotate(45deg); }
            }
            .ar-rings { animation: ar-breathe 3.6s ease-in-out infinite; transform-origin: 32px 18px; }
            .ar-sp1 { animation: ar-sparkle 3.6s ease-in-out infinite 0s; transform-origin: 8px 7px; }
            .ar-sp2 { animation: ar-sparkle 3.6s ease-in-out infinite 1.2s; transform-origin: 56px 9px; }
            .ar-sp3 { animation: ar-sparkle 3.6s ease-in-out infinite 2.4s; transform-origin: 32px 1px; }
          `}</style>
          <svg width="64" height="36" viewBox="0 0 64 36" fill="none">
            <g className="ar-rings">
              <circle cx="22" cy="18" r="12" stroke="#f97baa" strokeWidth="1.5"/>
              <circle cx="42" cy="18" r="12" stroke="#f97baa" strokeWidth="1.5"/>
            </g>
            <g fill="#f97baa">
              <path className="ar-sp1" d="M8 7 L9 5 L10 7 L8 7Z M8 7 L10 7 L9 9 L8 7Z" opacity="0"/>
              <path className="ar-sp2" d="M55 9 L56 7 L57 9 L55 9Z M55 9 L57 9 L56 11 L55 9Z" opacity="0"/>
              <path className="ar-sp3" d="M31 1 L32 0 L33 1 L32 2Z" opacity="0"/>
            </g>
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
          className={`cel-sidebar__nav-item ${activeSection === 'eveniment' ? 'active' : ''}`}
          onClick={() => scrollToSection('eveniment')}
        >
          {t('celestial.nav.event')}
        </button>
        <button
          className={`cel-sidebar__nav-item ${activeSection === 'noi-doi' ? 'active' : ''}`}
          onClick={() => scrollToSection('noi-doi')}
        >
          {t('celestial.nav.couple')}
        </button>
        <button
          className={`cel-sidebar__nav-item ${activeSection === 'unde-cand' ? 'active' : ''}`}
          onClick={() => scrollToSection('unde-cand')}
        >
          {t('celestial.nav.location')}
        </button>
        {extraNavItems.map(item => (
          <button
            key={item.id}
            className={`cel-sidebar__nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => scrollToSection(item.id)}
          >
            {item.label}
          </button>
        ))}
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
