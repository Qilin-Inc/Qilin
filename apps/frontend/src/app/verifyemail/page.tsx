"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

export default function VerifyEmailPage(){
    const [token, setToken] = useState("");
    const [error, setError] = useState(false);
    const [verified, setVerified] = useState(false);

    const verifyUserEmail = async () => {
        try {
            const response = await axios.post("/api/users/verifyemail", {token});
            console.log(response.data);
            setVerified(true);
        } catch (error: any) {
            console.log(error.response.data);
            setError(true);
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split('=')[1];
        setToken(urlToken || "");
    }, []);

    useEffect(() => {
        if(token.length > 0){
            verifyUserEmail();
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold">Verify Email</h1>
            {verified && (
                <div>
                    <h2 className="text-2xl font-bold">Email verified successfully</h2>
                    <Link href="/login"></Link>
                </div>
            )}
            {error && (
                <div>
                    <h2 className="text-2xl font-bold">Error</h2>
                </div>
            )}
        </div>
    ) 
}
