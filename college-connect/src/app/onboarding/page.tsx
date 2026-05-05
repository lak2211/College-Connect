"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Loader2, ArrowRight, Search, X, Check } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";

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

// All B.Tech subjects (flat list)
const BTECH_ALL_SUBJECTS = [
  "Engineering Mathematics-I",
  "Engineering Mathematics-II",
  "Engineering Mathematics-III",
  "Discrete Mathematics",
  "Probability & Statistics",
  "Linear Algebra",
  "Optimization Techniques",
  "Physics for Engineers",
  "Chemistry for Engineers",
  "Basic Electrical Engineering",
  "Environmental Studies",
  "Programming in C",
  "Programming in Python",
  "Object Oriented Programming",
  "Data Structures",
  "Design & Analysis of Algorithms",
  "Computer Organization",
  "Computer Organization & Architecture",
  "Microprocessors & Interfacing",
  "Database Management Systems",
  "Data Warehousing",
  "Data Mining",
  "Data Engineering",
  "Operating Systems",
  "Computer Networks",
  "Data Communication",
  "Network Security",
  "Information Security",
  "Advanced Computer Networks",
  "Software Engineering",
  "Theory of Computation",
  "Compiler Design",
  "Web Technologies",
  "Artificial Intelligence",
  "Machine Learning",
  "Advanced Machine Learning",
  "Deep Learning",
  "Reinforcement Learning",
  "Natural Language Processing",
  "Computer Vision",
  "Intelligent Systems",
  "Advanced Artificial Intelligence",
  "AI Ethics",
  "Data Visualization",
  "Statistical Methods",
  "Python for Data Science",
  "Business Intelligence",
  "Time Series Analysis",
  "Advanced Data Analytics",
  "Big Data Analytics",
  "Cloud Computing",
  "Distributed Systems",
  "Blockchain Technology",
  "Mobile Computing",
  "Robotics",
  "Data Science for AI",
];

