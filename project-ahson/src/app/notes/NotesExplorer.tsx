"use client";

import React, {
  useMemo,
  useState,
  ReactNode,
  HTMLAttributes,
  useCallback,
  useEffect,
} from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useShikiHighlighter } from "react-shiki";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  ArrowLeft,
  Folder as FolderIcon,
  ChevronDown,
  ChevronRight,
  FileText,
  X,
  Search,
  Link as LinkIcon,
} from "lucide-react";

// --------------------------------------------------
// Types
// --------------------------------------------------
interface Note {
  id: string;
  file: string; // e.g., "notes/life/my-note.md"
  folder: string; // e.g., "life/sleep"
  title?: string;
  date?: unknown; // may come as string | Date | number
  tags?: unknown; // may be string[] | string | unknown
  content?: string;
}

type NormalizedNote = Omit<Note, "date" | "tags" | "title"> & {
  title: string;
  date?: string; // always render-safe
  tags?: string[]; // always string[]
};

type FolderNode = {
  name: string;
  path: string;
  folders: Record<string, FolderNode>;
  notes: NormalizedNote[];
};

// --------------------------------------------------
// Helpers: normalization & formatting
// --------------------------------------------------
function toISODateString(d: Date) {
  return d.toISOString().slice(0, 10);
}
function normalizeDate(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (value instanceof Date && !isNaN(value.getTime())) return toISODateString(value);
  if (typeof value === "number") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? String(value) : toISODateString(d);
  }
  if (typeof value === "string") {
    const maybe = new Date(value);
    return !isNaN(maybe.getTime()) ? toISODateString(maybe) : value;
  }
  return String(value);
}
function normalizeTags(value: unknown): string[] | undefined {
  if (value == null) return undefined;
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string")
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return undefined;
}
function normalizeNotes(initialNotes: Note[]): NormalizedNote[] {
  return initialNotes.map((n) => ({
    ...n,
    title: n.title ? String(n.title) : n.id,
    date: normalizeDate(n.date),
    tags: normalizeTags(n.tags),
  }));
}
function insertNoteIntoTree(root: FolderNode, note: NormalizedNote) {
  const segments = (note.folder || "Uncategorized").split("/").filter(Boolean);
  let node = root;
  let currentPath = "";
  if (segments.length === 0) segments.push("Uncategorized");
  for (const seg of segments) {
    currentPath = currentPath ? `${currentPath}/${seg}` : seg;
    if (!node.folders[seg]) {
      node.folders[seg] = { name: seg, path: currentPath, folders: {}, notes: [] };
    }
    node = node.folders[seg];
  }
  node.notes.push(note);
}
function buildFolderTree(notes: NormalizedNote[]): FolderNode {
  const root: FolderNode = { name: "", path: "", folders: {}, notes: [] };
  for (const note of notes) insertNoteIntoTree(root, note);
  const sortNode = (node: FolderNode) => {
    node.notes.sort((a, b) => {
      const ad = a.date ?? "";
      const bd = b.date ?? "";
      if (ad && bd && ad !== bd) return bd.localeCompare(ad);
      return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
    });
    Object.values(node.folders).forEach(sortNode);
  };
  sortNode(root);
  return root;
}

