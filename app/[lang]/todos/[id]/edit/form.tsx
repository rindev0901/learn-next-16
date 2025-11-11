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
import { useActionState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { updateTodo } from "@/lang/todos/actions/update-todo";
import { useLocale } from "@/app/hooks/useLocale";

export default function EditTodoForm({ id, todo }: { id: string; todo: any }) {
	const locale = useLocale();

	const updateTodoById = updateTodo.bind(null, id);
	const [state, formAction, pending] = useActionState(updateTodoById, {
		data: { completed: todo.completed, title: todo.title, locale },
		success: false,
	});

	const router = useRouter();

	return (
		<Form action={formAction} className="w-full max-w-md">
			<FieldSet>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="title">Title</FieldLabel>
						<Input
							id="locale"
							name="locale"
							type="hidden"
							defaultValue={locale}
						/>
						<Input
							id="title"
							name="title"
							type="text"
							placeholder="Todo Title"
							defaultValue={state.data.title}
							errors={state.errors?.title}
						/>
						<FieldDescription>
							Enter a descriptive title for your todo.
						</FieldDescription>
					</Field>

					<Field orientation="horizontal">
						<Checkbox
							id="completed"
							name="completed"
							defaultChecked={state.data.completed}
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
			{state.errors?.general && (
				<Alert variant="destructive" className="mt-4">
					<AlertCircle />
					<AlertDescription>
						{state.errors.general.map((error) => (
							<p key={error}>{error}</p>
						))}
					</AlertDescription>
				</Alert>
			)}
		</Form>
	);
}
