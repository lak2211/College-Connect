"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  UploadCloud, FileText, BookOpen, Video, CheckCircle2, AlertCircle,
  GraduationCap, Tag, Link2, Calendar, Loader2,
  FileCheck, Clock, Search, Check, Building
} from "lucide-react";

const UNIVERSITIES = [
  { id: "GGSIPU", name: "Guru Gobind Singh Indraprastha University (GGSIPU)" },
  { id: "DU", name: "Delhi University (DU)" },
  { id: "AKTU", name: "Dr. A.P.J. Abdul Kalam Technical University (AKTU)" },
  { id: "MDU", name: "Maharshi Dayanand University (MDU)" },
  { id: "DTU", name: "Delhi Technological University (DTU)" },
  { id: "NSUT", name: "Netaji Subhas University of Technology (NSUT)" },
  { id: "Amity", name: "Amity University" },
];

const COURSES = [
  { id: "B.Tech", name: "B.Tech (Bachelor of Technology)" },
  { id: "BCA", name: "BCA (Bachelor of Computer Applications)" },
  { id: "M.Tech", name: "M.Tech (Master of Technology)" },
  { id: "MCA", name: "MCA (Master of Computer Applications)" },
];

const SUBJECTS_MAP: Record<string, string[]> = {
  "B.Tech": [
    "Engineering Mathematics-I", "Engineering Mathematics-II", "Engineering Mathematics-III",
    "Discrete Mathematics", "Probability & Statistics", "Physics for Engineers",
    "Chemistry for Engineers", "Programming in C", "Programming in Python",
    "Object Oriented Programming", "Data Structures", "Design & Analysis of Algorithms",
    "Computer Organization", "Computer Organization & Architecture", "Microprocessors & Interfacing",
    "Database Management Systems", "Data Warehousing", "Data Mining", "Data Engineering",
    "Operating Systems", "Computer Networks", "Data Communication", "Network Security",
    "Information Security", "Software Engineering", "Theory of Computation", "Compiler Design",
    "Web Technologies", "Artificial Intelligence", "Machine Learning", "Deep Learning",
    "Natural Language Processing", "Computer Vision"
  ],
  "BCA": ["C Programming", "Computer Architecture", "Mathematics I", "Web Design", "Software Engineering", "Python Programming", "Java Programming", "Database Systems"],
  "M.Tech": ["Advanced Algorithms", "Advanced Computer Architecture", "Distributed Systems", "Machine Learning", "Deep Learning", "Cloud Computing"],
  "MCA": ["Advanced Algorithms", "Machine Learning", "Cloud Computing", "Big Data Analytics", "Python Programming", "Data Mining", "Software Testing"],
};

const RESOURCE_TYPES = [
  { value: "Notes", label: "Notes", description: "Study notes & summaries", icon: FileText, color: "blue" },
  { value: "PYQ", label: "PYQ", description: "Previous year questions", icon: BookOpen, color: "amber" },
  { value: "Video", label: "Video", description: "YouTube video lectures", icon: Video, color: "purple" },
];

const RECENT_UPLOADS = [
  { title: "Operating Systems PYQ 2023", type: "PYQ", subject: "Operating Systems", time: "2 min ago", status: "approved" },
  { title: "DBMS Unit 3 Notes", type: "Notes", subject: "Database Management", time: "1 hour ago", status: "pending" },
  { title: "ML Video Lecture - Unit 1", type: "Video", subject: "Machine Learning", time: "3 hours ago", status: "approved" },
];

