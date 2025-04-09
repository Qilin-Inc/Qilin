"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

export default function VerifyOTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const userId = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("userId") : null;

  if (!userId) {
    toast.error("Invalid verification link. Please check your email for the correct link.");
    router.push("/signup");
    return null;
  }

  const verifyOTP = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/email-otp-validate", { userId, otp });
      toast.success(response.data.message);

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setResendLoading(true);
      const response = await axios.post("/api/users/email-otp-resend", { userId });
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700 py-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-6 text-black">
          {loading ? "Verifying..." : "Verify OTP"}
        </h1>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-black">
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 block w-full px-4 py-2 text-black bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            onClick={verifyOTP}
            type="button"
            disabled={!otp || loading}
            className={`w-full py-2 px-4 rounded-lg transition duration-300 ${
              !otp || loading ? "bg-gray-400 text-gray-800 cursor-not-allowed" : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <button
            onClick={resendOTP}
            type="button"
            disabled={resendLoading}
            className={`w-full py-2 px-4 rounded-lg transition duration-300 ${
              resendLoading ? "bg-gray-400 text-gray-800 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}