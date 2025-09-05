import React, { useEffect, useState, createContext } from 'react';
import axios from 'axios';

export const ProfileContext = createContext({});
export const ProfileDataProvider = ({ children }) => {
     const [profileData, setProfileData] = useState(null);
     const [profileDataLoading, setProfileDataIsLoading] = useState(true);
     const localStorageData = JSON.parse(localStorage.getItem("UserInfo")) || {};

     useEffect(() => {
          const controller = new AbortController();
          const signal = controller.signal;
          console.log("useEffect run at profile provider");
          const fetchData = async () => {
               try {
                    console.log("Fetching profile data...");
                    // const response = {}
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/getProfileAllDetails`, {
                         withCredentials: true,
                    });
                    console.log("response from profileDataProvider", response.data.user);
                    if (response.status === 200) {
                         setProfileDataIsLoading(false);
                         setProfileData(response.data.user);
                         // alert("Profile data fetched successfully by profileDataProvider ");
                         console.log("Profile data fetched successfully");

                    } else if (response.status === 404) {
                         console.log("User details not found");

                    }
               } catch (error) {
                    console.error("Error fetching profile data:", error);
               }
          };

          fetchData();
          console.log(profileData);
          return () => controller.abort();
     }, []);

     return (
          <ProfileContext.Provider value={{ profileData, profileDataLoading }}>
               {children}
          </ProfileContext.Provider>
     );
};
