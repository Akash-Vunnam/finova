export interface MarketMover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sparklineData: number[];
}

export interface NewsItem {
  id: string;
  category: "TECHNOLOGY" | "ECONOMY" | "AUTOMOTIVE" | "BANKING" | "MARKETS";
  source: string;
  timeAgo: string;
  title: string;
  summary: string;
  readTime: string;
  imageUrl?: string;
  url?: string;
}

export interface AIBriefing {
  title: string;
  generatedAt: string;
  summary: string;
  keyPoints: string[];
  sentiment: "Bullish" | "Bearish" | "Neutral";
  niftyLevel: number;
  sensexLevel: number;
}

export const TODAY_BRIEFING: AIBriefing = {
  title: "AI Daily Briefing",
  generatedAt: "Generated just now",
  summary: "Indian markets are rallying pre-market, driven by stronger-than-expected IT earnings from TCS and Infosys. Infrastructure stocks are gaining momentum ahead of the Union Budget. However, FMCG stocks remain under pressure amid rural inflation concerns.",
  keyPoints: [
    "Nifty 50 closed at 23,450, up 0.85% with IT and Banking leading",
    "TCS Q4 results beat estimates: Revenue up 8.2% YoY, margins expand to 26.4%",
    "RBI maintains repo rate at 6.5%; stance remains 'withdrawal of accommodation'",
    "FII net buying at ₹2,340 Cr today; DIIs remain net sellers at ₹890 Cr"
  ],
  sentiment: "Bullish",
  niftyLevel: 23450.85,
  sensexLevel: 77342.30
};

export const TOP_GAINERS: MarketMover[] = [
  { symbol: "RELIANCE", name: "Reliance Ind", price: 2934.50, change: 45.20, changePercent: 1.56, sparklineData: [2890, 2895, 2902, 2910, 2905, 2915, 2920, 2928, 2934] },
  { symbol: "TCS", name: "Tata Consultancy", price: 3847.15, change: 62.40, changePercent: 1.65, sparklineData: [3785, 3790, 3805, 3810, 3820, 3830, 3835, 3840, 3847] },
  { symbol: "INFY", name: "Infosys Ltd", price: 1856.20, change: 28.50, changePercent: 1.56, sparklineData: [1828, 1830, 1835, 1840, 1842, 1848, 1850, 1853, 1856] },
  { symbol: "TATAMOTORS", name: "Tata Motors", price: 952.30, change: 18.75, changePercent: 2.01, sparklineData: [934, 936, 938, 940, 942, 945, 948, 950, 952] },
];

export const TOP_LOSERS: MarketMover[] = [
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", price: 1642.35, change: -18.50, changePercent: -1.12, sparklineData: [1660, 1658, 1655, 1652, 1650, 1648, 1646, 1644, 1642] },
  { symbol: "WIPRO", name: "Wipro Ltd", price: 480.30, change: -12.40, changePercent: -2.52, sparklineData: [493, 492, 490, 488, 486, 484, 482, 481, 480] },
  { symbol: "ITC", name: "ITC Ltd", price: 420.45, change: -8.30, changePercent: -1.93, sparklineData: [429, 428, 427, 426, 425, 424, 423, 422, 420] },
  { symbol: "SBIN", name: "State Bank", price: 758.20, change: -9.15, changePercent: -1.19, sparklineData: [767, 766, 765, 764, 762, 761, 760, 759, 758] },
];

export const TRENDING_NEWS: NewsItem[] = [
  {
    id: "1",
    category: "TECHNOLOGY",
    source: "Economic Times",
    timeAgo: "2h ago",
    title: "Indian IT sector sees record margins amidst AI adoption",
    summary: "TCS, Infosys, and Wipro report highest operating margins in 8 quarters as AI-led automation reduces delivery costs.",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=300&fit=crop",
    url: "https://m.economictimes.com/tech/information-tech/indian-it-faces-ai-reset-as-top-5-firms-post-mixed-fy26/articleshow/130531230.cms"
  },
  {
    id: "2",
    category: "ECONOMY",
    source: "Mint",
    timeAgo: "4h ago",
    title: "RBI hints at stable repo rates for upcoming quarter",
    summary: "Governor Das signals no immediate rate cuts as inflation hovers near 4.8%, maintaining focus on price stability.",
    readTime: "3 min read",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop",
    url: "https://www.livemint.com/money/personal-finance/rbi-monetary-policy-next-week-what-fixed-income-investors-should-expect-heres-what-experts-say-11779970135356.html"
  },
  {
    id: "3",
    category: "AUTOMOTIVE",
    source: "Moneycontrol",
    timeAgo: "5h ago",
    title: "Tata Motors EV sales hit new milestone in domestic market",
    summary: "Tata Motors sells 8,500 electric vehicles in May, capturing 62% market share as charging infrastructure expands.",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=400&fit=crop",
    url: "https://www.moneycontrol.com/automobile/tata-motors-to-raise-ev-production-capacity-by-50-amid-demand-surge-md-ceo-shailesh-chandra-article-13934852.html"
  },
  {
    id: "4",
    category: "BANKING",
    source: "Business Standard",
    timeAgo: "6h ago",
    title: "SBI reports highest quarterly profit, declares ₹7.10 dividend",
    summary: "State Bank of India posts record net profit of ₹17,666 Cr in Q4, up 24% YoY. Board recommends final dividend of ₹7.10 per share.",
    readTime: "3 min read",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=400&fit=crop",
    url: "https://www.business-standard.com/markets/news/sbi-q4-results-preview-fy26-profit-nii-dividend-estimates-126050600115_1.html"
  }
];
