# Finova AI Investment Copilot 🚀

![Finova Banner](logo.png)

**Finova** is a next-generation AI Investment Copilot that blends cinematic UI/UX with powerful deep-research capabilities. Designed as a unified platform, Finova provides real-time market data, intelligent portfolio analytics, and a bespoke conversational agent (powered by Gemini) all within a stunning, highly-responsive glassmorphism interface.

## 🌟 Features

- **Cinematic UI/UX:** Built with React Three Fiber, Framer Motion, and Tailwind CSS for a highly immersive, premium experience.
- **AI-Powered Insights:** Integrated with Google Gemini for intelligent market breakdowns, stock verdicts, and deep-research chat.
- **Real-Time Data:** Pulls live market trends, news, and stock analytics via Alpha Vantage.
- **Secure Authentication:** Firebase Authentication manages user sessions with robust, token-based verification.
- **Decoupled Architecture:** Clean separation between the frontend and the Express backend, deployed as separate services on Render.

## 🏗️ Architecture & Tech Stack

Finova is structured as a **Monorepo** managed by [Turborepo](https://turbo.build/):

- **Frontend (`/frontend`)**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion.
- **Backend (`/backend`)**: Node.js, Express.js, TypeScript, Google Generative AI SDK, Firebase Admin SDK.
- **Shared (`/shared`)**: Shared types and utilities.
- **MCP Servers (`/mcp`)**: Integration capabilities for GitHub, Firebase, and Chrome DevTools.

## 💻 Local Development

### 1. Environment Setup

Copy the example environment files and fill in your keys.

**Frontend (`frontend/.env.local`)**:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Backend (`backend/.env`)**:
```env
PORT=8080
GEMINI_API_KEY=your_gemini_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
FIREBASE_SERVICE_ACCOUNT_KEY=your_base64_encoded_firebase_json
```

### 2. Install & Run

Install dependencies across the monorepo:
```bash
npm install
```

Start both frontend and backend development servers simultaneously:
```bash
npm run dev
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend:** [http://localhost:8080](http://localhost:8080)
- **Backend Health Check:** [http://localhost:8080/health](http://localhost:8080/health)

## 🚀 Production Deployment Guide

Finova is configured for a seamless decoupled deployment model using Render for both the Frontend and Backend.

### 1. Render (Backend)

1. Connect the repository to Render.
2. Render will automatically detect the `render.yaml` infrastructure-as-code file.
3. Provide the secret environment variables below exactly as requested:

#### Render Environment Variables

| Variable Name | Required | Expected Format | Example |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | **Yes** | String | `AIzaSyB...` |
| `ALPHA_VANTAGE_API_KEY` | **Yes** | String | `ABC123XYZ...` |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | **Yes** | Base64 Encoded JSON String or Raw JSON | `ewogICJ0e...` (Base64 is highly recommended to prevent line-break errors) |

*Note: If `FIREBASE_SERVICE_ACCOUNT_KEY` is missing or invalid, the backend will safely start up but will log a warning and Firebase-dependent routes will return 401 Unauthorized errors instead of crashing.*

### 2. Render (Frontend)

1. The frontend is automatically handled via the `render.yaml` configuration as a separate Web Service or Static Site.
2. Add the environment variables below exactly as requested to the frontend service in your Render dashboard:

#### Frontend Environment Variables

| Variable Name | Required | Expected Format | Example |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | **Yes** | String | `AIzaSyD...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | **Yes** | Domain String | `finova-app.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | **Yes** | String | `finova-app-1234` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | **Yes** | Domain String | `finova-app.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | **Yes** | Numeric String | `1234567890` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | **Yes** | String | `1:1234567890:web:abcd1234` |
| `NEXT_PUBLIC_API_URL` | **Yes** | URL String | `https://finova-backend.onrender.com` |
