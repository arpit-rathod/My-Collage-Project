import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";


function ProfileModal({ profileImage, navbarHeight }) {
     const [role, setRole] = useState(null);
     const [profileLoading, setProfileLoading] = useState(true);
     const [profile, setProfile] = useState(null);
     useEffect(() => {
          console.log("useEffect run at profile modal");
          const fetchData = async () => {
               let token = Cookies.get("auth_token");
               if (!token) {
                    console.log("No auth_token found in cookies");
                    return;
               }
               token = jwtDecode(token);
               console.log(token.userAvailable.role);
               setRole(token.userAvailable.role);
               try {
                    // console.log("Fetching profile data...");
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/getProfileAllDetails`, {
                         withCredentials: true,
                    });
                    console.log(response.data.user);
                    if (response.status === 200) {
                         setProfileLoading(false);
                         setProfile(response.data.user);
                         alert("Profile data fetched successfully");
                         console.log("Profile data fetched successfully");
                    } else if (response.status === 404) {
                         console.log("User details not found");
                         alert("User details not found", response.data.message);
                    }
               } catch (error) {
                    console.error("Error fetching profile data:", error);
               }
          };

          fetchData();
     }, []);

     useEffect(() => {
          if (!profile) return;
          setProfile(profile);
     }, [profile]);

     async function logOutUser() {
          console.log("logOutUser run" + document.cookie);
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {
               withCredentials: true,
          });
          console.log("logOutUser response", response);
          if (response.status === 200) {
               alert(response.data.message || "Logged out successfully by server");
               console.log(response.data.message || "Logged out successfully by server");
               setTimeout(() => {
                    window.location.reload();
               }, 500);
          } else if (response.status === 201) {
               if (document.cookie) {
                    Cookies.remove("auth_token");
                    alert("manually cookie removed");
                    console.log("manually cookie removed");
                    setTimeout(() => {
                         window.location.reload();
                    }, 50000);
               }
          }
     }

     if (!profile) return (<h1 className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">Loading...</h1>)

     const styleForProfileLinks = `hover:bg-gray-200 px-5 hover:border-b-[2px] hover:border-bg-gray-500 border-b-[1px] border-gray-300 mx-3 cursor-pointer rounded-sm m-2 p-2 hover:shadow-md hover:translate-x-2 hover:scale-105`;

     const styleForLogOut = `hover:border-b-[2px] hover:border-bg-gray-500 border-[1px] border-gray-300 cursor-pointer hover:shadow-md  hover:scale-110 text-lg text-red-700 font-medium hover:bg-gray-300 rounded-sm w-24`
     return (
          <div className={`top-[10vh] profile-module p-3 md:p-5 fixed right-5  z-200 min-w-[250px] h-auto min-h-[80vh] bg-white   border-[1px] border-gray-300 rounded shadow font-mono grid`}>
               <div className='flex-nowrap align-middle m-3 p-3'>
                    <div className="profileModDiv md:flex">
                         <div div className="imgDiv flex justify-center p-2" >
                              <img className="w-25 rounded-[50%] h-25" src={profileImage} alt="" />
                         </div >
                         <div className="details p-2 md:p-5 flex justify-center">
                              <div className="">
                                   <p className="name text-[18px] font-medium p-0">{profile?.name}</p>
                                   {/* {profile.name && (
              <p className="name text-[10px] font-medium p-0">{profile.name}</p>
              )} */}
                                   <p className="text-[12px] text-black font-medium p-0">{profile?.branch}</p>
                                   <p className="enrollmentNo text-[12px] font-medium p-0">{profile?.username}</p>
                              </div>
                         </div>
                    </div >
                    {/* <div className="links-div"> */}
                    {role == "student" &&
                         <div className="links-div">
                              <div className="flex flex-col justify-start font-semibold">
                                   <NavLink className={`${styleForProfileLinks}`} to={`${import.meta.env.VITE_FRONTEND_URL}/student-classroom`}><span>MY Class Room</span></NavLink>
                                   <NavLink className={`${styleForProfileLinks}`} to={`${import.meta.env.VITE_FRONTEND_URL}/my-library`}><span>My Library</span></NavLink>
                                   <NavLink className={`${styleForProfileLinks}`} to={`${import.meta.env.VITE_FRONTEND_URL}/attendance-record`}><span>Attendance Record</span></NavLink>
                              </div>
                         </div>
                    }
                    {role == "teacher" &&
                         <div className="links-div">
                              <div className="flex flex-col justify-start font-semibold">
                                   <NavLink className={`${styleForProfileLinks}`} to={`/user-lectures`}><span>My All Lectures</span></NavLink>
                                   <NavLink className={`${styleForProfileLinks}`} to={`/assignments-record`}><span>Assignments Record</span></NavLink>
                                   <NavLink className={`${styleForProfileLinks}`} to={`/publish-notice`}><span>Push Notice</span></NavLink>
                              </div>
                         </div>
                    }
                    {role == "admin" &&
                         <div className="links-div">
                              <div className="flex flex-col justify-start font-semibold">
                                   <NavLink className={`${styleForProfileLinks}`} to={`${import.meta.env.VITE_FRONTEND_URL}/record`}><span>admin page 1</span></NavLink>
                                   <NavLink className={`${styleForProfileLinks}`} to={`/CollectAttendance`}><span>admin page 1</span></NavLink>
                                   <NavLink className={`${styleForProfileLinks}`} to={`/submitAttendance`}><span>admin page 1</span></NavLink>
                              </div>
                         </div>
                    }
               </div>
               {/* </div> */}
               <div className="logOut  flex justify-center align-text-bottom">
                    <div className='flex-nowrap place-content-end'>
                         <button onClick={() => logOutUser()} className={`${styleForLogOut} text-lg text-red-700 font-medium hover:bg-gray-300 rounded-sm w-24
          `}>Logout</button>
                    </div>
               </div>

          </div >
     );
}

export default ProfileModal;