// --------------------------------------------------
// CodeBlock (Shiki) — fixed overflow
// --------------------------------------------------
interface CodeBlockProps {
  language: string;
  children: string;
}
const CodeBlock: React.FC<CodeBlockProps> = ({ language, children }) => {
  const codeString = String(children).replace(/\n$/, "");
  const highlightedCode = useShikiHighlighter(codeString, language, "dracula");

  // Wrap in a scroll container so long lines don't overflow the page
  if (!highlightedCode) {
    return (
      <div className="my-4 overflow-x-auto rounded-lg border border-gray-800 bg-[#0B0B0B]">
        <pre className={`shiki language-${language} px-4 py-3 whitespace-pre min-w-fit`}>
          <code>{codeString}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-gray-800 bg-[#0B0B0B]">
      {/* min-w-fit ensures the content can extend horizontally and scroll */}
      <div className="min-w-fit">{highlightedCode}</div>
    </div>
  );
};

// --------------------------------------------------
// Markdown components (with inline code wrapping)
// --------------------------------------------------
type MarkdownProps = HTMLAttributes<HTMLElement> & { children?: ReactNode; inline?: boolean };

const markdownComponents = {
  p: ({ children, ...props }: MarkdownProps) => (
    <p className="my-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  a: ({ children, ...props }: MarkdownProps) => (
    <a className="text-blue-400 underline" {...props}>
      {children}
    </a>
  ),
  h1: ({ children, ...props }: MarkdownProps) => (
    <h1 className="text-3xl font-bold my-8" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: MarkdownProps) => (
    <h2 className="text-2xl font-bold my-6" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: MarkdownProps) => (
    <h3 className="text-xl font-bold my-4" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: MarkdownProps) => (
    <h4 className="text-lg font-semibold my-4" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: MarkdownProps) => (
    <h5 className="text-base font-semibold my-4" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }: MarkdownProps) => (
    <h6 className="text-sm font-semibold my-4" {...props}>
      {children}
    </h6>
  ),
  ul: ({ children, ...props }: MarkdownProps) => (
    <ul className="list-disc list-inside my-4 ml-6" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: MarkdownProps) => (
    <ol className="list-decimal list-inside my-4 ml-6" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: MarkdownProps) => (
    <li className="my-2" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: MarkdownProps) => (
    <blockquote className="my-4 border-l-4 border-gray-600 pl-4 italic opacity-90" {...props}>
      {children}
    </blockquote>
  ),
  hr: (props: MarkdownProps) => <hr className="my-6 border-gray-700" {...props} />,
  table: ({ children, ...props }: MarkdownProps) => (
    <table className="my-6 w-full border border-gray-700 border-collapse" {...props}>
      {children}
    </table>
  ),
  thead: ({ children, ...props }: MarkdownProps) => (
    <thead className="bg-[#111827]" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: MarkdownProps) => <tbody {...props}>{children}</tbody>,
  tr: ({ children, ...props }: MarkdownProps) => (
    <tr className="border-b border-gray-700 last:border-b-0" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }: MarkdownProps) => (
    <th className="px-3 py-2 font-semibold text-left border-r border-gray-700 last:border-r-0" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: MarkdownProps) => (
    <td className="px-3 py-2 align-top border-r border-gray-700 last:border-r-0" {...props}>
      {children}
    </td>
  ),
  code: ({ inline, className, children, ...props }: MarkdownProps) => {
    const match = /language-(\w+)/.exec(className || "");
    if (!inline && match) {
      const language = match[1];
      const codeString = String(children).replace(/\n$/, "");
      return <CodeBlock language={language}>{codeString}</CodeBlock>;
    }
    // Inline code: allow wrapping to avoid overflow in mobile
    return (
      <code className="bg-[#111827] text-[#4A90E2] px-1 py-0.5 rounded break-words" {...props}>
        {children}
      </code>
    );
  },
};

