//take attendance page for teachers 

import React, { useState, useEffect, useContext, useCallback, lazy } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { NavLink, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast'
import FullPageSpinner from "..//..//animation-components/spinner";
import { SocketContext } from '../../All-Provider/socketConnectionPro'
import { firstLetterUpperCase } from '../../commonFunctions/getUpperCase'
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
     const boxStyle = `bg-white rounded-2xl shadow-sm mb-2 sm:p-4`
     const inputStyle = `w-full outline-none border-dotted border-[1px] border-gray-500 focus:border-black focus:border-solid rounded-lg px-4 py-3 text-center text-lg font-mono  bg-white/60`
     const headerInfoStyle = `px-3 rounded-full font-semibold`
     return (
          <div className='min-h-screen bg-gray-200'>
               <div className='p-1 sm:p-6'>
                    {/* Compact Header */}
                    <div className={`${boxStyle} flex flex-nowrap justify-center`}>
                         <div className='text-red-900 p-2 sm:p-4'>
                              <div className='flex flex-wrap md:flex-nowrap justify-start md:justify-center text-lg sm:text-xl lg:text-2xl font-bold text-red-800 sm:gap-2'>
                                   <span className={`${headerInfoStyle} font-bold`}>{firstLetterUpperCase(lectureInfo?.department)}</span>
                                   <span className={`${headerInfoStyle} font-bold`}>{firstLetterUpperCase(lectureInfo?.year)}</span>
                                   <span className={`${headerInfoStyle} font-bold`}>{firstLetterUpperCase(lectureInfo?.branch)}</span>
                              </div>
                              <div className='grid grid-cols-2 place-items-start md:flex md:flex-nowrap md:justify-center items-center text-sm sm:text-base text-red-800'>
                                   <span className={`${headerInfoStyle} `}>
                                        {firstLetterUpperCase(lectureInfo?.subjectsData?.subName)}
                                   </span>
                                   <span className={`${headerInfoStyle} `}>
                                        {firstLetterUpperCase(lectureInfo?.subjectsData?.subCode)}
                                   </span>
                                   <span className={`${headerInfoStyle} `}>
                                        {firstLetterUpperCase(lectureInfo?.subjectsData?.teacher)}
                                   </span>
                              </div>

                              {/* Status Badge */}
                              <div className='flex justify-center mt-3'>
                                   <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${isLectureActive
                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                        : isLectureCompleted
                                             ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                             : 'bg-amber-100 text-amber-800 border border-amber-200'
                                        } `}>
                                        {isLectureActive && (
                                             <div className='flex items-center justify-center gap-2 text-sm text-green-600'>
                                                  <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                                                  <span>Live Class</span>
                                             </div>
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
                              <div className={`${boxStyle} bg-white backdrop-blur-sm rounded-xl shadow-sm p-4 sm:p-6`}>
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
                                                       className={`${inputStyle} `}
                                                  />
                                             </div>
                                             <button
                                                  onClick={handleSubmitPin}
                                                  // disabled={checkValidPin}
                                                  className={`${checkValidPin() ? "bg-blue-500" : ""} w-full bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 text-black font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2`}>
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
                                   <div className={`${boxStyle} `}>
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
                                                       className={`${inputStyle} `}
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
                                   <div className={`${boxStyle} `}>
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
                                   <div className={`${boxStyle} `}>
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
                                                       style={{ width: `${Math.min((presentCurrent / (lectureInfo.totalStudents || 1)) * 100, 100)}% ` }}
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
     }, [showDetails])
     return (
          <div className={`${keyId} relative text - black w - fit rounded - 2xl cursor - pointer hover: bg - gray - 700 transition duration - 200`}>
               <div
                    className={`${showDetails ? "pointer-events-none disabled:" : ""} flex items - center`} // none clickable when showDetails is true
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