//take attendance page for teachers 

import React, { useState, useEffect, useContext, lazy } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { NavLink, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast'
import { param } from 'motion/react-client';
import FullPageSpinner from "/frontend/src/animation-components/spinner.jsx"
// import io from 'socket.io-client'
// const socket = io(import.meta.env.VITE_API_URL, {
//      auth: { authToken: Cookies.get('auth_token') }
// })
import { SocketContext } from '../../All-Provider/socketConnectionPro'


export default function AttendancePage() {
     const socket = useContext(SocketContext);
     const objectId = useParams("id").id; // get lecture id from url
     const index = useParams("index").index; // get lecture id from url

     const [lectureInfo, setLectureInfo] = useState(undefined);// to check if lecture response is fetched or not
     const [isLectureActive, setIsLectureActive] = useState(false);
     const [isLectureCompleted, setIsLectureCompleted] = useState(false);
     const [attendancesDocument, setAttendancesDocument] = useState(null);// store document
     const [attendanceList, setAttendanceList] = useState([]); // students list that all present
     const [pin, setPin] = useState(""); // pin that saved in server

     const [rollNumber, setRollNumber] = useState(""); // to store manually added student rollnumber;
     const [detailsFetched, setDetailsFetched] = useState(false);
     const [presentCurrent, setPresentCurrent] = useState(0); // to store next student roll number;
     const presentPrevious = 60;// highest number of student present in previous class 
     // implimantation of socket io for tracking attendaces
     useEffect(() => {
          console.log("socket oi run for attendance");
          const handler = (StudInfo) => {
               console.log("Received:", StudInfo);
               console.log("old", attendanceList);
               setAttendanceList((prev) => [...prev, StudInfo]);
               console.log("updated", attendanceList);
               setPresentCurrent((prev) => prev + 1);
          };
          socket.on("newAttendanceEvent", handler);
          return () => {
               socket.off("newAttendanceEvent", handler); // Proper cleanup
          };
     }, []);
     // Logic to add student
     const handleAddStudent = () => {
          if (rollNumber) {
               setRollNumber('');
               setPresentCurrent(prev => prev + 1);
          }
     }

     useEffect(() => {
          //self called function to fetch lecture info
          const fetchLectureInfo = async () => {
               console.log("objectId", objectId, "index", index);
               try {
                    const lectureinfoResponse = await axios.get(`${import.meta.env.VITE_API_URL}/CollectAttendance/get-lecture-info/`, {
                         params: {
                              objectId: objectId,
                              index: index,
                         },
                         withCredentials: true,

                    });
                    console.log("server response for lecture info = ", lectureinfoResponse);
                    if (lectureinfoResponse?.data?.searchedLectureDocument?.subjectsData?.status == "pending") {
                         // Handle pending status
                         console.log("Lecture is pending:");
                         setIsLectureActive(false);
                    } else if (lectureinfoResponse?.data?.searchedLectureDocument?.subjectsData?.status == "running") {
                         console.log("Lecture is running");
                         setIsLectureActive(true);
                         setPin(lectureinfoResponse?.data?.searchedLectureDocument?.subjectsData?.pin);
                         setAttendancesDocument(lectureinfoResponse?.data?.attendanceDocument);
                         setAttendanceList(lectureinfoResponse?.data?.attendanceDocument?.record);
                    } else if (lectureinfoResponse?.data?.searchedLectureDocument?.status == "completed") {
                         console.log("Lecture is completed:");
                         setIsLectureCompleted(true);
                         setPin(lectureinfoResponse?.data?.searchedLectureDocument?.subjectsData?.pin);
                         setAttendancesDocument(lectureinfoResponse?.data?.attendanceDocument);
                         setAttendanceList(lectureinfoResponse?.data?.attendanceDocument?.record);
                    }
                    console.log("Lecture status checked");
                    setLectureInfo(lectureinfoResponse?.data?.searchedLectureDocument);

               } catch (error) {
                    console.error("Error fetching lecture info:", error);
               }
          };
          fetchLectureInfo()
     }, [objectId, index]);

     const handleSubmitPin = async () => {
          const newPin = document.getElementById("newPin").value;
          console.log(newPin);

          if (newPin < 100000) {
               console.log("length of pin is short");
               alert("length of pin is short");
               return;
          }

          const submitPinResponse = await axios.post(`${import.meta.env.VITE_API_URL}/submit-pin`,
               {
                    objectId: objectId,
                    index: index,
                    pin: newPin,
               },
               { withCredentials: true }
          );
          if (submitPinResponse.status === 200) {
               console.log(submitPinResponse.data.newPin);
               setPin(submitPinResponse.data.newPin);
               setIsLectureActive(true);
               toast.success("Class is activated")
          } else if (submitPinResponse.status === 304) {
               submitPinResponse.data.message ? toast.error(submitPinResponse.data.message) : toast.error("Class already activated");
               toast.error("Class have not activated")
          } else {
               toast.error("Error in activating class")
          }
     }

     const submitRecord = async () => {
          console.log("submit record fun run.");
          try {
               const response = await axios.put(`${import.meta.env.VITE_API_URL}/submit-record`, { objectId, index }, { withCredentials: true })
               if (response) {
                    console.log(response.data);
                    // toast.success("Class Successfully saved", response.data.message)
                    // toast.success(`Class Successfully saved: ${response.data.message}`);
                    isLectureActive(false)
                    isLectureCompleted(true)
                    toast.success("Class Successfully saved", {
                         description: response.data.message
                    });

               }
          } catch (error) {
               console.log("error during submittin record", error);
               toast.error("Error in saving class");
          }
     }
     if (!lectureInfo) {
          return <FullPageSpinner message="Loading product…" />;
     }

     return (//bg-gray-50 from-gray-100 to-gray-200
          <div className='min-h-screen  bg-gradient-to-br '>
               <div className='max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
                    {/* Header */}
                    {/* bg-white */}
                    <div className=' rounded-lg shadow-md p-6 mb-8 border-l-4 border-maroon-700 text-gray-800'>
                         <div className='flex justify-center items-center text-center sm:space-x-2 text-2xl font-bold text-gray-800'>
                              <h1 className="px-2">{lectureInfo?.department || 'Department'}</h1>
                              <span className='px-2'>/</span>
                              <h1 className="px-2">{lectureInfo?.year || 'Year'}</h1>
                              <span className='px-2'>/</span>
                              <h1 className='px-2'>{lectureInfo?.branch || 'Branch'}</h1>
                         </div>
                         <div className='m-3 md:m-5 flex justify-evenly md:text-2xl font-medium'>
                              <h3 className="m-0 md:m-2 px-0 md:px-9">{lectureInfo?.subjectsData?.subName} / {lectureInfo?.subjectsData?.subCode || "bt123"}</h3>
                              {/* <h3 className="m-2 px-3"></h3> */}
                              <h3 className="m-0 md:m-2 px-0 md:px-9">{lectureInfo?.subjectsData?.teacher}</h3>
                         </div>
                    </div>
                    {/* Header */}
                    {/* main container */}
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                         {/* Left Column */}
                         <div className='lg:col-span-1 space-y-6'>
                              {/* PIN Generator*/}
                              <div className=" rounded-lg shadow-md p-6">
                                   <h2 className='text-xl font-semibold text-gray-800 mb-4'>Generate PIN</h2>
                                   {
                                        pin ? (
                                             <h1>Set Pin : {pin}</h1>
                                        ) :
                                             <div className="flex flex-col space-y-4">
                                                  <div className="flex items-center">
                                                       <label htmlFor="newPin" className='text-gray-700 font-medium w-20'>PIN</label>
                                                       <input
                                                            type="number"
                                                            name="pin"
                                                            id="newPin"
                                                            // value={pin}
                                                            // onChange={(e) => setPin(e.target.value)}
                                                            maxLength={6}
                                                            minvalue={100000}
                                                            placeholder='Enter 6 digit PIN'

                                                            className='flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-transparent'
                                                       />
                                                  </div>
                                                  <button
                                                       onClick={handleSubmitPin}
                                                       className='w-full bg-maroon-700 hover:bg-maroon-800 text-black font-bold py-2 px-4 rounded-lg transition duration-200'>
                                                       Generate PIN
                                                  </button>
                                             </div>
                                   }
                              </div>

                              {/* Manual Add Student */}
                              {
                                   isLectureActive &&
                                   <div className="bg-white rounded-lg shadow-md p-6">
                                        <h2 className='text-xl font-semibold text-gray-800 mb-4'>Add Student Manually</h2>
                                        <div className="flex flex-col space-y-4">
                                             <div className="flex items-center">
                                                  <label htmlFor="rollNumber" className='text-gray-700 font-medium w-28'>Roll Number</label>
                                                  <input
                                                       type="number"
                                                       id="rollNumber"
                                                       value={rollNumber}
                                                       onChange={(e) => setRollNumber(e.target.value)}
                                                       className='flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-transparent'
                                                  />
                                             </div>
                                             <button
                                                  onClick={handleAddStudent}
                                                  className='w-full bg-maroon-700 hover:bg-maroon-800 text-black font-bold py-2 px-4 rounded-lg transition duration-200'>
                                                  Add Student
                                             </button>
                                        </div>
                                   </div>
                              }
                         </div>

                         {/* Right Column */}
                         {
                              (isLectureActive || isLectureCompleted) &&

                              <div className='lg:col-span-2'>
                                   <div className="bg-white rounded-lg shadow-md p-6">
                                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                                             <div className='flex items-center mb-4 sm:mb-0'>
                                                  <span className="text-gray-700 font-semibold">Total Students:</span>
                                                  <span className="ml-2 bg-gray-200 px-3 py-1 rounded-full text-gray-800 font-bold">{lectureInfo.totalStudents}</span>
                                             </div>
                                             <div className='flex items-center'>
                                                  <span className="text-gray-700 font-semibold">Present:</span>
                                                  <span className="ml-2 bg-green-100 px-3 py-1 rounded-full text-green-800 font-bold">{presentCurrent}</span>
                                                  <span className="mx-2 text-gray-500">/</span>
                                                  <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-medium">{presentPrevious}</span>
                                             </div>
                                        </div>

                                        <h2 className='text-xl font-semibold text-gray-800 mb-4'>Present Students</h2>

                                        {presentCurrent === 0 ? (
                                             <div className="flex justify-center items-center h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                                  <p className="text-gray-500 text-center">No students marked present yet</p>
                                             </div>
                                        ) : (
                                             <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg min-h-48">
                                                  {attendanceList.map((student, index) => (
                                                       <PresentStudent presentStudent={student} key={index} />
                                                  ))}
                                             </div>
                                        )}
                                   </div>
                              </div>
                         }
                         {isLectureActive &&
                              <div className="submit-attendance">
                                   <button className='w-full bg-maroon-700 hover:bg-maroon-800 text-black font-bold py-2 px-4 rounded-lg transition duration-200' type="submit" onClick={() => submitRecord()}>Submit Record</button>
                              </div>
                         }
                    </div>
               </div>
          </div>
     )
}

function PresentStudent({ presentStudent }) {
     const [showDetails, setShowDetails] = useState(false);
     console.log(presentStudent);

     return (
          <div className="relative group">
               <div
                    className="flex items-center bg-maroon-700 text-black px-3 py-2 rounded-lg cursor-pointer hover:bg-maroon-800 transition duration-200"
                    onClick={() => setShowDetails(!showDetails)}
               >
                    {/* <span className='flex items-center justify-center h-8 w-8 bg-white text-maroon-700 rounded-full font-bold mr-2'>
                         {presentStudent.username}
                    </span> */}
                    <span className='flex items-center justify-center h-8 w-fit bg-white text-maroon-700 rounded-full font-bold mr-2'>
                         {presentStudent.username}
                    </span>
               </div>

               {showDetails && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 p-3">
                         <p className="text-sm text-gray-600">{presentStudent.studentName}</p>
                         <p className="text-sm font-medium text-gray-800">{presentStudent.username}</p>
                    </div>
               )}
          </div>
     )
}