export const DEMO_PORTFOLIO = {
  totalValue: 452340,
  totalGain: 87340,
  gainPercentage: 23.95,
  investmentPeriod: "18 months",
  holdings: [
    { symbol: "RELIANCE", shares: 10, avgBuy: 2850, currentPrice: 2934.50 },
    { symbol: "TCS", shares: 5, avgBuy: 3650, currentPrice: 3847.15 },
    { symbol: "INFY", shares: 15, avgBuy: 1720, currentPrice: 1856.20 },
    { symbol: "HDFCBANK", shares: 12, avgBuy: 1580, currentPrice: 1642.35 },
    { symbol: "TATAMOTORS", shares: 25, avgBuy: 620, currentPrice: 685.00 },
  ],
  allocation: {
    equity: 65,
    debt: 25,
    cash: 10
  }
};

export const INDIAN_STOCK_RANGES = {
  RELIANCE: { min: 2800, max: 3100, avg: 2950 },
  TCS: { min: 3700, max: 4000, avg: 3850 },
  INFY: { min: 1700, max: 1900, avg: 1800 },
  HDFCBANK: { min: 1550, max: 1700, avg: 1625 },
  TATAMOTORS: { min: 600, max: 750, avg: 675 },
  ICICIBANK: { min: 950, max: 1100, avg: 1025 },
  SBIN: { min: 600, max: 750, avg: 675 },
  ITC: { min: 400, max: 450, avg: 425 },
};
