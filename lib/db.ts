import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
	path: path.resolve(process.cwd(), ".env.local"),
});
// Use connection string or fall back to individual parameters

const db = new Pool({
	connectionString:
		process.env.NEXT_PUBLIC_NODE_ENV === "production"
			? process.env.DATABASE_URL_CLOUD
			: process.env.DATABASE_URL,
});

// Test connection on initialization (optional but helps catch errors early)
db.on("error", (err) => {
	console.error("Unexpected database pool error:", err);
});

export { db };
