"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Calendar, ChevronLeft, ChevronRight, Plus, Bell, BellOff,
  CheckCircle2, Circle, Trash2, X, Clock, Tag, BookOpen,
  FlaskConical, FileText, Pencil, AlertCircle, ChevronRight as ChevronRightIcon,
  ListChecks, ArrowRight, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type EventType = "Exam" | "Assignment" | "Lab" | "Lecture" | "Other";
type TodoPriority = "high" | "medium" | "low";

interface CalendarWidgetProps {
  compact?: boolean;
}

interface CalEvent {
  _id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  type: EventType;
  time?: string;
  reminded: boolean;
}

interface Todo {
  _id: string;
  text: string;
  done: boolean;
  priority: TodoPriority;
  linkedDate?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const EVENT_COLORS: Record<EventType, { bg: string; text: string; dot: string; icon: React.ComponentType<{ className?: string }> }> = {
  Exam:       { bg: "bg-red-50",    text: "text-red-600",    dot: "bg-red-600",    icon: AlertCircle },
  Assignment: { bg: "bg-amber-50",  text: "text-amber-600",  dot: "bg-amber-600",  icon: FileText },
  Lab:        { bg: "bg-purple-50", text: "text-purple-600", dot: "bg-purple-600", icon: FlaskConical },
  Lecture:    { bg: "bg-blue-50",   text: "text-blue-600",   dot: "bg-blue-600",   icon: BookOpen },
  Other:      { bg: "bg-slate-50",  text: "text-slate-600",  dot: "bg-slate-600",  icon: Tag },
};

const PRIORITY_COLORS: Record<TodoPriority, string> = {
  high:   "text-red-700 bg-red-50 border-red-200",
  medium: "text-amber-700 bg-amber-50 border-amber-200",
  low:    "text-slate-700 bg-slate-50 border-slate-200",
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDay(y: number, m: number)    { return new Date(y, m, 1).getDay(); }

function formatDateDisplay(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function daysUntil(dateStr: string) {
  const today = new Date(); today.setHours(0,0,0,0);
  const target = new Date(dateStr + "T00:00:00");
  const diff = Math.ceil((target.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 0)  return `${Math.abs(diff)}d ago`;
  return `in ${diff}d`;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function CalendarWidget({ compact = false }: CalendarWidgetProps) {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(toKey(today.getFullYear(), today.getMonth(), today.getDate()));
  
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [todos,  setTodos]  = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [tab, setTab] = useState<"calendar" | "todo">("calendar");
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddTodo,  setShowAddTodo]  = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newType,  setNewType]  = useState<EventType>("Exam");
  const [newTime,  setNewTime]  = useState("");
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<TodoPriority>("medium");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [evRes, tdRes] = await Promise.all([
        fetch("/api/user/calendar"),
        fetch("/api/user/todos")
      ]);
      if (evRes.ok) setEvents(await evRes.json());
      if (tdRes.ok) setTodos(await tdRes.json());
    } catch (err) {
      console.error("Fetch Data Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const eventMap = useMemo(() => events.reduce<Record<string, CalEvent[]>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {}), [events]);

  const selectedEvents = eventMap[selectedDate] || [];
  const upcomingEvents = [...events]
    .filter(e => new Date(e.date + "T00:00:00").getTime() >= new Date().setHours(0,0,0,0))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const addEvent = async () => {
    if (!newTitle.trim()) return;
    const body = { title: newTitle.trim(), date: selectedDate, type: newType, time: newTime || undefined };
    try {
      const res = await fetch("/api/user/calendar", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const created = await res.json();
        setEvents(prev => [...prev, created]);
        setNewTitle(""); setNewTime(""); setShowAddEvent(false);
      }
    } catch (err) { console.error(err); }
  };

  const deleteEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/user/calendar?id=${id}`, { method: "DELETE" });
      if (res.ok) setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) { console.error(err); }
  };

  const addTodo = async () => {
    if (!newTodoText.trim()) return;
    const body = { text: newTodoText.trim(), done: false, priority: newTodoPriority };
    try {
      const res = await fetch("/api/user/todos", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const created = await res.json();
        setTodos(prev => [created, ...prev]);
        setNewTodoText(""); setShowAddTodo(false);
      }
    } catch (err) { console.error(err); }
  };

  const toggleTodo = async (id: string, currentDone: boolean) => {
    try {
      const res = await fetch("/api/user/todos", {
        method: "PATCH",
        body: JSON.stringify({ id, done: !currentDone }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) setTodos(prev => prev.map(t => t._id === id ? { ...t, done: !currentDone } : t));
    } catch (err) { console.error(err); }
  };

  const deleteTodo = async (id: string) => {
    try {
      const res = await fetch(`/api/user/todos?id=${id}`, { method: "DELETE" });
      if (res.ok) setTodos(prev => prev.filter(t => t._id !== id));
    } catch (err) { console.error(err); }
  };

  const totalPrev = firstDay(year, month);
  const totalDays = daysInMonth(year, month);
  const calCells: (number | null)[] = [...Array(totalPrev).fill(null), ...Array.from({ length: totalDays }, (_, i) => i + 1)];
  while (calCells.length % 7 !== 0) calCells.push(null);
  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());
  const pendingTodos = todos.filter(t => !t.done).length;

  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden",
      compact ? "shadow-sm" : "shadow-lg min-h-[500px]"
    )}>
      {/* ── Tab Header ── */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <button
          onClick={() => setTab("calendar")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-wider transition-colors",
            tab === "calendar" ? "text-blue-600 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <Calendar className="h-4 w-4" /> Calendar
        </button>
        <button
          onClick={() => setTab("todo")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-wider transition-colors",
            tab === "todo" ? "text-blue-600 bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <CheckCircle2 className="h-4 w-4" /> Tasks
          {pendingTodos > 0 && <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-blue-600 text-white rounded-md font-black">{pendingTodos}</span>}
        </button>
      </div>

      <div className={cn("p-6", compact && "p-4")}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading...</p>
          </div>
        ) : tab === "calendar" ? (
          <div className="space-y-6">
            <div className={cn("grid gap-8 lg:gap-12", compact ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-[340px,1fr]")}>
              {/* ── Left: Calendar ── */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white">{MONTHS[month]}</h3>
                    <span className="text-sm font-bold text-slate-400">{year}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"><ChevronLeft className="h-4 w-4" /></button>
                    <button onClick={nextMonth} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"><ChevronRight className="h-4 w-4" /></button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {DAYS.map(d => <span key={d} className="text-[10px] font-bold text-slate-400 uppercase text-center py-2">{d}</span>)}
                  {calCells.map((day, i) => {
                    if (!day) return <div key={i} />;
                    const key = toKey(year, month, day);
                    const isToday = key === todayKey;
                    const isSelected = key === selectedDate;
                    const dayEvents = eventMap[key] || [];
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(key)}
                        className={cn(
                          "relative aspect-square flex flex-col items-center justify-center rounded-lg border transition-colors font-bold text-sm",
                          isSelected 
                            ? "bg-blue-600 border-blue-600 text-white" 
                            : isToday 
                              ? "bg-blue-50 border-blue-200 text-blue-600" 
                              : "border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        )}
                      >
                        {day}
                        {dayEvents.length > 0 && !isSelected && (
                          <div className="absolute bottom-1.5 flex gap-0.5">
                            {dayEvents.slice(0, 3).map((_, j) => <div key={j} className="w-1 h-1 bg-blue-400 rounded-full" />)}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Right: Events List ── */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    {selectedDate === todayKey ? "TODAY" : formatDateDisplay(selectedDate)}
                  </h4>
                  <button 
                    onClick={() => setShowAddEvent(!showAddEvent)} 
                    className="bg-blue-600 text-white rounded-xl px-4 py-2 text-xs font-black flex items-center gap-2 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all active:scale-95"
                  >
                    <Plus className="h-4 w-4" /> NEW EVENT
                  </button>
                </div>

                {showAddEvent && (
                  <div className="mb-6 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900/80 dark:to-slate-900/40 shadow-sm space-y-4">
                    <h5 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                      <Plus className="h-4 w-4 text-blue-500" /> Create New Event
                    </h5>
                    <div className="space-y-3">
                      <input 
                        autoFocus 
                        value={newTitle} 
                        onChange={e => setNewTitle(e.target.value)} 
                        placeholder="What's happening?" 
                        className="w-full text-sm font-bold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400" 
                      />
                      <div className="flex gap-3">
                        <div className="flex-1 relative">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                          <select 
                            value={newType} 
                            onChange={e => setNewType(e.target.value as EventType)} 
                            className="w-full text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-3 bg-white dark:bg-slate-950 appearance-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                          >
                            {(Object.keys(EVENT_COLORS) as EventType[]).map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div className="flex-1 relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                          <input 
                            type="time" 
                            value={newTime} 
                            onChange={e => setNewTime(e.target.value)} 
                            className="w-full text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-3 bg-white dark:bg-slate-950 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={addEvent} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl py-3 text-xs font-black shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]">
                        SAVE EVENT
                      </button>
                      <button onClick={() => setShowAddEvent(false)} className="px-5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        CANCEL
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                      <Calendar className="h-10 w-10 mb-2 opacity-50" />
                      <p className="text-[10px] font-black uppercase tracking-widest">No events</p>
                    </div>
                  ) : (
                    selectedEvents.map(ev => {
                      const cfg = EVENT_COLORS[ev.type];
                      const Icon = cfg.icon;
                      return (
                        <div key={ev._id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 group">
                          <div className={cn("p-2 rounded-lg", cfg.bg)}><Icon className={cn("h-4 w-4", cfg.text)} /></div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{ev.title}</h5>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{ev.type} {ev.time && `• ${ev.time}`}</p>
                          </div>
                          <button onClick={() => deleteEvent(ev._id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {!compact && (
              <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Upcoming Schedule</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                   {upcomingEvents.map(ev => (
                     <div key={ev._id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                           <span className={cn("text-[8px] font-black px-1.5 py-0.5 rounded uppercase", EVENT_COLORS[ev.type].bg, EVENT_COLORS[ev.type].text)}>{ev.type}</span>
                           <span className="text-[8px] font-bold text-slate-400 uppercase">{daysUntil(ev.date)}</span>
                        </div>
                        <h6 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{ev.title}</h6>
                        <p className="text-[9px] font-bold text-slate-400 mt-1">{formatDateDisplay(ev.date)}</p>
                     </div>
                   ))}
                   <Link href="/dashboard/calendar" className="p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-blue-400 dark:hover:border-blue-600 transition-colors group">
                     <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                     <span className="text-[8px] font-black text-slate-400 group-hover:text-blue-500 uppercase">View more</span>
                   </Link>
                 </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Active Tasks</h4>
               <button onClick={() => setShowAddTodo(!showAddTodo)} className="bg-blue-600 text-white rounded-xl px-4 py-2 text-xs font-black flex items-center gap-2 hover:bg-blue-700">
                 <Plus className="h-4 w-4" /> NEW TASK
               </button>
            </div>

            {showAddTodo && (
              <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 space-y-4">
                <input autoFocus value={newTodoText} onChange={e => setNewTodoText(e.target.value)} onKeyDown={e => e.key === "Enter" && addTodo()} placeholder="Task detail..." className="w-full text-sm font-bold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                <div className="flex gap-2">
                  {(["high","medium","low"] as TodoPriority[]).map(p => (
                    <button key={p} onClick={() => setNewTodoPriority(p)} className={cn("flex-1 text-[9px] font-black px-3 py-2 rounded-lg border uppercase transition-colors", newTodoPriority === p ? "bg-blue-600 border-blue-600 text-white" : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500")}>{p}</button>
                  ))}
                </div>
                <div className="flex gap-2">
                   <button onClick={addTodo} className="flex-1 bg-blue-600 text-white rounded-lg py-3 text-xs font-black shadow-lg shadow-blue-600/10">CREATE TASK</button>
                   <button onClick={() => setShowAddTodo(false)} className="px-4 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:bg-slate-100 opacity-60">CANCEL</button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {todos.filter(t => !t.done).map(todo => (
                <div key={todo._id} className="flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-blue-200 dark:hover:border-blue-900/40 group">
                  <button onClick={() => toggleTodo(todo._id, todo.done)} className="text-slate-200 dark:text-slate-700 hover:text-blue-500 transition-colors"><Circle className="h-6 w-6" /></button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{todo.text}</p>
                    {todo.linkedDate && <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{formatDateDisplay(todo.linkedDate)}</p>}
                  </div>
                  <span className={cn("text-[8px] font-black px-1.5 py-0.5 rounded border uppercase", PRIORITY_COLORS[todo.priority])}>{todo.priority}</span>
                  <button onClick={() => deleteTodo(todo._id)} className="p-2 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>

            {todos.some(t => t.done) && (
              <div className="pt-8 mt-4 border-t border-slate-100 dark:border-slate-800">
                 <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Completed</h5>
                 <div className="space-y-1.5">
                   {todos.filter(t => t.done).map(todo => (
                     <div key={todo._id} className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-lg opacity-60 group">
                       <button onClick={() => toggleTodo(todo._id, todo.done)} className="text-emerald-500"><CheckCircle2 className="h-5 w-5" /></button>
                       <p className="text-xs font-bold text-slate-500 line-through flex-1">{todo.text}</p>
                       <button onClick={() => deleteTodo(todo._id)} className="p-1.5 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="h-3.5 w-3.5" /></button>
                     </div>
                   ))}
                 </div>
              </div>
            )}
            
            {todos.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 opacity-30">
                <ListChecks className="h-12 w-12 mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest">List is Empty</p>
              </div>
            )}
          </div>
        )}
      </div>

      {compact && (
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Academic Planner</p>
          <Link href="/dashboard/calendar" className="text-[9px] font-black text-blue-600 hover:underline uppercase">Full Calendar</Link>
        </div>
      )}
    </div>
  );
}
