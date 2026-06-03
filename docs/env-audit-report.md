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
| `GEMINI_API_KEY` | `AQ.Ab8RN6LXvcjtlQUbEmy-5sOagkJN4H_MO3eHsLVXojWBNoY_wA` | REQUIRED | `.env.local` | ✅ Valid |
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
GEMINI_API_KEY=AQ.Ab8RN6LXvcjtlQUbEmy-5sOagkJN4H_MO3eHsLVXojWBNoY_wA
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCriFy-xHr6rMq6kTArLm_R32VvGhfJhBM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=finova-india-app-1234.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=finova-india-app-1234
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=finova-india-app-1234.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=696253391402
NEXT_PUBLIC_FIREBASE_APP_ID=1:696253391402:web:4029fdb6c166abbe4ad953
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"finova-india-app-1234","private_key_id":"822fee2fe102ac1fc3ca76cf33525ee4ec63d18b","private_key":"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCrq/7SizTY1I4T\\nxoMtj1OTELjdgpF5cO8VqGZwApSQg2N154b+T9ho9HguhPqM8Hw/3NtNjEI8dFZA\\npiePHsOBtqbTqp2CyqEr64QjseLixutD8U48pV+i0n7zyYcEbmP9axAu6oLxSl+O\\nHD6/RxeuUAOjEc8+ztMXy+cFXDyuXJ6+YB7X9MtNeS/n+Gb2GI8QxyiHnI5V0i5H\\nIP+gw5c7srEd+I5pbARr8Rv+rZ4fLTunVNOoYRjGkZdRE4vSMPopLKvbaCrpaqmP\\n4VvmKdyjjDZW0qBoCfGvf8cQss1Yuni0tAD3NWJuGTL79xYw3cB7Oug5LHCe63vu\\nU4iMHpw5AgMBAAECggEAJMamQsVWj2LNgvgCTwbGwRkSeUWI04q5dRrLwxAScnjr\\nHC16sk05j5Zbjp+nKv0zqNyv0EeNQvUrKxNNIzBUcpvF1k9VCdlNuKJt/tWTRMCX\\nUslFWOGWgMN2NdSEy5K4cef3Ig3T+kvT95YebQyWSp3SgaMFki9tckoYlgHh7/oG\\ndIgq7/M89j5qp6HNQ8CxX8e9PUaDwHy/V4qx1ncE+8VVZG+Qe90+EhnGRjTN9owq\\nzsBJCL3+4XpHgaoSmik7+webhRn6s58vNXt2hzS/r5MMfFPTKjd8tnbfp68vBpds\\nQ5RijNpQHo4SvjgtFsUGy8dM0b/zdb7vEW1sXj/P7wKBgQDgIdvH4UNcpKv2SBH3\\nzASBrQSH3bBl7kdwjvMg/kY7/yX2pwnOOaagF8a0fUP2eIQ7L+qxmF/A8DLKuv+5\\nd7N84kHi+imA3/28Ug5kxQDSkoMI2BMhcrjWWN2NB3KdUtzhxdn7GE4t49Y+sR4M\\n7Vslu63A9qV56qvSFuuglrW1ywKBgQDEFKReZqz3aq4Ch2Ths7FwZvn+3u8aJ4Mo\\no9HoRxolCfr17kR/s9HK2pLAj+FSw5rMysMAbc1BMzUIq09OXp0240+S3bwVRUy/\\nD2fWvg1Q60S2JRygqd6pI1kmlEDlF+HJPcalizqEovJ9ePkMyK6aQm0T1udT9azY\\nMgoahznViwKBgDUZ8H9HsHT3ksJTyuYBkSPEASnLbSqJLKXPSG0NsUgvqCfq5VjV\\nsdOGLo6+iuaPIQ0AykLvTehhQDdl3IZthLnWxTNof4LIDs6aRky7m/lHuwHSZ53q\\nFz65aSwrko0Rf8GB5aYm2QboTu8leXAooAqtj3oDNatP3Qt2YLb4Xe7HAoGAb5z0\\nZ0v43ylZfdUGJre7pCjp2xuZbQDa1vJRVO/MQRMqSH1lfm+kVt0ONhBwiUUQw8wT\\nLhZShO+aG6IwFYMj6I+Bxy7ylgUJh6RETmeGeu5BAZGkdwva09psL9qqCf4LJxtE\\nDQ1wtPlwIN4QnidJxENVhbqJmTA6QCJTwAADersCgYEAtPguj1Y4q/PEJj3Z00ED\\nyPJpT4uRI8Ep5qXpmYYfgQLw8XSnKv+wGfXeQKnEZNQe3yQdfkl7sFcJtBH+GcdU\\nfiOEpVp4xg8LMAJQshm7JAAbnhc3uwP5/CIlRD7/OIz3mvdxOR2Fuy18vJ7uwO/I\\nLxTau8Ehnv/3da57dLsprZ0=\\n-----END PRIVATE KEY-----\\n","client_email":"firebase-adminsdk-fbsvc@finova-india-app-1234.iam.gserviceaccount.com","client_id":"114375633468015863107","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40finova-india-app-1234.iam.gserviceaccount.com","universe_domain":"googleapis.com"}'
```
*(Remember to replace the remaining placeholder for ALPHA_VANTAGE before deploying)*

========================
## SAFE TO REMOVE
==============
**None.** All variables listed in `.env.example` and `.env.local` are actively being used in the codebase.
