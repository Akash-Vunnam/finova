# Finova AI Investment Copilot 🚀

![Finova Banner](logo.png)

**Finova** is a next-generation AI Investment Copilot that blends cinematic UI/UX with powerful deep-research capabilities. Designed as a unified platform, Finova provides real-time market data, intelligent portfolio analytics, and a bespoke conversational agent (powered by Gemini) all within a stunning, highly-responsive glassmorphism interface.

## 🌟 Features

- **Cinematic UI/UX:** Built with React Three Fiber, Framer Motion, and Tailwind CSS for a highly immersive, premium experience.
- **AI-Powered Insights:** Integrated with Google Gemini for intelligent market breakdowns, stock verdicts, and deep-research chat.
- **Real-Time Data:** Pulls live market trends, news, and stock analytics via Alpha Vantage.
- **Secure Authentication:** Firebase Authentication manages user sessions with robust, token-based verification.
- **Decoupled Architecture:** Clean separation between the Vercel-hosted frontend and the Render-hosted Express backend, orchestrated by Turborepo.

## 🏗️ Architecture & Tech Stack

Finova is structured as a **Monorepo** managed by [Turborepo](https://turbo.build/):

- **Frontend (`/frontend`)**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion.
- **Backend (`/backend`)**: Node.js, Express.js, TypeScript, Google Generative AI SDK, Firebase Admin SDK.
- **Shared (`/shared`)**: Shared types and utilities.
- **MCP Servers (`/mcp`)**: Integration capabilities for GitHub, Firebase, and Chrome DevTools.

## 💻 Local Development

### Prerequisites
- Node.js (v20+ recommended)
- npm or pnpm
- Firebase Project setup
- API Keys (Gemini, Alpha Vantage)

### 1. Environment Setup

Copy the example environment files and fill in your keys.

**Frontend (`frontend/.env.local`)**:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

**Backend (`backend/.env`)**:
```env
GEMINI_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
JWT_SECRET=
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

## 🚀 Deployment

Finova is configured for a seamless decoupled deployment model.

### Vercel (Frontend)
1. Import the GitHub repository into Vercel.
2. Set the **Root Directory** to `frontend`.
3. Add the `NEXT_PUBLIC_*` environment variables.
4. After the backend is deployed, add `NEXT_PUBLIC_API_URL=https://<your-backend-url>.onrender.com` to point frontend API calls to Render.

### Render (Backend)
1. Connect the repository to Render.
2. Render will automatically detect the `render.yaml` infrastructure-as-code file.
3. Provide the secret environment variables (`GEMINI_API_KEY`, `ALPHA_VANTAGE_API_KEY`, `FIREBASE_SERVICE_ACCOUNT_KEY`).
4. Deploy the service.

## 🤝 Contributing
Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## 🛡️ Security
Please see [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
