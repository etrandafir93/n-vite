import { useTranslation } from 'react-i18next'

function toGCalDate(isoString) {
  // "2024-09-15T16:00:00Z" → "20240915T160000Z"
  return isoString.replace(/[-:]/g, '').replace(/\.\d+/, '')
}

function buildGoogleCalendarUrl(invitation) {
  const { brideName, groomName, eventDate, ceremonyAddress, ceremonyVenue, receptionAddress } = invitation

  const title = `${brideName} & ${groomName} Wedding`

  const start = toGCalDate(eventDate)
  // Assume 6-hour event if no end time is known
  const startMs = new Date(eventDate).getTime()
  const endMs = startMs + 6 * 60 * 60 * 1000
  const end = toGCalDate(new Date(endMs).toISOString())

  const location = [ceremonyVenue, ceremonyAddress, receptionAddress].filter(Boolean).join(', ')

  const details = [
    ceremonyVenue && `Ceremony: ${ceremonyVenue}`,
    ceremonyAddress && ceremonyAddress,
    receptionAddress && `Reception: ${receptionAddress}`,
  ]
    .filter(Boolean)
    .join('\n')

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${start}/${end}`,
    ...(location && { location }),
    ...(details && { details }),
    sf: 'true',
    output: 'xml',
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export default function AddToCalendarButton({ invitation }) {
  const { t } = useTranslation()

  if (!invitation?.eventDate) return null

  const url = buildGoogleCalendarUrl(invitation)

  return (
    <div
      style={{
        padding: '2rem 1.2rem',
        display: 'flex',
        justifyContent: 'center',
        background: '#f7f6f4',
        borderTop: '1px solid #e8e3dc',
      }}
    >
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          background: '#fff',
          border: '1.5px solid #d4c4b0',
          borderRadius: '999px',
          color: '#2f2a24',
          fontWeight: 600,
          fontSize: '0.95rem',
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          transition: 'box-shadow 0.15s, border-color 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.13)'
          e.currentTarget.style.borderColor = '#b98f5f'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)'
          e.currentTarget.style.borderColor = '#d4c4b0'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {t('guest_invitation.add_to_calendar')}
      </a>
    </div>
  )
}
