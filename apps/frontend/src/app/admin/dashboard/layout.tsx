// src/components/Layout.tsx
"use client";

import { useState } from "react";
// import { useAuth } from "@/lib/auth-context";
import { clearAuth, getAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const user = getAuth();

  const router = useRouter();
  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { label: "Complaints", href: "/admin/dashboard/complaints", icon: "⚠️" },
    { label: "Players", href: "/admin/dashboard/players", icon: "👥" },
  ];

  if (user?.role === "super_admin") {
    menuItems.push({
      label: "Manage Staff",
      href: "/admin/dashboard/manage-staff",
      icon: "👥",
    });
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-gray-800 text-white transition-all duration-300 ease-in-out`}
      >
        <div className="p-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full text-left"
          >
            {isSidebarOpen ? "←" : "→"}
          </button>
        </div>
        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-4 py-2 hover:bg-gray-700"
            >
              <span className="mr-2">{item.icon}</span>
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        <header className="bg-white shadow-md p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Gaming Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span>{user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
