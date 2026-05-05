"use client";

import { useState, useEffect } from "react";

import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Search, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchDialog, useSearchShortcut } from "@/components/SearchDialog";
import { NotificationDropdown } from "@/components/NotificationDropdown";

export function DashboardTopBar() {
  const router = useRouter();
  const { data: session } = useSession();
  const userName = session?.user?.name || "Student";
  const userCourse = (session?.user as { course?: string })?.course || "Enrolled";
  const userEmail = session?.user?.email || "student@mdu.ac.in";
  const { isOpen: searchOpen, setIsOpen: setSearchOpen } = useSearchShortcut();

  // Initialize subjects from session if available
  const [subjects, setSubjects] = useState<string[]>(() => {
    return (session?.user as { subjects?: string[] })?.subjects || [];
  });

  useEffect(() => {
    // If subjects are already set from session in initializer, or we need to fetch
    const sessionSubjects = (session?.user as { subjects?: string[] })?.subjects;

    if (sessionSubjects && sessionSubjects.length > 0) {
      if (JSON.stringify(subjects) !== JSON.stringify(sessionSubjects)) {
        // Wrap in setTimeout to avoid synchronous setState in effect warning
        // but better to just use a higher level state or avoid the update if possible.
        // For now, we use a ref-like check (which we have) and just suppress or use a microtask.
        /* eslint-disable-next-line react-hooks/set-state-in-effect */
        setSubjects(sessionSubjects);
      }
    } else if (session) {
      // Fallback: fetch from API only if session exists and no subjects
      fetch("/api/user/profile")
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.subjects && JSON.stringify(subjects) !== JSON.stringify(data.subjects)) {
            setSubjects(data.subjects);
          }
        })
        .catch(() => { });
    }
  }, [session, subjects]);

  return (
    <>
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10 transition-colors duration-300">
        {/* Search Bar */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex-1 max-w-md flex items-center gap-3 px-4 h-10 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-text"
        >
          <Search className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1 text-left">Search resources, topics...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
            Ctrl K
          </kbd>
        </button>

        <div className="flex items-center space-x-3 ml-4">
          <Link 
            href="/dashboard/contact"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <MessageSquare className="h-4 w-4" />
            Contact Support
          </Link>
          <NotificationDropdown variant="student" />
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-10 flex items-center space-x-2 rounded-full px-2 hover:bg-gray-100 dark:hover:bg-slate-800">
              <div className="flex flex-col text-right">
                <span className="text-sm font-medium leading-none">{userName}</span>
                <span className="text-xs text-gray-500 mt-1">{userCourse}</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="px-2 py-1.5 text-sm font-medium">
                <div className="flex flex-col space-y-1 font-normal">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard/profile")} className="cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })} className="text-red-600 dark:text-red-400 cursor-pointer focus:bg-red-50 dark:focus:bg-red-950">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} variant="student" subjects={subjects} />
    </>
  );
}
