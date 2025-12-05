import { NextRequest } from "next/server";
import { updateSession } from "./lib/fetch/update-session";

export const locales = ["en", "nl"] as const;
export type Lang = (typeof locales)[number];

export async function proxy(request: NextRequest) {
	// Check if there is any supported locale in the pathname
	return await updateSession(request);
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - api/claims (claims API endpoint)
		 * - api/refresh-token (token refresh endpoint)
		 * Feel free to modify this pattern to include more paths.
		 */
		"/((?!_next/static|_next/image|favicon.ico|api/claims|api/refresh-token|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
