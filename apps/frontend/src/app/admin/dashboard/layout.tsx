// src/components/Layout.tsx
"use client";

import { useState } from "react";
// import { useAuth } from "@/lib/auth-context";
import { clearAuth, getAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import HamburgurIcon from "@/icons/HamburgarIcon.svg";
import CancelIcon from "@/icons/CancelIcon.svg";
import DashboardIcon from "@/icons/dashboardIcon.svg";
import ComplaintsIcon from "@/icons/complaintsIcon.svg";
import PlayerIcon from "@/icons/playerIcon.svg";
import StaffIcon from "@/icons/staffIcon.svg";

import { useTheme } from "@/hooks/useTheme";
import { Ham } from "lucide-react";
// import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const user = getAuth();
  // const { isDark, theme, toggleTheme } = useTheme();

  const router = useRouter();
  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: DashboardIcon },
    {
      label: "Complaints",
      href: "/admin/dashboard/complaints",
      icon: ComplaintsIcon,
    },
    { label: "Players", href: "/admin/dashboard/players", icon: PlayerIcon },
  ];

  if (user?.role === "super_admin") {
    menuItems.push({
      label: "Manage Staff",
      href: "/admin/dashboard/manage-staff",
      icon: StaffIcon,
    });
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-[#21211D] text-white transition-all duration-300 ease-in-out`}
      >
        {/* <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full text-left"
          > */}
        {isSidebarOpen ? (
          <div
            className="p-4 flex justify-end"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Image
              alt=""
              src={CancelIcon.src}
              width={20}
              height={20}
              className="brightness-0 invert"
            />
          </div>
        ) : (
          <div
            className="p-4 flex justify-center"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Image
              alt=""
              src={HamburgurIcon.src}
              width={20}
              height={20}
              className="brightness-0 invert"
            />
          </div>
        )}
        {/* </button> */}
        <nav className="mt-8  flex flex-col items-center">
          <div className="w-fit space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-2 hover:bg-[#383836] hover:rounded-2xl"
              >
                <span className="mr-2">
                  <Image
                    alt=""
                    src={item.icon.src}
                    width={30}
                    height={30}
                    className="brightness-0 invert"
                  />
                </span>
                {isSidebarOpen && <span className="text-lg">{item.label}</span>}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 bg-[#2D2C29] text-white">
        <header className={` shadow-md p-4 `}>
          <div className="flex justify-end items-center">
            {/* <h1 className="text-xl font-bold">Gaming Admin Dashboard</h1> */}
            <div className="flex items-center gap-4 ">
              <span className="bg-[#383836] p-2 px-4 rounded-2xl">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-[#21211D] text-white px-4 py-2 rounded-3xl"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className={`p-6 bg-[#2D2C29] text-white`}>{children}</main>
      </div>
    </div>
  );
}
