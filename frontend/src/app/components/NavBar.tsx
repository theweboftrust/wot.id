"use client";
import React from "react";
import Link from "next/link";

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
    <nav className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 shadow">
      {/* Left: Logo and navigation */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <img src="/wot_logo_light.png" alt="wot.id logo" className="w-8 h-8 dark:hidden" />
          <img src="/wot_logo_dark.png" alt="wot.id logo" className="w-8 h-8 hidden dark:block" />
        </Link>
        <span className="font-bold text-lg tracking-tight">wot.id</span>
        <Link href="/message" className="ml-4 font-medium hover:underline">Message</Link>
        <Link href="/transfer" className="ml-2 font-medium hover:underline">Transfer</Link>
        <Link href="/trust" className="ml-2 font-medium hover:underline">Trust</Link>
      </div>
      {/* Right: Me or Connect */}
      <div className="flex items-center gap-4">
        {loggedIn ? (
          <Link href="/me" className="font-medium hover:underline">Me</Link>
        ) : (
          <button className="px-4 py-1 rounded bg-primary text-white font-medium" onClick={() => alert('Connect logic goes here')}>Connect</button>
        )}
      </div>
    </nav>
  );
}
