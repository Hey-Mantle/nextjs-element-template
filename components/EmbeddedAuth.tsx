"use client";

import { EmbeddedAuthProvider } from "@/lib/embedded-auth-context";
import { useOrganization, useUser } from "@heymantle/app-bridge-react";
import { Button, Layout, Page, Spinner, VerticalStack } from "@heymantle/litho";

interface EmbeddedAuthProps {
  children: React.ReactNode;
}

/**
 * Simple authentication wrapper for embedded iframe apps with managed installs.
 *
 * For managed installs, the App Bridge will always have an authenticated user/org session.
 * This component simply provides the user/org data to child components.
 */
export default function EmbeddedAuth({ children }: EmbeddedAuthProps) {
  const { user, isLoading: userLoading, error: userError } = useUser();
  const {
    organization,
    isLoading: orgLoading,
    error: orgError,
  } = useOrganization();

  const isLoading = userLoading || orgLoading;
  const error = userError || orgError;

  // Show loading while fetching user/org data
  if (isLoading) {
    return <LoadingState message="Loading user data..." />;
  }

  // Show error if there's an issue fetching user/org data
  if (error) {
    return (
      <ErrorState
        title="Authentication Failed"
        message={error}
        action={
          <Button
            onClick={() => {
              window.location.reload();
            }}
          >
            Retry
          </Button>
        }
      />
    );
  }

  // Show error if no user or organization found
  if (!user || !organization) {
    return (
      <ErrorState
        title="Access Denied"
        message="No authenticated user or organization found. Please ensure you're accessing this app through the Mantle platform."
        action={
          <Button
            onClick={() => {
              window.location.href = "https://app.heymantle.com";
            }}
          >
            Go to Mantle
          </Button>
        }
      />
    );
  }

  // Convert MantleUser to Prisma User type
  const prismaUser = user
    ? {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.avatar || null,
        emailVerified: null,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    : null;

  // Convert MantleOrganization to Prisma Organization type
  const prismaOrganization = organization
    ? {
        id: organization.id,
        name: organization.name,
        mantleId: organization.id,
        accessToken: "", // Will be set by the app bridge session
        apiToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    : null;

  return (
    <EmbeddedAuthProvider
      user={prismaUser}
      organization={prismaOrganization}
      isAuthenticated={true}
      isLoading={false}
      error={null}
    >
      {children}
    </EmbeddedAuthProvider>
  );
}

// Loading state component
function LoadingState({ message }: { message: string }) {
  return (
    <Page title="" subtitle="" fullWidth>
      <Layout>
        <VerticalStack gap="6" align="center">
          <Spinner size="large" />
          <p>{message}</p>
        </VerticalStack>
      </Layout>
    </Page>
  );
}

// Error state component
function ErrorState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <Page title="" subtitle="" fullWidth>
      <Layout>
        <VerticalStack gap="6" align="center">
          <h2>{title}</h2>
          <p>{message}</p>
          {action}
        </VerticalStack>
      </Layout>
    </Page>
  );
}
