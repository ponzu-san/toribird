import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin";
import AdminLoginForm from "@/app/admin/login/AdminLoginForm";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}
