"use client";

import { Newspaper, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { TRENDING_NEWS } from "@/lib/constants/discover-data";
import { getCategoryColor } from "@/lib/utils/indian-market";

export function TrendingNews() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Newspaper className="h-5 w-5 text-indigo-400" />
        <h3 className="font-semibold text-white">Trending News</h3>
      </div>

      <div className="space-y-4">
        {TRENDING_NEWS.map((news, index) => {
          const CardWrapper = news.url ? 'a' as any : 'article';
          const wrapperProps = news.url ? { href: news.url, target: "_blank", rel: "noopener noreferrer" } : {};
          
          return (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + (index * 0.1) }}
            >
              <CardWrapper 
                {...wrapperProps}
                className="group block relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-5 shadow-lg shadow-black/20 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] hover:-translate-y-0.5"
              >
                {/* Pulse Dot at Top Right */}
                <span className="absolute top-5 right-5 flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                
                <div className="flex gap-4">
                {/* Image Placeholder or Real Image */}
                <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl">
                  {news.imageUrl ? (
                    <img 
                      src={news.imageUrl} 
                      alt={news.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                      <Newspaper className="h-8 w-8 text-white/20" />
                    </div>
                  )}
                  <div className="absolute left-2 top-2">
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getCategoryColor(news.category)}`}>
                      {news.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="mb-1 flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <span className="text-slate-400">{news.source}</span>
                      <span>•</span>
                      <span>{news.timeAgo}</span>
                    </div>
                    <h4 className="mb-1 line-clamp-2 font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {news.title}
                    </h4>
                    <p className="line-clamp-2 text-sm text-slate-400">
                      {news.summary}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500">{news.readTime}</span>
                    <span className="flex items-center gap-1 text-sm font-medium text-emerald-400 group-hover:gap-2 transition-all">
                      Read Full Article <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            </CardWrapper>
          </motion.div>
        );
        })}
      </div>
    </div>
  );
}
