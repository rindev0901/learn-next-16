import "server-only";

import { betterAuth } from "better-auth";
import { db } from "./db";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, user, manager } from "@/lib/permissions";

export const auth = betterAuth({
	database: db,
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		adminPlugin({
			ac: ac,
			roles: { admin, user, manager },
			adminUserIds: [],
		}),
		nextCookies(),
	],
	trustedOrigins: [process.env.NEXT_PUBLIC_BASE_URL!],
});
