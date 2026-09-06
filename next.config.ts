import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Admin forms (팝업, 강사진, 로고) upload images straight through a
      // Server Action's FormData. Next's default limit is only 1MB, which
      // an exam-result screenshot or phone photo blows past instantly and
      // fails as an opaque 500. Vercel's Node.js Serverless Functions also
      // hard-cap the request body at 4.5MB regardless of this setting, so
      // this is set just under that ceiling (leaving headroom for
      // multipart/form-data overhead) rather than higher.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
