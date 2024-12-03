// src/app/players/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { mockPlayers } from "@/mock/data";

export default function PlayerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const player = mockPlayers.find((p) => p.id === params.id);

  if (!player) {
    return <div>Player not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Player Details</h2>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
            <p>
              <strong>Name:</strong> {player.name}
            </p>
            <p>
              <strong>Email:</strong> {player.email}
            </p>
            <p>
              <strong>Total Matches:</strong> {player.totalMatches}
            </p>
            <p>
              <strong>Status:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  player.isBanned
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {player.isBanned ? "Banned" : "Active"}
              </span>
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Game Sessions</h3>
          <div className="space-y-4">
            {player.gameSessions.map((session) => (
              <div key={session.id} className="border p-4 rounded-md">
                <p>
                  <strong>Game:</strong> {session.gameName}
                </p>
                <p>
                  <strong>Duration:</strong> {Math.floor(session.duration / 60)}{" "}
                  minutes
                </p>
                <p>
                  <strong>Start Time:</strong>{" "}
                  {new Date(session.startTime).toLocaleString()}
                </p>
                <p>
                  <strong>End Time:</strong>{" "}
                  {new Date(session.endTime).toLocaleString()}
                </p>
                <div className="mt-2">
                  <strong>Teammates:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {session.teammates.map((teammate) => (
                      <li key={teammate.id}>{teammate.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
