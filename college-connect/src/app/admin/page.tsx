"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users, FileText, Upload, Activity, TrendingUp, TrendingDown,
  Clock, UserPlus, FileUp, Settings2, AlertCircle, CheckCircle2,
  MessageSquare, X, ChevronRight, BookOpen,
  FileCheck, FileClock, Eye, Download, Loader2,
  LucideIcon, Mail
} from "lucide-react";

interface Student {
  name: string;
  email: string;
  course?: string;
  createdAt: string;
}

interface ResourceItem {
  title: string;
  type: string;
  subject: string;
  year?: string;
  createdAt: string;
}
interface ContactMessage {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  status: string;
  createdAt: string;
}

interface Activity {
  id: number;
  type: string;
  icon: LucideIcon;
  color: string;
  text: string;
  time: string;
}

// Animated number counter
function AnimatedNumber({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count.toLocaleString()}</>;
}

// ─── Activity Feed ────────────────────────────────────
const FEED_TEMPLATES = [
  { type: "upload", icon: FileUp, color: "bg-emerald-500", text: "New resource uploaded" },
  { type: "user", icon: UserPlus, color: "bg-blue-500", text: "New student registered" },
  { type: "contact", icon: MessageSquare, color: "bg-purple-500", text: "Contact form received" },
  { type: "settings", icon: Settings2, color: "bg-amber-500", text: "System configuration updated" },
  { type: "approved", icon: CheckCircle2, color: "bg-teal-500", text: "Resource auto-approved" },
];

