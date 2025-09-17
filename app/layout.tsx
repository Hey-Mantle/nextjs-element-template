import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import ClientAppProvider from "./components/ClientAppProvider";
import MantleProviderWrapper from "./components/MantleProviderWrapper";
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
      <head></head>
      <body className={inter.className}>
        <Script
          src={
            (process.env.NEXT_PUBLIC_MANTLE_URL ??
              "https://mantle-kristian.ngrok.io") + "/app-bridge.js"
          }
          strategy="beforeInteractive"
        />
        <MantleProviderWrapper>
          <ClientAppProvider>{children}</ClientAppProvider>
        </MantleProviderWrapper>
      </body>
    </html>
  );
}
