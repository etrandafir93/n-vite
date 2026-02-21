import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './EventAnalytics.css'

export default function EventAnalytics() {
  const { reference } = useParams()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`/api/events/${reference}/dashboard`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load analytics')
        return r.json()
      })
      .then(data => {
        setAnalytics(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [reference])

  if (loading) {
    return (
      <div className="ea-page">
        <div className="ea-loading">Loading analytics…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="ea-page">
        <div className="ea-error">
          <p>Failed to load analytics</p>
          <Link to="/events" className="ea-back-link">← Back to Events</Link>
        </div>
      </div>
    )
  }

  const { event, stats, responses, visits } = analytics

  // Calculate percentages for pie chart
  const total = stats.totalInvited || 1
  const acceptedPct = ((stats.accepted / total) * 100).toFixed(1)
  const declinedPct = ((stats.declined / total) * 100).toFixed(1)
  const pendingPct = ((stats.pending / total) * 100).toFixed(1)

  return (
    <div className="ea-page">
      <header className="ea-header">
        <div className="ea-header__inner container">
          <Link to="/events" className="ea-back">← Back to Events</Link>
          <Link to="/" className="ea-logo">n<span>·</span>vite</Link>
          <div className="ea-header__right" />
        </div>
      </header>

      <main className="ea-main container">
        <div className="ea-title-section">
          <h1 className="ea-title">{event.groomName} &amp; {event.brideName}</h1>
          <p className="ea-subtitle">Event Analytics Dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="ea-stats-grid">
          <div className="ea-stat-card">
            <div className="ea-stat-card__icon ea-stat-card__icon--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="ea-stat-card__content">
              <div className="ea-stat-card__value">{stats.totalInvited}</div>
              <div className="ea-stat-card__label">Total Invited</div>
            </div>
          </div>

          <div className="ea-stat-card">
            <div className="ea-stat-card__icon ea-stat-card__icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="ea-stat-card__content">
              <div className="ea-stat-card__value">{stats.accepted}</div>
              <div className="ea-stat-card__label">Accepted</div>
            </div>
          </div>

          <div className="ea-stat-card">
            <div className="ea-stat-card__icon ea-stat-card__icon--red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <div className="ea-stat-card__content">
              <div className="ea-stat-card__value">{stats.declined}</div>
              <div className="ea-stat-card__label">Declined</div>
            </div>
          </div>

          <div className="ea-stat-card">
            <div className="ea-stat-card__icon ea-stat-card__icon--gray">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="ea-stat-card__content">
              <div className="ea-stat-card__value">{stats.pending}</div>
              <div className="ea-stat-card__label">Pending</div>
            </div>
          </div>

          <div className="ea-stat-card">
            <div className="ea-stat-card__icon ea-stat-card__icon--purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div className="ea-stat-card__content">
              <div className="ea-stat-card__value">{stats.totalViews}</div>
              <div className="ea-stat-card__label">Total Views</div>
            </div>
          </div>

          <div className="ea-stat-card">
            <div className="ea-stat-card__icon ea-stat-card__icon--orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="ea-stat-card__content">
              <div className="ea-stat-card__value">{((stats.accepted / total) * 100).toFixed(0)}%</div>
              <div className="ea-stat-card__label">Response Rate</div>
            </div>
          </div>
        </div>

        {/* Chart and Details */}
        <div className="ea-content-grid">
          {/* Pie Chart */}
          <div className="ea-card">
            <h2 className="ea-card__title">Response Distribution</h2>
            <div className="ea-chart-container">
              <svg viewBox="0 0 200 200" className="ea-pie-chart">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="40" />

                {/* Accepted slice */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#1a8a3a"
                  strokeWidth="40"
                  strokeDasharray={`${acceptedPct * 5.03} 502`}
                  strokeDashoffset="0"
                  transform="rotate(-90 100 100)"
                />

                {/* Declined slice */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#b03a2e"
                  strokeWidth="40"
                  strokeDasharray={`${declinedPct * 5.03} 502`}
                  strokeDashoffset={-acceptedPct * 5.03}
                  transform="rotate(-90 100 100)"
                />

                {/* Pending slice */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="40"
                  strokeDasharray={`${pendingPct * 5.03} 502`}
                  strokeDashoffset={-(acceptedPct * 5.03 + declinedPct * 5.03)}
                  transform="rotate(-90 100 100)"
                />
              </svg>

              <div className="ea-chart-legend">
                <div className="ea-chart-legend-item">
                  <span className="ea-chart-legend-dot" style={{background: '#1a8a3a'}}></span>
                  <span className="ea-chart-legend-label">Accepted ({stats.accepted})</span>
                </div>
                <div className="ea-chart-legend-item">
                  <span className="ea-chart-legend-dot" style={{background: '#b03a2e'}}></span>
                  <span className="ea-chart-legend-label">Declined ({stats.declined})</span>
                </div>
                <div className="ea-chart-legend-item">
                  <span className="ea-chart-legend-dot" style={{background: '#9ca3af'}}></span>
                  <span className="ea-chart-legend-label">Pending ({stats.pending})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="ea-card">
            <h2 className="ea-card__title">Recent Activity</h2>
            <div className="ea-activity-list">
              {visits && visits.length > 0 ? (
                visits.slice(0, 10).map((visit, idx) => (
                  <div key={idx} className="ea-activity-item">
                    <div className="ea-activity-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    <div className="ea-activity-content">
                      <div className="ea-activity-text">Invitation viewed</div>
                      <div className="ea-activity-time">{new Date(visit.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="ea-empty-state">No activity yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Responses Table */}
        {responses && responses.length > 0 && (
          <div className="ea-card">
            <h2 className="ea-card__title">Guest Responses</h2>
            <div className="ea-table-container">
              <table className="ea-table">
                <thead>
                  <tr>
                    <th>Guest Name</th>
                    <th>Response</th>
                    <th>Menu</th>
                    <th>Plus One</th>
                    <th>Children</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((response, idx) => (
                    <tr key={idx}>
                      <td>{response.guestName || 'Anonymous'}</td>
                      <td>
                        <span className={`ea-badge ea-badge--${response.attending ? 'success' : 'danger'}`}>
                          {response.attending ? 'Accepted' : 'Declined'}
                        </span>
                      </td>
                      <td>{response.menuPreference || '-'}</td>
                      <td>{response.plusOne ? 'Yes' : 'No'}</td>
                      <td>{response.children || '-'}</td>
                      <td>{new Date(response.timestamp).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
