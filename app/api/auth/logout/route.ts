import { NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import {
  appendSetCookieHeaders,
  getAxiosErrorStatus,
  logErrorResponse,
} from "../../_utils/utils";

export async function POST() {
  const cookieStore = await cookies();

  try {
    const apiRes = await api.post("auth/logout", null, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    const response = NextResponse.json(null, { status: apiRes.status });
    appendSetCookieHeaders(response, apiRes.headers["set-cookie"]);
    response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
    response.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);

      const status = getAxiosErrorStatus(error);

      if (status === 401 || status === 403) {
        const response = NextResponse.json(null, { status: 200 });
        response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
        response.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
        return response;
      }

      return NextResponse.json({ error: error.message }, { status });
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
