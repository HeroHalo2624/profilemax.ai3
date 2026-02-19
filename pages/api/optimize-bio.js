// pages/api/optimize-bio.js
// API route: POST /api/optimize-bio
// Rewrites user bio in 3 styles using OpenAI

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { bio, platform = 'Tinder' } = req.body

  if (!bio || !bio.trim()) {
    return res.status(400).json({ error: 'Bio is required' })
  }

  // Check API key
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    // Return plausible mock data if no API key set
    return res.status(200).json(getMockBioResults(bio))
  }

  try {
    const prompt = `You are an expert dating profile consultant. Analyze this ${platform} bio and rewrite it in 3 distinct styles.

Original bio:
"${bio}"

Instructions:
- Improve clarity, reduce neediness, increase intrigue and confidence
- Each version should feel authentic and non-generic
- Keep each rewrite under 150 words

Respond ONLY with valid JSON in this exact format (no markdown, no explanation):
{
  "rewrites": {
    "confident": "...",
    "playful": "...",
    "warm": "..."
  },
  "bioScore": <number 0-100>,
  "analysis": "<one sentence critique of the original bio>"
}`

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 800,
    })

    const text = completion.choices[0].message.content.trim()

    // Parse JSON response
    let parsed
    try {
      // Strip any accidental markdown fences
      const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      parsed = JSON.parse(clean)
    } catch {
      console.error('JSON parse error:', text)
      return res.status(200).json(getMockBioResults(bio))
    }

    return res.status(200).json(parsed)
  } catch (err) {
    console.error('OpenAI error:', err)
    // Fallback to mock on error
    return res.status(200).json(getMockBioResults(bio))
  }
}

// ── Fallback mock responses (used when no API key) ────────────────────────────
function getMockBioResults(bio) {
  const wordCount = bio.split(' ').length
  return {
    rewrites: {
      confident: `Software engineer by day, weekend adventurer by choice. I'll probably challenge you to try something new — and mean it. Looking for someone who keeps up. ${wordCount > 30 ? "Let's skip the small talk." : ''}`.trim(),
      playful: `Warning: conversations with me may cause unexpected laughter, spontaneous travel plans, and mild obsession with good coffee. Swipe right at your own risk. 😄`,
      warm: `I believe the best moments happen when you're fully present — whether that's on a trail, at a dinner table, or deep in conversation at 2am. I'm looking for someone real. Let's actually meet.`,
    },
    bioScore: Math.min(100, Math.max(30, 45 + wordCount * 0.8)),
    analysis: 'Good foundation, but could use more specificity and a stronger hook to stand out.',
  }
}
