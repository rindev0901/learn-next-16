import { connection } from "next/server";
import EditTodoForm from "./form";
import { getTodoById } from "@/app/data/todo";
import { requireAuth } from "@/app/data/auth";

export default async function EditTodoPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const {
		user: { id: userId },
	} = await requireAuth();
	await connection();

	const { id } = await params;
	const todo = await getTodoById(id, userId);
	return <EditTodoForm id={id} todo={todo} />;
}
