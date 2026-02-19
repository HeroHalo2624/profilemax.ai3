// components/PhotoResults.js - Photo analysis display
import { useState } from 'react'

const SCORE_LABELS = {
  lighting: 'Lighting',
  clarity: 'Clarity',
  expression: 'Expression',
  style: 'Style',
}

export default function PhotoResults({ photos, previews }) {
  const [expanded, setExpanded] = useState(null)

  // Sort: primary first, then by overall score
  const sorted = [...photos].sort((a, b) => {
    if (a.recommendation === 'Primary Photo') return -1
    if (b.recommendation === 'Primary Photo') return 1
    return b.overall - a.overall
  })

  return (
    <div className="card fade-up" style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 20, marginBottom: 8 }}>📸 Photo Analysis</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
        Photos ranked best to worst. Click any photo to see detailed breakdown.
      </p>

      <div style={{ display: 'grid', gap: 12 }}>
        {sorted.map((photo, i) => {
          const preview = previews[photo.index]
          const isExpanded = expanded === photo.index
          const recColor = {
            'Primary Photo': '#00c864',
            'Keep': '#00AEEF',
            'Remove': '#ff4444',
          }[photo.recommendation] || '#888'

          return (
            <div
              key={photo.index}
              style={{
                background: 'var(--bg-elevated)',
                borderRadius: 12,
                border: `1px solid ${isExpanded ? recColor + '44' : 'var(--border)'}`,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
              onClick={() => setExpanded(isExpanded ? null : photo.index)}
            >
              {/* Photo row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}>
                {/* Rank */}
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 800,
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>

                {/* Thumbnail */}
                {preview && (
                  <img
                    src={preview.preview}
                    alt={`Photo ${photo.index + 1}`}
                    style={{
                      width: 52,
                      height: 52,
                      objectFit: 'cover',
                      borderRadius: 8,
                      flexShrink: 0,
                    }}
                  />
                )}

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 700,
                      fontSize: 14,
                    }}>
                      Photo {photo.index + 1}
                    </span>
                    <span className="tag" style={{
                      background: recColor + '1a',
                      color: recColor,
                      border: `1px solid ${recColor}44`,
                      fontSize: 11,
                    }}>
                      {photo.recommendation}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                    {Object.entries(photo.scores).map(([key, val]) => (
                      <div key={key} style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{SCORE_LABELS[key]}: </span>
                        <span style={{ color: val >= 7 ? '#00c864' : val >= 5 ? '#00AEEF' : '#ff9944', fontWeight: 700 }}>
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overall score */}
                <div style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 800,
                  fontSize: 22,
                  color: recColor,
                  flexShrink: 0,
                }}>
                  {photo.overall}
                </div>

                <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>
                  {isExpanded ? '▲' : '▼'}
                </span>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div style={{
                  borderTop: '1px solid var(--border)',
                  padding: '16px',
                  background: 'var(--bg-card)',
                }}>
                  {/* Score bars */}
                  <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
                    {Object.entries(photo.scores).map(([key, val]) => (
                      <div key={key}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                          <span style={{ color: 'var(--text-muted)' }}>{SCORE_LABELS[key]}</span>
                          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>{val}/10</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${val * 10}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Suggestions */}
                  {photo.suggestions.length > 0 && (
                    <div>
                      <p style={{
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: 700,
                        fontSize: 12,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--accent)',
                        marginBottom: 8,
                      }}>
                        Suggestions
                      </p>
                      {photo.suggestions.map((s, j) => (
                        <div key={j} style={{
                          fontSize: 13,
                          color: 'var(--text-muted)',
                          marginBottom: 6,
                          display: 'flex',
                          gap: 8,
                        }}>
                          <span style={{ color: 'var(--accent)' }}>→</span>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {photo.suggestions.length === 0 && (
                    <p style={{ fontSize: 13, color: '#00c864' }}>
                      ✓ This photo looks great — no major improvements needed.
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
