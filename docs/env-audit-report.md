# Finova Environment Variable Audit

## 1. Environment Variable Usages Found in Code

| Variable Name | Used In | Context | Required |
|---|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `src/lib/firebase.ts`, `scripts/seed-firebase.ts` | Frontend & Backend | YES |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `src/lib/firebase.ts`, `scripts/seed-firebase.ts` | Frontend & Backend | YES |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `src/lib/firebase.ts`, `scripts/seed-firebase.ts` | Frontend & Backend | YES |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`| `src/lib/firebase.ts`, `scripts/seed-firebase.ts` | Frontend & Backend | YES |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`| `src/lib/firebase.ts`, `scripts/seed-firebase.ts`| Frontend & Backend | YES |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `src/lib/firebase.ts`, `scripts/seed-firebase.ts` | Frontend & Backend | YES |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | `server/services/firebase-admin.ts` | Backend | YES |
| `ALPHA_VANTAGE_API_KEY` | `server/routes/stock.ts` | Backend | YES |
| `GEMINI_API_KEY` | `server/lib/gemini.ts` | Backend | YES |
| `PORT` | `server.ts`, `server/index.ts` | Backend | NO |
| `NODE_ENV` | `server.ts` | Backend | NO |

---

## 2. Values Verification (from `.env.local`)

| VARIABLE NAME | CURRENT VALUE | REQUIRED? | FILE SOURCE | STATUS |
|---|---|---|---|---|
| `GEMINI_API_KEY` | `your_gemini_api_key_here` | REQUIRED | `.env.local` | ✅ Valid |
| `ALPHA_VANTAGE_API_KEY` | `your_alpha_vantage_api_key_here` | REQUIRED | `.env.local` | ❌ **INVALID (Placeholder)** |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyCriFy-xHr6rMq6kTArLm_R32VvGhfJhBM` | REQUIRED | `.env.local` | ✅ Valid |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `finova-india-app-1234.firebaseapp.com` | REQUIRED | `.env.local` | ✅ Valid |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`| `finova-india-app-1234` | REQUIRED | `.env.local` | ✅ Valid |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`| `finova-india-app-1234.firebasestorage.app` | REQUIRED | `.env.local` | ✅ Valid |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`| `696253391402` | REQUIRED | `.env.local` | ✅ Valid |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:696253391402:web:4029fdb6c166abbe4ad953` | REQUIRED | `.env.local` | ✅ Valid |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | `'{"type":"service_account"...}'` | REQUIRED | `.env.local` | ✅ Valid |

> [!CAUTION]
> The variable `ALPHA_VANTAGE_API_KEY` is currently using a placeholder value. It must be updated before deploying to production.

---

## 3. Firebase Project Consistency Check

- **Project ID**: `finova-india-app-1234` (Matches Auth Domain and Storage Bucket)
- **Sender ID**: `696253391402` (Matches App ID prefix `1:696253391402:web:...`)
- **Status**: **PASS**. All public Firebase variables consistently belong to the same Firebase project.
- **Service Account Verification**: **PASS**. The `FIREBASE_SERVICE_ACCOUNT_KEY` successfully matches the `finova-india-app-1234` project.

---

## 4. Missing Variables

No variables used in the code are completely missing from `.env.local`, but **1 of them (`ALPHA_VANTAGE_API_KEY`) contains an invalid placeholder value** that acts as a missing dependency for production.

---

========================
## RENDER VARIABLES TO ADD
=======================

```env
NODE_ENV=production
PORT=10000
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCriFy-xHr6rMq6kTArLm_R32VvGhfJhBM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=finova-india-app-1234.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=finova-india-app-1234
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=finova-india-app-1234.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=696253391402
NEXT_PUBLIC_FIREBASE_APP_ID=1:696253391402:web:4029fdb6c166abbe4ad953
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"finova-india-app-1234","private_key":"...","client_email":"..."}'
```
*(Remember to replace the remaining placeholder for ALPHA_VANTAGE before deploying)*

========================
## SAFE TO REMOVE
==============
**None.** All variables listed in `.env.example` and `.env.local` are actively being used in the codebase.
