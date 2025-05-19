"use client";
import React from "react";

const Legal = () => {
  return (
    <div className="flex-grow w-full py-8 px-4">
      <div className="max-w-3xl mx-auto text-sm">
        <h1 className="text-3xl font-bold mb-8">Legal Information</h1>
        
        {/* Responsible Section */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Responsible</h2>
          <div className="space-y-2">
            <p>Dr. Axel Noack</p>
            <p>c/o wot.id Project</p>
            <p>Berlin, Germany</p>
            <p className="italic mt-4">(Your support is most welcome: axelnoack.eth)</p>
          </div>
        </div>
        
        {/* Contact Section */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Contact</h2>
          <div className="space-y-2">
            <p>Email: axel@wot.id</p>
            <p>For legal inquiries requiring a postal address, please contact via email first.</p>
          </div>
        </div>
        
        {/* Disclaimer Section */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Disclaimer</h2>
          <div className="space-y-4">
            <p>
              This distributed App (dApp) is experimental and for information purposes only. It intends to
              illustrate the advantages of a blockchain-based peer-to-peer system and
              offers assistance for the use of the IOTA Tangle.
              Any information or functionality is provided to the best of our knowledge, but
              no guarantee of completeness or accuracy whatsoever can be given.
            </p>
            
            <p>
              In particular, no investment advice of any sort is given here. The use
              of the IOTA Tangle is completely free, it is not
              necessary to buy a cryptocurrency.
            </p>
            
            <p>
              The IOTA Tangle and any other blockchain used in this project are peer-to-peer environments. Any activities performed there, such as
              storing information and making it available to others, or the use of cryptocurrencies for whatever purpose are always and
              exclusively the responsibility of the individual user only.
            </p>
          </div>
        </div>
        
        {/* Data Protection Section */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Data Protection</h2>
          <div className="space-y-4">
            <p>
              This website uses necessary technical cookies only. By using this site,
              the user agrees to this. An explicit agreement by the user is not
              necessary.
            </p>
            <p>
              We do not collect, store, or analyse any user data on our servers. Any data you create
              while using this application is stored directly on the blockchain and/or in your local browser storage,
              giving you full control over your information.
            </p>
            <p>
              As a decentralized application (dApp), wot.id is designed with privacy and user sovereignty as core principles.
              You maintain complete ownership of your data at all times.
            </p>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Copyright</h2>
          <p>wot.id logo © Axel Noack</p>
        </div>
      </div>
    </div>
  );
}

export default Legal;
