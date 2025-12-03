import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	const body = await request.json();

	await db.query(`INSERT INTO reports (report_name, content) VALUES ($1, $2)`, [
		"error",
		JSON.stringify(body),
	]);

	return new Response(JSON.stringify({ success: true }), { status: 200 });
}
