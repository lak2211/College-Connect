"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  BookMarked,
  Video,
  ListChecks,
  User,
  MessageSquare,
  Calendar,
  Zap,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { name: "PYQs", href: "/dashboard/pyqs", icon: FileText },
  { name: "Notes", href: "/dashboard/notes", icon: BookMarked },
  { name: "Video Library", href: "/dashboard/videos", icon: Video },
  { name: "Syllabus Tracker", href: "/dashboard/syllabus", icon: ListChecks },
  { name: "Calendar & Tasks", href: "/dashboard/calendar", icon: Calendar },
  { name: "Contact Us", href: "/dashboard/contact", icon: MessageSquare },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-white/[0.05] bg-white/80 dark:bg-[#070b14]/60 backdrop-blur-2xl h-screen fixed left-0 top-0 flex flex-col z-50">
      
      {/* Background ambient light */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/5 to-transparent dark:from-cyan-500/10 pointer-events-none" />

      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200/50 dark:border-white/[0.05] mb-6 relative z-10 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 rounded-xl shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/20 group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 blur-sm translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Logo size={22} showText={false} forceLightLogo={true} />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-slate-300 flex-1">
            Academy
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pb-8 relative z-10 custom-scrollbar">
        <div className="px-2 mb-4 mt-2">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500/80">Navigation</p>
        </div>
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <div key={item.href} className="relative group block">
              {/* Active Tab Background Animation */}
              {isActive && (
                <motion.div
                  layoutId="activeNavBg"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent dark:from-cyan-500/10 dark:to-transparent rounded-xl border-l-2 border-blue-600 dark:border-cyan-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              
              <Link
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 z-10",
                  isActive
                    ? "text-blue-700 dark:text-cyan-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg transition-colors duration-300 group-hover:bg-slate-100 dark:group-hover:bg-white/[0.05]",
                  isActive ? "bg-blue-100 dark:bg-cyan-500/20" : ""
                )}>
                  <Icon className={cn(
                    "h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110", 
                    isActive ? "text-blue-700 dark:text-cyan-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  )} />
                </div>
                
                <span className="flex-1 tracking-wide transition-transform duration-300 group-hover:translate-x-1">{item.name}</span>
                
                {isActive && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    <ChevronRight className="h-4 w-4 opacity-70" />
                  </motion.div>
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Pro Hint */}
      <div className="p-4 mt-auto shrink-0 relative z-10 w-full">
        <div className="relative p-4 rounded-2xl bg-white dark:bg-[#0a0f1c]/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.05] overflow-hidden group hover:border-blue-500/30 dark:hover:border-cyan-500/30 transition-colors shadow-sm">
           <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-500/5 dark:bg-cyan-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
           
           <div className="relative z-10">
             <div className="flex items-center gap-2 mb-3">
               <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-500 group-hover:rotate-12 transition-transform">
                 <Zap className="h-3.5 w-3.5 fill-amber-500" />
               </div>
               <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.15em]">Pro Tip</p>
             </div>
             <p className="text-[11.5px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
               Press <kbd className="px-1.5 py-0.5 mx-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-[10px] font-bold shadow-sm group-hover:border-blue-300 dark:group-hover:border-cyan-500/50 transition-colors">⌘K</kbd> to search everything instantly.
             </p>
           </div>
        </div>
      </div>
    </aside>
  );
}
