# Finova AI Coding Conventions

These standards ensure clean, robust, and maintainable code across the codebase.

## Formatting & Naming
- **Files**: Use kebab-case for files (e.g. `user-service.ts`, `stock-chart.tsx`).
- **Components**: PascalCase for React components (e.g. `StockChart.tsx`).
- **Hooks**: CamelCase with `use` prefix (e.g. `useAuth.ts`).
- **Imports**: Group imports as follows:
  1. React/Next.js core modules
  2. Libraries and packages (e.g. `lucide-react`, `lightweight-charts`)
  3. Absolute aliases (`@/components`, `@/services`)
  4. Relative modules (`./`, `../`)

## Firebase Coding Standards
- **Client operations**: Always fetch through client service interfaces in `src/services/` (such as `firestore.ts` and `auth.ts`).
- **Server operations**: Use `src/services/firebase-admin.ts` in API routes. Avoid initializing raw admin SDK instances inline.
- **Proxy usage**: Keep proxies in place inside `firebase-admin.ts` to allow smooth Next.js compilation phases.
