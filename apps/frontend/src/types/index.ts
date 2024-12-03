// src/types/index.ts

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "staff_admin";
  assignedComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
}

export interface Player {
  id: string;
  name: string;
  email: string;
  gameSessions: GameSession[];
  totalMatches: number;
  isBanned: boolean;
}

export interface GameSession {
  id: string;
  gameName: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  teammates: Player[];
}

export interface Complaint {
  id: string;
  playerId: string;
  playerEmail: string;
  playerName: string;
  description: string;
  status: "pending" | "resolved";
  assignedTo?: string;
  resolution?: {
    action: "banned" | "dismissed";
    timestamp: Date;
    adminEmail: string;
  };
  createdAt: Date;
}
