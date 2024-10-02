'use client';
import localFont from "next/font/local";
import "./globals.css";
import { SocketProvider } from "../helpers/SocketProvider";
import { ClerkProvider} from '@clerk/nextjs'
import './globals.css'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
