// src/app/players/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Player {
  id: string;
  name: string;
  email: string;
  totalMatches: number;
  isBanned: boolean;
  createdAt: string;
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch("/api/players");
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      setError("Failed to fetch players");
    } finally {
      setLoading(false);
    }
  };

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Players Management</h2>
        <div className="w-64">
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      <div className="bg-[#383836] rounded-3xl shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-[#21211D]">
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
          <tbody className="divide-y divide-[#21211D]">
            {filteredPlayers.map((player) => (
              <tr key={player.id}>
                <td className="px-6 py-4 whitespace-nowrap">{player.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{player.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {player.totalMatches}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                <td className="px-6 py-4 whitespace-nowrap">
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
