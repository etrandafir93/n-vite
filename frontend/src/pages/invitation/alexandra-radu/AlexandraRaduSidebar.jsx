import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function AlexandraRaduSidebar({ ourStoryNavItem = null, extraNavItems = [] }) {
  const { t } = useTranslation()
  const [activeSection, setActiveSection] = useState('acasa')

  useEffect(() => {
    const handleScroll = () => {
      const ourStoryIds = ourStoryNavItem ? [ourStoryNavItem.id] : []
      const sections = ['acasa', 'noi-doi', ...ourStoryIds, 'unde-cand', ...extraNavItems.map(i => i.id), 'confirmare']

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

  return (
    <aside className="cel-sidebar">
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
        {ourStoryNavItem && (
          <button
            className={`cel-sidebar__nav-item ${activeSection === ourStoryNavItem.id ? 'active' : ''}`}
            onClick={() => scrollToSection(ourStoryNavItem.id)}
          >
            {ourStoryNavItem.label}
          </button>
        )}
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
