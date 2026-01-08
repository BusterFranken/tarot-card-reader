# Deploying to AWS Amplify

Complete guide for deploying your Tarot Card Reader app to AWS Amplify.

## Prerequisites

- AWS Account ([sign up here](https://aws.amazon.com/))
- GitHub repository with your code
- OpenAI API key

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure all your code is pushed to GitHub:

```bash
git add .
git commit -m "Ready for AWS Amplify deployment"
git push origin main
```

### 2. Create Amplify App

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click **"New app"** → **"Host web app"**
3. Choose **GitHub** as your repository provider
4. Authorize AWS Amplify to access your GitHub account
5. Select your repository: `tarot-card-reader`
6. Select branch: `main`

### 3. Configure Build Settings

AWS Amplify should auto-detect Next.js and use your `amplify.yml` file.

If it doesn't, use these build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### 4. Add Environment Variables

**CRITICAL**: Add your OpenAI API key before deploying!

1. In the Amplify app setup wizard, scroll to **"Advanced settings"**
2. Click **"Add environment variable"**
3. Add:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: `sk-proj-...` (your actual OpenAI API key)

OR after app creation:
1. Go to your app in Amplify Console
2. Navigate to **"App settings"** → **"Environment variables"**
3. Click **"Manage variables"**
4. Add the variable and **Save**

### 5. Deploy

1. Click **"Save and deploy"**
2. Amplify will:
   - Clone your repository
   - Install dependencies
   - Build your Next.js app
   - Deploy to a global CDN
3. Wait for the build to complete (usually 3-5 minutes)

### 6. Verify Deployment

Once deployed:
1. Click the deployed URL (e.g., `https://main.d1a2b3c4d5e6f7.amplifyapp.com`)
2. Test the tarot reading flow:
   - Enter a question
   - Shuffle and reveal cards
   - Verify AI interpretations work
3. Check the browser console for any errors

### 7. Set Up Custom Domain (Optional)

1. In Amplify Console, go to **"Domain management"**
2. Click **"Add domain"**
3. Enter your domain name (e.g., `tarotreader.com`)
4. Follow the DNS configuration instructions
5. Amplify will automatically provision an SSL certificate

## Continuous Deployment

Amplify automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Update tarot readings"
git push origin main
```

Amplify will detect the push and start a new build within seconds.

## Monitoring

### View Build Logs
- Go to your app → Click on a build
- View detailed logs for each phase (Provision, Build, Deploy)

### Monitor Costs
- Amplify free tier includes:
  - 1,000 build minutes/month
  - 5 GB storage
  - 15 GB served/month
- Most personal projects stay within free tier
- Additional usage: ~$0.01/build minute, ~$0.15/GB served

### Check Performance
- Go to **"Monitoring"** in Amplify Console
- View traffic, requests, and errors
- Set up CloudWatch alarms if needed

## Troubleshooting

### Build Fails

**Error: "npm install failed"**
- Check that `package.json` and `package-lock.json` are committed
- Try `npm ci` locally first to verify dependencies

**Error: "Module not found"**
- Ensure all imports use correct paths
- Check that TypeScript is configured properly

**Error: "Build exceeded memory limit"**
- In Build settings, increase build image size to "Large"

### OpenAI API Not Working

**Error: "Invalid API key"**
- Verify environment variable is set correctly in Amplify
- Check that key starts with `sk-proj-` or `sk-`
- Ensure no extra spaces or quotes in the variable value

**Error: "OpenAI API quota exceeded"**
- Check your OpenAI account billing
- Set usage limits in OpenAI dashboard

### Runtime Errors

**Cards not loading**
- Check that `/public/cards/` folder is committed
- Verify image paths in `tarotCards.ts`

**Slow performance**
- Enable Next.js image optimization (already configured)
- Consider caching strategies for frequently used data

## Environment Variables Management

### Adding More Variables

If you need additional environment variables:

1. Go to **"App settings"** → **"Environment variables"**
2. Click **"Manage variables"**
3. Add new variables
4. Click **"Save"**
5. Trigger a redeploy (or push new code)

### Secrets Management

For sensitive data:
- Use AWS Secrets Manager
- Reference in `amplify.yml`:
```yaml
backend:
  phases:
    preBuild:
      commands:
        - export SECRET=$(aws secretsmanager get-secret-value --secret-id my-secret --query SecretString --output text)
```

## Cost Optimization

### Reduce Build Time
- Use `npm ci` instead of `npm install` (already configured)
- Enable caching in `amplify.yml` (already configured)
- Only build when necessary (set branch patterns)

### Reduce Bandwidth
- Already using Next.js image optimization
- Consider adding CloudFront caching rules
- Compress static assets

### Monitor OpenAI Usage
- Set monthly spending limits in OpenAI dashboard
- Use `gpt-4o-mini` (already configured - cheapest option)
- Consider caching common interpretations (advanced)

## Advanced Configuration

### Branch Deployments

Deploy different branches to different URLs:
1. In Amplify Console, go to **"App settings"** → **"Branch management"**
2. Add new branch (e.g., `develop`)
3. Each branch gets its own URL and environment variables

### Preview Deployments

For pull requests:
1. Enable PR previews in branch settings
2. Every PR gets a preview URL
3. Perfect for testing before merging

### Custom Headers

Add security headers in `amplify.yml`:
```yaml
customHeaders:
  - pattern: '**/*'
    headers:
      - key: 'Strict-Transport-Security'
        value: 'max-age=31536000'
      - key: 'X-Content-Type-Options'
        value: 'nosniff'
```

## Support

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [AWS Support](https://console.aws.amazon.com/support/)

---

**🎉 Congratulations!** Your tarot reading app is now live on AWS Amplify!
