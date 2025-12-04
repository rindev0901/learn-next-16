import { NextResponse, type NextRequest } from "next/server";
import { fetchHelpers } from "./common";

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

	return refreshResponse;
}
