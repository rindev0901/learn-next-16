import UserProfile from "./user-profile";
import { Suspense } from "react";

export default async function Header() {
	return (
		<header className="mb-8 flex items-center justify-between p-4">
			<h1 className="text-3xl font-bold">My Application</h1>

			<Suspense fallback={<div>Loading...</div>}>
				<UserProfile />
			</Suspense>
		</header>
	);
}
