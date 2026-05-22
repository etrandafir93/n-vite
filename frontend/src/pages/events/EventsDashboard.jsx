import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
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

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
)

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3l7 4v5c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V7l7-4z" />
    <path d="M9.5 12l1.5 1.5 3.5-3.5" />
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

function DeleteConfirmModal({ isOpen, onClose, onConfirm, eventName }) {
  if (!isOpen) return null

  return (
    <div className="ev-modal-overlay" onClick={onClose}>
      <div className="ev-modal" onClick={e => e.stopPropagation()}>
        <div className="ev-modal__header">
          <h3 className="ev-modal__title">Delete Invitation?</h3>
        </div>
        <div className="ev-modal__body">
          <p className="ev-modal__text">
            Are you sure you want to delete the invitation for <strong>{eventName}</strong>?
          </p>
          <p className="ev-modal__warning">
            This action cannot be undone. All data associated with this invitation will be permanently deleted.
          </p>
        </div>
        <div className="ev-modal__footer">
          <button onClick={onClose} className="ev-modal__btn ev-modal__btn--cancel">
            Cancel
          </button>
          <button onClick={onConfirm} className="ev-modal__btn ev-modal__btn--danger">
            Delete Invitation
          </button>
        </div>
      </div>
    </div>
  )
}

function AccessModal({ event, isOpen, onClose }) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState(null)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen || !event?.canManageAccess) return

    setLoading(true)
    setError('')
    fetch(`/api/events/${event.reference}/access`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load invitation access')
        return r.json()
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [isOpen, event])

  const grant = async () => {
    if (!email.trim()) return
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`/api/events/${event.reference}/access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), role: 'EDITOR' }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || 'Failed to grant access')
      }
      setData(await response.json())
      setEmail('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const revoke = async (targetEmail) => {
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`/api/events/${event.reference}/access?email=${encodeURIComponent(targetEmail)}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || 'Failed to revoke access')
      }
      setData(await response.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="ev-modal-overlay" onClick={onClose}>
      <div className="ev-modal ev-access-modal" onClick={e => e.stopPropagation()}>
        <div className="ev-modal__header">
          <h3 className="ev-modal__title">Invitation Access</h3>
        </div>
        <div className="ev-modal__body">
          <p className="ev-access-modal__owner">
            Owner: <strong>{data?.ownerEmail || 'legacy owner record'}</strong>
          </p>
          {loading && <p className="ev-access-modal__muted">Loading access list…</p>}
          {error && <p className="ev-access-modal__error">{error}</p>}
          {!loading && data && (
            <>
              <div className="ev-access-modal__form">
                <input
                  className="ev-access-modal__input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="partner@example.com"
                />
                <button onClick={grant} className="ev-modal__btn" disabled={saving}>
                  Grant editor access
                </button>
              </div>
              <div className="ev-access-modal__list">
                {data.grants.length === 0 && (
                  <p className="ev-access-modal__muted">No collaborator access granted yet.</p>
                )}
                {data.grants.map(grant => (
                  <div key={grant.email} className="ev-access-modal__row">
                    <div>
                      <strong>{grant.email}</strong>
                      <div className="ev-access-modal__meta">{grant.role}</div>
                    </div>
                    <button
                      onClick={() => revoke(grant.email)}
                      className="ev-modal__btn ev-modal__btn--danger"
                      disabled={saving}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="ev-modal__footer">
          <button onClick={onClose} className="ev-modal__btn ev-modal__btn--cancel">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function ShareMenu({ reference, groomName, brideName, onOpenChange }) {
  const [open, setOpen] = useState(false)

  const setOpenAndNotify = val => {
    setOpen(val)
    onOpenChange?.(val)
  }
  const [copied, setCopied] = useState(false)
  const wrapperRef = useRef(null)
  const url = `${window.location.origin}/invitations/${reference}`
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
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noreferrer"
            className="ev-share__item ev-share__item--messenger"
            onClick={() => setOpenAndNotify(false)}
          >
            <MessengerIcon /> Facebook
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

function EventCard({ event, onDelete, onEnable }) {
  const isPast = new Date(event.dateTime) < new Date()
  const isDraft = event.status === 'DRAFT'
  const [shareOpen, setShareOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [accessModalOpen, setAccessModalOpen] = useState(false)

  const handleDeleteClick = () => {
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    setDeleteModalOpen(false)
    fetch(`/api/events/${event.reference}`, { method: 'DELETE' })
      .then(() => onDelete(event.reference))
      .catch(console.error)
  }

  const handleEnable = () => {
    fetch(`/api/events/${event.reference}/enable`, {
      method: 'PATCH',
    })
      .then(() => {
        onEnable(event.reference)
      })
      .catch(console.error)
  }

  return (
    <>
      <div
        className={`ev-card${isPast ? ' ev-card--past' : ''}${isDraft ? ' ev-card--draft' : ''}`}
        style={shareOpen ? { zIndex: 10 } : undefined}
      >
        <Link to={`/invitations/${event.reference}`} className="ev-card__body">
          <div className="ev-card__header">
            <h3 className="ev-card__names">
              {event.groomName} &amp; {event.brideName}
            </h3>
            {isDraft && <span className="ev-badge ev-badge--draft">Draft</span>}
            {event.accessRole && event.accessRole !== 'OWNER' && (
              <span className="ev-badge ev-badge--shared">{event.accessRole}</span>
            )}
          </div>
          <p className="ev-card__date">{formatDate(event.dateTime)}</p>
          <span className={`ev-card__when${isPast ? ' ev-card__when--past' : ''}`}>
            {timeRelative(event.dateTime)}
          </span>
        </Link>
        <div className="ev-card__actions">
          <a
            href={`/invitations/${event.reference}`}
            target="_blank"
            rel="noreferrer"
            className="ev-btn"
            title="Preview invitation"
          >
            <EyeIcon />
            <span className="ev-btn__label">Preview</span>
          </a>
          {event.canEdit && (
            <Link
              to={`/events/builder?eventReference=${event.reference}`}
              className="ev-btn"
              title="Edit invitation"
            >
              <EditIcon />
              <span className="ev-btn__label">Edit</span>
            </Link>
          )}
          {!isDraft && (
            <Link
              to={`/events/${event.reference}/dashboard`}
              className="ev-btn ev-btn--info"
              title="View analytics"
            >
              <ChartIcon />
              <span className="ev-btn__label">Dashboard</span>
            </Link>
          )}
          {isDraft ? (
            <button onClick={handleEnable} className="ev-btn ev-btn--success" title="Enable invitation">
              <CheckCircleIcon />
              <span className="ev-btn__label">Enable</span>
            </button>
          ) : (
            <ShareMenu
              reference={event.reference}
              groomName={event.groomName}
              brideName={event.brideName}
              onOpenChange={setShareOpen}
            />
          )}
          {event.canManageAccess && (
            <button
              onClick={() => setAccessModalOpen(true)}
              className="ev-btn ev-btn--info"
              title="Manage access"
            >
              <ShieldIcon />
              <span className="ev-btn__label">Access</span>
            </button>
          )}
          {event.canDelete && (
            <button onClick={handleDeleteClick} className="ev-btn ev-btn--danger" title="Delete invitation">
              <TrashIcon />
              <span className="ev-btn__label">Delete</span>
            </button>
          )}
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        eventName={`${event.groomName} & ${event.brideName}`}
      />
      <AccessModal
        event={event}
        isOpen={accessModalOpen}
        onClose={() => setAccessModalOpen(false)}
      />
    </>
  )
}

function AdminInvitationRow({ event, onAccessUpdated }) {
  const ownerLabel = event.ownerEmail || 'Legacy owner'
  const editors = Array.isArray(event.editors) ? event.editors : []
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const grantEditor = async () => {
    if (!email.trim()) return
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`/api/events/${event.reference}/access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), role: 'EDITOR' }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to grant editor access')
      }
      onAccessUpdated(event.reference, payload)
      setEmail('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const revokeEditor = async (targetEmail) => {
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`/api/events/${event.reference}/access?email=${encodeURIComponent(targetEmail)}`, {
        method: 'DELETE',
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to remove editor access')
      }
      onAccessUpdated(event.reference, payload)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <tr>
      <td>
        <div className="ev-admin-table__primary">{event.groomName} &amp; {event.brideName}</div>
        <div className="ev-admin-table__secondary">{event.reference}</div>
      </td>
      <td>{formatDate(event.dateTime)}</td>
      <td>
        <div className="ev-admin-table__primary">{ownerLabel}</div>
        {!event.ownerEmail && (
          <div className="ev-admin-table__secondary">Needs email backfill</div>
        )}
      </td>
      <td>
        {editors.length > 0 ? (
          <div className="ev-admin-table__chips">
            {editors.map(editor => (
              <button
                key={editor}
                type="button"
                className="ev-admin-chip ev-admin-chip--removable"
                onClick={() => revokeEditor(editor)}
                disabled={saving}
                title={`Remove ${editor}`}
              >
                <span>{editor}</span>
                <span className="ev-admin-chip__remove">×</span>
              </button>
            ))}
          </div>
        ) : (
          <span className="ev-admin-table__secondary">No editors</span>
        )}
        {event.canManageAccess && (
          <div className="ev-admin-inline-access">
            <input
              className="ev-admin-inline-access__input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Add editor email"
            />
            <button
              type="button"
              className="ev-btn ev-btn--info"
              onClick={grantEditor}
              disabled={saving || !email.trim()}
            >
              <span className="ev-btn__label">Grant</span>
            </button>
          </div>
        )}
        {error && <div className="ev-admin-inline-access__error">{error}</div>}
      </td>
      <td>
        <span className={`ev-admin-pill ev-admin-pill--${(event.status || 'live').toLowerCase()}`}>
          {event.status || 'LIVE'}
        </span>
      </td>
      <td>
        <span className={`ev-admin-pill ev-admin-pill--access ev-admin-pill--${(event.accessRole || 'owner').toLowerCase()}`}>
          {event.accessRole || 'OWNER'}
        </span>
      </td>
      <td>
        <div className="ev-admin-table__actions">
          <a
            href={`/invitations/${event.reference}`}
            target="_blank"
            rel="noreferrer"
            className="ev-btn"
            title="Preview invitation"
          >
            <EyeIcon />
            <span className="ev-btn__label">Preview</span>
          </a>
          {event.canEdit && (
            <Link
              to={`/events/builder?eventReference=${event.reference}`}
              className="ev-btn"
              title="Edit invitation"
            >
              <EditIcon />
              <span className="ev-btn__label">Edit</span>
            </Link>
          )}
          {event.canManageAccess && (
            <span className="ev-admin-table__secondary">Inline access</span>
          )}
        </div>
      </td>
    </tr>
  )
}

function AdminPanel({ events, authState, onEventsChange }) {
  const [query, setQuery] = useState('')
  const [accessFilter, setAccessFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const normalizedQuery = query.trim().toLowerCase()
  const filteredEvents = events.filter(event => {
    const matchesQuery =
      !normalizedQuery
      || `${event.groomName} ${event.brideName} ${event.reference}`.toLowerCase().includes(normalizedQuery)
    const matchesAccess = accessFilter === 'ALL' || (event.accessRole || 'OWNER') === accessFilter
    const matchesStatus = statusFilter === 'ALL' || (event.status || 'LIVE') === statusFilter
    return matchesQuery && matchesAccess && matchesStatus
  })

  const totalCount = events.length
  const ownerCount = events.filter(event => (event.accessRole || 'OWNER') === 'OWNER').length
  const editorCount = events.filter(event => event.accessRole === 'EDITOR').length
  const draftCount = events.filter(event => event.status === 'DRAFT').length

  const handleAccessUpdated = (reference, payload) => {
    const nextEditors = Array.isArray(payload?.grants) ? payload.grants.map(grant => grant.email) : []
    onEventsChange(current =>
      current.map(event =>
        event.reference === reference
          ? { ...event, ownerEmail: payload?.ownerEmail || event.ownerEmail, editors: nextEditors }
          : event
      )
    )
  }

  return (
    <>
      <section className="ev-admin-hero">
        <div>
          <div className="ev-admin-hero__eyebrow">Admin Console</div>
          <h1 className="ev-admin-hero__title">Invitation Control Center</h1>
          <p className="ev-admin-hero__text">
            Signed in as {authState.email || 'admin user'}. Search invitations, filter by access level, and grant collaborator permissions without leaving the list.
          </p>
        </div>
        <Link to="/events" className="ev-admin-hero__link">
          Back to My Workspace
        </Link>
      </section>

      <section className="ev-admin-stats">
        <div className="ev-admin-stat">
          <div className="ev-admin-stat__label">Total Invitations</div>
          <div className="ev-admin-stat__value">{totalCount}</div>
        </div>
        <div className="ev-admin-stat">
          <div className="ev-admin-stat__label">Owner Access</div>
          <div className="ev-admin-stat__value">{ownerCount}</div>
        </div>
        <div className="ev-admin-stat">
          <div className="ev-admin-stat__label">Editor Access</div>
          <div className="ev-admin-stat__value">{editorCount}</div>
        </div>
        <div className="ev-admin-stat">
          <div className="ev-admin-stat__label">Drafts</div>
          <div className="ev-admin-stat__value">{draftCount}</div>
        </div>
      </section>

      <section className="ev-admin-toolbar">
        <input
          className="ev-admin-toolbar__search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by couple names or invitation reference"
        />
        <select
          className="ev-admin-toolbar__select"
          value={accessFilter}
          onChange={e => setAccessFilter(e.target.value)}
        >
          <option value="ALL">All access</option>
          <option value="OWNER">Owner</option>
          <option value="EDITOR">Editor</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select
          className="ev-admin-toolbar__select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All status</option>
          <option value="LIVE">Live</option>
          <option value="DRAFT">Draft</option>
        </select>
      </section>

      {filteredEvents.length === 0 ? (
        <div className="ev-empty ev-empty--admin">
          <p>No invitations match the current filters.</p>
        </div>
      ) : (
        <section className="ev-admin-table-wrap">
          <table className="ev-admin-table">
            <thead>
              <tr>
                <th>Invitation</th>
                <th>Date</th>
                <th>Owner</th>
                <th>Editors</th>
                <th>Status</th>
                <th>Access</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(event => (
                <AdminInvitationRow
                  key={event.reference}
                  event={event}
                  onAccessUpdated={handleAccessUpdated}
                />
              ))}
            </tbody>
          </table>
        </section>
      )}
    </>
  )
}

export default function EventsDashboard() {
  const location = useLocation()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [authState, setAuthState] = useState({ loading: true, authenticated: false, role: null, email: null })
  const isAdminPage = location.pathname === '/admin'

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(data => {
        setEvents(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        setAuthState({
          loading: false,
          authenticated: !!data.authenticated,
          role: data.role || null,
          email: data.email || null,
        })
      })
      .catch(() => setAuthState({ loading: false, authenticated: false, role: null, email: null }))
  }, [])

  const now = new Date()
  const upcoming = events
    .filter(e => new Date(e.dateTime) >= now)
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
  const past = events
    .filter(e => new Date(e.dateTime) < now)
    .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))

  const handleDelete = ref => setEvents(prev => prev.filter(e => e.reference !== ref))

  const handleEnable = ref => setEvents(prev =>
    prev.map(e => e.reference === ref ? { ...e, status: 'LIVE' } : e)
  )

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
            {!isAdminPage && (
              <Link to="/events/builder" className="ev-new-btn">
                + New Invitation
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="ev-main container">
        {isAdminPage ? (
          <AdminPanel events={events} authState={authState} onEventsChange={setEvents} />
        ) : (
          <>

        {events.length === 0 && (
          <div className="ev-empty">
            <p>You haven&apos;t created any invitations yet.</p>
            {!isAdminPage && (
              <Link to="/events/builder" className="ev-cta-btn">
                Create your first invitation
              </Link>
            )}
          </div>
        )}

        {upcoming.length > 0 && (
          <section className="ev-section">
            <h2 className="ev-section__heading">Upcoming</h2>
            <div className="ev-list">
              {upcoming.map(e => (
                <EventCard key={e.reference} event={e} onDelete={handleDelete} onEnable={handleEnable} />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className="ev-section">
            <h2 className="ev-section__heading ev-section__heading--muted">Past Events</h2>
            <div className="ev-list">
              {past.map(e => (
                <EventCard key={e.reference} event={e} onDelete={handleDelete} onEnable={handleEnable} />
              ))}
            </div>
          </section>
        )}
          </>
        )}
      </main>

      {!isAdminPage && (
        <Link to="/events/builder" className="ev-fab" title="Create new invitation">
          +
        </Link>
      )}

    </div>
  )
}
