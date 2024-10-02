"use client";
import { SignIn } from "@clerk/nextjs";
import React from "react";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700 py-6">
                <SignIn />
        </div>
    );
}

