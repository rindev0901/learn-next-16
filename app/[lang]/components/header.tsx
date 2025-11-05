import UserProfile from "./user-profile";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function UserProfileSkeleton() {
	return (
		<div className="flex items-center gap-2">
			<Skeleton className="h-10 w-10 rounded-lg" />
			<div className="space-y-2">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-3 w-32" />
			</div>
			<Skeleton className="ml-2 h-4 w-4" />
		</div>
	);
}

export default async function Header() {
	return (
		<header className="mb-8 flex items-center justify-between p-4">
			<h1 className="text-3xl font-bold">My Application</h1>

			<Suspense fallback={<UserProfileSkeleton />}>
				<UserProfile />
			</Suspense>
		</header>
	);
}
