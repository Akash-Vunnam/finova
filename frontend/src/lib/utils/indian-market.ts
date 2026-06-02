export function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatStockPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    TECHNOLOGY: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    ECONOMY: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    AUTOMOTIVE: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    BANKING: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    MARKETS: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  };
  return colors[category] || "bg-slate-500/20 text-slate-300";
}
