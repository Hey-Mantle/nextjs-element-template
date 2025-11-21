/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async headers() {
    const mantleUrl =
      process.env.NEXT_PUBLIC_MANTLE_URL ?? "https://app.heymantle.com";

    // Build frame-ancestors directive
    // Allow 'self' and the configured Mantle URL
    const frameAncestors = [`'self'`, mantleUrl].join(" ");

    return [
      {
        // Apply CSP headers to all routes
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${frameAncestors}`,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
