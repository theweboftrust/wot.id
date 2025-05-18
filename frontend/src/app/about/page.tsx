"use client";
"use client";
import React from "react";

const sections = [
  {
    title: "For Everything",
    items: [
      "Store all aspects of your life in one place, from personal documents to digital assets",
      "Your information is managed securely and privately using IOTA-native technology",
      "Organize documents with cryptographic verification and user-centric control",
      "Your assets are tracked and verified with immutable, tamper-evident records",
      "Access sensitive data only when you explicitly authorize it",
      "Manage all your digital assets in a unified, stateless interface"
    ]
  },
  {
    title: "For Everywhere",
    items: [
      "Access your identity from anywhere in the world with just a web browser",
      "Your credentials are always available when you need them—no centralized servers",
      "No need to carry physical documents, reducing risk of loss or theft",
      "Prove who you are without relying on vulnerable, centralized authorities",
      "Universal verification across the IOTA ecosystem",
      "Your identity works seamlessly across digital environments"
    ]
  },
  {
    title: "For Everyone (I choose)",
    items: [
      "You decide who can see your information through cryptographic access controls",
      "Share credentials only with those you trust, with granular permissions",
      "Maintain privacy while proving your identity using modern cryptography",
      "Control which organizations have access to your data—never the other way around",
      "Revoke access at any time with user-centric permission management",
      "Your data is never collected, stored, or analyzed on centralized servers"
    ]
  },
  {
    title: "For Ever",
    items: [
      "Your credentials are lasting and tamper-evident",
      "Your reputation is preserved through time",
      "No worries about losing important documents",
      "Your digital identity persists as long as you need it—stateless and future-proof"
    ]
  }
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">My Trusted Identity</h1>
      <div className="space-y-8 mb-10">
        {sections.map((section) => (
          <section key={section.title} className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-800 dark:text-gray-100 text-lg">
              {section.title}
            </div>
            <ul className="px-8 py-4 list-disc text-left text-gray-700 dark:text-gray-300 space-y-2">
              {section.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <button
        className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-primary-dark transition"
        onClick={() => window.location.href = "/about/why"}
      >
        Why wot.id?
      </button>
    </div>
  );
}
