"use client";

import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Route } from "next";

interface PaginationEllipsisInputProps {
	currentPage: number;
	totalPages: number;
	pageSize: number;
}

export function PaginationEllipsisInput({
	currentPage,
	totalPages,
	pageSize,
}: PaginationEllipsisInputProps) {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const page = parseInt(formData.get("page") as string);
		const size = parseInt(formData.get("size") as string);

		if (page > 0 && page <= totalPages && size > 0) {
			router.push(`?page=${page}&size=${size}` as Route);
			setOpen(false);
		}
	};

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<button className="flex size-9 items-center justify-center hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
					<MoreHorizontalIcon className="size-4" />
					<span className="sr-only">More pages</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-auto">
				<form onSubmit={handleSubmit} className="flex items-center gap-2 p-2">
					<div className="flex flex-col gap-1">
						<label
							htmlFor="page-input"
							className="text-xs text-muted-foreground"
						>
							Page
						</label>
						<Input
							id="page-input"
							name="page"
							type="number"
							min="1"
							max={totalPages}
							defaultValue={currentPage}
							className="w-20 h-8"
							autoFocus
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label
							htmlFor="size-input"
							className="text-xs text-muted-foreground"
						>
							Size
						</label>
						<Input
							id="size-input"
							name="size"
							type="number"
							min="1"
							defaultValue={pageSize}
							className="w-20 h-8"
						/>
					</div>
					<Button type="submit" size="sm" className="mt-5">
						Go
					</Button>
				</form>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
