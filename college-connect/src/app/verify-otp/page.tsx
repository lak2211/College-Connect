"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, Lock, ShieldCheck, KeyRound, CheckCircle2, RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Handle OTP input changes
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  // Handle key press for backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = pastedData.split("").map((char, index) => (index < 6 ? char : ""));
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits of the OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to verify OTP");

      setSuccessMsg("OTP verified successfully! Redirecting...");
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otpString)}`);
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to resend OTP");

      setSuccessMsg("A new OTP has been sent to your email.");
      setOtp(["", "", "", "", "", ""]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#030712] relative overflow-hidden transition-colors duration-500 py-12 selection:bg-blue-500/30">
      {/* Deep Animated Background Mesh */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.03] dark:opacity-10" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-200 h-200 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -left-[10%] w-175 h-175 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            y: [0, -50, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[20%] w-100 h-100 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[100px]"
        />
      </div>

      {/* Top Controls */}
      <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center px-2">
        <Link href="/forgot-password">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-full border border-slate-200 dark:border-slate-800 shadow-sm text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span className="hidden sm:inline">Back</span>
          </motion.div>
        </Link>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-full border border-slate-200 dark:border-slate-800 p-1 shadow-sm"
        >
          <ThemeToggle />
        </motion.div>
      </div>

      <div className="z-10 w-full max-w-xl px-4 flex flex-col items-center">
        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center mb-10"
        >
          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-blue-500/10 border border-slate-100 dark:border-slate-800 mb-4 inline-flex">
            <Logo size={48} textSize="text-2xl" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">College Connect</h1>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full relative group"
        >
          <div className="absolute -inset-1 rounded-[32px] bg-linear-to-b from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 pointer-events-none" />

          <div className="relative w-full shadow-2xl shadow-slate-200/50 dark:shadow-black/80 border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-[#0A0F1C]/80 backdrop-blur-2xl rounded-[32px] overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/50 dark:via-white/10 to-transparent" />

            <div className="px-8 pt-10 pb-8 flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                Enter verification code
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm px-4">
                We've sent a 6-digit code to {email}
              </p>
            </div>

            <div className="px-8 pb-10">
              <form onSubmit={verifyOtp} className="space-y-6">
                  {/* OTP Input Section */}
                  <div className="space-y-4">
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, index) => (
                        <div key={index} className="relative">
                          <Input
                            id={`otp-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            onFocus={() => setFocusedField(`otp-${index}`)}
                            onBlur={() => setFocusedField(null)}
                            className={`w-12 h-14 text-center text-xl font-bold bg-transparent border-0 focus-visible:ring-0 rounded-xl transition-all duration-300 ${
                              focusedField === `otp-${index}`
                                ? 'bg-white dark:bg-[#0f172a] ring-4 ring-blue-500/10 border-blue-500'
                                : 'bg-slate-50 dark:bg-[#030712] border-slate-200 dark:border-slate-800'
                            }`}
                            disabled={loading || !!successMsg}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={resendOtp}
                        disabled={loading}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-2 mx-auto"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Resend OTP
                      </button>
                    </div>
                  </div>

                {/* Status Messages */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 p-3.5 rounded-xl border border-red-200 dark:border-red-500/20 flex items-start gap-3">
                        <div className="mt-0.5"><Lock className="w-4 h-4" /></div>
                        <p>{error}</p>
                      </div>
                    </motion.div>
                  )}
                  {successMsg && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-500/20 flex items-start gap-3">
                        <div className="mt-0.5"><CheckCircle2 className="w-4 h-4" /></div>
                        <p>{successMsg}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-2 cursor-pointer">
                  <Button
                    type="submit"
                    className="relative w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-600/20 transition-all font-black text-[15px] group overflow-hidden border-0 cursor-pointer"
                    disabled={loading}
                  >
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Verify OTP</span>
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    )}
                  </Button>
                </motion.div>

                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 mt-6">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Secure 256-bit Encrypted Connection</span>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
