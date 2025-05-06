import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com', 'salt.tikicdn.com', "i.pravatar.cc", "images.unsplash.com", "platform-lookaside.fbsbx.com"],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ngăn build fail do lỗi ESLint
  },
};

export default nextConfig;
