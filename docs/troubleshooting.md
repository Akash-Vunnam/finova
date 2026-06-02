# Troubleshooting Deployment Issues

If you encounter issues deploying Finova to Render, check these common pitfalls first.

## 1. Render Frontend Fails to Build
**Symptom:** Render deployment fails with an error complaining about missing packages.
**Cause:** Render might be running the build command from the root instead of the `frontend` folder.
**Fix:** Ensure the Build Command for the frontend service in `render.yaml` or Render dashboard specifies `cd frontend && npm install && npm run build`.

## 2. Render Backend Crashes on Startup
**Symptom:** Render logs say `listen EADDRINUSE: address already in use :::8080`.
**Cause:** Render dynamically assigns the `$PORT` environment variable. If your Express server is hardcoded to 8080, it will conflict with Render's internal routing.
**Fix:** The backend is already coded to use `process.env.PORT || 8080`. Ensure that you have NOT manually overridden the `PORT` variable in Render to something static unless Render explicitly requires it (Render handles the port automatically in Web Services).

**Symptom:** Firebase Admin throws initialization errors in Render logs.
**Cause:** The `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable is malformed.
**Fix:** Ensure you pasted the exact, complete JSON string. Example format: `{"type": "service_account", "project_id": "..."}` without arbitrary line breaks.

## 3. UI Doesn't Match the Live Backend
**Symptom:** You deploy the backend, but the frontend is still making API calls to `localhost`.
**Cause:** The `NEXT_PUBLIC_API_URL` environment variable is missing on Render.
**Fix:** Add `NEXT_PUBLIC_API_URL=https://<your-backend-url>.onrender.com` to Render's environment variables for the frontend service and **REDEPLOY**. Next.js statically bakes public variables at build time, so a new build is strictly required after changing `NEXT_PUBLIC_` variables.
