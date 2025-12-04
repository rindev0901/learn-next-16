import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function GET(request: NextRequest) {
	const token = request.cookies.get("auth_token")?.value;

	if (!token) {
		return NextResponse.json("Not token found", { status: 403 });
	}

	const secret = new TextEncoder().encode(process.env.NEXT_PRIVATE_SECRET_KEY!);

	try {
		const { payload, protectedHeader } = await jose.jwtVerify(token, secret, {
			issuer: "urn:example:issuer",
			audience: "urn:example:audience",
		});

		return NextResponse.json(payload.exp, { status: 200 });
	} catch (error) {
		console.log("JWT verified error > ", error);
		if (error instanceof jose.errors.JWTExpired) {
			return NextResponse.json("Token expired", { status: 401 });
		}
		return NextResponse.json("Invalid token", { status: 403 });
	}
}
