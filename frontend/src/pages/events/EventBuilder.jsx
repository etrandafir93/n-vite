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
  theme: 'classic',
  status: 'DRAFT',
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

function Field({ label, hint, required, error, children }) {
  return (
    <div className="eb-field">
      <label className="eb-label">
        {label}
        {required && <span className="eb-required">*</span>}
      </label>
      {hint && <p className="eb-hint">{hint}</p>}
      {children}
      {error && <p className="eb-field-error">{error}</p>}
    </div>
  )
}

function Input({ value, onChange, type = 'text', placeholder, required, invalid }) {
  return (
    <input
      className={`eb-input${invalid ? ' eb-input--invalid' : ''}`}
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

function ImageUpload({ value, onChange, label, required }) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type on frontend
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PNG, JPG, JPEG, or BMP image.')
      e.target.value = '' // Reset the file input
      return
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      alert('Image size must be less than 10MB.')
      e.target.value = '' // Reset the file input
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || 'Upload failed')
      }
      const data = await res.json()
      onChange(data.url)
    } catch (err) {
      console.error('Upload error:', err)
      alert(err.message || 'Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
      e.target.value = '' // Reset the file input
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
        {uploading ? 'Uploading...' : value ? 'Change Image' : `Upload ${label}${required ? ' *' : ''}`}
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/bmp"
          onChange={handleFileChange}
          disabled={uploading}
          required={required && !value}
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

const REQUIRED_FIELDS = {
  groomName: "Groom's name",
  brideName: "Bride's name",
  eventDateTime: 'Event date & time',
  backgroundImageUrl: 'Background image',
  ceremonyVenue: 'Ceremony venue name',
  receptionVenue: 'Reception venue name',
}

function validate(form) {
  const errors = {}
  for (const [field, label] of Object.entries(REQUIRED_FIELDS)) {
    if (!form[field] || (typeof form[field] === 'string' && !form[field].trim())) {
      errors[field] = `${label} is required`
    }
  }
  return errors
}

export default function EventBuilder() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
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
    fetch(`/api/events/${eventReference}/form`)
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
          theme: data.theme ?? 'classic',
          status: data.status ?? 'LIVE',
        })
      })
      .catch(() => setError('Could not load invitation data.'))
      .finally(() => setLoading(false))
  }, [eventReference])

  const set = field => value => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: null }))
  }

  const preparePayload = (status) => {
    return {
      ...form,
      eventDateTime: form.eventDateTime ? new Date(form.eventDateTime).toISOString() : null,
      status,
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errors = validate(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setError(`Please fill in the required fields: ${Object.values(errors).map(e => e.replace(' is required', '')).join(', ')}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setSaving(true)
    setError(null)

    try {
      const payload = preparePayload('LIVE')

      if (isEdit) {
        // Update existing event
        const updateRes = await fetch(`/api/events/${eventReference}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!updateRes.ok) throw new Error('Failed to update invitation')
      } else {
        // Create new event as LIVE
        const createRes = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!createRes.ok) throw new Error('Failed to create invitation')
      }

      navigate('/events')
    } catch (err) {
      console.error('Save error:', err)
      setError('Failed to save. Please check the form and try again.')
      setSaving(false)
    }
  }

  const handlePreview = async () => {
    const errors = validate(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setError(`Please fill in the required fields: ${Object.values(errors).map(e => e.replace(' is required', '')).join(', ')}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setSaving(true)
    setError(null)

    const payload = preparePayload('DRAFT')
    const url = isEdit ? `/api/events/${eventReference}` : '/api/events'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const errorText = await res.text()
        console.error('Preview error:', errorText)
        throw new Error('Preview failed')
      }
      const eventReference = await res.text()
      console.log('Preview response:', eventReference)
      // Open preview in new window
      window.open(`/invitations/${eventReference}`, '_blank')
      setSaving(false)
    } catch (err) {
      console.error('Preview error:', err)
      setError('Failed to create preview. Please check the form and try again.')
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
              <Field label="Groom's Name" required error={fieldErrors.groomName}>
                <Input value={form.groomName} onChange={set('groomName')} placeholder="e.g. John Doe" required invalid={!!fieldErrors.groomName} />
              </Field>
              <Field label="Bride's Name" required error={fieldErrors.brideName}>
                <Input value={form.brideName} onChange={set('brideName')} placeholder="e.g. Jane Smith" required invalid={!!fieldErrors.brideName} />
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
            <Field label="Event Date & Time" required error={fieldErrors.eventDateTime}>
              <Input type="datetime-local" value={form.eventDateTime} onChange={set('eventDateTime')} required invalid={!!fieldErrors.eventDateTime} />
            </Field>
            <Field label="Background Image" required hint="Hero image for the invitation" error={fieldErrors.backgroundImageUrl}>
              <ImageUpload value={form.backgroundImageUrl} onChange={set('backgroundImageUrl')} label="Background" required />
            </Field>
          </Section>

          <Section title="Ceremony" subtitle="Church or ceremony venue details">
            <div className="eb-grid-2">
              <Field label="Venue Name" required error={fieldErrors.ceremonyVenue}>
                <Input value={form.ceremonyVenue} onChange={set('ceremonyVenue')} placeholder="e.g. St. Mary's Cathedral" required invalid={!!fieldErrors.ceremonyVenue} />
              </Field>
              <Field label="Address">
                <Input value={form.ceremonyAddress} onChange={set('ceremonyAddress')} placeholder="e.g. 123 Church Street" />
              </Field>
              <Field label="Date & Time">
                <Input type="datetime-local" value={form.ceremonyTime} onChange={set('ceremonyTime')} />
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
              <Field label="Venue Name" required error={fieldErrors.receptionVenue}>
                <Input value={form.receptionVenue} onChange={set('receptionVenue')} placeholder="e.g. The Grand Ballroom" required invalid={!!fieldErrors.receptionVenue} />
              </Field>
              <Field label="Address">
                <Input value={form.receptionAddress} onChange={set('receptionAddress')} placeholder="e.g. 456 Elm Avenue" />
              </Field>
              <Field label="Date & Time">
                <Input type="datetime-local" value={form.receptionTime} onChange={set('receptionTime')} />
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

          <Section title="Theme" subtitle="Choose the default invitation theme">
            <div className="eb-theme-grid">
              {[
                { value: 'classic', label: 'Classic' },
                { value: 'romantic', label: 'Romantic' },
                { value: 'modern', label: 'Modern' },
                { value: 'natural', label: 'Natural' },
              ].map(theme => (
                <label key={theme.value} className={`eb-theme-option${form.theme === theme.value ? ' eb-theme-option--selected' : ''}`}>
                  <input
                    type="radio"
                    name="theme"
                    value={theme.value}
                    checked={form.theme === theme.value}
                    onChange={e => set('theme')(e.target.value)}
                    className="eb-theme-radio"
                  />
                  <span className="eb-theme-label">{theme.label}</span>
                  <a
                    href={`/invitations/joe-and-jane?theme=${theme.value}`}
                    target="_blank"
                    rel="noreferrer"
                    className="eb-theme-demo"
                    onClick={e => e.stopPropagation()}
                  >
                    View Demo
                  </a>
                </label>
              ))}
            </div>
          </Section>

          <div className="eb-actions">
            <Link to="/events" className="eb-btn eb-btn--ghost">Cancel</Link>
            <button type="button" onClick={handlePreview} className="eb-btn eb-btn--secondary" disabled={saving}>
              Preview
            </button>
            <button type="submit" className="eb-btn eb-btn--primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Invitation'}
            </button>
          </div>

        </form>
      </main>
    </div>
  )
}
