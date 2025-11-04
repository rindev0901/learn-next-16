import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";

async function getTodos() {
	"use cache";
	cacheTag("todos");
	cacheLife("custom"); // Minimum 5 minutes to pre-render at build time, otherwise partial pre-render at build time

	try {
		const result = await db.query("SELECT id, title FROM todos");
		return result.rows;
	} catch (error) {
		// Extract meaningful error message
		let errorMessage = "Unknown error";

		if (error instanceof AggregateError) {
			errorMessage = error.errors
				.map((e) => (e instanceof Error ? e.message : String(e)))
				.join("; ");
		} else if (error instanceof Error) {
			errorMessage = error.message;
		} else {
			errorMessage = String(error);
		}

		console.error("Error fetching todos:", errorMessage);
		throw new Error(`Failed to fetch todos: ${errorMessage}`);
	}
}

async function getTodoStatusById(id: string) {
	"use cache: remote";
	cacheTag(`todo-status-${id}`);
	cacheLife("max"); // 1 hour

	// Simulate fetching status from database
	const result = await db.query(
		"SELECT completed FROM todos WHERE id = $1 limit 1",
		[id]
	);

	return result.rows[0]?.completed ? "completed" : "pending";
}

async function getTodoById(id: string) {
	"use cache: remote";
	cacheTag(`todo-${id}`);
	cacheLife("max"); // 1 hour

	const result = await db.query(
		"SELECT id, title, completed FROM todos WHERE id = $1 limit 1",
		[id]
	);

	return result.rows[0];
}
export { getTodos, getTodoStatusById, getTodoById };
