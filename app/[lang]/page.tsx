import { getDictionary } from "./dictionaries";
import { Lang } from "@/proxy";
import Link from "next/link";

export default async function Page({
	params,
}: {
	params: Promise<{ lang: Lang }>;
}) {
	const { lang } = await params;

	const dict = await getDictionary(lang); // en
	return (
		<div className="flex flex-col items-start">
			<button>{dict.products.cart}</button>
			<Link href={`/${lang}/todos`} className="underline">Todos</Link>
		</div>
	); // Add to Cart
}
