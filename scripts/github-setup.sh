#!/bin/bash
set -e

echo "Initializing Git repository..."
git init
git add .
git commit -m "Initial commit: Production restructuring"

echo "Creating GitHub repository..."
# Assumes gh cli is installed and authenticated
gh repo create finova --private --source=. --remote=origin

echo "Configuring branches..."
git branch -M main

echo "Pushing to GitHub..."
git push -u origin main

echo "GitHub setup complete!"
