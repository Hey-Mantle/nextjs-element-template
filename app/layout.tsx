import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientAppProvider from "./components/ClientAppProvider";
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
  const mantleUrl =
    process.env.NEXT_PUBLIC_MANTLE_URL || "https://app.heymantle.com";
  const appBridgeScriptUrl = `${mantleUrl}/app-bridge.js`;

  return (
    <html lang="en">
      <head>
        <script src={appBridgeScriptUrl} async />
      </head>
      <body className={inter.className}>
        <ClientAppProvider mantleUrl={mantleUrl}>{children}</ClientAppProvider>
      </body>
    </html>
  );
}
