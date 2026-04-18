import type { AxiosError } from "axios";
import type { NextResponse } from "next/server";

export function logErrorResponse(errorObj: unknown): void {
  console.log("API error response:");
  console.dir(errorObj, { depth: null, colors: true });
}

export function getAxiosErrorStatus(error: AxiosError): number {
  return error.response?.status ?? 500;
}

export function appendSetCookieHeaders(
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
