"use client";
import localFont from "next/font/local";
import "./globals.css";
import { SocketProvider } from "../helpers/SocketProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  async function checkBanStatus() {
  const user = await axios.get("/api/users/me");
  if(user.data.data && user.data.data.isBanned === true) {
    return router.replace("/banned");
  }
  }

  useEffect(() => {
    checkBanStatus();
  })
  return (
    <html lang="en">
        <head>
          <title>Qilin: Find your perfect gaming partner today!</title>
        </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SocketProvider>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
