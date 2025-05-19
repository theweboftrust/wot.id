"use client";
import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col max-w-6xl mx-auto px-4 py-6">
      <NavBar />
      {children}
      <Footer />
    </div>
  );
}
