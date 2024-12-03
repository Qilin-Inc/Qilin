// src/app/complaints/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ComplaintDetail {
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

export default function ComplaintDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaintDetails();
  }, [params.id]);

  const fetchComplaintDetails = async () => {
    try {
      const response = await fetch(`/api/complaints/${params.id}`);
      if (!response.ok) throw new Error("Complaint not found");
      const data = await response.json();
      setComplaint(data);
    } catch (error) {
      setError("Failed to fetch complaint details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!complaint) return <div>Complaint not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Complaint Details</h2>

        <div className="space-y-4">
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
              <strong>Description:</strong> {complaint.description}
            </p>
            <p>
              <strong>Status:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  complaint.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {complaint.status}
              </span>
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(complaint.createdAt).toLocaleString()}
            </p>
          </div>

          {complaint.assignedTo && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Assignment</h3>
              <p>
                <strong>Assigned To:</strong> {complaint.assignedTo}
              </p>
            </div>
          )}

          {complaint.resolution && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Resolution</h3>
              <p>
                <strong>Type:</strong> {complaint.resolution.type}
              </p>
              <p>
                <strong>Resolved At:</strong>{" "}
                {new Date(complaint.resolution.resolvedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
