"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Youtube, Share2, Info, Loader2, Save, Trash2, Copy, Check, MousePointer2 } from "lucide-react";
import Link from "next/link";

interface VideoResource {
  _id: string;
  title: string;
  subject: string;
  videoLink?: string;
  url?: string;
  channel?: string;
  description?: string;
}

export default function VideoPlayerPage() {
  const { id } = useParams();
  const router = useRouter();
  const [video, setVideo] = useState<VideoResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNoteTakerOpen, setIsNoteTakerOpen] = useState(false);
  const [userNote, setUserNote] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    // Check for saved note for this video
    const saved = localStorage.getItem(`note-${id}`);
    if (saved) setUserNote(saved);

    const fetchVideo = async () => {
      try {
        const resAll = await fetch("/api/resources?type=Video");
        if (resAll.ok) {
          const allVideos = await resAll.json();
          const found = allVideos.find((v: VideoResource) => v._id === id);
          setVideo(found || null);
          if (found) initYoutubePlayer(found.videoLink || found.url || "");
        }
      } catch (error) {
        console.error("Failed to fetch video details:", error);
      } finally {
        setLoading(false);
      }
    };

    const initYoutubePlayer = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;
      if (!videoId) return;

      if (!(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
      }

      (window as any).onYouTubeIframeAPIReady = () => {
         createPlayer(videoId);
      };

      if ((window as any).YT && (window as any).YT.Player) {
         createPlayer(videoId);
      }
    };

    const createPlayer = (videoId: string) => {
       const newPlayer = new (window as any).YT.Player('youtube-player', {
          videoId: videoId,
          playerVars: { 'autoplay': 1, 'rel': 0 },
          events: {
             'onReady': (event: any) => setPlayer(event.target)
          }
       });
    };

    fetchVideo();
  }, [id]);

  const handleAddTimestamp = () => {
     if (!player) return;
     const currentTime = player.getCurrentTime();
     const minutes = Math.floor(currentTime / 60);
     const seconds = Math.floor(currentTime % 60);
     const hTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
     
     const timestampStr = `\n[${hTime}] `;
     setUserNote(prev => prev + timestampStr);
  };

  const saveNote = async () => {
    localStorage.setItem(`note-${id}`, userNote);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(userNote);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const clearNote = () => {
    if (confirm("Are you sure you want to clear all notes for this lecture?")) {
      setUserNote("");
      localStorage.removeItem(`note-${id}`);
    }
  };

  const cleanDescription = (text: string) => {
    // Remove URLs from description
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlPattern, "").trim().replace(/\n\s*\n/g, "\n\n");
  };

  const getYoutubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-500">
        <Loader2 className="w-12 h-12 animate-spin text-red-500 mb-4" />
        <p className="animate-pulse font-bold text-lg">Preparing your theatre...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
         <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600 mb-6 animate-bounce">
            <Youtube size={48} />
         </div>
         <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Video not found</h1>
         <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">The lecture you are looking for might have been removed or the link is invalid.</p>
         <Link href="/dashboard/videos">
            <button className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black flex items-center gap-2 hover:scale-105 transition-all">
               <ArrowLeft size={20} /> Back to Library
            </button>
         </Link>
      </div>
    );
  }

  const videoUrl = video.videoLink || video.url || "";
  const embedUrl = getYoutubeEmbedUrl(videoUrl);
  const rawDesc = video.description || "In this session, we dive deep into the fundamental concepts of " + video.subject + ". This video marks an important milestone in our curriculum, providing clarity on complex topics with expert explanations.";
  const displayDesc = cleanDescription(rawDesc);

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden bg-slate-50 dark:bg-transparent">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 pointer-events-none z-0">
        <div className="w-[800px] h-[800px] bg-red-600/10 dark:bg-red-600/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-6xl mx-auto px-4 pt-4"
      >
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8">
           <button 
             onClick={() => router.back()}
             className="p-2.5 rounded-full bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 pr-5 font-bold text-sm shadow-sm"
           >
              <ArrowLeft size={18} /> Back
           </button>
           <div className="flex gap-3">
              <button className="p-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                 <Share2 size={18} />
              </button>
              <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                 <button className="p-2.5 px-5 rounded-full bg-red-600 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-red-600/20 hover:scale-105 transition-all outline-none">
                    <Youtube size={18} /> Watch on YouTube
                 </button>
              </a>
           </div>
        </div>

        {/* Video Player Section */}
        <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-black group transition-all duration-700">
           {videoUrl ? (
             <div id="youtube-player" className="w-full h-full" />
           ) : (
             <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                <Youtube size={64} className="mb-4 opacity-50" />
                <p className="font-bold">Invalid YouTube Link</p>
             </div>
           )}
        </div>

        {/* Info Section */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
           <div className="lg:col-span-2 space-y-6">
              <div className="px-2">
                 <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-red-600 text-white font-black text-[9px] uppercase tracking-widest shadow-lg shadow-red-600/20">
                       Now Playing
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[9px] uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                       {video.subject}
                    </span>
                 </div>
                 <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-3 tracking-tight">
                    {video.title}
                 </h1>
                 <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center">
                       <Youtube size={10} className="text-white" />
                    </div>
                    <p className="text-slate-500 font-bold text-sm tracking-wide">
                       {video.channel || "Academic Channel"}
                    </p>
                 </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <Info size={120} />
                 </div>
                 <div className="flex items-center gap-3 text-slate-900 dark:text-white font-black mb-6 text-lg">
                    <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600">
                       <Info size={20} />
                    </div>
                    Lecture Description
                 </div>
                 <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed font-medium whitespace-pre-wrap">
                    {displayDesc}
                 </p>
              </motion.div>
           </div>

           <div className="space-y-6">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-red-600 dark:to-rose-700 text-white shadow-2xl shadow-slate-900/10 dark:shadow-red-600/20 relative overflow-hidden group"
              >
                 <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:rotate-12 transition-transform duration-500">
                    <Share2 size={100} />
                 </div>
                 <h3 className="font-black text-xl mb-3 relative z-10">Study Smart</h3>
                 <p className="text-slate-300 dark:text-red-100 text-sm font-medium leading-relaxed opacity-90 mb-10 relative z-10">
                    Your personal AI-assisted workspace for capturing key insights. Notes are synced across your local session.
                 </p>
                 <button 
                  onClick={() => setIsNoteTakerOpen(true)}
                  className="w-full py-4 bg-white text-slate-900 dark:text-red-600 rounded-2xl font-black text-sm hover:shadow-2xl transition-all shadow-lg active:scale-95 relative z-10 overflow-hidden flex items-center justify-center gap-2 group"
                 >
                    <span className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10 flex items-center gap-2">
                       <MousePointer2 size={16} className="animate-pulse" />
                       Open Advanced Note Taker
                    </span>
                 </button>
              </motion.div>

              <div className="p-8 rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white dark:border-slate-800 font-medium">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Quick Shortcuts</h4>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[10px] font-bold text-slate-500">
                       <span className="text-red-500 mr-1">L</span> Like Link
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[10px] font-bold text-slate-500">
                       <span className="text-red-500 mr-1">S</span> Share
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>

      {/* Advanced Floating Note Taker - Next Level UI */}
      <AnimatePresence>
         {isNoteTakerOpen && (
            <>
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setIsNoteTakerOpen(false)}
                 className="fixed inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-md z-[60]"
               />
               <motion.div 
                 initial={{ opacity: 0, x: 200, scale: 0.95 }}
                 animate={{ opacity: 1, x: 0, scale: 1 }}
                 exit={{ opacity: 0, x: 100, scale: 0.95 }}
                 transition={{ type: "spring", damping: 30, stiffness: 300 }}
                 className="fixed right-6 bottom-6 top-6 w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.4)] z-[70] flex flex-col overflow-hidden border-8 border-slate-50 dark:border-slate-800"
               >
                  {/* Glassmorphism Header */}
                  <div className="p-10 pb-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                     <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 dark:from-red-600 dark:to-rose-500 flex items-center justify-center shadow-lg shadow-slate-500/20 dark:shadow-red-500/30">
                           <Share2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                           <h3 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">Focus Workspace</h3>
                           <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Autosaving Active</p>
                           </div>
                        </div>
                     </div>
                     <button 
                       onClick={() => setIsNoteTakerOpen(false)}
                       className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group"
                     >
                        <ArrowLeft className="h-5 w-5 rotate-180 text-slate-500 transition-transform group-hover:translate-x-0.5" />
                     </button>
                  </div>

                  {/* Enhanced Toolbar */}
                  <div className="px-10 py-4 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-3">
                     <div className="flex gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <button className="px-3 py-1.5 text-[9px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors">B</button>
                        <button className="px-3 py-1.5 text-[9px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors">I</button>
                        <button className="px-3 py-1.5 text-[9px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors">U</button>
                     </div>
                     <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1" />
                     <button 
                       onClick={handleAddTimestamp}
                       className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl text-[9px] font-black uppercase text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-red-500/30 hover:text-red-500 transition-all flex items-center gap-2"
                     >
                        <Info size={12} /> Add Timestamp
                     </button>
                  </div>

                  <div className="flex-1 p-10 pt-6 overflow-y-auto">
                     <textarea 
                       value={userNote}
                       onChange={(e) => setUserNote(e.target.value)}
                       placeholder="Start capturing your breakthrough moments..."
                       className="w-full h-full bg-transparent border-none outline-none resize-none text-slate-700 dark:text-slate-200 font-medium text-lg placeholder:text-slate-200 dark:placeholder:text-slate-800 leading-relaxed custom-scrollbar selection:bg-red-500/20"
                     />
                  </div>

                  {/* Actions Footer */}
                  <div className="p-10 pt-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                     <div className="flex gap-4">
                        <button 
                          onClick={async () => {
                            if (!video || !userNote.trim()) return;
                            setIsSaved(true);
                            try {
                              const res = await fetch("/api/user/personal-notes", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ 
                                  videoId: id, 
                                  title: `Personal: ${video.title}`, 
                                  content: userNote,
                                  subject: video.subject
                                }),
                              });
                              if (res.ok) {
                                localStorage.setItem(`note-${id}`, userNote);
                              }
                            } catch (e) {
                              console.error(e);
                            } finally {
                              setTimeout(() => setIsSaved(false), 2000);
                            }
                          }}
                          className="flex-[2] py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black text-sm shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
                        >
                           <AnimatePresence mode="wait">
                              {isSaved ? (
                                 <motion.span key="saved" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex items-center gap-2 text-emerald-500 dark:text-emerald-600">
                                    <Check size={18} /> Notes Saved
                                 </motion.span>
                              ) : (
                                 <motion.span key="save" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex items-center gap-2">
                                    <Save size={18} /> Save
                                 </motion.span>
                              )}
                           </AnimatePresence>
                        </button>
                        
                        <div className="flex-[1] flex gap-2">
                           <button 
                              onClick={copyToClipboard}
                              className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all group"
                           >
                              <AnimatePresence mode="wait">
                                 {isCopied ? <motion.div key="check" initial={{ scale: 0.5 }} animate={{ scale: 1 }}><Check size={20} className="text-emerald-500" /></motion.div> : <Copy size={20} />}
                              </AnimatePresence>
                           </button>
                           <button 
                              onClick={clearNote}
                              className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-transparent hover:border-red-500/20"
                           >
                              <Trash2 size={20} />
                           </button>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>
    </div>
  );
}
