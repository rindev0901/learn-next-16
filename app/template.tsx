import Header from "./[lang]/components/header";

export default function Template({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Header />
			<div className="container mx-auto">{children}</div>
		</>
	);
}
