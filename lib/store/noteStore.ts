import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialDraft = {
  title: "",
  content: "",
  tag: "Todo",
};

type NoteStore = {
  draft: typeof initialDraft;
  setDraft: (note: typeof initialDraft) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,

      setDraft: (note) => set({ draft: note }),

      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft",
    },
  ),
);
