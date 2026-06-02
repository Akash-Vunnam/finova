import { Router } from 'express';
import { adminDb, verifyFirebaseToken } from '../services/firebase-admin';

const router = Router();

router.get('/', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.slice(7);
  const user = await verifyFirebaseToken(token);

  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  try {
    const snap = await adminDb.collection('users').doc(user.id).collection('holdings').get();
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    res.status(500).json({ error: message });
  }
});

router.post('/', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.slice(7);
  const user = await verifyFirebaseToken(token);

  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const { ticker, shares, buy_price } = req.body;

  if (!ticker || shares == null || buy_price == null) {
    return res.status(400).json({ error: 'ticker, shares, and buy_price are required' });
  }

  try {
    const uppercaseTicker = ticker.toUpperCase();
    const docRef = adminDb.collection('users').doc(user.id).collection('holdings').doc(uppercaseTicker);
    const dataObj = {
      user_id: user.id,
      ticker: uppercaseTicker,
      shares,
      buy_price,
      updated_at: new Date().toISOString(),
    };
    await docRef.set(dataObj, { merge: true });
    
    res.json({ status: 'success', data: [dataObj] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    res.status(500).json({ error: message });
  }
});

router.delete('/', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.slice(7);
  const user = await verifyFirebaseToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const ticker = req.query.ticker as string;

  if (!ticker) {
    return res.status(400).json({ error: 'ticker query param is required' });
  }

  try {
    await adminDb.collection('users').doc(user.id).collection('holdings').doc(ticker.toUpperCase()).delete();
    res.json({ status: 'deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    res.status(500).json({ error: message });
  }
});

export default router;
