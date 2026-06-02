# Finova Deployment Checklist

## 1. Initial Checks (Local)
- [x] Codebase audited (no API keys, sensitive tokens committed)
- [x] `npm run build` succeeds locally
- [x] `.env.local` templates verify the exact schema
- [x] Tested locally via `npm run dev` with Chrome DevTools MCP (0 errors, 1 warning for THREE.Clock deprecation)

## 2. GitHub Deployment
- [ ] Create remote repo (e.g., `finova-app`)
- [ ] Ensure `.gitignore` is active and correct
- [ ] Push to `main` branch
- [ ] Check if GitHub Actions workflows pass for build validation

## 3. Firebase Deployment
- [ ] Create a new project in the Firebase Console
- [ ] Enable Authentication (Email/Password, Google Sign-In)
- [ ] Create a Firestore database
- [ ] Apply Security Rules (from `firestore.rules`)
- [ ] Set up Firebase Storage bucket and apply rules
- [ ] Generate a Service Account JSON for Render backend

## 4. Render Deployment (Single Web Service)
- [ ] Create a new "Web Service" from the GitHub repo, or use `render.yaml`
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] Inject required Frontend and Backend Environment Variables (including Gemini, Alpha Vantage, and Firebase variables)
- [ ] Wait for `Live` status and copy the `.onrender.com` URL

## 5. Verification
- [ ] Ensure API endpoints return successfully.
- [ ] Verify frontend authentication behaves seamlessly.
