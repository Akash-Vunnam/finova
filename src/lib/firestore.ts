import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, 
  deleteDoc, query, where, orderBy, onSnapshot,
  addDoc, serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// ========== USER PROFILE ==========
export async function getUserProfile(userId: string) {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateUserProfile(userId: string, data: any) {
  const ref = doc(db, 'users', userId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

// ========== HOLDINGS ==========
export async function getHoldings(userId: string) {
  const ref = collection(db, 'users', userId, 'holdings');
  const snap = await getDocs(ref);
  return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
}

export async function addHolding(userId: string, holding: any) {
  const ref = collection(db, 'users', userId, 'holdings');
  return await addDoc(ref, { ...holding, addedAt: serverTimestamp() });
}

export async function updateHolding(userId: string, holdingId: string, data: any) {
  const ref = doc(db, 'users', userId, 'holdings', holdingId);
  await updateDoc(ref, data);
}

export async function deleteHolding(userId: string, holdingId: string) {
  await deleteDoc(doc(db, 'users', userId, 'holdings', holdingId));
}

// ========== TRANSACTIONS ==========
export async function getTransactions(userId: string, limitCount?: number) {
  const ref = collection(db, 'users', userId, 'transactions');
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  const results = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  return limitCount ? results.slice(0, limitCount) : results;
}

export async function addTransaction(userId: string, tx: any) {
  const ref = collection(db, 'users', userId, 'transactions');
  return await addDoc(ref, { ...tx, createdAt: serverTimestamp() });
}

export async function getMarketData() {
  const ref = collection(db, 'marketData');
  const snap = await getDocs(ref);
  return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
}

export async function getMarketDataRealtime(callback: (data: any[]) => void) {
  const ref = collection(db, 'marketData');
  return onSnapshot(ref, (snap: any) => {
    callback(snap.docs.map((d: any) => ({ id: d.id, ...d.data() })));
  });
}

// ========== INSIGHTS ==========
export async function getInsights(userId: string) {
  const ref = collection(db, 'insights');
  const q = query(ref, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
}

// ========== REALTIME SUBSCRIPTIONS ==========
export function subscribeToHoldings(userId: string, callback: (data: any[]) => void) {
  const ref = collection(db, 'users', userId, 'holdings');
  return onSnapshot(ref, (snap: any) => {
    callback(snap.docs.map((d: any) => ({ id: d.id, ...d.data() })));
  });
}

export function subscribeToPortfolioValue(userId: string, callback: (value: number) => void) {
  return subscribeToHoldings(userId, (holdings) => {
    const total = holdings.reduce((sum: number, h: any) => 
      sum + (h.currentPrice || h.avgPrice) * h.shares, 0
    );
    callback(total);
  });
}
