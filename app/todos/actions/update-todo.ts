"use server";

import { db } from "@/app/utils/libs/db";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { DatabaseError } from "pg";
import z from "zod";

const updateTodoSchema = z.object({
	title: z.string().min(5, "Title must be at least 5 characters long"),
	completed: z.coerce.boolean().optional().default(false),
	general: z.string().optional(),
});
type EditTodoFormValues = z.infer<typeof updateTodoSchema>;
export type EditTodoSchemaErrorType =
	z.ZodFlattenedError<EditTodoFormValues>["fieldErrors"];

export type EditTodoActionState = {
	data: EditTodoFormValues;
	success?: boolean;
	errors?: EditTodoSchemaErrorType;
};

export async function updateTodo(
	id: string,
	_prevState: EditTodoActionState,
	formData: FormData | null
): Promise<EditTodoActionState> {
	// Validate the incoming data
	if (formData === null) {
		return _prevState;
	}
	const data = Object.fromEntries(formData);
	const validatedFields = updateTodoSchema.safeParse(data);
	const failureData = data as unknown as EditTodoFormValues;
	if (!validatedFields.success) {
		return {
			data: failureData,
			success: false,
			errors: z.flattenError(validatedFields.error).fieldErrors,
		};
	}

	const { title, completed } = validatedFields.data;
	try {
		const result = await db.query(
			"UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING title, completed",
			[title, completed, id]
		);

		// Check if any rows were actually updated
		if (result.rowCount === 0) {
			return {
				data: failureData,
				success: false,
				errors: {
					general: [`Todo with id ${id} not found`],
				},
			};
		}

		updateTag("todos");
		updateTag(`todo-${id}`);
		updateTag(`todo-status-${id}`);
		// return { success: true, data: result.rows[0] };
	} catch (error) {
		if (error instanceof DatabaseError) {
			return {
				data: failureData,
				success: false,
				errors: {
					general: [`Database error updating todo: ${error.message}`],
				},
			};
		}
		return { data: failureData, success: false, errors: { general: [`Unknown error`] } };
	}
	redirect(`/todos`);
}
