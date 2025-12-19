import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import toast from 'react-hot-toast';
import logOutUser from './APICaliingFunctions/logOutApi.js'
import { ProfileContext } from './All-Provider/profileDataProvider';
import { firstLetterUpperCase } from './commonFunctions/getUpperCase.js'


// import { ProfileContext } from './All-Provider/profileDataProvider';
// const { profileData, profileDataLoading } = useContext(ProfileContext);

function ProfileModal({ profileImage, getNavbarHeight, setprofileModule, profileModule }) {
  const [navHeight1, setNavHeight] = useState(null);
  const [role, setRole] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const { profileData, profileDataLoading } = useContext(ProfileContext);
  const { profile, setProfile } = useContext(ProfileContext);

  // Get navbar height after render
  useEffect(() => {
    const height = Math.round(getNavbarHeight());
    setNavHeight(height);
    console.log("Navbar height:", height);
  }, [getNavbarHeight]);

  useEffect(() => {
    console.log(profileData);

    setRole(profileData?.role);
  }, [profileData])
  // Fetch profile once
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${import.meta.env.VITE_API_URL}/getProfileAllDetails`,
  //         { withCredentials: true }
  //       );
  //       if (response.status === 200) {
  //         setRole(response.data?.userProfile?.role);
  //         setProfileLoading(false);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user profile:", error);
  //       toast.error(error.data.message || error.data.error || "status code 505 , internal server error.");
  //       setProfileLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // Custom NavLink component with better styling
  const SidebarNavLink = ({ to, children, icon }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 md:space-x-0 p-1 md:p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-red-700/50 hover:translate-x-1 group ${isActive ? 'bg-red-700/70 border-l-4 border-white' : ''
        }`
      }
      onClick={() => setprofileModule(false)}
    >
      {icon && <span className="text-xs sm:text-xs px-2">{icon}</span>}
      <span className="font-medium text-smw">{children}</span>
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
        className={`fixed top-0 right-0 z-50 w-80 h-full overflow-y-scroll bg-gradient-to-b from-black-800 to-black-900 text-white shadow-2xl transform transition-all duration-500 ease-out ${profileModule
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
          }`}
        style={{ paddingTop: navHeight1 ? `${navHeight1}px` : '4rem' }}
      >
        {/* Close button */}
        {/* style={{ top: navHeight1 ? `${navHeight1 + 16}px` : '5rem' }} */}
        <button
          onClick={() => setprofileModule(false)}
          className="absolute top-2 right-5 rounded-xl border-[1px] border-transparent hover:bg-red-700/30"

        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="pt-0 p-4 -mt-5 flex flex-col h-full">
          {/* Profile Section with loading state */}
          <div className="mb-5">
            {profileDataLoading ? (
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
                  <h3 className="text-xl font-semibold text-white mb-1">{profileData?.name}</h3>
                  <p className="text-red-200 text-sm mb-1">{profileData?.branch ? firstLetterUpperCase(profileData?.branch) : null}</p>
                  <p className="text-red-300 text-sm font-mono">@{profileData?.username}</p>
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
            <h4 className="text-sm lg:text-xs font-semibold text-red-200 uppercase tracking-wide mb-4">
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
                  <SidebarNavLink to="/add-subject-to-branch-year" icon="📘">
                    Add Subject to Branch/Year Document
                  </SidebarNavLink>
                </>
              )}
              {role === "admin" && (
                <>

                  <SidebarNavLink to="/admin-dashboard" icon="📊">
                    Admin Dashboard
                  </SidebarNavLink>
                  <SidebarNavLink to="/admin/manage_students" icon="➕">
                    Register Student
                  </SidebarNavLink>
                  <SidebarNavLink to="/admin/register/new-teacher" icon="➕">
                    Register Teacher
                  </SidebarNavLink>

                  <SidebarNavLink to="/student-search-page" icon="🔍">
                    See Students/Update
                  </SidebarNavLink>

                  <SidebarNavLink to="/add-branch-year-doc" icon="📂">
                    Add Branch/Year Document
                  </SidebarNavLink>

                  <SidebarNavLink to="/add-subject-to-branch-year" icon="📘">
                    Add Subject to Branch/Year Document
                  </SidebarNavLink>

                  {/* <SidebarNavLink to="/user-management" icon="👥">
                                                  User Management
                                             </SidebarNavLink> */}

                  {/* <SidebarNavLink to="/system-settings" icon="⚙️">
                                                  System Settings
                                             </SidebarNavLink> */}

                </>
              )}
            </nav>
          </div>

          {/* Footer Actions */}
          <div className="mt-auto pt-6 border-t border-red-200">
            <div className="space-y-3 flex items-center justify-center">
              <button
                onClick={logOutUser}
                className="flex items-center justify-center space-x-2 px-10 p-1 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
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

export default ProfileModal;