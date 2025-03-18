interface Project {
    title: string;
    image: string;
    link: string;
    description: string;
  }
  
  const projects: Project[] = [
    {
      title: "Tech Sleek Blog",
      image: "./projects/blog.png",
      link: "https://techsleekblogs.vercel.app/",
      description: "A cool blog that is fully made in Django and hosted on Vercel.",
    },
    {
      title: "PPT TO PNG",
      image: "./projects/ppt-to-png.png",
      link: "https://png-to-ppt.glitch.me/",
      description: "Convert your PNG files into PowerPoint presentations.",
    },
    {
      title: "Maths Speed Multiplier",
      image: "./projects/msm.png",
      link: "https://ahson01.github.io/msm",
      description: "A cool site to link my socials, for my *GAMING* YouTube channel.",
    },
  ];
  
  const ProjectCard = ({ project }: { project: Project }) => (
    <a href={project.link} target="_blank" rel="noopener noreferrer" className="group relative flex flex-col justify-between overflow-hidden rounded-xl transform-gpu bg-background border border-white/10 shadow-[0_-20px_80px_-20px_rgba(255,255,255,0.1)] min-h-[300px] sm:min-h-[400px] md:min-h-[500px] transition ease-in-out duration-500">
      <div className="absolute inset-0">
        <img src={project.image} alt={project.title} className="absolute left-0 top-0 h-full w-full object-cover transition-all duration-300 ease-out opacity-70 group-hover:scale-105 mask-gradient" />
      </div>
      <div className="relative z-10 flex flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
        <h2 className="text-xl font-semibold text-neutral-300 m-0">{project.title}</h2>
        <p className="max-w-lg text-neutral-400 m-0">{project.description}</p>
      </div>
      <div className="absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="pointer-events-auto bg-white rounded-lg py-1 px-2 text-xs text-black flex gap-2 items-center cursor-pointer hover:bg-white/80 transition-colors">
          Visit the site
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645l4.00005 4c.1952.19526.1952.51184.0.707100000000001L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536c-.19527-.1953-.19527-.511900000000001.0-.7072L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5s.22386-.5.5-.5h8.7929L8.14645 3.85355c-.19527-.19526-.19527-.51184.0-.7071z" fill="currentcolor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </div>
      </div>
    </a>
  );
  
  export default function ProjectShowcase() {
    return (
      <div className="relative overflow-auto flex-col h-[84vh] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    );
  }
  