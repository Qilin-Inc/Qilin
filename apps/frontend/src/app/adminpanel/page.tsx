"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import AdminPanel from "@/components/shared/AdminPanel";

interface User {
  username: string;
  role: "ADMIN" | "USER" | "MANAGER";
  email: string;
}

export default function Page() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await axios.get("/api/users/me");
      console.log(res.data);
      setUser(res.data.data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Authorizing...</p>
      ) : user && user.role === "ADMIN" ? (<AdminPanel user={user}/>) : (<div>Unauthorized</div>)}
    </div>
  );
}
