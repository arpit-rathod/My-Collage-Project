import React, { lazy, Suspense, useEffect, useState } from "react";
import { NavLink, Outlet } from 'react-router-dom'
import { useContext } from "react";
import "./Navbar.css"
import profileImage from './assets/image.png'
import { div, tr } from "motion/react-client";
import axios from "axios";
import ProfileModal from "./ProfileModal"
import FullPageSpinner from ".//animation-components/spinner"
const LoginModel = lazy(() => import("./LoginModel"))
export default function Navbar(props) {
     // const { profileData, profileDataLoading } = useContext(ProfileContext);
     const [profileModule, setprofileModule] = useState(false);
     const [isLoginModal, setIsLoginModal] = useState(false);
     const [isLoggedIn, setIsLoggedIn] = useState(false);
     const profileData = false;
     useEffect(() => {
          const checkLogin = async () => {
               // frontend
               try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
                         withCredentials: true
                    });
                    if (res.status === 200) {
                         alert("User is logged in");
                         setIsLoggedIn(true);
                         console.log('User is logged in', res.data);
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
     return (
          <div className={
               `${props.className} Navbar-container fixed top-0 w-full flex justify-between h-16 border-orange-500 z-50`
          }>
               <div className="heading font-bold text-lg md:text-3xl text-red-900 select-none flex items-center px-7 tracking-wide">
                    <p className="md:pr-32 pr-10">
                         {/* Truba Institute of Engineering and Information Technology Bhopal M.P */}
                    </p>
               </div>
               {isLoggedIn
                    ? <div className="profileDiv flex items-center gap-3 cursor-pointer hover:bg-orange-800/30 rounded-xl px-3 py-5 pr-5 transition"
                         onClick={() => setprofileModule(!profileModule)}>
                         <img className="profileimg h-12 w-12 rounded-full border-2 border-orange-500 shadow-md" src={profileImage} alt="profile" />
                    </div>
                    : <div className="LoginDiv flex items-center md:mx-5">
                         <span className="text-orange-400 bg-white px-4 py-2 rounded-xl hover:bg-orange-100 font-semibold md:text-lg shadow transition duration-150 cursor-pointer"
                              onClick={() => {
                                   setIsLoginModal(!isLoginModal);
                                   console.log("Login modal toggled");
                              }}>
                              Login
                         </span>
                         {/* <div className={isLoginModal?""}> */}
                         {isLoginModal &&
                              <Suspense fallback={<FullPageSpinner size={15} transparentBackground={true}></FullPageSpinner>}>
                                   <LoginModel onClose={() => setIsLoginModal(false)}></LoginModel>
                              </Suspense>
                         }
                    </div>
               }
               {profileModule && <ProfileModal navbarHeight={props.navbarHeight} profileImage={profileImage} />}
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