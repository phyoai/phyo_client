// This file ensures the /admin route redirects to /admin/login by default
import { redirect } from "next/navigation";

export default function AdminRoot() {
  redirect("/admin/login");
  return null;
}
