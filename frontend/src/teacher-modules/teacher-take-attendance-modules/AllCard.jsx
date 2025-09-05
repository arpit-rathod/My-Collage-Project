import { ProfileContext } from '../..//All-Provider/profileDataProvider';
import React, { useState, useEffect, lazy, Suspense, useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaPlayCircle, FaCheckCircle, FaClock } from 'react-icons/fa';

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
                    {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-2 flex justify-center"> */}
                    {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"> */}
                    {/* <div className='flex flex-wrap justify-center     '> */}
                    {/*h1 place in center and justify-center*/}
                    {/* <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-[#811d1d]'>
                              My Lectures
                         </h1> */}
                    {/* <p className='text-sm sm:text-base text-slate-600 mt-1'>
                                        Manage your classes and attendance
                                   </p> */}
                    {/* <button className='self-start sm:self-auto bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2'>
                                   <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                   </svg>
                                   <span className='text-sm sm:text-base'>Create Lecture</span>
                                   </button> */}
                    {/* </div> */}
                    {/* </div> */}
                    {/* </div> */}


                    {/* Cards Container - Fully Responsive */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${isRunning
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
                              {item?.department.toUpperCase()}
                         </h3>
                         <p className="text-sm  text-[#811d1d]">
                              {item?.year.toUpperCase()} • {item?.branch.toUpperCase()}
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
// import { ProfileContext } from '../..//All-Provider/profileDataProvider';
// import React, { useState, useEffect, lazy, Suspense, useContext } from 'react'
// import { Link, NavLink } from 'react-router-dom'
// import axios from 'axios';
// import Cookies from 'js-cookie';

// export default function AllCard(props) {
//      const [lectures, setLectures] = useState(null);
//      const [lecturesLoading, setLecturesLoading] = useState(false);
//      const { profileData, profileDataLoading } = useContext(ProfileContext);
//      const username = "teach123";
//      console.log(username);
//      const token = Cookies.get('token')
//      useEffect(() => {
//           console.log("run useEffect");
//           // if (!profileData || profileDataLoading) return;
//           try {
//                async function fetchData() {
//                     console.log("get lectures detail for tefetchingacher api  ");
//                     console.log(import.meta.env.VITE_API_URL);

//                     const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-lectures-of-teacher`,
//                          {
//                               withCredentials: true
//                          });
//                     console.log(response.data);
//                     if (response.status == 200) {
//                          setLectures(response.data.lecturesData);
//                          setLecturesLoading(false);
//                     } else if (response.status == 400) {
//                          console.log(response.data.message);
//                          toast.error("Bad Request");
//                     } else if (response.status == 500) {
//                          console.log(response.data.message);
//                          toast.error("Server Error");
//                     }
//                }
//                fetchData();
//           } catch (error) {
//                console.log(error);
//           }
//      }, [])

//      if (lecturesLoading || !lectures) return <h1 className='text-2xl font-bold'>Loading...</h1>
//      return (
//           <div className='rounded-2xl p-[2px] m-1 md:m-4'>
//                <div className="createlectureCard flex justify-between px-5 m-2">
//                     <h5 className='font-bold text-3xl'>Cards</h5>
//                     <h2 className='p-1.5 bg-blue-200 rounded-2xl cursor-pointer'>Create +</h2>
//                </div>
//                <div className="card-Container flex">
//                     <div className="all-cards flex md:flex-wrap md:justify-center sm:overflow-x-auto w-full scrollbar-hide">
//                          {lectures.map((item, index) => (
//                               // var objectId = item._id;
//                               item.subjectsData.map((item2, index) => (
//                                    <NavLink to={`/user-lectures/get-lecture-info/${item._id}/${item2.index}`}
//                                         state={{ item, item2 }}
//                                         key={item2.id}>
//                                         <LectureCard key={item2.id} item2={item2} item={item} ></LectureCard>
//                                    </NavLink>

//                               ))
//                          )
//                          )}
//                     </div>
//                </div>
//           </div>


//      )
// }

// function LectureCard({ item, item2 }) {
//      console.log(item2.id);
//      console.log(item2.status);
//      // async function fetchRecord() {
//      //      const record = await axios.get('')
//      // }
//      // if(item2.status == "running"){
//      //      fetchRecord();
//      // }
//      return (
//           <div className="singalCard min-w-40 md:min-w-52 min-h-40 m-1 md:m-3 p-5 w-3xs  bg-blue-400 rounded-2xl hover:scale-105 hover:-translate-y-2 duration-100 overflow-visible shadow-md shadow-gray-500">
//                <div className="details cursor-pointer" >
//                     <p className='whitespace-nowrap sm:text-2xl font-medium md:text-2xl'>{item?.department}</p>
//                     <p className='whitespace-nowrap sm:text-2xl font-medium md:text-2xl'>{item?.year}</p>
//                     <p className='whitespace-nowrap sm:text-2xl font-medium md:text-2xl'>{item?.branch}</p>
//                     <p className='whitespace-nowrap sm:text-2xl font-medium md:text-2xl'>{item2?.subName}</p>
//                     <p className='whitespace-nowrap sm:text-2xl font-medium md:text-2xl'>{item2?.subCode}</p>
//                     <p className='whitespace-nowrap sm:text-2xl font-medium md:text-2xl'>{item2?.status}</p>
//                     {item2.status == "running" ?
//                          <p className='whitespace-nowrap sm:text-2xl font-medium md:text-2xl rounded-2xl bg-amber-800 p-2 m-2 hover:bg-amber-600 cursor-pointer'>See Attendance</p>
//                          : <div className='p-0 m-0 flex justify-end'>
//                               <button type="submit" className='rounded-2xl bg-amber-800 p-2 m-2 hover:bg-amber-600 cursor-pointer'>Get Record</button>
//                          </div>
//                     }
//                </div>
//           </div>
//      )
// }