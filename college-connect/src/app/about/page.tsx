"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BookOpen, Video, FileText, ListChecks, Users, Zap,
  GraduationCap, Globe, Target, Heart, ArrowRight, ChevronRight, Star
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Smart Study Notes",
    desc: "Access thousands of curated, syllabus-aligned notes contributed by top students and verified by educators.",
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  },
  {
    icon: FileText,
    title: "Previous Year Papers",
    desc: "Practise with a rich archive of PYQs sorted by year, subject, and difficulty to master exam patterns.",
    color: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",
  },
  {
    icon: Video,
    title: "Video Library",
    desc: "Watch high-quality recorded lectures and concept videos aligned perfectly with your university syllabus.",
    color: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
  },
  {
    icon: ListChecks,
    title: "Syllabus Tracker",
    desc: "Track exactly which topics you've covered, what's pending, and how close you are to completing your semester.",
    color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Globe,
    title: "Multi-University Support",
    desc: "Built to support students from multiple universities — MDU and many more universities coming soon.",
    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  },
  {
    icon: Zap,
    title: "Instant Access",
    desc: "No clutter, no waiting. Log in, choose your course, and get instant access to everything you need.",
    color: "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400",
  },
];

const stats = [
  { label: "Study Resources", value: "5,000+", icon: BookOpen },
  { label: "PYQs Available", value: "2,000+", icon: FileText },
  { label: "Video Lectures", value: "800+", icon: Video },
  { label: "Universities", value: "10+", icon: GraduationCap },
];

const team = [
  { name: "Academic Focus", desc: "Built by students who understand the struggle of finding the right resources at exam time.", icon: Target },
  { name: "Free for All", desc: "College Connect is completely free for every student. No hidden fees, no paywalls — ever.", icon: Heart },
  { name: "Community Driven", desc: "Grow together. Student contributions make the platform smarter and more complete over time.", icon: Users },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-black transition-colors duration-500">

      {/* Header */}
      <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b dark:border-slate-800 bg-white dark:bg-black sticky top-0 z-50 shadow-sm dark:shadow-none transition-colors duration-300">
        <Link href="/" className="flex items-center">
          <Logo size={38} textSize="text-xl" />
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
          <Link href="/about" className="text-sm font-medium text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-0.5">About Us</Link>
          <Link href="/contact" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Us</Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/register" className={cn(buttonVariants(), "bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6")}>
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1">

        {/* Hero */}
        <section className="relative w-full py-24 md:py-36 bg-white dark:bg-black overflow-hidden transition-colors duration-500">
          {/* Background orbs */}
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 pointer-events-none">
            <div className="w-[700px] h-[700px] bg-blue-100/60 dark:bg-blue-900/10 rounded-full blur-3xl" />
          </div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 pointer-events-none">
            <div className="w-[500px] h-[500px] bg-indigo-100/60 dark:bg-indigo-900/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Star className="h-3.5 w-3.5 fill-current" />
              About College Connect
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              We make studying{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                smarter, not harder
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              College Connect is your all-in-one academic companion — built by students, for students.
              Get notes, PYQs, videos, and syllabus tracking, all in one place, perfectly matched to your university and course.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-10 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 gap-2 group")}>
                Start for Free <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/dashboard" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "rounded-full px-8 gap-2 dark:text-white dark:border-slate-700 dark:hover:bg-slate-800 group")}>
                View Dashboard <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <Icon className="h-7 w-7 text-blue-600 dark:text-blue-400 mb-1" />
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="py-24 bg-white dark:bg-black transition-colors duration-500">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-5">Our Mission</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Every student deserves access to the right study material — without scrolling through dozens of Telegram groups, random PDFs, and outdated websites.
            </p>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              We built College Connect to give Indian university students a <span className="font-semibold text-slate-700 dark:text-slate-200">single, clean, trusted platform</span> where they can find everything they need — from day one of their semester to the final exam.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                Everything you need, in one place
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
                From notes to videos to PYQs — College Connect covers your entire academic journey.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us */}
        <section className="py-24 bg-white dark:bg-black transition-colors duration-500">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Why College Connect?</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">Built with the right values from day one.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map(({ name, desc, icon: Icon }) => (
                <div key={name} className="flex flex-col items-center text-center p-8 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/10 dark:to-slate-900 border border-blue-100 dark:border-blue-900/30 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center mb-5 shadow-md shadow-blue-600/20">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5">
              Ready to study smarter?
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of students who are already using College Connect to ace their exams and stay ahead.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/register" className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 font-bold rounded-full px-8 py-3 transition-all shadow-xl shadow-blue-900/20 group">
                Create Free Account <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/login" className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white/80 text-white font-semibold rounded-full px-8 py-3 transition-all">
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black border-t border-slate-800 py-10 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size={30} textSize="text-base" />
          <p className="text-slate-500 text-sm text-center">
            © {new Date().getFullYear()} College Connect. Made with ❤️ for students.
          </p>
          <div className="flex gap-6">
            <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">Home</Link>
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="text-sm text-slate-400 hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
