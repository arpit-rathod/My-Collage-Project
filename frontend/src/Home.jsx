import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import SlideShow from "./SlideShow.jsx";
import HomeLinks from "./HomeLinks.jsx";
import Footer from "./Footer.jsx";
import CampusPhotoComponent from "./Basic-Components/campusPhoto.jsx";
import campusImg from './/.//assets//campusPhoto.jpg'
export default function Home(props) {
     const [navbarBG, setNavbarBG] = useState("bg-transparent"); // start invisible
     const [navbarOpacity, setNavbarOpacity] = useState(0); // start invisible
     useEffect(() => {

          console.log("Navbar opacity changed:", navbarOpacity);
     }, []);

     useEffect(() => {
          const handleScroll = () => {
               const homeLinks = document.querySelector(".home-links"); // target HomeLinks
               const navbar = document.querySelector(".navbar"); // target Navbar
               if (!homeLinks || !navbar) return;

               const homeLinksTop = homeLinks.getBoundingClientRect().top;
               const navbarBottom = navbar.getBoundingClientRect().bottom;
               let D = homeLinksTop - navbarBottom;
               // console.log(D);
               if (D < 50) {
                    let opacity = Math.max(0, Math.min(1, 1 - D / 50));
                    setNavbarOpacity(opacity);
                    // console.log(opacity);
                    setNavbarBG(`bg-gradient-to-r from-gray-200 to-gray-300`);
                    // console.log(navbarOpacity);
                    // If HomeLinks touches Navbar area → fade Navbar in
                    // setNavbarBG(`bg-gradient-to-r from-red-800 to-red-900 border-b-4 `); // dark yellow 
               } else {
                    setNavbarOpacity(0);
                    setNavbarBG("bg-transparent"); // hidden
               }
               // const navbarHeight = navbar.offsetHeight;
               // if (homeLinksTop <= navbarHeight + 60) {
               // console.log(homeLinksTop);      
               // transition - bg transition - border - b duration - 800
               // setNavbarBG("transition-[background-color_900ms,border-bottom_900ms] bg-[#19243D] border-b-4 border-b-orange-400");
               // } else {
               // setNavbarBG("bg-transparent"); // hidden
               // }
               // console.log(`HomeLinks Top: ${homeLinksTop}, Navbar Height: ${navbarHeight}, BG: ${navbarBG}`);
               const scrollY = window.scrollY;
               const campusEle = document.querySelector(".campus-photo"); // target CampusPhoto
               campusEle.style.transform = `translateY(${scrollY * 0.2}px)`; // parallax effect
          };
          window.addEventListener("scroll", handleScroll);
          setNavbarBG(`bg-gradient-to-r from-red-800 to-red-900`); // dark yellow 
          return () => window.removeEventListener("scroll", handleScroll);
     }, []);

     return (
          <div className="relative w-full pb-3">
               {/* Navbar with fade effect */}
               <Navbar navbarOpacity={navbarOpacity}
                    className={`${navbarBG}`}
               />
               {/* Campus Photo in background */}
               <CampusPhotoComponent id="campus-div"
                    className="campus-photo relative z-3 top-0 left-0 w-full"
                    campusImg={campusImg}
                    altText="Campus"
               />

               {/* HomeLinks (scroll trigger) */}
               <HomeLinks className="home-links relative z-5 top-[-10vh]" />
               <Footer />
          </div>
     );
}




{/* <div style={{ width: "100%", height: "600px", position: "relative" }}>
          <Navbar className="absolute top-0 left-0 z-3 bg-white"></Navbar>
          <CampusPhotoComponent className="absolute top-0 left-0 h-auto z-1" campusImg={campusImg} altText="Campus" />
          <HomeLinks className="absolute top-10 z-2"></HomeLinks>
          <Footer></Footer>
     </div> */}
{/* <SlideShow></SlideShow> */ }
{/* <CollegeName></CollegeName> */ }
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
