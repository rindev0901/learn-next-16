"use server";

import { requireAuth } from "@/app/data/auth";
import { forbidden } from "next/navigation";

export async function hasAdminRole() {
	const {
		user: { role: userRole },
	} = await requireAuth();

	if (!userRole || userRole === "user") {
		forbidden();
	}

	return true;
}
