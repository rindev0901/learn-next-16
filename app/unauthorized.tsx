import LoginPage from "@/lang/login/page";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
	return (
		<main className="flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-md space-y-8">
				{/* Error Message Card */}
				<div className="rounded-lg border bg-card p-8 text-center shadow-lg">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
						<ShieldAlert className="h-8 w-8 text-destructive" />
					</div>
					<h1 className="mb-2 text-2xl font-bold">401 - Unauthorized</h1>
					<p className="text-muted-foreground text-sm">
						You need to be logged in to access this page.
					</p>
				</div>

				{/* Login Form */}
				<LoginPage className="min-h-[unset]" />
			</div>
		</main>
	);
}
