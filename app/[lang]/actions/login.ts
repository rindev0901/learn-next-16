"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function login(email: string, password: string, lang: string) {
	const { user } = await auth.api.signInEmail({
		body: { email, password },
	});

	if (user) {
		redirect(`/${lang}`);
	}

	return {
		error: "Login failed. Please try again.",
	};
}
