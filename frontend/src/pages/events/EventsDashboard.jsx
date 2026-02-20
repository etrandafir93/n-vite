import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './EventsDashboard.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function timeRelative(iso) {
  const diff = new Date(iso).getTime() - Date.now()
  const absDays = Math.floor(Math.abs(diff) / 86400000)

  if (absDays === 0) return 'today'

  const months = Math.floor(absDays / 30)
  const days = absDays % 30

  let label
  if (months > 0 && days > 0) {
    label = `${months} month${months > 1 ? 's' : ''} and ${days} day${days > 1 ? 's' : ''}`
  } else if (months > 0) {
    label = `${months} month${months > 1 ? 's' : ''}`
  } else {
    label = `${absDays} day${absDays > 1 ? 's' : ''}`
  }

  return diff > 0 ? `in ${label}` : `${label} ago`
}

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
)

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
)

const MessengerIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z" />
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

function ShareMenu({ reference, groomName, brideName, onOpenChange }) {
  const [open, setOpen] = useState(false)

  const setOpenAndNotify = val => {
    setOpen(val)
    onOpenChange?.(val)
  }
  const [copied, setCopied] = useState(false)
  const wrapperRef = useRef(null)
  const url = `${window.location.origin}/v2/invitations/${reference}`
  const text = `You're invited to ${groomName} & ${brideName}'s wedding! 💍`

  useEffect(() => {
    if (!open) return
    const handler = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpenAndNotify(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const copyLink = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})
    setOpenAndNotify(false)
  }

  return (
    <div className="ev-share" ref={wrapperRef}>
      <button
        onClick={() => setOpenAndNotify(!open)}
        className={`ev-btn${open ? ' ev-btn--active' : ''}`}
        title="Share invitation"
      >
        <ShareIcon />
        <span className="ev-btn__label">Share</span>
      </button>
      {open && (
        <div className="ev-share__menu">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`}
            target="_blank"
            rel="noreferrer"
            className="ev-share__item ev-share__item--whatsapp"
            onClick={() => setOpenAndNotify(false)}
          >
            <WhatsAppIcon /> WhatsApp
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`}
            target="_blank"
            rel="noreferrer"
            className="ev-share__item ev-share__item--telegram"
            onClick={() => setOpenAndNotify(false)}
          >
            <TelegramIcon /> Telegram
          </a>
          <a
            href={`fb-messenger://share/?link=${encodeURIComponent(url)}`}
            className="ev-share__item ev-share__item--messenger"
            onClick={() => setOpenAndNotify(false)}
          >
            <MessengerIcon /> Messenger
          </a>
          <button
            className="ev-share__item ev-share__item--instagram"
            onClick={copyLink}
          >
            <InstagramIcon /> Instagram
          </button>
          <button className="ev-share__item ev-share__item--copy" onClick={copyLink}>
            <CopyIcon /> {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      )}
    </div>
  )
}

function EventCard({ event, onDelete }) {
  const isPast = new Date(event.dateTime) < new Date()
  const isDraft = event.status === 'DRAFT'
  const [shareOpen, setShareOpen] = useState(false)

  const handleDelete = () => {
    if (!confirm(`Delete invitation for ${event.groomName} & ${event.brideName}?`)) return
    fetch(`/api/events/${event.reference}`, { method: 'DELETE' })
      .then(() => onDelete(event.reference))
      .catch(console.error)
  }

  return (
    <div
      className={`ev-card${isPast ? ' ev-card--past' : ''}${isDraft ? ' ev-card--draft' : ''}`}
      style={shareOpen ? { zIndex: 10 } : undefined}
    >
      <div className="ev-card__body">
        <div className="ev-card__header">
          <h3 className="ev-card__names">
            {event.groomName} &amp; {event.brideName}
          </h3>
          {isDraft && <span className="ev-badge ev-badge--draft">Draft</span>}
        </div>
        <p className="ev-card__date">{formatDate(event.dateTime)}</p>
        <span className={`ev-card__when${isPast ? ' ev-card__when--past' : ''}`}>
          {timeRelative(event.dateTime)}
        </span>
      </div>
      <div className="ev-card__actions">
        <Link to={`/invitations/${event.reference}`} className="ev-btn" title="Preview invitation">
          <EyeIcon />
          <span className="ev-btn__label">Preview</span>
        </Link>
        <Link
          to={`/events/builder?eventReference=${event.reference}`}
          className="ev-btn"
          title="Edit invitation"
        >
          <EditIcon />
          <span className="ev-btn__label">Edit</span>
        </Link>
        {!isDraft && (
          <ShareMenu
            reference={event.reference}
            groomName={event.groomName}
            brideName={event.brideName}
            onOpenChange={setShareOpen}
          />
        )}
        <button onClick={handleDelete} className="ev-btn ev-btn--danger" title="Delete invitation">
          <TrashIcon />
          <span className="ev-btn__label">Delete</span>
        </button>
      </div>
    </div>
  )
}

export default function EventsDashboard() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(data => {
        setEvents(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const now = new Date()
  const upcoming = events
    .filter(e => new Date(e.dateTime) >= now)
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
  const past = events
    .filter(e => new Date(e.dateTime) < now)
    .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))

  const handleDelete = ref => setEvents(prev => prev.filter(e => e.reference !== ref))

  if (loading) {
    return (
      <div className="ev-page">
        <div className="ev-loading">Loading your invitations…</div>
      </div>
    )
  }

  return (
    <div className="ev-page">
      <header className="ev-header">
        <div className="ev-header__inner container">
          <div className="ev-header__left">
            <a href="/logout" className="ev-logout-btn">
              Log out
            </a>
          </div>
          <Link to="/" className="ev-logo">
            n<span>·</span>vite
          </Link>
          <div className="ev-header__right">
            <Link to="/events/builder" className="ev-new-btn">
              + New Invitation
            </Link>
          </div>
        </div>
      </header>

      <main className="ev-main container">
        {events.length === 0 && (
          <div className="ev-empty">
            <p>You haven&apos;t created any invitations yet.</p>
            <Link to="/events/builder" className="ev-cta-btn">
              Create your first invitation
            </Link>
          </div>
        )}

        {upcoming.length > 0 && (
          <section className="ev-section">
            <h2 className="ev-section__heading">Upcoming</h2>
            <div className="ev-list">
              {upcoming.map(e => (
                <EventCard key={e.reference} event={e} onDelete={handleDelete} />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className="ev-section">
            <h2 className="ev-section__heading ev-section__heading--muted">Past Events</h2>
            <div className="ev-list">
              {past.map(e => (
                <EventCard key={e.reference} event={e} onDelete={handleDelete} />
              ))}
            </div>
          </section>
        )}
      </main>

    </div>
  )
}
