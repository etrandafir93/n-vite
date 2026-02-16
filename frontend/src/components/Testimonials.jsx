import './Testimonials.css'

const reviews = [
  {
    name: 'Sophie & Daniel',
    event: 'Wedding · June 2025',
    avatar: 'SD',
    rating: 5,
    text: "We used nvite for our wedding and it was absolutely perfect. Setting up the invitation took less than 10 minutes and the RSVPs came in right away. Our guests loved the clean design and easy RSVP process.",
  },
  {
    name: 'Charlotte B.',
    event: 'Birthday Party · April 2025',
    avatar: 'CB',
    rating: 5,
    text: "I was skeptical at first but nvite completely blew me away. The invitation looked so elegant and the real-time tracking meant I always knew exactly how many people were coming. Highly recommend!",
  },
  {
    name: 'Michael & Laura',
    event: 'Wedding · March 2025',
    avatar: 'ML',
    rating: 5,
    text: "The venue map feature saved us so many headaches — not a single guest got lost! Being able to update details after sending was a lifesaver when we had to change the reception time.",
  },
]

function Stars({ count }) {
  return (
    <div className="stars">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="testimonials__header">
          <span className="section-label">What couples say</span>
          <h2 className="testimonials__title">Loved by thousands of couples</h2>

          <div className="testimonials__rating-summary">
            <Stars count={5} />
            <span className="testimonials__score">5.0</span>
            <span className="testimonials__count">— based on 500+ reviews</span>
          </div>
        </div>

        <div className="testimonials__grid">
          {reviews.map((review) => (
            <div className="testimonial-card" key={review.name}>
              <Stars count={review.rating} />
              <p className="testimonial-card__text">&ldquo;{review.text}&rdquo;</p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar">{review.avatar}</div>
                <div>
                  <strong>{review.name}</strong>
                  <span>{review.event}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
