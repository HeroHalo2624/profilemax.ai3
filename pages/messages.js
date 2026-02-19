// pages/messages.js - Message Review Tool
import { useState } from 'react'

export default function Messages() {
  const [conversation, setConversation] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(null)

  const analyze = async () => {
    if (!conversation.trim()) {
      setError('Please paste a conversation first.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/analyze-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResults(data)
    } catch (err) {
      setError(err.message || 'Analysis failed. Check your API key.')
    } finally {
      setLoading(false)
    }
  }

  const copy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{ paddingTop: 40 }}>
      <div className="container">
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
            💬 Message Review
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>
            Paste a dating conversation. Get confident, calibrated reply suggestions.
          </p>
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <label>Paste Conversation</label>
          <textarea
            value={conversation}
            onChange={e => setConversation(e.target.value)}
            rows={8}
            placeholder={`Her: Hey! Your profile mentioned you hike — where's your favorite trail?\nYou: I love Yosemite, been there 3 times. The Half Dome trail is insane. Do you hike much?\nHer: A little! Just casual stuff. What else do you get up to?`}
          />
          <p style={{ color: 'var(--text-dim)', fontSize: 12, marginTop: 6 }}>
            Include the last few messages so AI has context.
          </p>

          {error && (
            <div style={{
              marginTop: 12,
              padding: '12px 16px',
              background: 'rgba(255,60,60,0.1)',
              border: '1px solid rgba(255,60,60,0.3)',
              borderRadius: 10,
              color: '#ff6060',
              fontSize: 14,
            }}>
              {error}
            </div>
          )}

          <button
            onClick={analyze}
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 16, padding: '14px', fontSize: 15, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Analyzing...</>
            ) : '🔍 Analyze Conversation'}
          </button>
        </div>

        {results && (
          <div className="fade-up">
            {/* Tone analysis */}
            <div className="card" style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, marginBottom: 16 }}>📊 Tone Analysis</h2>
              <div className="grid-2">
                {[
                  { label: 'Tone', value: results.tone },
                  { label: 'Confidence Rating', value: results.confidenceRating },
                  { label: 'Investment Level', value: results.investmentLevel },
                  { label: 'Vibe', value: results.vibe },
                ].map(item => (
                  <div key={item.label} style={{
                    background: 'var(--bg-elevated)',
                    borderRadius: 10,
                    padding: '14px',
                  }}>
                    <p style={{ fontSize: 11, fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                      {item.value || '—'}
                    </p>
                  </div>
                ))}
              </div>

              {results.improvements?.length > 0 && (
                <div style={{ marginTop: 16, padding: 14, background: 'var(--bg-elevated)', borderRadius: 10 }}>
                  <p style={{ fontSize: 12, fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 8 }}>
                    Improvement Areas
                  </p>
                  {results.improvements.map((imp, i) => (
                    <div key={i} style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6, display: 'flex', gap: 8 }}>
                      <span style={{ color: 'var(--accent)' }}>→</span>
                      <span>{imp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Suggested replies */}
            {results.replies?.length > 0 && (
              <div className="card" style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, marginBottom: 16 }}>💡 Suggested Replies</h2>
                <div style={{ display: 'grid', gap: 12 }}>
                  {results.replies.map((reply, i) => (
                    <div key={i} style={{
                      background: 'var(--bg-elevated)',
                      borderRadius: 12,
                      border: '1px solid var(--border)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        padding: '10px 14px',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'var(--accent-dim)',
                      }}>
                        <span style={{ fontSize: 12, fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--accent)' }}>
                          Option {i + 1} · {reply.style || 'Calibrated'}
                        </span>
                        <button
                          onClick={() => copy(reply.text, i)}
                          className="btn btn-ghost"
                          style={{ padding: '3px 10px', fontSize: 11 }}
                        >
                          {copied === i ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <div style={{ padding: '14px', fontSize: 14, lineHeight: 1.7 }}>
                        {reply.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
