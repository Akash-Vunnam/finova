'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickSeries } from 'lightweight-charts';
import { motion } from 'framer-motion';

interface OHLCData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface StockChartProps {
  data: OHLCData[];
  color?: string;
}

const TIMEFRAMES = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

export default function StockChart({ data, color = "#8b5cf6" }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [activeTimeframe, setActiveTimeframe] = useState('1M');
  
  const [tooltipData, setTooltipData] = useState<{
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    change: number;
    x: number;
    y: number;
    visible: boolean;
  } | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data || data.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'rgba(255, 255, 255, 0.5)',
        fontFamily: 'Outfit, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.04)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.04)' },
      },
      crosshair: {
        mode: 0, // Normal mode
        vertLine: {
          color: 'rgba(255, 255, 255, 0.25)',
          width: 1,
          style: 1, // Dashed
          labelVisible: true,
          labelBackgroundColor: '#8b5cf6',
        },
        horzLine: {
          color: 'rgba(255, 255, 255, 0.25)',
          width: 1,
          style: 1, // Dashed
          labelVisible: true,
          labelBackgroundColor: '#8b5cf6',
        },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.06)',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.06)',
      },
      watermark: {
        visible: true,
        fontSize: 56,
        fontFamily: 'Outfit, sans-serif',
        color: 'rgba(255, 255, 255, 0.015)',
        text: 'FINOVA',
        horzAlign: 'center',
        vertAlign: 'center',
      },
      autoSize: true,
    } as any);

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10B981',
      downColor: '#EF4444',
      borderVisible: true,
      borderColor: '#10B981',
      borderUpColor: '#10B981',
      borderDownColor: '#EF4444',
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    });

    let filteredData = data;
    const now = new Date();
    
    if (activeTimeframe !== 'ALL') {
      let days = 30;
      if (activeTimeframe === '1D') days = 1;
      if (activeTimeframe === '1W') days = 7;
      if (activeTimeframe === '1M') days = 30;
      if (activeTimeframe === '3M') days = 90;
      if (activeTimeframe === '1Y') days = 365;
      
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - days);
      
      filteredData = data.filter(d => new Date(d.time) >= cutoff);
      
      // Ensure we always have at least some data points for the chart to render
      if (filteredData.length < 5 && data.length >= 5) {
        filteredData = data.slice(-Math.max(5, days));
      } else if (filteredData.length === 0) {
        filteredData = data;
      }
    }

    candlestickSeries.setData(filteredData as any);
    chart.timeScale().fitContent();

    chartRef.current = chart;
    seriesRef.current = candlestickSeries as any;

    // Crosshair movement hook for premium floating details card
    chart.subscribeCrosshairMove((param) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.y < 0
      ) {
        setTooltipData(null);
        return;
      }

      const dataPoint = param.seriesData.get(candlestickSeries) as OHLCData | undefined;
      if (!dataPoint) {
        setTooltipData(null);
        return;
      }

      const change = ((dataPoint.close - dataPoint.open) / dataPoint.open) * 100;
      
      setTooltipData({
        time: dataPoint.time.toString(),
        open: dataPoint.open,
        high: dataPoint.high,
        low: dataPoint.low,
        close: dataPoint.close,
        change,
        x: param.point.x,
        y: param.point.y,
        visible: true,
      });
    });

    return () => {
      chart.remove();
    };
  }, [data, color, activeTimeframe]);

  // Adjust tooltip positioning to fit inside container bounds
  let tooltipX = 0;
  let tooltipY = 0;
  if (tooltipData && chartContainerRef.current) {
    const rect = chartContainerRef.current.getBoundingClientRect();
    tooltipX = tooltipData.x + 15;
    tooltipY = tooltipData.y + 15;
    if (tooltipX + 160 > rect.width) {
      tooltipX = tooltipData.x - 175;
    }
    if (tooltipY + 140 > rect.height) {
      tooltipY = tooltipData.y - 150;
    }
  }

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col relative group/chart">
      {/* Premium Timeframe Selector */}
      <div className="flex items-center gap-2 mb-4 bg-white/[0.02] border border-white/5 w-fit p-1 rounded-xl">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => setActiveTimeframe(tf)}
            className={`relative px-3.5 py-1.5 text-xs font-black transition-all rounded-lg z-10 ${
              activeTimeframe === tf ? 'text-white' : 'text-white/45 hover:text-white hover:bg-white/5'
            }`}
          >
            {activeTimeframe === tf && (
              <motion.div
                layoutId="active-timeframe"
                className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-lg -z-10 shadow-[0_0_16px_rgba(139,92,246,0.4)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {tf}
          </button>
        ))}
      </div>
      
      {/* Chart Wrapper Container with entrance animate */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex-1 w-full relative"
      >
        <div ref={chartContainerRef} className="w-full h-full" />
        
        {/* TradingView Tooltip */}
        {tooltipData && tooltipData.visible && (
          <div 
            className="absolute pointer-events-none z-30 bg-[#141423]/95 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-75 text-[11px] min-w-[155px]"
            style={{
              left: tooltipX,
              top: tooltipY,
            }}
          >
            <div className="text-white/60 font-black mb-1.5 tracking-wide uppercase">{tooltipData.time}</div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono font-medium">
              <span className="text-white/40 text-left">Open:</span>
              <span className="text-white font-bold text-right">₹{tooltipData.open.toFixed(2)}</span>
              <span className="text-white/40 text-left">High:</span>
              <span className="text-white font-bold text-right">₹{tooltipData.high.toFixed(2)}</span>
              <span className="text-white/40 text-left">Low:</span>
              <span className="text-white font-bold text-right">₹{tooltipData.low.toFixed(2)}</span>
              <span className="text-white/40 text-left">Close:</span>
              <span className="text-white font-bold text-right">₹{tooltipData.close.toFixed(2)}</span>
              <span className="text-white/40 text-left">Change:</span>
              <span className={`font-black text-right ${tooltipData.change >= 0 ? 'text-finova-green' : 'text-finova-red'}`}>
                {tooltipData.change >= 0 ? '+' : ''}{tooltipData.change.toFixed(2)}%
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

