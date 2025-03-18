// src/app/notes-explorer/NotesExplorer.tsx

"use client";

import React, { useState, ReactNode, HTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

import {
  Menu as MenuIcon,
  Home as HomeIcon,
  ArrowLeft,
  Folder as FolderIcon,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

// --------------------------------------------------
// Types
// --------------------------------------------------
interface Note {
  id: string;
  file: string;
  folder: string;
  title?: string;
  date?: string;
  tags?: string[];
  content?: string;
}

/**
 * Type for all Markdown component props, ensuring 'children' isn't implicitly any
 */
type MarkdownProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  inline?: boolean;
};

// --------------------------------------------------
// Markdown Rendering - Manual Spacing
// --------------------------------------------------
const markdownComponents = {
  p: ({ children, ...props }: MarkdownProps) => (
    <p className="my-4 leading-relaxed" {...props}>
      {children}
    </p>
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
    <blockquote
      className="my-4 border-l-4 border-gray-600 pl-4 italic opacity-90"
      {...props}
    >
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
    <th
      className="px-3 py-2 font-semibold text-left border-r border-gray-700 last:border-r-0"
      {...props}
    >
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
      return (
        <div className="my-4">
          <SyntaxHighlighter
            style={dracula as any}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      );
    }
    return (
      <code className="bg-[#111827] text-[#4A90E2] px-1 py-0.5 rounded" {...props}>
        {children}
      </code>
    );
  },
};

// --------------------------------------------------
// Main Explorer Component
// --------------------------------------------------
export default function NotesExplorer({ initialNotes }: { initialNotes: Note[] }) {
  const router = useRouter();

  const [notes] = useState<Note[]>(initialNotes);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  // Group notes by folder
  const folderMap = notes.reduce((acc, note) => {
    const folderName = note.folder || "Uncategorized";
    if (!acc[folderName]) {
      acc[folderName] = [];
    }
    acc[folderName].push(note);
    return acc;
  }, {} as Record<string, Note[]>);

  // Toggle folder open/close
  const toggleFolder = (folder: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folder]: !prev[folder],
    }));
  };

  return (
    <div className="font-mono bg-black text-gray-300 h-screen flex flex-col">
      {/* Mobile Navbar */}
      <div className="bg-[#0D0D0D] p-4 flex justify-between items-center md:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-[#4A90E2] px-3 py-2 rounded-md bg-[#111827] hover:bg-[#1A1A1A] transition-all flex items-center"
        >
          <MenuIcon className="w-4 h-4 mr-2" />
          Menu
        </button>
        <button
          className="text-[#4A90E2] px-3 py-2 rounded-md bg-[#111827] hover:bg-[#1A1A1A] transition-all flex items-center"
          onClick={() => router.push("/")}
        >
          <HomeIcon className="w-4 h-4 mr-2" />
          Home
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 bg-[#0D0D0D] p-4 overflow-y-auto border-r border-gray-800 md:w-1/4 w-64 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <h2 className="text-lg font-semibold text-gray-300 mb-4 flex items-center">
            <FolderIcon className="w-5 h-5 mr-2" />
            Notes
          </h2>

          {/* Folder List */}
          {Object.entries(folderMap).map(([folder, notesInFolder]) => {
            const isOpen = openFolders[folder] ?? false;

            return (
              <div key={folder} className="mb-3">
                {/* Folder Header */}
                <div
                  className="flex items-center cursor-pointer p-2 rounded-md hover:bg-[#1A1A1A] transition-all"
                  onClick={() => toggleFolder(folder)}
                >
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 mr-2" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-2" />
                  )}
                  <span className="font-semibold">{folder}</span>
                </div>

                {/* Instantly show/hide with no animation */}
                {isOpen && (
                  <ul className="pl-6 mt-2">
                    {notesInFolder.map((note) => (
                      <li
                        key={note.id}
                        className={`p-2 rounded-md cursor-pointer transition-all mb-1 ${
                          selectedNote?.id === note.id
                            ? "bg-[#111827] text-[#4A90E2] border border-[#4A90E2]"
                            : "hover:bg-[#1A1A1A]"
                        }`}
                        onClick={() => {
                          setSelectedNote(note);
                          setSidebarOpen(false); // close sidebar on mobile
                        }}
                      >
                        <div className="font-semibold">
                          {note.title || note.id}
                        </div>
                        <div className="text-xs text-gray-400">{note.date}</div>
                        <div className="text-xs text-[#4A90E2]">
                          {note.tags?.map((tag) => `#${tag}`).join(" ")}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Content Display */}
        <div className="flex-1 p-6 bg-black overflow-y-auto">
          {selectedNote ? (
            // No fade/slide animation, just plain content
            <div className="max-w-3xl mx-auto">
              {/* Back & Home Buttons */}
              <div className="flex justify-between mb-8">
                <button
                  className="px-4 py-2 rounded-md bg-[#111827] text-[#4A90E2] hover:bg-[#1A1A1A] transition-all flex items-center"
                  onClick={() => setSelectedNote(null)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-[#111827] text-[#4A90E2] hover:bg-[#1A1A1A] transition-all flex items-center"
                  onClick={() => router.push("/")}
                >
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Home
                </button>
              </div>

              {/* Note Title / Date */}
              <h1 className="text-3xl font-bold text-gray-200 mb-2">
                {selectedNote.title}
              </h1>
              {selectedNote.date && (
                <p className="text-gray-500 text-sm mb-6">{selectedNote.date}</p>
              )}

              {/* Markdown */}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {selectedNote.content || ""}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-10">
              Select a note to view its content.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
