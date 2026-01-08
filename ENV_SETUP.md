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

#### Setting Up on AWS Amplify:

1. Go to your app in the AWS Amplify Console
2. Navigate to "App settings" → "Environment variables"
3. Click "Manage variables"
4. Add a new variable:
   - Key: `OPENAI_API_KEY`
   - Value: `sk-your-actual-key-here`
5. Save and redeploy

## Cost Considerations

This app uses **GPT-4o-mini** which is very affordable:
- **Input**: $0.150 per 1M tokens (~$0.15 per 1000 readings)
- **Output**: $0.600 per 1M tokens

Each tarot reading typically costs **less than $0.01** (about 4 API calls per complete reading).

## Testing Without OpenAI

If you don't want to use OpenAI yet, you can test the interface by temporarily modifying the API route to return mock responses. However, the full experience requires OpenAI integration.
