import { ProfileContext } from './All-Provider/profileDataProvider';
import React, { useState, useEffect, lazy, Suspense, useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie';
export default function AllCard(props) {

     const [lectures, setLectures] = useState(null);
     const [lecturesLoading, setLecturesLoading] = useState(false);
     const { profileData, profileDataLoading } = useContext(ProfileContext);
     const username = "teach123";
     console.log(username);
     const token = Cookies.get('token')
     useEffect(() => {
          console.log("run useEffect");
          if (!profileData || profileDataLoading) return;
          try {
               async function fetchData() {
                    console.log("get lectures detail for teacher api fetching ");
                    console.log(import.meta.env.VITE_API_URL);

                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-lectures-of-teacher`, { headers: { authorization: `Bearer ${token}`, }, params: { username: username } });

                    console.log(response.data.lecturesData);
                    setLectures(response.data.lecturesData);
               }
               fetchData();
          } catch (error) {
               console.log(error);
          } finally {
               console.log("lectures fetched successfully");
          }
     }, [profileData, profileDataLoading])

     if (lecturesLoading || !lectures) return <h1 className='text-2xl font-bold'>Loading...</h1>
     return (
          <div className='rounded-2xl p-[2px] m-1 md:m-4'>
               <div className="createlectureCard flex justify-between px-5 m-2">
                    <h5 className='font-bold text-3xl'>Cards</h5>
                    <h2 className='p-1.5 bg-blue-200 rounded-2xl cursor-pointer'>Create +</h2>
               </div>
               <div className="card-Container flex">
                    <div className="all-cards flex md:flex-wrap md:justify-center sm:overflow-x-auto w-full scrollbar-hide">
                         {lectures.map((item, index) => (
                              item.subjectsData.map((item2, index) => (
                                   <NavLink to="attendance-page"
                                        state={{ item, item2 }}
                                        key={item2.id}  >
                                        <LectureCard key={item2.id} item2={item2} item={item} ></LectureCard>
                                   </NavLink>

                              ))
                         )
                         )}
                    </div>
               </div>
          </div>


     )
}

function LectureCard({ item, item2 }) {
     console.log(item2.id);
     console.log(item2.status);
     // async function fetchRecord() {
     //      const record = await axios.get('')

     // }

     // if(item2.status == "running"){
     //      fetchRecord();
     // } 
     return (
          <div className="singalCard min-w-40 md:min-w-52 min-h-40 m-1 md:m-3 p-5 w-3xs  bg-blue-400 rounded-2xl hover:scale-105 hover:-translate-y-2 duration-100 overflow-visible shadow-md shadow-gray-500">
               <div className="details cursor-pointer" >
                    <p className='whitespace-nowrap sm:text-2xl font-medium md:text-2xl'>{item?.department}</p>
                    <p className='whitespace-nowrap sm:text-2xl font-medium md:text-2xl'>{item?.year}</p>
                    <p className='whitespace-nowrap sm:text-2xl font-medium md:text-2xl'>{item?.branch}</p>
                    <p className='whitespace-nowrap sm:text-2xl font-medium md:text-2xl'>{item2?.subName}</p>
                    <p className='whitespace-nowrap sm:text-2xl font-medium md:text-2xl'>{item2?.subCode}</p>
                    <p className='whitespace-nowrap sm:text-2xl font-medium md:text-2xl'>{item2?.status}</p>
                    {item2.status == "running" ?
                         <p className='whitespace-nowrap sm:text-2xl font-medium md:text-2xl rounded-2xl bg-amber-800 p-2 m-2 hover:bg-amber-600 cursor-pointer'>See Attendance</p>
                         : <div className='p-0 m-0 flex justify-end'>
                              <button type="submit" className='rounded-2xl bg-amber-800 p-2 m-2 hover:bg-amber-600 cursor-pointer'>Get Record</button>
                         </div>
                    }
               </div>
          </div>
     )
}