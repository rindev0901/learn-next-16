import { Suspense } from "react";
import TodoList from "./components/todo-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function TodosPage() {
	return (
		<div>
			<h1>Todos Page:</h1>
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
