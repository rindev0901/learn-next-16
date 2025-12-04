'use client';

import { Button } from "@/components/ui/button";

export default function TokenBtn() {
	return (
		<Button
			onClick={() => {
				fetch("/api/refresh-token", {
					method: "POST",
				});
			}}
		>
			Refresh Token
		</Button>
	);
}
