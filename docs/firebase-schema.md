# Firestore Database Schemas

Finova uses Firebase Firestore (NoSQL) as its main database.

## Collections

### 1. `marketData`
Stores real-time stock quotes, prices, and sectors cached from Alpha Vantage.
- **Document ID**: `ticker` (e.g. `RELIANCE`)
- **Fields**:
  - `ticker`: string
  - `companyName`: string
  - `currentPrice`: number
  - `changePercent`: number
  - `sector`: string
  - `updatedAt`: timestamp

### 2. `users`
Stores user profile information.
- **Document ID**: `userId` (Firebase Auth UUID)
- **Fields**:
  - `name`: string
  - `email`: string
  - `memberSince`: timestamp
  - `theme`: string

#### Subcollection: `holdings`
Stores user portfolio holdings.
- **Document ID**: `ticker` (e.g. `RELIANCE`)
- **Fields**:
  - `ticker`: string
  - `companyName`: string
  - `shares`: number
  - `avgPrice`: number
  - `currentPrice`: number
  - `sector`: string
  - `color`: string
  - `addedAt`: timestamp

#### Subcollection: `transactions`
Stores user transaction history.
- **Document ID**: Auto-generated
- **Fields**:
  - `type`: string (`BUY`, `SELL`, `DEPOSIT`, `DIVIDEND`)
  - `ticker`: string | null
  - `shares`: number | null
  - `price`: number | null
  - `totalAmount`: number
  - `status`: string (`COMPLETED`, `PENDING`)
  - `createdAt`: timestamp

#### Subcollection: `chat_history`
Stores AI chat records.
- **Document ID**: Auto-generated
- **Fields**:
  - `role`: string (`user`, `model`)
  - `parts`: array of `{ text: string }`
  - `timestamp`: timestamp
