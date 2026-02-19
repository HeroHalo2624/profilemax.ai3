// pages/support.js - Support / Buy Me a Coffee page
export default function Support() {
  return (
    <div style={{ paddingTop: 60 }}>
      <div className="container" style={{ maxWidth: 600, textAlign: 'center' }}>
        {/* Big coffee icon */}
        <div style={{
          fontSize: 72,
          marginBottom: 24,
          animation: 'fadeUp 0.4s ease forwards',
        }}>
          ☕
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
          If this app helped you,<br />
          <span style={{ color: 'var(--accent)' }}>support development.</span>
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: 17, lineHeight: 1.7, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
          This app is free — always will be. If it improved your profile or got you better results,
          consider buying me a coffee to support ongoing updates and new features.
        </p>

        {/* CTA Button */}
        <a
          href="https://buymeacoffee.com/brianm2624"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary glow-pulse"
          style={{
            fontSize: 17,
            padding: '18px 40px',
            borderRadius: 12,
            display: 'inline-flex',
            textDecoration: 'none',
            marginBottom: 48,
          }}
        >
          ☕ Buy Me a Coffee
        </a>

        {/* Features recap */}
        <div style={{
          display: 'grid',
          gap: 12,
          marginBottom: 48,
          textAlign: 'left',
        }}>
          {[
            { icon: '📸', title: 'Photo Analysis', desc: 'AI scoring of lighting, clarity, expression, and style' },
            { icon: '✍️', title: 'Bio Rewrites', desc: '3 different AI-optimized versions of your bio' },
            { icon: '⚡', title: 'Attraction Score', desc: 'Overall profile score with detailed breakdown' },
            { icon: '💬', title: 'Message Review', desc: 'Calibrated reply suggestions for your conversations' },
            { icon: '📈', title: 'Progress Tracking', desc: 'Track your improvements over time' },
          ].map(feat => (
            <div key={feat.title} style={{
              display: 'flex',
              gap: 14,
              padding: '14px 16px',
              background: 'var(--bg-card)',
              borderRadius: 12,
              border: '1px solid var(--border)',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{feat.icon}</span>
              <div>
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
                  {feat.title}
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{feat.desc}</p>
              </div>
              <span className="tag tag-green" style={{ marginLeft: 'auto', fontSize: 10, flexShrink: 0 }}>
                Free
              </span>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>
          Built with ❤️ by Brian. No ads, no subscriptions, no paywalls.
        </p>

        <div style={{ marginTop: 16 }}>
          <a
            href="https://buymeacoffee.com/brianm2624"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent)', fontSize: 14 }}
          >
            buymeacoffee.com/brianm2624 ↗
          </a>
        </div>
      </div>
    </div>
  )
}
