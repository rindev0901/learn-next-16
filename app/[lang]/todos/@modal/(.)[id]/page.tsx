import TodoModal from "./modal";

export default async function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <TodoModal params={params} />;
}
