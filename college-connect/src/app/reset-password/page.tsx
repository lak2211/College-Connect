"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, Lock, ShieldCheck, KeyRound, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const otp = searchParams.get("otp");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const strengthColors = ["bg-slate-200 dark:bg-slate-800", "bg-red-500", "bg-orange-500", "bg-blue-500", "bg-emerald-500"];

    const calculateStrength = (pass: string) => {
        let score = 0;
        if (!pass) {
            setPasswordStrength(0);
            return;
        }
        if (pass.length >= 8) score += 1;
        if (pass.length >= 12) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        setPasswordStrength(Math.min(score, 4));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setNewPassword(val);
        calculateStrength(val);
    };

    useEffect(() => {
        if (!email || !otp) {
            setError("Invalid or missing reset credentials. Please request a new password reset link.");
        }
    }, [email, otp]);

    const resetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !otp) {
            setError("Invalid or missing reset credentials.");
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to reset password");

            setSuccessMsg("Password reset successfully. Redirecting to dashboard...");

            const signInRes = await signIn("credentials", {
                email,
                password: newPassword,
                redirect: false,
            });

            setTimeout(() => {
                if (signInRes?.error) {
                    router.push("/login");
                } else {
                    router.push("/dashboard");
                    router.refresh();
                }
            }, 1000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
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
                <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-b from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 pointer-events-none" />

                <div className="relative w-full shadow-2xl shadow-slate-200/50 dark:shadow-black/80 border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-[#0A0F1C]/80 backdrop-blur-2xl rounded-[32px] overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent" />

                    <div className="px-8 pt-10 pb-8 flex flex-col items-center text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                            Create new password
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm px-4">
                            Enter and confirm your new strong password below.
                        </p>
                    </div>

                    <div className="px-8 pb-10">
                        <form onSubmit={resetPassword} className="space-y-6">
                            <div className="space-y-5">
                                <div className="space-y-2 relative">
                                    <Label htmlFor="newPassword" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">New Password</Label>
                                    <div className={`relative flex items-center rounded-2xl border transition-colors duration-300 ${focusedField === 'newPassword' ? 'border-blue-500 ring-4 ring-blue-500/10 bg-white dark:bg-[#0f172a]' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#030712]'}`}>
                                        <div className="pl-4 pr-2 text-slate-400">
                                            <Lock className={`w-5 h-5 transition-colors ${focusedField === 'newPassword' ? 'text-blue-500' : ''}`} />
                                        </div>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={handlePasswordChange}
                                            onFocus={() => setFocusedField("newPassword")}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                            disabled={(!email || !otp) || !!successMsg}
                                            className="h-14 bg-transparent border-0 focus-visible:ring-0 px-2 text-base dark:text-white dark:placeholder:text-slate-600 rounded-r-2xl"
                                        />
                                    </div>
                                    <div className="mt-3 space-y-1.5">
                                        <div className="flex gap-1.5 h-1.5">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div 
                                                    key={level} 
                                                    className={`flex-1 rounded-full transition-colors duration-500 ${passwordStrength >= level ? strengthColors[passwordStrength] : 'bg-slate-200 dark:bg-slate-800'}`}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                            <span className="text-slate-400">Security Level</span>
                                            <span className={passwordStrength > 0 ? strengthColors[passwordStrength].split(" ")[0].replace("bg-", "text-") : "text-slate-500"}>
                                                {newPassword ? strengthLabels[passwordStrength] : 'Waiting'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 relative">
                                    <Label htmlFor="confirmPassword" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Confirm Password</Label>
                                    <div className={`relative flex items-center rounded-2xl border transition-colors duration-300 ${focusedField === 'confirmPassword' ? 'border-blue-500 ring-4 ring-blue-500/10 bg-white dark:bg-[#0f172a]' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#030712]'}`}>
                                        <div className="pl-4 pr-2 text-slate-400">
                                            <KeyRound className={`w-5 h-5 transition-colors ${focusedField === 'confirmPassword' ? 'text-blue-500' : ''}`} />
                                        </div>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            onFocus={() => setFocusedField("confirmPassword")}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                            disabled={(!email || !otp) || !!successMsg}
                                            className="h-14 bg-transparent border-0 focus-visible:ring-0 px-2 text-base dark:text-white dark:placeholder:text-slate-600 rounded-r-2xl"
                                        />
                                    </div>
                                    {confirmPassword.length > 0 && (
                                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 mt-2 ml-1 text-xs font-bold">
                                            {newPassword === confirmPassword ? (
                                                <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Passwords match</span>
                                            ) : (
                                                <span className="text-red-500">Passwords do not match</span>
                                            )}
                                        </motion.div>
                                    )}
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
                                    disabled={loading || (!email || !otp) || !!successMsg}
                                >
                                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Saving...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span>Reset Password</span>
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
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#030712] relative overflow-hidden transition-colors duration-500 py-12 selection:bg-blue-500/30">
            {/* Background Mesh matches the rest of auth */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.03] dark:opacity-10" />
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px]" />
                <motion.div animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute -bottom-[20%] -left-[10%] w-[700px] h-[700px] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px]" />
                <motion.div animate={{ y: [0, -50, 0], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center px-2">
                <Link href="/login">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-full border border-slate-200 dark:border-slate-800 shadow-sm text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer">
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        <span className="hidden sm:inline">Back to Login</span>
                    </motion.div>
                </Link>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-full border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
                    <ThemeToggle />
                </motion.div>
            </div>

            <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-blue-500 z-10" />}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
