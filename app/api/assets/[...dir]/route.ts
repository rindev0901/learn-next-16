import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	ctx: RouteContext<"/api/assets/[...dir]">
) {
	const dir = (await ctx.params).dir.join("/");

	// Prevent path traversal attacks
	if (dir.indexOf("..") >= 0) {
		return new NextResponse(null, { status: 400 });
	}

	try {
		// Read and serve the file
		const data = fs.readFileSync("public/" + dir, { flag: "r" });

		return new NextResponse(data, { status: 200 });
	} catch (error) {
		console.log(error);
		return new NextResponse(null, { status: 500 });
	}
}
