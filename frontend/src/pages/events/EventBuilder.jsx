import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import './EventBuilder.css'

const EMPTY_FORM = {
  groomName: '',
  brideName: '',
  eventDateTime: '',
  backgroundImageUrl: '',
  groomParents: '',
  brideParents: '',
  godparents: '',
  ceremonyVenue: '',
  ceremonyAddress: '',
  ceremonyTime: '',
  ceremonyPhotoUrl: '',
  ceremonyMapUrl: '',
  receptionVenue: '',
  receptionAddress: '',
  receptionTime: '',
  receptionPhotoUrl: '',
  receptionMapUrl: '',
  rsvpDeadline: '',
}

function toLocalDateTimeInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${mo}-${day}T${h}:${mi}`
}

function Field({ label, hint, required, children }) {
  return (
    <div className="eb-field">
      <label className="eb-label">
        {label}
        {required && <span className="eb-required">*</span>}
      </label>
      {hint && <p className="eb-hint">{hint}</p>}
      {children}
    </div>
  )
}

function Input({ value, onChange, type = 'text', placeholder, required }) {
  return (
    <input
      className="eb-input"
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
    />
  )
}

function Section({ title, subtitle, children }) {
  return (
    <div className="eb-section">
      <div className="eb-section__head">
        <h2 className="eb-section__title">{title}</h2>
        {subtitle && <p className="eb-section__subtitle">{subtitle}</p>}
      </div>
      <div className="eb-section__body">{children}</div>
    </div>
  )
}

function ImageUpload({ value, onChange, label }) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/v2/upload/image', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      onChange(data.url)
    } catch (err) {
      console.error('Upload error:', err)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="eb-image-upload">
      {value && (
        <div className="eb-image-preview">
          <img src={value} alt="Preview" />
          <button
            type="button"
            className="eb-image-remove"
            onClick={() => onChange('')}
            title="Remove image"
          >
            ×
          </button>
        </div>
      )}
      <label className="eb-upload-btn">
        {uploading ? 'Uploading...' : value ? 'Change Image' : `Upload ${label}`}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          style={{ display: 'none' }}
        />
      </label>
      {value && (
        <p className="eb-image-url">
          <small>{value}</small>
        </p>
      )}
    </div>
  )
}

export default function EventBuilder() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const eventReference = searchParams.get('eventReference')
  const isEdit = !!eventReference

  useEffect(() => {
    if (!eventReference) return
    setLoading(true)
    fetch(`/api/v2/events/${eventReference}/form`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load')
        return r.json()
      })
      .then(data => {
        setForm({
          groomName: data.groomName ?? '',
          brideName: data.brideName ?? '',
          eventDateTime: toLocalDateTimeInput(data.eventDateTime),
          backgroundImageUrl: data.backgroundImageUrl ?? '',
          groomParents: data.groomParents ?? '',
          brideParents: data.brideParents ?? '',
          godparents: data.godparents ?? '',
          ceremonyVenue: data.ceremonyVenue ?? '',
          ceremonyAddress: data.ceremonyAddress ?? '',
          ceremonyTime: data.ceremonyTime ?? '',
          ceremonyPhotoUrl: data.ceremonyPhotoUrl ?? '',
          ceremonyMapUrl: data.ceremonyMapUrl ?? '',
          receptionVenue: data.receptionVenue ?? '',
          receptionAddress: data.receptionAddress ?? '',
          receptionTime: data.receptionTime ?? '',
          receptionPhotoUrl: data.receptionPhotoUrl ?? '',
          receptionMapUrl: data.receptionMapUrl ?? '',
          rsvpDeadline: data.rsvpDeadline ?? '',
        })
      })
      .catch(() => setError('Could not load invitation data.'))
      .finally(() => setLoading(false))
  }, [eventReference])

  const set = field => value => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      ...form,
      eventDateTime: form.eventDateTime ? new Date(form.eventDateTime).toISOString() : null,
    }

    const url = isEdit ? `/api/v2/events/${eventReference}` : '/api/v2/events'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Save failed')
      navigate('/events')
    } catch {
      setError('Failed to save. Please check the form and try again.')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="eb-page">
        <div className="eb-loading">Loading invitation…</div>
      </div>
    )
  }

  return (
    <div className="eb-page">
      <header className="eb-header">
        <div className="eb-header__inner container">
          <Link to="/events" className="eb-back">← My Invitations</Link>
          <Link to="/" className="eb-logo">n<span>·</span>vite</Link>
          <div className="eb-header__right" />
        </div>
      </header>

      <main className="eb-main container">
        {error && <div className="eb-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>

          <Section title="The Couple" subtitle="Names as they will appear on the invitation">
            <div className="eb-grid-2">
              <Field label="Groom's Name" required>
                <Input value={form.groomName} onChange={set('groomName')} placeholder="e.g. John Doe" required />
              </Field>
              <Field label="Bride's Name" required>
                <Input value={form.brideName} onChange={set('brideName')} placeholder="e.g. Jane Smith" required />
              </Field>
            </div>
          </Section>

          <Section title="Family & Godparents" subtitle="Optional — displayed on the invitation">
            <div className="eb-grid-2">
              <Field label="Groom's Parents" hint="e.g. Michael & Susan Doe">
                <Input value={form.groomParents} onChange={set('groomParents')} placeholder="Parents of the groom" />
              </Field>
              <Field label="Bride's Parents" hint="e.g. Robert & Elena Smith">
                <Input value={form.brideParents} onChange={set('brideParents')} placeholder="Parents of the bride" />
              </Field>
            </div>
            <Field label="Godparents (Nași)" hint="e.g. George & Maria Johnson">
              <Input value={form.godparents} onChange={set('godparents')} placeholder="Godparents / Nași" />
            </Field>
          </Section>

          <Section title="Date & Visuals" subtitle="When is the event, and how it will look">
            <Field label="Event Date & Time" required>
              <Input type="datetime-local" value={form.eventDateTime} onChange={set('eventDateTime')} required />
            </Field>
            <Field label="Background Image" hint="Hero image for the invitation">
              <ImageUpload value={form.backgroundImageUrl} onChange={set('backgroundImageUrl')} label="Background" />
            </Field>
          </Section>

          <Section title="Ceremony" subtitle="Church or ceremony venue details">
            <div className="eb-grid-2">
              <Field label="Venue Name" required>
                <Input value={form.ceremonyVenue} onChange={set('ceremonyVenue')} placeholder="e.g. St. Mary's Cathedral" required />
              </Field>
              <Field label="Address">
                <Input value={form.ceremonyAddress} onChange={set('ceremonyAddress')} placeholder="e.g. 123 Church Street" />
              </Field>
              <Field label="Time">
                <Input type="time" value={form.ceremonyTime} onChange={set('ceremonyTime')} />
              </Field>
            </div>
            <Field label="Ceremony Photo" hint="Image of the ceremony venue">
              <ImageUpload value={form.ceremonyPhotoUrl} onChange={set('ceremonyPhotoUrl')} label="Photo" />
            </Field>
            <Field label="Map Embed URL" hint='Google Maps embed URL — from Google Maps share → Embed a map → copy src="..."'>
              <Input value={form.ceremonyMapUrl} onChange={set('ceremonyMapUrl')} placeholder="https://www.google.com/maps/embed?..." />
            </Field>
          </Section>

          <Section title="Reception" subtitle="Restaurant or reception venue details">
            <div className="eb-grid-2">
              <Field label="Venue Name" required>
                <Input value={form.receptionVenue} onChange={set('receptionVenue')} placeholder="e.g. The Grand Ballroom" required />
              </Field>
              <Field label="Address">
                <Input value={form.receptionAddress} onChange={set('receptionAddress')} placeholder="e.g. 456 Elm Avenue" />
              </Field>
              <Field label="Time">
                <Input type="time" value={form.receptionTime} onChange={set('receptionTime')} />
              </Field>
            </div>
            <Field label="Reception Photo" hint="Image of the reception venue">
              <ImageUpload value={form.receptionPhotoUrl} onChange={set('receptionPhotoUrl')} label="Photo" />
            </Field>
            <Field label="Map Embed URL" hint='Google Maps embed URL — from Google Maps share → Embed a map → copy src="..."'>
              <Input value={form.receptionMapUrl} onChange={set('receptionMapUrl')} placeholder="https://www.google.com/maps/embed?..." />
            </Field>
          </Section>

          <Section title="RSVP" subtitle="When should guests respond by?">
            <Field label="RSVP Deadline">
              <Input type="date" value={form.rsvpDeadline} onChange={set('rsvpDeadline')} />
            </Field>
          </Section>

          <div className="eb-actions">
            <Link to="/events" className="eb-btn eb-btn--ghost">Cancel</Link>
            <button type="submit" className="eb-btn eb-btn--primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Invitation'}
            </button>
          </div>

        </form>
      </main>
    </div>
  )
}
