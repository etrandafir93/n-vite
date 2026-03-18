import { useState, useEffect, useRef } from 'react'
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
  eventType: 'both',
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
  menuOptions: [],
  theme: 'classic',
  status: 'DRAFT',
}

function detectEventType(data) {
  if (data.ceremonyVenue && data.receptionVenue) return 'both'
  if (data.ceremonyVenue) return 'ceremony'
  if (data.receptionVenue) return 'reception'
  return 'both'
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

function validate(form) {
  const errors = {}
  const required = {
    groomName: "Groom's name",
    brideName: "Bride's name",
    eventDateTime: 'Event date & time',
    backgroundImageUrl: 'Background image',
    ...(form.eventType !== 'reception' && { ceremonyVenue: 'Ceremony venue name' }),
    ...(form.eventType !== 'ceremony'  && { receptionVenue: 'Reception venue name' }),
  }
  for (const [field, label] of Object.entries(required)) {
    if (!form[field] || (typeof form[field] === 'string' && !form[field].trim())) {
      errors[field] = `${label} is required`
    }
  }
  return errors
}

function useMapsApiKey() {
  const [apiKey, setApiKey] = useState(null)
  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then(data => setApiKey(data.mapsApiKey || ''))
      .catch(() => setApiKey(''))
  }, [])
  return apiKey
}

function useMapsScript(apiKey) {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if (!apiKey) return
    if (window.google?.maps?.places) { setLoaded(true); return }
    if (document.getElementById('gmaps-script')) {
      const poll = setInterval(() => { if (window.google?.maps?.places) { setLoaded(true); clearInterval(poll) } }, 100)
      return () => clearInterval(poll)
    }
    const s = document.createElement('script')
    s.id = 'gmaps-script'
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    s.async = true
    s.onload = () => setLoaded(true)
    document.head.appendChild(s)
  }, [apiKey])
  return loaded
}

