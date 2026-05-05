"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Search, Save, Check, AlertCircle } from "lucide-react";

// Curriculums mapping (matching onboarding)
const BTECH_ALL_SUBJECTS = [
  "Engineering Mathematics-I", "Engineering Mathematics-II", "Engineering Mathematics-III",
  "Discrete Mathematics", "Probability & Statistics", "Linear Algebra", "Optimization Techniques",
  "Physics for Engineers", "Chemistry for Engineers", "Basic Electrical Engineering",
  "Environmental Studies", "Programming in C", "Programming in Python", "Object Oriented Programming",
  "Data Structures", "Design & Analysis of Algorithms", "Computer Organization",
  "Computer Organization & Architecture", "Microprocessors & Interfacing",
  "Database Management Systems", "Data Warehousing", "Data Mining", "Data Engineering",
  "Operating Systems", "Computer Networks", "Data Communication", "Network Security",
  "Information Security", "Advanced Computer Networks", "Software Engineering",
  "Theory of Computation", "Compiler Design", "Web Technologies", "Artificial Intelligence",
  "Machine Learning", "Advanced Machine Learning", "Deep Learning", "Reinforcement Learning",
  "Natural Language Processing", "Computer Vision", "Intelligent Systems",
  "Advanced Artificial Intelligence", "AI Ethics", "Data Visualization", "Statistical Methods",
  "Python for Data Science", "Business Intelligence", "Time Series Analysis", "Advanced Data Analytics",
  "Big Data Analytics", "Cloud Computing", "Distributed Systems", "Blockchain Technology",
  "Mobile Computing", "Robotics", "Data Science for AI",
];

const SUBJECTS_MAP: Record<string, string[]> = {
  "B.Tech": BTECH_ALL_SUBJECTS,
  "BCA": ["C Programming", "Computer Architecture", "Mathematics I", "Web Design", "Software Engineering"],
  "M.Tech": ["Advanced Algorithms", "Advanced Computer Architecture", "Distributed Systems", "Machine Learning"],
  "MCA": ["Advanced Algorithms", "Machine Learning", "Cloud Computing", "Big Data Analytics", "Python Programming"],
};

export default function EditSubjectsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userCourse, setUserCourse] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setUserCourse(data.course || "");
          setSelectedSubjects(data.subjects || []);
        } else {
          setError("Failed to load profile data.");
        }
      } catch {
        setError("An error occurred while loading profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const availableSubjects = useMemo(() => {
    return userCourse ? SUBJECTS_MAP[userCourse] || [] : [];
  }, [userCourse]);

  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return availableSubjects;
    const q = searchQuery.toLowerCase();
    return availableSubjects.filter((s) => s.toLowerCase().includes(q));
  }, [availableSubjects, searchQuery]);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const handleSave = async () => {
    if (selectedSubjects.length === 0) {
      setError("Please select at least one subject.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjects: selectedSubjects }),
      });

      if (res.ok) {
        router.push("/dashboard/profile");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to update subjects");
      }
    } catch {
      setError("An external error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Loading curriculum...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/profile">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 dark:border-slate-800">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Edit Subjects</h2>
          <p className="text-sm text-slate-500">Update your tracked subjects for {userCourse || "your course"}</p>
        </div>
      </div>

      <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60 pb-6">
          <CardTitle className="text-lg">Select Your Subjects</CardTitle>
          <CardDescription>
            Choose the subjects you are currently studying. This customizes your dashboard recommendations.
            You have selected <strong className="text-blue-600 dark:text-blue-400">{selectedSubjects.length}</strong> subjects.
          </CardDescription>

          <div className="mt-4 relative max-w-md">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              type="text"
              placeholder="Search subjects..."
              className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl w-full text-sm focus-visible:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {error && (
            <div className="p-4 m-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="p-6">
            {availableSubjects.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <p>No subjects found for your course. Please contact support.</p>
              </div>
            ) : filteredSubjects.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <p>No subjects match your search &quot;{searchQuery}&quot;.</p>
                <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2 text-blue-500">
                  Clear search
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredSubjects.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub);
                  return (
                    <div
                      key={sub}
                      onClick={() => toggleSubject(sub)}
                      className={`
                        group relative flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 border
                        ${isSelected
                          ? "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 shadow-sm"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700"
                        }
                      `}
                    >
                      <div className={`
                        flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors
                        ${isSelected
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-slate-300 dark:border-slate-600 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                        }
                      `}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? "text-blue-900 dark:text-blue-200" : "text-slate-700 dark:text-slate-300"}`}>
                        {sub}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
        <div className="p-6 flex items-center justify-end border-t border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900">
          <Link href="/dashboard/profile" className="mr-4">
            <Button variant="ghost" className="rounded-xl">Cancel</Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={saving || selectedSubjects.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8 shadow-md"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
