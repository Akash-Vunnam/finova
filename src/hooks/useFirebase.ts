import { useEffect, useState } from 'react';
import { 
  getHoldings, getTransactions, getMarketData, 
  getUserProfile, subscribeToHoldings, subscribeToPortfolioValue 
} from '@/services/firestore';

export function useHoldings(userId: string = 'demo-user') {
  const [holdings, setHoldings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    getHoldings(userId).then(data => {
      setHoldings(data);
      setLoading(false);
    });

    // Realtime subscription
    const unsub = subscribeToHoldings(userId, setHoldings);
    return () => unsub();
  }, [userId]);

  return { holdings, loading };
}

export function usePortfolioValue(userId: string = 'demo-user') {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToPortfolioValue(userId, (val) => {
      setValue(val);
      setLoading(false);
    });
    return () => unsub();
  }, [userId]);

  return { value, loading };
}

export function useTransactions(userId: string = 'demo-user') {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTransactions(userId).then(data => {
      setTransactions(data);
      setLoading(false);
    });
  }, [userId]);

  return { transactions, loading };
}

export function useMarketData() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMarketData().then(data => {
      setData(data);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function useUserProfile(userId: string = 'demo-user') {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile(userId).then(data => {
      setProfile(data);
      setLoading(false);
    });
  }, [userId]);

  return { profile, loading };
}
