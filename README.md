# Mantle Element Starter

A Next.js starter template for building Mantle elements with authentication and API integration.

## Features

- Next.js 15 with App Router
- NextAuth.js for authentication
- Prisma for database management
- TypeScript support
- Tailwind CSS for styling
- Mantle App Bridge integration
- OpenAPI TypeScript integration for type-safe API calls

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables (create a `.env.local` file):
   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # NextAuth
   AUTH_SECRET="your-auth-secret"

   # Mantle Configuration
   NEXT_PUBLIC_MANTLE_APP_ID="your-app-id"
   NEXT_PUBLIC_MANTLE_ELEMENT_ID="your-element-id"
   NEXT_PUBLIC_MANTLE_ELEMENT_HANDLE="your-element-handle"
   NEXT_PUBLIC_MANTLE_URL="https://app.heymantle.com"
   MANTLE_APP_API_KEY="your-app-api-key"
   MANTLE_ELEMENT_SECRET="your-element-secret"

   # Optional: Custom Mantle Core API URL
   MANTLE_CORE_API_URL="https://app.heymantle.com/api/v1"
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

4. Generate API types:
   ```bash
   npm run generate:mantle-api-types
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Integration

This project includes OpenAPI TypeScript integration for type-safe API calls to the Mantle Core API.

### Generated Types

The project automatically generates TypeScript types from the Mantle Core API OpenAPI specification:

```bash
npm run generate:mantle-api-types
```

This creates `lib/types/mantleApi.ts` with all the API endpoint types.

### API Client

Use the provided API client wrapper for type-safe API calls:

```typescript
import { mantleGet, mantlePost } from "@/lib/mantle-api-client";
import { prisma } from "@/lib/prisma";

// Example: Fetch customers
const organization = await prisma.organization.findFirst();
const customers = await mantleGet(organization, "/customers", {
  query: { page: 1, limit: 50 }
});
```

### Available Endpoints

The project includes a custom endpoint to fetch customers:

- `GET /api/customers` - Fetch a paginated list of customers with optional filters

Query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)
- `search` - Search term
- `tags` - Comma-separated list of tags
- `minUpdatedAt` - Filter customers updated after this timestamp
- `maxUpdatedAt` - Filter customers updated before this timestamp
- `appIds` - Comma-separated list of app IDs
- `shopifyShopDomain` - Shopify shop domain filter
- `shopifyShopId` - Shopify shop ID filter

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate:mantle-api-types` - Generate API types
- `npm run lint` - Run ESLint

## Authentication

The project uses NextAuth.js with Mantle OAuth provider for authentication. Users are automatically associated with their organization and stored in the database.

## Database Schema

The project uses Prisma with SQLite for development. The schema includes:

- `User` - User accounts
- `Organization` - Mantle organizations
- `UserOrganization` - Many-to-many relationship between users and organizations
- `Account` - OAuth accounts
- `Session` - User sessions
