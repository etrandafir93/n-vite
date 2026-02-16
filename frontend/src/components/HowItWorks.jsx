import './HowItWorks.css'

const steps = [
  {
    number: '01',
    title: 'Pick a template',
    description:
      'Browse our curated collection of wedding and event templates. Find the design that matches your style.',
  },
  {
    number: '02',
    title: 'Personalise your details',
    description:
      'Add your names, date, venue and a personal message. Upload a background photo or choose from our gallery.',
  },
  {
    number: '03',
    title: 'Share your link',
    description:
      'Get a unique invitation link instantly. Share it via WhatsApp, email or any messaging app — no printing required.',
  },
  {
    number: '04',
    title: 'Collect RSVPs',
    description:
      'Guests confirm their attendance with one tap. You get notified immediately and can track responses in real time.',
  },
  {
    number: '05',
    title: 'Manage your guest list',
    description:
      'View accepted and declined responses, see attendance numbers and update event details at any time.',
  },
]

export default function HowItWorks() {
  return (
    <section className="hiw" id="how-it-works">
      <div className="container">
        <div className="hiw__header">
          <span className="section-label">Simple process</span>
          <h2 className="hiw__title">Ready in under 2 minutes</h2>
          <p className="hiw__subtitle">
            No design skills needed. No app to install. Just a beautiful invitation your guests will love.
          </p>
        </div>

        <div className="hiw__steps">
          {steps.map((step, i) => (
            <div className="hiw__step" key={step.number}>
              <div className="hiw__step-number">{step.number}</div>
              <div className="hiw__step-content">
                <h3 className="hiw__step-title">{step.title}</h3>
                <p className="hiw__step-desc">{step.description}</p>
              </div>
              {i < steps.length - 1 && <div className="hiw__step-connector" />}
            </div>
          ))}
        </div>

        <div className="hiw__cta">
          <a href="#pricing" className="btn btn--primary">Start Creating — It&apos;s Free</a>
        </div>
      </div>
    </section>
  )
}
