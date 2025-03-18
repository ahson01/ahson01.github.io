"use client"
import { useEffect, useState } from "react";
import { FaGithub, FaEnvelope, FaDiscord } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  { href: "https://github.com/ahson01#", icon: <FaGithub /> },
  { href: "mailto:ahson01@proton.me", icon: <FaEnvelope /> },
  { href: "https://dsc.gg/imeccentric", icon: <FaDiscord /> },
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
  "If you ask nicely, I'll code anything for you for free."
];

const SocialIcons = () => (
  <div className="socials flex gap-4 text-2xl relative md:absolute top-[-10%] right-0 p-0 md:p-12">
    {socialLinks.map((link, index) => (
      <a key={index} href={link.href} className="flex justify-center items-center w-12 h-12 rounded-lg border-[#0e1c3276] border-[0.5px] hover:bg-gray-600/100">
        {link.icon}
      </a>
    ))}
  </div>
);

const TechStack = () => (
  <div className="inline-flex flex-wrap justify-center mt-6 items-center w-full gap-2">
    {techStack.map((tech, index) => (
      <Image 
        key={index} 
        className="mcard rounded-2xl !brightness-100 !opacity-100 transition-all duration-300 hover:!scale-125 h-[45px] w-auto" 
        src={`https://img.shields.io/badge/${tech.name}-${tech.color}?style=for-the-badge&logo=${tech.name}&logoColor=${tech.logoColor}`} 
        alt={`${tech.name} Badge`}
        width={100}
        height={28}
      />
    ))}
  </div>
);

const FunFacts = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => (prev + 1) % (funFacts.length * 50));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <ul className="relative left-1/2 transform -translate-x-1/2 space-y-5 text-white" style={{ transform: `translateY(-${scrollPosition}px)` }}>
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
          <h1 className="md:!mb-4 md:!mb-0 w-fit md:!text-left glowy text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500 drop-shadow-lg">
            Hey, I&apos;m Ahson! 
          </h1>
        </div>

        <p className="text-lg !mb-[6px] !text-left text-gray-300 leading-relaxed mt-6">
          I&apos;m a <strong className="text-[#00d9ff] glowy">full-stack developer</strong> 💻, a <strong className="text-[#ff6b6b] glowy">white-hat hacker</strong> 🔐, and an all-around <strong className="text-[#ffe66d] glowy">tech enthusiast</strong>. I love diving into everything because, hey, <em className="italic text-gray-400">something is always better than nothing</em>, right?
          ‎ <Link href="/more" className="underline">know more here...</Link>
        </p>
      </section>

      <section className="holder text-center mt-12 flex-col">
        <h1 className="text-2xl font-black text-sky-500 glowy">My Tech Stack</h1>
        <TechStack />
        <h2 className="text-gray-500 italic mt-4">P.S. : I&apos;ve been coding &amp; programming since 2019</h2>
      </section>

      <section className="holder text-center mt-12 mb-12 relative h-[50px] overflow-hidden flex-col ">

      <h1 className="text-2xl font-black text-yellow-500 glowy">Some fun facts about me!</h1>
      


        <div className="relative overflow-hidden h-[50px] text-white">
        <FunFacts />

        </div>
      </section>
    </div>
  );
}
