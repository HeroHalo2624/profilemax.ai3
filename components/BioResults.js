// components/BioResults.js - Bio rewrite display
import { useState } from 'react'

const STYLES = [
  { key: 'confident', label: 'Confident & Minimal', icon: '🎯', color: '#00AEEF' },
  { key: 'playful', label: 'Playful & Witty', icon: '😄', color: '#FFB800' },
  { key: 'warm', label: 'Warm & Relationship-Oriented', icon: '❤️', color: '#FF6B6B' },
]

export default function BioResults({ bioResults, originalBio }) {
  const [copiedKey, setCopiedKey] = useState(null)
  const [activeTab, setActiveTab] = useState('rewrites')

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div className="card fade-up" style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 20, marginBottom: 8 }}>✍️ Bio Optimization</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
        {[
          { key: 'rewrites', label: 'AI Rewrites' },
          { key: 'original', label: 'Original' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="btn"
            style={{
              padding: '6px 14px',
              fontSize: 13,
              background: activeTab === tab.key ? 'var(--accent-dim)' : 'transparent',
              color: activeTab === tab.key ? 'var(--accent)' : 'var(--text-muted)',
              border: activeTab === tab.key ? '1px solid rgba(0,174,239,0.3)' : '1px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'original' ? (
        <div style={{
          background: 'var(--bg-elevated)',
          borderRadius: 10,
          padding: '16px',
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--text-muted)',
          fontStyle: 'italic',
        }}>
          "{originalBio}"
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {STYLES.map(style => {
            const content = bioResults?.rewrites?.[style.key] || 'Analysis in progress...'
            return (
              <div key={style.key} style={{
                background: 'var(--bg-elevated)',
                borderRadius: 12,
                border: `1px solid ${style.color}22`,
                overflow: 'hidden',
              }}>
                {/* Style header */}
                <div style={{
                  padding: '12px 16px',
                  borderBottom: `1px solid ${style.color}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: `${style.color}0d`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{style.icon}</span>
                    <span style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 700,
                      fontSize: 14,
                      color: style.color,
                    }}>
                      {style.label}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(content, style.key)}
                    className="btn btn-ghost"
                    style={{
                      padding: '4px 12px',
                      fontSize: 12,
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 600,
                    }}
                  >
                    {copiedKey === style.key ? '✓ Copied' : 'Copy'}
                  </button>
                </div>

                {/* Bio content */}
                <div style={{
                  padding: '16px',
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: 'var(--text)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {content}
                </div>
              </div>
            )
          })}

          {/* Bio score */}
          {bioResults?.bioScore && (
            <div style={{
              padding: '12px 16px',
              background: 'var(--bg-elevated)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 14,
            }}>
              <div className="score-badge">
                {bioResults.bioScore}
              </div>
              <div>
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14 }}>
                  Bio Quality Score
                </p>
                {bioResults.analysis && (
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
                    {bioResults.analysis}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
