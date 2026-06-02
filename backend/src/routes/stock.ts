import { Router } from 'express';
import { adminDb } from '../services/firebase-admin';

const router = Router();
const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const CACHE_TTL_MINUTES = 5;

async function fetchFromAlphaVantage(ticker: string) {
  if (!ALPHA_VANTAGE_KEY) {
    const mockHistory = Array.from({ length: 30 }, (_, i) => {
      const basePrice = 150 + Math.sin(i * 0.4) * 20 + Math.random() * 5;
      return {
        time: new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10),
        open: basePrice - Math.random() * 2,
        high: basePrice + Math.random() * 5,
        low: basePrice - Math.random() * 5,
        close: basePrice + (Math.random() > 0.5 ? Math.random() * 2 : -Math.random() * 2),
      };
    });
    const latest = mockHistory[mockHistory.length - 1];
    return {
      price: latest.close,
      change: 2.5,
      change_percent: 1.67,
      history: mockHistory,
    };
  }

  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${ALPHA_VANTAGE_KEY}`;
  const res = await fetch(url);
  const data = (await res.json()) as any;

  if (!data['Time Series (Daily)']) {
    throw new Error(
      data['Note'] || data['Information'] || 'Alpha Vantage limit reached or invalid ticker.'
    );
  }

  const timeSeries = data['Time Series (Daily)'] as Record<string, Record<string, string>>;
  const dates = Object.keys(timeSeries).sort((a, b) => (a > b ? -1 : 1));

  if (dates.length < 2) {
    throw new Error('Not enough data from Alpha Vantage.');
  }

  const latestDate = dates[0];
  const prevDate = dates[1];

  const currentPrice = parseFloat(timeSeries[latestDate]['4. close']);
  const prevPrice = parseFloat(timeSeries[prevDate]['4. close']);
  const change = currentPrice - prevPrice;
  const change_percent = prevPrice ? (change / prevPrice) * 100 : 0;

  const history = dates
    .slice(0, 30)
    .reverse()
    .map((d) => ({
      time: d,
      open: parseFloat(timeSeries[d]['1. open']),
      high: parseFloat(timeSeries[d]['2. high']),
      low: parseFloat(timeSeries[d]['3. low']),
      close: parseFloat(timeSeries[d]['4. close']),
      value: parseFloat(timeSeries[d]['4. close']),
    }));

  return { price: currentPrice, change, change_percent, history };
}

router.get('/history/:ticker', async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();

  try {
    const docRef = adminDb.collection('stock_cache').doc(ticker);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      if (data && data.history) {
        const ageMs = Date.now() - new Date(data.cached_at).getTime();
        if (ageMs < CACHE_TTL_MINUTES * 60 * 1000) {
          return res.json({ ticker, history: data.history });
        }
      }
    }
  } catch (err) {
    console.error('Firebase cache read error:', err);
  }

  if (!ALPHA_VANTAGE_KEY) {
    const mockHistory = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10),
      price: 150 + Math.sin(i * 0.4) * 20 + Math.random() * 5,
    }));
    return res.json({ ticker, history: mockHistory });
  }

  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${ALPHA_VANTAGE_KEY}`;
    const response = await fetch(url);
    const data = (await response.json()) as any;

    if (!data['Time Series (Daily)']) {
      throw new Error('Alpha Vantage limit reached or invalid ticker.');
    }

    const timeSeries = data['Time Series (Daily)'] as Record<string, Record<string, string>>;
    const dates = Object.keys(timeSeries).sort((a, b) => (a > b ? -1 : 1));
    const history = dates
      .slice(0, 30)
      .reverse()
      .map((d) => ({
        date: d,
        price: parseFloat(timeSeries[d]['4. close']),
      }));

    res.json({ ticker, history });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch history';
    res.status(500).json({ error: message });
  }
});

router.get('/:ticker', async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();

  try {
    const docRef = adminDb.collection('stock_cache').doc(ticker);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      if (data) {
        const cachedAt = new Date(data.cached_at).getTime();
        const ageMs = Date.now() - cachedAt;
        if (ageMs < CACHE_TTL_MINUTES * 60 * 1000) {
          return res.json({
            ticker,
            price: data.price,
            change: data.change,
            change_percent: data.change_percent,
            history: data.history,
            cached: true,
          });
        }
      }
    }
  } catch (err) {
    console.error('Firebase cache read error:', err);
  }

  try {
    const stockData = await fetchFromAlphaVantage(ticker);

    try {
      await adminDb.collection('stock_cache').doc(ticker).set({
        ticker,
        price: stockData.price,
        change: stockData.change,
        change_percent: stockData.change_percent,
        history: stockData.history,
        cached_at: new Date().toISOString(),
      }, { merge: true });
    } catch (cacheErr) {
      console.warn('Cache upsert failed:', cacheErr);
    }

    res.json({ ticker, ...stockData, cached: false });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch stock data';
    res.status(500).json({ error: message });
  }
});

export default router;
