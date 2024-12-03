// src/app/players/page.tsx

"use client";

import { useState } from "react";
import { mockPlayers } from "@/mock/data";
import Link from "next/link";

export default function PlayersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlayers = mockPlayers.filter(
    (player) =>
      player.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Players</h2>
        <div className="w-64">
          <input
            type="text"
            placeholder="Search players..."
            className="w-full p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total Matches
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPlayers.map((player) => (
              <tr key={player.id}>
                <td className="px-6 py-4">{player.name}</td>
                <td className="px-6 py-4">{player.email}</td>
                <td className="px-6 py-4">{player.totalMatches}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      player.isBanned
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {player.isBanned ? "Banned" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/dashboard/players/${player.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
