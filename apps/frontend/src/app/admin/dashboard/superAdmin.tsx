// src/components/dashboard/SuperAdminDashboard.tsx

import { useState, useEffect } from "react";
import { mockComplaints, mockStaffAdmins, mockPlayers } from "@/mock/data";
//change  mockComplaints to use json data

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    totalPlayers: 0,
    totalStaffAdmins: 0,
    staffPerformance: [] as any[],
  });

  const [allComplaints, setAllComplaints] = useState("");

  useEffect(() => {
    // Fetch staff list
    fetch("/api/staff")
      .then((res) => res.json())
      .then((data) => {
        const staffPerformance = data.map((staff: any) => ({
          name: staff.name,
          email: staff.email,
          assigned: staff.assignedComplaints,
          resolved: staff.resolvedComplaints,
          pending: staff.pendingComplaints,
          resolutionRate:
            staff.assignedComplaints > 0
              ? (
                  (staff.resolvedComplaints / staff.assignedComplaints) *
                  100
                ).toFixed(1)
              : 0,
        }));
        setStats((prevStats) => ({ ...prevStats, staffPerformance }));
      });

    // Fetch complaints
    fetch("/api/complaints")
      .then((res) => res.json())
      .then((data) => {
        setAllComplaints(data);
        setStats((prevStats) => ({
          ...prevStats,
          totalComplaints: data.length,
          pendingComplaints: data.filter((c: any) => c.status === "pending")
            .length,
          resolvedComplaints: data.filter((c: any) => c.status === "resolved")
            .length,
        }));
      });

    // Fetch players
    fetch("/api/players")
      .then((res) => res.json())
      .then((data) => {
        setStats((prevStats) => ({
          ...prevStats,
          totalPlayers: data.length,
        }));
      });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Super Admin Dashboard</h2>
      {/* hello
      {allComplaints &&
        allComplaints.map((complaint: any) => (
          <div key={complaint.id}>
            <p>Player: {complaint.playerName}</p>
            <p>Status: {complaint.status}</p>
            <p>Description: {complaint.description}</p>
          </div>
        ))} */}
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Complaints Overview</h3>
          <div className="space-y-2">
            <p>Total: {stats.totalComplaints}</p>
            <div className="flex justify-between">
              <span>Pending:</span>
              <span className="text-yellow-600">{stats.pendingComplaints}</span>
            </div>
            <div className="flex justify-between">
              <span>Resolved:</span>
              <span className="text-green-600">{stats.resolvedComplaints}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Platform Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Players:</span>
              <span>{stats.totalPlayers}</span>
            </div>
            <div className="flex justify-between">
              <span>Staff Admins:</span>
              <span>{stats.totalStaffAdmins}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Resolution Rate</h3>
          <div className="text-3xl font-bold text-blue-600">
            {stats.totalComplaints > 0
              ? (
                  (stats.resolvedComplaints / stats.totalComplaints) *
                  100
                ).toFixed(1)
              : 0}
            %
          </div>
        </div>
      </div>
      {/* Staff Performance */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Staff Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Assigned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Resolved
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Pending
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Resolution Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.staffPerformance.map((staff, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{staff.name}</div>
                      <div className="text-sm text-gray-500">{staff.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{staff.assigned}</td>
                  <td className="px-6 py-4 text-green-600">{staff.resolved}</td>
                  <td className="px-6 py-4 text-yellow-600">{staff.pending}</td>
                  <td className="px-6 py-4">{staff.resolutionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Recent Complaints */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Complaints</h3>
        <div className="space-y-4">
          {allComplaints &&
            allComplaints.slice(0, 5).map((complaint: any) => (
              <div key={complaint.id} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{complaint.playerName}</p>
                    <p className="text-sm text-gray-500">
                      {complaint.playerEmail}
                    </p>
                    <p className="text-sm mt-1">{complaint.description}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      complaint.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {complaint.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
