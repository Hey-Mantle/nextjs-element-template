# Mantle Element Starter Template

A modern, production-ready Next.js starter template for building Mantle Elements using the [Litho UI framework](https://www.npmjs.com/package/@heymantle/litho) for beautiful, accessible components.

## 🚀 Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **NextAuth.js v5** with JWT sessions for authentication
- **Mantle OAuth** integration for Extension users
- **Litho UI Framework** for Mantle-compatible components
- **Tailwind CSS** for utility-first styling
- **Dark Mode** support with system preference detection
- **ESLint** configuration for code quality
- **Responsive Design** with mobile-first approach
- **Mantle-ready** structure for seamless integration

## 📦 What's Included

- Pre-configured Next.js 15 project with App Router
- TypeScript setup with strict configuration
- NextAuth.js v5 with JWT sessions and Mantle OAuth provider
- Authentication pages (signin, error handling)
- Auth utility functions for server-side session management
- Tailwind CSS with Litho integration
- Example pages demonstrating Litho components for Mantle Elements
- Dark mode provider setup
- ESLint configuration
- Git ignore file
- Mantle-ready project structure

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, or pnpm

### Installation

1. **Clone or download this template**
   ```bash
   # If using git
   git clone <your-repo-url>
   cd mantle-element-starter
   
   # Or if you downloaded the files directly
   cd mantle-element-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```bash
   # NextAuth.js
   NEXTAUTH_URL=https://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here

   # Mantle OAuth
   NEXT_PUBLIC_MANTLE_ELEMENT_ID=your-mantle-element-id
   MANTLE_ELEMENT_SECRET=your-mantle-element-secret
   ```

4. **Set up HTTPS for local development (Recommended for OAuth)**
   Many OAuth providers require HTTPS for security. Set up local HTTPS:
   ```bash
   # Run the HTTPS setup script
   npm run setup:https
   
   # This will:
   # - Install mkcert (if not already installed)
   # - Generate SSL certificates for localhost
   # - Configure your system to trust the certificates
   ```

5. **Start the development server**
   ```bash
   # For regular HTTP development
   npm run dev
   
   # For HTTPS development (recommended for OAuth)
   npm run dev:https
   
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to:
   - [http://localhost:3000](http://localhost:3000) for HTTP
   - [https://localhost:3000](https://localhost:3000) for HTTPS (recommended for OAuth)

## 📁 Project Structure

```
mantle-element-starter/
├── app/                    # Next.js App Router directory
│   ├── api/               # API routes
│   │   └── auth/          # NextAuth.js API routes
│   ├── auth/              # Authentication pages
│   │   ├── signin/        # Sign in page
│   │   └── error/         # Auth error page
│   ├── components/        # App-specific components
│   │   ├── ClientAppProvider.tsx
│   │   ├── MantleProviderWrapper.tsx
│   │   └── SessionProvider.tsx
│   ├── globals.css        # Global styles with Litho CSS
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ExampleComponent.tsx
│   └── AuthExample.tsx    # Authentication example
├── lib/                   # Utility libraries
│   ├── auth.ts           # NextAuth.js configuration
│   ├── auth-utils.ts     # Auth utility functions
│   └── mantle-client.ts  # Mantle client setup
├── public/               # Static assets
├── .eslintrc.json       # ESLint configuration
├── .gitignore           # Git ignore rules
├── next.config.js       # Next.js configuration
├── next-env.d.ts        # Next.js TypeScript declarations
├── package.json         # Dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## 🔐 Authentication

This template includes NextAuth.js v5 with Mantle OAuth integration for Extension users. Here's how to use it:

### Server-Side Authentication

```tsx
import { requireAuth, getServerSession } from "@/lib/auth-utils"

// Require authentication for a page
export default async function ProtectedPage() {
  const session = await requireAuth()
  
  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <p>Organization: {session.user.organizationName}</p>
    </div>
  )
}

// Or get session without redirecting
export default async function OptionalAuthPage() {
  const session = await getServerSession()
  
  return (
    <div>
      {session ? (
        <p>Welcome back, {session.user.name}!</p>
      ) : (
        <p>Please sign in to continue.</p>
      )}
    </div>
  )
}
```

### Client-Side Authentication

```tsx
"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") return <p>Loading...</p>

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return (
    <button onClick={() => signIn("MantleOAuth")}>
      Sign in with Mantle
    </button>
  )
}
```

### Auth Utility Functions

- `requireAuth()` - Requires authentication, redirects to signin if not authenticated
- `getServerSession()` - Gets current session without redirecting
- `getMantleAccessToken()` - Gets the user's Mantle access token

## 🎨 Using Litho Components for Mantle Elements

This template is pre-configured to use Litho components for building Mantle Elements. Here's how to use them:

### Basic Usage

```tsx
import { Button, Card, Text, Heading } from '@heymantle/litho'

export default function MyMantleElement() {
  return (
    <Card>
      <Heading level={2}>Hello Mantle</Heading>
      <Text>This is a Mantle Element using Litho components.</Text>
      <Button primary>Click me</Button>
    </Card>
  )
}
```

### Available Components

The template includes examples of:
- **Page** - Layout wrapper with title
- **Button** - Various button variants (primary, secondary, outline, ghost)
- **Card** - Container component
- **Text** - Typography component with size variants
- **Heading** - Heading component with levels 1-6
- **Stack** - Vertical spacing component
- **Grid** - Responsive grid layout

### Dark Mode

Dark mode is automatically configured and will:
- Detect system preference
- Store user preference in localStorage
- Provide smooth theme transitions

## 🎯 Available Scripts

- `npm run dev` - Start development server (HTTP)
- `npm run dev:https` - Start development server with HTTPS (recommended for OAuth)
- `npm run setup:https` - Set up local HTTPS certificates
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔒 HTTPS Development

### Why HTTPS for OAuth?

Many OAuth providers (including Mantle) require HTTPS for security reasons. This is especially important for:
- OAuth redirects
- Secure cookie handling
- API calls with sensitive data

### Troubleshooting HTTPS Issues

If you encounter issues with HTTPS setup:

1. **Certificate not trusted**: Make sure you ran `npm run setup:https` and that mkcert installed the local CA
2. **Port conflicts**: If port 3000 is in use, Next.js will automatically use the next available port
3. **Browser warnings**: You may see a security warning the first time - click "Advanced" and "Proceed to localhost"
4. **OAuth redirects**: Ensure your OAuth app configuration uses `https://localhost:3000` (or the correct port) for redirect URLs

### Alternative HTTPS Setup

If mkcert doesn't work on your system, you can also use:
- [ngrok](https://ngrok.com/) for tunneling
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/) for secure tunneling
- Self-signed certificates (less secure, may require additional browser configuration)

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Litho UI Framework](https://www.npmjs.com/package/@heymantle/litho)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Mantle Documentation](https://docs.mantle.com) (if available)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Litho UI](https://www.npmjs.com/package/@heymantle/litho) for the beautiful component library used in Mantle
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Mantle](https://mantle.com) for the application platform that makes this template possible
