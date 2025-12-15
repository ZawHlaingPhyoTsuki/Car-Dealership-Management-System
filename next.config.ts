import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				pathname: "/**", // Allows all paths from this domain
			},
			{
				protocol: "https",
				hostname: "picsum.photos",
				pathname: "/**", // Allows all paths from this domain
			},
		],
	},
};

export default nextConfig;
