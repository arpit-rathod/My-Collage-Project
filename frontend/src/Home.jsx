import React, { useState, useEffect, useLayoutEffect } from "react";
import Navbar from "./Navbar.jsx";
import SlideShow from "./SlideShow.jsx";
import HomeLinks from "./HomeLinks.jsx";
import Footer from "./Footer.jsx";
import CampusPhotoComponent from "./Basic-Components/campusPhoto.jsx";
import campusImg from './/.//assets//campusPhoto.jpg'
export default function Home(props) {
     const [navbarBG, setNavbarBG] = useState("transparent"); // start invisible
     const [navHeight, setNavHeight] = useState("10vh");
     useLayoutEffect(() => {
          const navbar = document.querySelector(".navbar");
          if (navbar) {
               setNavHeight(navbar.getBoundingClientRect().height);
          }
          console.log(`Navbar Height: ${navHeight}`);
     }, []);
     useEffect(() => {
          const handleScroll = () => {
               const homeLinks = document.querySelector(".home-links"); // target HomeLinks
               const navbar = document.querySelector(".navbar"); // target Navbar
               if (!homeLinks || !navbar) return;

               const homeLinksTop = homeLinks.getBoundingClientRect().top;
               const navbarHeight = navbar.offsetHeight;

               // If HomeLinks touches Navbar area → fade Navbar in
               if (homeLinksTop <= navbarHeight + 40) {
                    // setNavbarBG("transition-[background-color_900ms,border-bottom_900ms] bg-[#19243D] border-b-4 border-b-orange-400");
                    setNavbarBG("bg-[#19243D] border-b-4 transition-bg transition-border-b duration-800"); // dark yellow 
               } else {
                    setNavbarBG("bg-transparent"); // hidden
               }
               // console.log(`HomeLinks Top: ${homeLinksTop}, Navbar Height: ${navbarHeight}, BG: ${navbarBG}`);
               const scrollY = window.scrollY;
               const campusEle = document.querySelector(".campus-photo"); // target CampusPhoto
               campusEle.style.transform = `translateY(${scrollY * 0.2}px)`; // parallax effect
          };
          window.addEventListener("scroll", handleScroll);
          return () => window.removeEventListener("scroll", handleScroll);
     }, []);

     return (
          <div className="relative w-full pb-3">
               {/* Navbar with fade effect */}
               <Navbar navbarHeight={navHeight}
                    className={`${navbarBG} navbar absolute z-8 top-0 left-0 w-full`}
               />

               {/* Campus Photo in background */}
               <CampusPhotoComponent
                    className="campus-photo relative z-3 top-0 left-0 w-full h-[60vh]"
                    campusImg={campusImg}
                    altText="Campus"
               />

               {/* HomeLinks (scroll trigger) */}
               <HomeLinks className="home-links relative z-5 top-[-5vh]" />
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
