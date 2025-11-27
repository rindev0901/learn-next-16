import { Suspense } from "react";
import { connection } from "next/server";
import { getTodoStatusById } from "@/app/data/todo";
import { requireAuth } from "@/app/data/auth";

export default async function TodoDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	await requireAuth();

	const { id } = await params;

	return (
		<div>
			<TodoDetails id={id} />
			<Suspense fallback={<div>Loading status...</div>}>
				<TodoStatus todoId={id} />
			</Suspense>
		</div>
	);
}

function TodoDetails({ id }: { id: string }) {
	return <div>Todo: {id}</div>;
}

async function TodoStatus({ todoId }: { todoId: string }) {
	// Calling connection() makes this component dynamic, preventing
	// it from being included in the static shell. This ensures the price
	// is always fetched at request time.
	await connection();

	// Now we can cache the status in a remote cache handler.
	// Regular 'use cache' would NOT work here because we're in a dynamic context.
	const status = await getTodoStatusById(todoId);
	return <div>Status: {status}</div>;
}
