/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const mantleUrl =
      process.env.NEXT_PUBLIC_MANTLE_URL ?? "https://app.heymantle.com";

    return [
      {
        // Apply CSP headers to all routes
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' ${mantleUrl}`,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
