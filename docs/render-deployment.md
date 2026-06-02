# Render Deployment Guide

Finova is designed to be deployed entirely on Render as two decoupled Web Services (Frontend and Backend) defined in a single `render.yaml` infrastructure-as-code file.

## Deployment Steps
1. Log into your Render account.
2. Click **New** -> **Blueprint**.
3. Connect your GitHub account and select the `finova-app` repository.
4. Render will automatically read the `render.yaml` file in the root and prepare to deploy both the `finova-backend` and `finova-frontend` services.
5. Review the plan and click **Apply**.

## Environment Variables
You will need to manually add the following environment variables to your respective services in the Render Dashboard after the initial creation, or set them up in the Render environment group.

### Required Backend Environment Variables (finova-backend)
Add these as Secret Environment Variables in the backend service:
```env
# Google Gemini API Key for AI Insights
GEMINI_API_KEY=your_gemini_api_key

# Alpha Vantage API Key for Market Data
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key

# Firebase Setup
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com

# Copy the entire contents of the Firebase Service Account JSON file as a single line string
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
```

### Required Frontend Environment Variables (finova-frontend)
Add these as Secret Environment Variables in the frontend service:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=https://finova-backend-abc.onrender.com
```

Wait for the deployments to finish and go "Live". Ensure the `NEXT_PUBLIC_API_URL` variable in the frontend is correctly pointing to the live backend URL. You will likely need to trigger a manual redeploy of the frontend after setting this variable.
