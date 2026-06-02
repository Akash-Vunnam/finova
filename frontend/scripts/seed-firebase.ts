import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

const db = getFirestore(app);

const seedData = async () => {
  // Market Data
  const marketStocks = [
    { ticker: 'RELIANCE', companyName: 'Reliance Industries', currentPrice: 2450.30, changePercent: 1.25, sector: 'Conglomerate' },
    { ticker: 'TCS', companyName: 'Tata Consultancy Services', currentPrice: 3890.50, changePercent: 2.10, sector: 'IT' },
    { ticker: 'INFY', companyName: 'Infosys', currentPrice: 1420.75, changePercent: 0.85, sector: 'IT' },
    { ticker: 'HDFCBANK', companyName: 'HDFC Bank', currentPrice: 1680.20, changePercent: -0.45, sector: 'Banking' },
    { ticker: 'TATAMOTORS', companyName: 'Tata Motors', currentPrice: 780.50, changePercent: 3.20, sector: 'Auto' },
    { ticker: 'ZOMATO', companyName: 'Zomato', currentPrice: 124.30, changePercent: 5.05, sector: 'Tech' },
    { ticker: 'WIPRO', companyName: 'Wipro', currentPrice: 485.60, changePercent: 1.50, sector: 'IT' },
    { ticker: 'SBIN', companyName: 'State Bank of India', currentPrice: 620.40, changePercent: 0.75, sector: 'Banking' },
    { ticker: 'ADANIENT', companyName: 'Adani Enterprises', currentPrice: 2890.60, changePercent: -1.20, sector: 'Conglomerate' },
    { ticker: 'BHARTIARTL', companyName: 'Bharti Airtel', currentPrice: 945.30, changePercent: 0.90, sector: 'Telecom' },
  ];

  for (const stock of marketStocks) {
    await setDoc(doc(db, 'marketData', stock.ticker), {
      ...stock,
      updatedAt: new Date(),
    });
  }

  // Demo User Profile
  await setDoc(doc(db, 'users', 'demo-user'), {
    name: 'Priya Sharma',
    email: 'priya@finova.in',
    memberSince: new Date('2024-01-01'),
    theme: 'dark',
    accentColor: 'purple',
    notifications: true,
    autoAnalysis: true,
  });

  // Demo Holdings
  const holdings = [
    { ticker: 'RELIANCE', companyName: 'Reliance Industries', shares: 50, avgPrice: 2300.00, currentPrice: 2450.30, sector: 'Conglomerate', color: '#8B5CF6' },
    { ticker: 'TCS', companyName: 'Tata Consultancy Services', shares: 20, avgPrice: 3600.00, currentPrice: 3890.50, sector: 'IT', color: '#10B981' },
    { ticker: 'INFY', companyName: 'Infosys', shares: 30, avgPrice: 1350.00, currentPrice: 1420.75, sector: 'IT', color: '#EF4444' },
    { ticker: 'HDFCBANK', companyName: 'HDFC Bank', shares: 40, avgPrice: 1600.00, currentPrice: 1680.20, sector: 'Banking', color: '#3B82F6' },
  ];

  for (let i = 0; i < holdings.length; i++) {
    await setDoc(doc(db, 'users', 'demo-user', 'holdings', `holding_${i}`), {
      ...holdings[i],
      addedAt: new Date(),
    });
  }

  // Demo Transactions
  const transactions = [
    { type: 'BUY', ticker: 'RELIANCE', shares: 50, price: 2300.00, totalAmount: 115000.00, status: 'COMPLETED' },
    { type: 'DEPOSIT', ticker: null, shares: null, price: null, totalAmount: 500000.00, status: 'COMPLETED' },
    { type: 'SELL', ticker: 'TATAMOTORS', shares: 100, price: 750.00, totalAmount: 75000.00, status: 'COMPLETED' },
    { type: 'DIVIDEND', ticker: 'RELIANCE', shares: null, price: null, totalAmount: 2500.00, status: 'COMPLETED' },
  ];

  for (let i = 0; i < transactions.length; i++) {
    await setDoc(doc(db, 'users', 'demo-user', 'transactions', `tx_${i}`), {
      ...transactions[i],
      createdAt: new Date(Date.now() - i * 86400000), // Staggered dates
    });
  }

  console.log('Seed complete!');
};

seedData();
