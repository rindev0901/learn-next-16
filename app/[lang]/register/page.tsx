"use client";

import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			await signUp.email(
				{
					email,
					password,
					name,
				},
				{
					onSuccess: () => {
						toast.success("Account created successfully!");
						router.push("/login");
					},
					onError: (ctx) => {
						toast.error(ctx.error.message || "Failed to create account");
					},
				}
			);
		} catch {
			toast.error("An error occurred during registration");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="w-full max-w-md space-y-8 rounded-lg border p-8">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Create an account</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Enter your details to register
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="name">Name</FieldLabel>
							<Input
								id="name"
								name="name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								placeholder="John Doe"
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								id="email"
								name="name"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								placeholder="you@example.com"
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<Input
								id="password"
								name="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								placeholder="••••••••"
								minLength={8}
							/>
						</Field>
					</FieldGroup>

					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? "Creating account..." : "Sign up"}
					</Button>

					<p className="text-center text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link href="/login" className="font-medium underline">
							Sign in
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
