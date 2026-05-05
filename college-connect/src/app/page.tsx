"use client";

import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { BookOpen, FileText, Video, ArrowRight, GraduationCap, Users, ShieldCheck, Zap } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef } from "react";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scaleNav = useTransform(scrollYProgress, [0, 0.1], [1, 0.98]);

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-[#fafcff] dark:bg-[#030014] text-slate-900 dark:text-white font-sans overflow-hidden selection:bg-cyan-500/30 transition-colors duration-500">
      
      {/* Stunning Aurora Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-purple-300/30 dark:bg-purple-700/20 blur-[120px] rounded-full mix-blend-normal dark:mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[60vw] h-[60vw] bg-cyan-300/30 dark:bg-cyan-600/20 blur-[120px] rounded-full mix-blend-normal dark:mix-blend-screen animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[40%] left-[20%] w-[50vw] h-[50vw] bg-blue-300/20 dark:bg-blue-600/10 blur-[120px] rounded-full mix-blend-normal dark:mix-blend-screen animate-pulse-slow" style={{ animationDelay: "4s" }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.04] mix-blend-overlay" />
      </div>

      {/* Navbar */}
      <motion.header 
        style={{ scale: scaleNav }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-50 bg-white/70 dark:bg-[#030014]/40 backdrop-blur-3xl border-b border-white/50 dark:border-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-none"
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }} 
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <Logo size={36} />
            </motion.div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-10">
            {["Features", "About", "Contact"].map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 0.3 }}>
                <Link 
                  href={`/${item.toLowerCase()}`}
                  className="text-sm font-bold text-slate-500 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-center gap-5">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Sign In</Link>
            <Link 
              href="/register" 
              className="relative overflow-hidden rounded-full p-[1px] group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-500 rounded-full opacity-70 group-hover:opacity-100 transition-opacity animate-gradient-x" />
              <div className="relative bg-white dark:bg-[#030014] px-8 py-2.5 rounded-full transition-all group-hover:bg-transparent">
                <span className="relative z-10 font-bold text-slate-900 dark:text-white group-hover:text-white transition-colors">Get Started</span>
              </div>
            </Link>
          </motion.div>
        </div>
      </motion.header>

      <main className="flex-1 relative z-10 pt-20">
        
        {/* Animated Hero Section */}
        <section className="relative min-h-[90vh] flex items-center px-6 pt-10">
          <motion.div 
            style={{ y: heroY, opacity: heroOpacity }}
            className="container mx-auto flex flex-col lg:flex-row items-center gap-16"
          >
            <div className="flex-1 text-center lg:text-left z-20">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-white/[0.03] border border-cyan-100/50 dark:border-white/[0.08] text-cyan-600 dark:text-cyan-300 text-xs font-black uppercase tracking-widest mb-8 backdrop-blur-xl shadow-[0_8px_20px_rgba(34,211,238,0.15)] dark:shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_12px_30px_rgba(34,211,238,0.2)] dark:hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-shadow cursor-default"
              >
                <Zap className="h-4 w-4 text-cyan-500 fill-cyan-400 dark:fill-cyan-400 animate-pulse" />
                Next-Gen Academic Platform
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, type: "spring", damping: 20 }}
                className="text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.05] tracking-tighter mb-8 text-slate-800 dark:text-white"
              >
                Master Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-600 dark:from-cyan-400 dark:via-purple-400 dark:to-blue-500 animate-gradient-x drop-shadow-[0_0_30px_rgba(192,132,252,0.2)] dark:drop-shadow-[0_0_30px_rgba(192,132,252,0.3)]">
                  Studies.
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-lg md:text-xl text-slate-600 dark:text-slate-300/80 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
              >
                Access verified notes, previous year papers, and curated video lectures specifically tailored for your university course.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
              >
                <Link href="/register" className="group relative flex items-center justify-center gap-2 h-16 px-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-[#030014] font-black text-lg transition-all duration-300 hover:scale-105 hover:bg-slate-800 dark:hover:bg-cyan-50 overflow-hidden shadow-[0_10px_30px_rgba(15,23,42,0.2)] dark:shadow-none hover:shadow-[0_15px_40px_rgba(34,211,238,0.3)] dark:hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 dark:from-cyan-400/20 dark:to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center gap-2">
                    Start Learning Free
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            </div>
            
            <div className="flex-1 relative w-full aspect-square max-w-2xl mx-auto z-10 hidden md:block perspective-[1000px]">
              {/* Massive ambient light anchor */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[15%] bg-gradient-to-tr from-cyan-500/40 via-purple-500/20 to-blue-600/40 blur-[100px] rounded-full" 
              />
              
              {/* Primary Floating Core */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, rotateY: [0, 15, -15, 0], rotateX: [0, 10, -10, 0] }}
                transition={{ opacity: { duration: 1 }, scale: { duration: 1 }, rotateY: { duration: 10, repeat: Infinity, ease: "easeInOut" }, rotateX: { duration: 12, repeat: Infinity, ease: "easeInOut" } }}
                className="absolute inset-[20%] rounded-full border border-white/60 dark:border-white/20 bg-gradient-to-tr from-white/90 to-white/50 dark:from-white/5 dark:to-white/10 backdrop-blur-3xl shadow-[0_20px_60px_rgba(34,211,238,0.15)] dark:shadow-[0_0_80px_rgba(34,211,238,0.3)] flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-purple-500/10" />
                <motion.div 
                   animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   className="w-1/2 h-1/2 rounded-full bg-cyan-400/40 dark:bg-cyan-400/30 blur-2xl"
                />
              </motion.div>

              {/* Orbiting Ring 1 */}
              <motion.div 
                animate={{ rotateZ: 360, rotateX: 60, rotateY: 30 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[10%] rounded-full border border-cyan-400/40 dark:border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
              />
              
              {/* Orbiting Ring 2 */}
              <motion.div 
                animate={{ rotateZ: -360, rotateX: 45, rotateY: 70 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[5%] rounded-full border border-purple-400/40 dark:border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
              />

              {/* Orbiting Ring 3 */}
              <motion.div 
                animate={{ rotateZ: 360, rotateX: 75, rotateY: -20 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-blue-400/30 dark:border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.1)] gap-1"
                style={{ borderStyle: 'dashed' }}
              />

              {/* Floating Interface Card 1 */}
              <motion.div
                initial={{ opacity: 0, x: 100, y: -50 }}
                animate={{ opacity: 1, x: 0, y: [-20, 20, -20] }}
                transition={{ opacity: { duration: 1 }, x: { duration: 1 }, y: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
                className="absolute right-0 top-[10%] bg-white/90 dark:bg-white/5 backdrop-blur-2xl border border-white/50 dark:border-white/10 p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col gap-3 w-48"
              >
                <div className="h-2 w-1/2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
                <div className="flex flex-col gap-2">
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full" />
                  <div className="h-1.5 w-5/6 bg-slate-200 dark:bg-white/10 rounded-full" />
                  <div className="h-1.5 w-4/6 bg-slate-200 dark:bg-white/10 rounded-full" />
                </div>
              </motion.div>

              {/* Floating Interface Card 2 */}
              <motion.div
                initial={{ opacity: 0, x: -100, y: 100 }}
                animate={{ opacity: 1, x: 0, y: [20, -20, 20] }}
                transition={{ opacity: { duration: 1 }, x: { duration: 1 }, y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 } }}
                className="absolute left-0 bottom-[20%] bg-white/90 dark:bg-white/5 backdrop-blur-2xl border border-white/50 dark:border-white/10 p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center gap-4 w-56"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 relative overflow-hidden shadow-[0_5px_15px_rgba(168,85,247,0.3)]">
                   <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-2 w-full bg-slate-200 dark:bg-white/20 rounded-full" />
                  <div className="h-1.5 w-2/3 bg-slate-100 dark:bg-white/10 rounded-full" />
                </div>
              </motion.div>
              
              {/* Glassmorphism Floating Verified Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: [0, -10, 0] }}
                transition={{ opacity: { duration: 1 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
                className="absolute -bottom-4 right-[15%] bg-white/95 dark:bg-white/10 backdrop-blur-3xl border border-white/60 dark:border-white/20 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex items-center gap-4 cursor-default z-10 hover:bg-white dark:hover:bg-white/15 transition-colors"
              >
                <div className="h-14 w-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                   <ShieldCheck className="text-white h-7 w-7 relative z-10" />
                </div>
                <div>
                   <p className="text-white font-black text-sm uppercase tracking-wider relative z-10">Verified Content</p>
                   <p className="text-cyan-300 text-xs font-bold mt-1 relative z-10 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">99.9% Accuracy Rate</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Brand Bar */}
        <div className="py-12 border-y border-slate-200/50 dark:border-white/[0.02] bg-white/50 dark:bg-white/[0.01] backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/[0.05] dark:via-cyan-500/5 to-transparent animate-pulse-slow" />
          <div className="container mx-auto px-6 relative z-10">
            <p className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-cyan-600/60 dark:text-cyan-500/50 mb-10">Empowering Excellence At</p>
            <div className="flex flex-wrap justify-center items-center gap-16 opacity-60 dark:opacity-60">
               {["MDU UNIVERSITY", "GJUST HISAR", "DCRUST MURTHAL", "KU KURUKSHETRA"].map((brand, i) => (
                 <motion.span 
                   key={i} 
                   whileHover={{ scale: 1.1, opacity: 1, color: "#06b6d4" }} 
                   className="text-2xl font-black text-slate-500 dark:text-white mix-blend-multiply dark:mix-blend-overlay cursor-default transition-colors duration-300"
                 >
                   {brand}
                 </motion.span>
               ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-32 px-6 relative">
          <div className="absolute top-1/2 left-0 w-full h-[50vh] bg-purple-600/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />
          
          <div className="container mx-auto relative z-10">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               className="text-center mb-24"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 font-black tracking-widest uppercase text-sm mb-4 block">Core Platform</span>
              <h2 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-white mb-6 tracking-tight">Unfair Advantage.</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-xl leading-relaxed">
                Everything you need to dominate your semester, engineered into one beautiful platform.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: BookOpen, title: "Curated Notes", color: "cyan", desc: "Premium quality notes from top scholars, digitized and organized perfectly." },
                { icon: FileText, title: "Solved PYQs", color: "purple", desc: "Years of previous papers, fully solved and searchable by topic." },
                { icon: Video, title: "Lecture Hub", color: "blue", desc: "No more searching YouTube. Get the best video lectures mapped to your syllabus." },
              ].map((feature, i) => (
                  <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.15, type: "spring", bounce: 0.4 }}
                  whileHover={{ y: -15, scale: 1.02 }}
                  className="bg-white/80 dark:bg-[#0a0a1a]/50 backdrop-blur-2xl border border-white dark:border-white/[0.05] p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_rgba(34,211,238,0.15)] dark:shadow-2xl group overflow-hidden relative transition-all duration-500"
                >
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-${feature.color}-500/10 blur-[50px] rounded-full transition-all duration-700 group-hover:bg-${feature.color}-500/30 group-hover:scale-150`} />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className={`relative z-10 w-16 h-16 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center text-${feature.color}-400 mb-8 border border-${feature.color}-500/20 group-hover:scale-110 group-hover:bg-${feature.color}-500/20 group-hover:shadow-[0_0_30px_rgba(var(--${feature.color}-500),0.3)] transition-all duration-500`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="relative z-10 text-2xl font-bold text-slate-800 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-500 dark:group-hover:from-white dark:group-hover:to-slate-400 transition-all">{feature.title}</h3>
                  <p className="relative z-10 text-slate-500 dark:text-slate-400 leading-relaxed text-lg group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 relative overflow-hidden mt-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="absolute inset-0 mx-6 rounded-[3rem] overflow-hidden shadow-[0_20px_80px_rgba(14,165,233,0.25)] dark:shadow-none"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-700 to-purple-800" />
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45 animate-pulse-slow" />
          </motion.div>
          
          <div className="absolute top-0 right-10 p-12 opacity-[0.05] pointer-events-none">
            <GraduationCap size={600} className="text-white" />
          </div>
          
          <div className="container mx-auto max-w-5xl text-center relative z-10 py-16">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter drop-shadow-2xl"
            >
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white">Level Up?</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-cyan-100/90 mb-16 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              Join thousands of top-tier students already using College Connect to crush their exams and stay ahead.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center"
            >
              <Link href="/register" className="relative group inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-white rounded-full blur-md opacity-20 group-hover:opacity-60 group-hover:blur-xl transition-all duration-500" />
                <div className="relative h-16 px-12 bg-white text-[#030014] rounded-full font-black text-xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-2xl">
                  Create Free Account
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16 px-6 bg-white dark:bg-[#010008] border-t border-slate-200/50 dark:border-white/[0.02] relative z-10 mt-16 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <div className="container mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <Logo size={40} className="mb-6 opacity-80 hover:opacity-100 transition-opacity" />
            <p className="text-slate-500 dark:text-slate-500 max-w-sm leading-relaxed text-lg font-medium">
              Empowering the next generation of engineers with elite academic resources.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-widest text-xs mb-6 opacity-40">Platform</h4>
            <ul className="space-y-4 font-medium text-sm">
               <li><Link href="#features" className="text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Features</Link></li>
               <li><Link href="/about" className="text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">About</Link></li>
               <li><Link href="/contact" className="text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-widest text-xs mb-6 opacity-40">Account</h4>
            <ul className="space-y-4 font-medium text-sm">
               <li><Link href="/login" className="text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Sign In</Link></li>
               <li><Link href="/register" className="text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Register</Link></li>
               <li><Link href="/admin-login" className="text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-16 pt-8 border-t border-slate-200 dark:border-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} COLLEGE CONNECT.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-cyan-600 dark:hover:text-cyan-500 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-cyan-600 dark:hover:text-cyan-500 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>

      {/* Global CSS for animations */}
      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 4s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
