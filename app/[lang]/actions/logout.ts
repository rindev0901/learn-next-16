"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function logout(lang: string, returnUrl: string) {
	try {
		const headerList = await headers();
		await auth.api.signOut({ headers: headerList });
	} catch (error) {
		if (error instanceof APIError) {
			return {
				error: error.message,
				statusCode: error.statusCode,
			};
		}
		return {
			error: "An unexpected error occurred.",
			statusCode: 500,
		};
	}
	redirect(`/${lang}/login?returnUrl=${encodeURIComponent(returnUrl)}`);
}
