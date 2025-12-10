# GitHub Setup Instructions

## Step 1: Create the Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `tarot-card-reader`
3. Description: `A beautiful Next.js application featuring motivational quotes and authentic tarot card readings with real card images and professional interpretations.`
4. Choose **Public** (or Private if you prefer)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

## Step 2: Connect and Push

After creating the repository, run:

```bash
./setup-github.sh
```

Or manually:

```bash
git remote add origin https://github.com/BusterFranken/tarot-card-reader.git
git branch -M main
git push -u origin main
```

## Alternative: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:BusterFranken/tarot-card-reader.git
git branch -M main
git push -u origin main
```

## What's Already Done

✅ Project renamed to "tarot-card-reader"  
✅ Git repository initialized  
✅ All files committed  
✅ Branch renamed to `main`  
✅ README.md updated with project description  
✅ Package.json updated with new name  

## Next Steps After Pushing

1. Your repository will be live at: https://github.com/BusterFranken/tarot-card-reader
2. You can set up GitHub Pages or deploy to Vercel/Netlify
3. Add topics/tags: `nextjs`, `react`, `tarot`, `typescript`, `tailwindcss`

