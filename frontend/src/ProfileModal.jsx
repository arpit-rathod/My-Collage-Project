import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ProfileContext } from './All-Provider/profileDataProvider';
// import { h1 } from 'motion/react-client';

function ProfileModal({ localStorageData, profileImage }) {
  const { profileData, profileDataLoading } = useContext(ProfileContext);
  const [profileData2, setProfileData2] = useState(null);
  useEffect(() => {
    // console.log("useEffect run");
    if (profileDataLoading || !profileData) return;
    setProfileData2(profileData);
  }, [profileData, profileDataLoading]);

  function logOutUser() {
    console.log("logOutUser run");
    localStorage.removeItem('UserInfo');
    window.location.reload();
  }

  if (profileDataLoading || !profileData2) return (<h1 className='text-2xl font-bold grid place-items-center'>Loading...</h1>)

  const styleForProfileLinks = `hover:bg-gray-200 px-5 hover:border-b-[2px] hover:border-bg-gray-500 border-b-[1px] border-gray-300 mx-3 cursor-pointer rounded-sm m-2 p-2 hover:shadow-md hover:translate-x-2 hover:scale-105`;

  const styleForLogOut = `hover:border-b-[2px] hover:border-bg-gray-500 border-[1px] border-gray-300 cursor-pointer hover:shadow-md  hover:scale-110 text-lg text-red-700 font-medium hover:bg-gray-300 rounded-sm w-24`
  return (
    <div className="profile-module p-3 md:p-5 fixed right-5 top-24 z-200 min-w-[250px] h-auto min-h-[80vh] bg-white   border-[1px] border-gray-300 rounded shadow font-mono grid ">
      <div className='flex-nowrap align-middle m-3 p-3'>
        <div className="profileModDiv md:flex">
          <div div className="imgDiv flex justify-center p-2" >
            <img className="w-25 rounded-[50%] h-25" src={profileImage} alt="" />
          </div >
          <div className="details p-2 md:p-5 flex justify-center">
            <div className="">
              <p className="name text-[18px] font-medium p-0">{profileData2?.name}</p>
              {/* {profileData.name && (
              <p className="name text-[10px] font-medium p-0">{profileData.name}</p>
              )} */}
              <p className="text-[12px] text-black font-medium p-0">{profileData2?.branch}</p>
              <p className="enrollmentNo text-[12px] font-medium p-0">{profileData2?.username}</p>
            </div>
          </div>
        </div >
        {/* <div className="links-div"> */}
        {profileData2.role == "student" &&
          <div className="links-div">
            <div className="flex flex-col justify-start font-semibold">
              <NavLink className={`${styleForProfileLinks}`} to={`${import.meta.env.VITE_FRONTEND_URL}/result`}><span>Result</span></NavLink>
              <NavLink className={`${styleForProfileLinks}`} to={`${import.meta.env.VITE_FRONTEND_URL}/record`}><span>Record</span></NavLink>
              <NavLink className={`${styleForProfileLinks}`} to={`${import.meta.env.VITE_FRONTEND_URL}/submitAttendance`}><span>Submit Present</span></NavLink>
            </div>
          </div>
        }
        {profileData2.role == "teacher" &&
          <div className="links-div">
            <div className="flex flex-col justify-start font-semibold">
              <NavLink className={`${styleForProfileLinks}`} to={`${import.meta.env.VITE_FRONTEND_URL}/record`}><span>My Lectures</span></NavLink>
              <NavLink className={`${styleForProfileLinks}`} to={`${import.meta.env.VITE_FRONTEND_URL}/CollectAttendance`}><span>Take Attendance</span></NavLink>
              <NavLink className={`${styleForProfileLinks}`} to={`${import.meta.env.VITE_FRONTEND_URL}/submitAttendance`}><span>Push Notice</span></NavLink>
            </div>
          </div>
        }
      </div>
      {/* </div> */}
      <div className="logOut  flex justify-center align-text-bottom">
        <div className='flex-nowrap place-content-end'>
          <button onClick={() => logOutUser()} className={`${styleForLogOut}`} lassName="text-lg text-red-700 font-medium hover:bg-gray-300 rounded-sm w-24
          ">Logout</button>
        </div>
      </div>

    </div >
  );
}

export default ProfileModal;