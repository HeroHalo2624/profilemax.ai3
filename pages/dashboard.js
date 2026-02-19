// pages/dashboard.js - Progress Dashboard
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 13,
      }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 2 }}>{label}</p>
        <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--accent)' }}>
          Score: {payload[0].value}
        </p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const [history, setHistory] = useState([])
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('profilemax_history') || '[]')
    setHistory(stored)
    setHasData(stored.length > 0)
  }, [])

  const clearHistory = () => {
    if (confirm('Clear all score history?')) {
      localStorage.removeItem('profilemax_history')
      setHistory([])
      setHasData(false)
    }
  }

  // Format for chart
  const chartData = [...history].reverse().map((item, i) => ({
    name: new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: item.score,
    platform: item.platform,
  }))

  const best = history.length > 0 ? Math.max(...history.map(h => h.score)) : null
  const latest = history[0]?.score || null
  const avg = history.length > 0
    ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length)
    : null

  const improvement = history.length >= 2
    ? history[0].score - history[history.length - 1].score
    : null

  return (
    <div style={{ paddingTop: 40 }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>📈 Progress</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>
              Track your profile improvements over time.
            </p>
          </div>
          {hasData && (
            <button onClick={clearHistory} className="btn btn-ghost" style={{ fontSize: 13 }}>
              Clear History
            </button>
          )}
        </div>

        {!hasData ? (
          /* Empty state */
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>📊</div>
            <h2 style={{ fontSize: 22, marginBottom: 12 }}>No analysis history yet</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, maxWidth: 380, margin: '0 auto 24px' }}>
              Run your first profile analysis to start tracking improvements over time.
            </p>
            <a href="/" className="btn btn-primary">⚡ Analyze Your Profile</a>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid-3" style={{ marginBottom: 24 }}>
              {[
                { label: 'Latest Score', value: latest, icon: '⚡' },
                { label: 'Best Score', value: best, icon: '🏆' },
                { label: 'Average', value: avg, icon: '📊' },
              ].map(stat => (
                <div key={stat.label} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
                  <div style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 800,
                    fontSize: 40,
                    color: 'var(--accent)',
                    lineHeight: 1,
                    marginBottom: 4,
                  }}>
                    {stat.value ?? '—'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Syne, sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Improvement badge */}
            {improvement !== null && (
              <div style={{
                marginBottom: 24,
                padding: '14px 20px',
                borderRadius: 12,
                background: improvement > 0 ? 'rgba(0,200,100,0.1)' : improvement < 0 ? 'rgba(255,60,60,0.1)' : 'var(--bg-elevated)',
                border: `1px solid ${improvement > 0 ? 'rgba(0,200,100,0.3)' : improvement < 0 ? 'rgba(255,60,60,0.3)' : 'var(--border)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <span style={{ fontSize: 24 }}>
                  {improvement > 0 ? '📈' : improvement < 0 ? '📉' : '➡️'}
                </span>
                <div>
                  <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15 }}>
                    {improvement > 0
                      ? `+${improvement} point improvement from first analysis`
                      : improvement < 0
                        ? `${improvement} points since first analysis`
                        : 'No change yet — keep optimizing!'}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                    Based on {history.length} analysis session{history.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}

            {/* Line chart */}
            {chartData.length > 1 && (
              <div className="card" style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, marginBottom: 20 }}>Score Over Time</h2>
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#666', fontSize: 11 }}
                        axisLine={{ stroke: 'var(--border)' }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: '#666', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#00AEEF"
                        strokeWidth={2.5}
                        dot={{ fill: '#00AEEF', r: 4, strokeWidth: 0 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* History list */}
            <div className="card">
              <h2 style={{ fontSize: 18, marginBottom: 16 }}>Analysis History</h2>
              <div style={{ display: 'grid', gap: 8 }}>
                {history.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: 'var(--bg-elevated)',
                    borderRadius: 10,
                    fontSize: 14,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        border: '2px solid var(--accent)',
                        background: 'var(--accent-dim)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: 800,
                        fontSize: 14,
                        color: 'var(--accent)',
                        flexShrink: 0,
                      }}>
                        {item.score}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, marginBottom: 2 }}>{item.platform}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                          {item.photoCount} photo{item.photoCount !== 1 ? 's' : ''} · {item.bioLength} char bio
                        </p>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'right' }}>
                      {new Date(item.timestamp).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                      {i === 0 && (
                        <div style={{ marginTop: 3 }}>
                          <span className="tag tag-blue" style={{ fontSize: 10, padding: '2px 8px' }}>Latest</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
