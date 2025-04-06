"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { getRankImage } from "@/helpers/rankoverlay";
import QilingLogo from "../../assets/Qilin_brand.jpeg";
import { useRouter } from "next/navigation";

const PlayerDashboard = () => {
  const [valoData, setValoData] = useState<any>({});
  const [userData, setUserData] = useState<any>({});
  const [matchmadeData, setMatchmadeData] = useState<any>([]);
  const [tournaments, setTournaments] = useState<any>([]);
  const router = useRouter();

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    const userId = res.data.data._id;
    console.log("User details", res.data.data);
    setUserData(res.data.data);
    try {
      const valoData = await axios.get(
        "http://localhost:4000/users/valorant/" + userId
      );
      const matchmadeUsers = await axios.get(
        "http://localhost:4000/users/matchmaking/" + userId
      );
      console.log(matchmadeUsers.data);
      setValoData(valoData.data.final);
      setMatchmadeData(matchmadeUsers.data.updatedUsers);
      if (res.data.data.TournamentsJoinedIds) {
        res.data.data.TournamentsJoinedIds.map((tournamentId: any) => {
          axios
            .get(`http://localhost:4000/tournament/${tournamentId}`)
            .then((res) => {
              console.log(res.data);
              setTournaments([...tournaments, res.data.tournament]);
            });
        });
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="bg-neutral-900 text-neutral-50 min-h-screen rounded-lg shadow-lg flex">
      {/* Sidebar */}
      <aside className="w-32 bg-primary-950 flex flex-col items-center py-5 gap-4 hidden md:flex">
        <button className="w-12 h-12 rounded-full bg-primary-500 flex justify-center items-center transition duration-300 hover:scale-105">
          <span className="material-symbols-outlined text-neutral-50">
            Menu
          </span>
        </button>
        <div className="flex flex-col gap-4">
          {["Home"].map((icon, idx) => (
            <button
              key={idx}
              className="w-24 h-12 bg-neutral-800 rounded-md flex justify-center items-center transition duration-300 hover:bg-primary-500"
              onClick={() => {
                router.push("/");
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-primary-500 font-title text-2xl">
            Valorant LFT Matcher
          </h1>
          <div className="flex items-center gap-4">
            <img src={QilingLogo.src} width={100} height={200} />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="bg-neutral-800 rounded-lg p-4 flex items-center transition duration-300 hover:shadow-lg">
              <img
                src={valoData.card ? valoData.card.small : ""}
                width="80"
                height="80"
                className="object-contain"
                alt="avatar"
              />
              <div className="ml-4">
                <h2 className="text-lg font-semibold">{userData.username}</h2>
                <p className="text-sm text-neutral-400">{valoData.mmr} MMR</p>
              </div>
            </div>

            {/* My Team Section */}
            <div className="bg-neutral-800 rounded-lg p-4 flex items-center transition duration-300 hover:shadow-lg">
              <img
                src={getRankImage(valoData.rank || "Unranked")}
                width="80"
                height="80"
                className="object-contain"
                alt={valoData.rank || "Unranked"}
              />
              <div className="ml-4">
                <h2 className="text-lg font-semibold">{valoData.rank}</h2>
                <p className="text-sm text-neutral-400">{valoData.mmr} MMR</p>
              </div>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4 px-8 flex justify-between items-center">
              <div>
                <h2 className="font-bold">
                  {valoData.username}{" "}
                  <span className="font-normal text-sm text-neutral-400">
                    #{valoData.tag}
                  </span>
                </h2>
              </div>
              <div>
                <img
                  src={
                    "https://seeklogo.com/images/V/valorant-logo-FAB2CA0E55-seeklogo.com.png"
                  }
                  height={40}
                  width={40}
                />
              </div>
            </div>

            {/* Image Banner */}
            <div className="bg-neutral-800 rounded-lg">
              <div
                style={{
                  width: "100%",
                  height: "180px",
                  backgroundImage: `url(${valoData.card ? valoData.card.wide : "https://tools-api.webcrumbs.org/image-placeholder/800/400/nature/1"})`,
                  backgroundSize: "cover",
                }}
                className="rounded-lg transition duration-300 hover:scale-105"
              ></div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Rankings */}
            <div className="bg-neutral-800 rounded-lg p-6 text-center transition duration-300 hover:shadow-lg">
              <h4 className="font-bold">Matchmaking</h4>
              <ul className="divide-y divide-neutral-700 mt-4">
                {matchmadeData.map((user, i) => (
                  <li
                    key={i}
                    className="py-2 flex justify-between transition duration-300 hover:bg-neutral-700 cursor-pointer"
                    onClick={() => {
                      router.push("/chat?id=" + userData._id);
                    }}
                  >
                    <span className="text-neutral-200">
                      {i + 1}. {user.name}
                    </span>
                    <span className="text-primary-500 flex gap-2 items-start justify-center">
                      <div className="text-neutral-400">
                        {user.username} #{user.tag}
                      </div>
                      <img
                        src={getRankImage(user.rank)}
                        width={20}
                        height={20}
                        className="flex-shrink-0"
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Feed */}
            <div className="bg-neutral-800 rounded-lg p-6 text-center transition duration-300 hover:shadow-lg">
              <h4 className="font-bold">Tournaments</h4>
              <ul className="divide-y divide-neutral-700 mt-4">
                {tournaments.map((tournament, i) => (
                  <li
                    key={i}
                    className="py-2 flex justify-between transition duration-300 hover:bg-neutral-700 cursor-pointer"
                    onClick={() => {
                      router.push("/tournaments");
                    }}
                  >
                    <span className="text-neutral-200">{tournament.name}</span>
                    <span className="material-symbols-outlined text-neutral-500">
                      {tournament.game}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Active Players */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;
