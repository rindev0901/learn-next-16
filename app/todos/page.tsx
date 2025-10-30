import { Suspense } from "react";
import TodoList from "./components/todo-list";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function TodosPage() {
	return (
		<div className="space-y-3">
			<div className="flex items-center gap-3">
				<h1>Todos Page:</h1>
				<Link href="/todos/create" className={buttonVariants({ size: "sm" })}>
					Create New Todo
				</Link>
			</div>
			<Suspense
				fallback={
					<div className="flex flex-col gap-3">
						<Skeleton className="w-[120px] h-4" />
						<Skeleton className="w-[120px] h-4" />
						<Skeleton className="w-[120px] h-4" />
					</div>
				}
			>
				<TodoList />
			</Suspense>
		</div>
	);
}
