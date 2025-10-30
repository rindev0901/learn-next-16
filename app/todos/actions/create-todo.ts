"use server";

import { db } from "@/app/utils/libs/db";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { DatabaseError } from "pg";
import z from "zod";

export type CreateTodoActionState = {
	title?: string;
	completed?: boolean;
	success?: boolean;
	errors?:
		| {
				title?: string[];
				completed?: string[];
		  }
		| string;
};
const createTodoSchema = z.object({
	title: z.string().min(1, "Title is required"),
	completed: z.coerce.boolean().optional().default(false),
});

export async function createTodo(
	_prevState: CreateTodoActionState,
	data: FormData
): Promise<CreateTodoActionState> {
	// Validate the incoming data
	const validatedFields = createTodoSchema.safeParse(Object.fromEntries(data));
	if (!validatedFields.success) {
		return {
			success: false,
			errors: z.flattenError(validatedFields.error).fieldErrors,
		};
	}
	let id = null;
	const { title, completed } = validatedFields.data;
	try {
		const result = await db.query(
			"INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING id",
			[title, completed]
		);

		// Check if any rows were actually updated
		if (result.rowCount === 0) {
			return {
				success: false,
				errors: "Occurred an error creating the todo",
			};
		}
		id = result.rows[0].id;
		updateTag("todos");
	} catch (error) {
		if (error instanceof DatabaseError) {
			return {
				success: false,
				errors: `Database error creating todo: ${error.message}`,
			};
		}
		return { success: false, errors: `Unknown error` };
	}

	if (!id) {
		return { success: false, errors: "Can not retrieve todo ID" };
	}

	redirect("/todos");
}
