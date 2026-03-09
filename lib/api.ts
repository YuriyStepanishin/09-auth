import axios from "axios";
import type { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common.Authorization = `Bearer ${token}`;

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  search?: string,
  tag?: string,
): Promise<FetchNotesResponse> => {
  const params: {
    page: number;
    perPage: number;
    search?: string;
    tag?: string;
  } = {
    page,
    perPage: 12,
  };

  if (search && search.trim() !== "") {
    params.search = search;
  }

  if (tag && tag !== "all") {
    params.tag = tag;
  }

  const response = await axios.get<FetchNotesResponse>("/notes", {
    params,
  });

  return response.data;
};

export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">,
): Promise<Note> => {
  const response = await axios.post<Note>("/notes", note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`/notes/${id}`);
  return response.data;
};
export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(`/notes/${id}`);
  return response.data;
};
export const getSingleNote = async (id: string) => {
  const res = await axios.get(`/notes/${id}`);
  return res.data;
};
export const getCategories = async () => {
  return ["Todo", "Work", "Personal", "Meeting", "Shopping"];
};
