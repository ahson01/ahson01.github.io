
import Navbar from "../common/navbar"; 
import ProjectShowcase from "./projects"
export default function Home() {
  return (
    <div className="font-mono">
      <Navbar />
        <div className="m-12">
        <ProjectShowcase />

        </div>
    </div>
  );
}

