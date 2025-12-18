import React, { useEffect, useState, createContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const ProfileContext = createContext({});

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(null);
  const [profileDataLoading, setProfileDataIsLoading] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    // const signal = controller.signal;
    const fetchProfileData = async () => {
      try {
        setProfileDataIsLoading(true);
        // console.log("Fetching profile data...");
        // const response = {}
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/getProfileAllDetails`, {
          withCredentials: true,
        });
        console.log("response from profileDataProvider", response.data.user);
        if (response.status === 200) {
          setProfileDataIsLoading(false);
          setProfileData(response.data.user);
          // console.log("Profile data fetched successfully");
        } else if (response.status === 404) {
          console.log("User details not found with 400");
          // toast.error('error in fetching profile details with 400');
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        // toast.error('error in fetching profile details');
      } finally {
        console.log(profileData);

      }
    };
    fetchProfileData();

    // console.log(profileData);
    return () => controller.abort();
  }, []);

  return (
    <ProfileContext.Provider value={{ profileData, profileDataLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};
