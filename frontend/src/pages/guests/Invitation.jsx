import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ClassicInvitation from '../invitation/Classic'
import RomanticInvitation from '../invitation/Romantic'
import ModernInvitation from '../invitation/Modern'
import NaturalInvitation from '../invitation/Natural'

const THEME_COMPONENTS = {
  classic: ClassicInvitation,
  romantic: RomanticInvitation,
  modern: ModernInvitation,
  natural: NaturalInvitation,
}

const EXTENDED_SECTION_LABELS = {
  GIFT_REGISTRY: 'Gift Registry',
  OUR_STORY: 'Our Story',
  WEDDING_PARTY: 'Wedding Party',
  FAQ: 'FAQ',
  TRANSPORT: 'Transport',
  SONG_REQUEST: 'Song Request',
  HONEYMOON_FUND: 'Honeymoon Fund',
  CHILDREN_POLICY: 'Children Policy',
  PARKING: 'Parking',
  COUNTDOWN: 'Countdown',
  MENU_PREVIEW: 'Menu Preview',
  PHOTO_GALLERY: 'Photo Gallery',
  COUPLE_QUOTE: 'Couple Quote',
}

function ExtendedSections({ sections, t }) {
  const renderable = (sections || []).filter(s => EXTENDED_SECTION_LABELS[s.type])
  if (renderable.length === 0) return null

  return (
    <section style={{ padding: '2.5rem 1.2rem 3rem', background: '#f7f6f4' }}>
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 1rem', textAlign: 'center', color: '#2f2a24' }}>{t('guest_invitation.more_details')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {renderable.map((section, idx) => (
            <article
              key={`${section.type}-${idx}`}
              style={{
                background: '#fff',
                border: '1px solid #e8e3dc',
                borderRadius: '14px',
                padding: '1rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: '.65rem', color: '#2f2a24' }}>
                {section.title || EXTENDED_SECTION_LABELS[section.type]}
              </h3>
              {section.imageUrl && (
                <img
                  src={section.imageUrl}
                  alt={section.title || EXTENDED_SECTION_LABELS[section.type]}
                  style={{ width: '100%', borderRadius: '10px', marginBottom: '.7rem', objectFit: 'cover' }}
                />
              )}
              {section.content && (
                <p style={{ marginTop: 0, marginBottom: '.7rem', lineHeight: 1.55, color: '#463c31' }}>
                  {section.content}
                </p>
              )}
              {section.linkUrl && (
                <a href={section.linkUrl} target="_blank" rel="noreferrer" style={{ color: '#8a6742', fontWeight: 600 }}>
                  {t('guest_invitation.open_link')}
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Invitation() {
  const { t } = useTranslation()
  const { ref, theme: urlTheme } = useParams()
  const [invitation, setInvitation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/invitations/${ref}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        setInvitation(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching invitation:', error)
        setLoading(false)
      })
  }, [ref])

  if (loading) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {t('guest_invitation.loading')}
        </div>
      )
  }

  if (!invitation) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {t('guest_invitation.not_found')}
        </div>
      )
  }

  const selectedTheme = urlTheme || invitation.theme || 'classic'
  const ThemeComponent = THEME_COMPONENTS[selectedTheme] || THEME_COMPONENTS.classic

  return (
    <>
      <ThemeComponent invitationRef={ref} invitationData={invitation} />
      <ExtendedSections sections={invitation.sections} t={t} />
    </>
  )
}

