"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function logout(userId: string, lang: string) {
	const headerList = await headers();
	const { success } = await auth.api.signOut({ headers: headerList });
	if (success) {
		redirect(`/${lang}/login`);
	}

	return {
		error: "Logout failed. Please try again.",
	};
}
