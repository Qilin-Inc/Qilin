// src/lib/playerService.ts

import fs from "fs";
import path from "path";

const PLAYERS_FILE = path.join(process.cwd(), "data/players.json");

export interface Player {
  id: string;
  name: string;
  email: string;
  totalMatches: number;
  isBanned: boolean;
  createdAt: string;
  gameSessions: GameSession[];
}

export interface GameSession {
  id: string;
  gameName: string;
  duration: number;
  startTime: string;
  endTime: string;
  teammates: { id: string; name: string }[];
}

if (!fs.existsSync(PLAYERS_FILE)) {
  fs.writeFileSync(PLAYERS_FILE, JSON.stringify([], null, 2));
}

export const getPlayers = (): Player[] => {
  const data = fs.readFileSync(PLAYERS_FILE, "utf-8");
  return JSON.parse(data);
};

export const getPlayer = (id: string): Player | null => {
  const players = getPlayers();
  return players.find((p) => p.id === id) || null;
};

export const updatePlayer = (id: string, updates: Partial<Player>): Player => {
  const players = getPlayers();
  const index = players.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new Error("Player not found");
  }

  players[index] = { ...players[index], ...updates };
  fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2));
  return players[index];
};

export const banPlayer = (id: string): Player => {
  return updatePlayer(id, { isBanned: true });
};
