// pages/api/analyze-message.js
// API route: POST /api/analyze-message
// Analyzes a dating conversation and suggests replies

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { conversation } = req.body

  if (!conversation?.trim()) {
    return res.status(400).json({ error: 'Conversation is required' })
  }

  // Return mock if no API key
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    return res.status(200).json(getMockMessageResults())
  }

  try {
    const prompt = `You are an expert dating coach. Analyze this dating conversation and provide guidance.

Conversation:
${conversation}

Analyze the tone, identify any over-investment or neediness patterns, and suggest confident, calibrated replies.

Respond ONLY with valid JSON (no markdown):
{
  "tone": "<e.g. Friendly, Nervous, Confident, Needy>",
  "confidenceRating": "<Low / Medium / High>",
  "investmentLevel": "<Balanced / Slightly High / Over-invested>",
  "vibe": "<e.g. Playful banter, Deep conversation, Shallow small talk>",
  "improvements": ["<specific improvement>", "<specific improvement>"],
  "replies": [
    { "style": "Confident & Direct", "text": "<reply option 1>" },
    { "style": "Playful & Light", "text": "<reply option 2>" },
    { "style": "Intriguing", "text": "<reply option 3>" }
  ]
}`

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.85,
      max_tokens: 700,
    })

    const text = completion.choices[0].message.content.trim()

    let parsed
    try {
      const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      parsed = JSON.parse(clean)
    } catch {
      return res.status(200).json(getMockMessageResults())
    }

    return res.status(200).json(parsed)
  } catch (err) {
    console.error('OpenAI error:', err)
    return res.status(200).json(getMockMessageResults())
  }
}

// ── Mock fallback ─────────────────────────────────────────────────────────────
function getMockMessageResults() {
  return {
    tone: 'Friendly',
    confidenceRating: 'Medium',
    investmentLevel: 'Slightly High',
    vibe: 'Casual small talk',
    improvements: [
      'Avoid answering questions with questions — lead the conversation more',
      'Add more personality and teasing to stand out from others',
      'Suggest a date sooner — don\'t over-invest in text chat',
    ],
    replies: [
      {
        style: 'Confident & Direct',
        text: "Honestly? Trails are overrated without good company. You free Thursday?",
      },
      {
        style: 'Playful & Light',
        text: "Careful, I'll have you hiking Half Dome before the end of the month 😂 What's your fitness level — be honest.",
      },
      {
        style: 'Intriguing',
        text: "There's this spot most people miss entirely. I'll show you sometime.",
      },
    ],
  }
}
