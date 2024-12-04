// src/app/complaints/assign/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "@/lib/auth";

export default function AssignComplaintPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const user = getAuth();
  const [complaint, setComplaint] = useState<any>(null);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "super_admin") {
      router.push("/dashboard");
      return;
    }

    // Fetch complaint details
    fetch(`/api/complaints/${params.id}`)
      .then((res) => res.json())
      .then((data) => setComplaint(data))
      .catch(() => setError("Failed to fetch complaint"));

    // Fetch staff list
    fetch("/api/staff")
      .then((res) => res.json())
      .then((data) => setStaffList(data))
      .catch(() => setError("Failed to fetch staff list"));
  }, []);

  const handleAssign = async () => {
    try {
      const response = await fetch(`/api/complaints/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffEmail: selectedStaff }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign complaint");
      }
      alert(
        `Successfully assigned complaint.\n Complain ID: ${params.id},\n Assigned to: ${selectedStaff}`,
      );
      router.push("/admin/dashboard/complaints");
    } catch (error) {
      setError("Failed to assign complaint");
    }
  };

  if (!complaint) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Assign Complaint</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-[#383836] rounded-3xl shadow-md p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Complaint Details</h3>
          <p>
            <strong>Player:</strong> {complaint.playerName}
          </p>
          <p>
            <strong>Email:</strong> {complaint.playerEmail}
          </p>
          <p>
            <strong>Description:</strong> {complaint.description}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Assign to Staff Member
          </label>
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="w-full p-2 rounded-3xl bg-[#21211D]"
            required
          >
            <option value="">Select Staff Member</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.email}>
                {staff.name} ({staff.email})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedStaff}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
          >
            Assign Complaint
          </button>
        </div>
      </div>
    </div>
  );
}
