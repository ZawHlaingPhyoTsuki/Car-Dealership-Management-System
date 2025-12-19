import { type NextRequest, NextResponse } from "next/server";
import { paths } from "./config/paths";
import { auth } from "./lib/auth";

export default async function proxy(request: NextRequest) {
	// Get session
	const session = await auth.api.getSession({
		headers: request.headers,
	});

	// If no session - redirect to login page
	if (!session) {
		const loginUrl = new URL(paths.login.getHref(), request.url);
		return NextResponse.redirect(loginUrl);
	}

	// Session exists - allow request
	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard", "/dashboard/:path*"],
};
