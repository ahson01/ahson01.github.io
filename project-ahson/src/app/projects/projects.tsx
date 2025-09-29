"use client"

import {
  FaPython, FaReact, FaHtml5, FaCss3Alt, FaJsSquare,
  FaGithub, FaNodeJs, FaJava, FaSwift, FaPhp,
} from "react-icons/fa";
import {
  SiVercel, SiExpress, SiGithubactions, SiDjango,
  SiTypescript, SiCplusplus, SiGo, SiRust,
} from "react-icons/si";
import { IconType } from "react-icons";

interface Project {
  title: string;
  image: string;
  link: string;
  description: string;
  details?: string;
  tags?: string[];
}

const languageIconMap: Record<string, IconType> = {
  Python: FaPython,
  React: FaReact,
  HTML: FaHtml5,
  CSS: FaCss3Alt,
  JavaScript: FaJsSquare,
  TypeScript: SiTypescript,
  Django: SiDjango,
  Express: SiExpress,
  Node: FaNodeJs,
  GitHub: FaGithub,
  Vercel: SiVercel,
  "GitHub Actions": SiGithubactions,
  Java: FaJava,
  "C++": SiCplusplus,
  Go: SiGo,
  Rust: SiRust,
  Swift: FaSwift,
  PHP: FaPhp,
};

const projects: Project[] = [
  {
    title: "MouseRedirect",
    image: "./projects/mouse.png",
    link: "https://github.com/ahson01/MouseRedirect",
    description: "Moves your mouse to where it was 5 seconds ago—like cursor time travel!",
    tags: ["Python", "GitHub"],
  },
  {
    title: "GitHubStorage Python Package",
    image: "./projects/github-storage.png",
    link: "https://pypi.org/project/github-storage/0.1.0/",
    description: "Upload, version, compress, and encrypt files directly to GitHub.",
    details: "Supports large files and provides a CLI for automation.",
    tags: ["Python", "GitHub Actions"],
  },
  {
    title: "Tech Sleek Blog",
    image: "./projects/blog.png",
    link: "https://techsleekblogs.vercel.app/",
    description:
      "Hey! This retro-themed blog by Ahson shares tech tips, built in a day with Django, Vercel, and Google SSO.",
    details: "markdown.",
    tags: ["Django", "HTML", "CSS", "Vercel"],
  },
  {
    title: "PPT TO PNG",
    image: "./projects/ppt-to-png.png",
    link: "https://png-to-ppt.glitch.me/",
    description:
      "Convert PNG images into downloadable PowerPoint slides. Built using the Bottles Python framework.",
    tags: ["Python", "Express"],
  },
  {
    title: "OmeCord",
    image: "./projects/omecord.png",
    link: "https://github.com/ahson01/omecord",
    description:
      "An omegle-style discord bot, which allows you to talk to strangers within your discord server.",
    tags: ["Python", "Docker"],
  },
  {
    title: "Maths Speed Multiplier",
    image: "./projects/msm.png",
    link: "https://ahson01.github.io/msm",
    description: "Sharpen your mental math with speed-based multiplication challenges.",
    tags: ["JavaScript", "HTML"],
  },
];

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-background border border-white/10 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] transition duration-500 ease-in-out"
    >
      <img
        src={project.image}
        alt={project.title}
        className="absolute inset-0 h-[500px] w-full object-cover brightness-75 opacity-75 group-hover:brightness-100 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 ease-out"
      />

      <div className="relative z-20 flex flex-col gap-2 p-6 h-[190px] group-hover:-translate-y-10 transition-all duration-300">
        <h2 className="text-xl font-semibold text-neutral-200">{project.title}</h2>
        <p className="text-sm text-neutral-400">{project.description}</p>
        {project.details && <p className="text-xs italic  text-neutral-500">{project.details}</p>}
        {project.tags && (
          <div className="flex flex-wrap gap-2 mt-2">
            {project.tags.map((tag, i) => {
              const Icon = languageIconMap[tag];
              return (
                <span
                  key={i}
                  className="flex items-center gap-1 bg-white/10 text-xs brightness-150 text-neutral-300 px-2 py-1 rounded-full"
                >
                  {Icon && <Icon className="text-sm" />}
                  {tag}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div className=" absolute bottom-0 flex w-full translate-y-10 transform-gpu items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
      <div className="pointer-events-auto bg-white rounded-lg py-1 px-2 text-xs text-black flex gap-2 items-center cursor-pointer hover:bg-white/80 transition-colors">
          Visit the site
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645l4.00005 4c.1952.19526.1952.51184.0.707100000000001L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536c-.19527-.1953-.19527-.511900000000001.0-.7072L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5s.22386-.5.5-.5h8.7929L8.14645 3.85355c-.19527-.19526-.19527-.51184.0-.7071z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </a>
  );
};

export default function ProjectShowcase() {
  return (
    <div className="grid h-[84vh] grid-cols-1 gap-6 overflow-auto p-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard key={index} project={project} />
      ))}
    </div>
  );
}
