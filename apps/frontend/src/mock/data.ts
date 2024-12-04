import { Admin, Player, Complaint } from "@/types";

export const mockSuperAdmin = {
  id: "super-1",
  email: "super@admin.com",
  password: "super123",
  name: "Super Admin",
  role: "super_admin",
  assignedComplaints: 0,
  resolvedComplaints: 0,
  pendingComplaints: 0,
};

export const mockStaffAdmins = [
  {
    id: "staff-1",
    email: "staff1@admin.com",
    password: "staff123",
    name: "John Staff",
    role: "staff_admin",
    assignedComplaints: 15,
    resolvedComplaints: 10,
    pendingComplaints: 5,
  },
  {
    id: "staff-2",
    email: "staff2@admin.com",
    password: "staff123",
    name: "Jane Staff",
    role: "staff_admin",
    assignedComplaints: 20,
    resolvedComplaints: 15,
    pendingComplaints: 5,
  },
];

export const mockPlayers: Player[] = [
  {
    id: "player-1",
    name: "John Player",
    email: "john@player.com",
    totalMatches: 50,
    isBanned: false,
    gameSessions: [
      {
        id: "session-1",
        gameName: "Valorant",
        startTime: new Date("2024-12-02T10:00:00"),
        endTime: new Date("2024-12-02T11:30:00"),
        duration: 5400,
        teammates: [],
      },
    ],
  },
];

export const mockComplaints = [
  {
    id: "complaint-1",
    playerId: "player-1",
    playerEmail: "john@player.com",
    playerName: "John Player",
    description: "Toxic behavior in chat",
    status: "pending",
    assignedTo: "staff1@admin.com",
    createdAt: "2024-10-01",
  },
  {
    id: "complaint-2",
    playerId: "player-2",
    playerEmail: "bohn@player.com",
    playerName: "John Player",
    description: "Toxic behavior in chat",
    status: "completed",
    assignedTo: "member1@mail.com",
    createdAt: "2024-10-01",
  },
];
