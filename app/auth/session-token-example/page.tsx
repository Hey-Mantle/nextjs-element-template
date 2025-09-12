"use client";

import SessionTokenAuth, {
  useSessionTokenAuth,
} from "@/components/SessionTokenAuth";
import { useSession } from "next-auth/react";
import { useState } from "react";

/**
 * Example page demonstrating session token authentication
 * This page shows different ways to use session token authentication
 */
export default function SessionTokenExamplePage() {
  return (
    <SessionTokenAuth
      fallback={<AuthenticationForm />}
      onAuthSuccess={() => console.log("Authentication successful!")}
      onAuthError={(error) => console.error("Authentication failed:", error)}
    >
      <AuthenticatedContent />
    </SessionTokenAuth>
  );
}

function AuthenticationForm() {
  const [sessionToken, setSessionToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authenticateWithToken } = useSessionTokenAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await authenticateWithToken(sessionToken);

    if (!result.success) {
      setError(result.error || "Authentication failed");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Session Token Authentication
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your session token to authenticate
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="sessionToken" className="sr-only">
              Session Token
            </label>
            <input
              id="sessionToken"
              name="sessionToken"
              type="text"
              required
              value={sessionToken}
              onChange={(e) => setSessionToken(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter session token"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || !sessionToken}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              For iframe authentication, add the session token to the URL:
            </p>
            <code className="mt-2 block text-xs bg-gray-100 p-2 rounded">
              ?sessionToken=your_token_here
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthenticatedContent() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Authentication Successful!
              </h3>
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  You are now authenticated using session token authentication.
                </p>
              </div>

              <div className="mt-6">
                <h4 className="text-base font-medium text-gray-900">
                  Session Information:
                </h4>
                <div className="mt-2 bg-gray-50 rounded-md p-4">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-base font-medium text-gray-900">
                  Usage Examples:
                </h4>
                <div className="mt-2 space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">
                      1. URL-based authentication:
                    </h5>
                    <code className="block text-xs bg-gray-100 p-2 rounded mt-1">
                      /your-page?sessionToken=abc123
                    </code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700">
                      2. API endpoint authentication:
                    </h5>
                    <code className="block text-xs bg-gray-100 p-2 rounded mt-1">
                      POST /api/auth/session-token-signin
                      <br />
                      {`{ "sessionToken": "abc123" }`}
                    </code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700">
                      3. Programmatic authentication:
                    </h5>
                    <code className="block text-xs bg-gray-100 p-2 rounded mt-1">
                      {`import { clientSessionTokenSignIn } from "@/lib/auth-utils";
await clientSessionTokenSignIn("abc123");`}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
