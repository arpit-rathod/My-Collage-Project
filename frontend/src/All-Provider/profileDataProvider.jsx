import React, { useEffect, useState, createContext } from 'react';
import axios from 'axios';

export const ProfileContext = createContext({});

export const ProfileDataProvider = ({ children }) => {
     const [profileData, setProfileData] = useState(null);
     const [profileDataLoading, setProfileDataIsLoading] = useState(true);
     const localStorageData = JSON.parse(localStorage.getItem("UserInfo")) || {};

     useEffect(() => {
          if (!localStorageData.username || !localStorageData.token) {
               console.log("No user data found in localStorage.");
               return;
          } else {
               console.log("local storage has data and fetching profile details");
          }

          const controller = new AbortController();
          const signal = controller.signal;
          console.log("useEffect run at profile provider");

          const fetchData = async () => {
               try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/getProfileAllDetails`, {
                         params: {
                              username: localStorageData.username,
                              token: localStorageData.token,
                         },
                         signal,
                    });

                    if (response.data) {
                         console.log("Fetched Profile Data:" + response.data.user);
                         setProfileData(response.data.user);
                         setProfileDataIsLoading(false);
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
