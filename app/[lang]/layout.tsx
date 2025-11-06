import "@/app/globals.css";
import { locales } from "@/proxy";
import Header from "@/lang/components/header";

export function generateStaticParams() {
	return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
	children,
	params,
}: LayoutProps<"/[lang]">) {
	const { lang } = await params;

	return (
		<>
			<Header lang={lang} />
			<div className="container mx-auto my-10">{children}</div>
		</>
	);
}
