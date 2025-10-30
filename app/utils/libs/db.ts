import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
	throw new Error(
		"DATABASE_URL environment variable is not defined. Please add it to your .env.local file."
	);
}

const db = new Pool({
	connectionString: process.env.DATABASE_URL,
});

export { db };
