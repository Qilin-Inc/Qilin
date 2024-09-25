"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


export default function SignupPage() {
  const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        username: "",
        password: "",
    });
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const onSignup = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/users/signup", user);
        console.log("Signup success", response.data);
        router.push("/");
      } catch (error: any) {
        console.log("Signup failed", error.message);
      } finally {
        setLoading(false);
      }
    }

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700 py-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
            <h1>{loading ? "Processing" : "Signup"}</h1>
            <h1 className="text-4xl font-bold text-center mb-6 text-black">Signup</h1>
            <form onSubmit={onSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">Email</label>
                <input
                id="email"
                  type="email"
                  placeholder="Email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 text-black bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Username</label>
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={user.username}
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 text-black bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 text-black bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300"
              >
                {buttonDisabled ? "No Signup" : "Signup"}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-indigo-500 hover:underline"
        >
          Login here
        </Link>
      </p>
          </div>
        </div>
      );
      
}

