"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen, FileText, Video, BookMarked, ArrowRight, BookA, GraduationCap, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const containerVars = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVars = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function CoursesPage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setMounted(true);
  }, []);

  if (!mounted || status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="animate-pulse font-medium">Loading your courses...</p>
      </div>
    );
  }

  const user = session?.user as { name?: string; email?: string; role?: string; course?: string; branch?: string; semester?: string; subjects?: string[] };
  const subjects: string[] = user?.subjects || [];

  // Format description logic based on available details
  const courseDetails = [user?.course, user?.branch].filter(Boolean).join(" - ");
  const semesterStr = user?.semester ? `Semester ${user.semester}` : "";
  const subtitle = [courseDetails, semesterStr].filter(Boolean).join(" • ");

  return (
    <motion.div 
      variants={containerVars} 
      initial="hidden" 
      animate="show" 
      className="space-y-8 pb-10 relative"
    >
      {/* Global Dashboard Aurora for this page */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] dark:bg-purple-600/10 blur-[130px] rounded-full mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] dark:bg-cyan-500/10 blur-[130px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      <motion.div variants={itemVars} className="relative z-10">
        <div className="flex flex-col space-y-3 relative p-8 md:p-12 rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#070b14]/80 backdrop-blur-3xl border border-slate-200 dark:border-white/[0.08] shadow-xl group">
          {/* Ambient Lights for Banner */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-cyan-500/20 dark:via-blue-500/20 dark:to-purple-500/20 opacity-50 pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-400/40 dark:bg-cyan-500/40 rounded-full blur-[80px] pointer-events-none animate-pulse-slow group-hover:scale-150 transition-transform duration-1000" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-400/40 dark:bg-violet-500/40 rounded-full blur-[80px] pointer-events-none animate-pulse-slow group-hover:scale-150 transition-transform duration-1000" style={{ animationDelay: "2s" }} />

          <div className="absolute right-0 top-1/2 -translate-y-1/2 p-12 opacity-10 pointer-events-none">
            <motion.div
              animate={{ y: [-10, 10, -10], rotate: [12, 16, 12] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <GraduationCap className="w-48 h-48 md:w-64 md:h-64" />
            </motion.div>
          </div>
          
          <div className="relative z-10 w-full">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-violet-500">Enrolled Subjects</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-medium max-w-2xl leading-relaxed">
              {subtitle ? subtitle : "Your active academic curriculum"}
            </p>
            <div className="mt-8 flex gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-blue-50 dark:bg-white/[0.05] backdrop-blur-md px-5 py-2.5 rounded-2xl text-sm font-bold border border-blue-100 dark:border-white/[0.1] flex items-center text-blue-700 dark:text-blue-300 shadow-sm"
              >
                <BookA className="w-5 h-5 mr-2.5 text-blue-600 dark:text-blue-400" />
                {subjects.length} Subjects Active
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {subjects.length === 0 ? (
        <motion.div variants={itemVars} className="text-center py-24 bg-white dark:bg-[#0a0f1c]/60 backdrop-blur-md rounded-[2.5rem] border border-dashed border-slate-300 dark:border-white/[0.1] shadow-sm relative z-10">
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }} 
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <BookMarked className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-6" />
          </motion.div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">No subjects found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto text-base leading-relaxed">It look like you haven&apos;t completed your onboarding profile properly, or you have no subjects assigned.</p>
          <Link href="/onboarding" className={cn(buttonVariants({ variant: "default" }), "mt-8 rounded-full px-8 py-4 bg-blue-600 hover:bg-blue-700 font-bold text-base shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_10px_40px_rgba(37,99,235,0.4)] transition-all")}>
            Complete Profile Setup
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 relative z-10">
          {subjects.map((sub, i) => {
            const code = `SUB-${user?.semester || 1}${String(i + 1).padStart(2, '0')}`;
            const credits = 3 + (i % 2);

            return (
              <motion.div key={i} variants={itemVars} className="h-full">
                <Card className="group relative h-full overflow-hidden rounded-[2rem] border border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#0a0f1c]/80 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(34,211,238,0.15)] hover:border-blue-500/30 dark:hover:border-cyan-500/30 hover:-translate-y-2 flex flex-col">
                  {/* Card Ambient Glow */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 dark:bg-cyan-500/20 blur-[50px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-white/[0.02] dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <CardHeader className="pb-4 pt-6 px-6 relative z-10 flex-none">
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-cyan-400 text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-500/20">
                        {code}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black tracking-wider bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05] px-3 py-1.5 rounded-lg">
                        {credits} CR
                      </span>
                    </div>
                    <CardTitle className="text-lg md:text-xl leading-tight font-black text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 dark:group-hover:from-cyan-400 dark:group-hover:to-blue-500 transition-all">
                      {sub}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0 pb-6 px-6 relative z-10 flex-grow">
                    <div className="grid grid-cols-2 gap-3 text-sm font-bold">
                      {[
                        { name: "Notes", icon: BookMarked, color: "text-indigo-500 dark:text-indigo-400", bgHover: "hover:bg-indigo-50 dark:hover:bg-indigo-500/10", borderHover: "hover:border-indigo-200 dark:hover:border-indigo-500/30", href: `/dashboard/notes?subject=${encodeURIComponent(sub)}` },
                        { name: "PYQs", icon: FileText, color: "text-emerald-500 dark:text-emerald-400", bgHover: "hover:bg-emerald-50 dark:hover:bg-emerald-500/10", borderHover: "hover:border-emerald-200 dark:hover:border-emerald-500/30", href: `/dashboard/pyqs?subject=${encodeURIComponent(sub)}` },
                        { name: "Videos", icon: Video, color: "text-rose-500 dark:text-rose-400", bgHover: "hover:bg-rose-50 dark:hover:bg-rose-500/10", borderHover: "hover:border-rose-200 dark:hover:border-rose-500/30", href: `/dashboard/videos?subject=${encodeURIComponent(sub)}` },
                        { name: "Syllabus", icon: BookOpen, color: "text-amber-500 dark:text-amber-400", bgHover: "hover:bg-amber-50 dark:hover:bg-amber-500/10", borderHover: "hover:border-amber-200 dark:hover:border-amber-500/30", href: `/dashboard/syllabus?subject=${encodeURIComponent(sub)}` },
                      ].map((item, idx) => (
                        <Link key={idx} href={item.href} className={`flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] ${item.bgHover} border border-transparent ${item.borderHover} transition-all duration-300 group/link`}>
                          <div className={`p-2 rounded-lg bg-white dark:bg-white/[0.05] shadow-sm group-hover/link:scale-110 transition-transform ${item.color}`}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <span className="text-slate-700 dark:text-slate-300 tracking-wide">{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 pb-6 px-6 relative z-10 mt-auto">
                    <Link href={`/dashboard/syllabus?subject=${encodeURIComponent(sub)}`} className="w-full h-12 flex items-center justify-between px-6 rounded-xl bg-slate-100 dark:bg-white/[0.05] text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white dark:hover:bg-cyan-500 dark:hover:text-slate-900 transition-all duration-300 group/btn overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 dark:from-cyan-400 dark:to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">View Course</span>
                      <ArrowRight className="relative z-10 h-5 w-5 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-2 transition-all duration-300" />
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
