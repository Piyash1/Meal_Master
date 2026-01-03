import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "./ChangePasswordForm";

export default async function SettingsPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-400">
          Manage your account preferences and security.
        </p>
      </div>

      <div className="max-w-xl">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
