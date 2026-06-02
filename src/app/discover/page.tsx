"use client";

import { AIBriefingCard } from "./components/ai-briefing-card";
import { MarketMovers } from "./components/market-movers";
import { TrendingNews } from "./components/trending-news";

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-slate-950 pb-12 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Discover</h1>
          <p className="mt-1 text-slate-400">Your AI-curated market intelligence.</p>
        </div>

        {/* AI Briefing - Full Width */}
        <div className="mb-8">
          <AIBriefingCard />
        </div>

        {/* Two Column Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left: Market Movers */}
          <div className="lg:col-span-5">
            <MarketMovers />
          </div>

          {/* Right: Trending News */}
          <div className="lg:col-span-7">
            <TrendingNews />
          </div>
        </div>
      </div>
    </div>
  );
}
