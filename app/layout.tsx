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
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientAppProvider>{children}</ClientAppProvider>
      </body>
    </html>
  );
}
