"use client"

import Navbar from "../common/navbar"; 
import ProjectShowcase from "./projects"

import { useEffect } from "react";

export function HideScrollbar() {
  useEffect(() => {
    // Set overflow hidden on mount
    document.body.style.overflow = "hidden";

    // Clean up: reset on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="your-showcase-class">
      {/* your content */}
    </div>
  );
}

export default function Home() {
  return (
    <div className="font-mono overflow-hidden">
      <Navbar />
        <div className="m-12">
        <ProjectShowcase />
        <HideScrollbar />
        </div>
    </div>

  );
}

