import "server-only";

import { betterAuth } from "better-auth";
import { db } from "./db";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
	database: db,
	emailAndPassword: {
		enabled: true,
	},
	plugins: [nextCookies()],
	trustedOrigins: [process.env.NEXT_PUBLIC_BASE_URL!],
});
