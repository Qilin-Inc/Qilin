"use client"
import { games } from "@/data/gamesData";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import axios from "axios";

const GamesGrid = () => {
  const [username, setUsername] = useState("");
  const [tag, setTag] = useState("");
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await axios.get("/api/users/me");
      const userId = res.data.data._id;
      const response = await axios.post("http://localhost:4000/users/connect", { userId, username, tag });
      console.log("Connected", response.data);
    } catch (error) {
      console.error("Failed to connect", error);
    } finally {
      setConnecting(false);
    }
  }
  return (
    <section className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4 text-white">ALL GAMES</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {games.map((game) => {
          if (game.name === "Valorant") {
            return (
              <Dialog>
                <DialogTrigger asChild>
                  <div key={game.name} className="bg-gray-800 rounded-lg p-4 text-center h-96">
                    <img src={game.image} alt={game.name} className="w-full h-80 object-cover rounded-md mb-2" />
                    <p className="text-sm text-white">{game.name}</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Connect your {game.name} account</DialogTitle>
                    <DialogDescription>
                      Connect your valorant account to show your stats to your friends!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="username"
                        defaultValue="username"
                        className="col-span-3"
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Tag
                      </Label>
                      <Input
                        id="tag"
                        defaultValue="0000"
                        className="col-span-3"
                        onChange={(e) => setTag(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleConnect} disabled={connecting}>{connecting ? "Connecting..." : "Connect"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )
          }
          else {
            return (
              <div key={game.name} className="bg-gray-800 rounded-lg p-4 text-center h-96">
                <img src={game.image} alt={game.name} className="w-full h-80 object-cover rounded-md mb-2" />
                <p className="text-sm text-white">{game.name}</p>
              </div>
            )
          }
        }
        )}
      </div>
    </section>
  )
};
export default GamesGrid;
