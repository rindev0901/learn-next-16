"use client";

import { useRouter } from "next/navigation";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export default function TodoModal({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const router = useRouter();
	const [id, setId] = useState<string>("");

	useEffect(() => {
		params.then((p) => setId(p.id));
	}, [params]);

	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			router.back();
		}
	};

	return (
		<Dialog open={true} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Todo Details</DialogTitle>
					<DialogDescription>Viewing details for todo #{id}</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<h3 className="font-medium">Todo ID</h3>
						<p className="text-sm text-muted-foreground">{id}</p>
					</div>
					{/* Add more todo details here */}
				</div>
			</DialogContent>
		</Dialog>
	);
}
