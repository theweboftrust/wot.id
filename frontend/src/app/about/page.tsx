"use client";
import React, { useState } from "react";
import Link from "next/link";

const sections = [
  {
    title: "For Everything",
    items: [
      "I can store all aspects of my life in one place, from personal documents to digital assets",
      "My personal information is securely managed using blockchain technology",
      "I can organize my documents digitally with cryptographic verification",
      "My real-world assets are tracked and verified with immutable records",
      "My medical data is accessible when I need it, but only to those I explicitly authorize",
      "My digital assets from multiple blockchains are managed in a unified interface"
    ]
  },
  {
    title: "For Everywhere",
    items: [
      "I can access my identity from anywhere in the world with just a web browser",
      "My credentials are always available when I need them, backed by blockchain technology",
      "I don't need to carry physical documents anymore, reducing risk of loss or theft",
      "I can prove who I am without relying on centralized authorities that may be compromised",
      "My blockchain-based attestations are universally verifiable across multiple networks",
      "My identity works seamlessly across different blockchain ecosystems"
    ]
  },
  {
    title: "For Everyone (I choose)",
    items: [
      "I decide who can see my information through cryptographic access controls",
      "I can share specific credentials with only those I trust, with granular permissions",
      "I maintain my privacy while still proving my identity using zero-knowledge proofs",
      "I control which organizations have access to my data, not the other way around",
      "I can revoke access to my information at any time with blockchain-based permission management",
      "My data is never collected, stored, or analyzed on centralized servers"
    ]
  },
  {
    title: "For Ever",
    items: [
      "My identity attestations are permanent and immutable",
      "I have a lasting record of my credentials that can't be erased",
      "My reputation is preserved through time",
      "I don't have to worry about losing important documents",
      "My digital identity will persist as long as the blockchain exists"
    ]
  }
];

const AboutSubNav = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4 mb-6 flex space-x-8 font-medium">
      <button 
        onClick={() => setActiveTab('why')} 
        className={`${activeTab === 'why' ? 'text-black font-semibold' : 'text-gray-500'} hover:text-gray-800`}
      >
        Why
      </button>
      <button 
        onClick={() => setActiveTab('how')} 
        className={`${activeTab === 'how' ? 'text-black font-semibold' : 'text-gray-500'} hover:text-gray-800`}
      >
        How
      </button>
      <button 
        onClick={() => setActiveTab('who')} 
        className={`${activeTab === 'who' ? 'text-black font-semibold' : 'text-gray-500'} hover:text-gray-800`}
      >
        Who
      </button>
      <button 
        onClick={() => setActiveTab('join')} 
        className={`${activeTab === 'join' ? 'text-black font-semibold' : 'text-gray-500'} hover:text-gray-800`}
      >
        Join
      </button>
    </div>
  );
};

const WhyContent = () => (
  <div className="bg-gray-100 rounded-lg p-6 mb-6">
    <h2 className="text-xl font-semibold mb-4">Why We Built wot.id</h2>
    <div className="space-y-4">
      <p>
        In today&apos;s digital world, our identities are fragmented across countless platforms and services. 
        Personal information is often stored in centralized databases vulnerable to breaches, and users have little control over how their data is used.
      </p>
      <p>
        wot.id was created to solve these problems by giving individuals complete control over their digital identities. Our approach is built on the following core principles:
      </p>
      <ul className="space-y-2 list-disc pl-6">
        <li><strong>Decentralization:</strong> No single entity controls your identity; it is anchored on IOTA for maximum security and neutrality.</li>
        <li><strong>Verifiability:</strong> All actions and data are provable on-chain, making your credentials universally trustworthy.</li>
        <li><strong>Privacy:</strong> You decide what to share, with whom, and when. Zero-knowledge proofs and cryptographic controls protect your information.</li>
        <li><strong>Interoperability:</strong> Manage assets and attestations from multiple chains in one unified interface.</li>
        <li><strong>Future-Proof:</strong> Our architecture is designed to incorporate new chains and cryptographic standards as the ecosystem evolves.</li>
        <li><strong>Seamless Experience:</strong> Maintain your identity on IOTA with fast, low-cost operations.</li>
      </ul>
      <p>
        wot.id empowers you to take back control of your digital life—securely, privately, and on your terms.
      </p>
    </div>
  </div>
);

