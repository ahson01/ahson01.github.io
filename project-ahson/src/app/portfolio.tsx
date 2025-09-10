"use client";
import { useEffect, useState } from "react";
import { FaGithub, FaEnvelope, FaDiscord } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  { href: "https://github.com/ahson01#", icon: <FaGithub /> },
  { href: "mailto:ahson01@proton.me", icon: <FaEnvelope /> },
  {
    href: "https://discord.com/users/1358124434732613862",
    icon: <FaDiscord />,
  },
];

const techStack = [
  { name: "javascript", color: "323330", logoColor: "F7DF1E" },
  { name: "python", color: "3670A0", logoColor: "ffdd54" },
  { name: "r", color: "276DC3", logoColor: "white" },
  { name: "c++", color: "00599C", logoColor: "white" },
  { name: "java", color: "ED8B00", logoColor: "white" },
  { name: "django", color: "092E20", logoColor: "white" },
  { name: "flask", color: "000000", logoColor: "white" },
  { name: "react", color: "20232a", logoColor: "61DAFB" },
  { name: "node.js", color: "6DA55F", logoColor: "white" },
  { name: "css3", color: "1572B6", logoColor: "white" },
  { name: "html5", color: "E34F26", logoColor: "white" },
  { name: "tailwindcss", color: "38B2AC", logoColor: "white" },
  { name: "jquery", color: "0769AD", logoColor: "white" },
  { name: "postgresql", color: "4169E1", logoColor: "white" },
  { name: "rust", color: "000000", logoColor: "white" },
  { name: "git", color: "F05032", logoColor: "white" },
  { name: "next.js", color: "000000", logoColor: "white" },
  { name: "typescript", color: "3178C6", logoColor: "white" },
  { name: "go", color: "00ADD8", logoColor: "white" },
];

const funFacts = [
  "I invest in stocks using Kite.",
  "I code using NeoVim.",
  "I am addicted to a social media platform called Discord.",
  "I write poems... (site coming soon).",
  "I do Ethereum trading using bots.",
  "I do Monero mining through xmrig.",
  "I read Quora articles in my free time.",
  "I draw using Adobe Animate.",
  "I code and make AI stock prediction models using yfinance, scikit-learn, TensorFlow, etc.",
  "If you ask nicely, I'll code anything for you for free.",
];

const SocialIcons = () => (
  <div
    className="
      socials flex flex-wrap items-center gap-4 text-2xl
      p-0 !p-0
      md:absolute md:right-12 md:top-12 md:-translate-y-1/2
    "
  >
    {socialLinks.map((link, index) => (
      <a
        key={index}
        href={link.href}
        className="
          flex justify-center items-center
          w-12 h-12 rounded-lg border-[#0e1c3276] border-[0.5px]
          hover:bg-gray-600/100
          mb-6 md:mb-0
        "
      >
        {link.icon}
      </a>
    ))}
  </div>
);


const TechStack = () => {
  // Split into two rows (odd/even index split)
  const row1 = techStack.filter((_, i) => i % 2 === 0);
  const row2 = techStack.filter((_, i) => i % 2 !== 0);

  return (
    <div className="w-full mt-6 flex flex-col gap-6 overflow-hidden">
      {/* Row 1 */}
      <div className="flex animate-marquee whitespace-nowrap gap-4">
        {row1.map((tech, index) => (
          <Image
            key={index}
            className="mcard !brightness-100 !opacity-100 rounded-2xl transition-transform duration-300 hover:scale-125 h-[45px] w-auto"
            src={`https://img.shields.io/badge/${tech.name}-${tech.color}?style=for-the-badge&logo=${tech.name}&logoColor=${tech.logoColor}`}
            alt={`${tech.name} Badge`}
            width={100}
            height={28}
          />
        ))}
        {/* duplicate for seamless scroll */}
        {row1.map((tech, index) => (
          <Image
            key={`dup1-${index}`}
            className="mcard !brightness-100 !opacity-100 rounded-2xl h-[45px] w-auto"
            src={`https://img.shields.io/badge/${tech.name}-${tech.color}?style=for-the-badge&logo=${tech.name}&logoColor=${tech.logoColor}`}
            alt={`${tech.name} Badge`}
            width={100}
            height={28}
          />
        ))}
      </div>

      {/* Row 2 */}
      <div className="flex animate-marquee2 whitespace-nowrap gap-4">
        {row2.map((tech, index) => (
          <Image
            key={index}
            className="mcard rounded-2xl !brightness-100 !opacity-100 transition-transform duration-300 hover:scale-125 h-[45px] w-auto"
            src={`https://img.shields.io/badge/${tech.name}-${tech.color}?style=for-the-badge&logo=${tech.name}&logoColor=${tech.logoColor}`}
            alt={`${tech.name} Badge`}
            width={100}
            height={28}
          />
        ))}
        {row2.map((tech, index) => (
          <Image
            key={`dup2-${index}`}
            className="mcard !brightness-100 !opacity-100 rounded-2xl h-[45px] w-auto"
            src={`https://img.shields.io/badge/${tech.name}-${tech.color}?style=for-the-badge&logo=${tech.name}&logoColor=${tech.logoColor}`}
            alt={`${tech.name} Badge`}
            width={100}
            height={28}
          />
        ))}
      </div>
    </div>
  );
};

const FunFacts = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => (prev + 1) % (funFacts.length * 50));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <ul
      className="relative left-1/2 transform -translate-x-1/2 space-y-5 text-white"
      style={{ transform: `translateY(-${scrollPosition}px)` }}
    >
      {funFacts.map((fact, index) => (
        <li key={index}>{fact}</li>
      ))}
    </ul>
  );
};