function PlacesInput({ value, onChange, onPlaceSelect, placeholder, invalid, mapsLoaded }) {
  const inputRef = useRef(null)
  const acRef = useRef(null)

  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.value = value || ''
    }
  }, [value])

  useEffect(() => {
    if (!mapsLoaded || !inputRef.current || acRef.current) return
    const ac = new window.google.maps.places.Autocomplete(inputRef.current, { types: ['establishment', 'geocode'] })
    ac.addListener('place_changed', () => {
      const place = ac.getPlace()
      onChange(place.formatted_address || inputRef.current.value)
      onPlaceSelect?.(place)
    })
    acRef.current = ac
  }, [mapsLoaded])

  return (
    <input
      ref={inputRef}
      className={`eb-input${invalid ? ' eb-input--invalid' : ''}`}
      type="text"
      defaultValue={value}
      onInput={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}

const DEFAULT_MENU_OPTIONS = ['Meat', 'Fish', 'Vegetarian']

function MenuOptionsEditor({ options, onChange }) {
  const [input, setInput] = useState('')

  const add = () => {
    const val = input.trim()
    const base = options.length > 0 ? options : DEFAULT_MENU_OPTIONS
    if (!val || base.includes(val)) return
    onChange([...base, val])
    setInput('')
  }

  const remove = (opt) => onChange(options.filter(o => o !== opt))

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); add() }
  }

  const displayed = options.length > 0 ? options : DEFAULT_MENU_OPTIONS

  return (
    <div className="eb-field">
      <label className="eb-label">Menu Options</label>
      <p className="eb-hint">
        Options guests can pick from. Defaults: {DEFAULT_MENU_OPTIONS.join(', ')}.
      </p>
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '.75rem' }}>
        {displayed.map(opt => (
          <span key={opt} style={{
            display: 'inline-flex', alignItems: 'center', gap: '.3rem',
            padding: '.25rem .65rem', background: '#f0ece3', border: '1px solid #ddd4c0',
            borderRadius: '20px', fontSize: '.82rem', color: '#444'
          }}>
            {opt}
            {options.length > 0 && (
              <button
                type="button"
                onClick={() => remove(opt)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#999', fontSize: '.85rem', lineHeight: 1 }}
              >×</button>
            )}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '.5rem' }}>
        <input
          className="eb-input"
          type="text"
          placeholder="Add option (e.g. Vegan)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1 }}
        />
        <button type="button" className="eb-btn eb-btn--secondary" onClick={add} style={{ whiteSpace: 'nowrap' }}>
          + Add
        </button>
      </div>
    </div>
  )
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
  const mapsApiKey = useMapsApiKey()
  const mapsLoaded = useMapsScript(mapsApiKey)

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
          eventType: detectEventType(data),
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
          menuOptions: data.menuOptions ?? [],
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

  const onCeremonyPlace = (place) => {
    const url = place.url || (place.formatted_address ? `https://maps.google.com/maps?q=${encodeURIComponent(place.formatted_address)}` : null)
    if (url) set('ceremonyMapUrl')(url)
  }

  const onReceptionPlace = (place) => {
    const url = place.url || (place.formatted_address ? `https://maps.google.com/maps?q=${encodeURIComponent(place.formatted_address)}` : null)
    if (url) set('receptionMapUrl')(url)
  }

  const preparePayload = (status) => {
    const noCeremony = form.eventType === 'reception'
    const noReception = form.eventType === 'ceremony'
    return {
      ...form,
      eventDateTime: form.eventDateTime ? new Date(form.eventDateTime).toISOString() : null,
      ceremonyVenue:    noCeremony ? null : form.ceremonyVenue,
      ceremonyAddress:  noCeremony ? null : form.ceremonyAddress,
      ceremonyTime:     noCeremony ? null : form.ceremonyTime,
      ceremonyPhotoUrl: noCeremony ? null : form.ceremonyPhotoUrl,
      ceremonyMapUrl:   noCeremony ? null : form.ceremonyMapUrl,
      receptionVenue:    noReception ? null : form.receptionVenue,
      receptionAddress:  noReception ? null : form.receptionAddress,
      receptionTime:     noReception ? null : form.receptionTime,
      receptionPhotoUrl: noReception ? null : form.receptionPhotoUrl,
      receptionMapUrl:   noReception ? null : form.receptionMapUrl,
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

          <Section title="Choose a Theme" subtitle="Pick the look and feel of your invitation first">
            <div className="eb-theme-grid">
              {[
                { value: 'classic',  label: 'Classic',  mood: 'Elegant & timeless',    colors: ['#faf8f4', '#e8dfc8', '#c9a96e', '#1c1c1c'] },
                { value: 'romantic', label: 'Romantic', mood: 'Soft & intimate',        colors: ['#fff5f7', '#fce0e8', '#d4788a', '#4a1a28'] },
                { value: 'modern',   label: 'Modern',   mood: 'Bold & contemporary',   colors: ['#0d1b2a', '#1a2e42', '#f5a623', '#ffffff'] },
                { value: 'natural',  label: 'Natural',  mood: 'Warm & organic',         colors: ['#f5f2ec', '#e8dfc8', '#7a9e7e', '#3d2c1e'] },
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
                  <div className="eb-theme-swatch">
                    {theme.colors.map(c => <span key={c} style={{ background: c }} />)}
                  </div>
                  <div className="eb-theme-info">
                    <span className="eb-theme-label">{theme.label}</span>
                    <span className="eb-theme-mood">{theme.mood}</span>
                  </div>
                  <a
                    href={isEdit ? `/invitations/${eventReference}/${theme.value}` : `/invitations/joe-and-jane/${theme.value}`}
                    target="_blank"
                    rel="noreferrer"
                    className="eb-theme-demo"
                    onClick={e => e.stopPropagation()}
                  >
                    {isEdit ? 'Preview ↗' : 'View Demo ↗'}
                  </a>
                </label>
              ))}
            </div>
          </Section>

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

          <Section title="Event Type" subtitle="Which parts of the day are guests invited to?">
            <div className="eb-theme-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {[
                { value: 'both',      label: 'Ceremony + Reception', icon: '⛪ + 🥂' },
                { value: 'ceremony',  label: 'Ceremony Only',        icon: '⛪' },
                { value: 'reception', label: 'Reception Only',       icon: '🥂' },
              ].map(opt => (
                <label key={opt.value} className={`eb-theme-option${form.eventType === opt.value ? ' eb-theme-option--selected' : ''}`} style={{ padding: '1rem 1.1rem', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    name="eventType"
                    value={opt.value}
                    checked={form.eventType === opt.value}
                    onChange={e => set('eventType')(e.target.value)}
                    className="eb-theme-radio"
                  />
                  <span style={{ fontSize: '1.2rem' }}>{opt.icon}</span>
                  <span className="eb-theme-label">{opt.label}</span>
                </label>
              ))}
            </div>
          </Section>

          {form.eventType !== 'reception' && (
          <Section title="Ceremony" subtitle="Church or ceremony venue details">
            <div className="eb-grid-2">
              <Field label="Venue Name" required error={fieldErrors.ceremonyVenue}>
                <Input value={form.ceremonyVenue} onChange={set('ceremonyVenue')} placeholder="e.g. St. Mary's Cathedral" required invalid={!!fieldErrors.ceremonyVenue} />
              </Field>
              <Field label="Address" hint={mapsLoaded ? 'Search and select a location' : undefined}>
                <PlacesInput
                  value={form.ceremonyAddress}
                  onChange={set('ceremonyAddress')}
                  onPlaceSelect={onCeremonyPlace}
                  placeholder="e.g. 123 Church Street"
                  mapsLoaded={mapsLoaded}
                />
              </Field>
              <Field label="Date & Time">
                <Input type="datetime-local" value={form.ceremonyTime} onChange={set('ceremonyTime')} />
              </Field>
            </div>
            <Field label="Ceremony Photo" hint="Image of the ceremony venue">
              <ImageUpload value={form.ceremonyPhotoUrl} onChange={set('ceremonyPhotoUrl')} label="Photo" />
            </Field>
            <Field label="Map Link" hint="Auto-filled when you select an address above. Guests tap this to open in Google Maps.">
              <Input value={form.ceremonyMapUrl} onChange={set('ceremonyMapUrl')} placeholder="https://maps.google.com/..." />
            </Field>
          </Section>
          )}

          {form.eventType !== 'ceremony' && (
          <Section title="Reception" subtitle="Restaurant or reception venue details">
            <div className="eb-grid-2">
              <Field label="Venue Name" required error={fieldErrors.receptionVenue}>
                <Input value={form.receptionVenue} onChange={set('receptionVenue')} placeholder="e.g. The Grand Ballroom" required invalid={!!fieldErrors.receptionVenue} />
              </Field>
              <Field label="Address" hint={mapsLoaded ? 'Search and select a location' : undefined}>
                <PlacesInput
                  value={form.receptionAddress}
                  onChange={set('receptionAddress')}
                  onPlaceSelect={onReceptionPlace}
                  placeholder="e.g. 456 Elm Avenue"
                  mapsLoaded={mapsLoaded}
                />
              </Field>
              <Field label="Date & Time">
                <Input type="datetime-local" value={form.receptionTime} onChange={set('receptionTime')} />
              </Field>
            </div>
            <Field label="Reception Photo" hint="Image of the reception venue">
              <ImageUpload value={form.receptionPhotoUrl} onChange={set('receptionPhotoUrl')} label="Photo" />
            </Field>
            <Field label="Map Link" hint="Auto-filled when you select an address above. Guests tap this to open in Google Maps.">
              <Input value={form.receptionMapUrl} onChange={set('receptionMapUrl')} placeholder="https://maps.google.com/..." />
            </Field>
          </Section>
          )}

          <Section title="RSVP" subtitle="When should guests respond by?">
            <Field label="RSVP Deadline">
              <Input type="date" value={form.rsvpDeadline} onChange={set('rsvpDeadline')} />
            </Field>
            <MenuOptionsEditor
              options={form.menuOptions}
              onChange={set('menuOptions')}
            />
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
