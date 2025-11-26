import { Suspense } from "react";
import TodoList from "./components/todo-list";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Route } from "next";
import CreateTodoForm from "./create/form";

export default async function TodosPage({
	searchParams,
}: Partial<PageProps<"/[lang]/todos">>) {
	const { page, size } = (await searchParams) || {};

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-3">
				<h1>Todos Page:</h1>
				<Link
					href={"/todos/create" as Route}
					className={buttonVariants({ size: "sm" })}
				>
					Create New Todo
				</Link>
			</div>
			<div className="grid grid-cols-2">
				<Suspense
					fallback={
						<div className="flex flex-col gap-3">
							<Skeleton className="w-[120px] h-4" />
							<Skeleton className="w-[120px] h-4" />
							<Skeleton className="w-[120px] h-4" />
						</div>
					}
				>
					<TodoList currentPage={page as never} pageSize={size as never} />
				</Suspense>
				<CreateTodoForm isRedirect={false} />
			</div>
		</div>
	);
}