// ─── Main Page ────────────────────────────────────────
export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalStudents: 0, totalResources: 0, pyqCount: 0, notesCount: 0, videoCount: 0, unreadMessages: 0 });
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);
  const [recentResources, setRecentResources] = useState<ResourceItem[]>([]);
  const [recentContacts, setRecentContacts] = useState<ContactMessage[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [flashId, setFlashId] = useState<number | null>(null);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const activityIndexRef = useRef(0);
  const idCounterRef = useRef(100);

  // Fetch real data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecentStudents(data.recentStudents || []);
          setRecentResources(data.recentResources || []);
          setRecentContacts(data.recentContacts || []);

          // Build initial activity from real data
          const acts: Activity[] = [];
          let id = 1;
          (data.recentResources || []).slice(0, 4).forEach((r: ResourceItem) => {
            acts.push({
              id: id++,
              type: "upload", icon: FileUp, color: "bg-emerald-500",
              text: `"${r.title}" uploaded (${r.type})`,
              time: formatTimeAgo(r.createdAt),
            });
          });
          (data.recentStudents || []).slice(0, 4).forEach((s: Student) => {
            acts.push({
              id: id++,
              type: "user", icon: UserPlus, color: "bg-blue-500",
              text: `New registration: ${s.name} (${s.course || "Student"})`,
              time: formatTimeAgo(s.createdAt),
            });
          });
          (data.recentContacts || []).forEach((c: ContactMessage) => {
            acts.push({
              id: id++,
              type: "contact", icon: MessageSquare, color: "bg-purple-500",
              text: `New message: ${c.firstName} - ${c.subject}`,
              time: formatTimeAgo(c.createdAt),
            });
          });
          // Sort by date
          acts.sort((a, b) => a.id - b.id);
          setActivities(acts.slice(0, 10));
        }
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);


  function formatTimeAgo(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  const STATS_CONFIG = [
    { key: "students", title: "Total Students", value: stats.totalStudents, icon: Users, gradient: "from-blue-600/20 to-blue-900/10", border: "border-blue-500/20", hoverBorder: "hover:border-blue-500/50", iconBg: "bg-blue-500/20", iconColor: "text-blue-400" },
    { key: "resources", title: "Total Resources", value: stats.totalResources, icon: FileText, gradient: "from-indigo-600/20 to-indigo-900/10", border: "border-indigo-500/20", hoverBorder: "hover:border-indigo-500/50", iconBg: "bg-indigo-500/20", iconColor: "text-indigo-400" },
    { key: "pyqs", title: "PYQs Uploaded", value: stats.pyqCount, icon: BookOpen, gradient: "from-amber-600/20 to-amber-900/10", border: "border-amber-500/20", hoverBorder: "hover:border-amber-500/50", iconBg: "bg-amber-500/20", iconColor: "text-amber-400" },
    { key: "notes", title: "Notes Uploaded", value: stats.notesCount, icon: FileCheck, gradient: "from-teal-600/20 to-teal-900/10", border: "border-teal-500/20", hoverBorder: "hover:border-teal-500/50", iconBg: "bg-teal-500/20", iconColor: "text-teal-400" },
    { key: "messages", title: "Unread Messages", value: stats.unreadMessages, icon: MessageSquare, gradient: "from-purple-600/20 to-purple-900/10", border: "border-purple-500/20", hoverBorder: "hover:border-purple-500/50", iconBg: "bg-purple-500/20", iconColor: "text-purple-400" },
  ];

  const panelTitles: Record<string, string> = {
    students: "Registered Students",
    resources: "All Resources",
    pyqs: "PYQ Resources",
    notes: "Notes Resources",
    messages: "Recent Contact Inquiries",
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 dark:text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="animate-pulse font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Real-time platform statistics. Click any card to see details.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATS_CONFIG.map((stat) => {
          const Icon = stat.icon;
          const isActive = activePanel === stat.key;
          return (
            <button
              key={stat.key}
              onClick={() => setActivePanel(isActive ? null : stat.key)}
              className={`text-left bg-gradient-to-br ${stat.gradient} border rounded-2xl p-5 transition-all duration-300 cursor-pointer ${
                isActive
                  ? `${stat.border} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 ${stat.border.replace('border-', 'ring-')} scale-[1.03] shadow-xl`
                  : `${stat.border} ${stat.hoverBorder} hover:scale-[1.02] hover:shadow-lg`
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{stat.title}</p>
                <div className={`p-2.5 ${stat.iconBg} rounded-xl`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                <AnimatedNumber target={stat.value} />
              </p>
              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-slate-700/20">
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-500">{isActive ? "Click to close" : "Click for details"}</span>
                <ChevronRight className={`h-3 w-3 text-slate-600 transition-transform ${isActive ? "rotate-90" : ""}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Panel */}
      {activePanel && (
        <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800/60">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-900 dark:text-white font-bold">{panelTitles[activePanel]}</CardTitle>
              <button onClick={() => setActivePanel(null)} className="p-1.5 rounded-lg text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            {activePanel === "students" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">{recentStudents.length} most recent students</p>
                {recentStudents.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-500 py-4 text-center">No students registered yet.</p>}
                {recentStudents.map((s: Student, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-800/70 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {(s.name || "U").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{s.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">{s.email}</p>
                    </div>
                    <div className="hidden md:block text-right">
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{s.course || "N/A"}</p>
                      <p className="text-[10px] text-slate-600">{formatDate(s.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {(activePanel === "resources" || activePanel === "pyqs" || activePanel === "notes") && (
              <div className="space-y-3">
                {(() => {
                  const data = activePanel === "pyqs"
                    ? recentResources.filter((r: ResourceItem) => r.type === "PYQ")
                    : activePanel === "notes"
                      ? recentResources.filter((r: ResourceItem) => r.type === "Notes")
                      : recentResources;

                  const typeColors: Record<string, string> = {
                    PYQ: "bg-amber-500/10 text-amber-400 border-amber-500/30",
                    Notes: "bg-blue-500/10 text-blue-400 border-blue-500/30",
                    Video: "bg-purple-500/10 text-purple-400 border-purple-500/30",
                  };

                  return (
                    <>
                      <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">{data.length} resources found</p>
                      {data.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-500 py-4 text-center">No resources uploaded yet.</p>}
                      {data.map((r: ResourceItem, i: number) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-800/70 transition-all">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-5 w-5 text-indigo-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{r.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-500">{r.subject} {r.year ? `· ${r.year}` : ""}</p>
                          </div>
                          <div className="hidden md:block text-right">
                            <p className="text-xs text-slate-600 dark:text-slate-400">{formatDate(r.createdAt)}</p>
                          </div>
                          <Badge variant="outline" className={`${typeColors[r.type] || typeColors.Notes} text-[10px] font-bold px-2 py-0 rounded-full`}>
                            {r.type}
                          </Badge>
                        </div>
                      ))}
                    </>
                  );
                })()}
              </div>
            )}
            {activePanel === "messages" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">Most recent inquiries</p>
                {recentContacts.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-500 py-4 text-center">No messages received yet.</p>}
                {recentContacts.map((c: ContactMessage, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-800/70 transition-all cursor-pointer group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      c.status === "unread" ? "bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/50" : "bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400"
                    }`}>
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{c.firstName} {c.lastName}</p>
                        {c.status === "unread" && <Badge className="bg-blue-500 hover:bg-blue-600 h-1.5 w-1.5 rounded-full p-0" title="Unread" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-500 font-medium truncate">{c.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${
                        c.status === "unread" ? "text-purple-400" : "text-slate-600"
                      }`}>{c.status}</p>
                      <p className="text-[10px] text-slate-600">{formatTimeAgo(c.createdAt)}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 flex justify-center border-t border-slate-200 dark:border-slate-800/40 mt-4">
                  <a href="/admin/contacts" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5 group">
                    View All Contact Submissions
                    <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Content: Activity + Summary */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg text-slate-900 dark:text-white font-bold">Recent Activity</CardTitle>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-500">{activities.length} events</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800/40">
              {activities.length === 0 && (
                <div className="py-12 text-center text-slate-500 dark:text-slate-500 text-sm">No activity yet</div>
              )}
              {activities.map((activity: Activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className={`flex items-start gap-4 px-6 py-4 transition-all duration-500 ${
                      flashId === activity.id ? 'bg-blue-900/20' : 'hover:bg-slate-50 dark:bg-slate-800/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${activity.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">{activity.text}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock className="h-3 w-3 text-slate-600" />
                        <p className="text-xs text-slate-500 dark:text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                    {flashId === activity.id && (
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full animate-pulse flex-shrink-0">NEW</span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Today's Summary */}
        <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-slate-900 dark:text-white font-bold">Platform Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Students</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{stats.totalStudents}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Resources</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{stats.totalResources}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">PYQs</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{stats.pyqCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Notes</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{stats.notesCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Videos</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{stats.videoCount}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">Resources Breakdown</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  {stats.totalResources > 0 ? (
                    <>
                      <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${(stats.pyqCount / stats.totalResources) * 100}%` }} />
                      <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(stats.notesCount / stats.totalResources) * 100}%` }} />
                      <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${(stats.videoCount / stats.totalResources) * 100}%` }} />
                    </>
                  ) : (
                    <div className="h-full bg-slate-700 w-full" />
                  )}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-amber-400 font-semibold">PYQ</span>
                  <span className="text-[10px] text-blue-400 font-semibold">Notes</span>
                  <span className="text-[10px] text-purple-400 font-semibold">Video</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
