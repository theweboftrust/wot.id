"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ConnectButton, useCurrentAccount } from '@iota/dapp-kit';
import { useSession, signIn, signOut } from 'next-auth/react'; // Import NextAuth hooks

export default function NavBar() {
  const { data: session, status: authStatus } = useSession(); // Get NextAuth session status and data
  const iotaAccount = useCurrentAccount(); // Get IOTA DApp Kit account

  return (
    <div className="w-full bg-gray-100 rounded-lg mb-4">
      <nav className="px-6 py-3 flex items-center justify-between">
        {/* Left: Logo and navigation (UNMODIFIED) */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Image src="/wot_logo_light.png" alt="wot.id logo" width={36} height={36} priority />
            </Link>
            <span className="font-semibold text-xl text-gray-800">wot.id</span>
          </div>
          <div className="hidden sm:flex items-center space-x-6">
            <Link href="/message" className="text-gray-700 hover:text-gray-500 text-sm">Message</Link>
            <Link href="/transfer" className="text-gray-700 hover:text-gray-500 text-sm">Transfer</Link>
            <Link href="/trust" className="text-gray-700 hover:text-gray-500 text-sm">Trust</Link>
          </div>
        </div>
        
        {/* Right: Auth, Wallet, and Me link */}
        <div className="flex items-center space-x-4">
          {/* NextAuth: Sign In button or User Info + Sign Out button */}
          {authStatus === 'loading' && (
            <span className="text-sm text-gray-500">Loading Auth...</span>
          )}
          {authStatus === 'unauthenticated' && (
            <button 
              onClick={() => signIn()} // Default signIn will show available providers
              className="bg-black text-white font-medium px-4 py-1.5 text-sm rounded-md"
            >
              Sign in
            </button>
          )}
          {authStatus === 'authenticated' && session?.user && (
            <>
              <span className="text-sm text-gray-700" title={session.user.email || ''}>
                {session.user.name || session.user.email?.split('@')[0]} 
              </span>
              <button 
                onClick={() => signOut()} 
                className="text-gray-700 hover:text-gray-500 text-sm"
              >
                Sign out
              </button>
            </>
          )}

          {/* Separator if NextAuth is authenticated and IOTA elements follow */}
          {authStatus === 'authenticated' && (
             <div className="border-l border-gray-300 h-6"></div>
          )}

          {/* IOTA Wallet Address (if connected) */}
          {iotaAccount && (
            <span className="text-xs text-gray-500" title={iotaAccount.address}>
              {`${iotaAccount.address.substring(0, 6)}...${iotaAccount.address.substring(iotaAccount.address.length - 4)}`}
            </span>
          )}
          {/* IOTA Connect/Disconnect Button (always visible) */}
          <ConnectButton />
          
          {/* "Me" Link (always visible for now, as per original structure) */}
          <Link href="/me" className="text-gray-700 hover:text-gray-500 text-sm">Me</Link>
        </div>
      </nav>
    </div>
  );
}
