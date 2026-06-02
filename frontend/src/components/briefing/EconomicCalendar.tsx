"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { TiltCard } from "./TiltCard";

const events = [
  { time: "Today 2:30 PM", title: "US GDP Q1 Final", forecast: "2.1%", previous: "1.6%", impact: "High", impactColor: "bg-rose-500" },
  { time: "Tomorrow 10:00 AM", title: "RBI MPC Meeting Outcome", forecast: "Repo 6.5%", previous: "6.5%", impact: "High", impactColor: "bg-rose-500" },
  { time: "Jun 2, 8:00 PM", title: "US Non-Farm Payrolls", forecast: "185K", previous: "175K", impact: "Medium", impactColor: "bg-amber-500" },
  { time: "Jun 3, 6:00 AM", title: "India PMI Manufacturing", forecast: "58.2", previous: "58.1", impact: "Low", impactColor: "bg-emerald-500" },
];

export function EconomicCalendar() {
  return (
    <TiltCard id="economic-calendar" className="hover:border-amber-500/30 transition-colors duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
          <Calendar className="text-amber-400" size={20} />
        </div>
        <h2 className="text-2xl font-semibold text-white">Economic Calendar</h2>
      </div>

      <div className="relative pl-4 md:pl-8">
        {/* Vertical Timeline Line */}
        <motion.div 
          initial={{ height: 0 }}
          whileInView={{ height: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute left-[8px] md:left-[32px] top-2 bottom-2 w-px bg-white/10 origin-top"
        />

        <div className="space-y-8">
          {events.map((event, i) => (
            <div key={i} className="relative flex items-start gap-6 md:gap-8 group">
              {/* Timeline Dot */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className={`absolute left-[-21px] md:left-[-9px] top-1.5 w-3 h-3 rounded-full border-2 border-slate-900 ${event.impactColor} shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:scale-125 transition-transform`}
              />
              
              {/* Time */}
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="w-24 md:w-32 shrink-0 pt-0.5"
              >
                <span className="text-slate-400 text-xs md:text-sm font-mono">{event.time}</span>
              </motion.div>

              {/* Content */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="flex-1 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-4 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <h3 className="text-white font-medium">{event.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${event.impactColor}/20 text-white border border-white/10 w-fit`}>
                    {event.impact} Impact
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <div>Forecast: <span className="text-slate-200">{event.forecast}</span></div>
                  <div>Previous: <span className="text-slate-200">{event.previous}</span></div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </TiltCard>
  );
}
