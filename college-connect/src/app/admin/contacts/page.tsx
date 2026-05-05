"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  MessageSquare, Search, Mail, Eye,
  CheckCircle2, Clock, AlertCircle, ChevronLeft,
  ChevronRight, Loader2, Star
} from "lucide-react";
import { useEffect } from "react";

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  priority: 'low' | 'medium' | 'high';
  starred: boolean;
  createdAt: string;
}

const statusConfig = {
  unread: { label: "Unread", color: "bg-blue-500/10 text-blue-400 border-blue-500/30", dot: "bg-blue-400" },
  read: { label: "Read", color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30", dot: "bg-slate-500" },
  replied: { label: "Replied", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" },
};

const priorityConfig = {
  high: { label: "High", color: "text-red-400" },
  medium: { label: "Medium", color: "text-amber-400" },
  low: { label: "Low", color: "text-slate-600 dark:text-slate-400" },
};

export default function ContactSubmissionsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("/api/admin/contacts");
        if (res.ok) {
          const data = await res.json();
          setContacts(data.contacts || []);
        }
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const filtered = contacts.filter(c => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const matchSearch = !search || 
      fullName.includes(search.toLowerCase()) || 
      c.subject.toLowerCase().includes(search.toLowerCase()) || 
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const unreadCount = contacts.filter(c => c.status === "unread").length;

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  function formatTime(d: string) {
    return new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Contact Submissions</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">View and respond to student inquiries from the contact form.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 rounded-xl"><MessageSquare className="h-5 w-5 text-blue-400" /></div>
          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{contacts.length}</p>
            <p className="text-[10px] text-blue-300/70 font-medium">Total Messages</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-600/20 to-amber-900/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 rounded-xl"><AlertCircle className="h-5 w-5 text-amber-400" /></div>
          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{unreadCount}</p>
            <p className="text-[10px] text-amber-300/70 font-medium">Unread</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-900/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 rounded-xl"><CheckCircle2 className="h-5 w-5 text-emerald-400" /></div>
          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{contacts.filter(c => c.status === "replied").length}</p>
            <p className="text-[10px] text-emerald-300/70 font-medium">Replied</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/10 border border-purple-500/20 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/20 rounded-xl"><Star className="h-5 w-5 text-purple-400" /></div>
          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{contacts.filter(c => c.starred).length}</p>
            <p className="text-[10px] text-purple-300/70 font-medium">Starred</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-500" />
          <Input
            type="search"
            placeholder="Search by name, email, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-slate-50 dark:bg-slate-900 border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-500 rounded-xl focus-visible:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {["all", "unread", "read", "replied"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === s
                  ? "bg-blue-600 text-slate-900 dark:text-white shadow-md shadow-blue-600/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-700 hover:text-slate-800 dark:text-slate-200"
              }`}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              {s === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-blue-500/30 rounded-full text-[10px]">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filtered.map((contact) => (
          <Card
            key={contact._id}
            className={`border rounded-2xl transition-all cursor-pointer ${
              contact.status === "unread"
                ? "bg-slate-900/80 border-blue-800/30 shadow-lg shadow-blue-900/10"
                : "bg-slate-900/40 border-slate-200 dark:border-slate-800"
            } hover:border-slate-700`}
          >
            <CardContent className="p-5">
              {/* Top Row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold ${
                    contact.status === "unread"
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-slate-900 dark:text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}>
                    {contact.firstName[0]}{contact.lastName ? contact.lastName[0] : ""}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold text-sm ${contact.status === "unread" ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                        {contact.firstName} {contact.lastName}
                      </span>
                      <Badge variant="outline" className={`${statusConfig[contact.status].color} text-[10px] font-bold px-2 py-0 rounded-full`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[contact.status].dot} mr-1 inline-block`} />
                        {statusConfig[contact.status].label}
                      </Badge>
                      <span className={`text-[10px] font-bold ${priorityConfig[contact.priority].color}`}>
                        ● {priorityConfig[contact.priority].label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{contact.email}</p>
                    <p className={`text-sm mt-2 ${contact.status === "unread" ? "font-semibold text-slate-800 dark:text-slate-200" : "text-slate-700 dark:text-slate-300"}`}>
                      {contact.subject}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 line-clamp-2">{contact.message}</p>

                    {/* Expanded Message */}
                    {expandedId === contact._id && (
                      <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-300 dark:border-slate-700/50 text-sm text-slate-700 dark:text-slate-300 leading-relaxed animate-in slide-in-from-top-2 fade-in duration-300">
                        {contact.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Time & Actions */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span className="text-[11px]">{formatTime(contact.createdAt)}</span>
                  </div>
                  <span className="text-[10px] text-slate-600">{formatDate(contact.createdAt)}</span>
                  <div className="flex items-center gap-1 mt-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === contact._id ? null : contact._id); }}
                      className="p-1.5 rounded-lg text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                      title="View full message"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare className="h-12 w-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400 font-medium">No messages found</p>
            <p className="text-slate-600 text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-500">
          Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{filtered.length}</span> of <span className="font-semibold text-slate-700 dark:text-slate-300">{contacts.length}</span> messages
        </p>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" disabled className="text-slate-600 rounded-lg h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="bg-blue-600 text-slate-900 dark:text-white rounded-lg h-8 w-8 p-0 hover:bg-blue-700 text-xs font-bold">1</Button>
          <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800 rounded-lg h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
