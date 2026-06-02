# Firebase Deployment Guide

Finova uses Firebase for its core Authentication and Firestore database management.

## Deployment Steps
1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and create a new project called "Finova App" (or similar).
3. **Authentication:**
   - Go to Build -> Authentication -> Get Started.
   - Enable the **Email/Password** and **Google** sign-in providers.
4. **Firestore Database:**
   - Go to Build -> Firestore Database -> Create Database.
   - Start in Production Mode.
   - Go to the **Rules** tab and paste the exact contents of your local `firestore.rules` file to secure user portfolios.
5. **Storage:**
   - Go to Build -> Storage -> Get Started.
   - Start in Production Mode.
   - Go to the **Rules** tab and paste the exact contents of your local `storage.rules` file.
6. **Project Settings & Service Account:**
   - Go to Project Settings (gear icon) -> General.
   - Register a Web App. Copy the `firebaseConfig` object variables and paste them into your Render Environment Variables for the frontend service (`NEXT_PUBLIC_FIREBASE_*`).
   - Go to Project Settings -> Service Accounts.
   - Click **Generate New Private Key**. A JSON file will download.
   - Copy the *entire contents* of this JSON file, remove all newlines so it becomes a single string, and paste it into the Render Environment Variables for the backend service as `FIREBASE_SERVICE_ACCOUNT_KEY`.
