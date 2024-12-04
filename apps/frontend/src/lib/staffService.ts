// src/lib/staffService.ts

import fs from "fs";
import path from "path";

const STAFF_FILE = path.join(process.cwd(), "data/staff.json");

export interface StaffMember {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "staff_admin";
  assignedComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  status: "active" | "inactive";
  createdAt: Date;
}

// Ensure the data directory and file exist
if (!fs.existsSync(path.dirname(STAFF_FILE))) {
  fs.mkdirSync(path.dirname(STAFF_FILE), { recursive: true });
}
if (!fs.existsSync(STAFF_FILE)) {
  fs.writeFileSync(STAFF_FILE, JSON.stringify([], null, 2));
}

export const getStaffList = (): StaffMember[] => {
  const data = fs.readFileSync(STAFF_FILE, "utf-8");
  return JSON.parse(data);
};

export const addStaffMember = (
  staffData: Partial<StaffMember>,
): StaffMember => {
  const staff = getStaffList();

  // Check if email already exists
  if (staff.some((s) => s.email === staffData.email)) {
    throw new Error("Email already exists");
  }

  const newStaff: StaffMember = {
    id: `staff-${Date.now()}`,
    email: staffData.email!,
    password: staffData.password!,
    name: staffData.name!,
    role: "staff_admin",
    assignedComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    status: "active",
    createdAt: new Date(),
  };

  staff.push(newStaff);
  fs.writeFileSync(STAFF_FILE, JSON.stringify(staff, null, 2));
  return newStaff;
};

export const updateStaffMember = (
  id: string,
  updates:
    | Partial<StaffMember>
    | { [K in keyof StaffMember]?: (staff: StaffMember) => StaffMember[K] },
): StaffMember => {
  const staff = getStaffList();
  const index = staff.findIndex((s) => s.email === id);

  if (index === -1) {
    throw new Error("Staff member not found");
  }

  const currentStaff = staff[index];
  const processedUpdates: Partial<StaffMember> = {};

  for (const [key, value] of Object.entries(updates)) {
    if (typeof value === "function") {
      processedUpdates[key as keyof StaffMember] = value(currentStaff);
    } else {
      processedUpdates[key as keyof StaffMember] = value;
    }
  }

  staff[index] = { ...currentStaff, ...processedUpdates };
  fs.writeFileSync(STAFF_FILE, JSON.stringify(staff, null, 2));
  return staff[index];
};

export const removeStaffMember = (id: string): void => {
  const staff = getStaffList();
  const updatedStaff = staff.filter((s) => s.email !== id);
  fs.writeFileSync(STAFF_FILE, JSON.stringify(updatedStaff, null, 2));
};
