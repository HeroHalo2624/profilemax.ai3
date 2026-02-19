# ProfileMax AI

> AI-powered dating profile optimizer. Free forever.

![ProfileMax AI](https://img.shields.io/badge/ProfileMax-AI-00AEEF?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai)

## Features

- 📸 **Photo Analysis** — AI scoring for lighting, clarity, expression, and style
- ✍️ **Bio Optimization** — 3 AI-rewritten versions (confident, playful, warm)
- ⚡ **Attraction Score** — Overall profile score with radar chart visualization
- 💬 **Message Review** — Calibrated reply suggestions for dating conversations
- 📈 **Progress Dashboard** — Score history and improvement tracking

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/profilemax-ai.git
cd profilemax-ai
npm install
```

### 2. Set Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini
```

Get your OpenAI API key at: https://platform.openai.com/api-keys

> **Note:** The app works without an API key using built-in mock responses. Set the key to enable real AI analysis.

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
profilemax-ai/
├── pages/
│   ├── _app.js              # App entry, global styles
│   ├── index.js             # Home / analysis page
│   ├── messages.js          # Message review tool
│   ├── dashboard.js         # Progress dashboard
│   ├── support.js           # Support / Buy Me a Coffee
│   └── api/
│       ├── optimize-bio.js  # Bio rewriting endpoint
│       └── analyze-message.js # Message analysis endpoint
├── components/
│   ├── Layout.js            # App shell with navigation
│   ├── ScoreDisplay.js      # Overall score + radar chart
│   ├── PhotoResults.js      # Photo ranking + scores
│   └── BioResults.js        # Bio rewrites display
├── styles/
│   └── globals.css          # Global design system
├── .env.example             # Environment variables template
├── next.config.js
└── package.json
```

## Deploy to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Option 2: CLI Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variable in Vercel dashboard or via CLI:
vercel env add OPENAI_API_KEY
```

### Environment Variables on Vercel

1. Go to your project in the [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings → Environment Variables**
3. Add:
   - `OPENAI_API_KEY` = your OpenAI key
   - `OPENAI_MODEL` = `gpt-4o-mini` (optional, this is the default)

## API Routes

### `POST /api/optimize-bio`

Rewrites a dating bio in 3 styles.

**Request:**
```json
{
  "bio": "Your current bio text",
  "platform": "Tinder"
}
```

**Response:**
```json
{
  "rewrites": {
    "confident": "...",
    "playful": "...",
    "warm": "..."
  },
  "bioScore": 72,
  "analysis": "Good base but lacks a strong hook."
}
```

### `POST /api/analyze-message`

Analyzes a conversation and suggests replies.

**Request:**
```json
{
  "conversation": "Her: Hey!\nYou: Hey! How's your week..."
}
```

**Response:**
```json
{
  "tone": "Friendly",
  "confidenceRating": "Medium",
  "investmentLevel": "Balanced",
  "vibe": "Casual small talk",
  "improvements": ["..."],
  "replies": [
    { "style": "Confident", "text": "..." }
  ]
}
```

## Customization

### Change Colors
Edit CSS variables in `styles/globals.css`:
```css
:root {
  --bg: #1E1E1E;
  --accent: #00AEEF;
}
```

### Upgrade AI Model
Change `OPENAI_MODEL` to `gpt-4o` for better results (higher cost).

### Add Real Photo Vision Analysis
Replace `analyzePhotoLocally()` in `pages/index.js` with a call to `/api/analyze-photos` using OpenAI's vision API:

```js
// In pages/api/analyze-photos.js
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{
    role: 'user',
    content: [
      { type: 'image_url', image_url: { url: base64ImageUrl } },
      { type: 'text', text: 'Score this dating profile photo on lighting (1-10), clarity (1-10), expression warmth (1-10), and style (1-10). Return JSON.' }
    ]
  }]
})
```

## Data & Privacy

- All profile data is processed in memory only
- No user data is stored on any server
- Score history is saved to **browser localStorage** only
- Photos never leave your device (analysis is simulated client-side in MVP)

## Support

This app is free. If it helped you, consider:

☕ [Buy Me a Coffee](https://buymeacoffee.com/brianm2624)

## License

MIT — use freely, attribute if you build on it.
