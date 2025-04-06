// src/app/page.tsx

"use client";

// import { useState } from "react";
// import { useAuth } from "@/lib/auth-context";
// import { useRouter } from "next/navigation";

// src/app/page.tsx (Main login selector)

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Portal</h1>
        <div className="space-y-4">
          <a
            href="/admin/super"
            className="block w-full bg-blue-500 text-white py-2 px-4 rounded-md text-center hover:bg-blue-600"
          >
            Super Admin Login
          </a>
          <a
            href="/admin/staff"
            className="block w-full bg-green-500 text-white py-2 px-4 rounded-md text-center hover:bg-green-600"
          >
            Staff Admin Login
          </a>
        </div>
      </div>
    </div>
  );
}
