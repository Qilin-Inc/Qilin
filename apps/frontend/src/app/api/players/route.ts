// src/app/api/players/route.ts

import { NextResponse } from "next/server";
import { getPlayers } from "@/lib/playerService";

export async function GET() {
  try {
    const players = getPlayers();
    return NextResponse.json(players);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 },
    );
  }
}
