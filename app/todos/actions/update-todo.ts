"use server";

import { db } from "@/app/utils/libs/db";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { DatabaseError } from "pg";
import z from "zod";

export type EditTodoActionState = {
	id: string;
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
const updateTodoSchema = z.object({
	title: z.string().min(1, "Title is required"),
	completed: z.coerce.boolean().optional().default(false),
});

export async function updateTodo(
	_prevState: EditTodoActionState,
	data: FormData
): Promise<EditTodoActionState> {
	// Validate the incoming data
	const validatedFields = updateTodoSchema.safeParse(Object.fromEntries(data));
	if (!validatedFields.success) {
		return {
			id: _prevState.id,
			success: false,
			errors: z.flattenError(validatedFields.error).fieldErrors,
		};
	}

	const { title, completed } = validatedFields.data;
	try {
		const result = await db.query(
			"UPDATE todos SET title = $1, completed = $2 WHERE id = $3",
			[title, completed, _prevState.id]
		);

		// Check if any rows were actually updated
		if (result.rowCount === 0) {
			return {
				id: _prevState.id,
				success: false,
				errors: `Todo with id ${_prevState.id} not found`,
			};
		}

		updateTag("todos");
		updateTag(`todo-${_prevState.id}`);
	} catch (error) {
		if (error instanceof DatabaseError) {
			return {
				id: _prevState.id,
				success: false,
				errors: `Database error updating todo: ${error.message}`,
			};
		}
		return { id: _prevState.id, success: false, errors: `Unknown error` };
	}

	redirect("/todos");
}