export default function AdminUploadPage() {
  const [university, setUniversity] = useState("");
  const [course, setCourse] = useState("");
  const [subject, setSubject] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");
  const [type, setType] = useState("Notes");
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("url");
  const [file, setFile] = useState<File | null>(null);
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const availableSubjects = course ? SUBJECTS_MAP[course] || [] : [];

  const filteredSubjects = useMemo(() => {
    if (!subjectSearch) return availableSubjects;
    return availableSubjects.filter(s => s.toLowerCase().includes(subjectSearch.toLowerCase()));
  }, [availableSubjects, subjectSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("university", university);
      formData.append("course", course);
      formData.append("subject", subject);
      formData.append("type", type);
      formData.append("title", title);

      if (type === "Video") {
        formData.append("videoLink", videoLink);
      } else {
        if (uploadMethod === "url") {
          formData.append("fileUrl", fileUrl);
        } else if (file) {
          formData.append("file", file);
        }
        if (type === "PYQ" && year) {
          formData.append("year", year);
        }
      }

      const res = await fetch("/api/admin/upload-resource", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setMessage("success");
      setTitle(""); setFileUrl(""); setVideoLink(""); setYear(""); setFile(null);
    } catch (err: unknown) {
      setMessage("error:" + (err instanceof Error ? err.message : "Upload failed"));
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = university && course && subject && title && (type === "Video" ? videoLink : (uploadMethod === "url" ? fileUrl : file));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Upload Resources</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Add new study materials, PYQs, or video lectures for students.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Step 1: University Selection */}
            <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-extrabold text-slate-900 dark:text-white">1</div>
                  <div>
                    <CardTitle className="text-base text-slate-900 dark:text-white font-bold">Select University</CardTitle>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Choose the university for this resource</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                <Label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-2 mb-3">
                  <Building className="h-3.5 w-3.5 text-indigo-400" /> Target University
                </Label>
                <Select value={university} onValueChange={(val) => { setUniversity(val ?? ""); setCourse(""); setSubject(""); setSubjectSearch(""); }}>
                  <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 text-slate-900 dark:text-white h-12 rounded-xl hover:border-slate-600 transition-colors text-sm">
                    <SelectValue placeholder="Select a university..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-100 dark:bg-slate-800 border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl">
                    {UNIVERSITIES.map(u => (
                      <SelectItem key={u.id} value={u.id} className="cursor-pointer py-3 text-sm">{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Step 2: Course Selection */}
            <Card className={`bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-sm overflow-hidden transition-opacity ${!university ? "opacity-50 pointer-events-none" : ""}`}>
              <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-extrabold text-slate-900 dark:text-white">2</div>
                  <div>
                    <CardTitle className="text-base text-slate-900 dark:text-white font-bold">Select Course</CardTitle>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                      {university ? `Choose a course for ${UNIVERSITIES.find(u => u.id === university)?.id}` : "Select a university first"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                <Label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-2 mb-3">
                  <GraduationCap className="h-3.5 w-3.5 text-blue-400" /> Target Course
                </Label>
                <Select value={course} onValueChange={(val) => { setCourse(val ?? ""); setSubject(""); setSubjectSearch(""); }}>
                  <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 text-slate-900 dark:text-white h-12 rounded-xl hover:border-slate-600 transition-colors text-sm">
                    <SelectValue placeholder="Select a course..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-100 dark:bg-slate-800 border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl">
                    {COURSES.map(c => (
                      <SelectItem key={c.id} value={c.id} className="cursor-pointer py-3 text-sm">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Step 3: Subject Selection — Card Grid (like onboarding) */}
            <Card className={`bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-sm overflow-hidden transition-opacity ${!course ? "opacity-50 pointer-events-none" : ""}`}>
              <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-extrabold text-slate-900 dark:text-white">3</div>
                  <div>
                    <CardTitle className="text-base text-slate-900 dark:text-white font-bold">Select Subject</CardTitle>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                      {course ? `Choose a subject from ${course} curriculum` : "Select a course first"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                {/* Selected Subject Tag */}
                {subject && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">Selected:</span>
                    <span className="inline-flex items-center gap-1.5 bg-blue-600 text-slate-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {subject}
                      <button
                        type="button"
                        onClick={() => setSubject("")}
                        className="ml-1 hover:text-blue-200 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                )}

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-500" />
                  <Input
                    type="text"
                    placeholder="Search subjects..."
                    value={subjectSearch}
                    onChange={(e) => setSubjectSearch(e.target.value)}
                    className="pl-10 h-10 bg-slate-800/50 border-slate-700 text-slate-900 dark:text-white rounded-xl placeholder:text-slate-600 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Subject Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredSubjects.map((s) => {
                    const isSelected = subject === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSubject(isSelected ? "" : s)}
                        className={`relative p-3 rounded-xl text-left text-xs font-medium transition-all duration-200 border ${isSelected
                            ? "bg-blue-600/20 border-blue-500/50 text-blue-300 ring-1 ring-blue-500/30"
                            : "bg-slate-100 dark:bg-slate-800/40 border-slate-700/40 text-slate-700 dark:text-slate-300 hover:bg-slate-800/70 hover:border-slate-600"
                          }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <Check className="h-3.5 w-3.5 text-blue-400" />
                          </div>
                        )}
                        <span className="block pr-5 leading-snug">{s}</span>
                      </button>
                    );
                  })}
                </div>
                {course && filteredSubjects.length === 0 && (
                  <p className="text-center text-sm text-slate-500 dark:text-slate-500 py-4">No subjects match your search.</p>
                )}
              </CardContent>
            </Card>

            {/* Step 4: Resource Type */}
            <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-xs font-extrabold text-slate-900 dark:text-white">4</div>
                  <div>
                    <CardTitle className="text-base text-slate-900 dark:text-white font-bold">Resource Type</CardTitle>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">What kind of material are you uploading?</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="grid grid-cols-3 gap-3">
                  {RESOURCE_TYPES.map((rt) => {
                    const Icon = rt.icon;
                    const isSelected = type === rt.value;
                    const colorMap: Record<string, { bg: string; border: string; icon: string; ring: string }> = {
                      blue: { bg: "bg-blue-600/15", border: "border-blue-500/40", icon: "text-blue-400", ring: "ring-blue-500/30" },
                      amber: { bg: "bg-amber-600/15", border: "border-amber-500/40", icon: "text-amber-400", ring: "ring-amber-500/30" },
                      purple: { bg: "bg-purple-600/15", border: "border-purple-500/40", icon: "text-purple-400", ring: "ring-purple-500/30" },
                    };
                    const c = colorMap[rt.color];
                    return (
                      <button
                        key={rt.value}
                        type="button"
                        onClick={() => setType(rt.value)}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${isSelected
                            ? `${c.bg} ${c.border} ring-2 ${c.ring} scale-[1.02]`
                            : "border-slate-300 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:bg-slate-800/60 hover:border-slate-600"
                          }`}
                      >
                        <Icon className={`h-6 w-6 mx-auto mb-2 ${isSelected ? c.icon : "text-slate-500 dark:text-slate-500"}`} />
                        <p className={`text-sm font-bold ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>{rt.label}</p>
                        <p className={`text-[10px] mt-0.5 ${isSelected ? "text-slate-600 dark:text-slate-400" : "text-slate-600"}`}>{rt.description}</p>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Step 5: Details */}
            <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-xs font-extrabold text-slate-900 dark:text-white">5</div>
                  <div>
                    <CardTitle className="text-base text-slate-900 dark:text-white font-bold">Resource Details</CardTitle>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Provide the title and file link</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-purple-400" /> Resource Title
                  </Label>
                  <Input
                    placeholder="e.g. Unit 1 Complete Summary"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-slate-800/50 border-slate-700 text-slate-900 dark:text-white h-11 rounded-xl placeholder:text-slate-600 hover:border-slate-600 focus-visible:ring-blue-500 transition-colors"
                  />
                </div>
                {type === "PYQ" && (
                  <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-amber-400" /> Exam Year
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g. 2023"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      required
                      className="bg-slate-800/50 border-slate-700 text-slate-900 dark:text-white h-11 rounded-xl placeholder:text-slate-600 hover:border-slate-600 focus-visible:ring-blue-500 transition-colors"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  {type === "Video" ? (
                    <>
                      <Label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-2">
                        <Link2 className="h-3.5 w-3.5 text-indigo-400" />
                        YouTube Video Link
                      </Label>
                      <Input
                        type="url"
                        placeholder="https://youtube.com/watch?v=..."
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                        required
                        className="bg-slate-800/50 border-slate-700 text-slate-900 dark:text-white h-11 rounded-xl placeholder:text-slate-600 hover:border-slate-600 focus-visible:ring-blue-500 transition-colors"
                      />
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-2">
                          <Link2 className="h-3.5 w-3.5 text-indigo-400" />
                          File Source
                        </Label>
                        <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700/50">
                          <button
                            type="button"
                            onClick={() => setUploadMethod("url")}
                            className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${uploadMethod === "url" ? "bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300"}`}
                          >
                            Provide URL
                          </button>
                          <button
                            type="button"
                            onClick={() => setUploadMethod("file")}
                            className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${uploadMethod === "file" ? "bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300"}`}
                          >
                            Upload File
                          </button>
                        </div>
                      </div>

                      {uploadMethod === "url" ? (
                        <Input
                          type="url"
                          placeholder="https://drive.google.com/..."
                          value={fileUrl}
                          onChange={(e) => setFileUrl(e.target.value)}
                          required
                          className="bg-slate-800/50 border-slate-700 text-slate-900 dark:text-white h-11 rounded-xl placeholder:text-slate-600 hover:border-slate-600 focus-visible:ring-blue-500 transition-colors"
                        />
                      ) : (
                        <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-xl bg-slate-50 dark:bg-slate-800/30 p-4 transition-colors flex items-center justify-center relative">
                          <input
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                          />
                          <div className="text-center pointer-events-none">
                            <UploadCloud className="h-6 w-6 text-slate-600 dark:text-slate-400 mx-auto mb-2" />
                            {file ? (
                              <p className="text-sm font-semibold text-blue-400 truncate max-w-[200px] mx-auto">{file.name}</p>
                            ) : (
                              <p className="text-sm text-slate-600 dark:text-slate-400">Click or drag file to upload</p>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Message */}
            {message && (
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${message === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}>
                {message === "success" ? <CheckCircle2 className="h-5 w-5 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 flex-shrink-0" />}
                <span className="text-sm font-medium">
                  {message === "success" ? "Resource uploaded successfully! It's now available to students." : message.replace("error:", "")}
                </span>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full h-12 rounded-xl text-sm font-bold transition-all duration-300 ${isFormValid
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-slate-900 dark:text-white shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed"
                }`}
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
              ) : (
                <><UploadCloud className="mr-2 h-5 w-5" /> Publish Resource</>
              )}
            </Button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Uploads */}
          <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <CardTitle className="text-sm text-slate-900 dark:text-white font-bold">Recent Uploads</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {RECENT_UPLOADS.map((u, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-800/70 transition-all">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${u.type === "Notes" ? "bg-blue-500/20" : u.type === "PYQ" ? "bg-amber-500/20" : "bg-purple-500/20"
                      }`}>
                      {u.type === "Notes" ? <FileText className="h-4 w-4 text-blue-400" /> :
                        u.type === "PYQ" ? <BookOpen className="h-4 w-4 text-amber-400" /> :
                          <Video className="h-4 w-4 text-purple-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{u.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-500">{u.subject} · {u.time}</p>
                    </div>
                    <Badge variant="outline" className={`text-[9px] font-bold px-1.5 py-0 rounded-full flex-shrink-0 ${u.status === "approved"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}>
                      {u.status === "approved" ? <FileCheck className="h-2.5 w-2.5 mr-0.5" /> : <Clock className="h-2.5 w-2.5 mr-0.5" />}
                      {u.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="bg-gradient-to-br from-blue-600/20 to-indigo-900/10 border-blue-500/20 rounded-2xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <UploadCloud className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">384</p>
                <p className="text-xs text-blue-300/70 font-medium mt-1">Total Resources Published</p>
                <div className="mt-3 pt-3 border-t border-blue-500/10 grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">219</p>
                    <p className="text-[9px] text-slate-500 dark:text-slate-500">Notes</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">103</p>
                    <p className="text-[9px] text-slate-500 dark:text-slate-500">PYQs</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">62</p>
                    <p className="text-[9px] text-slate-500 dark:text-slate-500">Videos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
