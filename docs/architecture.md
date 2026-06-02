# Finova Architecture Overview

This document describes the high-level architecture of the **Finova AI Investment Copilot**.

## Unified Repository Layout

Finova operates as a single, unified codebase that compiles into a combined frontend and backend structure:
- **`src/app`**: Next.js App Router for all user-facing interfaces and cinematic UI features.
- **`src/server`**: Express.js backend logic, handling custom API routing, AI streaming, and secure data access.
- **`src/components`**: Shared React components using shadcn/ui and Framer Motion.
- **`server.ts`**: The unified entry point. It creates an Express server that handles `/api` routes directly and passes all other requests to the Next.js `getRequestHandler`.

## Backend Strategy

Finova uses **Firebase** (Firestore, Auth, and Storage) for robust, scalable data management, alongside **Alpha Vantage** for market data and **Google Gemini** for AI logic.

### Custom Server (Express + Next.js)
To securely handle third-party integrations (Alpha Vantage and Gemini) and long-running AI streams, we implement a custom Node server (`server.ts`):
1. **API Routes (`/api/*`)**: Handled by Express. This ensures that long-lived streaming connections and backend-only secrets are managed securely within Node.js.
2. **Frontend Routes**: Passed to Next.js. The server initializes Next.js in production or development mode and hands over rendering control for all UI paths.
3. **Authentication**: Handled via Firebase Auth on the client, with Firebase Admin SDK validating bearer tokens on the Express backend for protected API routes.

This single-server approach simplifies deployment to a single Render Web Service while maintaining a strict boundary between frontend UI code and backend API secrets.
