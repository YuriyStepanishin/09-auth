import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NoteHub",
  description: "Application for creating and managing notes",
  openGraph: {
    title: "NoteHub",
    description: "Application for creating and managing notes",
    url: "https://notehub.vercel.app",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub",
      },
    ],
  },
};

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
