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
import { createTodo } from "@/lang/todos/actions/create-todo";
import { useLocale } from "@/app/hooks/useLocale";

export default function CreateTodoForm({
	isRedirect,
}: {
	isRedirect?: boolean;
}) {
	const locale = useLocale();
	const [state, formAction, pending] = useActionState(createTodo, {
		data: { title: "", locale, isRedirect },
	});

	const router = useRouter();

	return (
		<Form action={formAction} className="w-full max-w-md">
			<FieldSet>
				<FieldGroup>
					<Field>
						<Input
							id="locale"
							name="locale"
							type="hidden"
							defaultValue={locale}
						/>
						<FieldLabel htmlFor="title">Title</FieldLabel>
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
									<Spinner /> Creating
								</>
							) : (
								"Create"
							)}
						</Button>
					</Field>
				</FieldGroup>
			</FieldSet>
		</Form>
	);
}
