// src/lib/complaintService.ts

import fs from "fs";
import path from "path";
import { updateStaffMember } from "./staffService";

const COMPLAINTS_FILE = path.join(process.cwd(), "data/complaints.json");

export interface Complaint {
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

// Initialize file if it doesn't exist
if (!fs.existsSync(COMPLAINTS_FILE)) {
  fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify([], null, 2));
}

export const getComplaints = (): Complaint[] => {
  const data = fs.readFileSync(COMPLAINTS_FILE, "utf-8");
  return JSON.parse(data);
};

export const getComplaint = (id: string): Complaint | null => {
  const complaints = getComplaints();
  return complaints.find((c) => c.id === id) || null;
};

export const addComplaint = (complaintData: Partial<Complaint>): Complaint => {
  const complaints = getComplaints();
  const newComplaint: Complaint = {
    id: `complaint-${Date.now()}`,
    playerName: complaintData.playerName!,
    playerEmail: complaintData.playerEmail!,
    description: complaintData.description!,
    status: "pending",
    assignedTo: null,
    createdAt: new Date().toISOString(),
  };

  complaints.push(newComplaint);
  fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(complaints, null, 2));
  return newComplaint;
};

export const assignComplaint = async (
  complaintId: string,
  staffEmail: string,
): Promise<Complaint> => {
  const complaints = getComplaints();
  const complaintIndex = complaints.findIndex((c) => c.id === complaintId);

  if (complaintIndex === -1) {
    throw new Error("Complaint not found");
  }

  complaints[complaintIndex].assignedTo = staffEmail;
  fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(complaints, null, 2));

  // Update staff member's assigned complaints count
  await updateStaffMember(staffEmail, {
    assignedComplaints: (staff) => staff.assignedComplaints + 1,
  });

  return complaints[complaintIndex];
};

export const resolveComplaint = async (
  complaintId: string,
  resolution: "ban" | "dismiss",
): Promise<Complaint> => {
  const complaints = getComplaints();
  const complaintIndex = complaints.findIndex((c) => c.id === complaintId);

  if (complaintIndex === -1) {
    throw new Error("Complaint not found");
  }

  const complaint = complaints[complaintIndex];

  if (complaint.assignedTo) {
    // Update staff member's statistics
    await updateStaffMember(complaint.assignedTo, {
      resolvedComplaints: (staff) => staff.resolvedComplaints + 1,
      pendingComplaints: (staff) => staff.pendingComplaints - 1,
    });
  }

  complaint.status = "resolved";
  complaint.resolution = {
    type: resolution,
    resolvedAt: new Date().toISOString(),
  };

  fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(complaints, null, 2));
  return complaint;
};
