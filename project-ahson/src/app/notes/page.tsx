import React from "react";
import NotesExplorer from "./NotesExplorer";
import matter from "gray-matter";

export const revalidate = 0;

interface Note {
  id: string;
  file: string;   // e.g., "notes/life/my-note.md"
  folder: string; // e.g., "life" or "life/sleep"
  title?: string;
  date?: unknown; // leave as unknown; client will normalize
  tags?: unknown;
  content?: string;
}

const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;

export default async function NotesExplorerPage() {
  const notes = await fetchAllMarkdownRecursively();
  return (
    <div>
      <NotesExplorer initialNotes={notes} />
    </div>
  );
}

async function fetchAllMarkdownRecursively(): Promise<Note[]> {
  const treeUrl =
    "https://api.github.com/repos/ahson01/notes/git/trees/main?recursive=1";
  const rawBase =
    "https://raw.githubusercontent.com/ahson01/notes/main/";

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (GITHUB_API_TOKEN) {
    headers.Authorization = `token ${GITHUB_API_TOKEN}`;
  }

  const res = await fetch(treeUrl, { headers, cache: "no-store" });
  if (!res.ok) {
    console.error("Failed to fetch repository tree:", res.status);
    return [];
  }

  const data = await res.json();
  if (!data.tree || !Array.isArray(data.tree)) return [];

  // .md files under notes/
  const mdFiles = data.tree.filter(
    (item: any) =>
      item.type === "blob" &&
      typeof item.path === "string" &&
      item.path.startsWith("notes/") &&
      item.path.endsWith(".md")
  );

  const notes: Note[] = [];

  for (const file of mdFiles) {
    const rawUrl = `${rawBase}${file.path}`;
    const contentRes = await fetch(rawUrl, { headers, cache: "no-store" });
    if (!contentRes.ok) {
      console.warn("Failed to fetch raw content for", file.path);
      continue;
    }

    const rawMarkdown = await contentRes.text();
    const { data: frontmatter, content } = matter(rawMarkdown);

    const fileName = file.path.split("/").pop() || "";
    const baseName = fileName.replace(/\.md$/i, "");

    // folder: everything after "notes/" before the file name
    // supports deep paths like notes/life/sleep/polyphasic/myfile.md
    const folder =
      file.path
        .replace(/\/[^/]+$/, "")   // strip file name
        .replace(/^notes\//, "")   // strip notes/
        .trim() || "GitHub";

    notes.push({
      id: baseName,
      file: file.path,
      folder,
      ...(frontmatter?.title && { title: frontmatter.title }),
      ...(frontmatter?.date && { date: frontmatter.date }),
      ...(frontmatter?.tags && { tags: frontmatter.tags }),
      content,
    });
  }

  return notes;
}
