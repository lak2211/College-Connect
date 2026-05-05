"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { Home, ArrowRight, Loader2, User, Mail, Lock, Check, X, Eye, EyeOff, Search, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UNIVERSITIES = [
  { id: "mdu", name: "Maharshi Dayanand University (MDU)" },
  { id: "du", name: "University of Delhi (DU)" },
  { id: "pu", name: "Panjab University (PU)" },
  { id: "jnu", name: "Jawaharlal Nehru University (JNU)" },
  { id: "ipu", name: "Guru Gobind Singh Indraprastha University (GGSIPU)" },
  { id: "bhu", name: "Banaras Hindu University (BHU)" },
  { id: "amu", name: "Aligarh Muslim University (AMU)" },
  { id: "uoh", name: "University of Hyderabad (UoH)" },
  { id: "bits", name: "BITS Pilani" },
  { id: "nit", name: "National Institute of Technology (NIT)" },
];

const COURSES = [
  { id: "B.Tech", name: "B.Tech (Bachelor of Technology)" },
  { id: "BCA", name: "BCA (Bachelor of Computer Applications)" },
  { id: "M.Tech", name: "M.Tech (Master of Technology)" },
  { id: "MCA", name: "MCA (Master of Computer Applications)" },
];

const BRANCHES_MAP: Record<string, string[]> = {
  "B.Tech": ["Computer Science Engineering (CSE)", "Data Science", "Artificial Intelligence & Machine Learning (AI & ML)"],
};

const BTECH_ALL_SUBJECTS = [
  "Engineering Mathematics-I", "Engineering Mathematics-II", "Engineering Mathematics-III",
  "Discrete Mathematics", "Probability & Statistics", "Linear Algebra", "Optimization Techniques",
  "Physics for Engineers", "Chemistry for Engineers", "Basic Electrical Engineering", "Environmental Studies",
  "Programming in C", "Programming in Python", "Object Oriented Programming", "Data Structures",
  "Design & Analysis of Algorithms", "Computer Organization", "Computer Organization & Architecture",
  "Microprocessors & Interfacing", "Database Management Systems", "Data Warehousing", "Data Mining",
  "Data Engineering", "Operating Systems", "Computer Networks", "Data Communication", "Network Security",
  "Information Security", "Advanced Computer Networks", "Software Engineering", "Theory of Computation",
  "Compiler Design", "Web Technologies", "Artificial Intelligence", "Machine Learning",
  "Advanced Machine Learning", "Deep Learning", "Reinforcement Learning", "Natural Language Processing",
  "Computer Vision", "Intelligent Systems", "Advanced Artificial Intelligence", "AI Ethics",
  "Data Visualization", "Statistical Methods", "Python for Data Science", "Business Intelligence",
  "Time Series Analysis", "Advanced Data Analytics", "Big Data Analytics", "Cloud Computing",
  "Distributed Systems", "Blockchain Technology", "Mobile Computing", "Robotics", "Data Science for AI",
];

