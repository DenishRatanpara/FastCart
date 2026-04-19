import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
 images:{
  remotePatterns:[
{hostname:"lh3.googleusercontent.com"},

{hostname:"images.unsplash.com",protocol: "https"},
{hostname:"res.cloudinary.com"}

  ]
 }
};

export default nextConfig;
