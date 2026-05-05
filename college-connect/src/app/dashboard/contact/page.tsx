"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, MessageSquare, Send, Phone, MapPin, 
  CheckCircle2, AlertCircle, Sparkles, Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactUsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        const errorMsg = data.details || data.error || data.message || "Failed to send message";
        throw new Error(errorMsg);
      }

      setSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVars: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVars: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative pb-10">
      {/* Ambient Aurora */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 pointer-events-none">
        <div className="w-96 h-96 bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-3xl mix-blend-screen" />
      </div>
      <div className="absolute bottom-1/2 left-0 -translate-x-1/2 pointer-events-none">
        <div className="w-80 h-80 bg-purple-500/20 dark:bg-purple-600/10 rounded-full blur-3xl mix-blend-screen" />
      </div>

      <motion.div variants={containerVars} initial="hidden" animate="show" className="relative z-10 space-y-8">
      {/* Header section */}
      <motion.div variants={itemVars} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold mb-2 uppercase tracking-widest">
          <Sparkles className="h-3 w-3" />
          We Value Your Feedback
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Contact Us</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm font-medium">
          Have a <span className="text-blue-600 dark:text-blue-400 font-bold underline decoration-blue-500/30">suggestion</span> to improve our platform or face any <span className="text-red-500 dark:text-red-400 font-bold underline decoration-red-500/30">technical problem</span>? We&apos;re here to help.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Cards */}
        <motion.div variants={itemVars} className="space-y-4">
          <Card className="bg-white/60 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Us</p>
                  <p className="text-slate-800 dark:text-white font-bold text-sm">support@collegeconnect.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-300 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Call Us</p>
                  <p className="text-slate-800 dark:text-white font-bold text-sm">+91 (123) 456-7890</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                  <p className="text-slate-800 dark:text-white font-bold text-sm">Rohtak, Haryana, India</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 dark:from-blue-600/20 dark:to-indigo-600/20 border border-blue-500/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
               <Sparkles className="h-12 w-12 text-blue-600 dark:text-white" />
             </div>
             <p className="text-xs text-blue-800 dark:text-blue-100 font-bold relative z-10 leading-relaxed">
               &quot;Your feedback is what helps us build a better platform for every student. Don&apos;t hesitate to share your thoughts!&quot;
             </p>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div variants={itemVars} className="lg:col-span-2">
          <Card className="bg-white/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 backdrop-blur-md overflow-hidden relative shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            
            <CardHeader className="pb-4">
               <CardTitle className="text-xl text-slate-900 dark:text-white font-black flex items-center gap-2">
                 <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                 Send us a Message
               </CardTitle>
               <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Tell us about your suggestion or the problem you&apos;re facing. We usually respond within 24 hours.</p>
            </CardHeader>

          <CardContent className="pt-2">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center space-y-4"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Message Sent!</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm">
                    Thank you for reaching out. Our team has received your message and will get back to you soon.
                  </p>
                  <Button 
                    onClick={() => setSuccess(false)}
                    className="mt-6 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white font-bold rounded-xl px-8"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <motion.form 
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 animate-shake">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white h-12 rounded-xl focus:ring-blue-500 focus:border-blue-500 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Last Name (Optional)</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white h-12 rounded-xl focus:ring-blue-500 focus:border-blue-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white h-12 rounded-xl focus:ring-blue-500 focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Suggestion / Technical Issue / General Inquiry"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white h-12 rounded-xl focus:ring-blue-500 focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Your Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your suggestion or problem in detail here..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white min-h-[150px] rounded-xl focus:ring-blue-500 focus:border-blue-500 resize-none font-medium"
                    />
                    <p className="text-[11px] text-slate-500 italic ml-1">
                      For suggestions, please be as descriptive as possible so we can improve!
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all duration-300 group overflow-hidden"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        Send Suggestion or Report Problem
                      </span>
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
        </motion.div>
      </div>
      </motion.div>
    </div>
  );
}
