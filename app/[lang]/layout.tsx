import "@/app/globals.css";
import { locales } from "@/proxy";
import Header from "@/lang/components/header";

export function generateStaticParams() {
	return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
	children,
	params,
	modal,
}: LayoutProps<"/[lang]"> & { modal: React.ReactNode }) {
	const { lang } = await params;

	return (
		<>
			{modal}
			<Header lang={lang} />
			<div className="container mx-auto">{children}</div>
		</>
	);
}
