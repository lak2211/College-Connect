import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminTopBar } from "@/components/AdminTopBar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string }).role !== "admin") {
    redirect("/admin-login");
  }

  const user = session.user as { name?: string };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 pl-72 min-h-screen">
        <AdminTopBar userName={user.name || "Admin"} />
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
