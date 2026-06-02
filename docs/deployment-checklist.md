# Finova Deployment Checklist

## 1. Initial Checks (Local)
- [x] Codebase audited (no API keys, sensitive tokens committed)
- [x] `npm run build` succeeds locally
- [x] `.env.example` templates verify the exact schema
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

## 4. Render Deployment (Backend)
- [ ] Create a new "Web Service" from the GitHub repo
- [ ] Specify Root Directory as `backend`
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] Inject required Backend Environment Variables
- [ ] Wait for `Live` status and copy the `.onrender.com` URL

## 5. Render Deployment (Frontend)
- [ ] Ensure `render.yaml` is configured to deploy the `frontend` service
- [ ] Inject required Frontend Environment Variables into the Render frontend service
- [ ] Inject `NEXT_PUBLIC_API_URL` matching the Render backend URL
- [ ] Deploy and verify the live production site
