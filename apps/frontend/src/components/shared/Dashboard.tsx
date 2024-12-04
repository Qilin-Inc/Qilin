'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, Search, Settings, Trophy, Users } from 'lucide-react';
import axios from 'axios';
import { getRankImage } from "../../helpers/rankoverlay";

// New RankCard Component
const RankCard = ({ valorank, username, wins = 0, loses = 0, rr = 410, lastMatchPoints = 16 }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate win rate
  const totalMatches = wins + loses;
  const winRate = totalMatches > 0 
    ? ((wins / totalMatches) * 100).toFixed(1) 
    : '0.0';

  return (
    <div 
      className="p-4 w-full max-w-md group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base Card */}
      <div className="relative z-0">
        <a
          href="#"
          className="flex flex-col md:flex-row items-center bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 transition-all duration-300 group-hover:border-blue-500"
        >
          {/* Rating Image */}
          <div className="flex items-center justify-center w-16 h-16 md:w-24 md:h-24">
            <img
              className="object-cover w-full h-full rounded-full"
              src={getRankImage(valorank || "Unranked")}
              alt="Player Rank"
            />
          </div>

          {/* Rating and Stats */}
          <div className="flex flex-col justify-center p-4 leading-normal text-left ml-4 flex-grow">
            <p className="text-white font-bold text-lg">{valorank || "Unranked"}</p>
            <p className="text-gray-400 text-sm">Win: {wins} Lose: {loses}</p>

            {/* Rating Progress Bar */}
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-16 h-2 bg-gray-600 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(rr / 500) * 100}%` }}
                ></div>
              </div>
              <span className="text-gray-300 text-sm">{rr}RR</span>
            </div>

            {/* Last Match Stats */}
            <p className="text-green-500 mt-2 text-sm">Last Match: +{lastMatchPoints}PTS</p>
          </div>
        </a>
      </div>

      {/* Hover Overlay */}
      {isHovered && (
        <div className="absolute inset-0 z-10 bg-black/80 rounded-lg flex items-center justify-center">
          <div className="text-center p-6">
          <div className="flex items-center space-x-4">
            <img src="https://img.icons8.com/?size=100&id=aUZxT3Erwill&format=png&color=000000" alt="Valorant Icon" className="w-12 h-12" />
            <h3 className="text-2xl font-bold text-white">{username || "Player Stats"}</h3>
          </div>
            <div className="grid grid-cols-2 gap-4 text-white">
              <div className="bg-gray-800 p-3 rounded-lg">
                <Trophy className="mx-auto mb-2 text-yellow-400" size={24} />
                <p className="text-sm text-gray-300">Win Rate</p>
                <p className="font-bold">{winRate}%</p>
              </div>
              
              <div className="bg-gray-800 p-3 rounded-lg">
                <Users className="mx-auto mb-2 text-blue-400" size={24} />
                <p className="text-sm text-gray-300">Total Matches</p>
                <p className="font-bold">{totalMatches}</p>
              </div>
            </div>

            <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              View Full Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const LeagueDashboard = () => {
  const [data, setData] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [valorank, setValorank] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/me");
      const username = res.data.data.username;
      const userId = res.data.data._id;
  
      setData(username);
      setId(userId);

    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const getvalorank = async (userId: string) => {
    try {
      const res = await axios.get(`http://localhost:4000/users/valorant/${userId}`);
      setValorank(res.data.valorantUsers.rank);
      setUsername(res.data.valorantUsers.username);
    } catch (error) {
      console.error("Error fetching Valorant rank:", error);
    }
  };

  interface Player {
    name: string;
    rank: string;
    stats: string;
    winrate: string;
    kda: string;
    place: number;
  }

  const [leaderboard, setLeaderboard] = useState<Player[]>([
    { place: 1, name: 'Shroud', stats: '98', winrate: '70%', kda: '2.5', rank: 'Radiant' },
    { place: 2, name: 'TenZ', stats: '92', winrate: '65%', kda: '3.1', rank: 'Immortal 1' },
    { place: 3, name: 'SicK', stats: '88', winrate: '63%', kda: '2.7', rank: 'Immortal 2' },
    { place: 4, name: 'Asuna', stats: '85', winrate: '60%', kda: '2.4', rank: 'Diamond 3' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  // Toggle premium status (for demonstration purposes)
  const togglePremium = () => setIsPremium(!isPremium);

  // Filter the leaderboard by search term
  const filteredLeaderboard = leaderboard.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    if (id) {
      getvalorank(id);  // Fetch rank only when the user ID is available
    }
  }, [id]);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      {/* Main content */}
      <div className="flex-grow p-6">
        {/* Player Profile Section */}
        <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-lg mb-6">
          {/* Background Image */}
          <img
            src="https://media.valorant-api.com/playercards/bb6ae873-43ec-efb4-3ea6-93ac00a82d4e/wideart.png"
            alt="Player Card Background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay Content */}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full border-2 border-white">
                <Avatar className="w-full h-full">
                  <AvatarImage src="https://media.valorant-api.com/playercards/bb6ae873-43ec-efb4-3ea6-93ac00a82d4e/smallart.png" />
                  <AvatarFallback>EF</AvatarFallback>
                </Avatar>
              </div>

              {/* User Info */}
              <div>
                <h2 className="text-2xl font-bold text-white">{ username || "Loading..."}</h2>
                <p className="text-sm text-gray-300">Welcome to the platform!</p>
                <p className="text-yellow-400 mt-1">
                  Rating: <span className="font-bold">4.8</span>
                </p>
              </div>
            </div>

            {/* Rank Overlay */}
            <div className="text-right">
              <div className="text-white text-sm">Current Rank</div>
              <div className="flex items-center mt-2">
                <img
                  src={getRankImage(valorank || "Unranked")}
                  alt={valorank || "Unranked"}
                  className="w-12 h-12"
                />
                <p className="ml-2 text-xl font-bold text-yellow-400">
                  {valorank || "Loading..."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* New RankCard Component */}
        <RankCard 
          valorank={valorank}
          username={username}
          wins={10}
          loses={5}
          rr={410}
          lastMatchPoints={16}
        />

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-800">
              <TableHead className="text-gray-400">Place</TableHead>
              <TableHead className="text-gray-400">Player name</TableHead>
              <TableHead className="text-gray-400">Total stats</TableHead>
              <TableHead className="text-gray-400">Winrate</TableHead>
              <TableHead className="text-gray-400">KDA</TableHead>
              <TableHead className="text-gray-400">Rank</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeaderboard.map((player, index) => (
              <TableRow key={index} className="bg-gray-800">
                <TableCell>{player.place}</TableCell>
                <TableCell className="font-medium">{player.name}</TableCell>
                <TableCell>{isPremium ? player.stats : <span className="blur-sm">###</span>}</TableCell>
                <TableCell>{isPremium ? player.winrate : <span className="blur-sm">###</span>}</TableCell>
                <TableCell>{isPremium ? player.kda : <span className="blur-sm">###</span>}</TableCell>
                <TableCell>
                  <img
                    src={getRankImage(player.rank)}
                    alt={player.rank}
                    className="w-8 h-8 inline-block mr-2"
                  />
                  {player.rank}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!isPremium && (
          <div className="text-center mt-6">
            <p className="text-gray-400">Unlock full stats by upgrading to a premium account!</p>
            <Button className="mt-2 bg-orange-500">Upgrade to Premium</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeagueDashboard;