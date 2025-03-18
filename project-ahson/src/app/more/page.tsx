"use client";

import React, { MouseEvent, ReactNode } from "react";
import Navbar from "../common/navbar";
import Link from "next/link";

interface AlertLinkProps {
  href: string;
  children: ReactNode;
}

function AlertLink({ href, children }: AlertLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    alert("THIS PAGE IS STILL UNDER CONSTRUCTION. 🚧🗼⚠️!");
    window.location.href = href;
  };

  return (
    <Link href={href} onClick={handleClick}>
      {children}
    </Link>
  );
}

export default function Home() {
  return (
    <div className="font-mono">
      <Navbar />
      <div className="text-center absolute top-[50%] left-1/2 -translate-x-1/2 font-bold text-4xl h-screen w-full">
        <h1>
          Hey, you're on the page to know more about me.
          <p></p>
          Well, Thanks for being here.
          <p></p>
          click{" "}
          <span className="text-red-500 underline">
            <AlertLink href="/">here</AlertLink>
          </span>{" "}
          to start the journey...
        </h1>
      </div>
    </div>
  );
}
