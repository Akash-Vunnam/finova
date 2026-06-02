# Finova Architecture Overview

This document describes the high-level architecture of the **Finova AI Investment Copilot**.

## Monorepo Layout

Finova is managed as a monorepo utilizing npm workspaces and Turborepo:
- **`apps/web`**: Next.js App Router frontend and API route handlers.
- **`packages/shared`**: Shared packages containing models, validation schema structures, and helper logic.
- **`firebase`**: Firebase config files and rules files, enabling easy deployment and environment synchronization.

## Backend Strategy

Finova uses **Firebase** (Firestore, Auth, and Storage) exclusively. 

### Server-side Caching (Next.js Route Handlers)
To keep stock prices cached and handle third-party integrations (Alpha Vantage and Gemini) securely, we implement Next.js API Routes:
1. They call `src/services/firebase-admin.ts`.
2. They use a JS **Proxy** for the Firebase Admin SDK to ensure no initialization crashes occur when running static Next.js compilation phases.
3. Once authenticated through the JWT token header, CRUD and stock cache operations are processed with zero-latency.
