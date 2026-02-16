import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg" />

      <div className="hero__inner container">
        <div className="hero__content">
          <span className="section-label">Digital Invitations</span>
          <h1 className="hero__title">
            Your event starts <em>here</em>
          </h1>
          <p className="hero__subtitle">
            Create stunning digital invitations for your wedding or special event.
            Share instantly, collect RSVPs in real time — all in one place.
          </p>
          <div className="hero__actions">
            <a href="#pricing" className="btn btn--primary">Create Your Invitation</a>
            <a href="#how-it-works" className="btn btn--ghost">See How It Works</a>
          </div>
          <div className="hero__stats">
            <div className="hero__stat">
              <strong>5 000+</strong>
              <span>Invitations sent</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <strong>98%</strong>
              <span>Guest satisfaction</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <strong>2 min</strong>
              <span>To go live</span>
            </div>
          </div>
        </div>

        <div className="hero__visual">
          <div className="phone-mockup">
            <div className="phone-mockup__frame">
              <div className="phone-mockup__notch" />
              <div className="phone-mockup__screen">
                <div className="invite-preview">
                  <div className="invite-preview__header">
                    <p className="invite-preview__label">You are cordially invited to the wedding of</p>
                    <div className="invite-preview__ornament">✦</div>
                  </div>
                  <div className="invite-preview__center">
                    <h3 className="invite-preview__names">
                      Emma<br />
                      <span className="invite-preview__amp">&amp;</span><br />
                      James
                    </h3>
                  </div>
                  <div className="invite-preview__footer">
                    <div className="invite-preview__divider-line" />
                    <p className="invite-preview__date">14 · June · 2025</p>
                    <p className="invite-preview__location">The Grand Hall, London</p>
                    <div className="invite-preview__rsvp">
                      <button className="invite-preview__btn invite-preview__btn--accept">Accept</button>
                      <button className="invite-preview__btn invite-preview__btn--decline">Decline</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="phone-mockup__glow" />
          </div>

          <div className="hero__badge hero__badge--rsvp">
            <span className="hero__badge-icon">✓</span>
            <div>
              <strong>New RSVP</strong>
              <p>Sophie accepted!</p>
            </div>
          </div>

          <div className="hero__badge hero__badge--guests">
            <span className="hero__badge-icon">👥</span>
            <div>
              <strong>42 guests</strong>
              <p>confirmed so far</p>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__scroll-hint">
        <span />
      </div>
    </section>
  )
}
