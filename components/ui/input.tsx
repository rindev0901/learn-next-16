import * as React from "react";

import { cn } from "@/lib/utils";

type Props = {
	errors?: string[];
	name: string;
};

function Input({
	errors,
	name,
	className,
	type,
	...otherProps
}: Props & React.ComponentProps<"input">) {
	return (
		<div className="w-full">
			<input
				id={name}
				name={name}
				type={type}
				data-slot="input"
				className={cn(
					"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
					"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
					"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
					className
				)}
				{...otherProps}
			/>
			{errors && <p className="text-destructive text-sm">{errors[0]}</p>}
		</div>
	);
}

export { Input };
