import React from "react";
import NotesExplorer from "./NotesExplorer";
import matter from "gray-matter";

export const revalidate = 0;

/**
 * Defines the shape of each note after frontmatter is parsed.
 */
interface Note {
  id: string;
  file: string; // e.g., "notes/life/my-note.md"
  folder: string; // e.g., "life"
  title?: string;
  date?: string;
  tags?: string[];
  content?: string;
}

const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;

/**
 * Main Page component: fetch notes from GitHub, parse frontmatter, render them.
 */
export default async function NotesExplorerPage() {
  // 1) Fetch & parse .md files from all subfolders in `notes/`
  const notes = await fetchAllMarkdownRecursively();

  // 2) Pass the array of notes to your client component
  return (
    <div>
      <NotesExplorer initialNotes={notes} />
    </div>
  );
}

/**
 * Uses the Git Trees API for recursion, then filters for .md under `notes/`.
 * - For each .md file, uses gray-matter to parse frontmatter.
 * - Returns an array of `Note`.
 */
async function fetchAllMarkdownRecursively(): Promise<Note[]> {
  const treeUrl =
    "https://api.github.com/repos/ahson01/public-stuff/git/trees/main?recursive=1";
  const rawBase =
    "https://raw.githubusercontent.com/ahson01/public-stuff/main/";

  const headers = {
    Authorization: `token ${GITHUB_API_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  };

  const res = await fetch(treeUrl, { headers });
  if (!res.ok) {
    console.error("Failed to fetch repository tree:", res.status);
    return [];
  }

  const data = await res.json();
  if (!data.tree || !Array.isArray(data.tree)) return [];

  // Filter to only .md files under `notes/`.
  const mdFiles = data.tree.filter(
    (item: any) =>
      item.type === "blob" &&
      item.path.startsWith("notes/") &&
      item.path.endsWith(".md")
  );

  const notes: Note[] = [];

  for (const file of mdFiles) {
    const rawUrl = `${rawBase}${file.path}`;
    const contentRes = await fetch(rawUrl, { headers });
    if (!contentRes.ok) {
      console.warn("Failed to fetch raw content for", file.path);
      continue;
    }

    const rawMarkdown = await contentRes.text();

    // Parse out frontmatter (data) and the actual markdown (content)
    const { data: frontmatter, content } = matter(rawMarkdown);

    // Extract file name
    const fileName = file.path.split("/").pop() || "";
    const baseName = fileName.replace(".md", "");

    // Extract folder name
    const folder =
      file.path
        .replace(`/${fileName}`, "") // remove "/my-note.md"
        .replace("notes/", "") || // remove "notes/"
      "GitHub";

    notes.push({
      id: baseName,
      file: file.path,
      folder,
      ...(frontmatter.title && { title: frontmatter.title }),
      ...(frontmatter.date && { date: frontmatter.date }),
      ...(frontmatter.tags && { tags: frontmatter.tags }),
      content,
    });
  }

  console.log("[fetchAllMarkdownRecursively] notes:", notes);

  return notes;
}
