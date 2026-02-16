import { useState } from 'react'
import './Pricing.css'

const plans = [
  {
    id: 'personal',
    name: 'Personal Link',
    tagline: 'For intimate gatherings',
    price: '$0.99',
    unit: 'per guest',
    description: 'Each guest receives a personalised link with their name on the invitation.',
    highlight: false,
    features: [
      'Unique link per guest',
      "Guest's name on invitation",
      'RSVP tracking dashboard',
      'Real-time notifications',
      'Venue map',
      'Edit details anytime',
    ],
    cta: 'Get Started',
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    tagline: 'Most popular',
    price: '$89',
    unit: 'flat price',
    description: 'One link for all your guests — unlimited sharing, unlimited RSVPs.',
    highlight: true,
    features: [
      'Single shareable link',
      'Unlimited guests',
      'RSVP tracking dashboard',
      'Real-time notifications',
      'Venue map',
      'Edit details anytime',
      'Partner name collection',
      'Priority support',
    ],
    cta: 'Get Started',
  },
]

const comparisonRows = [
  { label: 'Guest limit', personal: 'Pay per guest', unlimited: 'Unlimited' },
  { label: 'Personalised link per guest', personal: true, unlimited: false },
  { label: 'Single shareable link', personal: false, unlimited: true },
  { label: 'RSVP tracking', personal: true, unlimited: true },
  { label: 'Real-time notifications', personal: true, unlimited: true },
  { label: 'Venue map', personal: true, unlimited: true },
  { label: 'Edit anytime', personal: true, unlimited: true },
  { label: 'Partner name collection', personal: false, unlimited: true },
]

function Check() {
  return (
    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  )
}

function Cross() {
  return (
    <svg className="cross-icon" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  )
}

export default function Pricing() {
  const [showComparison, setShowComparison] = useState(false)

  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <div className="pricing__header">
          <span className="section-label">Pricing</span>
          <h2 className="pricing__title">Simple, transparent pricing</h2>
          <p className="pricing__subtitle">
            No subscriptions. No hidden fees. Pay once and your invitation is live as long as you need it.
          </p>
        </div>

        <div className="pricing__cards">
          {plans.map((plan) => (
            <div
              className={`pricing-card ${plan.highlight ? 'pricing-card--highlight' : ''}`}
              key={plan.id}
            >
              {plan.highlight && (
                <div className="pricing-card__badge">Most Popular</div>
              )}
              <div className="pricing-card__header">
                <h3 className="pricing-card__name">{plan.name}</h3>
                <p className="pricing-card__tagline">{plan.tagline}</p>
                <div className="pricing-card__price">
                  <span className="pricing-card__amount">{plan.price}</span>
                  <span className="pricing-card__unit">{plan.unit}</span>
                </div>
                <p className="pricing-card__desc">{plan.description}</p>
              </div>

              <ul className="pricing-card__features">
                {plan.features.map((f) => (
                  <li key={f}>
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`pricing-card__cta ${plan.highlight ? 'pricing-card__cta--highlight' : ''}`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <button
          className="pricing__compare-toggle"
          onClick={() => setShowComparison(o => !o)}
        >
          {showComparison ? 'Hide comparison' : 'Compare plans in detail'}
          <svg viewBox="0 0 20 20" fill="currentColor" className={showComparison ? 'rotate' : ''}>
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {showComparison && (
          <div className="pricing__table-wrap">
            <table className="pricing__table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Personal Link</th>
                  <th className="pricing__table-highlight">Unlimited</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td>
                      {typeof row.personal === 'boolean'
                        ? row.personal ? <Check /> : <Cross />
                        : row.personal}
                    </td>
                    <td className="pricing__table-highlight">
                      {typeof row.unlimited === 'boolean'
                        ? row.unlimited ? <Check /> : <Cross />
                        : row.unlimited}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
