# 🎴 Tarot Card Reader - Setup Instructions

## What I Need From You

### 1. OpenAI API Key (REQUIRED)

The app uses OpenAI to generate tarot card interpretations. You need an API key.

#### Get Your API Key:
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. **Name it**: `tarot-card-reader`
5. **Copy the key** - it looks like: `sk-proj-...` (you won't see it again!)

#### Add It Locally:
Create a file named `.env.local` in the project root:

```bash
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

⚠️ **IMPORTANT**: Replace `sk-proj-your-actual-key-here` with your actual key!

## Running the App Locally

1. **Install dependencies** (if you haven't):
```bash
npm install
```

2. **Create `.env.local`** with your OpenAI key (see above)

3. **Start the development server**:
```bash
npm run dev
```

4. **Open your browser** to http://localhost:3000

You should be automatically redirected to the tarot reading page!

## Testing the App

### Test Flow:
1. ✅ Enter a question (e.g., "What do I need to know about my career?")
2. ✅ Click "Begin Reading" - watch the shuffle animation
3. ✅ Hover over the Past card - it should lift slightly
4. ✅ Click the Past card - it flips over
5. ✅ Share what you see (or click "Skip")
6. ✅ Read the AI interpretation
7. ✅ Click "Continue to Present Card"
8. ✅ Repeat for Present and Future cards
9. ✅ Click "Get Combined Reading" for the final interpretation

### What to Check:
- Cards should flip when clicked
- AI should respond (not show errors)
- Each reading should reference previous cards
- Combined reading should weave all three together

## If You See Errors

### "OpenAI API key is missing or invalid"
- Check that `.env.local` exists in the root directory
- Verify the key starts with `sk-proj-` or `sk-`
- Make sure there are no spaces or quotes around the key
- Restart the dev server after creating `.env.local`

### "OpenAI API quota exceeded"
- Check your OpenAI billing at https://platform.openai.com/account/billing
- Add a payment method if needed
- Set usage limits to control costs

### Cards don't flip
- Check the browser console (F12) for errors
- Make sure images loaded properly
- Try refreshing the page

## What's Been Implemented

✅ **All Your Requirements:**

1. ✅ **OpenAI Integration**
   - Uses GPT-4o-mini for cost-effective readings
   - Maintains conversation context throughout reading
   - Provides warm, insightful interpretations

2. ✅ **Interactive Card Reveal**
   - Click to reveal cards (not automatic)
   - Hover effect - cards lift slightly
   - Sequential reveal: Past → Present → Future

3. ✅ **Step-by-Step Buttons**
   - "Turn over the Past card"
   - "Turn over the Present card"
   - "Turn over the Future card"
   - "Get Combined Reading"

4. ✅ **User Interpretation Prompts**
   - After revealing each card, you're asked what you see
   - Your insights are included in the AI's reading
   - Option to skip and get reading directly
   - Context builds with each card

5. ✅ **Default to Tarot Page**
   - App opens directly to tarot reading
   - Removed motivational quotes feature
   - Clean, focused experience

6. ✅ **AWS Amplify Ready**
   - Included `amplify.yml` for easy deployment
   - Optimized build configuration
   - Environment variable support
   - All dependencies compatible with serverless

## Project Structure

```
demo-project/
├── app/
│   ├── api/
│   │   └── tarot-reading/route.ts    # OpenAI API integration
│   ├── components/
│   │   └── Navigation.tsx            # App header
│   ├── data/
│   │   └── tarotCards.ts             # 78-card deck data
│   ├── tarot/
│   │   └── page.tsx                  # Main tarot interface
│   └── page.tsx                      # Redirects to /tarot
├── public/
│   └── cards/                        # All card images
├── .env.local                        # YOUR API KEY (create this!)
├── amplify.yml                       # AWS deployment config
├── ENV_SETUP.md                      # Detailed env var guide
├── AWS_AMPLIFY_DEPLOY.md             # Deployment guide
└── README.md                         # Full documentation
```

## Cost Information

### OpenAI Usage
- **Model**: GPT-4o-mini (most cost-effective)
- **Per reading**: ~$0.01 or less
- **4 API calls per reading**:
  1. Past card interpretation
  2. Present card interpretation
  3. Future card interpretation
  4. Combined reading

### Monthly Estimate
- 100 readings: ~$1
- 500 readings: ~$5
- 1,000 readings: ~$10

Much cheaper than GPT-4!

## Next Steps

### For Local Development:
1. Create `.env.local` with your OpenAI key
2. Run `npm run dev`
3. Test the full flow

### For Deployment to AWS:
1. Read `AWS_AMPLIFY_DEPLOY.md`
2. Push code to GitHub
3. Connect to AWS Amplify
4. Add environment variables in Amplify Console
5. Deploy!

## Files You Should Read

1. **ENV_SETUP.md** - Environment variables and API keys
2. **AWS_AMPLIFY_DEPLOY.md** - Complete deployment guide
3. **README.md** - Full project documentation

## Support

If something isn't working:
1. Check `.env.local` exists and has the correct key
2. Restart the dev server after adding environment variables
3. Check browser console (F12) for errors
4. Verify OpenAI billing is set up

## What Makes This Special

🎴 **Authentic Tarot Experience**
- Real 78-card deck with traditional meanings
- Proper three-card spread (Past, Present, Future)
- Upright and reversed interpretations

🤖 **AI-Powered Insights**
- Context-aware readings that build on each card
- Integrates your personal reflections
- Warm, conversational tone
- Cohesive narrative in combined reading

✨ **Beautiful UX**
- Smooth animations and transitions
- Interactive card reveals with hover effects
- Clean, mystical design
- Mobile-responsive

---

**Ready to start giving readings!** 🔮

Create your `.env.local` file, add your OpenAI key, and run `npm run dev`!
