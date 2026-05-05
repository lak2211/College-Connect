"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bell, UploadCloud, Users, AlertCircle, CheckCircle2, Clock,
  MessageSquare, BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "upload" | "user" | "message";
}

const ADMIN_NOTIFICATIONS: Notification[] = [
  { id: "1", title: "New Resource Uploaded", description: "DBMS Unit 3 Notes was uploaded by faculty.", time: "5 min ago", read: false, type: "upload" },
  { id: "2", title: "New Contact Form", description: "A student submitted a query about admissions.", time: "30 min ago", read: false, type: "message" },
  { id: "3", title: "New User Registration", description: "3 new students signed up today.", time: "2 hours ago", read: false, type: "user" },
  { id: "4", title: "Upload Approved", description: "OS PYQ 2024 is now live for students.", time: "5 hours ago", read: true, type: "success" },
];

const STUDENT_NOTIFICATIONS: Notification[] = [
  { id: "1", title: "New Notes Available", description: "DBMS Unit 3 Notes have been uploaded.", time: "5 min ago", read: false, type: "upload" },
  { id: "2", title: "PYQ Added", description: "Operating Systems PYQ 2024 is now available.", time: "2 hours ago", read: false, type: "upload" },
  { id: "3", title: "Syllabus Updated", description: "New topics added to Machine Learning.", time: "1 day ago", read: false, type: "info" },
  { id: "4", title: "Welcome!", description: "Thanks for joining College Connect.", time: "3 days ago", read: true, type: "success" },
];

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  upload: { icon: UploadCloud, color: "text-blue-600", bg: "bg-blue-50" },
  user: { icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
  message: { icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" },
  success: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  warning: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
  info: { icon: BookOpen, color: "text-slate-600", bg: "bg-slate-50" },
};

interface NotificationDropdownProps {
  variant?: "admin" | "student";
}

export function NotificationDropdown({ variant = "student" }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(
    variant === "admin" ? ADMIN_NOTIFICATIONS : STUDENT_NOTIFICATIONS
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-white dark:border-slate-900" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-[10px] font-bold text-blue-600 hover:underline px-2 py-1">Mark all read</button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                <p className="text-xs">No notifications</p>
              </div>
            ) : (
              notifications.map((n) => {
                const config = typeConfig[n.type] || typeConfig.info;
                const Icon = config.icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={cn(
                      "w-full flex items-start gap-3 px-4 py-3 text-left border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                      !n.read && "bg-blue-50/30 dark:bg-blue-900/10"
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", config.bg, "dark:bg-slate-800")}>
                      <Icon className={cn("h-4 w-4", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{n.title}</p>
                        {!n.read && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.description}</p>
                      <p className="text-[9px] text-slate-400 mt-1 flex items-center gap-1 uppercase font-bold tracking-tighter">
                        <Clock className="h-2.5 w-2.5" /> {n.time}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
