import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

function ProfileModal({ profileImage, getNavbarHeight, setprofileModule, profileModule }) {
     const [navHeight1, setNavHeight] = useState(null);
     const [role, setRole] = useState(null);
     const [profileLoading, setProfileLoading] = useState(true);
     const [profile, setProfile] = useState(null);

     // Get navbar height after render
     useEffect(() => {
          const height = Math.round(getNavbarHeight());
          setNavHeight(height);
          console.log("Navbar height:", height);
     }, [getNavbarHeight]);

     // Fetch profile once
     useEffect(() => {
          const fetchData = async () => {
               try {
                    const response = await axios.get(
                         `${import.meta.env.VITE_API_URL}/getProfileAllDetails`,
                         { withCredentials: true }
                    );
                    if (response.status === 200) {
                         setProfile(response.data.userProfile);
                         setRole(response.data?.userProfile?.role);
                         setProfileLoading(false);
                    }
               } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setProfileLoading(false);
               }
          };
          fetchData();
     }, []);

     // Logout
     async function logOutUser() {
          try {
               const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/logout`,
                    {},
                    { withCredentials: true }
               );
               if (response.status === 200) {
                    console.log(response.data.message || "Logged out");
                    setTimeout(() => window.location.reload(), 200);
               }
          } catch (error) {
               console.error("Logout error", error);
          }
     }

     // Custom NavLink component with better styling
     const SidebarNavLink = ({ to, children, icon }) => (
          <NavLink
               to={to}
               className={({ isActive }) =>
                    `flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ease-in-out hover:bg-red-700/50 hover:translate-x-1 group ${isActive ? 'bg-red-700/70 border-l-4 border-white' : ''
                    }`
               }
               onClick={() => setprofileModule(false)}
          >
               {icon && <span className="text-lg">{icon}</span>}
               <span className="font-medium">{children}</span>
               <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
          </NavLink>
     );

     return (
          <>
               {/* Backdrop Overlay with fade animation */}
               <div
                    className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out ${profileModule
                         ? 'opacity-100 visible'
                         : 'opacity-0 invisible'
                         }`}
                    onClick={() => setprofileModule(false)}
               />

               {/* Sidebar with enhanced animations */}
               <div
                    className={`fixed top-0 right-0 z-50 w-80 h-full bg-gradient-to-b from-black-800 to-black-900 text-white shadow-2xl transform transition-all duration-500 ease-out ${profileModule
                         ? 'translate-x-0 opacity-100'
                         : 'translate-x-full opacity-0'
                         }`}
                    style={{ paddingTop: navHeight1 ? `${navHeight1}px` : '4rem' }}
               >
                    {/* Close button */}
                    {/* style={{ top: navHeight1 ? `${navHeight1 + 16}px` : '5rem' }} */}
                    <button
                         onClick={() => setprofileModule(false)}
                         className="absolute top-4 right-4 p-2 rounded-xl border-[1px] border-transparent hover:bg-red-700/30"

                    >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                    </button>

                    <div className="p-6 flex flex-col h-full">
                         {/* Profile Section with loading state */}
                         <div className="mb-8">
                              {profileLoading ? (
                                   <div className="flex items-center space-x-4 animate-pulse">
                                        <div className="w-20 h-20 bg-red-700/50 rounded-full"></div>
                                        <div className="space-y-2">
                                             <div className="h-6 bg-red-700/50 rounded w-32"></div>
                                             <div className="h-4 bg-red-700/50 rounded w-24"></div>
                                             <div className="h-4 bg-red-700/50 rounded w-28"></div>
                                        </div>
                                   </div>
                              ) : (
                                   <div className="flex items-center space-x-4 p-4 bg-red-500/10 rounded-xl backdrop-blur-sm border border-red-100/10 hover:border hover:border-red-600/30">
                                        <div className="relative">
                                             <img
                                                  className="w-20 h-20 rounded-full border-4 border-white/20 object-cover"
                                                  src={profileImage}
                                                  alt="profile"
                                             />
                                             <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div className="flex-1">
                                             <h3 className="text-xl font-semibold text-white mb-1">{profile?.name}</h3>
                                             <p className="text-red-200 text-sm mb-1">{profile?.branch}</p>
                                             <p className="text-red-300 text-sm font-mono">@{profile?.username}</p>
                                             <div className="mt-2">
                                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white capitalize">
                                                       {role}
                                                  </span>
                                             </div>
                                        </div>
                                   </div>
                              )}
                         </div>

                         {/* Navigation Links */}
                         <div className="flex-1">
                              <h4 className="text-sm font-semibold text-red-200 uppercase tracking-wide mb-4">
                                   Quick Access
                              </h4>
                              <nav className="space-y-2">
                                   {role === "student" && (
                                        <>
                                             <SidebarNavLink to="/student-classroom" icon="🏛️">
                                                  My Class Room
                                             </SidebarNavLink>
                                             <SidebarNavLink to="/my-library" icon="📚">
                                                  My Library
                                             </SidebarNavLink>
                                             <SidebarNavLink to="/attendance-record" icon="📊">
                                                  Attendance Record
                                             </SidebarNavLink>
                                        </>
                                   )}
                                   {role === "teacher" && (
                                        <>
                                             <SidebarNavLink to="/user-lectures" icon="🎓">
                                                  My All Lectures
                                             </SidebarNavLink>
                                             <SidebarNavLink to="/assignments-record" icon="📝">
                                                  Assignments Record
                                             </SidebarNavLink>
                                             <SidebarNavLink to="/publish-notice" icon="📢">
                                                  Push Notice
                                             </SidebarNavLink>
                                        </>
                                   )}
                                   {role === "admin" && (
                                        <>
                                             <SidebarNavLink to="/admin-dashboard" icon="⚙️">
                                                  Admin Dashboard
                                             </SidebarNavLink>
                                             <SidebarNavLink to="/user-management" icon="👥">
                                                  User Management
                                             </SidebarNavLink>
                                             <SidebarNavLink to="/system-settings" icon="🔧">
                                                  System Settings
                                             </SidebarNavLink>
                                        </>
                                   )}
                              </nav>
                         </div>

                         {/* Footer Actions */}
                         <div className="mt-auto pt-6 border-t border-red-200">
                              <div className="space-y-3">
                                   {/* <button
                                        className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200 hover:shadow-lg border border-red-200"
                                        onClick={() => {
                                             // Add settings navigation logic here
                                             setprofileModule(false);
                                        }}
                                   >
                                        <span>⚙️</span>
                                        <span>Settings</span>
                                   </button>  */}

                                   <button
                                        onClick={logOutUser}
                                        className="w-full flex items-center justify-center space-x-2 p-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                                   >
                                        <span>🚪</span>
                                        <span>Logout</span>
                                   </button>
                              </div>

                              {/* Version info */}
                              <div className="mt-4 text-center">
                                   <p className="text-xs text-gray-400">
                                        Version 1.0.0
                                   </p>
                              </div>
                         </div>
                    </div>
               </div>
          </>
     );
}

