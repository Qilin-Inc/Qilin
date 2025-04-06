// src/app/complaints/page.tsx

"use client";

import { useState } from "react";
import { getAuth } from "@/lib/auth";
import { mockComplaints } from "@/mock/data";
import Link from "next/link";

export default function ComplaintsPage() {
  const authData = getAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredComplaints = mockComplaints.filter((complaint) => {
    const playerSearch = complaint.playerEmail
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const staffSearch = complaint.assignedTo
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (authData?.role === "staff_admin") {
      return (
        (staffSearch || playerSearch) && complaint.assignedTo === authData.email
      );
    }

    return staffSearch || playerSearch;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Complaints</h2>
        <div className="w-64">
          <input
            type="text"
            placeholder="Search by email..."
            className="w-full p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Player
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredComplaints.map((complaint) => (
              <tr key={complaint.id}>
                <td className="px-6 py-4 whitespace-nowrap">{complaint.id}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium">{complaint.playerName}</span>
                    <span className="text-sm text-gray-500">
                      {complaint.playerEmail}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      complaint.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {complaint.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {complaint.assignedTo || "Unassigned"}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/dashboard/complaints/${complaint.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
