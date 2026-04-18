import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CelestialSidebar from './celestial/CelestialSidebar'
import CelestialHero from './celestial/CelestialHero'
import CelestialCouple from './celestial/CelestialCouple'
import CelestialEvents from './celestial/CelestialEvents'
import CelestialRsvp from './celestial/CelestialRsvp'
import LanguageSelector from '../../components/LanguageSelector'
import './Celestial.css'

export default function CelestialInvitation({ invitationRef, invitationData }) {
  const { ref: routeRef } = useParams()
  const { t } = useTranslation()
  const [invitation, setInvitation] = useState(invitationData || null)
  const [loading, setLoading] = useState(!invitationData)

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

  return (
    <div className="cel-page">
      <div className="cel-lang-selector-wrapper">
        <LanguageSelector />
      </div>

      <CelestialSidebar
        groomName={invitation.groomName}
        brideName={invitation.brideName}
        eventDate={invitation.eventDate}
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
