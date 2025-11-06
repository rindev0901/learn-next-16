import { requireAuth } from "@/app/data/auth";
import { getDictionary } from "./dictionaries";
import { Lang } from "@/proxy";

export default async function Page({
	params,
}: {
	params: Promise<{ lang: Lang }>;
}) {
	await requireAuth();
	const { lang } = await params;

	const dict = await getDictionary(lang); // en
	return <button>{dict.products.cart}</button>; // Add to Cart
}
