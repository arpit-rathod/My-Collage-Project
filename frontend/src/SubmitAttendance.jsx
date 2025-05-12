import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react'
import { ProfileContext } from './All-Provider/profileDataProvider';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { Outlet } from 'react-router-dom';

export default function SubmitAttendance() {

     const { profileData, profileDataIsLoading } = useContext(ProfileContext);
     const [showModal, setShowModal] = useState(false);
     const [lecturesData, setLecturesData] = useState(null);
     const [lecturesDataLoading, setLecturesDataIsLoading] = useState(false);
     const [subjectsData, setSubjectsData] = useState(null);
     const [selectedLecture, setSelectedLecture] = useState(null);
     const [todayRecordOfStudent, setTodayRecordOfStudent] = useState(null);
     console.log(profileData);
     useEffect(() => {
          if (!profileData || profileDataIsLoading) return;
          setLecturesDataIsLoading(true);
          const bodyData = {
               year: profileData.year,
               branch: profileData.branch,
               username: profileData.username
          }
          const token = Cookies.get('token')
          console.log(bodyData);
          async function fetchLecturesInfo() {
               try {
                    if (!profileData) return;
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/getLecturesStatus`, {
                         headers: {
                              authorization: `Bearer ${token}`
                         },
                         params: bodyData,
                    });
                    if (response.data) {
                         console.log("lectures information fetched");
                         console.log(response.data);
                         // console.log(response.data.lecturesData._id);
                         setLecturesData(response.data?.lecturesData)
                         setSubjectsData(response.data.lecturesData?.subjectsData)
                         setTodayRecordOfStudent(response.data?.attendance)
                         console.log(response.data?.attendance);

                    } else {
                         console.log("error during fetching lecture information");
                    }
               } catch (error) {
                    console.log(error);
                    return;
               } finally {
                    setLecturesDataIsLoading(false);
               }
          }
          fetchLecturesInfo();
     }, [profileData]);

     // console.log(lecturesData);
     // console.log(subjectsData);

     const handleOpenModal = (lecture) => {
          // console.log(profileData);
          setSelectedLecture(lecture);
          setShowModal(true);
     };

     const handleCloseModal = () => {
          setShowModal(false);
     };
     if (!lecturesData || !subjectsData) return <h3 className='h-full max-h-screen grid place-items-center text-2xl font-bold'>Loading</h3>
     return (
          // px-4 sm:px-0 md:px-6 lg:px-10
          < div className='min-h-screen p-0 md:p-5 lg:p-10 flex justify-center bg-white font-mono' >
               {lecturesData &&
                    <div className="bg-gray-100 rounded-2xl">
                         {/* h-fit w-full max-w-8xl my-8 md:m-20 */}
                         <div className="heading grid place-items-center border-b-2">
                              <h1 className='text-xl sm:text-2xl md:text-3xl px-4 md:px-10 py-3 md:py-5 font-medium text-cyan-950'>
                                   Submit Attendance
                              </h1>
                         </div>
                         <div className=''>
                              <div className="LectureContainer">
                                   <div className='mx-4 sm:mx-8 md:mx-16 lg:mx-40 rounded-br-2xl p-2 md:p-4 m-2 rounded-tl-2xl'>
                                        <div className='flex flex-wrap justify-center text-base sm:text-xl md:text-2xl'>
                                             <p className='mx-1 sm:mx-3 md:mx-5 lg:mx-10'>{lecturesData.department}</p>
                                             <span></span>
                                             <p>{lecturesData.year}</p>
                                             <span> / </span>
                                             <p>{lecturesData.branch}</p>
                                        </div>
                                   </div>
                                   <div className='flex justify-start text-lg sm:text-xl md:text-2xl px-4 sm:px-6 md:px-10'>
                                        <h2>Your All Lecture</h2>
                                   </div>
                                   <div className='flex justify-center'>
                                        <div className='flex flex-wrap justify-center scrollbar-hide p-2 md:p-5 w-full'>
                                             {subjectsData?.map((item) => (
                                                  <LectureCard
                                                       key={item.id}
                                                       item={item}
                                                       todayRecordOfStudent={todayRecordOfStudent}
                                                       onClick={() => handleOpenModal(item)}
                                                  />
                                             ))}
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               }

               {/* Modal Component */}
               {
                    showModal && selectedLecture && (
                         <SubmitAttendaceModal
                              lecture={selectedLecture}
                              profileData={profileData}
                              mainObject={lecturesData}
                              onClose={handleCloseModal}
                              setTodayRecordOfStudent={setTodayRecordOfStudent}
                         />
                    )
               }

          </ div>

     )
}
// item hold subjects info

function LectureCard({ item, onClick, todayRecordOfStudent }) {
     const status = item.status;
     console.log(todayRecordOfStudent);
     let isPresent = false;

     if (todayRecordOfStudent) {
          const result = todayRecordOfStudent[item.subCode]
          isPresent = result;
     }
     console.log(isPresent);
     // ?.find((obj) => obj.hasOwnProperty(item.subCode));

     // ? result[subCode] : false;
     // const isPresent = false;

     const statusStyle = status === "done" ? `border-green-500` : status === "running" ? `border-yellow-500` : `border-red-500`
     return (
          <div className={`singalCard md:min-w-52 min-h-40 w-full min-w-52 md:w-64 my-2 md:my-3 mx-1 md:mx-2 p-3 md:p-5 border-t-4 border-[1.5px] ${statusStyle} shadow-md shadow-gray-700 rounded-2xl flex flex-col hover:-translate-y-2 hover:scale-105 duration-200 transform-gpu will-change-transform`}>
               <div className="details flex flex-col cursor-pointer text-sm md:text-[15px] font-medium flex-grow">
                    <div className="min-w-40 p-0 m-0">
                         <p className="hover:bg-indigo-400 rounded-2xl px-1 break-words">
                              {item.subName}
                         </p>
                         <span className="whitespace-nowrap p-1 rounded-2xl">({item.subCode})</span>
                         <p className="text-xs md:text-[14px]">{item.teacher}</p>
                    </div>
               </div>
               <div className='flex md:flex-nowrap justify-evenly'>
                    <p className={`status text-center rounded-4xl border-[1.5px] ${statusStyle}`}>{item?.status}</p>

                    {
                         item?.status == "complete" ? (isPresent ? (<div>✅ Present</div>) : (<div>❌ Absent</div>)) : null
                    }

                    {
                         item?.status == "running" ? (isPresent ? (
                              <div>✅ Present</div>) : (<button
                                   type="button"
                                   onClick={onClick}
                                   className="text-[10px] sm:text-xs rounded-2xl hover:bg-amber-200 p-1 sm:p-2 m-1 sm:m-2 bg-cyan-300 cursor-pointer mt-auto"
                              >
                                   Mark as Present
                              </button>)
                         ) : null
                    }
               </div>
          </div>
     )
}
// lecture stored class details
// profileData of student
//mainObject stored lecture data
function SubmitAttendaceModal({ lecture, profileData, onClose, mainObject, setTodayRecordOfStudent }) {
     const [attendanceCode, setAttendanceCode] = useState('');
     // const { lecture, profileData } = selectedLecture;
     const token = Cookies.get('token')
     console.log("token from cookie for submit attendace api ", token);

     console.log(profileData);
     const handleSubmit = async (e) => {
          e.preventDefault();
          console.log(attendanceCode);
          const bodyData = {
               PIN: attendanceCode,
               username: profileData.username,
               department: profileData.department,
               year: profileData.year,
               branch: profileData.branch,
               classId: lecture.classId,
               subCode: lecture.subCode,
               yearBranchObjectId: mainObject._id,
               studentName: profileData.name,
          }
          // Here you would handle the attendance submission logic
          // For example, validate the code and update the attendance status
          console.log("Submitting attendance for", lecture.subName, "with code", attendanceCode);
          console.log(bodyData);

          const response = await axios.put(`${import.meta.env.VITE_API_URL}/submit-attendance`, bodyData, {
               withCredentials: true,
               headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
               },
          });
          if (response.data) {
               console.log(response.data);
               setTodayRecordOfStudent(response.data.dayRecord.attendance)
               toast.success("Successfully marked as present your attendance")
               onClose();
          } else {
               // alert("error during submitting attendance", response.data.message)
               toast.error("error during submitting attendance")
               console.log("error during submitting attendance");
          }
          // Close the modal after submission
     };

     return (
          <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                    <div className="flex justify-between items-center mb-4">
                         <h2 className="text-xl font-bold text-gray-800">Mark Attendance</h2>
                         <button
                              onClick={onClose}
                              className="text-gray-500 hover:text-gray-700"
                         >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                         </button>
                    </div>

                    <div className="mb-4">
                         <h3 className="text-lg font-semibold text-indigo-600">{lecture.subName}</h3>
                         {/* <p className="text-gray-600">Code: {lecture.code}</p> */}
                         <p className="text-gray-600">Teacher: {lecture.teacher}</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                         <div className="mb-4">
                              <label htmlFor="attendanceCode" className="block text-sm font-medium text-gray-700 mb-1">
                                   Enter Attendance Code
                              </label>
                              <input
                                   type="number"
                                   id="attendanceCode"
                                   value={attendanceCode}
                                   onChange={(e) => setAttendanceCode(e.target.value)}
                                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                   placeholder="Enter the code provided by your teacher"
                                   required
                              />
                         </div>

                         <div className="flex justify-end space-x-2">
                              <button
                                   type="button"
                                   onClick={onClose}
                                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                              >
                                   Cancel
                              </button>
                              <button
                                   type="submit"
                                   className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                              >
                                   Submit Attendance
                              </button>
                         </div>
                    </form>
               </div>
          </div>
     );
}