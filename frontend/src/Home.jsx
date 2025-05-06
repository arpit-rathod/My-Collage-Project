import React from "react";
import Navbar from "./Navbar.jsx";
import SlideShow from "./SlideShow.jsx";
import HomeLinks from "./HomeLinks.jsx";
import Footer from "./Footer.jsx";
export default function Home(props) {
  return (
    <>
      <div style={{ width: "100%", height: "600px", position: "relative" }}>
        <Navbar></Navbar>
        {/* <CollegeName></CollegeName> */}
        <SlideShow></SlideShow>
        <HomeLinks></HomeLinks>
        <Footer></Footer>
        {/* <Particles
          particleColors={["#8b8d89", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        ></Particles> */}
      </div>
    </>
  );
}
