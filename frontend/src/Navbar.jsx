import React, { lazy, Suspense, useEffect, useState, useLayoutEffect, useRef } from "react";
import { NavLink, Outlet } from 'react-router-dom'
import { useContext } from "react";
import "./Navbar.css"
import student_profile from './assets/bdb9892b-22d0-404d-ac50-075eb8fc006c.jpg';
import professor_profile from './assets/bdb9892b-22d0-404d-ac50-075eb8fc006c.jpg';
import admin_profile from './assets/bdb9892b-22d0-404d-ac50-075eb8fc006c.jpg';
import axios from "axios";
import ProfileModal from "./ProfileModal"
import FullPageSpinner from ".//animation-components/spinner"
const LoginModel = lazy(() => import("./LoginModel"))
export default function Navbar(props) {
     const [navBarHeight, setNavBarHeight] = useState(0);
     const [profileImage, setProfileImage] = useState(null);
     const getNavbarHeight = async () => {
          const navbar = document.querySelector(".navbar");
          if (navbar) {
               console.log(`Navbar Height: ${navBarHeight}`);
               setNavBarHeight(navbar.offsetHeight);
               // setNavBarHeight(navbar.getBoundingClientRect().height);
               console.log(`Navbar Height: ${navBarHeight}`);
          }
          return navBarHeight;
     }
     const [profileModule, setprofileModule] = useState(false);
     const [isLoginModal, setIsLoginModal] = useState(false);
     const [isLoggedIn, setIsLoggedIn] = useState(false);
     const [role, setRole] = useState(false);

     useEffect(() => {
          const checkLogin = async () => {
               // frontend
               try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
                         withCredentials: true
                    });
                    if (res.status === 200) {

                         console.log('User is logged in', res.data);
                         setIsLoggedIn(true);
                         console.log('User role ', res.data.user);
                         setRole(res.data.user.userAvailable.role)
                    } else if (res.status === 401) {
                         alert("User is NOT logged in");
                         console.log('User is NOT logged in');
                    }
               } catch (error) {
                    console.error('Error checking login status:', error);
               }
          }
          checkLogin();
     }, []);
     useEffect(() => {
          console.log("run profile set effect");
          if (role == "student") {
               setProfileImage(student_profile);
          } else if (role == "teacher") {
               setProfileImage(professor_profile);
          } else if (role == "admin") {
               setProfileImage(admin_profile);
          }
     }, [role])
     return (
          <div className={
               `navbar Navbar-container fixed top-0 w-full flex justify-end place-items-center h-16 md:h-18 z-50`
          }>
               <div style={{ opacity: props.navbarOpacity }} className={`${props.className} absolute w-full h-full z-1 flex place-items-center`}>
                    <div className="heading font-bold text-lg md:text-3xl text-red-900 select-none  px-7 tracking-wide">
                         <p className="md:pr-32 pr-10">
                              Truba Group Of Institute Bhoapal M.P.
                         </p>
                    </div>
               </div>
               <div className="profileDiv w-15 mr-1 md:mr-5 flex items-center justify-center relative opacity-[1] z-10 ">
                    {isLoggedIn
                         ?
                         <div onClick={() => setprofileModule(!profileModule)} className="cursor-pointer border-1 border-black w-7 h-7 md:w-10 md:h-10 rounded-full">
                              <img className="profileimg rounded-4xl md:rounded-3xl shadow-amber-950 shadow-2xl drop-shadow-lg " src={profileImage} alt="profile" />
                         </div>
                         :
                         <div className="LoginDiv flex items-center border-1 border-red-800 rounded-xl animate-bounce hover:animate-none hover:scale-110 transition-all duration-150">
                              <span className="text-red-800 px-[6px] text-sm md:text-xl  font-semibold shadow transition duration-150 cursor-pointer"
                                   onClick={() => {
                                        setIsLoginModal(!isLoginModal);
                                        console.log("Login modal toggled");
                                   }}>
                                   Login
                              </span>
                              {/* <div className={isLoginModal?""}> */}
                         </div>
                    }
               </div>
               {isLoginModal &&
                    <Suspense fallback={<FullPageSpinner size={15} transparentBackground={true}></FullPageSpinner>}>
                         <LoginModel onClose={() => setIsLoginModal(false)}></LoginModel>
                    </Suspense>
               }
               {profileModule && <ProfileModal profileModule={profileModule} setprofileModule={setprofileModule} getNavbarHeight={getNavbarHeight} profileImage={profileImage} />}
          </div >

          // <div
          //      className={`${props.className} Navbar-container fixed top-0 w-full  flex justify-between h-16 shadow-lg border-orange-800 z-100`}
          // >
          //      <div className="heading font-bold text-lg md:text-3xl text-orange-800 flex justify-start " >
          //           <p className="md:pr-32 pr-10">
          //                {/* TGI */}
          //                ABC
          //                {/* Truba Institute of Engineering and Information Technology Bhopal M.P */}
          //           </p>
          //      </div>
          //      {
          //           isLoggedIn ? (
          //                <div onClick={() => { setprofileModule(!profileModule) }} className="profileDiv flex-nowrap w-[100px] p-0.5 cursor-pointer place-items-center ">
          //                     <img className="profileimg h-14 w-14 rounded-3xl  " src={profileImage} alt="" srcSet="" />
          //                     {/* <p className="profile-title w-[100px] whitespace-nowrap">Name of</p> */}
          //                </div>
          //           ) : (
          //                <div>
          //                     <div onClick={() => { setIsLoginModal(!isLoginModal) }} className="LoginDiv h-full  flex justify-center items-center md:mx-5">
          //                          <span className="text-black px-4 py-2 rounded cursor-pointer md:text-2xl font-medium font-serif">Login</span>
          //                     </div>
          //                     {/* <div className={isLoginModal?""}> */}
          //                     {isLoginModal &&
          //                          // <Suspense fallback={<div className="font-medium">...Loading</div>}>
          //                          <LoginModel onClose={() => setIsLoginModal(false)}></LoginModel>
          //                          // </Suspense>
          //                     }
          //                </div>
          //           )
          //      }
          //      {profileModule ?
          //           <ProfileModal
          //                profileImage={profileImage}></ProfileModal>
          //           : null
          //      }
          // </div>
     );
}