// function ProfileModal({ profileImage, getNavbarHeight, setprofileModule, profileModule }) {
//      const [navHeight1, setNavHeight] = useState(null);
//      const [role, setRole] = useState(null);
//      const [profileLoading, setProfileLoading] = useState(true);
//      const [profile, setProfile] = useState(null);
//      useEffect(() => {
//           setNavHeight(Math.round(getNavbarHeight()));
//           console.log(navHeight1);
//      }, [getNavbarHeight])
//      useEffect(() => {
//           console.log("useEffect run at profile modal");
//           const fetchData = async () => {
//                // let token = Cookies.get("auth_token");
//                // if (!token) {
//                //      console.log("No auth_token found in cookies");
//                //      return;
//                // }
//                // token = jwtDecode(token);
//                // console.log(token.userAvailable.role);
//                // setRole(token.userAvailable.role);
//                try {
//                     // console.log("Fetching profile data...");
//                     const response = await axios.get(`${import.meta.env.VITE_API_URL}/getProfileAllDetails`, {
//                          withCredentials: true,
//                     });
//                     console.log(response.data.userProfile);
//                     if (response.status === 200) {
//                          setProfile(response.data.userProfile);
//                          setProfileLoading(false);
//                          setRole(response.data?.userProfile?.role);
//                          console.log("Profile data fetched successfully");
//                     } else if (response.status === 404) {
//                          console.log("User details not found", response.data.message);
//                     } else if (response.status === 500) {
//                          console.log("Internal server error", response.data.message);
//                     }
//                } catch (error) {
//                     console.error("Error fetching user profile :", error);
//                }
//           };

//           fetchData();
//      }, []);

//      useEffect(() => {
//           if (!profile) return;
//           setProfile(profile);
//      }, [profile]);

//      async function logOutUser() {
//           console.log("logOutUser run" + document.cookie);
//           const response = await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {}, {
//                withCredentials: true,
//           });
//           console.log("api response of logout user", response);
//           if (response.status === 200) {
//                // alert(response.data.message || "Logged out successfully by server");
//                console.log(response.data.message || "Logged out successfully by server");
//                setTimeout(() => {
//                     window.location.reload();
//                }, 50000);
//           } else if (response.status === 401) {
//                console.log(response.data.message || "Not logged in");
//                // alert("manually cookie removed");
//                setTimeout(() => {
//                     window.location.reload();
//                }, 50000);
//           }
//      }
//      const linksDiv = `flex flex-col justify-start font-semibold`
//      // if (!profile) return (<h1 className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">Loading...</h1>)

