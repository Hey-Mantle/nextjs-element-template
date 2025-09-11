import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientAppProvider from "./components/ClientAppProvider";
import MantleProviderWrapper from "./components/MantleProviderWrapper";
import { SessionProvider } from "./components/SessionProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mantle Element Starter",
  description: "A Next.js starter template for Mantle Elements using Litho UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          src={
            process.env.NEXT_PUBLIC_MANTLE_APP_BRIDGE_SRC ??
            "https://app.heymantle.com/app-bridge.js"
          }
        />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <MantleProviderWrapper>
            <ClientAppProvider>{children}</ClientAppProvider>
          </MantleProviderWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
