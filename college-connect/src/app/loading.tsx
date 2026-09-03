"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 z-[100] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[30%] w-[40vw] h-[40vw] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[30%] w-[40vw] h-[40vw] bg-cyan-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 dark:bg-cyan-500/20 blur-xl rounded-full" />
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-cyan-400 animate-spin relative z-10" />
        </div>
        
        <div className="text-center">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Loading...
          </h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Please wait
          </p>
        </div>
      </motion.div>
    </div>
  );
}