const SUBJECTS_MAP: Record<string, string[]> = {
  "B.Tech": BTECH_ALL_SUBJECTS,
  "BCA": ["C Programming", "Computer Architecture", "Mathematics I", "Web Design", "Software Engineering"],
  "M.Tech": ["Advanced Algorithms", "Advanced Computer Architecture", "Distributed Systems", "Machine Learning"],
  "MCA": ["Advanced Algorithms", "Machine Learning", "Cloud Computing", "Big Data Analytics", "Python Programming"],
};

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession();
  const [university, setUniversity] = useState("mdu");
  const [course, setCourse] = useState("");
  const [branch, setBranch] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableSubjects = useMemo(() => {
    return course ? SUBJECTS_MAP[course] || [] : [];
  }, [course]);

  const filteredSubjects = useMemo(() => {
    if (!subjectSearch.trim()) return availableSubjects;
    const q = subjectSearch.toLowerCase();
    return availableSubjects.filter(s => s.toLowerCase().includes(q));
  }, [availableSubjects, subjectSearch]);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requiresBranch = course === "B.Tech";
    if (!course || selectedSubjects.length === 0 || (requiresBranch && !branch)) {
      setError("Please fill in all required academic details and select at least one subject.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          university: UNIVERSITIES.find(u => u.id === university)?.name || university,
          course,
          branch: requiresBranch ? branch : undefined,
          subjects: selectedSubjects,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save onboarding data");
      }

      await update({
        university: UNIVERSITIES.find(u => u.id === university)?.name || university,
        course,
        branch: requiresBranch ? branch : undefined,
        subjects: selectedSubjects,
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Onboarding failed");
      setLoading(false);
    }
  };

  const showSubjects = course && (course !== "B.Tech" || branch);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden dark:bg-black transition-colors duration-500 py-12">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 -translate-y-12 -translate-x-1/3 z-0">
        <div className="w-[800px] h-[800px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl animate-in fade-in duration-1000" />
      </div>
      <div className="absolute bottom-0 right-0 translate-y-1/3 translate-x-1/3 z-0">
        <div className="w-[600px] h-[600px] bg-indigo-100/40 dark:bg-indigo-900/10 rounded-full blur-3xl animate-in fade-in duration-1000 delay-300" />
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20 animate-in slide-in-from-top-4 fade-in duration-700 ease-out">
        <div className="bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 p-1">
          <ThemeToggle />
        </div>
      </div>

      {/* Home Button */}
      <div className="absolute top-6 left-6 z-20 animate-in slide-in-from-top-4 fade-in duration-700 ease-out">
        <Link href="/" className="group flex items-center space-x-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors font-medium">
          <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 group-hover:shadow-md group-hover:border-blue-100 dark:group-hover:border-blue-900/50 transition-all">
            <Home className="w-4 h-4" />
          </div>
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="z-10 w-full max-w-2xl px-4">
        <div className="flex flex-col items-center mb-8 animate-in slide-in-from-bottom-8 fade-in zoom-in-95 duration-700 ease-out">
          <Logo size={52} textSize="text-3xl" className="mb-3" />
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Tell us what you&apos;re studying</p>
        </div>

        <Card className="w-full shadow-xl shadow-slate-200/50 dark:shadow-black/50 border-white/50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl animate-in slide-in-from-bottom-12 fade-in duration-700 ease-out delay-150">
          <CardHeader className="space-y-2 pb-4 pt-8 px-8">
            <CardDescription className="text-center text-slate-500 dark:text-slate-400 font-medium text-base">
              Select your academic details and pick the subjects you are currently studying.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* 1. UNIVERSITY */}
              <div className="space-y-3 bg-white/50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-blue-200 dark:hover:border-blue-900/50">
                <Label className="text-slate-700 font-bold text-lg dark:text-slate-200 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 text-xs text-center">1</span>
                  University
                </Label>
                <Select value={university} onValueChange={(val) => { setUniversity(val || ""); setCourse(""); setBranch(""); setSelectedSubjects([]); }}>
                  <SelectTrigger className="h-14 w-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 rounded-xl font-bold cursor-pointer text-base shadow-inner focus:ring-blue-500">
                    <SelectValue placeholder="Select your university" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 dark:border-slate-700 shadow-xl max-h-56 overflow-y-auto">
                    {UNIVERSITIES.map((uni) => (
                      <SelectItem key={uni.id} value={uni.id} className="py-3 px-5 text-base font-medium cursor-pointer focus:bg-blue-50 dark:focus:bg-slate-800 transition-colors whitespace-normal leading-snug">
                        {uni.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 2. COURSE */}
              <div className={`transition-all duration-500 ease-in-out origin-top overflow-hidden ${university ? 'max-h-[500px] opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-95 pointer-events-none'}`}>
                <div className="space-y-3 bg-white/50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-blue-200 dark:hover:border-blue-900/50">
                  <Label className="text-slate-700 font-bold text-lg dark:text-slate-200 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 text-xs text-center">2</span>
                    Course / Programme
                  </Label>
                  <Select value={course} onValueChange={(val) => { setCourse(val || ""); setBranch(""); setSelectedSubjects([]); setSubjectSearch(""); }}>
                    <SelectTrigger className="h-14 w-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 rounded-xl font-semibold cursor-pointer text-base shadow-inner focus:ring-blue-500">
                      <SelectValue placeholder="Select your course" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-700 shadow-2xl">
                      {COURSES.map((c) => (
                        <SelectItem key={c.id} value={c.id} className="cursor-pointer text-base font-medium py-4 px-5 focus:bg-blue-50 dark:focus:bg-slate-800 transition-colors whitespace-normal leading-snug border-b border-slate-100 dark:border-slate-800 last:border-b-0">
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 3. BRANCH (B.Tech only) */}
              <div className={`transition-all duration-500 ease-in-out origin-top overflow-hidden ${course === "B.Tech" ? 'max-h-[500px] opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-95 pointer-events-none'}`}>
                <div className="space-y-3 bg-white/50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-blue-200 dark:hover:border-blue-900/50">
                  <Label className="text-slate-700 font-bold text-lg dark:text-slate-200 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 text-xs text-center">3</span>
                    Branch Specialization
                  </Label>
                  <Select value={branch} onValueChange={(val) => { setBranch(val || ""); setSelectedSubjects([]); setSubjectSearch(""); }}>
                    <SelectTrigger className="h-14 w-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 rounded-xl font-semibold cursor-pointer text-base shadow-inner focus:ring-blue-500">
                      <SelectValue placeholder="Select your branch" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-700 shadow-2xl">
                      {BRANCHES_MAP["B.Tech"].map((b) => (
                        <SelectItem key={b} value={b} className="cursor-pointer text-base font-medium py-4 px-5 focus:bg-blue-50 dark:focus:bg-slate-800 transition-colors whitespace-normal border-b border-slate-100 dark:border-slate-800 last:border-b-0">
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 4. SUBJECT SELECTION — Clickable Grid */}
              <div className={`transition-all duration-500 ease-in-out origin-top overflow-hidden ${showSubjects ? 'max-h-[2000px] opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-95 pointer-events-none'}`}>
                <div className="space-y-4 bg-white/50 dark:bg-slate-900/50 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-sm">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-700 font-bold text-lg dark:text-slate-200 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 text-xs text-center">{course === "B.Tech" ? "4" : "3"}</span>
                      Select Your Subjects
                    </Label>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                      {selectedSubjects.length} Selected
                    </span>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search subjects..."
                      value={subjectSearch}
                      onChange={(e) => setSubjectSearch(e.target.value)}
                      className="h-11 pl-10 pr-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 rounded-xl text-sm focus-visible:ring-blue-500"
                    />
                    {subjectSearch && (
                      <button type="button" onClick={() => setSubjectSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Selected Tags */}
                  {selectedSubjects.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedSubjects.map((sub) => (
                        <div key={sub} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold animate-in fade-in zoom-in-95 duration-200 shadow-sm">
                          {sub}
                          <button type="button" onClick={() => toggleSubject(sub)} className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Subject Grid */}
                  <div className="max-h-[400px] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-3 custom-scrollbar">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {filteredSubjects.map((subject) => {
                        const isSelected = selectedSubjects.includes(subject);
                        return (
                          <button
                            key={subject}
                            type="button"
                            onClick={() => toggleSubject(subject)}
                            className={`relative text-left p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 cursor-pointer group ${isSelected
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:shadow-sm'
                              }`}
                          >
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5">
                                <Check className="h-3.5 w-3.5 text-blue-200" />
                              </div>
                            )}
                            <span className="leading-tight block pr-4">{subject}</span>
                          </button>
                        );
                      })}
                    </div>
                    {filteredSubjects.length === 0 && (
                      <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                        No subjects match &quot;{subjectSearch}&quot;
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={`transition-all duration-300 overflow-hidden ${error ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                {error && <p className="text-sm font-medium text-red-500 bg-red-50 dark:bg-red-500/10 dark:border-red-500/20 p-3 rounded-xl border border-red-100">{error}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] group text-lg font-bold mt-6 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
                disabled={loading || !course || selectedSubjects.length === 0 || (course === "B.Tech" && !branch)}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Complete Registration <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

