# Troubleshooting Deployment Issues

If you encounter issues deploying Finova to Vercel or Render, check these common pitfalls first.

## 1. Vercel Fails to Build
**Symptom:** Vercel deployment fails with an error complaining about missing packages (like `@google/generative-ai` or `firebase-admin`).
**Cause:** Vercel is trying to build the backend instead of the frontend.
**Fix:** Go to your Vercel Project Settings -> General -> Root Directory. Ensure it is set exactly to `frontend`.

**Symptom:** Turbopack or PostCSS errors in the Vercel logs.
**Cause:** Vercel might be caching a bad build.
**Fix:** Trigger a new deployment in Vercel with the "Use Build Cache" option turned **OFF**.

## 2. Render Backend Crashes on Startup
**Symptom:** Render logs say `listen EADDRINUSE: address already in use :::8080`.
**Cause:** Render dynamically assigns the `$PORT` environment variable. If your Express server is hardcoded to 8080, it will conflict with Render's internal routing.
**Fix:** The backend is already coded to use `process.env.PORT || 8080`. Ensure that you have NOT manually overridden the `PORT` variable in Render to something static unless Render explicitly requires it (Render handles the port automatically in Web Services).

**Symptom:** Firebase Admin throws initialization errors in Render logs.
**Cause:** The `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable is malformed.
**Fix:** Ensure you pasted the exact, complete JSON string. Example format: `{"type": "service_account", "project_id": "..."}` without arbitrary line breaks.

## 3. UI Doesn't Match the Live Backend
**Symptom:** You deploy the backend, but the Vercel frontend is still making API calls to `localhost`.
**Cause:** The `NEXT_PUBLIC_API_URL` environment variable is missing on Vercel.
**Fix:** Add `NEXT_PUBLIC_API_URL=https://<your-render-url>.onrender.com` to Vercel's environment variables and **REDEPLOY**. Next.js statically bakes public variables at build time, so a new build is strictly required after changing `NEXT_PUBLIC_` variables.
