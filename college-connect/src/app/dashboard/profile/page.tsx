"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail, BookOpen, Building, GraduationCap, MapPin, Loader2, LogOut,
  Shield, Calendar, Clock, Sparkles, ChevronRight, Star, Zap, Award
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [profileData, setProfileData] = useState<unknown>(null);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setMounted(true);
    // Fetch fresh profile data to ensure subjects are up to date after editing
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
        }
      } catch (err) {
        console.error("Failed to fetch fresh profile data", err);
      }
    };
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  if (!mounted || status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="animate-pulse font-medium">Loading profile...</p>
      </div>
    );
  }

  if (!session?.user) return null;

  // Prefer fresh profile data from DB, fallback to session token data for initial paint
  const user = (profileData || session.user) as { name?: string; email?: string; role?: string; course?: string; branch?: string; semester?: string; university?: string; subjects?: string[] };
  const userName = user.name || "Demo Student";
  const userEmail = user.email || "student@example.com";
  const userRole = user.role || "student";
  const userCourse = user.course || "Not enrolled";
  const userBranch = user.branch;
  const userSemester = user.semester ? `Semester ${user.semester}` : "Not specified";
  const userUniversity = user.university || "Maharshi Dayanand University (MDU)";
  const userSubjects = user.subjects || [];
  const initials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const joinDate = "October 2023";

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
      {/* Ambient Lights */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 pointer-events-none">
        <div className="w-96 h-96 bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-3xl mix-blend-screen" />
      </div>
      <div className="absolute bottom-1/2 left-0 -translate-x-1/2 pointer-events-none">
        <div className="w-80 h-80 bg-purple-500/20 dark:bg-purple-600/10 rounded-full blur-3xl mix-blend-screen" />
      </div>

      <motion.div variants={containerVars} initial="hidden" animate="show" className="relative z-10 space-y-6">
        {/* Hero Header */}
        <motion.div variants={itemVars} className="relative overflow-hidden rounded-3xl group">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(59,130,246,0.3),_transparent_50%)]" />

        {/* Floating shapes */}
        <div className="absolute top-8 right-12 w-20 h-20 rounded-full bg-white/5 blur-sm" />
        <div className="absolute bottom-6 right-32 w-14 h-14 rounded-full bg-white/5 blur-sm" />
        <div className="absolute top-12 right-40 w-8 h-8 rounded-full bg-white/10" />

        <div className="relative px-8 py-10 md:px-12 md:py-14">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Initials Avatar */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center flex-shrink-0 shadow-2xl">
              <span className="text-4xl md:text-5xl font-black text-white">{initials}</span>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{userName}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {userRole === "admin" ? <Shield className="h-3 w-3" /> : <GraduationCap className="h-3 w-3" />}
                  {userRole === "admin" ? "Administrator" : "Student"}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full">
                  <Mail className="h-3 w-3" /> {userEmail}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full">
                  <Calendar className="h-3 w-3" /> Joined {joinDate}
                </span>
              </div>
            </div>

            <div className="md:self-start flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                className="rounded-xl font-bold bg-white/15 hover:bg-red-500 border border-white/20 text-white shadow-none backdrop-blur-sm transition-all"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Row */}
      <motion.div variants={itemVars} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Resources Viewed", value: "142", icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "PYQs Downloaded", value: "38", icon: Star, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Videos Watched", value: "27", icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "Days Active", value: "64", icon: Award, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl hover:scale-[1.02] transition-all">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      <motion.div variants={itemVars} className="grid gap-6 md:grid-cols-2">
        {/* Academic Details */}
        <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-indigo-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Academic Details</h3>
              </div>
              <Link href="/dashboard/profile/edit-subjects">
                <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs font-semibold text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors">
                  Edit Subjects
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
          <CardContent className="p-6 space-y-4">
            <div className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/30 hover:border-blue-200 dark:hover:border-blue-800/50 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">University</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 pl-5">{userUniversity}</p>
            </div>

            <div className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/30 hover:border-blue-200 dark:hover:border-blue-800/50 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Course Program</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 pl-5">
                {userCourse}{userBranch ? ` — ${userBranch}` : ""}
              </p>
            </div>


            <div className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/30 hover:border-blue-200 dark:hover:border-blue-800/50 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Tracked Subjects</span>
                <span className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {userSubjects.length} selected
                </span>
              </div>
              {userSubjects.length > 0 ? (
                <div className="flex flex-wrap gap-2 pl-5 mt-2">
                  {userSubjects.map((sub: string, i: number) => (
                    <span key={i} className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-white border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                      {sub}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 pl-5 mt-1 italic">No subjects selected yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Info & Activity */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Account Info</h3>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/30 hover:border-blue-200 dark:hover:border-blue-800/50 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Email Address</span>
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 pl-5">{userEmail}</p>
              </div>
              <div className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/30 hover:border-blue-200 dark:hover:border-blue-800/50 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Account Status</span>
                </div>
                <div className="flex items-center gap-2 pl-5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[
                  { text: "Viewed Operating Systems PYQ 2023", time: "2 hours ago", color: "bg-blue-500" },
                  { text: "Watched ML Lecture — Unit 3", time: "Yesterday", color: "bg-purple-500" },
                  { text: "Downloaded DBMS Notes", time: "2 days ago", color: "bg-emerald-500" },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all group cursor-pointer">
                    <div className={`w-2 h-2 rounded-full ${a.color} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{a.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-600 flex-shrink-0">{a.time}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-700 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
    </div>
  );
}
