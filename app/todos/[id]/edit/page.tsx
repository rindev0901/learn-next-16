import { connection } from "next/server";
import EditTodoForm from "./form";
import { getTodoById } from "@/app/data/todo";

export default async function EditTodoPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	await connection();

	const { id } = await params;

	const todo = await getTodoById(id);

	return <EditTodoForm id={id} todo={todo} />;
}
