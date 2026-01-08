# ✨ Tarot Card Reader ✨

An interactive, AI-powered tarot card reading application built with Next.js, React, and OpenAI. Experience authentic tarot readings with real card images, personalized interpretations, and conversational AI guidance.

## 🌟 Features

### Interactive Tarot Reading Experience
- **Complete 78-card deck** (Major Arcana + Minor Arcana)
- **Three-card spread**: Past, Present, Future
- **Click-to-reveal cards** with smooth animations and hover effects
- **AI-powered interpretations** using OpenAI GPT-4o-mini
- **Conversational context** - each card reading builds on the previous
- **Personal reflection prompts** - share your initial impressions before the AI reading
- **Combined narrative** - AI weaves all three cards into a cohesive story

### User Flow
1. **Ask your question** - Focus your energy and intention
2. **Shuffle the deck** - Watch as the cards align with your energy
3. **Reveal each card** - Click to turn over the Past, Present, and Future cards
4. **Share your insights** - Optionally share what you see before the AI reading
5. **Receive guidance** - Get personalized AI interpretations for each card
6. **Combined reading** - Understand how all three cards connect

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/BusterFranken/tarot-card-reader.git
cd tarot-card-reader
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

See [ENV_SETUP.md](ENV_SETUP.md) for detailed instructions.

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Visit [http://localhost:3000](http://localhost:3000)

## 📦 Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **OpenAI API** - AI-powered interpretations
- **Next.js Image Optimization** - Card image handling

## 🏗️ Project Structure

```
├── app/
│   ├── api/
│   │   └── tarot-reading/    # OpenAI integration API route
│   ├── components/
│   │   └── Navigation.tsx    # App header
│   ├── data/
│   │   └── tarotCards.ts     # Complete 78-card deck data
│   ├── tarot/
│   │   └── page.tsx          # Main tarot reading interface
│   └── page.tsx              # Redirects to tarot
├── public/
│   └── cards/                # All 78 tarot card images + backs
├── amplify.yml               # AWS Amplify build configuration
└── ENV_SETUP.md              # Environment variable guide
```

## 🎴 How the Readings Work

### Card Selection
- All 78 cards are shuffled randomly
- Three cards are drawn for Past, Present, and Future positions
- Each card has a 50% chance of appearing reversed

### AI Interpretation
The app uses **OpenAI's GPT-4o-mini** to provide:
- Context-aware readings that build on previous cards
- Integration of user's personal insights and reflections
- Traditional tarot meanings blended with modern, relatable guidance
- A final combined reading that weaves the story together

### Conversation Context
The AI maintains conversation history throughout the reading:
1. Your question is always kept in context
2. Each card revealed adds to the AI's understanding
3. Your personal reflections inform the interpretation
4. The combined reading synthesizes everything into a cohesive narrative

## 💰 Cost Considerations

Using GPT-4o-mini is very affordable:
- **~$0.01 or less per complete reading** (4 API calls)
- Input: $0.150 per 1M tokens
- Output: $0.600 per 1M tokens

See [ENV_SETUP.md](ENV_SETUP.md) for more details.

## 🌐 Deploying to AWS Amplify

This app is fully compatible with AWS Amplify hosting.

### Quick Deploy

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to AWS Amplify**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
   - Click "New app" → "Host web app"
   - Connect your GitHub repository
   - Amplify will auto-detect Next.js and use the included `amplify.yml`

3. **Add Environment Variables**
   - In Amplify Console: App settings → Environment variables
   - Add: `OPENAI_API_KEY` = `sk-your-key-here`
   - Save and redeploy

See [ENV_SETUP.md](ENV_SETUP.md) for detailed AWS setup instructions.

### Build Configuration

The included `amplify.yml` configures:
- Automatic dependency installation
- Next.js build optimization
- Caching for faster builds
- Static and dynamic content handling

## 🔒 Security Notes

- **Never commit `.env.local`** - It's in `.gitignore` by default
- **Keep your OpenAI API key secret** - Only store in environment variables
- **Set usage limits** in OpenAI dashboard to control costs
- **Monitor usage** regularly in your OpenAI account

## 🎨 Customization

### Changing the AI Personality
Edit the system prompt in `app/api/tarot-reading/route.ts`:
```typescript
{
  role: "system",
  content: `You are an experienced, warm, and insightful tarot card reader...`
}
```

### Adjusting Response Length
Change `max_tokens` in the OpenAI API call:
```typescript
max_tokens: 500,  // Increase for longer responses
```

### Adding More Cards or Spreads
Edit `app/data/tarotCards.ts` to add cards or modify meanings.
Update `app/tarot/page.tsx` to change the spread layout.

## 📝 Development

### Running Tests
```bash
npm run build  # Verify build works
npm run lint   # Check for linting errors
```

### Local Development
```bash
npm run dev    # Start dev server with hot reload
```

## 🤝 Contributing

Feel free to submit issues and pull requests!

## 📄 License

MIT

---

**Made with ✨ by BusterFranken**
