"use server";

import { requireAuth } from "@/app/data/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DatabaseError } from "pg";
import z from "zod";

const createTodoSchema = z.object({
	title: z.string().min(5, "Title must be at least 5 characters long"),
	completed: z.coerce.boolean().optional().default(false),
	locale: z.string().min(2).max(5),
	general: z.string().optional(),
});
type CreateTodoFormValues = z.infer<typeof createTodoSchema>;

export type CreateTodoSchemaErrorType =
	z.ZodFlattenedError<CreateTodoFormValues>["fieldErrors"];

export type CreateTodoActionState = {
	data: CreateTodoFormValues;
	success?: boolean;
	errors?: CreateTodoSchemaErrorType;
};

export async function createTodo(
	_prevState: CreateTodoActionState,
	currState: FormData
): Promise<CreateTodoActionState> {
	// Validate the incoming data
	const { user } = await requireAuth();
	const data = Object.fromEntries(currState);
	const failureData = data as unknown as CreateTodoFormValues;
	const validatedFields = createTodoSchema.safeParse(data);

	if (!validatedFields.success) {
		return {
			data: failureData,
			success: false,
			errors: z.flattenError(validatedFields.error).fieldErrors,
		};
	}
	let id = null;
	const { title, completed, locale } = validatedFields.data;
	try {
		const result = await db.query(
			"INSERT INTO todos (title, completed, user_id) VALUES ($1, $2, $3) RETURNING id",
			[title, completed, user.id]
		);

		// Check if any rows were actually updated
		if (result.rowCount === 0) {
			return {
				data: validatedFields.data,
				success: false,
				errors: {
					general: ["Occurred an error creating the todo"],
				},
			};
		}
		id = result.rows[0].id;
	} catch (error) {
		if (error instanceof DatabaseError) {
			return {
				data: failureData,
				success: false,
				errors: { general: [`Database error creating todo: ${error.message}`] },
			};
		}
		return {
			data: failureData,
			success: false,
			errors: { general: [`Unknown error`] },
		};
	}

	if (!id) {
		return {
			data: failureData,
			success: false,
			errors: { general: [`Can not retrieve todo ID`] },
		};
	}

	redirect(`/${locale}/todos`);
}
