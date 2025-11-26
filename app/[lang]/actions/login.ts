"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { redirect } from "next/navigation";

/*
- Error Handling
		When you call an API endpoint on the server, it will throw an error if the request fails.
		You can catch the error and handle it as you see fit. The error instance is an instance of APIError.
*/

export async function login(email: string, password: string, lang: string) {
	try {
		await auth.api.signInEmail({
			body: { email, password },
		});
	} catch (error) {
		console.log("Login error > ", error);
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
	redirect(`/${lang}`);
}
