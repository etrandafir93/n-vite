import { useEffect, useState } from 'react'

function useCountdown(isoDate) {
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    if (!isoDate) return

    const target = new Date(isoDate).getTime()

    const tick = () => {
      const diff = target - Date.now()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [isoDate])

  return timeLeft
}

export default function AlexandraRaduHero({ groomName, brideName, eventDate, backgroundImageUrl, ceremonyVenue, receptionVenue }) {
  const countdown = useCountdown(eventDate)

  return (
    <section id="acasa" className="cel-hero cel-hero--ar">
      <div className="cel-hero__overlay" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
        <div className="cel-hero__gradient"></div>
      </div>
      <div className="cel-hero__content cel-hero__content--ar">
        <h1 className="cel-hero__names">
          {groomName} <span className="cel-hero__amp">&</span> {brideName}
        </h1>
        {countdown && (
          <div className="ar-countdown">
            {[
              { value: countdown.days, label: 'zile' },
              { value: countdown.hours, label: 'ore' },
              { value: countdown.minutes, label: 'minute' },
              { value: countdown.seconds, label: 'secunde' },
            ].map(({ value, label }) => (
              <div key={label} className="ar-countdown__unit">
                <span className="ar-countdown__num">{String(value).padStart(2, '0')}</span>
                <span className="ar-countdown__label">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
