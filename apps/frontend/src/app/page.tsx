"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/shared/Header";
import MainSection from "@/components/shared/MainSection";
import GamesGrid from "@/components/shared/GamesGrid";
import Footer from "@/components/shared/Footer";
import GameVideoChatRoulette from "@/components/shared/matchmakingui";
import axios from "axios";

const TrackerNetworkHomepage = () => {
  const [valoEnabled, setValoEnabled] = useState(true);
  const [valoData, setValoData] = useState<any>({});

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    const username = res.data.data.username;
    const userId = res.data.data._id;
    console.log("User details", res.data.data);
    try {
      const valoData = await axios.get(
        "http://localhost:4000/users/valorant/" + userId
      );
      // console.log("Valorant data", valoData.data);
      setValoData(valoData.data);
      setValoEnabled(false);
    } catch (error: any) {
      if (error.status === 404) {
        // console.error("Valorant not enabled");
        setValoEnabled(true);
      }
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header
        enabled={valoEnabled}
        card={valoEnabled ? "" : valoData.final.card.small}
      />
      <MainSection />
      <GamesGrid
        enabled={valoEnabled}
        setEnabled={setValoEnabled}
        setValoData={setValoData}
      />
      <Footer />
      {/* <GameVideoChatRoulette /> */}
    </div>
  );
};

export default TrackerNetworkHomepage;
