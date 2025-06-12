"use client"; // Mark this as a client component

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IotaClientProvider, WalletProvider, createNetworkConfig } from '@iota/dapp-kit';

// Initialize QueryClient
const queryClient = new QueryClient();

// Configure IOTA networks
const { networkConfig } = createNetworkConfig({
  localnet: { url: 'http://localhost:19000' }, // For wot.id local IOTA node
});

export default function DappKitProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <IotaClientProvider networks={networkConfig} defaultNetwork="localnet">
          <WalletProvider>
            {children}
          </WalletProvider>
        </IotaClientProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

