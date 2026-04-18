import type { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";

const categories = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export const metadata: Metadata = {
  title: "Create note",
  description: "Create a new note in NoteHub",

  openGraph: {
    title: "Create note",
    description: "Create a new note in NoteHub",
    url: "https://notehub.vercel.app/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Create note",
      },
    ],
  },
};

const CreateNote = () => {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>

        <NoteForm categories={categories} />
      </div>
    </main>
  );
};

export default CreateNote;
