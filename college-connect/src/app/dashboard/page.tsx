"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, PlayCircle, BookOpen, Clock, Flame, Sparkles, Zap, Trophy, ChevronRight, Target, TrendingUp, Award, Loader2, ArrowUpRight
} from "lucide-react";
import { CalendarWidget } from "@/components/CalendarWidget";

interface Recommendation {
  title: string;
  subject: string;
  type: "PYQ" | "Notes" | "Video";
  url?: string;
}

const containerVars = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVars = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } }
};

export default function DashboardHomePage() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(" ")[0] || "Student";
  const [mounted, setMounted] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchRecs = async () => {
      try {
        const res = await fetch("/api/user/recommendations");
        if (res.ok) {
          const data = await res.json();
          setRecommendations(data.recommendations || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingRecs(false);
      }
    };
    fetchRecs();
  }, []);

  if (!mounted) return null;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="relative">
      {/* Global Dashboard Aurora */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] dark:bg-purple-600/10 blur-[130px] rounded-full mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] dark:bg-cyan-500/10 blur-[130px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[40%] left-[20%] w-[40vw] h-[40vw] dark:bg-blue-500/5 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: "4s" }} />
      </div>

    <motion.div variants={containerVars} initial="hidden" animate="show" className="relative z-10 space-y-8 pb-12">
      
      {/* Welcome Header */}
      <motion.div 
        variants={itemVars} 
        className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#070b14]/80 backdrop-blur-3xl border border-slate-200 dark:border-white/[0.08] shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-cyan-500/20 dark:via-blue-500/20 dark:to-purple-500/20 opacity-50 pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-400/40 dark:bg-cyan-500/40 rounded-full blur-[80px] pointer-events-none animate-pulse-slow group-hover:scale-150 transition-transform duration-1000" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-400/40 dark:bg-violet-500/40 rounded-full blur-[80px] pointer-events-none animate-pulse-slow group-hover:scale-150 transition-transform duration-1000" style={{ animationDelay: "2s" }} />
        
        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="text-blue-600 dark:text-cyan-400 font-black text-xs uppercase tracking-[0.3em] mb-3">{greeting()}</motion.p>
            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-violet-500">{userName}!</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="text-slate-500 dark:text-slate-400 max-w-xl text-base font-medium leading-relaxed">
              Explore your personalized dashboard to find new resources, track your goals, and master your courses seamlessly.
            </motion.p>
          </div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 30 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="hidden md:block relative perspective-[1000px]"
          >
            <motion.div
              animate={{ y: [-10, 10, -10], rotateZ: [-2, 2, -2], rotateX: [5, -5, 5] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <Image src="/grad_cap.png" width={160} height={160} alt="Goal" className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] dark:drop-shadow-[0_20px_40px_rgba(34,211,238,0.2)]" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={containerVars} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Syllabus", value: "0%", icon: Award, gradient: "from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-500", glow: "bg-emerald-500", borderHover: "hover:border-emerald-500/50 dark:hover:border-emerald-400/50", shadowHover: "hover:shadow-[0_10px_30px_rgba(16,185,129,0.2)] dark:hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)]" },
          { label: "Resources", value: "0", icon: FileText, gradient: "from-blue-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600", glow: "bg-cyan-500", borderHover: "hover:border-blue-500/50 dark:hover:border-cyan-500/50", shadowHover: "hover:shadow-[0_10px_30px_rgba(59,130,246,0.2)] dark:hover:shadow-[0_10px_30px_rgba(34,211,238,0.15)]" },
          { label: "View Time", value: "0h", icon: TrendingUp, gradient: "from-purple-600 to-pink-600 dark:from-violet-500 dark:to-purple-500", glow: "bg-violet-500", borderHover: "hover:border-purple-500/50 dark:hover:border-violet-500/50", shadowHover: "hover:shadow-[0_10px_30px_rgba(168,85,247,0.2)] dark:hover:shadow-[0_10px_30px_rgba(139,92,246,0.15)]" },
          { label: "Streak", value: "0 Days", icon: Flame, gradient: "from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-500", glow: "bg-orange-500", borderHover: "hover:border-orange-500/50 dark:hover:border-orange-400/50", shadowHover: "hover:shadow-[0_10px_30px_rgba(249,115,22,0.2)] dark:hover:shadow-[0_10px_30px_rgba(251,146,60,0.15)]" },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVars} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-full">
            <div className={`bg-white dark:bg-[#0a0f1c]/60 backdrop-blur-md border border-slate-200 dark:border-white/[0.05] rounded-[2rem] p-6 transition-all duration-300 text-center flex flex-col items-center justify-center shadow-sm h-full relative overflow-hidden group ${stat.borderHover} ${stat.shadowHover}`}>
              
              {/* Dynamic Backlight Orb */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 ${stat.glow}/30 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700 pointer-events-none`} />
              
              {/* Icon Box */}
              <div className={`w-14 h-14 md:w-16 md:h-16 mx-auto rounded-2xl mb-4 flex items-center justify-center text-white bg-gradient-to-br ${stat.gradient} shadow-lg shadow-black/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 relative z-10`}>
                <stat.icon className={`h-7 w-7 md:h-8 md:w-8`} />
              </div>

              {/* Text Data */}
              <p className="relative z-10 text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-1.5 tracking-tight">{stat.value}</p>
              <p className="relative z-10 text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-[0.15em] leading-tight">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Links */}
          <motion.section variants={itemVars}>
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-6 uppercase tracking-[0.15em] flex items-center gap-3">
              <Zap className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "Notes", href: "/dashboard/notes", icon: FileText, gradient: "from-blue-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600" },
                { name: "PYQs", href: "/dashboard/pyqs", icon: BookOpen, gradient: "from-orange-500 to-red-500 dark:from-fuchsia-500 dark:to-pink-500" },
                { name: "Videos", href: "/dashboard/videos", icon: PlayCircle, gradient: "from-purple-600 to-pink-600 dark:from-violet-500 dark:to-purple-500" },
                { name: "Syllabus", href: "/dashboard/syllabus", icon: Target, gradient: "from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-500" },
              ].map((link) => (
                <Link key={link.name} href={link.href} className="block h-full group">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white dark:bg-[#0a0f1c]/60 backdrop-blur-md p-6 rounded-[2rem] border border-slate-200 dark:border-white/[0.05] transition-all text-center group-hover:border-blue-500/50 dark:group-hover:border-cyan-500/50 shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_10px_30px_rgba(34,211,238,0.1)] h-full flex flex-col items-center justify-center relative overflow-hidden"
                  >
                    <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white mb-4 bg-gradient-to-br ${link.gradient} shadow-lg shadow-black/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500`}>
                      <link.icon className="h-6 w-6" />
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm tracking-wide">{link.name}</p>
                    <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-slate-300 dark:text-slate-600 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>

          {/* AI Recommendations */}
          <motion.section variants={itemVars} className="relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-[0.15em] flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Recommendations
              </h3>
            </div>
            
            <div className="space-y-4">
              {loadingRecs ? (
                <div className="p-12 text-center bg-white dark:bg-[#0a0f1c]/50 backdrop-blur-md rounded-[2rem] border border-dashed border-slate-200 dark:border-white/[0.1] flex flex-col items-center gap-4">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                  <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">Scanning Course Library...</p>
                </div>
              ) : recommendations.length > 0 ? (
                recommendations.map((rec, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, type: "spring" }}
                    whileHover={{ x: 8, scale: 1.01 }} 
                  >
                    <Link href={rec.url || "#"} className="flex items-center gap-5 p-5 bg-white dark:bg-[#0a0f1c]/60 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/[0.05] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 shadow-sm hover:shadow-md dark:hover:border-cyan-500/30 relative overflow-hidden group">
                      <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-transparent group-hover:bg-gradient-to-b group-hover:from-cyan-400 group-hover:to-blue-600 transition-all rounded-l-3xl" />
                      
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-colors shrink-0">
                        {rec.type === "Video" ? <PlayCircle className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white leading-tight truncate text-base group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-500 transition-all">{rec.title}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> {rec.subject} <span className="opacity-50">•</span> {rec.type}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white text-slate-400 transition-all shrink-0">
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="p-16 text-center bg-white dark:bg-[#0a0f1c]/50 backdrop-blur-xl rounded-[2rem] border border-dashed border-slate-200 dark:border-white/[0.1]">
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">No recommendations found. Keep exploring to generate suggestions!</p>
                </div>
              )}
            </div>
          </motion.section>
        </div>

        {/* Sidebar Column (1 col) */}
        <div className="space-y-8">
          
          {/* Goal Card */}
          <motion.div variants={itemVars} whileHover={{ scale: 1.02 }} className="rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl cursor-default bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-cyan-600 dark:via-blue-600 dark:to-indigo-800">
             <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/20 dark:bg-white/10 rounded-full blur-[80px]" />
             <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-400/30 rounded-full blur-[80px]" />
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
             
             <div className="relative z-10">
               <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                 <Trophy className="h-7 w-7 text-white drop-shadow-md" />
               </div>
               <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70 mb-2">Today's Dominance</p>
               <h3 className="text-3xl font-black mb-8 leading-tight">Complete Set Goals</h3>
               
               <div className="space-y-3 bg-black/20 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
                 <div className="flex justify-between text-xs font-black tracking-wider">
                    <span className="text-white/80">PROGRESS</span>
                    <span className="text-white">0%</span>
                 </div>
                 <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-white/50 to-white rounded-full relative"
                    >
                      <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]" />
                    </motion.div>
                 </div>
               </div>
             </div>
          </motion.div>

          {/* Activity */}
          <motion.div variants={itemVars}>
            <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#0a0f1c]/80 backdrop-blur-xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="p-8 relative z-10">
                <h4 className="font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
                  <Clock className="h-5 w-5 text-slate-400 dark:text-violet-400" />
                  Recent History
                </h4>
                <div className="text-center py-10 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No recent activity logged yet.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Calendar */}
          <motion.div variants={itemVars} className="rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-200 dark:border-white/[0.05] relative z-10 bg-white dark:bg-[#0a0f1c]/80 backdrop-blur-xl p-2">
            <CalendarWidget compact={true} />
          </motion.div>

        </div>
      </div>
    </motion.div>
    </div>
  );
}
