#!/bin/bash

# Script to connect this project to GitHub
# Run this after creating the repository on GitHub

echo "🚀 Setting up GitHub repository for Buster's Tarot Card Reader"
echo ""

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
    echo "⚠️  Remote 'origin' already exists. Removing it..."
    git remote remove origin
fi

# Add the remote
echo "📦 Adding GitHub remote..."
git remote add origin https://github.com/BusterFranken/tarot-card-reader.git

# Verify remote
echo ""
echo "✅ Remote added. Current remotes:"
git remote -v

echo ""
echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done! Your repository is now on GitHub:"
echo "   https://github.com/BusterFranken/tarot-card-reader"

