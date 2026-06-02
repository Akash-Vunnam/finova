# GitHub Setup Guide

This project is prepared as a clean, pristine git repository.

## Commands to Push
Execute these directly in the VS Code terminal (or standard terminal) from the `d:\Finova` root:

```bash
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/finova-app.git
git push -u origin main
```

## Workflows Included
- **Frontend Build Validation**: Located at `.github/workflows/frontend-build.yml`. Runs `npm run build` on the Render-optimized Next.js frontend for every PR.
- **Backend Build Validation**: Located at `.github/workflows/backend-build.yml`. Runs `npm run build` on the Render-optimized Node.js/Express backend for every PR.

Ensure you do not commit any files outside of the `.gitignore` rules.
