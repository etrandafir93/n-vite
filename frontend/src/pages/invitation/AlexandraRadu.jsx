import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AlexandraRaduSidebar from './alexandra-radu/AlexandraRaduSidebar'
import AlexandraRaduHero from './alexandra-radu/AlexandraRaduHero'
import AlexandraRaduCouple from './alexandra-radu/AlexandraRaduCouple'
import AlexandraRaduEvents from './alexandra-radu/AlexandraRaduEvents'
import AlexandraRaduRsvp from './alexandra-radu/AlexandraRaduRsvp'
import EnvelopeIntro, { useEnvelopePhase } from './EnvelopeIntro'
import './Celestial.css'

const FLORAL_COLOR = '#c8849a'
const FLORAL_OPACITY = 0.28

function FloralCorner({ style }) {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', ...style }}>
      <g stroke={FLORAL_COLOR} strokeLinecap="round" strokeLinejoin="round" opacity={FLORAL_OPACITY}>
        <ellipse cx="28" cy="28" rx="13" ry="8" strokeWidth="1"/>
        <ellipse cx="28" cy="28" rx="13" ry="8" strokeWidth="1" transform="rotate(45 28 28)"/>
        <ellipse cx="28" cy="28" rx="13" ry="8" strokeWidth="1" transform="rotate(90 28 28)"/>
        <ellipse cx="28" cy="28" rx="13" ry="8" strokeWidth="1" transform="rotate(135 28 28)"/>
        <ellipse cx="28" cy="28" rx="8" ry="5" strokeWidth="0.8" transform="rotate(22 28 28)"/>
        <ellipse cx="28" cy="28" rx="8" ry="5" strokeWidth="0.8" transform="rotate(67 28 28)"/>
        <circle cx="28" cy="28" r="4" fill={FLORAL_COLOR} stroke="none" opacity="0.3"/>
        <path d="M41 32 C58 27 78 25 100 25 C122 24 143 22 156 17" strokeWidth="0.9"/>
        <path d="M32 41 C27 58 25 78 25 100 C24 122 22 143 17 156" strokeWidth="0.9"/>
        <ellipse cx="76" cy="25" rx="3.5" ry="7.5" strokeWidth="0.8" transform="rotate(-5 76 25)"/>
        <ellipse cx="106" cy="25" rx="3.5" ry="6.5" strokeWidth="0.8"/>
        <ellipse cx="103" cy="21" rx="2.5" ry="4.5" strokeWidth="0.7" transform="rotate(-18 103 21)"/>
        <circle cx="140" cy="19" r="2.5" strokeWidth="0.8"/>
        <circle cx="148" cy="16" r="1.8" strokeWidth="0.7"/>
        <circle cx="144" cy="12" r="1.8" strokeWidth="0.7"/>
        <ellipse cx="25" cy="76" rx="7.5" ry="3.5" strokeWidth="0.8" transform="rotate(85 25 76)"/>
        <ellipse cx="25" cy="106" rx="6.5" ry="3.5" strokeWidth="0.8" transform="rotate(90 25 106)"/>
        <ellipse cx="21" cy="103" rx="4.5" ry="2.5" strokeWidth="0.7" transform="rotate(72 21 103)"/>
        <circle cx="19" cy="140" r="2.5" strokeWidth="0.8"/>
        <circle cx="16" cy="148" r="1.8" strokeWidth="0.7"/>
        <circle cx="12" cy="144" r="1.8" strokeWidth="0.7"/>
      </g>
    </svg>
  )
}

function FloralCornerOverlay() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 51, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0 }}><FloralCorner /></div>
      <div style={{ position: 'absolute', top: 0, right: 0 }}><FloralCorner style={{ transform: 'scaleX(-1)' }} /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0 }}><FloralCorner style={{ transform: 'scaleY(-1)' }} /></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0 }}><FloralCorner style={{ transform: 'scale(-1,-1)' }} /></div>
    </div>
  )
}

const AR_ENVELOPE_VARS = {
  '--ti-surface': '#fffaf8',
  '--ti-bg': '#fbeef2',
  '--ti-accent': '#c4a44d',
  '--ti-text': '#3a2a2e',
}

export default function AlexandraRaduInvitation({ invitationRef, invitationData }) {
  const { ref: routeRef } = useParams()
  const { t } = useTranslation()
  const [invitation, setInvitation] = useState(invitationData || null)
  const [loading, setLoading] = useState(!invitationData)
  const envelopeType = invitation?.envelope || 'elegant'
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
    <div className="cel-page cel-page--ar">
      {phase !== 'open' && (
        <>
          <EnvelopeIntro phase={phase} onOpen={handleOpen} envelopeType={envelopeType} cssVars={AR_ENVELOPE_VARS} letterText={`${invitation.groomName} & ${invitation.brideName}`} dateText={invitation.eventDate ? new Date(invitation.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : ''} />
          <FloralCornerOverlay />
        </>
      )}
      {phase === 'open' && <AlexandraRaduSidebar
        groomName={invitation.groomName}
        brideName={invitation.brideName}
        eventDate={invitation.eventDate}
        extraNavItems={extraNavItems}
      />}

      <main className="cel-main">
        <AlexandraRaduHero
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

        <AlexandraRaduCouple
          groomName={invitation.groomName}
          brideName={invitation.brideName}
          groomImageUrl={invitation.groomImageUrl}
          brideImageUrl={invitation.brideImageUrl}
          backgroundImageUrl={invitation.backgroundImageUrl}
          godparents={invitation.godparents}
        />

        <AlexandraRaduEvents
          eventDate={invitation.eventDate}
          ceremonyVenue={invitation.ceremonyVenue}
          ceremonyAddress={invitation.ceremonyAddress}
          ceremonyTime={invitation.ceremonyTime}
          ceremonyPhotoUrl={invitation.ceremonyPhotoUrl}
          ceremonyMapUrl={invitation.ceremonyMapUrl}
          receptionVenue={invitation.receptionVenue}
          receptionAddress={invitation.receptionAddress}
          receptionTime={invitation.receptionTime}
          receptionPhotoUrl={invitation.receptionPhotoUrl}
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
          <AlexandraRaduRsvp
            invitationRef={invitationRef || routeRef}
            menuOptions={invitation.menuOptions}
            rsvpDeadline={invitation.rsvpDeadline}
          />
        )}
      </main>
    </div>
  )
}
