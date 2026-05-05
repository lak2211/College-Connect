"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid admin credentials");
      } else {
        router.refresh();
      }
    } catch {
      setError("An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1000px] pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] animate-in fade-in duration-1000" />
        <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] animate-in fade-in duration-1000 delay-300" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in slide-in-from-bottom-8 fade-in zoom-in-95 duration-700 ease-out">
        <div className="flex justify-center mb-8">
          <Logo size={48} textSize="text-2xl" />
        </div>

        <Card className="bg-slate-900/80 border-slate-800 shadow-2xl backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4 mx-auto">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
              <p className="text-sm text-slate-400 mt-2">Sign in to access the control panel</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-slate-300 font-semibold text-xs uppercase tracking-wider">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@collegeconnect.com"
                    required
                    className="h-12 pl-10 bg-slate-950/50 border-slate-800 text-white rounded-xl focus-visible:ring-blue-500 focus-visible:border-blue-500 placeholder:text-slate-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300 font-semibold text-xs uppercase tracking-wider">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-12 pl-10 bg-slate-950/50 border-slate-800 text-white rounded-xl focus-visible:ring-blue-500 focus-visible:border-blue-500 placeholder:text-slate-600 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center animate-in slide-in-from-top-2 fade-in">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-xl mt-4 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all group"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Authenticating...</>
                ) : (
                  <>Secure Sign In <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" /></>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-500 mt-6 flex items-center justify-center gap-1.5 font-medium">
          <Lock className="h-3 w-3" /> Secure area restricted to authorized personnel.
        </p>
      </div>
    </div>
  );
}
