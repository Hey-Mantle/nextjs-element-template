import AuthExample from "@/components/AuthExample";
import { Page } from "@heymantle/litho";
import { redirect } from "next/navigation";

export default function Home() {
  // Server-side environment variable validation
  const requiredEnvVars = [
    "NEXT_PUBLIC_MANTLE_APP_ID",
    "NEXT_PUBLIC_MANTLE_ELEMENT_ID",
    "MANTLE_APP_API_KEY",
    "MANTLE_ELEMENT_SECRET",
    "AUTH_SECRET",
  ];

  const setup = requiredEnvVars.every((varName) => {
    const value = process.env[varName];
    return value !== undefined && value !== "";
  });

  // If setup is not complete, redirect to setup page
  if (!setup) {
    redirect("/setup");
  }

  // If setup is complete, render the main application
  return (
    <Page title="Your Mantle Element" subtitle="Build it out!">
      <AuthExample />
    </Page>
  );
}
