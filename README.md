# Finova AI Investment Copilot 🚀

![Finova Banner](logo.png)

**Finova** is a next-generation AI Investment Copilot that blends cinematic UI/UX with powerful deep-research capabilities. Designed as a unified platform, Finova provides real-time market data, intelligent portfolio analytics, and a bespoke conversational agent (powered by Gemini) all within a stunning, highly-responsive glassmorphism interface.

## 🌟 Features

- **Cinematic UI/UX:** Built with React Three Fiber, Framer Motion, and Tailwind CSS for a highly immersive, premium experience.
- **AI-Powered Insights:** Integrated with Google Gemini for intelligent market breakdowns, stock verdicts, and deep-research chat.
- **Real-Time Data:** Pulls live market trends, news, and stock analytics via Alpha Vantage.
- **Secure Authentication:** Firebase Authentication manages user sessions with robust, token-based verification.
- **Unified Architecture:** A single full-stack Next.js Custom Server application, deployed as a single service on Render.

## 🏗️ Architecture & Tech Stack

Finova is structured as a **Single Full-Stack Application**:

- **Frontend Core**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion.
- **Backend API**: A custom Express server (`server.ts`) that handles Gemini API streams, Firebase Admin SDK integration, and custom routing, while handing over UI routes to Next.js.
- **Integration**: `server.ts` combines the Express backend (`/api/*`) and the Next.js frontend into a single, unified port.

## 💻 Local Development

### 1. Environment Setup

Copy the example environment files and fill in your keys. Create a `.env.local` file at the root of the project:

```env
PORT=10000
NODE_ENV=development

# Backend Secrets
GEMINI_API_KEY=your_gemini_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
FIREBASE_SERVICE_ACCOUNT_KEY=your_base64_encoded_firebase_json

# Frontend Public Keys
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Install & Run

Install dependencies:
```bash
npm install
```

Start the unified development server:
```bash
npm run dev
```

- **Application:** [http://localhost:10000](http://localhost:10000)
- **Backend Health Check:** [http://localhost:10000/health](http://localhost:10000/health)

## 🚀 Production Deployment Guide

Finova is configured for a seamless single-service deployment using Render.

### Render Deployment Steps

1. Connect the repository to Render.
2. Render will automatically detect the `render.yaml` infrastructure-as-code file.
3. This creates a single Web Service called `finova-fullstack`.
4. Provide the secret environment variables below exactly as requested:

#### Render Environment Variables

| Variable Name | Required | Expected Format | Example |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | **Yes** | String | `AIzaSyB...` |
| `ALPHA_VANTAGE_API_KEY` | **Yes** | String | `ABC123XYZ...` |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | **Yes** | Base64 Encoded JSON String or Raw JSON | `ewogICJ0e...` (Base64 is highly recommended) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | **Yes** | String | `AIzaSyD...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | **Yes** | Domain String | `finova-app.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | **Yes** | String | `finova-app-1234` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | **Yes** | Domain String | `finova-app.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | **Yes** | Numeric String | `1234567890` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | **Yes** | String | `1:1234567890:web:abcd1234` |

*Note: If `FIREBASE_SERVICE_ACCOUNT_KEY` is missing or invalid, the backend will safely start up but will log a warning and Firebase-dependent routes will return 401 Unauthorized errors instead of crashing.*
