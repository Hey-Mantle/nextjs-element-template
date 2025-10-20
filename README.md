# Mantle Element Starter

A Next.js starter template for building Mantle elements with authentication and API integration. This template provides a complete foundation for creating embedded applications that integrate seamlessly with the Mantle platform.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (see `.nvmrc` for exact version)
- npm or yarn
- A Mantle account and element configuration

### Installation
1. Before you start, make sure you [Create an Element](https://app.heymantle.com/extensions) in Mantle.
  Make sure to set the URL to the root of this application. For example, https://localhost:3000 for local development.
  Set the Redirect URIs to https://localhost:3009/api/auth/callback/MantleOAuth
  Click "Embed this element in the Mantle Admin"
2. **Create a next project based on this one:**
   ```bash
   npx create-next-app@latest my-mantle-element --example https://github.com/Hey-Mantle/nextjs-element-template
   cd my-mantle-element
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create an AUTH_SECRET**
   ```bash
   npx auth secret
   ```

5. **Set up environment variables:**
   Create a `.env.local` file with the following variables:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
      
   # Mantle Configuration
   NEXT_PUBLIC_HOST=localhost:3000
   NEXT_PUBLIC_MANTLE_APP_ID="your-app-id"
   NEXT_PUBLIC_MANTLE_ELEMENT_ID="your-element-id"
   NEXT_PUBLIC_MANTLE_ELEMENT_HANDLE="your-element-handle"
   NEXT_PUBLIC_MANTLE_URL="https://app.heymantle.com"
   MANTLE_APP_API_KEY="your-app-api-key"
   MANTLE_ELEMENT_SECRET="your-element-secret"
   
   # Optional: Custom Mantle Core API URL
   MANTLE_CORE_API_URL="https://app.heymantle.com/api/v1"
   ```

6. **Set up the database:**
   ```bash
   npx prisma migrate dev
   ```

7. **Generate API types:**
   ```bash
   npm run generate:mantle-api-types
   ```
   You can run this at any time to update your API client with Mantle's latest API changes

8. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture Overview

### App Bridge Communication

The Mantle Element Starter uses the **Mantle App Bridge** to communicate with the parent Mantle platform window. This enables secure, cross-origin communication between your embedded element and the Mantle platform.

#### How App Bridge Works

1. **Iframe Detection**: The app automatically detects when it's running inside a Mantle iframe
2. **Connection Establishment**: Connects to the parent window's App Bridge API
3. **Session Management**: Retrieves authentication tokens and user information
4. **Bidirectional Communication**: Enables navigation, notifications, and API calls

```typescript
// Example: Using App Bridge in your components
import { useAppBridge } from '@heymantle/app-bridge-react';

function MyComponent() {
  const { 
    isConnected, 
    session, 
    user, 
    authenticatedFetch 
  } = useAppBridge();

  if (!isConnected) {
    return <div>Connecting to Mantle...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Organization: {session?.organizationId}</p>
    </div>
  );
}
```

### Authentication Flow

The starter implements a dual authentication system:

#### 1. Session Token Authentication (Primary)
- **Purpose**: For embedded iframe access within Mantle
- **Flow**: 
  1. App Bridge provides a JWT session token
  2. Token is verified using HMAC with the configured element secret (for managed installs)
  3. User and organization data is retrieved/created in local database
  4. Session is established for the current request

#### 2. OAuth Authentication (Fallback)
- **Purpose**: For standalone access or initial setup
- **Flow**:
  1. Redirects to Mantle OAuth provider
  2. User authorizes the application
  3. Access token is stored in database
  4. User and organization records are created/updated

```typescript
// Session token verification (automatic in API routes)
import { getAuthenticatedUser } from '@/lib/jwt-auth';

export async function GET(request: NextRequest) {
  const { user, organization } = await getAuthenticatedUser(request);
  
  if (!user || !organization) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Your protected logic here
  return NextResponse.json({ data: 'success' });
}
```

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite database file path | `file:./dev.db` |
| `NEXT_PUBLIC_HOST` | Your app host | `localhost:3000`
| `NEXT_PUBLIC_MANTLE_APP_ID` | Your Mantle app ID | `app_1234567890` |
| `NEXT_PUBLIC_MANTLE_ELEMENT_ID` | Your element ID | `elem_1234567890` |
| `NEXT_PUBLIC_MANTLE_ELEMENT_HANDLE` | Your element handle | `my-custom-element` |
| `NEXT_PUBLIC_MANTLE_URL` | Mantle platform URL | `https://app.heymantle.com` |
| `MANTLE_APP_API_KEY` | Your app's API key | `ak_1234567890` |
| `MANTLE_ELEMENT_SECRET` | Your element's secret | `es_1234567890` |

## 🔌 API Integration

### Type-Safe API Calls

The starter includes OpenAPI TypeScript integration for type-safe API calls:

```bash
# Generate types from Mantle Core API
npm run generate:mantle-api-types
```

```typescript
// Example: Using the API client
import { mantleGet, mantlePost } from '@/lib/mantle-api-client';
import { prisma } from '@/lib/prisma';

// Fetch customers with type safety
const organization = await prisma.organization.findFirst();
const customers = await mantleGet(organization, '/customers', {
  query: { page: 1, limit: 50 }
});
```

### Custom API Endpoints

The starter includes example API endpoints:

- `GET /api/customers` - Fetch paginated customers with filters
- `POST /api/sync-session` - Sync session data and return customer API token
- `GET /api/auth/initiate` - Initiate OAuth flow

## 🎨 UI Components

The starter uses **Mantle Litho** for consistent UI components:

```typescript
import { Button, Page, VerticalStack } from '@heymantle/litho';

function MyPage() {
  return (
    <Page title="My Element" subtitle="Built with Mantle">
      <VerticalStack gap="4">
        <Button primary>Primary Action</Button>
        <Button>Secondary Action</Button>
      </VerticalStack>
    </Page>
  );
}
```

## 🚀 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:https        # Start with HTTPS (for iframe testing)

# Database
npx prisma migrate dev   # Run database migrations
npx prisma studio        # Open Prisma Studio

# API Types
npm run generate:mantle-api-types  # Generate API types

# Production
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### HTTPS Development

For iframe testing, you should be using HTTPS by default to avoid problems with mixed protocols. `npm run dev` uses `https` by default.
