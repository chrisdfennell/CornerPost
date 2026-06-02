import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Listings store an arbitrary user-supplied image URL, so we can't enumerate
    // hostnames ahead of time. https-only wildcard keeps the optimizer working;
    // when you add a real upload flow (S3/UploadThing), narrow this to that host
    // to remove the arbitrary-fetch (SSRF) surface of the image optimizer.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
