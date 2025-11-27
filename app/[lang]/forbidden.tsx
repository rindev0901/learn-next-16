import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Route } from "next";

export default function ForbiddenPage() {
	return (
		<main className="flex flex-col items-center justify-center p-4 mt-44">
			<div className="w-full max-w-md space-y-6 text-center">
				{/* Error Icon */}
				<div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
					<ShieldX className="h-12 w-12 text-destructive" />
				</div>

				{/* Error Message */}
				<div className="space-y-2">
					<h1 className="text-4xl font-bold">403 - Forbidden</h1>
					<p className="text-lg text-muted-foreground">
						You don&apos;t have permission to access this resource.
					</p>
					<p className="text-sm text-muted-foreground">
						If you believe this is an error, please contact your administrator.
					</p>
				</div>

				{/* Actions */}
				<div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
					<Button asChild variant="default">
						<Link href={`/` as Route}>Go to Home</Link>
					</Button>
				</div>
			</div>
		</main>
	);
}
