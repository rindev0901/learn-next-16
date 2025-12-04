import { SerializeOptions } from "cookie";
import { parseCookieHeader } from "../helpers";

export type CookieOptions = Partial<SerializeOptions>;

export type CookieGetMethod = () =>
	| Promise<{ name: string; value: string }[]>
	| { name: string; value: string }[];

export type CookieSetMethod = (
	cookies: { name: string; value: string; options?: CookieOptions }[]
) => Promise<void> | void;

export type FetchResult = {
	response: Response;
	cookiesToSet?: { name: string; value: string; options?: CookieOptions }[];
};

export type FetchWithCookiesOptions = RequestInit & {
	baseURL?: string;
	autoRefresh?: boolean;
	refreshEndpoint?: string;
	getCookies?: CookieGetMethod;
	setCookies?: CookieSetMethod;
};

// Global refresh promise to prevent race conditions
let refreshPromise: Promise<boolean> | null = null;

/**
 * Common fetch utility with cookie handling and automatic token refresh.
 * Returns both the response and any cookies that need to be set.
 *
 * @example
 * ```ts
 * // In a Route Handler
 * export async function GET(request: Request) {
 *   const { response, cookiesToSet } = await fetchWithCookies(
 *     'https://api.example.com/user',
 *     { getCookies: () => request.cookies.getAll() }
 *   );
 *
 *   const data = await response.json();
 *   const nextResponse = NextResponse.json(data);
 *
 *   // Set cookies in the response
 *   if (cookiesToSet) {
 *     cookiesToSet.forEach(({ name, value, options }) =>
 *       nextResponse.cookies.set(name, value, options)
 *     );
 *   }
 *
 *   return nextResponse;
 * }
 * ```
 */
export async function fetchWithCookies(
	url: string,
	options: FetchWithCookiesOptions = {}
): Promise<FetchResult> {
	const {
		baseURL = process.env.NEXT_PUBLIC_API_URL,
		autoRefresh = true,
		refreshEndpoint = "/refresh-token",
		getCookies,
		setCookies,
		headers: userHeaders,
		...fetchOptions
	} = options;

	// Build full URL
	const fullURL = url.startsWith("http")
		? url
		: baseURL
		? `${baseURL}${url.startsWith("/") ? "" : "/"}${url}`
		: url;

	// Helper to get cookie header string
	const getCookieHeader = async (): Promise<string> => {
		if (!getCookies) return "";
		const cookies = await getCookies();
		return cookies.map((c) => `${c.name}=${c.value}`).join("; ");
	};

	// Track cookies that need to be set
	let cookiesToSet: { name: string; value: string; options?: CookieOptions }[] =
		[];

	// Helper to extract and optionally set cookies from response
	const extractCookiesFromResponse = async (response: Response) => {
		const setCookieHeader = response.headers.get("set-cookie");
		if (setCookieHeader) {
			const parsedCookies = parseCookieHeader(setCookieHeader);
			const newCookies = parsedCookies.map((cookie) => ({
				name: cookie.name,
				value: cookie.value || "",
				options: cookie.options,
			}));

			// Add to collection
			cookiesToSet.push(...newCookies);

			// Call setCookies if provided (for backward compatibility)
			if (setCookies) {
				await setCookies(newCookies);
			}
		}
	};

	// Merge headers with cookie
	const headers = new Headers(userHeaders);

	if (!headers.has("cookie") && getCookies) {
		const cookieHeader = await getCookieHeader();
		if (cookieHeader) {
			headers.set("cookie", cookieHeader);
		}
	}

	// Make initial request
	let response = await fetch(fullURL, {
		...fetchOptions,
		headers,
		credentials: fetchOptions.credentials || "include",
	});
	// Handle token refresh on 401
	if (response.status === 401 && autoRefresh) {
		// If a refresh is already in progress, wait for it
		if (refreshPromise) {
			const refreshed = await refreshPromise;
			if (refreshed) {
				// Retry with new tokens after refresh completes
				const retryHeaders = new Headers(userHeaders);
				const updatedCookieHeader = await getCookieHeader();
				if (updatedCookieHeader) {
					retryHeaders.set("cookie", updatedCookieHeader);
				}

				response = await fetch(fullURL, {
					...fetchOptions,
					headers: retryHeaders,
					credentials: fetchOptions.credentials || "include",
				});

				await extractCookiesFromResponse(response);
			}
		} else {
			// Start a new refresh
			refreshPromise = (async () => {
				try {
					const refreshURL = baseURL
						? `${baseURL}${refreshEndpoint}`
						: refreshEndpoint;

					const cookieHeader = await getCookieHeader();
					const refreshResponse = await fetch(refreshURL, {
						method: "POST",
						headers: {
							cookie: cookieHeader,
						},
						credentials: "include",
					});

					if (refreshResponse.ok) {
						// Extract cookies from refresh response
						await extractCookiesFromResponse(refreshResponse);
						return true;
					}
					return false;
				} catch (error) {
					console.error("Token refresh failed:", error);
					return false;
				} finally {
					// Clear the refresh promise after completion
					refreshPromise = null;
				}
			})();

			const refreshed = await refreshPromise;

			if (refreshed) {
				// Retry original request with new tokens
				const retryHeaders = new Headers(userHeaders);
				const updatedCookieHeader = await getCookieHeader();

				if (updatedCookieHeader) {
					retryHeaders.set("cookie", updatedCookieHeader);
				}

				response = await fetch(fullURL, {
					...fetchOptions,
					headers: retryHeaders,
					credentials: fetchOptions.credentials || "include",
				});

				// Extract cookies from retry response if present
				await extractCookiesFromResponse(response);
			}
		}
	}

	return {
		response,
		cookiesToSet: cookiesToSet.length > 0 ? cookiesToSet : undefined,
	};
}

/**
 * Helper functions for common HTTP methods
 * Note: These helpers only return the JSON data. If you need to set cookies,
 * use fetchWithCookies directly to access cookiesToSet.
 */
export const fetchHelpers = {
	async get<T = any>(
		url: string,
		options?: FetchWithCookiesOptions
	): Promise<T> {
		const { response } = await fetchWithCookies(url, {
			...options,
			method: "GET",
		});
		return response.json();
	},

	async post<T = any>(
		url: string,
		options?: FetchWithCookiesOptions
	): Promise<T> {
		const { response } = await fetchWithCookies(url, {
			...options,
			method: "POST",
		});
		return response.json();
	},

	async put<T = any>(
		url: string,
		options?: FetchWithCookiesOptions
	): Promise<T> {
		const { response } = await fetchWithCookies(url, {
			...options,
			method: "PUT",
		});
		return response.json();
	},

	async patch<T = any>(
		url: string,
		options?: FetchWithCookiesOptions
	): Promise<T> {
		const { response } = await fetchWithCookies(url, {
			...options,
			method: "PATCH",
		});
		return response.json();
	},

	async delete<T = any>(
		url: string,
		options?: FetchWithCookiesOptions
	): Promise<T> {
		const { response } = await fetchWithCookies(url, {
			...options,
			method: "DELETE",
		});
		return response.json();
	},
};
