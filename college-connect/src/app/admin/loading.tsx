"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[30%] w-[40vw] h-[40vw] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[30%] w-[40vw] h-[40vw] bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 flex flex-col items-center gap-6 p-8 rounded-[2rem] bg-white/50 dark:bg-[#070b14]/50 backdrop-blur-2xl border border-slate-200 dark:border-white/[0.05] shadow-2xl"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 dark:bg-purple-500/20 blur-xl rounded-full" />
          <Loader2 className="w-12 h-12 text-indigo-600 dark:text-purple-400 animate-spin relative z-10" />
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Loading...
          </h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Preparing Admin Panel
          </p>
        </div>
      </motion.div>
    </div>
  );
}
