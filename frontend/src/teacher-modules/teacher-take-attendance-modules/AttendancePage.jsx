//take attendance page for teachers 

import React, { useState, useEffect, useContext, useCallback, lazy } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { NavLink, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast'
import { param } from 'motion/react-client';
import FullPageSpinner from "..//..//animation-components/spinner";
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
     const [newPin, setNewPin] = useState(null); // pin that saved in server

     const [rollNumber, setRollNumber] = useState(""); // to store manually added student rollnumber;

     const [detailsFetched, setDetailsFetched] = useState(false);

     const [presentCurrent, setPresentCurrent] = useState(0); // to store next student roll number;
     const [presentPrevious, setPresentPrevious] = useState(0); // highest number of student present in previous class
     const [currentLectureAttDocId, setCurrentLectureAttDocId] = useState(null); // to store current lecture document ID
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

     //self called function to fetch lecture info
     const fetchLectureInfo = useCallback(async () => {
          console.log("objectId", objectId, "index", index);
          try {
               const lectureinfoResponse = await axios.get(`${import.meta.env.VITE_API_URL}/user-lectures/get-lecture-info/`, {
                    params: {
                         objectId: objectId,
                         index: index,
                    },
                    withCredentials: true,
               });
               console.log("server response for lecture info = ", lectureinfoResponse);
               if (lectureinfoResponse.status == 200) {
                    if (lectureinfoResponse?.data?.searchedLectureDocument?.subjectsData?.status == "pending") {
                         // Handle pending status
                         console.log("Lecture is pending:");
                         setLectureInfo(lectureinfoResponse?.data?.searchedLectureDocument);
                         setIsLectureActive(false);
                         setIsLectureCompleted(false);
                    } else if (lectureinfoResponse?.data?.searchedLectureDocument?.subjectsData?.status == "running") {
                         console.log("Lecture is running");
                         setPin(lectureinfoResponse?.data?.searchedLectureDocument?.subjectsData?.pin);
                         setAttendancesDocument(lectureinfoResponse?.data?.attendanceDocument);
                         setAttendanceList(lectureinfoResponse?.data?.attendanceDocument?.record);
                         setPresentCurrent(lectureinfoResponse?.data?.attendanceDocument?.record.length || 0);
                         setIsLectureActive(true);
                         setIsLectureCompleted(false);
                    } else if (lectureinfoResponse?.data?.searchedLectureDocument?.subjectsData?.status == "complete") {
                         console.log("Lecture is completed:");
                         setPin(lectureinfoResponse?.data?.searchedLectureDocument?.subjectsData?.pin);
                         setAttendancesDocument(lectureinfoResponse?.data?.attendanceDocument);
                         setAttendanceList(lectureinfoResponse?.data?.attendanceDocument?.record);
                         setPresentCurrent(lectureinfoResponse?.data?.attendanceDocument?.record?.length || 99);
                         setIsLectureCompleted(true);
                         setIsLectureActive(false)
                    }
                    console.log("Lecture status checked");
                    setLectureInfo(lectureinfoResponse?.data?.searchedLectureDocument);
                    setPresentPrevious(lectureinfoResponse?.data?.searchedLectureDocument?.previousAttendanceCount || 0);
                    setCurrentLectureAttDocId(lectureinfoResponse?.data?.attendanceDocument?._id || null);
               } else if (lectureinfoResponse.status == 204) { // if no content to return
                    console.error("Some thing went wrong or missing ", lectureinfoResponse.data.message);
                    toast.error(lectureinfoResponse.data.message);
                    setIsLectureActive(false);
                    setIsLectureCompleted(false);
                    setPresentPrevious(lectureinfoResponse?.data?.searchedLectureDocument?.previousAttendanceCount)
               } else if (lectureinfoResponse.status == 400) {
                    console.error("Error fetching lecture info:", lectureinfoResponse.data.message);
                    toast.error(lectureinfoResponse.data.message);
               } else if (lectureinfoResponse.status == 404) {
                    console.error("Error fetching lecture info:", lectureinfoResponse.data.message);
                    toast.error(lectureinfoResponse.data.message);
               } else if (lectureinfoResponse.status == 500) {
                    console.error("Error fetching lecture info:", lectureinfoResponse.data.message);
                    toast.error(lectureinfoResponse.data.message);
               }
          } catch (error) {
               console.error("Error fetching lecture info:", error);
               toast.error("Error fetching details");
          }
     }, [objectId, index, pin]);

     useEffect(() => {
          fetchLectureInfo()
     }, [fetchLectureInfo]);

     const handleAddStudent = async () => {
          console.log("handleAddStudent run");
          // currentLectureAttDocId: currentLectureAttDocId,
          // usernames: rollNumber,
          const bodyData = {
               subCode: lectureInfo.subjectsData.subCode,
               teacherUsername: lectureInfo.subjectsData.username, // teacher
               docId: lectureInfo._id,
               studentUsername: rollNumber, // student to mark present
               name: "arpi"
          }

          // Example: teacher marks student manually
          socket.emit(
               "addStudentManually",
               bodyData,
               (response) => {
                    // callback from server
                    if (response.success) {
                         console.log("Teacher got confirmation:", response.message);
                         // toast.error(response.message)
                    } else {
                         console.error("Error:", response.message);
                         toast.error(response.message)
                    }
               }
          );
          socket.on('student-added', (data) => {
               console.log("Received", data);
               console.log("old", attendanceList);
               setAttendanceList((prev) => {
                    if (prev.some(s => s?.username == data.username)) { return prev };
                    const updated = [...prev, { username: data.username, name: data.name }];
                    setPresentCurrent(updated.length)
                    return updated;
               });
               console.log("updated", attendanceList);
               // setPresentCurrent((prev) => prev + 1);
               toast.success(data.name + " Added Successfully", { id: data.username })
          });
     }



     const handleSubmitPin = async () => {
          const newPin = document.getElementById("newPin").value;
          console.log(newPin);

          if (newPin < 999) {
               console.log("length of pin is short");
               toast.error("PIN must be 6 digits long");
               return;
          }
          try {
               const submitPinResponse = await axios.post(`${import.meta.env.VITE_API_URL}/submit-pin`,
                    {
                         objectId: objectId,
                         index: index,
                         pin: newPin,
                    },
                    { withCredentials: true }
               );
               console.log("New PIN generated:", submitPinResponse.data);
               if (submitPinResponse.status === 200) {
                    setIsLectureActive(true);
                    setIsLectureCompleted(false);
                    setCurrentLectureAttDocId(submitPinResponse?.data?.newClassObject?._id);
                    setPin(submitPinResponse?.data?.storedPin);
                    setAttendanceList(() => [])
                    toast.success("Class is activated")
                    setPresentPrevious(submitPinResponse?.data?.previousAttendanceCount || 0);
               } else if (submitPinResponse.status === 400) {
                    console.log("all fields are mandatory");
                    toast.error("Please fill all fields")
               } else if (submitPinResponse.status === 404) {
                    toast.error("Something not found");
               } else if (submitPinResponse.status === 500) {
                    toast.error("Internal server error");
               }
          } catch (error) {
               toast.error("Error activating class");
          }
     }

     const submitRecord = async () => {
          console.log("submit record fun run.");
          try {
               const response = await axios.put(`${import.meta.env.VITE_API_URL}/submit-record`, { objectId, index, currentLectureAttDocId }, { withCredentials: true })
               console.log(response.data);
               if (response.status == 200) {
                    setIsLectureActive(false)
                    setIsLectureCompleted(true)
                    toast.success("Class Successfully saved", {
                         description: response.data.message
                    });
               } else if (response.status == 400) {
                    toast.error("All fields are mandatory");
               } else if (response.status == 404) {
                    toast.error("Something not found");
               } else if (response.status == 500) {
                    toast.error("Internal server error");
               }
          } catch (error) {
               console.log("error during submittin record", error);
               toast.error("Error in submitting record");
          }
     }
     function checkValidPin() {
          if (newPin > 999) {
               return false;
          } else {
               return true;
          }
     }
     if (!lectureInfo) {
          return (
               <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-maroon-50'>
                    <div className='text-center'>
                         <div className='animate-spin rounded-full h-16 w-16 border-4 border-maroon-500 border-t-transparent mx-auto mb-4'></div>
                         <h1 className='text-xl font-semibold text-maroon-800'>Loading class details...</h1>
                         <p className='text-maroon-600 mt-2'>Please wait</p>
                    </div>
               </div>
          );
     }
     const boxStyle = `bg-white backdrop-blur-md rounded-2xl shadow-sm border-slate-200 p-4 sm:p-6 mb-6`
     const inputStyle = `w-full outline-none border-dotted border-[1px] border-gray-500 focus:border-black focus:border-solid rounded-lg px-4 py-3 text-center text-lg font-mono  bg-white/60`
     return (
          <div className='min-h-screen'>
               <div className='max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8'>
                    {/* Compact Header */}
                    <div className={`${boxStyle}`}>
                         <div className='text-center text-red-900'>
                              <div className='flex flex-wrap justify-center items-center gap-2 text-lg sm:text-xl lg:text-2xl font-bold text-maroon-800 mb-2'>
                                   <span>{lectureInfo?.department}</span>
                                   <span className='text-maroon-400'>•</span>
                                   <span>{lectureInfo?.year}</span>
                                   <span className='text-maroon-400'>•</span>
                                   <span>{lectureInfo?.branch}</span>
                              </div>
                              <div className='flex flex-wrap justify-center items-center gap-4 text-sm sm:text-base text-maroon-600'>
                                   <span className='bg-maroon-50 px-3 py-1 rounded-full font-medium'>
                                        {lectureInfo?.subjectsData?.subName}
                                   </span>
                                   <span className='bg-maroon-50 px-3 py-1 rounded-full font-mono'>
                                        {lectureInfo?.subjectsData?.subCode}
                                   </span>
                                   <span className='bg-maroon-50 px-3 py-1 rounded-full'>
                                        {lectureInfo?.subjectsData?.teacher}
                                   </span>
                              </div>

                              {/* Status Badge */}
                              <div className='flex justify-center mt-3'>
                                   <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${isLectureActive
                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                        : isLectureCompleted
                                             ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                             : 'bg-amber-100 text-amber-800 border border-amber-200'
                                        }`}>
                                        {isLectureActive && (
                                             <>
                                                  <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                                                  <span>Live Class</span>
                                             </>
                                        )}
                                        {isLectureCompleted && (
                                             <>
                                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                  </svg>
                                                  <span>Completed</span>
                                             </>
                                        )}
                                        {!isLectureActive && !isLectureCompleted && (
                                             <>
                                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 7a1 1 0 012 0v5a1 1 0 01-2 0V7z" clipRule="evenodd" />
                                                  </svg>
                                                  <span>Pending</span>
                                             </>
                                        )}
                                   </div>
                              </div>
                         </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                         {/* Left Sidebar - Controls */}
                         <div className='lg:col-span-4 space-y-4'>
                              {/* PIN Generator Card */}
                              <div className="bg-white backdrop-blur-sm rounded-xl shadow-sm p-4 sm:p-6">
                                   <div className='flex items-center gap-3 mb-4'>
                                        <div className='p-2 rounded-lg'>
                                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6a2 2 0 012-2m0 0V7a2 2 0 012-2m0 0V5a2 2 0 012-2h4a2 2 0 012 2v2m0 0h-4" />
                                             </svg>
                                        </div>
                                        <h2 className='text-lg font-semibold text-red-900'>Class PIN</h2>
                                   </div>

                                   {isLectureActive ? (
                                        <div className="text-center font-mono bg-gradient-to-r from-red-50 to-rose-100 rounded-lg p-4">
                                             <p className='text-sm text-red-900 mb-2'>Active PIN</p>
                                             <div className='text-3xl font-mono font-bold text-maroon-800 tracking-wider'>
                                                  {pin}
                                             </div>
                                             <div className='flex items-center justify-center gap-2 mt-3 text-sm text-green-600'>
                                                  <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                                                  <span>Students can join now</span>
                                             </div>
                                        </div>
                                   ) : (
                                        <div className="space-y-4">
                                             <div className="relative">
                                                  <input
                                                       type="number"
                                                       id="newPin"
                                                       maxLength={6}
                                                       placeholder='Enter 6-digit PIN'
                                                       onClick={(e) => {
                                                            // checkValidPin()
                                                            setNewPin(e.target.value)
                                                       }}
                                                       className={`${inputStyle}`}
                                                  />
                                             </div>
                                             <button
                                                  onClick={handleSubmitPin}
                                                  // disabled={checkValidPin}
                                                  className={`${checkValidPin ? "bg-blue-500" : ""} w-full bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 text-black font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2`}>
                                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                  </svg>
                                                  Start Class
                                             </button>
                                        </div>
                                   )}
                              </div>

                              {/* Manual Add Student */}
                              {isLectureActive && (
                                   <div className={`${boxStyle}`}>
                                        <div className='flex items-center gap-3 mb-4'>
                                             <div className='bg-blue-100 p-2 rounded-lg'>
                                                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                  </svg>
                                             </div>
                                             <h2 className='text-lg font-semibold text-maroon-800'>Add Manually</h2>
                                        </div>
                                        <div className="space-y-4">
                                             <div className="relative">
                                                  <input
                                                       type="text"
                                                       id="rollNumber"
                                                       onChange={(e) => setRollNumber(e.target.value)}
                                                       placeholder='Enter Enrollment Number'
                                                       className={`${inputStyle}`}
                                                  />
                                             </div>
                                             <button
                                                  onClick={handleAddStudent}
                                                  // disabled={ }
                                                  className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2'>
                                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                  </svg>
                                                  Add Student
                                             </button>
                                        </div>
                                   </div>
                              )}

                              {/* Submit Record Button */}
                              {isLectureActive && (
                                   <div className={`${boxStyle}`}>
                                        <button
                                             onClick={submitRecord}
                                             className='w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-4 px-4 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2 text-lg'>
                                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                             </svg>
                                             End Class & Save
                                        </button>
                                   </div>
                              )}
                         </div>

                         {/* Right Main Area - Attendance List */}
                         {(isLectureActive || isLectureCompleted) && (
                              <div className='lg:col-span-8'>
                                   <div className={`${boxStyle}`}>
                                        {/* Stats Header */}
                                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                                             <h2 className='text-xl font-bold text-maroon-800 flex items-center gap-3'>
                                                  <div className='bg-maroon-100 p-2 rounded-lg'>
                                                       <svg className="w-6 h-6 text-maroon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                       </svg>
                                                  </div>
                                                  Present Students
                                             </h2>

                                             <div className='flex items-center gap-6'>
                                                  <div className='text-center'>
                                                       <div className='text-2xl font-bold text-green-600'>{presentCurrent}</div>
                                                       <div className='text-xs text-slate-600'>Present</div>
                                                  </div>
                                                  <div className='text-center'>
                                                       <div className='text-2xl font-bold text-slate-600'>{lectureInfo.totalStudents || 'N/A'}</div>
                                                       <div className='text-xs text-slate-600'>Total</div>
                                                  </div>
                                                  <div className='text-center'>
                                                       <div className='text-2xl font-bold text-amber-600'>{presentPrevious}</div>
                                                       <div className='text-xs text-slate-600'>Previous</div>
                                                  </div>
                                             </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-6">
                                             <div className="flex justify-between text-sm text-slate-600 mb-2">
                                                  <span>Attendance Progress</span>
                                                  <span>{Math.round((presentCurrent / (lectureInfo.totalStudents || 1)) * 100)}%</span>
                                             </div>
                                             <div className="w-full bg-slate-200 rounded-full h-3">
                                                  <div
                                                       className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500 ease-out"
                                                       style={{ width: `${Math.min((presentCurrent / (lectureInfo.totalStudents || 1)) * 100, 100)}%` }}
                                                  ></div>
                                             </div>
                                        </div>

                                        {/* Students List */}
                                        {presentCurrent === 0 ? (
                                             <div className="flex flex-col justify-center items-center h-48 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-300">
                                                  <div className='bg-slate-200 rounded-full p-4 mb-4'>
                                                       <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                       </svg>
                                                  </div>
                                                  <p className="text-slate-500 text-center font-medium">No students marked present yet</p>
                                                  <p className="text-slate-400 text-sm mt-1">Students will appear here as they join</p>
                                             </div>
                                        ) : (
                                             <div className="bg-gradient-to-br from-slate-50 to-maroon-50 rounded-xl p-4 min-h-48">
                                                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                                       {attendanceList.map((presentStudent, index) => (
                                                            console.log(presentStudent),
                                                            <PresentStudent presentStudent={presentStudent} key={index} keyId={index} />
                                                       ))}
                                                  </div>
                                             </div>
                                        )}
                                   </div>
                              </div>
                         )}
                    </div>
               </div>
          </div>
     )
}

function PresentStudent({ presentStudent, keyId }) {
     const [showDetails, setShowDetails] = useState(false);
     console.log(presentStudent);
     useEffect(() => {
          setTimeout(() => {
               setShowDetails(false);
          }, 4000);
     }, [])
     return (
          <div className={`${keyId}relative text-black w-fit rounded-2xl cursor-pointer hover:bg-gray-700 transition duration-200`}>
               <div
                    className={`${showDetails ? "pointer-events-none" : ""} flex items-center`} // none clickable when showDetails is true
                    onClick={() => setShowDetails(!showDetails)}
               >
                    <span className='flex items-center justify-center text-green-600 font-bold px-4 py-1'>
                         {presentStudent.username || "null"}
                    </span>
               </div>

               {showDetails && (
                    <div className="absolute top-8 left-0 w-full font-bold bg-white border-[1px] p-2 border-gray-600 rounded-md shadow-lg z-10">
                         <p className="text-sm text-gray-600">{presentStudent?.name}</p>
                    </div>
               )}
          </div>
     )
}

// //take attendance page for teachers

// import React, { useState, useEffect, useContext, lazy } from 'react'
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { NavLink, useLocation } from 'react-router-dom';
// import toast from 'react-hot-toast'
// import { param } from 'motion/react-client';
// import FullPageSpinner from "..//..//animation-components/spinner";
// // import io from 'socket.io-client'
// // const socket = io(import.meta.env.VITE_API_URL, {
// //      auth: { authToken: Cookies.get('auth_token') }
// // })
// import { SocketContext } from '../../All-Provider/socketConnectionPro'


// export default function AttendancePage() {
//      const socket = useContext(SocketContext);
//      const objectId = useParams("id").id; // get lecture id from url
//      const index = useParams("index").index; // get lecture id from url

//      const [lectureInfo, setLectureInfo] = useState(undefined);// to check if lecture response is fetched or not
//      const [isLectureActive, setIsLectureActive] = useState(false);
//      const [isLectureCompleted, setIsLectureCompleted] = useState(false);
//      const [attendancesDocument, setAttendancesDocument] = useState(null);// store document
//      const [attendanceList, setAttendanceList] = useState([]); // students list that all present
//      const [pin, setPin] = useState(""); // pin that saved in server

//      const [rollNumber, setRollNumber] = useState(""); // to store manually added student rollnumber;
//      const [detailsFetched, setDetailsFetched] = useState(false);
//      const [presentCurrent, setPresentCurrent] = useState(0); // to store next student roll number;
//      const presentPrevious = 60;// highest number of student present in previous class
//      // implimantation of socket io for tracking attendaces
//      useEffect(() => {
//           console.log("socket oi run for attendance");
//           const handler = (StudInfo) => {
//                console.log("Received:", StudInfo);
//                console.log("old", attendanceList);
//                setAttendanceList((prev) => [...prev, StudInfo]);
//                console.log("updated", attendanceList);
//                setPresentCurrent((prev) => prev + 1);
//           };
//           socket.on("newAttendanceEvent", handler);
//           return () => {
//                socket.off("newAttendanceEvent", handler); // Proper cleanup
//           };
//      }, []);
//      // Logic to add student
//      const handleAddStudent = () => {
//           if (rollNumber) {
//                setRollNumber('');
//                setPresentCurrent(prev => prev + 1);
//           }
//      }

//      useEffect(() => {
//           //self called function to fetch lecture info
//           const fetchLectureInfo = async () => {
//                console.log("objectId", objectId, "index", index);
//                try {
//                     const lectureinfoResponse = await axios.get(`${import.meta.env.VITE_API_URL}/user-lectures/get-lecture-info/`, {
//                          params: {
//                               objectId: objectId,
//                               index: index,
//                          },
//                          withCredentials: true,

//                     });
//                     console.log("server response for lecture info = ", lectureinfoResponse);
//                     if (lectureinfoResponse.status == 200) {
//                          if (lectureinfoResponse?.data?.searchedLectureDocument?.subjectsData?.status == "pending") {
//                               // Handle pending status
//                               console.log("Lecture is pending:");
//                               setIsLectureActive(false);
//                               setLectureInfo(lectureinfoResponse?.data?.searchedLectureDocument);
//                          } else if (lectureinfoResponse?.data?.searchedLectureDocument?.subjectsData?.status == "running") {
//                               console.log("Lecture is running");
//                               setIsLectureActive(true);
//                               setPin(lectureinfoResponse?.data?.searchedLectureDocument?.subjectsData?.pin);
//                               setAttendancesDocument(lectureinfoResponse?.data?.attendanceDocument);
//                               setAttendanceList(lectureinfoResponse?.data?.attendanceDocument?.record);
//                          } else if (lectureinfoResponse?.data?.searchedLectureDocument?.status == "completed") {
//                               console.log("Lecture is completed:");
//                               setIsLectureCompleted(true);
//                               setPin(lectureinfoResponse?.data?.searchedLectureDocument?.subjectsData?.pin);
//                               setAttendancesDocument(lectureinfoResponse?.data?.attendanceDocument);
//                               setAttendanceList(lectureinfoResponse?.data?.attendanceDocument?.record);
//                          }
//                          console.log("Lecture status checked");
//                          setLectureInfo(lectureinfoResponse?.data?.searchedLectureDocument);
//                     } else if (lectureinfoResponse.status == 400) {
//                          console.error("Error fetching lecture info:", lectureinfoResponse.data.message);
//                          toast.error(lectureinfoResponse.data.message);
//                     } else if (lectureinfoResponse.status == 404) {
//                          console.error("Error fetching lecture info:", lectureinfoResponse.data.message);
//                          toast.error(lectureinfoResponse.data.message);
//                     } else if (lectureinfoResponse.status == 500) {
//                          console.error("Error fetching lecture info:", lectureinfoResponse.data.message);
//                          toast.error(lectureinfoResponse.data.message);
//                     }
//                } catch (error) {
//                     console.error("Error fetching lecture info:", error);
//                     toast.error("Error fetching details");
//                }
//           };
//           fetchLectureInfo()
//      }, [objectId, index]);

//      const handleSubmitPin = async () => {
//           const newPin = document.getElementById("newPin").value;
//           console.log(newPin);

//           if (newPin < 100000) {
//                console.log("length of pin is short");
//                alert("length of pin is short");
//                return;
//           }

//           const submitPinResponse = await axios.post(`${import.meta.env.VITE_API_URL}/submit-pin`,
//                {
//                     objectId: objectId,
//                     index: index,
//                     pin: newPin,
//                },
//                { withCredentials: true }
//           );
//           console.log("New PIN generated:", submitPinResponse.data);
//           if (submitPinResponse.status === 200) {
//                setPin(submitPinResponse.data.newPin);
//                setIsLectureActive(true);
//                toast.success("Class is activated")
//           } else if (submitPinResponse.status === 400) {
//                console.log("all fields are mandatory");
//                // submitPinResponse.data.message ? toast.error(submitPinResponse.data.message) : toast.error("Class already activated");
//                toast.error("please fill all fields")
//           } else if (submitPinResponse.status === 404) {
//                toast.error("something not found");
//           } else if (submitPinResponse.status === 500) {
//                toast.error("Internal server error");
//           }

//      }

//      const submitRecord = async () => {
//           console.log("submit record fun run.");
//           try {
//                const response = await axios.put(`${import.meta.env.VITE_API_URL}/submit-record`, { objectId, index }, { withCredentials: true })
//                console.log(response.data);
//                if (response == 200) {
//                     isLectureActive(false)
//                     isLectureCompleted(true)
//                     toast.success("Class Successfully saved", {
//                          description: response.data.message
//                     });
//                } else if (response == 400) {
//                     toast.error("All fields are mandatory");
//                } else if (response == 404) {
//                     toast.error("Something not found");
//                } else if (response == 500) {
//                     toast.error("Internal server error");
//                }
//           } catch (error) {
//                console.log("error during submittin record", error);
//                toast.error("Error in submitting record");
//           }
//      }
//      if (!lectureInfo) {
//           return <FullPageSpinner message="Loading product…" />;
//      }

//      return (//bg-gray-50 from-gray-100 to-gray-200
//           <div className='min-h-screen  bg-gradient-to-br '>
//                <div className='max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
//                     {/* Header */}
//                     {/* bg-white */}
//                     <div className=' rounded-lg shadow-md p-6 mb-8 border-l-4 border-maroon-700 text-gray-800'>
//                          <div className='flex justify-center items-center text-center sm:space-x-2 text-2xl font-bold text-gray-800'>
//                               <h1 className="px-2">{lectureInfo?.department || 'Department'}</h1>
//                               <span className='px-2'>/</span>
//                               <h1 className="px-2">{lectureInfo?.year || 'Year'}</h1>
//                               <span className='px-2'>/</span>
//                               <h1 className='px-2'>{lectureInfo?.branch || 'Branch'}</h1>
//                          </div>
//                          <div className='m-3 md:m-5 flex justify-evenly md:text-2xl font-medium'>
//                               <h3 className="m-0 md:m-2 px-0 md:px-9">{lectureInfo?.subjectsData?.subName} / {lectureInfo?.subjectsData?.subCode || "bt123"}</h3>
//                               {/* <h3 className="m-2 px-3"></h3> */}
//                               <h3 className="m-0 md:m-2 px-0 md:px-9">{lectureInfo?.subjectsData?.teacher}</h3>
//                          </div>
//                     </div>
//                     {/* Header */}
//                     {/* main container */}
//                     <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
//                          {/* Left Column */}
//                          <div className='lg:col-span-1 space-y-6'>
//                               {/* PIN Generator*/}
//                               <div className=" rounded-lg shadow-md p-6">
//                                    <h2 className='text-xl font-semibold text-gray-800 mb-4'>Generate PIN</h2>
//                                    {
//                                         pin ? (
//                                              <h1>Set Pin : {pin}</h1>
//                                         ) :
//                                              <div className="flex flex-col space-y-4">
//                                                   <div className="flex items-center">
//                                                        <label htmlFor="newPin" className='text-gray-700 font-medium w-20'>PIN</label>
//                                                        <input
//                                                             type="number"
//                                                             name="pin"
//                                                             id="newPin"
//                                                             // value={pin}
//                                                             // onChange={(e) => setPin(e.target.value)}
//                                                             maxLength={6}
//                                                             minvalue={100000}
//                                                             placeholder='Enter 6 digit PIN'

//                                                             className='flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-transparent'
//                                                        />
//                                                   </div>
//                                                   <button
//                                                        onClick={handleSubmitPin}
//                                                        className='w-full bg-maroon-700 hover:bg-maroon-800 text-black font-bold py-2 px-4 rounded-lg transition duration-200'>
//                                                        Generate PIN
//                                                   </button>
//                                              </div>
//                                    }
//                               </div>

//                               {/* Manual Add Student */}
//                               {
//                                    isLectureActive &&
//                                    <div className="bg-white rounded-lg shadow-md p-6">
//                                         <h2 className='text-xl font-semibold text-gray-800 mb-4'>Add Student Manually</h2>
//                                         <div className="flex flex-col space-y-4">
//                                              <div className="flex items-center">
//                                                   <label htmlFor="rollNumber" className='text-gray-700 font-medium w-28'>Roll Number</label>
//                                                   <input
//                                                        type="number"
//                                                        id="rollNumber"
//                                                        value={rollNumber}
//                                                        onChange={(e) => setRollNumber(e.target.value)}
//                                                        className='flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-transparent'
//                                                   />
//                                              </div>
//                                              <button
//                                                   onClick={handleAddStudent}
//                                                   className='w-full bg-maroon-700 hover:bg-maroon-800 text-black font-bold py-2 px-4 rounded-lg transition duration-200'>
//                                                   Add Student
//                                              </button>
//                                         </div>
//                                    </div>
//                               }
//                          </div>

//                          {/* Right Column */}
//                          {
//                               (isLectureActive || isLectureCompleted) &&

//                               <div className='lg:col-span-2'>
//                                    <div className="bg-white rounded-lg shadow-md p-6">
//                                         <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
//                                              <div className='flex items-center mb-4 sm:mb-0'>
//                                                   <span className="text-gray-700 font-semibold">Total Students:</span>
//                                                   <span className="ml-2 bg-gray-200 px-3 py-1 rounded-full text-gray-800 font-bold">{lectureInfo.totalStudents}</span>
//                                              </div>
//                                              <div className='flex items-center'>
//                                                   <span className="text-gray-700 font-semibold">Present:</span>
//                                                   <span className="ml-2 bg-green-100 px-3 py-1 rounded-full text-green-800 font-bold">{presentCurrent}</span>
//                                                   <span className="mx-2 text-gray-500">/</span>
//                                                   <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-medium">{presentPrevious}</span>
//                                              </div>
//                                         </div>

//                                         <h2 className='text-xl font-semibold text-gray-800 mb-4'>Present Students</h2>

//                                         {presentCurrent === 0 ? (
//                                              <div className="flex justify-center items-center h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
//                                                   <p className="text-gray-500 text-center">No students marked present yet</p>
//                                              </div>
//                                         ) : (
//                                              <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg min-h-48">
//                                                   {attendanceList.map((student, index) => (
//                                                        <PresentStudent presentStudent={student} key={index} />
//                                                   ))}
//                                              </div>
//                                         )}
//                                    </div>
//                               </div>
//                          }
//                          {isLectureActive &&
//                               <div className="submit-attendance">
//                                    <button className='w-full bg-maroon-700 hover:bg-maroon-800 text-black font-bold py-2 px-4 rounded-lg transition duration-200' type="submit" onClick={() => submitRecord()}>Submit Record</button>
//                               </div>
//                          }
//                     </div>
//                </div>
//           </div>
//      )
// }

// function PresentStudent({ presentStudent }) {
//      const [showDetails, setShowDetails] = useState(false);
//      console.log(presentStudent);

//      return (
//           <div className="relative group">
//                <div
//                     className="flex items-center bg-maroon-700 text-black px-3 py-2 rounded-lg cursor-pointer hover:bg-maroon-800 transition duration-200"
//                     onClick={() => setShowDetails(!showDetails)}
//                >
//                     {/* <span className='flex items-center justify-center h-8 w-8 bg-white text-maroon-700 rounded-full font-bold mr-2'>
//                          {presentStudent.username}
//                     </span> */}
//                     <span className='flex items-center justify-center h-8 w-fit bg-white text-maroon-700 rounded-full font-bold mr-2'>
//                          {presentStudent.username}
//                     </span>
//                </div>

//                {showDetails && (
//                     <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 p-3">
//                          <p className="text-sm text-gray-600">{presentStudent.studentName}</p>
//                          <p className="text-sm font-medium text-gray-800">{presentStudent.username}</p>
//                     </div>
//                )}
//           </div>
//      )
// }