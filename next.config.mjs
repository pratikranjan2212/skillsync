/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/faq",
        destination: "/#faq",
        permanent: true,
      },
      {
        source: "/faqs",
        destination: "/#faq",
        permanent: true,
      },
      {
        source: "/help",
        destination: "/support",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/support",
        permanent: true,
      },
      {
        source: "/documentation",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/terms-and-conditions",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
