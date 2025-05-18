"use client";
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full flex justify-center items-center py-4 bg-gray-100 dark:bg-gray-900 mt-8">
      <div className="flex gap-8 text-sm text-gray-600 dark:text-gray-400">
        <Link href="/legal" className="hover:underline">Legal</Link>
        <a href="https://support.wot.id" target="_blank" rel="noopener noreferrer" className="hover:underline">Support</a>
        <Link href="/about" className="hover:underline">About</Link>
      </div>
    </footer>
  );
}
