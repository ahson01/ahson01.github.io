
import Navbar from "./common/navbar"; 
import Portfolio from "./portfolio"; 
import Image from "next/image";
import RoamingGif from "./allay";
import CanvasAnimation from "./rain";

export default function Home() {
  return (
    <div className="font-mono">
      <Navbar />

      <Portfolio />

<Image
  className="absolute right-[5%] lg:top-[105%] md:top-[125%] top-[150%] -z-10 !m-0  !p-0 drop-shadow-[0_0_100px_rgba(255,51,85,0.33)] [image-rendering:pixelated] "
  src="/random-pics/kelvin.gif" // Notice the leading '/'
  alt="something"
  width={178}
  height={152}
/>

<RoamingGif />


<CanvasAnimation />


    </div>
  );
}

