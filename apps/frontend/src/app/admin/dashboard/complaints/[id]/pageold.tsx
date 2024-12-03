// src/app/complaints/[id]/page.tsx

"use client";

import { useState } from "react";
import { getAuth } from "@/lib/auth";
import { mockComplaints, mockStaffAdmins } from "@/mock/data";
import { useRouter } from "next/navigation";

export default function ComplaintDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const user = getAuth();
  const complaint = mockComplaints.find((c) => c.id === params.id);
  const [selectedStaffAdmin, setSelectedStaffAdmin] = useState("");

  if (!complaint) {
    return <div>Complaint not found</div>;
  }

  const handleAssign = () => {
    // In a real app, this would make an API call
    console.log(`Assigned to ${selectedStaffAdmin}`);
  };

  const handleAction = (action: "ban" | "dismiss") => {
    // In a real app, this would make an API call
    console.log(`Action taken: ${action}`);
    router.push("/admin/dashboard/complaints");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Complaint Details</h2>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Player Information</h3>
            <p>
              <strong>Name:</strong> {complaint.playerName}
            </p>
            <p>
              <strong>Email:</strong> {complaint.playerEmail}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Complaint Information
            </h3>
            <p>
              <strong>Status:</strong> {complaint.status}
            </p>
            <p>
              <strong>Created:</strong> {complaint.createdAt}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="bg-gray-50 p-4 rounded-md">{complaint.description}</p>
        </div>

        {user?.role === "super_admin" && complaint.status === "pending" && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Assign to Staff</h3>
            <div className="flex gap-4">
              <select
                className="flex-1 p-2 border rounded-md"
                value={selectedStaffAdmin}
                onChange={(e) => setSelectedStaffAdmin(e.target.value)}
              >
                <option value="">Select Staff Admin</option>
                {mockStaffAdmins.map((admin) => (
                  <option key={admin.id} value={admin.email}>
                    {admin.name} ({admin.email})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssign}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Assign
              </button>
            </div>
          </div>
        )}

        {complaint.status === "pending" && (
          <div className="flex gap-4">
            <button
              onClick={() => handleAction("ban")}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Ban Player
            </button>
            <button
              onClick={() => handleAction("dismiss")}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Dismiss Complaint
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
