import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import SettingsPageClient from "./SettingsPageClient";

export default async function AdminSettingsPage() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  return <SettingsPageClient />;
}
