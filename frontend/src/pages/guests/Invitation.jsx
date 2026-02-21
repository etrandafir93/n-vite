import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
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

export default function Invitation() {
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
        Loading…
      </div>
    )
  }

  if (!invitation) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Invitation not found
      </div>
    )
  }

  // Theme fallback logic:
  // 1. Use theme from URL if present
  // 2. Otherwise use theme from invitation data
  // 3. Otherwise default to 'classic'
  const selectedTheme = urlTheme || invitation.theme || 'classic'
  const ThemeComponent = THEME_COMPONENTS[selectedTheme] || THEME_COMPONENTS.classic

  return <ThemeComponent invitationRef={ref} invitationData={invitation} />
}
