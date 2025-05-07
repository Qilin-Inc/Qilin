"use client";
import RadialChart from "@/components/shared/RadialChart";
import AreaChartGradient from "./AreaChartGradient";
import { TableDemo } from "./DataTable";
import axios from "axios";
import { useEffect, useState } from "react";
export default function AdminPanel({ user }: { user: any }) {
  const [players, setPlayers] = useState<number>(0);
  const [tournaments, setTournaments] = useState<number>(0);
  const [banned, setBanned] = useState<number>(0);
  const [footfall, setFootfall] = useState<number>(0);
  const [users, setUsers] = useState<any[]>([]);

  const date = new Date();
  const apiURL = process.env.NEXT_PUBLIC_BACKEND;

  const api = axios.create({
    baseURL: apiURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  interface ApiResponse {
    data: {
      users: number;
      tournaments: number;
      banned: number;
      footfall: number;
    };
  }

  useEffect(() => {
    api.get('/dashboard/info')
      .then((response: ApiResponse) => {
        console.log(response.data);
        setPlayers(response.data.users);
        setTournaments(response.data.tournaments);
        setBanned(response.data.banned);
        setFootfall(response.data.footfall);
      });
    api.get('/dashboard/users').then((response: any) => {
      console.log(response.data);
      setUsers(response.data.users);
    });
  }, [])



  return (
    <div className="w-full h-full min-h-[100vh] bg-gray-200">
      <div className="container mx-auto">
        <div className="pt-8 pb-4 font-bold text-xl">
          Admin Panel
        </div>
        <div className="w-full flex gap-8">
          <div>
            <div className="font-semibold text-xl">
              Welcome, {user.username} 🎉
            </div>
            <div className="text-gray-700">
              All of the infomatics regarding users, their ban status and reports upto {date.toString().split(" ").slice(0, 4).join(" ")} will be displayed here. These activites are managed by the HR or the devOps team. <span className="text-orange-500">Learn More </span>
            </div>
          </div>
          <div>
            <div className="w-full h-20 bg-white rounded-xl shadow-black drop-shadow p-2 flex">
              {/* <div className="flex flex-col items-center justify-center h-full border-r border-r-gray-400 px-8">
                <div>
                  200
                </div>
                <div className="text-gray-600">
                  Users
                </div>
              </div> */}
              <div className="flex flex-col items-center justify-center h-full border-r border-r-gray-400 px-8">
                <div>
                  {players}
                </div>
                <div className="text-gray-600">
                  Players
                </div>
              </div>
              <div className="flex flex-col items-center justify-center h-full px-8">
                <div>
                  {tournaments}
                </div>
                <div className="text-gray-600">
                  Tournaments
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="grid grid-cols-4 gap-6">
            {/* Total Employee */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex">
                <div>
                  <h3 className="text-gray-600 text-lg font-semibold">Total Players</h3>
                  <p className="text-3xl font-bold">{players}</p>
                </div>
                <RadialChart numbers={players} tag="players" rotation={(players / 50) * 360} />
              </div>
              <p className="text-purple-500 mt-2">6% Increase This Month</p>
            </div>
            {/* Total Application */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex">
                <div>
                  <h3 className="text-gray-600 text-lg font-semibold">Total Tourneys</h3>
                  <p className="text-3xl font-bold">{tournaments}</p>
                </div>
                <RadialChart numbers={tournaments} tag="tourneys" rotation={tournaments * 20} />
              </div>
              <p className="text-purple-500 mt-2">1% Increase This Month</p>
            </div>
            {/* Application Received Chart */}
            <div className="bg-white shadow-lg rounded-lg p-6 col-span-2 row-span-2 h-full">
              <h3 className="text-gray-600 text-lg font-semibold mb-4">Users and Tournaments Active</h3>
              {/* Replace with a chart library */}
              <AreaChartGradient user={players} tournament={tournaments} />
            </div>
            {/* Hired Candidates */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex">
                <div>
                  <h3 className="text-gray-600 text-lg font-semibold">Average Footfall</h3>
                  <p className="text-3xl font-bold">{footfall}</p>
                </div>
                <RadialChart numbers={Number(footfall)} tag="footfall" rotation={Number(footfall) * 10} />
              </div>
              <p className="text-purple-500 mt-2">19% Increase This Month</p>
            </div>

            {/* Rejected Candidates */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-gray-600 text-lg font-semibold">Banned Players</h3>
                  <p className="text-3xl font-bold">{banned}</p>
                </div>
                <RadialChart numbers={banned} tag="banned" rotation={Number(banned) * 10} />
              </div>
              <p className="text-red-500 mt-2">16% Increase This Month</p>
            </div>

          </div>
        </div>
        <div className="w-full py-5">
          <TableDemo users={users} />
        </div>
      </div>
    </div>
  );
}
