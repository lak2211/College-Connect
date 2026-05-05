"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookMarked, Download, Eye, X, Search,
  FileText, Loader2, ExternalLink, FolderOpen, Save
} from "lucide-react";

interface Note {
  _id: string;
  title: string;
  subject: string;
  fileUrl?: string;
  course: string;
  createdAt: string;
  source?: "official" | "personal";
  content?: string;
  video?: string;
}

export default function NotesPage() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [personalNotes, setPersonalNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");
  const [mounted, setMounted] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [fetching, setFetching] = useState(false);
  const [userSubjects, setUserSubjects] = useState<string[]>([]);
  const [activeSubject, setActiveSubject] = useState("All");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user's selected subjects
  useEffect(() => {
    const sessionSubjects = (session?.user as { subjects?: string[] })?.subjects;
    if (sessionSubjects && sessionSubjects.length > 0) {
      setUserSubjects(sessionSubjects);
    } else {
      fetch("/api/user/profile")
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data?.subjects) setUserSubjects(data.subjects); })
        .catch(() => { });
    }
  }, [session]);

  const fetchNoteData = async () => {
    try {
      const [res, personalRes] = await Promise.all([
        fetch("/api/resources?type=Notes"),
        fetch("/api/user/personal-notes")
      ]);
      
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
      if (personalRes.ok) {
        const data = await personalRes.json();
        setPersonalNotes(data);
      }
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoteData();
  }, []);

  const handleUpdateNote = async () => {
     if (!editingNote || !editedContent.trim()) return;
     setFetching(true);
     try {
        const res = await fetch("/api/user/personal-notes", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
              videoId: editingNote.video,
              title: editingNote.title,
              content: editedContent,
              subject: editingNote.subject
           })
        });
        if (res.ok) {
           await fetchNoteData();
           setEditingNote(null);
        }
     } catch (e) {
        console.error(e);
     } finally {
        setFetching(false);
     }
  };

  const combinedNotes = [
    ...notes.map(n => ({ ...n, source: "official" as const })),
    ...personalNotes.map(n => ({ 
      ...n, 
      source: "personal" as const, 
      title: n.title, 
      id: n._id, 
      subject: n.subject, 
      createdAt: n.createdAt,
      content: n.content 
    }))
  ];

  const userNotes = userSubjects.length > 0
    ? combinedNotes.filter(n => userSubjects.includes(n.subject))
    : combinedNotes;

  const filtered = userNotes.filter(n => {
    if (activeSubject !== "All" && n.subject !== activeSubject) return false;
    if (searchQuery.trim() && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) && !n.subject.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getCount = (sub: string) => userNotes.filter(n => n.subject === sub).length;

  const openPreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="animate-pulse font-medium">Loading notes library...</p>
      </div>
    );
  }

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-6 pb-20 relative min-h-screen">
      {/* Ambient Background Lights */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 pointer-events-none">
        <div className="w-96 h-96 bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-3xl mix-blend-screen" />
      </div>
      <div className="absolute bottom-1/2 left-0 -translate-x-1/2 pointer-events-none">
        <div className="w-80 h-80 bg-indigo-500/20 dark:bg-indigo-600/10 rounded-full blur-3xl mix-blend-screen" />
      </div>

      <motion.div variants={containerVars} initial="hidden" animate="show" className="relative z-10 space-y-6">
        {/* Header */}
        <motion.div variants={itemVars}>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 text-white">
              <BookMarked className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1">Lecture <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Vault</span></h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium">Capture insights, edit notes, and master your subjects.</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs and Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <motion.div variants={itemVars} className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveSubject("All")}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${activeSubject === "All"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-105"
                  : "bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                  }`}
              >
                All ({userNotes.length})
              </button>
              {userSubjects.map(sub => (
                <button
                  key={sub}
                  onClick={() => setActiveSubject(sub)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${activeSubject === sub
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-105"
                    : "bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                    }`}
                >
                  {sub} ({getCount(sub)})
                </button>
              ))}
           </motion.div>

           <motion.div variants={itemVars} className="relative w-full md:max-w-xs group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <input
               type="text"
               placeholder="Filter entries..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-11 pr-4 h-12 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
             />
           </motion.div>
        </div>

        {/* Grid */}
        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
           <AnimatePresence mode="popLayout">
              {filtered.map((note) => (
                 <motion.div 
                    layout 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.9 }} 
                    key={note._id}
                 >
                    <Card className={`group relative overflow-hidden h-full backdrop-blur-md border shadow-sm rounded-[2rem] transition-all duration-500 ${
                      note.source === "personal" 
                        ? "bg-amber-500/[0.03] dark:bg-amber-500/[0.05] border-amber-500/20 hover:border-amber-500/40" 
                        : "bg-white/80 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 hover:border-blue-500/30"
                    }`}>
                      <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-700 pointer-events-none opacity-0 group-hover:opacity-5 ${
                        note.source === "personal" ? "from-amber-400 to-orange-600" : "from-blue-400 to-indigo-600"
                      }`} />
                      
                      <CardContent className="p-7 flex flex-col h-full relative z-10">
                        <div className="flex items-start justify-between mb-6">
                          <div className={`p-3.5 rounded-[1.25rem] transition-colors ${
                            note.source === "personal" ? "bg-amber-100 dark:bg-amber-500/10 text-amber-600" : "bg-blue-100 dark:bg-blue-500/10 text-blue-600"
                          }`}>
                            {note.source === "personal" ? <BookMarked size={22} /> : <FileText size={22} />}
                          </div>
                          <span className={`text-[9px] font-black px-3.5 py-2 uppercase tracking-[0.15em] rounded-xl border transition-all ${
                            note.source === "personal" 
                              ? "bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400" 
                              : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                          }`}>
                            {note.source === "personal" ? "Personal" : "Official"}
                          </span>
                        </div>

                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 leading-tight tracking-tight line-clamp-2">
                          {note.title}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">{note.subject}</p>
                        
                        {note.source === "personal" && (
                          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium line-clamp-3 mb-8 px-4 py-4 bg-white/40 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-slate-800 italic leading-relaxed">
                             "{note.content}"
                          </div>
                        )}

                        <div className="flex gap-3 mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/50">
                          {note.source === "official" ? (
                            <>
                              {note.fileUrl && (
                                <button onClick={() => openPreview(note.fileUrl!, note.title)}
                                  className="flex-1 flex items-center justify-center gap-2 h-11 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black hover:bg-blue-600 hover:text-white transition-all">
                                  <Eye size={16} /> Preview
                                </button>
                              )}
                              <a href={note.fileUrl || "#"} download className="flex-1">
                                <button className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black hover:scale-105 transition-all">
                                  <Download size={16} /> Save
                                </button>
                              </a>
                            </>
                          ) : (
                            <div className="flex gap-3 w-full">
                               <button 
                                 onClick={() => {
                                   setPreviewUrl("personal");
                                   setPreviewTitle(note.title);
                                   (window as any)._personalNoteContent = note.content;
                                 }}
                                 className="flex-1 flex items-center justify-center gap-2 h-11 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black hover:bg-amber-100 transition-all border border-amber-500/20">
                                 <Eye size={16} /> View
                               </button>
                               <button 
                                 onClick={() => {
                                    setEditingNote(note);
                                    setEditedContent(note.content || "");
                                 }}
                                 className="flex-1 flex items-center justify-center gap-2 h-11 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black hover:scale-105 transition-all shadow-xl">
                                 <BookMarked size={16} /> Edit
                               </button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                 </motion.div>
              ))}
           </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* PDF / Personal Preview Modal */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setPreviewUrl(null)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-[#0a0f1c] rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                    <FileText size={20} />
                  </div>
                  <h3 className="text-base font-black text-slate-800 dark:text-white truncate max-w-md">{previewTitle}</h3>
                </div>
                <button onClick={() => setPreviewUrl(null)} className="p-2.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 bg-slate-50 dark:bg-black/50 p-6 md:p-12 overflow-y-auto">
                {previewUrl === "personal" ? (
                  <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900/50 p-10 md:p-16 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 relative">
                    <div className="absolute top-0 left-0 p-8 opacity-5 text-amber-500">
                       <BookMarked size={120} />
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 text-xl leading-relaxed whitespace-pre-wrap font-medium italic relative z-10">
                      "{(window as any)._personalNoteContent || "Entry empty."}"
                    </p>
                  </div>
                ) : (
                  <iframe src={`${previewUrl}#toolbar=1&navpanes=0`} className="w-full h-full border-none rounded-3xl bg-white dark:bg-[#0f1423]" title="PDF Preview" />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Note Editor Modal */}
      <AnimatePresence>
         {editingNote && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-xl bg-slate-900/40"
            >
               <motion.div 
                  initial={{ scale: 0.9, y: 40, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: 40, opacity: 0 }}
                  className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-[0_40px_120px_rgba(0,0,0,0.6)] border-[12px] border-slate-50 dark:border-slate-800 overflow-hidden flex flex-col"
               >
                  <div className="p-10 pb-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                     <div className="flex items-center gap-5">
                        <div className="h-16 w-16 rounded-3xl bg-amber-500 text-white flex items-center justify-center shadow-2xl shadow-amber-500/30">
                           <BookMarked size={30} />
                        </div>
                        <div>
                           <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Studio Refinement</h3>
                           <p className="text-xs font-black uppercase tracking-widest text-slate-400">{editingNote.subject}</p>
                        </div>
                     </div>
                     <button onClick={() => setEditingNote(null)} className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all">
                        <X size={24} />
                     </button>
                  </div>

                  <div className="flex-1 p-10 overflow-y-auto">
                     <div className="mb-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 block">Personal Narrative</label>
                        <textarea 
                           value={editedContent}
                           onChange={(e) => setEditedContent(e.target.value)}
                           className="w-full h-80 bg-slate-50/50 dark:bg-slate-800/40 rounded-[2.5rem] p-10 border-none outline-none focus:ring-4 focus:ring-amber-500/10 text-slate-800 dark:text-slate-100 font-medium text-lg leading-relaxed resize-none custom-scrollbar shadow-inner"
                           placeholder="Expand your insights..."
                        />
                     </div>
                  </div>

                  <div className="p-10 pt-2 pb-12">
                     <div className="flex gap-4">
                        <button 
                           onClick={() => setEditingNote(null)}
                           className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black rounded-3xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                        >
                           Discard
                        </button>
                        <button 
                           onClick={handleUpdateNote}
                           disabled={fetching}
                           className="flex-[2] py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-3xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                        >
                           {fetching ? <Loader2 className="animate-spin h-5 w-5" /> : <><Save size={20} /> Update Insight</>}
                        </button>
                     </div>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
