import { cookies } from "next/headers";
import { nextServer } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const getCookieHeader = async (): Promise<string> => {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
};

export const fetchNotes = async (
  page = 1,
  search = "",
  tag?: string,
): Promise<FetchNotesResponse> => {
  const cookieHeader = await getCookieHeader();
  const normalizedTag = tag === "all" ? undefined : tag;

  const res = await nextServer.get<FetchNotesResponse>("/notes", {
    params: {
      search: search || undefined,
      page,
      perPage: 12,
      tag: normalizedTag || undefined,
    },
    headers: {
      Cookie: cookieHeader,
    },
  });

  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieHeader = await getCookieHeader();

  const res = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return res.data;
};

export const getMe = async (): Promise<User> => {
  const cookieHeader = await getCookieHeader();

  const res = await nextServer.get<User>("/users/me", {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return res.data;
};

export const checkSession = async (): Promise<User | null> => {
  const cookieHeader = await getCookieHeader();

  const res = await nextServer.get<User | null>("/auth/session", {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return res.data || null;
};
