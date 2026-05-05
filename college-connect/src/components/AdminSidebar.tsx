"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, UploadCloud, Users, Settings,
  Shield, ChevronRight, Sparkles, Database, MessageSquareText
} from "lucide-react";

import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, description: "Overview & analytics" },
  { label: "Upload Resources", href: "/admin/upload", icon: UploadCloud, description: "Notes, PYQs & videos" },
  { label: "Manage Users", href: "/admin/users", icon: Users, description: "Student directory" },
  { label: "Contact Forms", href: "/admin/contacts", icon: MessageSquareText, description: "Student inquiries" },
  { label: "Settings", href: "/admin/settings", icon: Settings, description: "Platform config" },
];

// { label: "Upload Resource", href: "/admin/upload", icon: FileUp, gradient: "from-blue-600 to-blue-700", shadow: "shadow-blue-600/25" },

interface SidebarStats {
  totalStudents: number;
  totalResources: number;
  pyqCount: number;
  notesCount: number;
  videoCount: number;
  unreadMessages: number;
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [stats, setStats] = useState<SidebarStats>({
    totalStudents: 0,
    totalResources: 0,
    pyqCount: 0,
    notesCount: 0,
    videoCount: 0,
    unreadMessages: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      }
    };
    fetchStats();
  }, []);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-72 fixed h-screen top-0 left-0 z-30 flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/60">
      {/* Logo Section */}
      <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-800/60">
        <Link href="/admin" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="h-5 w-5 text-slate-900 dark:text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">Admin Panel</h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-500 font-medium">College Connect CMS</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 px-3 mb-2">Navigation</p>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${active
                ? "bg-blue-600/15 text-blue-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800/60"
                }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-full" />
              )}
              <div className={`p-1.5 rounded-lg transition-all ${active
                ? "bg-blue-500/20 text-blue-400"
                : "bg-slate-800/50 text-slate-500 dark:text-slate-500 group-hover:bg-slate-200 dark:bg-slate-700/50 group-hover:text-slate-700 dark:text-slate-300"
                }`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block truncate text-[13px]">{item.label}</span>
              </div>
              {item.label === "Contact Forms" && stats.unreadMessages > 0 && (
                <div className="flex items-center justify-center bg-blue-500 text-slate-900 dark:text-white text-[9px] font-extrabold h-4 w-4 rounded-full ring-2 ring-slate-950">
                  {stats.unreadMessages}
                </div>
              )}
              {active && <ChevronRight className="h-3.5 w-3.5 text-blue-500/50 flex-shrink-0" />}
            </Link>
          );
        })}

      </nav>

      {/* Bottom Section */}
      <div className="px-4 pb-4">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-3.5 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-3 w-3 text-slate-600 dark:text-slate-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500">Platform Stats</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-base font-bold text-slate-900 dark:text-white leading-tight">{stats.totalStudents}</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-500">Total Users</p>
            </div>
            <div>
              <p className="text-base font-bold text-slate-900 dark:text-white leading-tight">64</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-500">Subjects</p>
            </div>
            <div>
              <p className="text-base font-bold text-emerald-400 leading-tight">100%</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-500">Uptime</p>
            </div>
            <div>
              <p className="text-base font-bold text-amber-400 leading-tight">{stats.totalResources}</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-500">Resources</p>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-center gap-1.5 text-slate-600">
          <Sparkles className="h-3 w-3" />
          <span className="text-[10px] font-medium">College Connect v2.0</span>
        </div>
      </div>
    </aside>
  );
}
