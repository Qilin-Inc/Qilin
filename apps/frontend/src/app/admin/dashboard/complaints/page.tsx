// src/app/complaints/page.tsx

"use client";

import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { getAuth } from "@/lib/auth";
import Link from "next/link";

interface Complaint {
  id: string;
  playerName: string;
  playerEmail: string;
  description: string;
  status: "pending" | "resolved";
  assignedTo: string | null;
  createdAt: string;
  resolution?: {
    type: "ban" | "dismiss";
    resolvedAt: string;
  };
}

export default function ComplaintsPage() {
  const router = useRouter();
  const auth = getAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch("/api/complaints");
      const data = await response.json();

      // Filter based on user role
      const filteredComplaints =
        auth?.role === "staff_admin"
          ? data.filter(
              (complaint: Complaint) => complaint.assignedTo === auth.email,
            )
          : data;

      setComplaints(filteredComplaints);
    } catch (error) {
      setError("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleResolveComplaint = async (
    complaintId: string,
    resolution: "ban" | "dismiss",
  ) => {
    try {
      const response = await fetch(`/api/complaints/${complaintId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolution }),
      });

      if (!response.ok) {
        throw new Error("Failed to resolve complaint");
      }

      // Refresh complaints list
      fetchComplaints();
    } catch (error) {
      setError("Failed to resolve complaint");
    }
  };

  const filteredComplaints = Array.isArray(complaints)
    ? complaints.filter((complaint) => {
        if (filter === "pending") return complaint.status === "pending";
        if (filter === "resolved") return complaint.status === "resolved";
        return true;
      })
    : [];

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Complaints Management</h2>
        <div className="space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#21211D] rounded-3xl p-2 text-white hover:bg-black "
          >
            <option value="all">All Complaints</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="rounded-3xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#21211D]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase">
                Player
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase">
                {auth?.role === "super_admin" && "Assign"}
                {auth?.role === "staff_admin" && "Actions"}
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#383836] divide-y divide-[#21211D]">
            {filteredComplaints.map((complaint) => (
              <tr key={complaint.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      router.push(
                        `/admin/dashboard/complaints/${complaint.id}`,
                      );
                    }}
                  >
                    <div className="font-medium">{complaint.playerName}</div>
                    <div className="text-sm text-gray-400">
                      {complaint.playerEmail}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-white">{complaint.description}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                <td className="px-6 py-4 whitespace-nowrap">
                  {complaint.assignedTo || "Unassigned"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-x-2">
                    {auth?.role === "super_admin" &&
                      complaint.status === "pending" &&
                      !complaint.assignedTo && (
                        <Link
                          href={`/admin/dashboard/complaints/assign/${complaint.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Assign
                        </Link>
                      )}
                    {complaint.status === "pending" &&
                      complaint.assignedTo === auth?.email && (
                        <>
                          <button
                            onClick={() =>
                              handleResolveComplaint(complaint.id, "ban")
                            }
                            className="text-red-600 hover:text-red-800"
                          >
                            Ban Player
                          </button>
                          <button
                            onClick={() =>
                              handleResolveComplaint(complaint.id, "dismiss")
                            }
                            className="text-green-600 hover:text-green-800"
                          >
                            Dismiss
                          </button>
                        </>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