const HowContent = () => (
  <div className="bg-gray-100 rounded-lg p-6 mb-6">
    <h2 className="text-xl font-semibold mb-4">How wot.id Works</h2>
    <div className="space-y-4">
      <p>
        wot.id creates a seamless bridge between your real-world identity and the digital realm, using advanced cryptography and the IOTA distributed ledger technology.
      </p>
      <div className="mb-4">
        <h3 className="font-medium mb-2">Self-Sovereign Identity</h3>
        <p>Your identity belongs to you alone. Private keys remain in your control, while verifiable credentials are issued by trusted authorities.</p>
      </div>
      <div className="mb-4">
        <h3 className="font-medium mb-2">Selective Disclosure</h3>
        <p>Share only the specific information needed for each situation, without revealing your entire identity profile.</p>
      </div>
      <div className="mb-4">
        <h3 className="font-medium mb-2">Chain-Agnostic</h3>
        <p>While built on IOTA for efficiency and security, wot.id is designed to interact with multiple blockchain networks.</p>
      </div>
      <div className="mb-4">
        <h3 className="font-medium mb-2">Zero-Knowledge Proofs</h3>
        <p>Validate claims about your identity without revealing the underlying data, preserving privacy while ensuring trust.</p>
      </div>
    </div>
  </div>
);

const WhoContent = () => (
  <div className="bg-gray-100 rounded-lg p-6 mb-6">
    <h2 className="text-xl font-semibold mb-4">Who We Are</h2>
    <div className="space-y-4">
      <p>
        wot.id is developed by a team of identity and cryptography experts dedicated to creating a more user-controlled digital future. Our mission is to empower individuals with tools that protect their privacy while enhancing their digital capabilities.
      </p>
      <p>
        The project began as an initiative to address the growing concerns around data breaches, identity theft, and the erosion of personal privacy in online spaces. We believe that identity should be a fundamental human right in the digital age—not a product to be commercialized by third parties.
      </p>
      <p>
        Our diverse team brings together expertise from cryptography, distributed systems, user experience design, and privacy law to create a solution that is both technically robust and intuitive to use.
      </p>
      <p>
        wot.id is and will always remain an open-source project, inviting collaboration from the broader community of developers and users who share our vision of a more equitable digital ecosystem.
      </p>
    </div>
  </div>
);

const JoinContent = () => (
  <div className="bg-gray-100 rounded-lg p-6 mb-6">
    <h2 className="text-xl font-semibold mb-4">Join the Movement</h2>
    <div className="space-y-4">
      <p>
        Become part of the growing community that&apos;s reshaping how digital identity works. Whether you&apos;re a user, developer, or organization, there are multiple ways to get involved with wot.id.
      </p>
      <div className="mb-4">
        <h3 className="font-medium mb-2">For Users</h3>
        <p>Create your self-sovereign identity and experience a new level of control over your digital presence. Early adopters help shape the future of the platform.</p>
      </div>
      <div className="mb-4">
        <h3 className="font-medium mb-2">For Developers</h3>
        <p>Contribute to our open-source codebase, build applications that leverage wot.id&apos;s identity framework, or integrate the protocol into existing systems.</p>
      </div>
      <div className="mb-4">
        <h3 className="font-medium mb-2">For Organizations</h3>
        <p>Become an identity verifier or implement wot.id to offer your customers a more secure, privacy-respecting experience.</p>
      </div>
      <p>
        Join our Discord community to connect with other users and contributors, or follow us on Twitter for the latest updates and announcements.
      </p>
    </div>
  </div>
);

const AboutDetails = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState('why');
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-8">About wot.id</h1>
      
      <AboutSubNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'why' && <WhyContent />}
      {activeTab === 'how' && <HowContent />}
      {activeTab === 'who' && <WhoContent />}
      {activeTab === 'join' && <JoinContent />}
      
      <div className="flex justify-center mt-10 mb-4">
        <button 
          onClick={onBack}
          className="bg-gray-100 border border-gray-300 rounded-md px-8 py-2 text-gray-800 hover:bg-gray-200 transition-colors"
        >
          Back to overview
        </button>
      </div>
    </div>
  );
};

export default function AboutPage() {
  const [showDetails, setShowDetails] = useState(false);
  
  if (showDetails) {
    return <AboutDetails onBack={() => setShowDetails(false)} />;
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Trusted Identity</h1>
      
      <div className="space-y-6 mb-10">
        {sections.map((section) => (
          <section key={section.title} className="bg-gray-100 rounded-lg overflow-hidden">
            <div className="px-6 py-4 font-semibold text-gray-800 text-lg">
              {section.title}
            </div>
            <ul className="px-6 py-4 list-disc pl-6 text-gray-700 space-y-2">
              {section.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      
      <div className="flex justify-center mt-10 mb-4">
        <button
          onClick={() => setShowDetails(true)}
          className="bg-gray-100 border border-gray-300 rounded-md px-8 py-2 text-gray-800 hover:bg-gray-200 transition-colors"
        >
          Tell me more about wot.id
        </button>
      </div>
    </div>
  );
}
