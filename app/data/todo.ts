import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "./auth";
import { DatabaseError } from "pg";

async function getTodos() {
	"use cache: private";
	cacheLife("max");

	const { user } = await requireAuth();

	cacheTag(`user-todos-${user.id}`);
	try {
		const result = await db.query(
			"SELECT id, title FROM todos WHERE user_id = $1",
			[user.id]
		);
		return result.rows;
	} catch (error) {
		// Extract meaningful error message
		let errorMessage = "Unknown error";

		if (error instanceof DatabaseError) {
			errorMessage = error.message;
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
	cacheLife("max");

	try {
		// Simulate fetching status from database
		const result = await db.query(
			"SELECT completed FROM todos WHERE id = $1 limit 1",
			[id]
		);

		return result.rows[0]?.completed ? "completed" : "pending";
	} catch (error) {
		// Extract meaningful error message
		let errorMessage = "Unknown error";

		if (error instanceof DatabaseError) {
			errorMessage = error.message;
		} else if (error instanceof Error) {
			errorMessage = error.message;
		} else {
			errorMessage = String(error);
		}

		console.error("Error fetching todos:", errorMessage);
		throw new Error(`Failed to fetch todos: ${errorMessage}`);
	}
}

async function getTodoById(id: string) {
	"use cache: remote";
	cacheTag(`todo-${id}`);
	cacheLife("max");
	try {
		const result = await db.query(
			"SELECT id, title, completed FROM todos WHERE id = $1 limit 1",
			[id]
		);

		return result.rows[0];
	} catch (error) {
		// Extract meaningful error message
		let errorMessage = "Unknown error";

		if (error instanceof DatabaseError) {
			errorMessage = error.message;
		} else if (error instanceof Error) {
			errorMessage = error.message;
		} else {
			errorMessage = String(error);
		}

		console.error("Error fetching todos:", errorMessage);
		throw new Error(`Failed to fetch todos: ${errorMessage}`);
	}
}
export { getTodos, getTodoStatusById, getTodoById };
