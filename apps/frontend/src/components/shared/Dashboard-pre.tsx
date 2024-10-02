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
import { ChevronDown, Search, Settings, Trophy, Users, Loader2 } from 'lucide-react';
import axios from 'axios';

const LeagueDashboard = () => {
  // Player interface to include map, mode, queue, and platform
  interface Player {
    name: string;
    rank: string;
    stats: string;
    winrate: string;
    kda: string;
    place: number;
    map: string;      // 'map'
    mode: string;     // 'mode'
    queue: string;    // 'queue'
    platform: string; // 'platform'
  }
  
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard data from NestJS backend
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/users/me');
      const userId = res.data.data._id;
      console.log(userId);
      let puuid = await axios.get(`http://localhost:4000/users/getPUUID/${userId}`);
      puuid = puuid.data.puuid;
      const response = await axios.get(`http://localhost:4000/users/val/${puuid}`);
      
      // Map API response to the Player interface
      const playerData = response.data.data.metadata.map((player: any) => ({
        name: player.name,
        rank: player.rank,
        stats: player.stats,
        winrate: player.winrate,
        kda: player.kda,
        place: player.place,
        map: player.map,
        mode: player.mode,
        queue: player.queue,
        platform: player.platform,
      }));
      
      setLeaderboard(playerData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  // Fetch data on mount if leaderboard is empty
  useEffect(() => {
    if (leaderboard.length === 0) {
      fetchLeaderboard();
    }
  }, [leaderboard]);

  // Filter the leaderboard by search term
  const filteredLeaderboard = leaderboard.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      {/* Sidebar */}
      <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
        <div className="w-10 h-10 bg-orange-500 rounded-md flex items-center justify-center text-2xl font-bold">L</div>
        <Separator className="bg-gray-700 w-10" />
        <div className="w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center">
          <Trophy size={20} />
        </div>
        <div className="w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center">
          <Users size={20} />
        </div>
        <Separator className="bg-gray-700 w-10" />
        <ScrollArea className="flex-grow w-full">
          <div className="space-y-2 px-3">
            {['Top players', 'Lol academy', 'Rampage'].map((club, index) => (
              <div key={index} className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-xs">{club[0]}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Separator className="bg-gray-700 w-10" />
        <div className="w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center">
          <Settings size={20} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>EF</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">Edwin F.</h2>
              <p className="text-gray-400">@Top player</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-400">Leaderboard resets in</span>
            {[2, 1, 5, 2].map((num, index) => (
              <span key={index} className="bg-gray-800 px-2 py-1 rounded font-mono">{num}</span>
            ))}
          </div>
        </div>

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

        {/* Main card */}
        <Card className="bg-gray-800 border-none mb-6">
          <CardHeader className="flex flex-row justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">🔥</span>
              </div>
              <div>
                <CardTitle className="text-2xl">Inside the fire</CardTitle>
                <p className="text-sm text-gray-400 mt-1">The League of Legends Discord server in collaboration with Riot Games. Find the latest news and talk about games</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="bg-gray-700 text-gray-300">
                <Trophy size={16} className="mr-2" />
                Upgrade my data
              </Button>
              <Button variant="outline" className="bg-gray-700 text-gray-300">
                <Settings size={16} className="mr-2" />
                Edit club
              </Button>
              <Button className="bg-orange-500">
                <Users size={16} className="mr-2" />
                Invite friends
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="rank" className="mb-6">
              <TabsList className="bg-gray-700">
                <TabsTrigger value="rank">Rank</TabsTrigger>
                <TabsTrigger value="winrate">Win Rate</TabsTrigger>
                <TabsTrigger value="kda">KDA</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex justify-between mb-6">
              <Tabs defaultValue="24h">
                <TabsList className="bg-gray-700">
                  <TabsTrigger value="24h">24h</TabsTrigger>
                  <TabsTrigger value="7d">7D</TabsTrigger>
                  <TabsTrigger value="30d">30D</TabsTrigger>
                  <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Queue</span>
                <Button variant="outline" className="bg-gray-700 text-gray-300">
                  All <ChevronDown size={16} className="ml-2" />
                </Button>
                <Button variant="outline" className="bg-gray-700 text-gray-300">
                  Show my place
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loader */}
        <div><Loader2 className={`animate-spin ${loading ? 'block' : 'hidden'}`} /></div>

        {/* Table */}
        {!loading && (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-800">
                <TableHead className="text-gray-400">Place</TableHead>
                <TableHead className="text-gray-400">Player name</TableHead>
                <TableHead className="text-gray-400">Total stats</TableHead>
                <TableHead className="text-gray-400">Winrate</TableHead>
                <TableHead className="text-gray-400">KDA</TableHead>
                <TableHead className="text-gray-400">Rank</TableHead>
                <TableHead className="text-gray-400">Map</TableHead>
                <TableHead className="text-gray-400">Mode</TableHead>
                <TableHead className="text-gray-400">Queue</TableHead>
                <TableHead className="text-gray-400">Platform</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeaderboard.map((player, index) => (
                <TableRow key={index} className="bg-gray-800">
                  <TableCell>{player.place}</TableCell>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell>{player.stats}</TableCell>
                  <TableCell>{player.winrate}</TableCell>
                  <TableCell>{player.kda}</TableCell>
                  <TableCell>{player.rank}</TableCell>
                  <TableCell>{player.map}</TableCell>
                  <TableCell>{player.mode}</TableCell>
                  <TableCell>{player.queue}</TableCell>
                  <TableCell>{player.platform}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default LeagueDashboard;
