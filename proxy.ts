import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

function appendSetCookieHeaders(
  response: NextResponse,
  setCookieHeader: string | string[] | undefined,
): void {
  if (!setCookieHeader) {
    return;
  }

  const cookieList = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  for (const cookie of cookieList) {
    response.headers.append("set-cookie", cookie);
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  let isAuthenticated = Boolean(accessToken);
  let refreshedSetCookie: string | string[] | undefined;

  if (!isAuthenticated && refreshToken) {
    try {
      const sessionRes = await checkSession();
      refreshedSetCookie = sessionRes.headers["set-cookie"];
      isAuthenticated = Boolean(sessionRes.data?.success);
    } catch {
      isAuthenticated = false;
    }
  }

  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivateRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  if (!isAuthenticated && isPrivateRoute) {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    appendSetCookieHeaders(response, refreshedSetCookie);
    return response;
  }

  if (isAuthenticated && isAuthRoute) {
    const response = NextResponse.redirect(new URL("/profile", request.url));
    appendSetCookieHeaders(response, refreshedSetCookie);
    return response;
  }

  const response = NextResponse.next();
  appendSetCookieHeaders(response, refreshedSetCookie);
  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
