"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, X, FileText, BookOpen, Video, Users, UploadCloud,
  Settings, BarChart3, MessageSquare, GraduationCap, Zap
} from "lucide-react";

interface SearchItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  category: string;
}

const STUDENT_PAGES: SearchItem[] = [
  { id: "s1", title: "Dashboard", description: "Overview of your progress", href: "/dashboard", icon: BarChart3, category: "Pages" },
  { id: "s2", title: "Courses", description: "Browse all course materials", href: "/dashboard/courses", icon: GraduationCap, category: "Pages" },
  { id: "s3", title: "Notes", description: "Study notes & summaries", href: "/dashboard/notes", icon: FileText, category: "Resources" },
  { id: "s4", title: "PYQs", description: "Previous year question papers", href: "/dashboard/pyqs", icon: BookOpen, category: "Resources" },
  { id: "s5", title: "Video Library", description: "Video lectures & tutorials", href: "/dashboard/videos", icon: Video, category: "Resources" },
  { id: "s6", title: "Syllabus Tracker", description: "Track your study progress", href: "/dashboard/syllabus", icon: Zap, category: "Pages" },
  { id: "s7", title: "Profile", description: "Manage your account", href: "/dashboard/profile", icon: Users, category: "Settings" },
];

const ADMIN_PAGES: SearchItem[] = [
  { id: "a1", title: "Dashboard", description: "Admin overview & analytics", href: "/admin", icon: BarChart3, category: "Pages" },
  { id: "a2", title: "Upload Resources", description: "Add PYQs, notes or videos", href: "/admin/upload", icon: UploadCloud, category: "Pages" },
  { id: "a3", title: "Manage Users", description: "View and manage students", href: "/admin/users", icon: Users, category: "Pages" },
  { id: "a4", title: "Contact Forms", description: "Review submitted inquiries", href: "/admin/contacts", icon: MessageSquare, category: "Pages" },
  { id: "a5", title: "Settings", description: "Platform configuration", href: "/admin/settings", icon: Settings, category: "Pages" },
];

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: "admin" | "student";
  subjects?: string[];
}

export function SearchDialog({ isOpen, onClose, variant = "student", subjects = [] }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const pageItems = variant === "admin" ? ADMIN_PAGES : STUDENT_PAGES;
  const subjectItems: SearchItem[] = subjects.map((sub, i) => ({
    id: `sub-${i}`,
    title: sub,
    description: variant === "admin" ? "Subject resources" : "Notes, PYQs & Videos",
    href: variant === "admin" ? "/admin/upload" : "/dashboard/courses",
    icon: FileText,
    category: "Subjects",
  }));
  const items = [...pageItems, ...subjectItems];

  const filtered = query.trim()
    ? items.filter(
      item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    )
    : items;

  // Group by category
  const grouped = filtered.reduce<Record<string, SearchItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const flatFiltered = Object.values(grouped).flat();

  useEffect(() => {
    if (isOpen) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setQuery(prev => prev !== "" ? "" : prev);
      setSelectedIndex(prev => prev !== 0 ? 0 : prev);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setSelectedIndex(prev => prev !== 0 ? 0 : prev);
  }, [query]);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      router.push(item.href);
      onClose();
    },
    [router, onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, flatFiltered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && flatFiltered[selectedIndex]) {
        handleSelect(flatFiltered[selectedIndex]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, selectedIndex, flatFiltered, handleSelect, onClose]);

  if (!isOpen) return null;

  const isAdmin = variant === "admin";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className={`relative w-full max-w-lg mx-4 rounded-2xl shadow-2xl border overflow-hidden ${isAdmin
        ? "bg-slate-900 border-slate-700/50 shadow-black/50"
        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/50 shadow-slate-500/10 dark:shadow-black/50"
        }`}>
        {/* Search Input */}
        <div className={`flex items-center gap-3 px-4 border-b ${isAdmin ? "border-slate-800" : "border-slate-100 dark:border-slate-800"
          }`}>
          <Search className={`h-5 w-5 flex-shrink-0 ${isAdmin ? "text-slate-500" : "text-slate-400 dark:text-slate-500"
            }`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, subjects, resources..."
            className={`flex-1 h-14 bg-transparent outline-none text-sm font-medium placeholder:font-normal ${isAdmin
              ? "text-white placeholder:text-slate-500"
              : "text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              }`}
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
          <kbd className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold ${isAdmin
            ? "bg-slate-800 text-slate-500 border border-slate-700"
            : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700"
            }`}>ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[350px] overflow-y-auto p-2">
          {flatFiltered.length === 0 ? (
            <div className="py-10 text-center">
              <Search className={`h-10 w-10 mx-auto mb-3 ${isAdmin ? "text-slate-700" : "text-slate-300 dark:text-slate-700"}`} />
              <p className={`text-sm font-medium ${isAdmin ? "text-slate-500" : "text-slate-400 dark:text-slate-500"}`}>
                No results for &ldquo;{query}&rdquo;
              </p>
            </div>
          ) : (
            Object.entries(grouped).map(([category, categoryItems]) => (
              <div key={category} className="mb-2">
                <p className={`text-[10px] font-bold uppercase tracking-wider px-3 py-2 ${isAdmin ? "text-slate-600" : "text-slate-400 dark:text-slate-600"
                  }`}>{category}</p>
                {categoryItems.map((item) => {
                  const globalIdx = flatFiltered.indexOf(item);
                  const isSelected = globalIdx === selectedIndex;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${isSelected
                        ? isAdmin
                          ? "bg-blue-600/10 text-blue-400"
                          : "bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400"
                        : isAdmin
                          ? "text-slate-300 hover:bg-slate-800/60"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected
                        ? isAdmin ? "bg-blue-600/20" : "bg-blue-100 dark:bg-blue-600/20"
                        : isAdmin ? "bg-slate-800" : "bg-slate-100 dark:bg-slate-800"
                        }`}>
                        <Icon className={`h-4 w-4 ${isSelected
                          ? isAdmin ? "text-blue-400" : "text-blue-500 dark:text-blue-400"
                          : isAdmin ? "text-slate-500" : "text-slate-400 dark:text-slate-500"
                          }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{item.title}</p>
                        <p className={`text-[11px] truncate ${isAdmin ? "text-slate-500" : "text-slate-400 dark:text-slate-500"
                          }`}>{item.description}</p>
                      </div>
                      {isSelected && (
                        <span className={`text-[10px] font-bold ${isAdmin ? "text-slate-600" : "text-slate-300 dark:text-slate-600"
                          }`}>↵</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between px-4 py-2.5 border-t text-[10px] font-medium ${isAdmin
          ? "border-slate-800 text-slate-600"
          : "border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600"
          }`}>
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>ESC Close</span>
        </div>
      </div>
    </div>
  );
}

// Hook for keyboard shortcut
export function useSearchShortcut() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return { isOpen, setIsOpen };
}
