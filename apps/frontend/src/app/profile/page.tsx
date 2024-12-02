"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      router.push("/login");
    } catch (error: any) {
      toast.error(
        "Login failed: " + error.response?.data?.error || error.message
      );
      console.log(error.message);
    }
  };

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    console.log(res.data);
    setData(res.data.data._id);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6">
      <h1 className="text-4xl font-bold">Profile</h1>
      <hr />
      <p>Profile page</p>
      <h2>
        {data === null ? (
          "Nothing"
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h2>
      <hr />
      <button
        onClick={() => {
          logout();
        }}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        Logout
      </button>
      <button
        onClick={() => {
          getUserDetails();
        }}
        className="bg-green-500 mt-4 hover:bg-green-700 text-white px-4 py-2 rounded-md"
      >
        Get User Details
      </button>
    </div>
  );
}
