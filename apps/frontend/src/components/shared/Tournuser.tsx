"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPin, Plus, Search } from "lucide-react";
import { CreateTournamentForm } from "./CreateTournament";
import { format } from "date-fns";

const initialTournaments = [
  {
    id: 1,
    name: "Summer Badminton Championship",
    status: "Open",
    game: "Badminton Singles",
    location: "Badminton World Federation, Kuala Lumpur, Malaysia",
    startDate: "4/19/2024",
    endDate: "12/30/2024",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 2,
    name: "Winter Tournament Series",
    status: "Closed",
    game: "Badminton Doubles",
    location: "Badminton World Federation, Kuala Lumpur, Malaysia",
    startDate: "4/19/2024",
    endDate: "12/30/2024",
    image: "/placeholder.svg?height=200&width=400",
  },
];

export default function TournamentAdminDashboard() {
  const [tournaments, setTournaments] = useState(initialTournaments);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateTournament = (data: any) => {
    const newTournament = {
      id: tournaments.length + 1,
      ...data,
      status: "Open",
      image: "/placeholder.svg?height=200&width=400",
      startDate: format(data.startDate, "yyyy-MM-dd"),
      endDate: format(data.endDate, "yyyy-MM-dd"),
    };
    setTournaments([...tournaments, newTournament]);
  };

  const filteredTournaments = tournaments.filter(
    (tournament) =>
      tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tournaments, leagues, players"
            className="pl-10 bg-neutral-800 border-neutral-700 text-neutral-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Entered Tournaments</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTournaments.map((tournament) => (
          <Card
            key={tournament.id}
            className="overflow-hidden bg-neutral-800 text-white border-neutral-700"
          >
            <CardHeader className="p-0">
              <div className="relative">
                <img
                  src="https://i.ytimg.com/vi/AeB30KOq1MQ/maxresdefault.jpg"
                  alt={tournament.name}
                  className="w-full h-48 object-cover"
                />
                <Badge
                  className={`absolute top-4 right-4 ${
                    tournament.status === "Open"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {tournament.status === "Open" ? "Not Joined" : "Joined"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{tournament.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <MapPin className="mr-2 h-4 w-4" />
                {tournament.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(new Date(tournament.startDate), "MMM d, yyyy")} to{" "}
                {format(new Date(tournament.endDate), "MMM d, yyyy")}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                variant="outline"
                className="w-full border-neutral-700 text-neutral-200 bg-neutral-600 hover:bg-neutral-300"
                onClick={() => {
                  setTournaments(
                    tournaments.map((t) =>
                      t.id === tournament.id
                        ? {
                            ...t,
                            status: t.status === "Open" ? "Closed" : "Open",
                          }
                        : t
                    )
                  );
                }}
              >
                {tournament.status === "Open"
                  ? "Join Tournament"
                  : "Leave Tournament"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
