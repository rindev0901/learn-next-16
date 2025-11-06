"use server";

import { requireAuth } from "@/app/data/auth";
import { auth } from "@/lib/auth";
import { Permission } from "@/lib/permissions";

export async function hasPermission(permissions: Permission) {
	const {
		user: { id: userId },
	} = await requireAuth();

	try {
		return await auth.api.userHasPermission({
			body: {
				userId,
				permissions,
			},
		});
	} catch (error) {
		if (error instanceof Error) {
			return {
				error: error.message,
			};
		}

		return {
			error: "An unexpected error occurred.",
		};
	}
}
