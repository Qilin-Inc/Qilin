// src/app/dashboard/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "@/lib/auth";
import SuperAdminDashboard from "./superAdmin";
import StaffAdminDashboard from "./staffAdmin";

export default function DashboardPage() {
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    if (!auth) {
      router.push("/admin");
    }
  }, [router, auth]);

  if (!auth) return null;

  return auth.role === "super_admin" ? (
    <SuperAdminDashboard />
  ) : (
    <StaffAdminDashboard />
  );
}
