"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2, AlertCircle, Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid credentials. Please verify your admin access.");
        setIsLoading(false);
        return;
      }

      // If signed in successfully, we push to /admin.
      // Next.js layout in /admin will auto-enforce the role "admin" check
      // and kick them out if somehow a student logs in here.
      router.push("/admin");
      router.refresh();
      
    } catch (err) {
      setError("An unexpected authentication error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
      {/* Static Background Elements — no JS animation for performance */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/25 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/20 blur-[130px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)] mb-6 ring-4 ring-slate-900/50 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Shield className="h-10 w-10 text-white drop-shadow-md z-10" />
          </motion.div>
          
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Admin Portal</h1>
          <p className="text-slate-400 font-medium text-sm max-w-xs mx-auto">
            Authorized access only. Enter your credentials to manage College Connect.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative rounded-3xl backdrop-blur-2xl bg-slate-900/60 border border-slate-800/80 shadow-2xl p-8 sm:p-10"
        >
          {/* Subtle Top Inner Highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 shadow-inner shadow-red-500/10"
              >
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-200 font-medium">{error}</p>
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Admin Email</Label>
              <div className="relative group">
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@collegeconnect.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-slate-950/50 border-slate-800/80 text-white placeholder:text-slate-600 focus-visible:ring-0 focus-visible:border-blue-500 h-14 pl-12 rounded-xl text-base transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Password</Label>
              </div>
              <div className="relative group">
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  placeholder="••••••••"
                  className="bg-slate-950/50 border-slate-800/80 text-white placeholder:text-slate-600 focus-visible:ring-0 focus-visible:border-blue-500 h-14 pl-12 pr-12 rounded-xl text-base transition-all font-medium tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-base font-bold shadow-[0_4px_14px_0_rgb(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] transition-all duration-300 rounded-xl mt-2 group overflow-hidden relative border-0"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
              {isLoading ? (
                <span className="flex items-center gap-2 relative z-10 border-0">
                  <Loader2 className="h-5 w-5 animate-spin border-0" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2 relative z-10">
                  Access Dashboard
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-800/50">
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 bg-slate-950/30 py-2.5 rounded-lg border border-slate-800/30">
              <Lock className="h-3.5 w-3.5 text-blue-500/70" />
              <span>256-bit Encrypted Connection</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
