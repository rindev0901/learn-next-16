/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Form from "next/form";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { updateTodo } from "@/app/todos/actions/update-todo";
import { useActionState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EditTodoForm({ id, todo }: { id: string; todo: any }) {
	const [state, formAction, pending] = useActionState(updateTodo, { id });
	const router = useRouter();

	useEffect(() => {
		if (!state.success && state.errors) {
			if (typeof state.errors === "string") {
				toast.error(state.errors);
			} else {
				const message =
					state.errors.title?.join("<br/>") ||
					"" + state.errors.completed?.join("<br/>") ||
					"";
				toast.error(message);
			}
		} else if (state.success) {
			toast.success("Todo updated successfully!");
		}
	}, [state]);

	return (
		<Form action={formAction} className="w-full max-w-md">
			<FieldSet>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="title">Title</FieldLabel>
						<Input
							id="title"
							name="title"
							type="text"
							placeholder="Todo Title"
							defaultValue={todo.title}
						/>
						<FieldDescription>
							Enter a descriptive title for your todo.
						</FieldDescription>
					</Field>

					<Field orientation="horizontal">
						<Checkbox
							id="completed"
							name="completed"
							defaultChecked={todo.completed}
						/>
						<FieldLabel htmlFor="completed">Mark as Completed</FieldLabel>
					</Field>
					<Field orientation="horizontal">
						<Button
							variant="outline"
							type="button"
							disabled={pending}
							onClick={() => router.back()}
						>
							Cancel
						</Button>
						<Button type="submit">
							{pending ? (
								<>
									<Spinner /> Saving
								</>
							) : (
								"Save"
							)}
						</Button>
					</Field>
				</FieldGroup>
			</FieldSet>
		</Form>
	);
}
