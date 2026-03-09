import { Metadata } from "next";
import { getSingleNote } from "@/lib/api";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const note = await getSingleNote(id);

  return {
    title: note.title,
    description: note.content.slice(0, 100),
    openGraph: {
      title: note.title,
      description: note.content.slice(0, 100),
      url: `https://notehub.vercel.app/notes/${id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function NotePage({ params }: Props) {
  const { id } = await params;

  const note = await getSingleNote(id);

  return <div>{note.title}</div>;
}
