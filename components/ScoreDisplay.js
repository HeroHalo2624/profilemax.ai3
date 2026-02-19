// components/ScoreDisplay.js - Overall score visualization
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'

export default function ScoreDisplay({ score }) {
  const { overall, photoStrength, bioQuality, completeness, percentile, suggestions } = score

  // Radar chart data
  const radarData = [
    { subject: 'Photos', value: photoStrength },
    { subject: 'Bio', value: bioQuality },
    { subject: 'Complete', value: completeness },
    { subject: 'Appeal', value: Math.round((photoStrength + bioQuality) / 2) },
    { subject: 'Effort', value: completeness },
  ]

  const scoreColor = overall >= 75 ? '#00c864' : overall >= 55 ? '#00AEEF' : '#ff9944'

  return (
    <div className="card fade-up" style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 20, marginBottom: 24 }}>
        ⚡ Attraction Score
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
        alignItems: 'center',
      }}>
        {/* Big score circle */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            border: `6px solid ${scoreColor}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: `0 0 32px ${scoreColor}44`,
            background: `${scoreColor}11`,
          }}>
            <span style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 48,
              color: scoreColor,
              lineHeight: 1,
            }}>
              {overall}
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>/100</span>
          </div>
          <div className="tag tag-blue" style={{ fontSize: 13, padding: '6px 16px' }}>
            {percentile}
          </div>
        </div>

        {/* Radar chart */}
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.07)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#888', fontSize: 11, fontFamily: 'Syne, sans-serif' }}
              />
              <Radar
                dataKey="value"
                stroke="#00AEEF"
                fill="#00AEEF"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sub-scores */}
      <div style={{ marginTop: 24, display: 'grid', gap: 14 }}>
        {[
          { label: 'Photo Strength', value: photoStrength, weight: '50%' },
          { label: 'Bio Quality', value: bioQuality, weight: '30%' },
          { label: 'Completeness', value: completeness, weight: '20%' },
        ].map(item => (
          <div key={item.label}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 6,
              fontSize: 13,
            }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>
                {item.label}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text)' }}>{item.value}</strong>/100
                <span style={{ color: 'var(--text-dim)', marginLeft: 6 }}>({item.weight})</span>
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div style={{
          marginTop: 20,
          padding: '16px',
          background: 'var(--bg-elevated)',
          borderRadius: 10,
        }}>
          <p style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 13,
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 10,
          }}>
            💡 Key Improvements
          </p>
          {suggestions.map((s, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: 8,
              marginBottom: 6,
              fontSize: 14,
              color: 'var(--text-muted)',
            }}>
              <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
