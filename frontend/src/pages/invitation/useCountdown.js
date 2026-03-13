import { useState, useEffect } from 'react'

export function useCountdown(targetDate) {
  const calculate = () => {
    if (!targetDate) return null
    const diff = new Date(targetDate) - new Date()
    if (diff <= 0) return null
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    }
  }

  const [timeLeft, setTimeLeft] = useState(calculate)

  useEffect(() => {
    if (!targetDate) return
    const timer = setInterval(() => setTimeLeft(calculate()), 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return timeLeft
}
