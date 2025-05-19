"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  // Set up state for connect button
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Handle connect button click
  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      // In the future, this would initiate actual connection flow
    }, 1000);
  };

  return (
      <div className="flex-grow flex items-center justify-center w-full py-12">
        <div className="max-w-md mx-auto text-center">
          {/* Logo */}
          <div className="mb-6">
            <Image 
              src="/wot_logo_light.png" 
              alt="wot.id fingerprint logo" 
              width={120} 
              height={120} 
              priority 
              className="mx-auto"
            />
          </div>
          
          {/* Headings */}
          <h1 className="text-3xl font-bold mb-2">Just me</h1>
          <h3 className="text-lg mb-8 text-gray-700">Human Identity on the Web of Trust</h3>
          
          {/* Connect Button */}
          <Link 
            href="#"
            className="bg-black text-white font-medium py-2 px-10 rounded-md mb-8 inline-block text-center w-40"
          >
            Connect
          </Link>
          
          {/* Tagline */}
          <p className="font-medium mb-10 text-gray-700">Bulletproof Instantaneous Free</p>
          
          {/* Warning Banner */}
          <div className="bg-amber-50 border border-amber-100 text-amber-800 py-3 px-4 max-w-md mx-auto my-8">
            <p>This is an experimental project. Proceed with caution.</p>
          </div>
        </div>
      </div>
  );
}
