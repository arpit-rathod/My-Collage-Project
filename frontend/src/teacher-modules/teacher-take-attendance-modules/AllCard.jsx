import { ProfileContext } from '../..//All-Provider/profileDataProvider';
import React, { useState, useEffect, lazy, Suspense, useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaPlayCircle, FaCheckCircle, FaClock } from 'react-icons/fa';
import { firstLetterUpperCase } from '../../commonFunctions/getUpperCase';
export default function AllCard(props) {
     const [lectures, setLectures] = useState(null);
     const [lecturesLoading, setLecturesLoading] = useState(false);
     const { profileData, profileDataLoading } = useContext(ProfileContext);
     const username = "teach123";
     console.log(username);
     const token = Cookies.get('token')

     useEffect(() => {
          console.log("run useEffect");
          try {
               async function fetchData() {
                    console.log("get lectures detail for teacher api");
                    console.log(import.meta.env.VITE_API_URL);

                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-lectures-of-teacher`, {
                         withCredentials: true
                    });
                    console.log(response.data);
                    if (response.status == 200) {
                         setLectures(response.data.lecturesData);
                         setLecturesLoading(false);
                    } else if (response.status == 400) {
                         console.log(response.data.message);
                         toast.error("Bad Request");
                    } else if (response.status == 500) {
                         console.log(response.data.message);
                         toast.error("Server Error");
                    }
               }
               fetchData();
          } catch (error) {
               console.log(error);
          }
     }, [])

     if (lecturesLoading || !lectures) {
          return (
               <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
                    <div className='text-center'>
                         <div className='animate-spin rounded-full h-16 w-16 border-4 border-maroon-500 border-t-transparent mx-auto mb-4'></div>
                         <h1 className='text-2xl font-bold text-maroon-800'>Loading...</h1>
                    </div>
               </div>
          );
     }

     return (
          <div className='min-h-screen'>
               {/* Header Section - Responsive */}
               <div className="sticky top-0 z-10  backdrop-blur-md">
                    {/* Cards Container - Fully Responsive */}
                    <div className="max-w-7xl mx-auto px-2 md:px-6 py-2 md:py-8">
                         {lectures.length === 0 ? (
                              <div className='text-center py-16'>
                                   <div className='bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6'>
                                        <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                   </div>
                                   <h3 className='text-xl font-semibold text-slate-700 mb-2'>No Lectures Found</h3>
                                   <p className='text-slate-500'>Create your first lecture to get started</p>
                              </div>
                         ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                   {lectures.map((item, index) => (
                                        item.subjectsData.map((item2, subIndex) => (
                                             <NavLink
                                                  key={`${item._id}-${item2.index}`}
                                                  to={`/user-lectures/get-lecture-info/${item._id}/${item2.index}`}
                                                  state={{ item, item2 }}
                                                  className="group"
                                             >
                                                  <LectureCard item2={item2} item={item} />
                                             </NavLink>
                                        ))
                                   ))}
                              </div>
                         )}
                    </div>
               </div>
          </div>
     )
}

function LectureCard({ item, item2 }) {
     console.log(item2.id);
     console.log(item2.status);

     const isRunning = item2.status === "running";

     return (
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-200 group-hover:border-maroon-200 transform group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-300 overflow-hidden">
               {/* Status Badge */}
               <div className="relative p-4 sm:p-6">
                    <div className={`absolute top-2 right-4 px-3 py-1 rounded-full text-xs font-medium ${isRunning
                         ? 'bg-green-100 text-green-800 border border-green-200'
                         : 'bg-slate-100 text-slate-600 border border-slate-200'
                         }`}>

                         {item2.status === "running"
                              ? <><FaPlayCircle style={{ color: "green" }} /> Live</>
                              : item2.status === "complete"
                                   ? <><FaCheckCircle style={{ color: "gray" }} /> Ended</>
                                   : <><FaClock style={{ color: "orange" }} /> Pending</>}
                         {/* {item2.status == "running" ? '🟢 Live' : item2.status == "complete" ? '⏸️ Ended' : 'Pending'} */}
                    </div>

                    {/* Department & Year */}
                    <div className="mb-4">
                         <h3 className="text-lg sm:text-xl font-bold mb-1 truncate text-[#800000]">
                              {firstLetterUpperCase(item?.department)}
                         </h3>
                         <p className="text-sm  text-[#811d1d]">
                              {firstLetterUpperCase(item?.year)} • {(item?.branch)}
                         </p>
                    </div>

                    {/* Subject Info */}
                    <div className="space-y-2 mb-6">
                         <div className="bg-gradient-to-r from-maroon-50 to-rose-50 rounded-lg p-3 border border-maroon-100">
                              <h4 className="font-semibold text-[#811d1d] text-sm sm:text-base truncate">
                                   {item2?.subName}
                              </h4>
                              <p className="text-xs sm:text-sm text-[#811d1d] font-medium">
                                   Code: {item2?.subCode}
                              </p>
                         </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end">
                         {isRunning ? (
                              <div className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                   </svg>
                                   View Live
                              </div>
                         ) : (
                              <button className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                   </svg>
                                   Get Records
                              </button>
                         )}
                    </div>
               </div>

               {/* Hover Effect Border */}
               <div className="h-1 bg-gradient-to-r from-maroon-500 via-rose-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
     )
}