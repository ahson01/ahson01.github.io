"use client";

import Navbar from "../common/navbar";
import ProjectShowcase from "./projects";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="font-mono overflow-hidden">
      <Navbar />
      <div className="m-12">
        <ProjectShowcase />
      </div>
    </div>
  );
}
