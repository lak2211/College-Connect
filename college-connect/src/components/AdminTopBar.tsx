"use client";

import { LogOut, Search, Command } from "lucide-react";
import { SearchDialog, useSearchShortcut } from "@/components/SearchDialog";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { ThemeToggle } from "@/components/ThemeToggle";
import { signOut } from "next-auth/react";

export function AdminTopBar({ userName }: { userName: string }) {
  const initials = userName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const { isOpen: searchOpen, setIsOpen: setSearchOpen } = useSearchShortcut();

  return (
    <>
      <header className="h-16 border-b border-slate-200 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-20 px-8 flex items-center justify-between">
        {/* Left: Breadcrumb-style title */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 dark:text-slate-500 font-medium">Admin</span>
          <span className="text-slate-700">/</span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Content Management</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Search shortcut */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/50 rounded-lg text-xs text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:text-slate-300 hover:border-slate-600 transition-all"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search...</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700/50 rounded text-[10px] text-slate-600 dark:text-slate-400 font-mono">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <NotificationDropdown variant="admin" />

          {/* Divider */}
          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-blue-500/20">
              {initials}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-none">{userName}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-0.5">Administrator</p>
            </div>
          </div>

          {/* Exit */}
          <button
            onClick={() => signOut({ callbackUrl: "/admin-login" })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Exit</span>
          </button>
        </div>
      </header>

      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} variant="admin" />
    </>
  );
}
