"use client";

import { motion } from "framer-motion";
import { CalendarWidget } from "@/components/CalendarWidget";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CalendarPage() {
  const containerVars: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVars: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 relative">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 pointer-events-none">
        <div className="w-96 h-96 bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-3xl mix-blend-screen" />
      </div>
      <div className="absolute bottom-1/2 left-0 -translate-x-1/2 pointer-events-none">
        <div className="w-80 h-80 bg-purple-500/20 dark:bg-purple-600/10 rounded-full blur-3xl mix-blend-screen" />
      </div>

      <motion.div variants={containerVars} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div variants={itemVars} className="space-y-2">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-blue-500 transition-colors mb-2 group uppercase tracking-wider"
            >
              <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 text-white">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-violet-500">Planner</span>
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium max-w-md">
              Manage your exams, assignments, and daily study goals with our integrated calendar and task manager.
            </p>
          </motion.div>

          <motion.div variants={itemVars} className="flex items-center gap-3 bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex -space-x-2.5 overflow-hidden p-1">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden"
                >
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                </div>
              ))}
            </div>
            <div className="pr-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Peers</p>
              <p className="text-xs font-bold text-slate-800 dark:text-white">1,240 Today</p>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div variants={itemVars}>
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-500/10 to-indigo-500/5 rounded-3xl blur pointer-events-none" />
            <CalendarWidget />
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {[
            { title: "Smart Reminders", desc: "Never miss a deadline with browser notifications.", color: "blue", from: "from-blue-500/10", to: "to-blue-600/5", text: "text-blue-600 dark:text-blue-400" },
            { title: "Task Linking", desc: "Connect your to-dos directly to calendar dates.", color: "purple", from: "from-purple-500/10", to: "to-purple-600/5", text: "text-purple-600 dark:text-purple-400" },
            { title: "Daily Focus", desc: "Prioritize high-impact assignments effectively.", color: "emerald", from: "from-emerald-500/10", to: "to-emerald-600/5", text: "text-emerald-600 dark:text-emerald-400" },
          ].map((item, i) => (
            <div key={i} className="group relative overflow-hidden p-6 rounded-3xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-2 hover:shadow-lg transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${item.from} ${item.to} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <h4 className={`text-[10px] font-black ${item.text} uppercase tracking-widest mb-1`}>{item.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
