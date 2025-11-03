import { cacheLife, cacheTag } from "next/cache";
import "server-only";
import { notFound } from "next/navigation";

const supportedLocales = ["en", "nl"];

export const getDictionary = async (locale: "en" | "nl") => {
	"use cache";

	if (!supportedLocales.includes(locale)) {
		notFound();
	}

	cacheTag(locale);
	cacheLife("max");

	// Fetch via API route
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002";
	const response = await fetch(
		`${baseUrl}/api/assets/dictionaries/${locale}.json`
	);

	if (!response.ok) {
		throw new Error(`Failed to load dictionary for locale: ${locale}`);
	}

	return await response.json();
};
