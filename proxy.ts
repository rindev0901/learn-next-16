import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export const locales = ["en", "nl"] as const;
export type Lang = (typeof locales)[number];

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
	console.log("Call proxy");
	const acceptLanguage = request.headers.get("accept-language");
	if (!acceptLanguage) return locales[0];

	const languages = acceptLanguage.split(",").map((lang) => lang.trim());
	const matchedLocale = languages.find((lang) =>
		locales.includes(lang as never)
	);
	return matchedLocale || locales[0];
}

export async function proxy(request: NextRequest) {
	// Check if there is any supported locale in the pathname
	const { pathname } = request.nextUrl;

	const segments = pathname.split("/").filter(Boolean);

	if (
		segments.length > 1 &&
		(segments[1].startsWith("login") || segments[1].startsWith("register"))
	) {
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (session?.session) {
			request.nextUrl.pathname = `/${segments[0]}`;
			return NextResponse.redirect(request.nextUrl);
		}
	}

	const pathnameHasLocale = locales.some(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
	);

	if (pathnameHasLocale) return;

	// Redirect if there is no locale
	const locale = getLocale(request);
	request.nextUrl.pathname = `/${locale}${pathname}`;
	// e.g. incoming request is /products
	// The new URL is now /en-US/products
	return NextResponse.redirect(request.nextUrl);
}

export const config = {
	matcher: [
		// Skip all internal paths (_next) and api routes
		"/((?!_next|api).*)",
		// Optional: only run on root (/) URL
		// '/'
	],
};
