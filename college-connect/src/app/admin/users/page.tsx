"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal, Search, Users, UserCheck, UserX, ShieldAlert,
  Trash2, Eye, Download,
  Filter, GraduationCap, Loader2
} from "lucide-react";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  status?: "Active" | "Inactive" | "Suspended";
  course?: string;
  branch?: string;
  subjects?: string[];
  createdAt: string;
}

const statusConfig = {
  Active: { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" },
  Inactive: { color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30", dot: "bg-slate-500" },
  Suspended: { color: "bg-red-500/10 text-red-400 border-red-500/30", dot: "bg-red-400" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/stats")
        ]);
        
        if (usersRes.ok && statsRes.ok) {
          const userData = await usersRes.json();
          setUsers(userData.users || []);
        }
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = users.filter((u: AdminUser) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || (u.status || "Active") === statusFilter;
    const matchCourse = courseFilter === "all" || u.course === courseFilter;
    return matchSearch && matchStatus && matchCourse;
  });

  const toggleSelect = (id: string) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    setSelectedUsers(prev => prev.length === filtered.length ? [] : filtered.map((u: AdminUser) => u._id));
  };

  const totalActive = users.filter((u: AdminUser) => (u.status || "Active") === "Active").length;
  const totalInactive = users.filter((u: AdminUser) => u.status === "Inactive").length;
  const totalSuspended = users.filter((u: AdminUser) => u.status === "Suspended").length;

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Manage Users</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">View, search, and manage all registered students on the platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/10 border border-blue-500/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl"><Users className="h-6 w-6 text-blue-400" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{users.length}</p>
            <p className="text-xs text-blue-300/70 font-medium">Total Users</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-900/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-xl"><UserCheck className="h-6 w-6 text-emerald-400" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalActive}</p>
            <p className="text-xs text-emerald-300/70 font-medium">Active</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-600/20 to-slate-900/10 border border-slate-500/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-slate-500/20 rounded-xl"><UserX className="h-6 w-6 text-slate-600 dark:text-slate-400" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalInactive}</p>
            <p className="text-xs text-slate-700 dark:text-slate-300/70 font-medium">Inactive</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-600/20 to-red-900/10 border border-red-500/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-red-500/20 rounded-xl"><ShieldAlert className="h-6 w-6 text-red-400" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalSuspended}</p>
            <p className="text-xs text-red-300/70 font-medium">Suspended</p>
          </div>
        </div>
      </div>

      {/* Toolbar: Search + Filters + Actions */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-500" />
            <Input
              type="search"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 bg-slate-50 dark:bg-slate-900 border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-500 rounded-xl focus-visible:ring-blue-500"
            />
          </div>
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? "all")}>
            <SelectTrigger className="w-36 h-10 bg-slate-50 dark:bg-slate-900 border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl">
              <Filter className="h-3.5 w-3.5 mr-2 text-slate-500 dark:text-slate-500" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-100 dark:bg-slate-800 border-slate-700 text-slate-800 dark:text-slate-200">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          {/* Course Filter */}
          <Select value={courseFilter} onValueChange={(val) => setCourseFilter(val ?? "all")}>
            <SelectTrigger className="w-36 h-10 bg-slate-50 dark:bg-slate-900 border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl">
              <GraduationCap className="h-3.5 w-3.5 mr-2 text-slate-500 dark:text-slate-500" />
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent className="bg-slate-100 dark:bg-slate-800 border-slate-700 text-slate-800 dark:text-slate-200">
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="B.Tech">B.Tech</SelectItem>
              <SelectItem value="BCA">BCA</SelectItem>
              <SelectItem value="MCA">MCA</SelectItem>
              <SelectItem value="M.Tech">M.Tech</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          {selectedUsers.length > 0 && (
            <Button variant="outline" size="sm" className="bg-red-900/30 border-red-700 text-red-300 hover:bg-red-900/60 hover:text-red-200 rounded-xl">
              <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete ({selectedUsers.length})
            </Button>
          )}
          <Button variant="outline" size="sm" className="bg-slate-50 dark:bg-slate-900 border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-900 dark:text-white rounded-xl">
            <Download className="h-3.5 w-3.5 mr-1.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
                  <TableHead className="w-10 text-slate-500 dark:text-slate-500">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                      className="rounded border-slate-600 bg-slate-100 dark:bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer h-4 w-4"
                    />
                  </TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">User</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider hidden lg:table-cell">Course</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider hidden xl:table-cell">Subjects</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Joined</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user: AdminUser) => (
                  <TableRow
                    key={user._id}
                    className={`border-b border-slate-200 dark:border-slate-800/60 transition-colors cursor-pointer ${
                      selectedUsers.includes(user._id) ? 'bg-blue-900/20' : 'hover:bg-slate-100 dark:bg-slate-800/40'
                    }`}
                  >
                    <TableCell className="py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleSelect(user._id)}
                        className="rounded border-slate-600 bg-slate-100 dark:bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer h-4 w-4"
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-slate-900 dark:text-white`}>
                          {user.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">{user.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 hidden lg:table-cell">
                      <div>
                        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{user.course || "-"}</p>
                        {user.branch && <p className="text-xs text-slate-500 dark:text-slate-500">{user.branch}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 hidden xl:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-blue-400">{user.subjects?.length || 0}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-500">enrolled</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className={`${statusConfig[(user.status as keyof typeof statusConfig) || "Active"].color} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[(user.status as keyof typeof statusConfig) || "Active"].dot} mr-1.5 inline-block`} />
                        {user.status || "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 hidden md:table-cell">
                      <p className="text-xs text-slate-600 dark:text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-100 dark:bg-slate-800 border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl shadow-2xl w-48">
                          <DropdownMenuItem className="focus:bg-slate-700 focus:text-slate-900 dark:text-white cursor-pointer gap-2 text-sm">
                            <Eye className="h-4 w-4 text-blue-400" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 focus:bg-red-900/30 focus:text-red-300 cursor-pointer gap-2 text-sm">
                            <Trash2 className="h-4 w-4" /> Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{filtered.length}</span> of <span className="font-semibold text-slate-700 dark:text-slate-300">{users.length}</span> users
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

