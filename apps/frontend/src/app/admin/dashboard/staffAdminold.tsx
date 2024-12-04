// src/components/dashboard/StaffAdminDashboard.tsx

import { useState, useEffect } from "react";
import { mockComplaints } from "@/mock/data";
import { getAuth } from "@/lib/auth";
import Link from "next/link";

export default function StaffAdminDashboard() {
  const auth = getAuth();
  const [stats, setStats] = useState({
    assignedComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    recentComplaints: [] as any[],
    resolutionRate: 0,
  });

  useEffect(() => {
    if (!auth) return;

    // Filter complaints assigned to this staff admin
    const staffComplaints = mockComplaints.filter(
      (c) => c.assignedTo === auth.email,
    );
    const pending = staffComplaints.filter((c) => c.status === "pending");
    const resolved = staffComplaints.filter((c) => c.status === "resolved");

    setStats({
      assignedComplaints: staffComplaints.length,
      pendingComplaints: pending.length,
      resolvedComplaints: resolved.length,
      recentComplaints: staffComplaints.slice(0, 5),
      resolutionRate:
        staffComplaints.length > 0
          ? (resolved.length / staffComplaints.length) * 100
          : 0,
    });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Staff Dashboard</h2>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">
            Assigned
          </h3>
          <p className="text-3xl font-bold mt-2">{stats.assignedComplaints}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">
            Pending
          </h3>
          <p className="text-3xl font-bold mt-2 text-yellow-600">
            {stats.pendingComplaints}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">
            Resolved
          </h3>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {stats.resolvedComplaints}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">
            Resolution Rate
          </h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            {stats.resolutionRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Active Complaints */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Active Complaints</h3>
          <Link
            href="/admin/dashboard/complaints"
            className="text-blue-600 hover:text-blue-800"
          >
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {stats.recentComplaints.map((complaint) => (
            <div key={complaint.id} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{complaint.playerName}</p>
                  <p className="text-sm text-gray-500">
                    {complaint.playerEmail}
                  </p>
                  <p className="text-sm mt-1">{complaint.description}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      complaint.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {complaint.status}
                  </span>
                  <Link
                    href={`/admin/dashboard/complaints/${complaint.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                  >
                    Handle Complaint
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/admin/dashboard/complaints?filter=pending"
            className="bg-blue-100 text-blue-800 p-4 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <h4 className="font-semibold">View Pending Complaints</h4>
            <p className="text-sm mt-1">Handle your assigned complaints</p>
          </Link>
          <Link
            href="/admin/dashboard/players"
            className="bg-green-100 text-green-800 p-4 rounded-lg hover:bg-green-200 transition-colors"
          >
            <h4 className="font-semibold">Search Players</h4>
            <p className="text-sm mt-1">Look up player information</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
