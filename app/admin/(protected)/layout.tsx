import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-surface">
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-7xl px-5 py-6 lg:px-6">{children}</main>
    </div>
  );
}
