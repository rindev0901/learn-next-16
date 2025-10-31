import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	cacheComponents: true,
	cacheLife: {
		custom: {
			stale: 60 * 6, // cache in client for 6 minutes not access to resource
			revalidate: 60 * 5, // every 5 minutes to revalidate in the background
			expire: 60 * 60, // maximum 1 hour in the cache then revalidate in the background
		},
	},
	typedRoutes: true,
	reactStrictMode: false,
	experimental: {
		turbopackUseSystemTlsCerts: true,
		turbopackFileSystemCacheForDev: false,
		turbopackFileSystemCacheForBuild: false,
		serverActions: {
			allowedOrigins: ["192.168.9.76:9999"]
		}
	},
};

export default nextConfig;
