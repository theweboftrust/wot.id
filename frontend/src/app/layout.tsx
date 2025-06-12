import { Inter } from "next/font/google";
import dynamic from 'next/dynamic'; // Import dynamic
import "./globals.css";
import '@iota/dapp-kit/dist/index.css'; // Import DApp Kit CSS

import ClientLayout from "./components/ClientLayout";
import AuthSessionProvider from './AuthSessionProvider'; // Import the AuthSessionProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "wot.id",
  description: "Human Identity on the Web of Trust",
};

// Dynamically import DappKitProviders with SSR turned off
const DappKitProviders = dynamic(() => import('./components/DappKitProviders'), {
  ssr: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white min-h-screen`}>
        <AuthSessionProvider>
          <DappKitProviders>
            <ClientLayout>{children}</ClientLayout>
          </DappKitProviders>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
