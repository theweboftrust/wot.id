'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

interface AuthSessionProviderProps {
  children: React.ReactNode;
  // If you intend to pass the session prop from a server component in the future,
  // you can type it here, e.g., session?: Session | null;
  // For now, we'll keep it simple as NextAuth.js <SessionProvider> can fetch it.
}

export default function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
