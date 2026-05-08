import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CelestialSidebar from './celestial/CelestialSidebar'
import CelestialHero from './celestial/CelestialHero'
import CelestialCouple from './celestial/CelestialCouple'
import CelestialEvents from './celestial/CelestialEvents'
import CelestialRsvp from './celestial/CelestialRsvp'
import LanguageSelector from '../../components/LanguageSelector'
import EnvelopeIntro, { useEnvelopePhase } from './EnvelopeIntro'
import './Celestial.css'

const CEL_ENVELOPE_VARS = {
  '--ti-surface': '#ffffff',
  '--ti-bg': '#fef7fc',
  '--ti-accent': '#f97baa',
  '--ti-text': '#1a0d2e',
}

export default function CelestialInvitation({ invitationRef, invitationData }) {
  const { ref: routeRef } = useParams()
  const { t, i18n } = useTranslation()
  const [invitation, setInvitation] = useState(invitationData || null)
  const [loading, setLoading] = useState(!invitationData)
  const envelopeType = invitation?.envelope || 'classic'
  const { phase, handleOpen } = useEnvelopePhase(envelopeType)

  useEffect(() => {
    if (invitationData) {
      setInvitation(invitationData)
      setLoading(false)
      return
    }

    const ref = invitationRef || routeRef
    if (!ref) return

    fetch(`/api/invitations/${ref}`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch invitation')
        return response.json()
      })
      .then((data) => {
        setInvitation(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching invitation:', error)
        setLoading(false)
      })
  }, [invitationData, invitationRef, routeRef])

  if (loading) {
    return (
      <div className="cel-loading">
        <div className="cel-loading__spinner"></div>
        <p>{t('celestial.loading')}</p>
      </div>
    )
  }

  if (!invitation) {
    return (
      <div className="cel-error">
        <h2>{t('celestial.error_title')}</h2>
        <p>{t('celestial.error_message')}</p>
      </div>
    )
  }

  const isDraft = invitation.status === 'DRAFT'
  const isPastEvent = invitation.eventDate && new Date(invitation.eventDate) < new Date()

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
    MENU_PREVIEW: 'Menu Preview',
    PHOTO_GALLERY: 'Photo Gallery',
    COUPLE_QUOTE: 'Couple Quote',
  }

  const extendedSections = (invitation.sections || []).filter(s => EXTENDED_SECTION_LABELS[s.type])
  const extraNavItems = extendedSections.map(s => ({
    id: `ext-${s.type.toLowerCase().replace(/_/g, '-')}`,
    label: s.title || EXTENDED_SECTION_LABELS[s.type],
  }))

  return (
    <div className="cel-page">
      {phase !== 'open' && (
        <EnvelopeIntro phase={phase} onOpen={handleOpen} envelopeType={envelopeType} cssVars={CEL_ENVELOPE_VARS} letterText={`${invitation.groomName} & ${invitation.brideName}`} dateText={invitation.eventDate ? new Date(invitation.eventDate).toLocaleDateString(i18n.language, { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : ''} />
      )}
      <div className="cel-lang-selector-wrapper">
        <LanguageSelector />
      </div>

      <CelestialSidebar
        groomName={invitation.groomName}
        brideName={invitation.brideName}
        eventDate={invitation.eventDate}
        extraNavItems={extraNavItems}
      />

      <main className="cel-main">
        <CelestialHero
          groomName={invitation.groomName}
          brideName={invitation.brideName}
          eventDate={invitation.eventDate}
          backgroundImageUrl={invitation.backgroundImageUrl}
          ceremonyVenue={invitation.ceremonyVenue}
          receptionVenue={invitation.receptionVenue}
        />

        <section id="eveniment" className="cel-section cel-story">
          <div className="cel-section__inner">
            <div className="cel-story__content">
              <p className="cel-story__text">
                {t('celestial.story.text')}
              </p>
            </div>
          </div>
        </section>

        <CelestialCouple
          groomName={invitation.groomName}
          brideName={invitation.brideName}
          backgroundImageUrl={invitation.backgroundImageUrl}
          godparents={invitation.godparents}
        />

        <CelestialEvents
          eventDate={invitation.eventDate}
          ceremonyVenue={invitation.ceremonyVenue}
          ceremonyAddress={invitation.ceremonyAddress}
          ceremonyTime={invitation.ceremonyTime}
          ceremonyMapUrl={invitation.ceremonyMapUrl}
          receptionVenue={invitation.receptionVenue}
          receptionAddress={invitation.receptionAddress}
          receptionTime={invitation.receptionTime}
          receptionMapUrl={invitation.receptionMapUrl}
        />

        {extendedSections.map((section, idx) => {
          const sectionId = extraNavItems[idx].id
          const label = section.title || EXTENDED_SECTION_LABELS[section.type]
          return (
            <section key={sectionId} id={sectionId} className="cel-section cel-story">
              <div className="cel-section__inner">
                <h2 className="cel-section__title" style={{ textAlign: 'center', marginBottom: '2rem' }}>{label}</h2>
                <div className="cel-story__content">
                  {section.imageUrl && (
                    <img
                      src={section.imageUrl}
                      alt={label}
                      style={{ width: '100%', borderRadius: '14px', marginBottom: '1.25rem', objectFit: 'cover' }}
                    />
                  )}
                  {section.content && (
                    <p className="cel-story__text">{section.content}</p>
                  )}
                  {section.linkUrl && (
                    <a href={section.linkUrl} target="_blank" rel="noreferrer" style={{ color: '#8a6742', fontWeight: 600 }}>
                      {t('guest_invitation.open_link')}
                    </a>
                  )}
                </div>
              </div>
            </section>
          )
        })}

        {isDraft ? (
          <section id="confirmare" className="cel-section cel-rsvp">
            <div className="cel-section__inner">
              <div className="cel-draft-notice">
                <h2>{t('celestial.rsvp.draft_title')}</h2>
                <p>{t('celestial.rsvp.draft_message')}</p>
              </div>
            </div>
          </section>
        ) : isPastEvent ? (
          <section id="confirmare" className="cel-section cel-rsvp">
            <div className="cel-section__inner">
              <div className="cel-draft-notice">
                <h2>{t('celestial.rsvp.past_title')}</h2>
                <p>{t('celestial.rsvp.past_message')}</p>
              </div>
            </div>
          </section>
        ) : (
          <CelestialRsvp
            invitationRef={invitationRef || routeRef}
            menuOptions={invitation.menuOptions}
            rsvpDeadline={invitation.rsvpDeadline}
          />
        )}
      </main>
    </div>
  )
}
