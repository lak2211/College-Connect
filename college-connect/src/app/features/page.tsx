"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, BookOpen, Layers, Zap, Video, FileText, CheckCircle2, Search, Unlock } from "lucide-react";
import Image from "next/image";

const features = [
  {
    id: "notes",
    title: "Curated HD Notes",
    description: "Access expertly digitized, color-coded notes that cut study time in half. Sourced from university toppers and strictly verified.",
    icon: BookOpen,
    color: "blue",
    perks: ["Handwritten & Typed", "Organized by Unit", "Verified by Experts"]
  },
  {
    id: "pyq",
    title: "Solved Past Papers",
    description: "Don't just practice blindly. We provide fully solved PYQs perfectly aligned with your current syllabus and marking scheme.",
    icon: FileText,
    color: "indigo",
    perks: ["Last 5 Years Covering", "Step-by-Step Solutions", "Searchable Database"]
  },
  {
    id: "video",
    title: "Syllabus-Mapped Lectures",
    description: "Stop wasting hours finding the right YouTube videos. Our lecture hub strictly follows your university syllabus, unit by unit.",
    icon: Video,
    color: "purple",
    perks: ["Zero Ads", "Chapter Timestamps", "Directly Mapped to Syllabus"]
  }
];

export default function FeaturesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-[#0a0f1c] text-white font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[60vw] h-[60vw] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/4 w-[50vw] h-[50vw] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Navbar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-50 bg-[#0a0f1c]/50 backdrop-blur-2xl border-b border-white/5"
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo size={36} forceLightLogo={true} />
          </Link>
          <nav className="hidden md:flex items-center gap-10">
            {["Features", "About", "Contact"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className={`text-sm font-bold ${item === "Features" ? "text-white" : "text-slate-400"} hover:text-white transition-colors relative group`}>
                {item}
                {item === "Features" && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-blue-500" />}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-300 hover:text-white">Sign In</Link>
            <Link href="/register" className="bg-blue-600 text-white rounded-full px-6 py-2.5 font-bold hover:scale-105 transition-transform shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]">
              Get Started
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 relative z-10 pt-32 pb-24">
        
        {/* Features Hero */}
        <motion.section 
          style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto px-6 py-20 text-center max-w-5xl"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-black uppercase tracking-widest mb-8 backdrop-blur-md"
          >
            <Layers className="h-4 w-4" /> Comprehensive Ecosystem
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tighter mb-8"
          >
            Built for those who <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
              Demand Excellence.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            We analyzed how top-tier engineers study, and built a platform that instantly connects you to that standard of knowledge.
          </motion.p>
        </motion.section>

        {/* Feature Blocks */}
        <section className="container mx-auto px-6 py-20 flex flex-col gap-32">
          {features.map((feature, idx) => (
            <div key={feature.id} className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              
              <div className="flex-1 space-y-8 relative z-20">
                <motion.div
                  initial={{ opacity: 0, x: idx % 2 === 1 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, type: "spring" }}
                >
                  <div className={`w-20 h-20 rounded-3xl bg-${feature.color}-500/10 flex items-center justify-center text-${feature.color}-400 mb-8 border border-${feature.color}-500/20 shadow-[0_0_40px_-10px_rgba(var(--${feature.color}-500),0.3)]`}>
                    <feature.icon className="h-10 w-10" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black mb-6">{feature.title}</h2>
                  <p className="text-xl text-slate-400 leading-relaxed mb-8">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-4">
                    {feature.perks.map((perk, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        className="flex items-center gap-3 text-lg font-medium text-slate-200"
                      >
                        <CheckCircle2 className={`h-6 w-6 text-${feature.color}-400 shrink-0`} />
                        {perk}
                      </motion.li>
                    ))}
                  </ul>

                </motion.div>
              </div>

              <div className="flex-1 relative w-full max-w-xl aspect-square lg:aspect-[4/3]">
                <div className={`absolute inset-0 bg-${feature.color}-500/20 blur-[100px] rounded-full animate-pulse-slow mix-blend-screen`} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: idx % 2 === 0 ? -10 : 10 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                  className="relative w-full h-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex items-center justify-center group"
                >
                  <motion.div 
                    animate={{ rotate: idx % 2 === 0 ? 360 : -360 }} 
                    transition={{ duration: 20 + idx * 5, repeat: Infinity, ease: "linear" }}
                    className={`relative w-[60%] h-[60%] rounded-full border-4 border-dashed border-${feature.color}-400/30 flex items-center justify-center`}
                  >
                    <motion.div 
                       animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                       transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                       className={`w-1/2 h-1/2 rounded-full bg-${feature.color}-500/50 blur-xl`}
                    />
                    <div className="absolute inset-0 bg-white/5 rounded-full backdrop-blur-sm" />
                    <feature.icon className={`w-1/3 h-1/3 text-${feature.color}-300 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]`} />
                  </motion.div>
                </motion.div>
              </div>

            </div>
          ))}
        </section>

        {/* Powerful Search & Dark Mode Mini-Features */}
        <section className="container mx-auto px-6 py-32">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[2rem] p-12 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full transition-transform group-hover:scale-150 duration-700" />
              <Search className="h-12 w-12 text-emerald-400 mb-8" />
              <h3 className="text-3xl font-black mb-4">Lightning Global Search</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Find exactly what you need in milliseconds. Hit Command+K anywhere to instantly search through notes, PYQs, and videos across your entire university syllabus.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-bl from-white/10 to-transparent border border-white/10 rounded-[2rem] p-12 relative overflow-hidden group"
            >
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full transition-transform group-hover:scale-150 duration-700" />
              <Unlock className="h-12 w-12 text-amber-400 mb-8" />
              <h3 className="text-3xl font-black mb-4">Zero Distractions</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Beautiful, immersive dark mode. No ads, no popups. A highly focused environment engineered purely to help you enter deep work and crush your study sessions.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 py-20 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)]"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full mix-blend-overlay" />

            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10">
              Stop settling for average.
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto mb-12 relative z-10 font-medium">
              Join the platform that is actively redefining how top engineering students study.
            </p>
            <Link href="/register" className="inline-flex items-center justify-center gap-3 h-16 px-12 bg-white text-blue-900 rounded-full font-black text-xl hover:bg-slate-50 hover:scale-105 transition-all duration-300 relative z-10 shadow-2xl shadow-black/20">
              Create Your Account <ArrowRight className="h-6 w-6" />
            </Link>
          </motion.div>
        </section>

      </main>

      {/* Simplified Footer */}
      <footer className="py-12 px-6 bg-[#050810]/80 backdrop-blur-md border-t border-white/5 relative z-10">
        <div className="container mx-auto text-center">
           <Logo size={32} forceLightLogo={true} className="mx-auto mb-6 opacity-80" />
           <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">
             © {new Date().getFullYear()} College Connect. Designed for Excellence.
           </p>
        </div>
      </footer>

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
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
