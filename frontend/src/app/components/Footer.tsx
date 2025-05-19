"use client";
import React from "react";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full mt-auto">
      <div className="bg-gray-100 py-3 px-6 rounded-lg">
        <div className="flex justify-center space-x-8 text-sm text-gray-600">
          <Link href="/legal" className="hover:underline">Legal</Link>
          <span className="text-gray-300">•</span>
          <a href="https://wot.eth.limo" target="_blank" rel="noopener noreferrer" className="hover:underline">Support: wot.eth</a>
          <span className="text-gray-300">•</span>
          <Link href="/about" className="hover:underline">About</Link>
        </div>
      </div>
    </footer>
  );
}
