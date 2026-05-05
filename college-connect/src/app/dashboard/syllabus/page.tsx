"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  BookOpen, CheckCircle2, Loader2, Target, Trophy,
  Clock, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Topic {
  id: string;
  title: string;
  completed: boolean;
}

interface SyllabusItem {
  subject: string;
  topics: Topic[];
}

// Generate topics for each subject
const generateTopics = (subject: string) => [
  { id: `${subject}-1`, title: `Unit 1: Introduction to ${subject}`, completed: false },
  { id: `${subject}-2`, title: "Unit 2: Core Concepts & Principles", completed: false },
  { id: `${subject}-3`, title: "Unit 3: Advanced Theory & Methods", completed: false },
  { id: `${subject}-4`, title: "Unit 4: Practical Implementation", completed: false },
  { id: `${subject}-5`, title: "Unit 5: Case Studies & Review", completed: false },
];

// SVG circular progress ring
function CircularProgress({ percentage, size = 120, stroke = 8 }: { percentage: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-slate-200 dark:text-slate-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-slate-900 dark:text-white">{percentage}%</span>
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Complete</span>
      </div>
    </div>
  );
}

// Mini progress bar
function MiniProgress({ value, color = "blue" }: { value: number; color?: string }) {
  const colors: Record<string, string> = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    purple: "from-purple-500 to-purple-600",
    amber: "from-amber-500 to-amber-600",
    teal: "from-teal-500 to-teal-600",
    indigo: "from-indigo-500 to-indigo-600",
  };
  return (
    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${colors[color] || colors.blue} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

const SUBJECT_COLORS = ["blue", "purple", "teal", "amber", "indigo", "green"];

export default function SyllabusTrackerPage() {
  const { data: session, status } = useSession();
  const [syllabus, setSyllabus] = useState<SyllabusItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setMounted(true);
    setTimeout(() => setAnimateStats(true), 300);
  }, []);

  useEffect(() => {
    if (!session?.user) return;

    const loadSubjects = async () => {
      setLoading(true);
      let userSubjects = (session.user as { subjects?: string[] }).subjects || [];

      // If session doesn't have subjects, fetch from database directly
      if (!userSubjects || userSubjects.length === 0) {
        try {
          const res = await fetch("/api/user/profile");
          if (res.ok) {
            const data = await res.json();
            userSubjects = data.subjects || [];
          }
        } catch (err) {
          console.error("Failed to fetch subjects:", err);
        }
      }

      // Load progress from localStorage
      const saved = localStorage.getItem("syllabusProgress");
      const savedProgress: Record<string, boolean> = saved ? JSON.parse(saved) : {};

      const dynamicSyllabus = userSubjects.map((sub: string) => ({
        subject: sub,
        topics: generateTopics(sub).map(t => ({
          ...t,
          completed: savedProgress[t.id] || false,
        })),
      }));
      setSyllabus(dynamicSyllabus);
      setLoading(false);
    };

    loadSubjects();
  }, [session]);

  // Save progress to localStorage
  const saveProgress = (updated: SyllabusItem[]) => {
    const progress: Record<string, boolean> = {};
    updated.forEach(sub => {
      sub.topics.forEach((t: Topic) => {
        if (t.completed) progress[t.id] = true;
      });
    });
    localStorage.setItem("syllabusProgress", JSON.stringify(progress));
  };

  if (!mounted || status === "loading" || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="animate-pulse font-medium">Loading syllabus...</p>
      </div>
    );
  }

  const handleToggleTopic = (subjectIndex: number, topicId: string) => {
    const updated = syllabus.map((sub: SyllabusItem, i: number) => {
      if (i !== subjectIndex) return sub;
      return {
        ...sub,
        topics: sub.topics.map((t: Topic) =>
          t.id === topicId ? { ...t, completed: !t.completed } : t
        ),
      };
    });
    setSyllabus(updated);
    saveProgress(updated);
  };

  const totalTopics = syllabus.reduce((acc: number, s: SyllabusItem) => acc + s.topics.length, 0);
  const completedTopics = syllabus.reduce((acc: number, s: SyllabusItem) => acc + s.topics.filter((t: Topic) => t.completed).length, 0);
  const overallProgress = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

  const subjectProgress = (sub: SyllabusItem) => {
    const t = sub.topics.length;
    const c = sub.topics.filter((x: Topic) => x.completed).length;
    return t === 0 ? 0 : Math.round((c / t) * 100);
  };
  const subjectCompleted = (sub: SyllabusItem) => sub.topics.filter((x: Topic) => x.completed).length;

  const completedSubjects = syllabus.filter(s => subjectProgress(s) === 100).length;

  const getMessage = () => {
    if (overallProgress === 0) return { text: "Let's start your journey! 🚀", color: "text-slate-500" };
    if (overallProgress < 25) return { text: "Great start! Keep going! 💪", color: "text-blue-500" };
    if (overallProgress < 50) return { text: "You're on fire! 🔥", color: "text-amber-500" };
    if (overallProgress < 75) return { text: "More than halfway! 🌟", color: "text-purple-500" };
    if (overallProgress < 100) return { text: "Almost there! 🎯", color: "text-emerald-500" };
    return { text: "All done! You're a champion! 🏆", color: "text-emerald-500" };
  };

  const motivation = getMessage();

  const containerVars: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVars: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10 relative">
      {/* Ambient background auroras */}
      <div className="absolute top-0 left-0 -translate-y-12 -translate-x-1/3 pointer-events-none">
        <div className="w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/10 rounded-full blur-3xl mix-blend-screen" />
      </div>
      <div className="absolute top-1/3 right-0 translate-x-1/3 pointer-events-none">
        <div className="w-80 h-80 bg-purple-500/20 dark:bg-purple-600/10 rounded-full blur-3xl mix-blend-screen" />
      </div>

      <motion.div variants={containerVars} initial="hidden" animate="show" className="relative z-10 space-y-6">
        {/* Header */}
        <motion.div variants={itemVars}>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 text-white">
              <Target className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-zinc-100 mb-1">
                Syllabus <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Tracker</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium mt-1">Track your study progress across all subjects.</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Hero Section */}
        <motion.div variants={itemVars} className="relative overflow-hidden rounded-3xl group">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900 dark:to-slate-800/80" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 dark:bg-blue-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-100/20 dark:bg-purple-900/10 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative px-6 py-8 md:px-10 md:py-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Circular Progress */}
            <div className="flex-shrink-0">
              <CircularProgress percentage={overallProgress} size={140} stroke={10} />
            </div>

            {/* Stats */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className={`h-5 w-5 ${motivation.color}`} />
                <p className={`text-lg font-bold ${motivation.color}`}>{motivation.text}</p>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {completedTopics} of {totalTopics} topics completed across {syllabus.length} subjects
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Subjects", value: syllabus.length, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
                  { label: "Topics Done", value: completedTopics, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                  { label: "Remaining", value: totalTopics - completedTopics, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
                  { label: "Mastered", value: completedSubjects, icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10" },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="p-3 rounded-xl bg-white/60 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/30">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                          <Icon className={`h-3.5 w-3.5 ${stat.color}`} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{stat.label}</span>
                      </div>
                      <p className={`text-lg md:text-xl font-extrabold text-slate-900 dark:text-white pl-1 transition-all duration-700 ${animateStats ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                        {stat.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

        {/* Subjects */}
        <motion.div variants={itemVars} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black uppercase tracking-[0.15em] flex items-center text-slate-800 dark:text-slate-200">
              <BookOpen className="mr-3 h-5 w-5 text-indigo-500" />
              My Subjects
            </h3>
            <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
              {completedSubjects} / {syllabus.length} mastered
            </span>
          </div>

          {syllabus.length === 0 ? (
            <div className="text-center py-16 bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
              <div className="relative z-10">
                <BookOpen className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
                <h3 className="text-base font-black text-slate-600 dark:text-slate-400 mb-2">No subjects found</h3>
                <p className="text-slate-400 dark:text-slate-600 text-sm">Complete your onboarding to see your syllabus here.</p>
              </div>
            </div>
          ) : (
          <Accordion className="w-full space-y-3">
            {syllabus.map((sub: SyllabusItem, idx: number) => {
              const progress = subjectProgress(sub);
              const done = subjectCompleted(sub);
              const total = sub.topics.length;
              const color = SUBJECT_COLORS[idx % SUBJECT_COLORS.length];
              const isMastered = progress === 100;

              const iconBg: Record<string, string> = {
                blue: "bg-blue-500/10", purple: "bg-purple-500/10", teal: "bg-teal-500/10",
                amber: "bg-amber-500/10", indigo: "bg-indigo-500/10", green: "bg-emerald-500/10",
              };
              const iconColor: Record<string, string> = {
                blue: "text-blue-500", purple: "text-purple-500", teal: "text-teal-500",
                amber: "text-amber-500", indigo: "text-indigo-500", green: "text-emerald-500",
              };

              return (
                <AccordionItem
                  key={sub.subject}
                  value={sub.subject}
                  className={`bg-white dark:bg-slate-900/50 border rounded-2xl overflow-hidden transition-all hover:shadow-md ${isMastered
                    ? "border-emerald-200 dark:border-emerald-800/50 shadow-emerald-100/50 dark:shadow-emerald-900/10"
                    : "border-slate-200 dark:border-slate-800 shadow-sm"
                    }`}
                >
                  <AccordionTrigger className="hover:no-underline px-5 py-5 group">
                    <div className="flex items-center gap-4 flex-1 mr-4">
                      <div className={`w-11 h-11 rounded-xl ${iconBg[color]} flex items-center justify-center flex-shrink-0`}>
                        {isMastered ? (
                          <Trophy className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <BookOpen className={`h-5 w-5 ${iconColor[color]}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                            {sub.subject}
                          </span>
                          {isMastered && (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="h-3 w-3" /> Mastered
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <MiniProgress value={progress} color={isMastered ? "green" : color} />
                          </div>
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 w-16 text-right flex-shrink-0">
                            {done}/{total} done
                          </span>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5">
                      <div className="space-y-1.5 mt-1">
                        {sub.topics.map((topic: Topic) => (
                          <div
                            key={topic.id}
                            className={`group/topic flex items-center gap-3 p-3.5 rounded-xl transition-all cursor-pointer ${
                              topic.completed
                                ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-transparent"
                                : "bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800/50 hover:border-indigo-200 dark:hover:border-indigo-800/50"
                            } border`}
                            onClick={() => handleToggleTopic(idx, topic.id)}
                          >
                            <div
                              className={`flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                topic.completed
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 group-hover/topic:border-indigo-400 dark:group-hover/topic:border-indigo-500"
                                }`}
                            >
                              <AnimatePresence>
                                {topic.completed && (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <span className={`text-sm font-semibold transition-colors ${topic.completed ? "text-emerald-700/60 dark:text-emerald-400/50 line-through" : "text-slate-700 dark:text-slate-200"}`}>
                              {topic.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
