/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTodos } from "@/app/data/todo";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function TodoList() {
	const todos = await getTodos();

	return (
		<ul className="space-y-2">
			{todos.map((todo: any) => (
				<li key={todo.id} className="flex items-center gap-4">
					<Link href={`/todos/${todo.id}`} className="underline">
						{todo.title}
					</Link>
					<Link
						className={buttonVariants({ variant: "outline", size: "sm" })}
						href={`/todos/${todo.id}/edit`}
					>
						Edit
					</Link>
				</li>
			))}
		</ul>
	);
}
