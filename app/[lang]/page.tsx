import { getDictionary } from "./dictionaries";
import { locales } from "@/proxy";

export function generateStaticParams() {
	return locales.map((lang) => ({ lang }));
}

export default async function Page({
	params,
}: {
	params: Promise<{ lang: "en" | "nl" }>;
}) {
	const { lang } = await params;

	const dict = await getDictionary(lang); // en
	return <button>{dict.products.cart}</button>; // Add to Cart
}
