"use client"

import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full mt-16 flex items-center justify-between md:justify-center px-6 md:px-12">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden focus:outline-none"
      >
        <svg
          className="w-6 h-6 relative z-[10000] text-blue-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>

      {/* Unified Menu */}
      <ul
        className={`md:!opacity-100 ease-in-out duration-300 z-[1000] animate-fade-to-grey md:!bg-transparent top-0 justify-center transition-all absolute left-0 w-full flex flex-col h-full text-blue-400 font-medium lowercase md:flex md:flex-row md:static md:space-x-8 md:py-0 items-center text-lg md:font-bold md:w-auto 
        ${isOpen ? "opacity-100 bg-black h-screen" : "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"}`}
      >
        <li><a href="/" className="hover:text-blue-300">home</a></li>
        <li><a href="/projects" className="hover:text-blue-300">projects</a></li>
        <li><a href="/tools" className="hover:text-blue-300">tools</a></li>
        <li><a href="/notes" className="hover:text-blue-300">notes</a></li>
      </ul>
    </nav>
  );
}
