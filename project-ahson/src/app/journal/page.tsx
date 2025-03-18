import React from "react";
import JournalExplorer from "./JournalExplorer";

export const revalidate = 0;

/**
 * Defines the shape of each journal entry.
 */
interface JournalEntry {
  id: string;
  file: string;
  date: string;
  content: string;
}

const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;
/**
 * Main Page component: fetch .md files from GitHub, parse the date from the filename, render them.
 */
export default async function JournalPage() {
  const entries = await fetchAllJournalEntries();
  const sorted = sortEntriesByDateDesc(entries);

  return (
    <div>
      <JournalExplorer initialEntries={sorted} />
    </div>
  );
}

/**
 * Fetches and returns an array of `JournalEntry` objects
 * for all `.md` files under `journal/` in your GitHub repo.
 */
async function fetchAllJournalEntries(): Promise<JournalEntry[]> {
  const treeUrl = "https://api.github.com/repos/ahson01/public-stuff/git/trees/main?recursive=1";
  const rawBase = "https://raw.githubusercontent.com/ahson01/public-stuff/main/";

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

  const mdFiles = data.tree.filter((item: any) =>
    item.type === "blob" && item.path.startsWith("journal/") && item.path.endsWith(".md")
  );

  const entries: JournalEntry[] = [];
  for (const file of mdFiles) {
    const rawUrl = `${rawBase}${file.path}`;
    const contentRes = await fetch(rawUrl, { headers });
    if (!contentRes.ok) {
      console.warn("Failed to fetch raw content for", file.path);
      continue;
    }

    const rawMarkdown = await contentRes.text();
    const fileName = file.path.split("/").pop() || "";
    const baseName = fileName.replace(".md", "");

    entries.push({
      id: baseName,
      file: file.path,
      date: baseName,
      content: rawMarkdown,
    });
  }

  console.log("[fetchAllJournalEntries] entries:", entries);
  return entries;
}

/**
 * Helper to sort entries by descending date, assuming `DD-MM-YYYY`.
 */
function sortEntriesByDateDesc(entries: JournalEntry[]): JournalEntry[] {
  return entries.sort((a, b) => {
    const [aD, aM, aY] = a.date.split("-").map(Number);
    const [bD, bM, bY] = b.date.split("-").map(Number);
    const aNum = aY * 10000 + aM * 100 + aD;
    const bNum = bY * 10000 + bM * 100 + bD;
    return bNum - aNum;
  });
}
