"use client";

import React, { useState, ReactNode, HTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Icons (lucide-react)
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  ArrowLeft,
  Calendar as CalendarIcon,
} from "lucide-react";

/**
 * For each entry in the journal:
 */
interface JournalEntry {
  id: string;
  file: string;
  date: string; // "DD-MM-YYYY"
  content: string;
}

/**
 * Define a reusable type for Markdown props
 */
type MarkdownProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  inline?: boolean;
};

/**
 * A set of custom Markdown components with added spacing/styling
 */
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
  // ... (repeat for h4, h5, h6, etc. if desired)
  code: ({ inline, children, ...props }: MarkdownProps) => {
    if (!inline) {
      return (
        <pre className="my-4 p-2 bg-[#111827] overflow-x-auto" {...props}>
          <code>{children}</code>
        </pre>
      );
    }
    return (
      <code
        className="bg-[#111827] text-[#4A90E2] px-1 py-0.5 rounded"
        {...props}
      >
        {children}
      </code>
    );
  },
};

/**
 * Main Explorer component
 */
export default function JournalExplorer({
  initialEntries,
}: {
  initialEntries: JournalEntry[];
}) {
  const router = useRouter();

  const [entries] = useState<JournalEntry[]>(initialEntries);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          className={`fixed inset-y-0 left-0 bg-[#0D0D0D] p-4 overflow-y-auto border-r border-gray-800
          md:w-1/4 w-64 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }
          md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <h2 className="text-lg font-semibold text-gray-300 mb-4 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2" />
            Journal
          </h2>

          {/* List of all entries */}
          <ul>
            {entries.map((entry) => (
              <li
                key={entry.id}
                className={`p-2 rounded-md cursor-pointer transition-all mb-1 ${
                  selectedEntry?.id === entry.id
                    ? "bg-[#111827] text-[#4A90E2] border border-[#4A90E2]"
                    : "hover:bg-[#1A1A1A]"
                }`}
                onClick={() => {
                  setSelectedEntry(entry);
                  setSidebarOpen(false); // close sidebar on mobile
                }}
              >
                {entry.date}
              </li>
            ))}
          </ul>
        </div>

        {/* Content Display */}
        <div className="flex-1 p-6 bg-black overflow-y-auto">
          {selectedEntry ? (
            <div className="max-w-3xl mx-auto">
              {/* Back & Home Buttons */}
              <div className="flex justify-between mb-8">
                <button
                  className="px-4 py-2 rounded-md bg-[#111827] text-[#4A90E2] hover:bg-[#1A1A1A] transition-all flex items-center"
                  onClick={() => setSelectedEntry(null)}
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

              {/* Entry Date */}
              <h1 className="text-3xl font-bold text-gray-200 mb-2">
                {selectedEntry.date}
              </h1>

              {/* Markdown Content */}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {selectedEntry.content || ""}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-10">
              Select a date to view its journal entry.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