const SUBJECTS_MAP: Record<string, string[]> = {
  "B.Tech": BTECH_ALL_SUBJECTS,
  "BCA": ["C Programming", "Computer Architecture", "Mathematics I", "Web Design", "Software Engineering"],
  "M.Tech": ["Advanced Algorithms", "Advanced Computer Architecture", "Distributed Systems", "Machine Learning"],
  "MCA": ["Advanced Algorithms", "Machine Learning", "Cloud Computing", "Big Data Analytics", "Python Programming"],
};

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Onboarding state
  const [university, setUniversity] = useState("mdu");
  const [course, setCourse] = useState("");
  const [branch, setBranch] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pastedOtp = value.slice(0, 6).split("");
      const newOtp = [...otp];
      pastedOtp.forEach((char, i) => { if (i < 6) newOtp[i] = char; });
      setOtp(newOtp);
      const nextIndex = Math.min(pastedOtp.length, 5);
      document.getElementById(`reg-otp-${nextIndex}`)?.focus();
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== "" && index < 5) {
      document.getElementById(`reg-otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`reg-otp-${index - 1}`)?.focus();
    }
  };

  const availableSubjects = useMemo(() => course ? SUBJECTS_MAP[course] || [] : [], [course]);
  const filteredSubjects = useMemo(() => {
    let subjects = availableSubjects;
    if (subjectSearch.trim()) {
      const q = subjectSearch.toLowerCase();
      subjects = subjects.filter(s => s.toLowerCase().includes(q));
    }
    return [...subjects].sort((a, b) => {
      const aSelected = selectedSubjects.includes(a);
      const bSelected = selectedSubjects.includes(b);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }, [availableSubjects, subjectSearch, selectedSubjects]);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]);
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 8;
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      if (!firstName || !email || !password) { setError("Please fill in all fields."); return; }
      if (!isEmailValid) { setError("Invalid email address."); return; }
      if (!isPasswordValid) { setError("Password must be at least 8 characters."); return; }
      if (!passwordsMatch) { setError("Passwords do not match."); return; }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!university || !course || (course === "B.Tech" && !branch)) {
        setError("Please complete academic details.");
        return;
      }

      setLoading(true);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        const fullName = `${firstName} ${lastName}`.trim();
        const res = await fetch(`${backendUrl}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName, email, password,
            university: UNIVERSITIES.find(u => u.id === university)?.name,
            course, branch, subjects: selectedSubjects
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Registration failed");
        
        await signIn("credentials", { email, password, redirect: false });
        router.push("/dashboard");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error occurred");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Step 3 (OTP verification) removed
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600">
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-2xl mt-12">
        <div className="flex flex-col items-center mb-6">
          <Logo size={42} className="mb-4" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Create Account</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Step {step} of 2</p>
        </div>

        <Card className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-700 dark:text-slate-300">First Name</Label>
                      <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className="rounded-xl h-11" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-700 dark:text-slate-300">Last Name</Label>
                      <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className="rounded-xl h-11" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700 dark:text-slate-300">Email Address</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.edu" className="rounded-xl h-11" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-700 dark:text-slate-300">Password</Label>
                      <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 chars" className="rounded-xl h-11" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-700 dark:text-slate-300">Confirm</Label>
                      <Input type={confirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="rounded-xl h-11" required />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700 dark:text-slate-300">University</Label>
                    <Select value={university} onValueChange={(v) => v && setUniversity(v)}>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder="Select University" />
                      </SelectTrigger>
                      <SelectContent>
                        {UNIVERSITIES.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className={`grid gap-4 ${course === "B.Tech" ? "grid-cols-2" : "grid-cols-1"}`}>
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-700 dark:text-slate-300">Course</Label>
                      <Select value={course} onValueChange={(v) => v && setCourse(v)}>
                        <SelectTrigger className="rounded-xl h-11">
                          <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                          {COURSES.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    {course === "B.Tech" && (
                      <div className="space-y-2">
                        <Label className="font-bold text-slate-700 dark:text-slate-300">Branch</Label>
                        <Select value={branch} onValueChange={(v) => v && setBranch(v)}>
                          <SelectTrigger className="rounded-xl h-11">
                            <SelectValue placeholder="Select Branch" />
                          </SelectTrigger>
                          <SelectContent>
                            {BRANCHES_MAP["B.Tech"].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  {course && (course !== "B.Tech" || branch) && (
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-end">
                        <Label className="font-bold text-slate-700 dark:text-slate-300">
                          Subjects {selectedSubjects.length > 0 && <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs ml-1">({selectedSubjects.length} selected)</span>}
                        </Label>
                      </div>

                      {selectedSubjects.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                          {selectedSubjects.map(s => (
                            <span key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 group">
                              {s}
                              <button type="button" onClick={() => toggleSubject(s)} className="p-0.5 rounded-md text-slate-400 group-hover:text-red-500 transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="space-y-0 text-sm overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                        <div className="flex items-center px-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                          <Search className="w-4 h-4 text-slate-400 shrink-0" />
                          <Input 
                            value={subjectSearch} 
                            onChange={(e) => setSubjectSearch(e.target.value)} 
                            placeholder="Find your subjects..." 
                            className="h-11 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 shadow-none w-full text-sm"
                          />
                        </div>
                        <div className="max-h-52 overflow-y-auto p-2 isolate">
                          {filteredSubjects.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 text-sm">No subjects found</div>
                          ) : (
                            <div className="grid grid-cols-1 gap-1">
                              {filteredSubjects.map(s => {
                                const isSelected = selectedSubjects.includes(s);
                                return (
                                  <button
                                    key={s} type="button" onClick={() => toggleSubject(s)}
                                    className={`flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                      isSelected 
                                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300' 
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                                    }`}
                                  >
                                    <span className="truncate pr-2">{s}</span>
                                    {isSelected ? (
                                      <div className="w-5 h-5 shrink-0 rounded-md bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-sm">
                                        <Check className="w-3.5 h-3.5" />
                                      </div>
                                    ) : (
                                      <div className="w-5 h-5 shrink-0 rounded-md border border-slate-300 dark:border-slate-600" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3 (OTP verification) removed */}

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl border border-red-100 dark:border-red-500/20">
                  {error}
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit" disabled={loading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-xl shadow-lg shadow-blue-500/20"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (step === 2 ? "Join College Connect" : "Continue")}
                </Button>
                {step > 1 && (
                  <button type="button" onClick={() => setStep(step - 1)} className="w-full mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">
                    Back to previous step
                  </button>
                )}
              </div>
            </form>
          </div>
          <CardFooter className="bg-slate-50 dark:bg-slate-900/50 p-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold w-full">
              Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Sign In</Link>
            </p>
          </CardFooter>
        </Card>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Encrypted Academic Data Verification</span>
        </div>
      </div>
    </div>
  );
}


