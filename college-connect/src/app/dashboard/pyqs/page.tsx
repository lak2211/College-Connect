"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen, Download, Eye, X, Search,
  FileText, Loader2, ExternalLink, FolderOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PYQ {
  _id: string;
  title: string;
  subject: string;
  year?: number;
  fileUrl?: string;
  course: string;
  createdAt: string;
}

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

export default function PYQsPage() {
  const { data: session } = useSession();
  const [pyqs, setPyqs] = useState<PYQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");
  const [mounted, setMounted] = useState(false);
  const [userSubjects, setUserSubjects] = useState<string[]>([]);
  const [activeSubject, setActiveSubject] = useState("All");

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setMounted(true);
  }, []);

  // Fetch user's selected subjects
  useEffect(() => {
    const sessionSubjects = (session?.user as { subjects?: string[] })?.subjects;
    if (sessionSubjects && sessionSubjects.length > 0) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setUserSubjects(sessionSubjects);
    } else {
      fetch("/api/user/profile")
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data?.subjects) setUserSubjects(data.subjects); })
        .catch(() => { });
    }
  }, [session]);

  // Fetch PYQs
  useEffect(() => {
    const fetchPYQs = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/resources?type=PYQ");
        if (res.ok) {
          const data = await res.json();
          setPyqs(data);
        }
      } catch (err) {
        console.error("Failed to fetch PYQs:", err);
      }
      setLoading(false);
    };
    fetchPYQs();
  }, []);

  if (!mounted) return null;

  // Filter PYQs by user subjects and active filter
  const userPyqs = userSubjects.length > 0
    ? pyqs.filter(p => userSubjects.includes(p.subject))
    : pyqs;

  const filtered = userPyqs.filter(p => {
    if (activeSubject !== "All" && p.subject !== activeSubject) return false;
    if (searchQuery.trim() && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.subject.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Count per subject
  const getCount = (sub: string) => userPyqs.filter(p => p.subject === sub).length;

  const openPreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
        <p className="animate-pulse font-medium">Loading PYQs...</p>
      </div>
    );
  }

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8 pb-10 relative">
      {/* Global Dashboard Aurora for this page */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] dark:bg-amber-600/10 blur-[130px] rounded-full mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] dark:bg-orange-500/10 blur-[130px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <motion.div variants={itemVars} className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative p-8 md:p-10 rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#070b14]/80 backdrop-blur-3xl border border-slate-200 dark:border-white/[0.08] shadow-xl group">
          {/* Ambient Lights for Banner */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-rose-500/5 dark:from-amber-500/10 dark:via-orange-500/10 dark:to-rose-500/10 opacity-50 pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-amber-400/40 dark:bg-amber-500/30 rounded-full blur-[80px] pointer-events-none animate-pulse-slow group-hover:scale-150 transition-transform duration-1000" />
          
          <div className="relative z-10 flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/30 text-white group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
              <BookOpen className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Previous Year <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Questions</span></h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium max-w-xl">Download and preview past exam papers for your subjects seamlessly.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Subject Tabs & Search Column */}
      <motion.div variants={itemVars} className="relative z-10 grid gap-6 md:flex md:items-center md:justify-between">
        {userSubjects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSubject("All")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeSubject === "All"
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105"
                : "bg-white dark:bg-[#0a0f1c]/60 backdrop-blur-md border border-slate-200 dark:border-white/[0.05] text-slate-600 dark:text-slate-400 hover:border-amber-500/50 dark:hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400"
                }`}
            >
              All ({userPyqs.length})
            </button>
            {userSubjects.map(sub => (
              <button
                key={sub}
                onClick={() => setActiveSubject(sub)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeSubject === sub
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105"
                  : "bg-white dark:bg-[#0a0f1c]/60 backdrop-blur-md border border-slate-200 dark:border-white/[0.05] text-slate-600 dark:text-slate-400 hover:border-amber-500/50 dark:hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400"
                  }`}
              >
                {sub} ({getCount(sub)})
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 z-0" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors z-10" />
          <input
            type="text"
            placeholder="Search PYQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 h-12 text-sm rounded-xl bg-white dark:bg-[#0a0f1c]/80 backdrop-blur-xl border border-slate-200 dark:border-white/[0.1] text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all shadow-sm relative z-10"
          />
        </div>
      </motion.div>

      <motion.p variants={itemVars} className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 relative z-10">
        {filtered.length} {filtered.length === 1 ? "result" : "results"} found
      </motion.p>

      {/* Grid */}
      <div className="relative z-10">
        {filtered.length > 0 ? (
          <motion.div variants={containerVars} initial="hidden" animate="show" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((pyq) => (
              <motion.div key={pyq._id} variants={itemVars}>
                <Card className="group relative h-full overflow-hidden bg-white dark:bg-[#0a0f1c]/80 backdrop-blur-xl border-slate-200 dark:border-white/[0.05] rounded-[2rem] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(245,158,11,0.1)] hover:border-amber-500/30 dark:hover:border-amber-500/30 hover:-translate-y-2 transition-all duration-500 flex flex-col">
                  {/* Card Glow */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                  
                  <CardContent className="p-6 flex flex-col flex-grow relative z-10">
                    <div className="flex items-start justify-between mb-5">
                      <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="h-6 w-6 text-amber-500" />
                      </div>
                      {pyq.year && (
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                          {pyq.year}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-black text-slate-800 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-orange-500 transition-all line-clamp-2">
                      {pyq.title}
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6 line-clamp-1">{pyq.subject}</p>
                    
                    <div className="mt-auto flex gap-3">
                      {pyq.fileUrl && (
                        <button onClick={() => openPreview(pyq.fileUrl!, pyq.title)}
                          className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500/30 transition-all border border-transparent hover:border-amber-500/50 group/btn">
                          <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" /> Preview
                        </button>
                      )}
                      {pyq.fileUrl && (
                        <a href={pyq.fileUrl} download className="flex-1">
                          <button className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-blue-600 hover:text-white dark:hover:bg-white/10 dark:hover:text-white transition-all group/btn2">
                            <Download className="h-4 w-4 group-hover/btn2:-translate-y-0.5 transition-transform" /> Download
                          </button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={itemVars} className="py-24 text-center bg-white dark:bg-[#0a0f1c]/60 backdrop-blur-md rounded-[2.5rem] border border-dashed border-slate-300 dark:border-white/[0.1] shadow-sm">
            <motion.div 
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }} 
              transition={{ repeat: Infinity, duration: 5 }}
            >
              <FolderOpen className="mx-auto h-20 w-20 text-slate-300 dark:text-slate-700 mb-6" />
            </motion.div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">
              {activeSubject === "All" ? "No PYQs uploaded yet" : `No PYQs for ${activeSubject}`}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto text-base leading-relaxed">
              PYQs will appear here once they are uploaded by the admin.
            </p>
          </motion.div>
        )}
      </div>

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setPreviewUrl(null)} />
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-[#0a0f1c] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/[0.1] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/[0.05] bg-slate-50/80 dark:bg-white/[0.02] backdrop-blur-xl">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-2 rounded-xl bg-amber-500/10">
                    <FileText className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  </div>
                  <h3 className="text-base font-black text-slate-800 dark:text-white truncate">{previewTitle}</h3>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/20 transition-all">
                    <ExternalLink className="h-5 w-5" />
                  </a>
                  <a href={previewUrl} download className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 transition-all">
                    <Download className="h-5 w-5" />
                  </a>
                  <button onClick={() => setPreviewUrl(null)} className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 transition-all">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-slate-100 dark:bg-black/50 p-2 md:p-6 pb-6">
                <iframe src={`${previewUrl}#toolbar=1&navpanes=0`} className="w-full h-full border-none rounded-xl bg-white dark:bg-[#0f1423]" title="PDF Preview" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
