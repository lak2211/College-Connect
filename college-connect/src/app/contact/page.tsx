"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Convert to JSON
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(true);
        form.reset();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        console.error("Failed to submit");
        // We could add an error state here later
      }
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-black transition-colors duration-500">
      
      {/* Header */}
      <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b dark:border-slate-800 bg-white dark:bg-black sticky top-0 z-50 shadow-sm dark:shadow-none transition-colors duration-300">
        <Link href="/" className="flex items-center">
          <Logo size={38} textSize="text-xl" />
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
          <Link href="/about" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link>
          <Link href="/contact" className="text-sm font-medium text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-0.5 transition-colors">Contact Us</Link>
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
        {/* Contact Header Block */}
        <section className="relative w-full pt-20 pb-24 md:pt-28 md:pb-36 bg-white dark:bg-black overflow-hidden transition-colors duration-500">
          {/* Background orbs */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 pointer-events-none">
            <div className="w-[800px] h-[800px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl animate-in fade-in duration-1000" />
          </div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 pointer-events-none">
            <div className="w-[600px] h-[600px] bg-indigo-100/40 dark:bg-indigo-900/10 rounded-full blur-3xl animate-in fade-in duration-1000 delay-300" />
          </div>

          <div className="relative max-w-5xl mx-auto px-6 text-center animate-in slide-in-from-bottom-8 fade-in zoom-in-95 duration-700 ease-out">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
              Let&apos;s build the future <br className="hidden md:block"/>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">of learning together.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Have a question, feedback, or want to contribute notes? We&apos;d love to hear from you. Drop us a line and we&apos;ll get back to you as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Form & Info Grid */}
        <section className="pb-24 -mt-10 relative z-10 animate-in slide-in-from-bottom-12 fade-in duration-700 ease-out delay-200">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Information Cards (Left) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 transition-colors duration-300">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Contact Information</h3>
                <div className="space-y-8">
                  <div className="flex gap-4 items-start group">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/50 group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-lg">Email Us</p>
                      <p className="text-slate-500 dark:text-slate-400">support@collegeconnect.com</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 cursor-pointer hover:underline">Drop us a line →</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start group">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/50 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-colors">
                      <Phone className="h-5 w-5 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-lg">Call Us</p>
                      <p className="text-slate-500 dark:text-slate-400">+91 (800) 123-4567</p>
                      <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Mon-Fri from 9am to 6pm</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start group">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-900/50 group-hover:bg-purple-600 group-hover:border-purple-600 transition-colors">
                      <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-lg">Visit Us</p>
                      <p className="text-slate-500 dark:text-slate-400">Innovation Hub, Rohtak</p>
                      <p className="text-slate-500 dark:text-slate-400">Haryana, India 124001</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form (Right) */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-white/50 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 backdrop-blur-xl transition-colors duration-300">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Send us a Message</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Fill out the form below and we will get back to you shortly.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-slate-700 dark:text-slate-300 font-semibold">First Name</Label>
                      <Input id="firstName" name="firstName" required placeholder="John" className="h-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus-visible:ring-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-slate-700 dark:text-slate-300 font-semibold">Last Name</Label>
                      <Input id="lastName" name="lastName" required placeholder="Doe" className="h-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus-visible:ring-blue-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold">Email Address</Label>
                    <Input id="email" name="email" required type="email" placeholder="john@example.com" className="h-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus-visible:ring-blue-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-slate-700 dark:text-slate-300 font-semibold">Subject</Label>
                    <Input id="subject" name="subject" required placeholder="How can we help you?" className="h-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus-visible:ring-blue-500" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-700 dark:text-slate-300 font-semibold">Message</Label>
                    <Textarea id="message" name="message" required placeholder="Tell us more about your inquiry..." className="min-h-[150px] bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus-visible:ring-blue-500 resize-y" />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading || success}
                    className={`w-full h-12 rounded-xl text-base font-semibold shadow-md transition-all mt-4 ${
                      success 
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10 active:scale-[0.98]'
                    }`}
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending Message...</>
                    ) : success ? (
                      <><CheckCircle2 className="mr-2 h-5 w-5" /> Message Sent Successfully</>
                    ) : (
                      <><Send className="mr-2 h-5 w-5" /> Send Message</>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black border-t border-slate-800 py-16 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-10">
          <div className="col-span-1 md:col-span-2">
            <Logo size={42} textSize="text-xl" className="mb-4" />
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Your all-in-one academic companion. study smarter with curated notes, PYQs, and video lectures.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">Go to Dashboard</Link></li>
              <li><Link href="/login" className="text-slate-400 hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="text-slate-400 hover:text-white transition-colors">Create Account</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} College Connect. Made with ❤️ for students.
          </p>
        </div>
      </footer>
    </div>
  );
}
