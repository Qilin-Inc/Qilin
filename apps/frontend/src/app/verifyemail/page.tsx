"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [error, setError] = useState(false);
  const [verified, setVerified] = useState(false);

  const verifyUserEmail = async () => {
    try {
      const response = await axios.post("/api/users/verifyemail", { token });
      console.log(response.data);
      setVerified(true);
      toast.success("Email verified successfully! You can now log in.");
    } catch (error: any) {
      console.log(error.response?.data || "Verification failed.");
      setError(true);
      toast.error(error.response?.data?.message || "Failed to verify email.");
    }
  };

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Verify Email</h1>
      {verified && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Email verified successfully!
          </h2>
          <Link href="/login">
            <a className="text-indigo-500 hover:underline">Go to Login</a>
          </Link>
        </div>
      )}
      {error && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Failed to verify email.
          </h2>
          <p>Please try again or contact support if the issue persists.</p>
        </div>
      )}
    </div>
  );
}
