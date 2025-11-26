import { getTodos } from "@/app/data/todo";
import { buttonVariants } from "@/components/ui/button";
import { Route } from "next";
import Link from "next/link";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Pagination as PaginationType } from "@/schemas/pagination";
import { PaginationEllipsisInput } from "./pagination-ellipsis-input";

export default async function TodoList(props: Partial<PaginationType>) {
	const {
		data: todos,
		paging: { currentPage, pageSize, totalPages = 1 },
	} = await getTodos(props);

	const getVisiblePages = () => {
		const pages: Array<number | "ellipsis"> = [];

		if (totalPages <= 7) {
			// Show all pages if 7 or fewer
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		// Always show first page
		pages.push(1);

		// Calculate range around current page
		const leftBound = Math.max(2, currentPage - 1);
		const rightBound = Math.min(totalPages - 1, currentPage + 1);

		// Add left ellipsis if there's a gap
		if (leftBound > 2) {
			pages.push("ellipsis");
		}

		// Add pages around current page
		for (let i = leftBound; i <= rightBound; i++) {
			pages.push(i);
		}

		// Add right ellipsis if there's a gap
		if (rightBound < totalPages - 1) {
			pages.push("ellipsis");
		}

		// Always show last page
		if (totalPages > 1) {
			pages.push(totalPages);
		}

		return pages;
	};

	const visiblePages = getVisiblePages();

	return (
		<div className="space-y-4">
			<ul className="space-y-2">
				{todos.map((todo) => (
					<li key={todo.id} className="flex items-center gap-4">
						<Link href={`/todos/${todo.id}` as Route} className="underline">
							{todo.title}
						</Link>
						<Link
							className={buttonVariants({ variant: "outline", size: "sm" })}
							href={`/todos/${todo.id}/edit` as Route}
						>
							Edit
						</Link>
					</li>
				))}
			</ul>
			<Pagination className="justify-start">
				<PaginationContent>
					{/* <PaginationItem>
						<PaginationPrevious
							isDisabled={currentPage === 1}
							href={`?page=${currentPage - 1}&size=${pageSize}` as Route}
						/>
					</PaginationItem> */}
					{visiblePages.map((page, index) =>
						page === "ellipsis" ? (
							<PaginationItem key={`ellipsis-${index}`}>
								<PaginationEllipsisInput
									currentPage={currentPage}
									totalPages={totalPages}
									pageSize={pageSize}
								/>
							</PaginationItem>
						) : (
							<PaginationItem key={page}>
								<PaginationLink
									href={`?page=${page}&size=${pageSize}` as Route}
									isActive={page === currentPage}
								>
									{page}
								</PaginationLink>
							</PaginationItem>
						)
					)}
					{/* <PaginationItem>
						<PaginationNext
							href={`?page=${currentPage + 1}&size=${pageSize}` as Route}
							isDisabled={currentPage === totalPages}
						/>
					</PaginationItem> */}
				</PaginationContent>
			</Pagination>
		</div>
	);
}
