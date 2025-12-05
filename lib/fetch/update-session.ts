import { NextResponse, type NextRequest } from "next/server";
import { fetchHelpers } from "./common";
import { auth } from "@/lib/auth";
import { locales } from "@/proxy";

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
	const acceptLanguage = request.headers.get("accept-language");
	if (!acceptLanguage) return locales[0];

	const languages = acceptLanguage.split(",").map((lang) => lang.trim());
	const matchedLocale = languages.find((lang) =>
		locales.includes(lang as never)
	);
	return matchedLocale || locales[0];
}

export async function updateSession(request: NextRequest) {
	let refreshResponse = NextResponse.next({
		request,
	});

	// With Fluid compute, don't put this client in a global environment
	// variable. Always create a new one on each request.
	await fetchHelpers.get("/claims", {
		...request,
		getCookies() {
			return request.cookies.getAll();
		},
		setCookies(cookiesToSet) {
			cookiesToSet.forEach(({ name, value }) =>
				request.cookies.set(name, value)
			);
			refreshResponse = NextResponse.next({
				request,
			});
			cookiesToSet.forEach(({ name, value, options }) => {
				refreshResponse.cookies.set(name, value, options);
			});
		},
	});

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

	if (pathnameHasLocale || pathname.startsWith("/api/")) {
		return refreshResponse;
	}

	// Redirect if there is no locale
	const locale = getLocale(request);
	request.nextUrl.pathname = `/${locale}${pathname}`;
	// e.g. incoming request is /products
	// The new URL is now /en-US/products
	return NextResponse.redirect(request.nextUrl);
}
