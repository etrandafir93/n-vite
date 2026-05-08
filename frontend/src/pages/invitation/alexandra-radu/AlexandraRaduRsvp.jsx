import { useState } from 'react'

const DEFAULT_MENU_OPTIONS = ['Carne', 'Pește', 'Vegetarian']

const MENU_RO = {
  'Meat': 'Carne',
  'Fish': 'Pește',
  'Vegetarian': 'Vegetarian',
  'Vegan': 'Vegan',
  'Chicken': 'Pui',
  'Beef': 'Vită',
  'Pork': 'Porc',
}
const menuLabel = (option) => MENU_RO[option] || option

export default function AlexandraRaduRsvp({ invitationRef, menuOptions, rsvpDeadline }) {
  const menuChoices = menuOptions?.length ? menuOptions : DEFAULT_MENU_OPTIONS
  const [guestName, setGuestName] = useState('')
  const [attending, setAttending] = useState(null)
  const [partnerName, setPartnerName] = useState('')
  const [plusOne, setPlusOne] = useState(null)
  const [menu, setMenu] = useState(menuChoices[0] || '')
  const [children, setChildren] = useState(null)
  const [childCount, setChildCount] = useState('')
  const [allergies, setAllergies] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const nextErrors = {}
    if (!guestName.trim()) nextErrors.guestName = 'Numele tău este obligatoriu'
    if (!attending) nextErrors.attending = 'Te rugăm să confirmi prezența'
    if (attending === 'yes' && plusOne === 'yes' && !partnerName.trim()) {
      nextErrors.partnerName = 'Numele partenerului este obligatoriu'
    }
    if (attending === 'yes' && !menu) nextErrors.menu = 'Selectează preferința la meniu'
    return nextErrors
  }

  const resetForm = () => {
    setGuestName('')
    setAttending(null)
    setPartnerName('')
    setPlusOne(null)
    setMenu(menuChoices[0] || '')
    setChildren(null)
    setChildCount('')
    setAllergies('')
    setNotes('')
  }

  const handleSubmit = async (answer) => {
    const nextErrors = validate()
    setErrors(nextErrors)
    setSubmitError(null)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/invitations/${invitationRef}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: guestName.trim(),
          answer,
          partnerName: plusOne === 'yes' ? partnerName.trim() : null,
          menuPreference: attending === 'yes' ? menu : null,
          children: children === 'yes' ? Number(childCount || 0) || 0 : 0,
          transport: null,
          allergies: allergies.trim() || null,
          notes: notes.trim() || null,
        }),
      })
      if (!response.ok) throw new Error('Failed to submit RSVP')
      resetForm()
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      setSubmitError('Nu am putut salva răspunsul acum. Te rugăm să încerci din nou.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section id="confirmare" className="cel-section cel-rsvp">
        <div className="cel-section__inner">
          <div className="cel-rsvp__success">
            <div className="cel-rsvp__success-icon">✓</div>
            <h2 className="cel-rsvp__success-title">Mulțumim pentru confirmare!</h2>
            <p className="cel-rsvp__success-message">
              {attending === 'yes'
                ? 'Ne bucurăm că vei fi alături de noi în această zi specială!'
                : 'Ne pare rău că nu poți participa. Îți mulțumim că ne-ai anunțat!'}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="confirmare" className="cel-section cel-rsvp">
      <div className="cel-section__inner">
        <h2 className="cel-section__title">Confirmare</h2>
        {rsvpDeadline && (
          <p className="cel-rsvp__deadline">Te rugăm să confirmi până la {rsvpDeadline}</p>
        )}

        <div className="cel-form">
          <div className={`cel-field ${errors.guestName ? 'cel-field--error' : ''}`}>
            <label className="cel-label">Numele tău *</label>
            <input
              className="cel-input"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Introdu numele complet"
            />
          </div>

          <div className={`cel-field ${errors.attending ? 'cel-field--error' : ''}`}>
            <label className="cel-label">Vei participa? *</label>
            <div className="cel-toggle-row">
              <button
                type="button"
                className={`cel-toggle-btn ${attending === 'yes' ? 'active' : ''}`}
                onClick={() => setAttending('yes')}
              >
                Da, confirm!
              </button>
              <button
                type="button"
                className={`cel-toggle-btn ${attending === 'no' ? 'active' : ''}`}
                onClick={() => setAttending('no')}
              >
                Nu pot participa
              </button>
            </div>
          </div>

          {attending === 'yes' && (
            <>
              <div className={`cel-field ${errors.partnerName ? 'cel-field--error' : ''}`}>
                <label className="cel-label">Vii însoțit/ă?</label>
                <div className="cel-toggle-row">
                  <button
                    type="button"
                    className={`cel-toggle-btn ${plusOne === 'yes' ? 'active' : ''}`}
                    onClick={() => setPlusOne('yes')}
                  >
                    Da
                  </button>
                  <button
                    type="button"
                    className={`cel-toggle-btn ${plusOne === 'no' ? 'active' : ''}`}
                    onClick={() => setPlusOne('no')}
                  >
                    Nu
                  </button>
                </div>
                {plusOne === 'yes' && (
                  <input
                    className="cel-input cel-input--inline"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Numele partenerului"
                  />
                )}
              </div>

              <div className={`cel-field ${errors.menu ? 'cel-field--error' : ''}`}>
                <label className="cel-label">Preferință meniu *</label>
                <div className="cel-toggle-row">
                  {menuChoices.map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      className={`cel-toggle-btn ${menu === choice ? 'active' : ''}`}
                      onClick={() => setMenu(choice)}
                    >
                      {menuLabel(choice)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cel-field">
                <label className="cel-label">Copii?</label>
                <div className="cel-toggle-row">
                  <button
                    type="button"
                    className={`cel-toggle-btn ${children === 'yes' ? 'active' : ''}`}
                    onClick={() => setChildren('yes')}
                  >
                    Da
                  </button>
                  <button
                    type="button"
                    className={`cel-toggle-btn ${children === 'no' ? 'active' : ''}`}
                    onClick={() => setChildren('no')}
                  >
                    Nu
                  </button>
                </div>
                {children === 'yes' && (
                  <input
                    className="cel-input cel-input--inline"
                    type="number"
                    min={1}
                    max={10}
                    value={childCount}
                    onChange={(e) => setChildCount(e.target.value)}
                    placeholder="Câți copii?"
                    style={{ width: '120px', marginTop: '0.75rem' }}
                  />
                )}
              </div>

              <div className="cel-field">
                <label className="cel-label">Alergii alimentare</label>
                <input
                  className="cel-input"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="Precizează eventualele alergii"
                />
              </div>
            </>
          )}

          <div className="cel-field">
            <label className="cel-label">Mesaj (opțional)</label>
            <textarea
              className="cel-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={attending === 'no' ? 'Mesaj pentru miri' : 'Un mesaj pentru miri sau întrebări'}
              rows={4}
            />
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="cel-errors">
              <p>Te rugăm să completezi:</p>
              <ul>
                {Object.values(errors).map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            </div>
          )}
          {submitError && (
            <div className="cel-errors" role="alert">
              <p>{submitError}</p>
            </div>
          )}

          {attending && (
            <div className="cel-actions">
              {attending === 'yes' && (
                <button
                  type="button"
                  className="cel-btn cel-btn--primary"
                  disabled={submitting}
                  onClick={() => handleSubmit('ACCEPTED')}
                >
                  {submitting ? 'Se trimite...' : 'Confirmă participarea'}
                </button>
              )}
              {attending === 'no' && (
                <button
                  type="button"
                  className="cel-btn cel-btn--secondary"
                  disabled={submitting}
                  onClick={() => handleSubmit('DECLINED')}
                >
                  {submitting ? 'Se trimite...' : 'Trimite răspuns'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
