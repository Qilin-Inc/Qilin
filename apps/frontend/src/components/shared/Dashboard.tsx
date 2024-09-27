'use client'
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

const LeagueDashboard = () => {
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
    { place: 2, name: 'TenZ', stats: '92', winrate: '65%', kda: '3.1', rank: 'Immortal' },
    { place: 3, name: 'SicK', stats: '88', winrate: '63%', kda: '2.7', rank: 'Immortal' },
    { place: 4, name: 'Asuna', stats: '85', winrate: '60%', kda: '2.4', rank: 'Diamond' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isPremium, setIsPremium] = useState(false); // Control premium user access

  // Toggle premium status (for demonstration purposes)
  const togglePremium = () => setIsPremium(!isPremium);

  // Filter the leaderboard by search term
  const filteredLeaderboard = leaderboard.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      {/* Sidebar (omitted for brevity) */}
      {/* Main content */}
      <div className="flex-grow p-6">
        {/* Header (omitted for brevity) */}
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input 
            placeholder="Search" 
            className="bg-gray-800 border-none pl-10 py-6" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        {/* Premium Toggle Button */}
        <Button onClick={togglePremium} className="mb-4">
          {isPremium ? 'Switch to Free Mode' : 'Switch to Premium'}
        </Button>

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
                {/* Blurred out information for non-premium users */}
                <TableCell>{isPremium ? player.stats : <span className="blur-sm">###</span>}</TableCell>
                <TableCell>{isPremium ? player.winrate : <span className="blur-sm">###</span>}</TableCell>
                <TableCell>{isPremium ? player.kda : <span className="blur-sm">###</span>}</TableCell>
                <TableCell>{player.rank}</TableCell>
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
