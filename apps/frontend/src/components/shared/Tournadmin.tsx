"use client";

import { useEffect, useState } from "react";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPin, Plus, Search } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import { CreateTournamentForm } from "./CreateTournament";
const apiUrl = process.env.NEXT_PUBLIC_BACKEND
const api = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});

type Tournament = {
  id: string;
  name: string;
  game: string;
  location?: string;
  startDate: string;
  endDate: string;
  status: "OPEN" | "CLOSED";
  ownerId: string;
  playerIds: string[];
  image?: string;
  owner?: { id: string; name: string };
  players?: any[];
};

export default function TournamentAdminDashboard() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] =
    useState<Tournament | null>(null);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/users/me", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.message === "User found") {
        setCurrentUserId(data.data._id);
        setUserRole(data.data.role);
      } else {
        setError("Failed to fetch user data");
      }
    } catch (error) {
      setError("Failed to authenticate user");
    }
  };

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tournament");
      if (res.data.success) {
        setTournaments(res.data.tournaments);
      } else {
        setError("Failed to fetch tournaments");
      }
    } catch (error) {
      setError("Failed to connect to the tournament service");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTournament = async (data: any) => {
    if (!currentUserId)
      return { success: false, error: "User not authenticated" };

    try {
      const tournamentData = {
        ...data,
        ownerId: currentUserId,
        playerIds: [],
        status: "OPEN",
      };

      const res = await api.post("/tournament/create", tournamentData);
      if (res.data.success) {
        fetchTournaments();
        return { success: true };
      } else {
        return { success: false, error: res.data.message };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create tournament",
      };
    }
  };

  const handleJoinTournament = async (tournamentId: string) => {
    if (!currentUserId) return false;
    try {
      const res = await api.post(`/tournament/join/${tournamentId}`, {
        userId: currentUserId,
      });
      if (res.data.success) {
        fetchTournaments();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const handleToggleStatus = async (
    tournamentId: string,
    currentStatus: "OPEN" | "CLOSED"
  ) => {
    if (!currentUserId) return false;

    try {
      const tournament = tournaments.find((t) => t.id === tournamentId);
      if (!tournament || tournament.ownerId !== currentUserId) return false;

      const newStatus = currentStatus === "OPEN" ? "CLOSED" : "OPEN";
      const res = await api.post(`/tournament/status/toggle/${tournamentId}`, {
        userId: currentUserId,
        status: newStatus,
      });

      if (res.data.success) {
        fetchTournaments();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const handleConfirmDelete = async () => {
    if (!tournamentToDelete || !currentUserId) return;

    try {
      const res = await api.delete(
        `/tournament/delete/${tournamentToDelete.id}`,
        {
          data: { userId: currentUserId },
        }
      );

      if (res.data.success) {
        fetchTournaments();
        setDeleteDialogOpen(false);
        setTournamentToDelete(null);
      } else {
        console.error("Delete failed:", res.data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const isOwner = (tournament: Tournament) =>
    currentUserId ? tournament.ownerId === currentUserId : false;

  const hasJoinedTournament = (tournament: Tournament) =>
    currentUserId ? tournament.playerIds?.includes(currentUserId) : false;

  const canCreateTournament = () =>
    userRole === "MANAGER" || userRole === "ADMIN";

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) fetchTournaments();
  }, [currentUserId]);

  const filteredTournaments = tournaments.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && tournaments.length === 0 && !currentUserId) {
    return (
      <div className="p-6 text-center">
        Loading user data and tournaments...
      </div>
    );
  }

  if (error && tournaments.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error}</p>
        <Button
          onClick={() => {
            fetchCurrentUser();
            fetchTournaments();
          }}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tournaments by name or game"
            className="pl-10 bg-neutral-800 border-neutral-700 text-neutral-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {canCreateTournament() && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="ml-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Tournament
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 text-white">
              <DialogHeader>
                <DialogTitle>Create Tournament</DialogTitle>
              </DialogHeader>
              <CreateTournamentForm onSubmit={handleCreateTournament} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-6">All Tournaments</h2>

      {filteredTournaments.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No tournaments found. Create one to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => {
            const joined = hasJoinedTournament(tournament);
            const isTournamentOwner = isOwner(tournament);

            return (
              <Card
                key={tournament.id}
                className="bg-neutral-800 text-white border-neutral-700"
              >
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={
                        tournament.image ??
                        "https://i.ytimg.com/vi/AeB30KOq1MQ/maxresdefault.jpg"
                      }
                      alt={tournament.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <Badge
                        className={
                          tournament.status === "OPEN"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        }
                      >
                        {tournament.status}
                      </Badge>
                      {joined && (
                        <Badge className="bg-blue-500 hover:bg-blue-600">
                          Joined
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {tournament.name}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="mr-2 h-4 w-4" />
                    {tournament.game || "Game N/A"}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(
                      new Date(tournament.startDate),
                      "MMM d, yyyy"
                    )} to {format(new Date(tournament.endDate), "MMM d, yyyy")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Players: {tournament.playerIds?.length || 0}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex flex-col space-y-2">
                  {!joined &&
                    tournament.status === "OPEN" &&
                    userRole === "USER" && (
                      <Button
                        variant="outline"
                        className="w-full border-neutral-700 text-neutral-200 bg-neutral-600 hover:bg-neutral-500"
                        onClick={() => handleJoinTournament(tournament.id)}
                      >
                        Join Tournament
                      </Button>
                    )}

                  {isTournamentOwner && (
                    <>
                      <Button
                        variant={
                          tournament.status === "OPEN"
                            ? "destructive"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() =>
                          handleToggleStatus(tournament.id, tournament.status)
                        }
                      >
                        {tournament.status === "OPEN"
                          ? "Close Tournament"
                          : "Open Tournament"}
                      </Button>

                      {(userRole === "MANAGER" || userRole === "ADMIN") && (
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => {
                            setTournamentToDelete(tournament);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          Delete Tournament
                        </Button>
                      )}
                    </>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-neutral-900 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the tournament "
            {tournamentToDelete?.name}"?
          </p>
          <div className="flex justify-end space-x-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
