"use client";
import React from "react";
import Link from "next/link";

export default function ContributePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="mb-8 flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        <Link href="/about/why" className="hover:underline text-gray-600 dark:text-gray-300">Why</Link>
        <Link href="/about/how" className="hover:underline text-gray-600 dark:text-gray-300">How</Link>
        <Link href="/about/who" className="hover:underline text-gray-600 dark:text-gray-300">Who</Link>
        <Link href="/about/contribute" className="font-semibold text-primary underline">Contribute</Link>
      </nav>
      <h1 className="text-3xl font-bold mb-4">Contribute to wot.id</h1>
      <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
        wot.id is an open, community-driven project. We welcome contributions from anyone interested in advancing decentralized, user-centric identity on IOTA.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">How You Can Help</h2>
      <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
        <li>Report bugs or suggest features via our <a href="https://github.com/theweboftrust/wot.id/issues" className="text-primary underline" target="_blank" rel="noopener noreferrer">GitHub Issues</a>.</li>
        <li>Contribute code, documentation, or translations by submitting pull requests.</li>
        <li>Share feedback and ideas to improve usability and accessibility.</li>
        <li>Help spread the word and grow our community.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">Get Started</h2>
      <p className="mb-2 text-gray-700 dark:text-gray-300">
        To get started, check out our <a href="https://github.com/theweboftrust/wot.id" className="text-primary underline" target="_blank" rel="noopener noreferrer">GitHub repository</a> for contribution guidelines, open issues, and project documentation.
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        Thank you for helping make digital identity more open and user-centric!
      </p>
    </div>
  );
}
