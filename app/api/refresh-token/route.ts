import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function POST(request: NextRequest) {
	const secret = new TextEncoder().encode(process.env.NEXT_PRIVATE_SECRET_KEY!);
	const alg = "HS256";

	const jwt = await new jose.SignJWT({ "urn:example:claim": true })
		.setProtectedHeader({ alg })
		.setIssuedAt()
		.setIssuer("urn:example:issuer")
		.setAudience("urn:example:audience")
		.setExpirationTime("1min")
		.sign(secret);


	const response = NextResponse.json({ token: jwt, success: true });

	// Set JWT as HTTP-only cookie
	response.cookies.set("auth_token", jwt, {
		httpOnly: true,
	});

	return response;
}
