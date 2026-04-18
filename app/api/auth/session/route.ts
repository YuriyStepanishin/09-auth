import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { isAxiosError } from "axios";
import {
  appendSetCookieHeaders,
  getAxiosErrorStatus,
  logErrorResponse,
} from "../../_utils/utils";

export async function GET() {
  try {
    const cookieStore = await cookies();

    if (!cookieStore.get("accessToken") && !cookieStore.get("refreshToken")) {
      return NextResponse.json(null, { status: 200 });
    }

    const apiRes = await api.get("auth/session", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    const response = NextResponse.json(apiRes.data ?? null, {
      status: apiRes.status,
    });
    appendSetCookieHeaders(response, apiRes.headers["set-cookie"]);

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);

      const status = getAxiosErrorStatus(error);

      if (status === 401 || status === 403) {
        return NextResponse.json(null, { status: 200 });
      }

      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status },
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
