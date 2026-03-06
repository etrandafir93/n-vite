import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './EventAnalytics.css'

export default function EventAnalytics() {
  const { reference } = useParams()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedRows, setExpandedRows] = useState(new Set())

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

  const toggleRow = (idx) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(idx)) {
        newSet.delete(idx)
      } else {
        newSet.add(idx)
      }
      return newSet
    })
  }

  // Combine visits and RSVP responses into a single activity feed
  const recentActivity = [
    ...(visits || []).map(v => ({
      type: 'visit',
      visitor: v.visitor,
      timestamp: v.timestamp
    })),
    ...(responses || []).map(r => ({
      type: r.attending ? 'accepted' : 'declined',
      guestName: r.guestName,
      timestamp: r.timestamp
    }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

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
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ea-stat-card__content">
              <div className="ea-stat-card__value">{stats.totalInvited}</div>
              <div className="ea-stat-card__label">Invitations Sent</div>
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
            <div className="ea-stat-card__icon ea-stat-card__icon--teal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="ea-stat-card__content">
              <div className="ea-stat-card__value">{stats.peopleAttending}</div>
              <div className="ea-stat-card__label">People Attending</div>
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
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.slice(0, 10).map((activity, idx) => (
                  <div key={idx} className="ea-activity-item">
                    <div className="ea-activity-icon">
                      {activity.type === 'visit' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                      {activity.type === 'accepted' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="#1a8a3a" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {activity.type === 'declined' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="#b03a2e" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
                    </div>
                    <div className="ea-activity-content">
                      <div className="ea-activity-text">
                        {activity.type === 'visit' && `${activity.visitor || 'Guest'} viewed invitation`}
                        {activity.type === 'accepted' && `${activity.guestName || 'Guest'} accepted`}
                        {activity.type === 'declined' && `${activity.guestName || 'Guest'} declined`}
                      </div>
                      <div className="ea-activity-time">{new Date(activity.timestamp).toLocaleString()}</div>
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
                    <th style={{ width: '40px' }}></th>
                    <th>Guest Name</th>
                    <th>Response</th>
                    <th>Plus One</th>
                    <th>Menu</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((response, idx) => (
                    <>
                      <tr
                        key={idx}
                        onClick={() => toggleRow(idx)}
                        style={{ cursor: 'pointer' }}
                        className={expandedRows.has(idx) ? 'ea-row-expanded' : ''}
                      >
                        <td>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            style={{
                              width: '16px',
                              height: '16px',
                              transition: 'transform 0.2s',
                              transform: expandedRows.has(idx) ? 'rotate(90deg)' : 'rotate(0deg)'
                            }}
                          >
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </td>
                        <td>{response.guestName || 'Anonymous'}</td>
                        <td>
                          <span className={`ea-badge ea-badge--${response.attending ? 'success' : 'danger'}`}>
                            {response.attending ? 'Accepted' : 'Declined'}
                          </span>
                        </td>
                        <td>{response.plusOne ? 'Yes' : 'No'}</td>
                        <td>{response.menuPreference || '—'}</td>
                        <td>{new Date(response.timestamp).toLocaleDateString()}</td>
                      </tr>
                      {expandedRows.has(idx) && (
                        <tr key={`${idx}-details`} className="ea-row-details">
                          <td colSpan="6">
                            <div className="ea-details-content">
                              <div className="ea-details-grid">
                                <div className="ea-detail-item">
                                  <span className="ea-detail-label">Plus One:</span>
                                  <span className="ea-detail-value">{response.plusOne ? 'Yes' : 'No'}</span>
                                </div>
                                {response.partnerName && (
                                  <div className="ea-detail-item">
                                    <span className="ea-detail-label">Partner Name:</span>
                                    <span className="ea-detail-value">{response.partnerName}</span>
                                  </div>
                                )}
                                {response.menuPreference && (
                                  <div className="ea-detail-item">
                                    <span className="ea-detail-label">Menu Preference:</span>
                                    <span className="ea-detail-value">{response.menuPreference}</span>
                                  </div>
                                )}
                                <div className="ea-detail-item">
                                  <span className="ea-detail-label">Children:</span>
                                  <span className="ea-detail-value">{response.children || 0}</span>
                                </div>
                                <div className="ea-detail-item">
                                  <span className="ea-detail-label">Transportation:</span>
                                  <span className="ea-detail-value">
                                    {response.transport === true ? 'Needs transport' : response.transport === false ? 'No transport needed' : 'Not specified'}
                                  </span>
                                </div>
                                {response.notes && (
                                  <div className="ea-detail-item">
                                    <span className="ea-detail-label">Message:</span>
                                    <span className="ea-detail-value">{response.notes}</span>
                                  </div>
                                )}
                                <div className="ea-detail-item">
                                  <span className="ea-detail-label">Submitted:</span>
                                  <span className="ea-detail-value">{new Date(response.timestamp).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
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
