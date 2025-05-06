import React, { lazy, Suspense, useState } from "react";
import { NavLink, Outlet } from 'react-router-dom'
import "./Navbar.css"
import profileImage from './assets/image.png'
import { div, tr } from "motion/react-client";
const LoginModel = lazy(() => import("./LoginModel"))
const ProfileModal = lazy(() => import("./ProfileModal"))

export default function Navbar(props) {
  const [profileModule, setprofileModule] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(true);
  const localStorageData = JSON.parse(localStorage.getItem("UserInfo"));
  console.log(localStorageData);

  return (
    <div
      className="Navbar-container fixed top-0% w-full  flex justify-between bg-white h-24 shadow-lg border-orange-800 z-100"
    >
      {/* <div className="menu-container">
        <MenuBar></MenuBar>
      </div> */}
      <div className="heading font-bold text-lg md:text-3xl text-orange-800 flex justify-start " >
        <p className="md:pr-32 pr-10">
          {/* TGI */}
          Truba Institute of Engineering and Information Technology Bhopal M.P
        </p>
      </div>
      {
        localStorageData ? (
          <div onClick={() => { setprofileModule(!profileModule) }} className="profileDiv flex-nowrap w-[100px] p-0.5 cursor-pointer place-items-center ">
            <img className="profileimg h-14 w-14 rounded-3xl  " src={profileImage} alt="" srcSet="" />
            <p className="profile-title w-[100px] whitespace-nowrap">{localStorageData.name}</p>
          </div>)
          : (
            <div>
              <div onClick={() => { setIsLoginModal(!isLoginModal) }} className="LoginDiv h-full  flex justify-center items-center md:mx-5">
                <span className="text-black px-4 py-2 rounded cursor-pointer md:text-2xl font-medium font-serif">Login</span>
              </div>
              {/* <div className={isLoginModal?""}> */}
              {isLoginModal &&
                // <Suspense fallback={<div className="font-medium">...Loading</div>}>
                <LoginModel onClose={() => setIsLoginModal(false)}></LoginModel>
                // </Suspense>
              }
            </div>
          )
      }
      {/* // <Suspense fallback={<div className="font-medium">...Loading</div>}>
        //   </Suspense> */}
      {profileModule ?
        <ProfileModal localStorageData={localStorageData}
          profileImage={profileImage}></ProfileModal>
        : null
      }
    </div>
  );
}
