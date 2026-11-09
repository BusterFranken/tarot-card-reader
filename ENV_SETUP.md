# Environment Variables Setup

## Required Environment Variables

### OPENAI_API_KEY

You need an OpenAI API key for the tarot card interpretations to work.

#### Getting Your API Key:

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (you won't be able to see it again!)

#### Setting Up Locally:

Create a file named `.env.local` in the root directory:

```bash
OPENAI_API_KEY=sk-your-actual-key-here
```

⚠️ **NEVER commit your `.env.local` file to Git!** It's already in `.gitignore`.

#### Setting Up on Vercel:

1. Go to the project in the [Vercel dashboard](https://vercel.com/dashboard)
2. Navigate to "Settings" → "Environment Variables"
3. Add a new variable:
   - Key: `OPENAI_API_KEY`
   - Value: `sk-your-actual-key-here`
   - Environments: Production and Preview
4. Save, then redeploy for the change to take effect

## Cost Considerations

This app uses **GPT-6.1 Terra** (`gpt-6.1-terra`) for readings:
- **Input**: $1.00 per 1M tokens
- **Output**: $5.00 per 1M tokens

Each complete tarot reading costs **about $0.01** (4 API calls per complete reading).

Voice input uses **`gpt-transcribe`** at $0.0045 per minute of audio.

## Testing Without OpenAI

If you don't want to use OpenAI yet, you can test the interface by temporarily modifying the API route to return mock responses. However, the full experience requires OpenAI integration.
