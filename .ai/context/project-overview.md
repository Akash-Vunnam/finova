# Finova AI Investment Copilot

A premium, full-stack AI investment copilot built entirely with **Next.js 15** and **Firebase**.

## AI Coding Instructions & Conventions

- **Next.js conventions**: This version of Next.js has specific conventions and dynamic route properties. APIs, layout conventions, and type annotations must follow strict Next.js App Router rules.
- **Firebase integration**: Always use the service layer in `src/services/` for client-side Firebase actions. Use `firebase-admin` via `src/services/firebase-admin.ts` (with Lazy JS Proxies) for all Next.js API Routes and server-side operations.
- **Strict Naming & Directory Structure**: Keep code organized in the established `apps/web/src` folder layout.

Refer to `docs/` for architecture details.
