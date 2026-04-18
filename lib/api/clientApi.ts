import { nextServer } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

interface AuthPayload {
  email: string;
  password: string;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface CreateNotePayload {
  title: string;
  content: string;
  tag: string;
}

interface UpdateMePayload {
  username: string;
}

export const fetchNotes = async (
  page = 1,
  search = "",
  tag?: string,
): Promise<FetchNotesResponse> => {
  const normalizedTag = tag === "all" ? undefined : tag;

  const res = await nextServer.get<FetchNotesResponse>("/notes", {
    params: {
      search: search || undefined,
      page,
      perPage: 12,
      tag: normalizedTag || undefined,
    },
  });

  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await nextServer.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (data: CreateNotePayload): Promise<Note> => {
  const res = await nextServer.post<Note>("/notes", data);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await nextServer.delete<Note>(`/notes/${id}`);
  return res.data;
};

export const register = async (data: AuthPayload): Promise<User> => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};

export const login = async (data: AuthPayload): Promise<User> => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  const res = await nextServer.get<User | null>("/auth/session");
  return res.data || null;
};

export const getMe = async (): Promise<User> => {
  const res = await nextServer.get<User>("/users/me");
  return res.data;
};

export const updateMe = async (data: UpdateMePayload): Promise<User> => {
  const res = await nextServer.patch<User>("/users/me", data);
  return res.data;
};
