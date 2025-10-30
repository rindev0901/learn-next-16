import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
	const tag = req.nextUrl.searchParams.get("tag");
	const isSuccess = Boolean(tag);
	if (tag) {
		revalidateTag(tag, "max");
		return NextResponse.json({ revalidated: isSuccess, timestamp: Date.now() });
	}

	return NextResponse.json({ revalidated: isSuccess, timestamp: Date.now() });
}