//      const styleForProfileLinks = `hover:bg-gray-200 px-5 hover:border-b-[2px] hover:border-bg-gray-500 border-b-[1px] border-gray-300 mx-3 cursor-pointer rounded-sm m-2 p-2 hover:shadow-md hover:translate-x-2 hover:scale-105`;

//      const styleForLogOut = `hover:border-b-[2px] hover:border-bg-gray-500 border-[1px] border-gray-300 cursor-pointer hover:shadow-md  hover:scale-110 text-lg text-red-700 font-medium hover:bg-gray-300 rounded-sm w-24`
//      return (
//           //  w-6 transform transition-transform duration-500 ease-in-out
//           <div className={`before:translate-x-10 after:-translate-x-0 top-28 md:top-16 p-2 profile-module fixed right-0 z-200 min-w-[360px] h-auto min-h-[70vh] max-h-[80vh] bg-white overflow-y-scroll scrollbar-hide  border-[1px] border-gray-300 rounded shadow font-mono grid
//      inset-0 transition
//         ${profileModule ? "before:opacity-100 before:visible" : "before:opacity-0 before:invisible"} 
//         before:content-[''] before:absolute before:inset-0 before:bg-black/50 before:transition-opacity before:duration-500`}>
//                <div className={`flex-nowrap align-middle 
//                absolute top-0 right-0 h-full w-64 bg-red-800 text-white shadow-lg transform transition-transform duration-500 ease-in-out
//           ${profileModule ? "translate-x-0" : "translate-x-full"}`}>
//                     <div className="profileModDiv md:flex">
//                          <div div className="imgDiv flex justify-center p-2" >
//                               <img className="w-25 rounded-[50%] h-25" src={profileImage} alt="" />
//                          </div >
//                          <div className="details p-2 md:p-5 flex justify-center">
//                               <div className="">
//                                    <p className="name text-[18px] font-medium p-0">{profile?.name}</p>
//                                    {/* {profile.name && (
//                                    <p className="name text-[10px] font-medium p-0">{profile.name}</p>
//                                    )} */}
//                                    <p className="text-[12px] text-black font-medium p-0">{profile?.branch}</p>
//                                    <p className="enrollmentNo text-[12px] font-medium p-0">{profile?.username}</p>
//                               </div>
//                          </div>
//                     </div >
//                     {/* <div className="links-div"> */}
//                     {role == "student" &&
//                          <div className="links-div">
//                               <div className={`${linksDiv}`}>
//                                    <NavLink className={`${styleForProfileLinks}`} to={`${import.meta.env.VITE_FRONTEND_URL}/student-classroom`}><span>MY Class Room</span></NavLink>
//                                    <NavLink className={`${styleForProfileLinks}`} to={`${import.meta.env.VITE_FRONTEND_URL}/my-library`}><span>My Library</span></NavLink>
//                                    <NavLink className={`${styleForProfileLinks}`} to={`${import.meta.env.VITE_FRONTEND_URL}/attendance-record`}><span>Attendance Record</span></NavLink>
//                               </div>
//                          </div>
//                     }
//                     {role == "teacher" &&
//                          <div className="links-div">
//                               <div className={`${linksDiv}`}>
//                                    <NavLink className={`${styleForProfileLinks}`} to={`/user-lectures`}><span>My All Lectures</span></NavLink>
//                                    <NavLink className={`${styleForProfileLinks}`} to={`/assignments-record`}><span>Assignments Record</span></NavLink>
//                                    <NavLink className={`${styleForProfileLinks}`} to={`/publish-notice`}><span>Push Notice</span></NavLink>
//                               </div>
//                          </div>
//                     }
//                     {role == "admin" &&
//                          <div className="links-div">
//                               <div className={`${linksDiv}`}>
//                                    <NavLink className={`${styleForProfileLinks}`} to={`/`}><span>admin page 1</span></NavLink>
//                                    <NavLink className={`${styleForProfileLinks}`} to={`/`}><span>admin page 1</span></NavLink>
//                                    <NavLink className={`${styleForProfileLinks}`} to={`/`}><span>admin page 1</span></NavLink>
//                               </div>
//                          </div>
//                     }
//                </div>
//                {/* </div> */}
//                <div className="logOut  flex justify-center">
//                     <div className='flex items-center'>
//                          <button onClick={() => logOutUser()} className={`${styleForLogOut} bg-red-800 text-white font-medium text-lg   hover:bg-gray-300 rounded-sm w-24`}>Logout</button>
//                     </div>
//                </div>

//           </div >
//      );
// }

export default ProfileModal;