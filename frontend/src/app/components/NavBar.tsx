"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

// Dummy auth hook for demonstration
function useAuth() {
  // Replace with real auth logic
  const [loggedIn, setLoggedIn] = React.useState(false);
  return {
    loggedIn,
    login: () => setLoggedIn(true),
    logout: () => setLoggedIn(false),
  };
}

export default function NavBar() {
  const { loggedIn } = useAuth();
  return (
    <div className="w-full bg-gray-100 rounded-lg mb-4">
      <nav className="px-6 py-3 flex items-center justify-between">
        {/* Left: Logo and navigation */}
        <div className="flex items-center space-x-6">
          {/* Logo and site name */}
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Image src="/wot_logo_light.png" alt="wot.id logo" width={36} height={36} priority />
            </Link>
            <span className="font-semibold text-xl text-gray-800">wot.id</span>
          </div>
          
          {/* Navigation links */}
          <div className="hidden sm:flex items-center space-x-6">
            <Link href="/message" className="text-gray-700 hover:text-gray-500 text-sm">Message</Link>
            <Link href="/transfer" className="text-gray-700 hover:text-gray-500 text-sm">Transfer</Link>
            <Link href="/trust" className="text-gray-700 hover:text-gray-500 text-sm">Trust</Link>
          </div>
        </div>
        
        {/* Right: Me or Connect */}
        <div className="flex items-center space-x-4">
          <Link href="/me" className="text-gray-700 hover:text-gray-500 text-sm">Me</Link>
          <Link href="#" className="bg-black text-white font-medium px-4 py-1.5 text-sm rounded-md">
            Connect
          </Link>
        </div>
      </nav>
    </div>
  );
}