export default function Portfolio() {
  return (
    <div className="text-white flex flex-col items-center mt-12 mb-12">
      <section className="holder text-center relative flex-col">
        <SocialIcons />
        <div className="w-full">
          <h1 className="md:!mb-4 flicker-text w-fit md:!text-left glowy text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500 drop-shadow-lg">
            Hey, I'm Ahson!
          </h1>
          <p className="!m-0 !p-0 !-mb-4 text-left text-gray-400 flex items-center">
            <svg
              style={{ margin: 0 }}
              className="w-5 mr-2"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 3.5C6 2.67157 6.67157 2 7.5 2S9 2.67157 9 3.5 8.32843 5 7.5 5C6.67157 5 6 4.32843 6 3.5zM8 5.94999C9.14112 5.71836 10 4.70948 10 3.5 10 2.11929 8.88071 1 7.5 1 6.11929 1 5 2.11929 5 3.5c0 1.20948.85888 2.21836 2 2.44999V13.5c0 .2761.22386.5.5.5s.5-.2239.5-.5V5.94999z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
            North India
          </p>
        </div>

        <p className="text-lg !mb-[6px] !text-left text-gray-300 leading-relaxed mt-6">
          I&apos;m a{" "}
          <strong className="text-[#00d9ff] glowy">full-stack developer</strong>{" "}
          💻, a{" "}
          <strong className="text-[#ff6b6b] glowy">white-hat hacker</strong> 🔐,
          and an all-around{" "}
          <strong className="text-[#ffe66d] glowy">tech enthusiast</strong>. I
          love diving into everything because, hey,{" "}
          <em className="italic text-gray-400">
            something is always better than nothing
          </em>
          , right? ‎{" "}
          <Link href="/more" className="underline">
            know more here...
          </Link>
        </p>
      </section>

      <section className="holder text-center mt-12 flex-col">
        <h1 className="text-2xl font-black text-sky-500 glowy">
          My Tech Stack
        </h1>
        <TechStack />
        <h2 className="text-gray-500 italic mt-4">
          P.S. : I&apos;ve been coding &amp; programming since 2019
        </h2>
      </section>

      <section className="holder text-center mt-12 mb-12 relative h-[50px] overflow-hidden flex-col ">
        <h1 className="text-2xl font-black text-yellow-500 glowy">
          Some fun facts about me!
        </h1>

        <div className="relative overflow-hidden h-[50px] text-white">
          <FunFacts />
        </div>
      </section>
    </div>
  );
}
