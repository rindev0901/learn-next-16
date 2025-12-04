import { parse, serialize, SerializeOptions } from "cookie";

/**
 * Parse a Set-Cookie header string into an array of cookie objects with options
 */
export function parseCookieHeader(
	header: string,
): { name: string; value?: string; options: SerializeOptions }[] {
	// Split multiple Set-Cookie headers
	const cookieStrings = header.split(/,(?=[^;]+?=)/);

	return cookieStrings.map((cookieString) => {
		// Split into main part and attributes
		const parts = cookieString.split(";").map((p) => p.trim());
		const [mainPart, ...attributes] = parts;

		// Parse name=value
		const [name, value] = mainPart.split("=");

		// Parse attributes
		const options: SerializeOptions = {};

		attributes.forEach((attr) => {
			const [key, val] = attr.split("=").map((s) => s.trim());
			const lowerKey = key.toLowerCase();

			if (lowerKey === "path") {
				options.path = val;
			} else if (lowerKey === "domain") {
				options.domain = val;
			} else if (lowerKey === "expires") {
				options.expires = new Date(val);
			} else if (lowerKey === "max-age") {
				options.maxAge = parseInt(val, 10);
			} else if (lowerKey === "samesite") {
				options.sameSite = val.toLowerCase() as SerializeOptions["sameSite"];
			} else if (lowerKey === "httponly") {
				options.httpOnly = true;
			} else if (lowerKey === "secure") {
				options.secure = true;
			}
		});

		return {
			name: name.trim(),
			value: value?.trim(),
			options,
		};
	});
}

/**
 * Serialize cookie name and value into a Set-Cookie header string
 */
export function serializeCookieHeader(
	name: string,
	value: string,
	options?: SerializeOptions
): string {
	return serialize(name, value, options);
}
