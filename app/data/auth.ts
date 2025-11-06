import { auth } from "@/lib/auth";
import { cacheLife, cacheTag } from "next/cache";
import { headers } from "next/headers";
import { unauthorized } from "next/navigation";

/*
	Good to know: Unlike use cache, private caches are not prerendered statically
	as they contain personalized data that is not shared between users.

	** Must suspense at build time **
*/

async function getSession() {
	"use cache: private";
	cacheLife("max");
	const headersList = await headers();

	const session = await auth.api.getSession({
		headers: headersList, // pass the headers
	});

	if (session?.user) {
		cacheTag(`user-session-${session.user.id}`);
	}

	return session;
}

async function requireAuth() {
	const session = await getSession();
	if (!session?.session) {
		unauthorized();
	}
}

export { getSession, requireAuth };
