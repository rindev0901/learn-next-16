import { fetchHelpers } from "@/lib/fetch/common";
import { cookies } from "next/headers";
import TokenBtn from "./token-btn";

export default async function TestPage() {
	const cookieStore = await cookies();

	const text = await fetchHelpers.get<string>("/test", {
		setCookies: (cookiesToSet) => {
			try {
				cookiesToSet.forEach(({ name, value, options }) =>
					cookieStore.set(name, value, options)
				);
			} catch {
				// The `setAll` method was called from a Server Component.
				// This can be ignored if you have middleware refreshing
				// user sessions.
			}
		},
		getCookies: async () => {
			return cookieStore.getAll();
		}
	});

	return (
		<div>
			{text} <TokenBtn />
		</div>
	);
}
