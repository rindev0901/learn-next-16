export default function MdxLayout({ children }: { children: React.ReactNode }) {
	// Create any shared layout or styles here
	// dark:prose-invert already handles all dark mode prose styling
	return (
		<div className="max-w-xs xs:max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-foreground prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-invert">
			{children}
		</div>
	);
}
