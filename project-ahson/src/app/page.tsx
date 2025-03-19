
import Navbar from "./common/navbar"; 
import Portfolio from "./portfolio"; 
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-mono">
      <Navbar />

      <Portfolio />

<Image
  className="absolute right-20 -bottom-75 !m-0  !p-0 drop-shadow-[0_0_100px_rgba(255,51,85,0.33)] [image-rendering:pixelated] "
  src="/random-pics/kelvin.gif" // Notice the leading '/'
  alt="something"
  width={178}
  height={152}
/>


    </div>
  );
}