// --------------------------------------------------
// Folder Tree UI (recursive)
// --------------------------------------------------
function FolderRow({
  node,
  openMap,
  toggle,
  onSelectNote,
  selectedNoteId,
  depth = 0,
}: {
  node: FolderNode;
  openMap: Record<string, boolean>;
  toggle: (path: string) => void;
  onSelectNote: (note: NormalizedNote) => void;
  selectedNoteId: string | null;
  depth?: number;
}) {
  const childNames = useMemo(
    () => Object.keys(node.folders).sort((a, b) => a.localeCompare(b)),
    [node.folders]
  );
  const isRoot = node.path === "";

  return (
    <div>
      {!isRoot && (
        <div
          className="flex items-center cursor-pointer p-2 rounded-md hover:bg-[#1A1A1A] transition-all"
          style={{ paddingLeft: depth * 12 + 8 }}
          onClick={() => toggle(node.path)}
          role="button"
          aria-expanded={openMap[node.path] ?? false}
        >
          {openMap[node.path] ?? false ? (
            <ChevronDown className="w-4 h-4 mr-2" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-2" />
          )}
          <span className="font-semibold flex items-center">
            <FolderIcon className="w-4 h-4 mr-2" />
            {node.name}
          </span>
        </div>
      )}

      {(isRoot || openMap[node.path]) && (
        <div className="mt-1">
          {childNames.map((name) => (
            <FolderRow
              key={node.folders[name].path}
              node={node.folders[name]}
              openMap={openMap}
              toggle={toggle}
              onSelectNote={onSelectNote}
              selectedNoteId={selectedNoteId}
              depth={depth + (isRoot ? 0 : 1)}
            />
          ))}

          {node.notes.length > 0 && !isRoot && (
            <ul className="pl-6 mt-2">
              {node.notes.map((note) => (
                <li
                  key={note.id + note.file}
                  className={`p-2 rounded-md cursor-pointer transition-all mb-1 flex items-start ${
                    selectedNoteId === note.id
                      ? "bg-[#111827] text-[#4A90E2] border border-[#4A90E2]"
                      : "hover:bg-[#1A1A1A]"
                  }`}
                  style={{ paddingLeft: depth * 12 + 8 }}
                  onClick={() => onSelectNote(note)}
                >
                  <FileText className="w-4 h-4 mr-2 mt-0.5" />
                  <div className="w-full">
                    <div className="font-semibold">{note.title}</div>
                    {note.date && <div className="text-xs text-gray-400">{note.date}</div>}
                    {note.tags && note.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {note.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#111827] text-[#9CC2F2] border border-[#1f2a44]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------
// Main Explorer Component
// --------------------------------------------------
export default function NotesExplorer({ initialNotes }: { initialNotes: Note[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const notes: NormalizedNote[] = useMemo(() => normalizeNotes(initialNotes), [initialNotes]);
  const tree = useMemo(() => buildFolderTree(notes), [notes]);
  const noteById = useMemo(() => {
    const map = new Map<string, NormalizedNote>();
    for (const n of notes) map.set(n.id, n);
    return map;
  }, [notes]);

  const [selectedNote, setSelectedNote] = useState<NormalizedNote | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({ "": true });
  const [query, setQuery] = useState("");

  // Select note from URL (?note=<id>) on first mount
  useEffect(() => {
    const paramId = searchParams?.get("note");
    if (paramId && noteById.has(paramId)) {
      setSelectedNote(noteById.get(paramId)!);
      // Expand folders to the selected note's path for visibility
      const folderPath = noteById.get(paramId)!.folder || "Uncategorized";
      const segments = folderPath.split("/").filter(Boolean);
      const acc: Record<string, boolean> = { "": true };
      let cur = "";
      for (const seg of segments) {
        cur = cur ? `${cur}/${seg}` : seg;
        acc[cur] = true;
      }
      setOpenFolders((prev) => ({ ...prev, ...acc }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFolder = useCallback((path: string) => {
    setOpenFolders((prev) => ({ ...prev, [path]: !(prev[path] ?? false) }));
  }, []);

  const goHome = useCallback(() => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      router.refresh();
    } else {
      router.push("/");
    }
  }, [router]);

  const onSelectNote = useCallback(
    (n: NormalizedNote) => {
      setSelectedNote(n);
      setSidebarOpen(false);
      // Sync selection into URL for deep-linking
      const sp = new URLSearchParams(searchParams?.toString());
      sp.set("note", n.id);
      router.push(`${pathname}?${sp.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const breadcrumb = useMemo(() => {
    if (!selectedNote) return [] as string[];
    const path = (selectedNote.file || "").replace(/^notes\//, "");
    return path ? path.split("/") : [];
  }, [selectedNote]);

  // Derived: filtered notes per folder when searching
  const lowerQuery = query.trim().toLowerCase();
  const isFiltering = lowerQuery.length > 0;

  const filteredTree = useMemo(() => {
    if (!isFiltering) return tree;

    // Build a new tree with only matching notes
    const root: FolderNode = { name: "", path: "", folders: {}, notes: [] };

    const matches = (n: NormalizedNote) => {
      const hay = [n.title, n.file, n.folder, n.date, ...(n.tags || [])]
        .filter(Boolean)
        .join(" \u0000 ")
        .toLowerCase();
      return hay.includes(lowerQuery);
    };

    for (const n of notes) {
      if (matches(n)) insertNoteIntoTree(root, n);
    }
    return root;
  }, [isFiltering, lowerQuery, notes, tree]);

  // Auto-open all folders while filtering for easier browsing
  useEffect(() => {
    if (!isFiltering) return;
    const openAll = (node: FolderNode, acc: Record<string, boolean>) => {
      for (const child of Object.values(node.folders)) {
        acc[child.path] = true;
        openAll(child, acc);
      }
    };
    const acc: Record<string, boolean> = { "": true };
    openAll(filteredTree, acc);
    setOpenFolders((prev) => ({ ...prev, ...acc }));
  }, [filteredTree, isFiltering]);

  // Clipboard copy helper
  const copyLink = useCallback(async () => {
    if (!selectedNote) return;
    const sp = new URLSearchParams(searchParams?.toString());
    sp.set("note", selectedNote.id);
    const url = typeof window !== "undefined" ? `${window.location.origin}${pathname}?${sp.toString()}` : `${pathname}?${sp.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      // Optional: could add a toast here
    } catch {
      // noop
    }
  }, [pathname, searchParams, selectedNote]);

  return (
    <div className="font-mono bg-black text-gray-300 h-screen flex flex-col">
      {/* Mobile Navbar */}
      <div className="bg-[#0D0D0D] p-4 flex justify-between items-center md:hidden">
        <button
          onClick={() => setSidebarOpen((s) => !s)}
          className="text-[#4A90E2] px-3 py-2 rounded-md bg-[#111827] hover:bg-[#1A1A1A] transition-all flex items-center"
          aria-label="Toggle menu"
        >
          <MenuIcon className="w-4 h-4 mr-2" />
          Menu
        </button>
        <button
          className="text-[#4A90E2] px-3 py-2 rounded-md bg-[#111827] hover:bg-[#1A1A1A] transition-all flex items-center"
          onClick={goHome}
        >
          <HomeIcon className="w-4 h-4 mr-2" />
          Home
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 bg-[#0D0D0D] p-4 overflow-y-auto border-r border-gray-800 md:w-1/4 w-72 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-300 flex items-center">
              <FolderIcon className="w-5 h-5 mr-2" />
              Notes
            </h2>
            <button
              className="md:hidden p-2 rounded hover:bg-[#111827]"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="mb-3 relative">
            <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 opacity-70" />
            <input
              className="w-full pl-8 pr-8 py-2 rounded-md bg-[#111827] border border-gray-800 focus:outline-none focus:border-[#4A90E2] placeholder-gray-500"
              placeholder="Search title, tags, path…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search notes"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[#0e1422]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <FolderRow
            node={isFiltering ? filteredTree : tree}
            openMap={openFolders}
            toggle={toggleFolder}
            onSelectNote={onSelectNote}
            selectedNoteId={selectedNote?.id ?? null}
          />
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 bg-black overflow-y-auto">
          {selectedNote ? (
            <div className="max-w-3xl mx-auto">
              {/* Header actions */}
              <div className="flex justify-between mb-6">
                <button
                  className="px-4 py-2 rounded-md bg-[#111827] text-[#4A90E2] hover:bg-[#1A1A1A] transition-all flex items-center"
                  onClick={() => setSelectedNote(null)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
                {/* Hide this on mobile to avoid two Home buttons */}
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 rounded-md bg-[#111827] text-[#4A90E2] hover:bg-[#1A1A1A] transition-all items-center hidden md:inline-flex"
                    onClick={goHome}
                  >
                    <HomeIcon className="w-4 h-4 mr-2" />
                    Home
                  </button>
                  <button
                    className="px-3 py-2 rounded-md bg-[#111827] text-[#9CC2F2] hover:bg-[#1A1A1A] transition-all items-center inline-flex"
                    onClick={copyLink}
                    aria-label="Copy link to note"
                    title="Copy link to note"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Copy link
                  </button>
                </div>
              </div>

              {/* Breadcrumb */}
              <nav className="text-xs text-gray-500 mb-3 break-all" aria-label="Breadcrumb">
                {breadcrumb.map((seg, i) => (
                  <span key={i}>
                    {i > 0 && " / "}
                    {seg}
                  </span>
                ))}
              </nav>

              {/* Title & Meta */}
              <h1 className="text-3xl font-bold text-gray-200 mb-1">{selectedNote.title}</h1>
              <div className="flex items-center gap-3 mb-6">
                {selectedNote.date && <span className="text-gray-500 text-sm">{selectedNote.date}</span>}
                {selectedNote.tags && selectedNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedNote.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#111827] text-[#9CC2F2] border border-[#1f2a44]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Markdown */}
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {selectedNote.content || ""}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="h-full grid place-items-center">
              <div className="text-center max-w-lg">
                <p className="text-gray-400 mb-3">Select a note to view its content.</p>
                <p className="text-gray-500 text-sm">Tip: use the search box in the left sidebar to filter by title, tags, or path. You can also deep‑link to a note with <code>?note=&lt;id&gt;</code>.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
