import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "./auth";
import { DatabaseError } from "pg";
import { DataPagination } from "@/types/pagination";
import { Pagination, pagingSchema } from "@/schemas/pagination";

type Todo = {
	id: string;
	title: string;
	completed: boolean;
};

async function getTodos(
	formData: Partial<Pagination>
): Promise<DataPagination<Todo>> {
	"use cache: private";
	cacheLife("max");

	const { data } = pagingSchema.safeParse(formData);

	const currentPage = data!.currentPage;
	const pageSize = data!.pageSize;

	const { user } = await requireAuth();

	cacheTag(`user-todos-${user.id}`);
	try {
		// 1. Get total items
		const countResult = await db.query(
			"SELECT COUNT(*) AS total FROM todos WHERE user_id = $1",
			[user.id]
		);
		const totalItems = Number(countResult.rows[0].total);

		// 2. Get pagination data
		const result = await db.query(
			`
			SELECT id, title, completed
			FROM todos
			WHERE user_id = $1
			ORDER BY created_at DESC
			OFFSET $2 LIMIT $3
			`,
			[user.id, (currentPage - 1) * pageSize, pageSize]
		);

		// 3. Build response
		return {
			data: result.rows,
			paging: {
				currentPage,
				pageSize,
				totalItems,
				totalPages: Math.ceil(totalItems / pageSize),
			},
		};
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
