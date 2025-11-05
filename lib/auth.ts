import { betterAuth } from "better-auth";
import { db } from "./db";

export const auth = betterAuth({
	database: db,
	emailAndPassword: {
		enabled: true,
	},
	trustedOrigins: [process.env.NEXT_PUBLIC_BASE_URL!],
});
