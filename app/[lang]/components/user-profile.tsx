import { getSession } from "@/app/data/auth";
import { buttonVariants } from "@/components/ui/button";
import { UserTrigger } from "./user-trigger";
import Link from "next/link";

export default async function UserProfile() {
	const session = await getSession();

	return session ? (
		<UserTrigger user={session.user} />
	) : (
		<Link href="/login" className={buttonVariants()}>
			Login
		</Link>
	);
}
