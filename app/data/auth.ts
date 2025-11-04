import { auth } from "@/lib/auth";
import { cacheLife, cacheTag } from "next/cache";
import { headers } from "next/headers";

async function getSession() {
	"use cache: private";
	cacheLife("max");
	const headersList = await headers();

	const session = await auth.api.getSession({
		headers: headersList, // pass the headers
	});

	if (session?.user) {
		cacheTag(`user-session-${session.user.id}`, `user-${session.user.email}`);
	}

	return session;
}

export { getSession };
