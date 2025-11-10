"use server";

import { requireAuth } from "@/app/data/auth";
import { auth } from "@/lib/auth";
import { Permission } from "@/lib/permissions";
import { forbidden } from "next/navigation";

export async function hasPermission(permissions: Permission) {
	const {
		user: { id: userId },
	} = await requireAuth();

	try {
		const result = await auth.api.userHasPermission({
			body: {
				userId,
				permissions,
			},
		});

		if (!result.success) {
			forbidden();
		}
		return result;
	} catch (error) {
		if (error instanceof Error) {
			return {
				success: false,
				error: error.message,
			};
		}

		return {
			success: false,
			error: "An unexpected error occurred.",
		};
	}
}
