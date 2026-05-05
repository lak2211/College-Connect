"use client";

import { useState, useEffect } from "react";
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Loader2, Video as VideoIcon, Youtube } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface VideoResource {
  _id: string;
  title: string;
  subject: string;
  videoLink?: string;
  url?: string;
  channel?: string;
}

export default function VideosPage() {
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [videos, setVideos] = useState<VideoResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/resources?type=Video");
        if (res.ok) {
          const data = await res.json();
          setVideos(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const filteredVideos = subjectFilter === "All"
    ? videos
    : videos.filter(v => v.subject === subjectFilter);

  const subjects = ["All", ...Array.from(new Set(videos.map(v => v.subject)))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const containerVars: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVars: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-6 relative pb-10">
      {/* Ambient Aurora */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 pointer-events-none">
        <div className="w-96 h-96 bg-red-500/20 dark:bg-red-600/10 rounded-full blur-3xl mix-blend-screen" />
      </div>
      <div className="absolute bottom-1/2 left-0 -translate-x-1/2 pointer-events-none">
        <div className="w-80 h-80 bg-purple-500/20 dark:bg-purple-600/10 rounded-full blur-3xl mix-blend-screen" />
      </div>

      <motion.div variants={containerVars} initial="hidden" animate="show" className="relative z-10 flex flex-col space-y-4 md:flex-row md:items-end md:justify-between md:space-y-0 pb-4">
        <motion.div variants={itemVars} className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30 text-white">
            <VideoIcon className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
              Video <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">Library</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium">Curated YouTube lectures for your subjects.</p>
          </div>
        </motion.div>

        <motion.div variants={itemVars} className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <div className="w-full md:w-[220px] relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
            <div className="relative">
              <Select value={subjectFilter} onValueChange={(val) => setSubjectFilter(val || "All")}>
                <SelectTrigger className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 rounded-xl font-semibold h-10 focus:ring-2 focus:ring-red-500/30">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {subjects.map(sub => (
                    <SelectItem key={sub} value={sub} className="cursor-pointer">{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div layout className="relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredVideos.length > 0 ? (
            <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredVideos.map((video) => {
            const videoUrl = video.videoLink || video.url || "#";
            
            // Extract YouTube ID for thumbnail
            const getYoutubeId = (url: string) => {
              const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
              const match = url.match(regExp);
              return (match && match[2].length === 11) ? match[2] : null;
            };
            const youtubeId = getYoutubeId(videoUrl);
            const thumbnailUrl = youtubeId 
              ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
              : "https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?q=80&w=600&auto=format&fit=crop";

            return (
              <motion.div 
                layout 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }} 
                transition={{ duration: 0.2 }}
                key={video._id}
              >
                <Card className="overflow-hidden flex flex-col h-full bg-white/80 dark:bg-slate-900/40 backdrop-blur-md border-slate-200/50 dark:border-slate-800/50 shadow-sm rounded-3xl hover:shadow-2xl hover:border-red-500/30 dark:hover:border-red-500/30 transition-all duration-500 group relative">
                  <div className="relative aspect-video bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <Image
                      src={thumbnailUrl}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      unoptimized // YouTube images don't need optimization layer usually
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <Link href={`/dashboard/videos/${video._id}`}>
                        <div className="h-14 w-14 bg-red-600 rounded-full flex items-center justify-center text-white pl-1 shadow-[0_0_30px_rgba(220,38,38,0.5)] cursor-pointer transform hover:scale-110 transition-transform active:scale-95">
                          <Play className="h-7 w-7" />
                        </div>
                      </Link>
                    </div>
                  </div>
                  <CardHeader className="pb-2 pt-6 px-6 flex-1 relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-black uppercase tracking-widest bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-xl border border-red-100 dark:border-red-500/20">
                        YouTube Lecture
                      </span>
                    </div>
                    <CardTitle className="text-lg font-black text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-rose-500 transition-all">
                      {video.title}
                    </CardTitle>
                    <CardDescription className="mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      {video.subject}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0 flex flex-col gap-3 p-6 z-10 border-t border-slate-100 dark:border-slate-800/50 mt-4">
                    <div className="flex items-center justify-between w-full mb-2">
                       <span className="text-[11px] font-bold text-slate-500 truncate pr-2 opacity-70 italic">{video.channel || "Academic Channel"}</span>
                    </div>
                    <div className="flex gap-2 w-full">
                       <Link href={`/dashboard/videos/${video._id}`} className="flex-1">
                          <button className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl bg-red-600 text-white text-xs font-black hover:bg-red-700 transition-all shadow-lg shadow-red-600/10 hover:shadow-red-600/20 active:scale-95">
                             Watch Now <Play className="h-3.5 w-3.5 fill-current" />
                          </button>
                       </Link>
                       <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-transparent hover:border-red-500/20" title="Watch on YouTube">
                          <Youtube className="h-5 w-5" />
                       </a>
                    </div>
                  </CardFooter>
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-rose-500/0 group-hover:from-red-500/5 group-hover:to-rose-500/5 transition-colors pointer-events-none z-0" />
                </Card>
              </motion.div>
            );
          })}
          </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="col-span-full py-16 text-center"
            >
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
                <VideoIcon className="relative h-16 w-16 text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">No videos found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-base">We haven&apos;t added any video resources for this subject yet.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
