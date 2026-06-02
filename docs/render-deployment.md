# Render Deployment Guide

Finova is designed to be deployed entirely on Render as a single unified Web Service defined in the `render.yaml` infrastructure-as-code file.

## Deployment Steps
1. Log into your Render account.
2. Click **New** -> **Blueprint**.
3. Connect your GitHub account and select the `finova-app` repository.
4. Render will automatically read the `render.yaml` file in the root and prepare to deploy the `finova-fullstack` service.
5. Review the plan and click **Apply**.

## Environment Variables
You will need to manually add the following environment variables to your service in the Render Dashboard after the initial creation, or set them up in the Render environment group.

### Required Environment Variables (finova-fullstack)
Add these as Secret Environment Variables in the service:
```env
# Google Gemini API Key for AI Insights
GEMINI_API_KEY=your_gemini_api_key

# Alpha Vantage API Key for Market Data
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key

# Firebase Admin Setup

# Copy the entire contents of the Firebase Service Account JSON file as a single line string
# Base64 is recommended to avoid line-break errors
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}

# Firebase Public Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Wait for the deployment to finish and go "Live". 
The service will boot up both the Next.js renderer and the Express backend API on the same port, making the application fully accessible.
