// pages/index.js - Home / Profile Analysis Page
import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import ScoreDisplay from '../components/ScoreDisplay'
import PhotoResults from '../components/PhotoResults'
import BioResults from '../components/BioResults'

const PLATFORMS = ['Tinder', 'Hinge', 'Bumble', 'OkCupid', 'Other']

export default function Home() {
  const router = useRouter()
  const fileInputRef = useRef(null)

  // Form state
  const [platform, setPlatform] = useState('Tinder')
  const [bio, setBio] = useState('')
  const [prompts, setPrompts] = useState('')
  const [photos, setPhotos] = useState([]) // Array of {file, preview}

  // Results state
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  // Handle photo uploads
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    const newPhotos = files.slice(0, 6 - photos.length).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }))
    setPhotos(prev => [...prev, ...newPhotos].slice(0, 6))
  }

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  // Submit for analysis
  const handleAnalyze = async () => {
    if (!bio && photos.length === 0) {
      setError('Please add at least a bio or some photos.')
      return
    }
    setError(null)
    setLoading(true)

    try {
      // Call bio optimization API
      let bioResults = null
      if (bio.trim()) {
        const bioRes = await fetch('/api/optimize-bio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bio, platform }),
        })
        bioResults = await bioRes.json()
      }

      // Simulate photo analysis (vision API optional — uses scoring logic)
      const photoResults = photos.map((p, i) => analyzePhotoLocally(p, i))

      // Calculate overall score
      const score = calculateScore(photoResults, bioResults, photos.length, bio)

      const finalResults = {
        platform,
        photoResults,
        bioResults,
        score,
        timestamp: Date.now(),
      }

      setResults(finalResults)

      // Save to localStorage for dashboard
      const history = JSON.parse(localStorage.getItem('profilemax_history') || '[]')
      history.unshift({
        timestamp: finalResults.timestamp,
        score: score.overall,
        platform,
        bioLength: bio.length,
        photoCount: photos.length,
      })
      localStorage.setItem('profilemax_history', JSON.stringify(history.slice(0, 20)))

      // Scroll to results
      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (err) {
      console.error(err)
      setError('Analysis failed. Check your API key or try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: 40 }}>
      <div className="container">

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 48 }} className="fade-up">
          <div style={{
            display: 'inline-block',
            padding: '4px 14px',
            background: 'var(--accent-dim)',
            borderRadius: 100,
            fontSize: 12,
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 20,
            border: '1px solid rgba(0,174,239,0.2)',
          }}>
            Free AI Profile Optimizer
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 7vw, 64px)', fontWeight: 800, marginBottom: 16 }}>
            Upgrade your dating<br />
            <span style={{ color: 'var(--accent)' }}>presence.</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>
            AI-powered photo analysis, bio rewrites, and profile scoring. 100% free.
          </p>
        </div>

        {/* Analysis Form */}
        <div className="card fade-up" style={{ marginBottom: 32, animationDelay: '0.1s' }}>
          <h2 style={{ fontSize: 20, marginBottom: 24 }}>Profile Analysis</h2>

          {/* Platform selector */}
          <div style={{ marginBottom: 20 }}>
            <label>Dating Platform</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className="btn"
                  style={{
                    padding: '8px 18px',
                    fontSize: 14,
                    background: platform === p ? 'var(--accent)' : 'var(--bg-elevated)',
                    color: platform === p ? '#000' : 'var(--text-muted)',
                    fontWeight: 600,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Photo upload */}
          <div style={{ marginBottom: 20 }}>
            <label>Photos ({photos.length}/6)</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '28px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'var(--transition)',
                background: 'var(--bg-elevated)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>📸</div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                Click to upload 3–6 photos
              </p>
              <p style={{ color: 'var(--text-dim)', fontSize: 12, marginTop: 4 }}>
                JPG, PNG, WEBP supported
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />

            {/* Photo previews */}
            {photos.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
                marginTop: 16,
              }}>
                {photos.map((photo, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img
                      src={photo.preview}
                      alt={`Photo ${i + 1}`}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        objectFit: 'cover',
                        borderRadius: 10,
                        border: '1px solid var(--border)',
                        display: 'block',
                      }}
                    />
                    <button
                      onClick={() => removePhoto(i)}
                      style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'rgba(0,0,0,0.7)',
                        border: 'none',
                        color: '#fff',
                        fontSize: 12,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >✕</button>
                    {i === 0 && (
                      <span className="tag tag-blue" style={{ position: 'absolute', bottom: 6, left: 6, fontSize: 10 }}>
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bio */}
          <div style={{ marginBottom: 20 }}>
            <label>Your Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Paste your current bio here. The AI will analyze it and rewrite it in 3 different styles..."
              rows={5}
            />
            <p style={{ color: 'var(--text-dim)', fontSize: 12, marginTop: 6 }}>
              {bio.length} characters
            </p>
          </div>

          {/* Prompts */}
          <div style={{ marginBottom: 28 }}>
            <label>Prompts / Hinge Answers (optional)</label>
            <textarea
              value={prompts}
              onChange={e => setPrompts(e.target.value)}
              placeholder="Paste any profile prompts or answers you've written (e.g. Hinge prompts)..."
              rows={3}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(255,60,60,0.1)',
              border: '1px solid rgba(255,60,60,0.3)',
              borderRadius: 10,
              padding: '12px 16px',
              color: '#ff6060',
              marginBottom: 16,
              fontSize: 14,
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              fontSize: 16,
              padding: '16px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                Analyzing profile...
              </>
            ) : (
              '⚡ Start Analysis'
            )}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div id="results" className="fade-up">
            {/* Score */}
            <ScoreDisplay score={results.score} />

            {/* Photo results */}
            {results.photoResults.length > 0 && (
              <PhotoResults photos={results.photoResults} previews={photos} />
            )}

            {/* Bio results */}
            {results.bioResults && (
              <BioResults bioResults={results.bioResults} originalBio={bio} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Local photo analysis simulation ──────────────────────────────────────────
// In production, replace with actual vision API calls in /api/analyze-photos
function analyzePhotoLocally(photo, index) {
  // Deterministic pseudo-random scores based on filename hash
  const seed = photo.name.split('').reduce((a, c) => a + c.charCodeAt(0), index * 37)
  const rand = (min, max, offset = 0) => {
    const r = ((seed * 9301 + 49297 + offset) % 233280) / 233280
    return Math.round(min + r * (max - min))
  }

  const lighting = rand(5, 10, 1)
  const clarity = rand(5, 10, 2)
  const expression = rand(4, 10, 3)
  const style = rand(4, 10, 4)
  const avg = (lighting + clarity + expression + style) / 4

  let recommendation = 'Keep'
  let tags = []

  if (index === 0 && avg >= 7) {
    recommendation = 'Primary Photo'
    tags.push('Best choice for first photo')
  } else if (avg < 6) {
    recommendation = 'Remove'
    tags.push('Below average quality')
  } else {
    recommendation = 'Keep'
  }

  const suggestions = []
  if (lighting < 7) suggestions.push('Improve lighting — shoot near a window or outdoors')
  if (clarity < 7) suggestions.push('Use a higher resolution or steady the camera')
  if (expression < 7) suggestions.push('A genuine smile increases match rates by 14%')
  if (style < 7) suggestions.push('Consider a cleaner background or better outfit')

  return {
    index,
    name: photo.name,
    scores: { lighting, clarity, expression, style },
    overall: parseFloat(avg.toFixed(1)),
    recommendation,
    suggestions,
  }
}

// ── Score calculation ─────────────────────────────────────────────────────────
function calculateScore(photoResults, bioResults, photoCount, bio) {
  // Photo strength (50%)
  const photoStrength = photoResults.length > 0
    ? photoResults.reduce((s, p) => s + p.overall, 0) / photoResults.length * 10
    : 0

  // Bio quality (30%) — from API or estimated
  const bioQuality = bioResults?.bioScore || estimateBioScore(bio)

  // Completeness (20%)
  const completeness = Math.min(100,
    (photoCount > 0 ? 40 : 0) +
    (bio.length > 50 ? 40 : bio.length > 0 ? 20 : 0) +
    (photoCount >= 3 ? 20 : 0)
  )

  const overall = Math.round(
    photoStrength * 0.5 +
    bioQuality * 0.3 +
    completeness * 0.2
  )

  // Percentile estimation
  let percentile = 'Top 50%'
  if (overall >= 85) percentile = 'Top 5%'
  else if (overall >= 75) percentile = 'Top 15%'
  else if (overall >= 65) percentile = 'Top 30%'
  else if (overall >= 50) percentile = 'Top 50%'
  else percentile = 'Bottom 50%'

  const suggestions = []
  if (photoStrength < 70) suggestions.push('Add higher quality photos with better lighting')
  if (photoCount < 3) suggestions.push('Profiles with 4+ photos get 3x more matches')
  if (bioQuality < 70) suggestions.push('Your bio could be more engaging — try the AI rewrites')
  if (bio.length < 30) suggestions.push('A longer bio shows personality and increases responses')

  return {
    overall,
    photoStrength: Math.round(photoStrength),
    bioQuality: Math.round(bioQuality),
    completeness: Math.round(completeness),
    percentile,
    suggestions,
  }
}

function estimateBioScore(bio) {
  if (!bio) return 0
  let score = 40
  if (bio.length > 100) score += 20
  if (bio.length > 200) score += 10
  if (!bio.toLowerCase().includes('i like') && !bio.toLowerCase().includes('i love')) score += 10
  if (bio.includes('?')) score += 10
  if (bio.split(' ').length > 20) score += 10
  return Math.min(100, score)
}
