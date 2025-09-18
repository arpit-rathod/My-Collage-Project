// module for submitting attendance student side
import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react'
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { Outlet, useNavigate } from 'react-router-dom';
import FullPageSpinner from '../../animation-components/spinner';
export default function SubmitAttendance() {
     const navigate = useNavigate();
     const [showModal, setShowModal] = useState(false);
     const [selectedLecture, setSelectedLecture] = useState(null);
     const [lecturesData, setLecturesData] = useState(null);
     const [subjectsData, setSubjectsData] = useState(null);
     const [lecturesDataLoading, setLecturesDataIsLoading] = useState(false);
     const [stats, setStats] = useState({ total: 0, present: 0, running: 0, completed: 0 });
     const [studentInfo, setStudentInfo] = useState({ name: null, username: null })
     useEffect(() => {
          async function fetchLectures() {
               console.log("Fetching lectures... for student");
               try {
                    setLecturesDataIsLoading(true);
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/student-lectures`, {
                         withCredentials: true,
                    });
                    if (response.status == 200) {
                         console.log("lectures information fetched");
                         console.log(response.data);
                         setStudentInfo((pre) => {
                              pre.name = response?.data?.lectureObject.name.toUpperCase();
                              pre.username = response.data.lectureObject.username.toUpperCase();
                              return pre;
                         });
                         setLecturesData(response.data?.lectureObject);
                         setSubjectsData(response.data?.lectureObject?.subjectsData);
                         // Calculate statistics
                         const subjects = response.data?.lectureObject?.subjectsData || [];
                         const stats = subjects.reduce((acc, subject) => {
                              acc.total++;
                              if (subject.studentStatus === 'present') acc.present++;
                              if (subject.status === 'running') acc.running++;
                              if (subject.status === 'complete') acc.completed++;
                              return acc;
                         }, { total: 0, present: 0, running: 0, completed: 0 });
                         setStats(stats);
                    } else {
                         console.log("No lecture information found");
                    }
               } catch (error) {
                    console.log(error);
                    toast.error("Failed to fetch lectures");
               } finally {
                    setLecturesDataIsLoading(false);
               }
          }
          fetchLectures();
     }, []);

     const handleOpenModal = (lecture) => {
          setSelectedLecture(lecture);
          setShowModal(true);
     };

     const handleCloseModal = () => {
          setShowModal(false);
          setSelectedLecture(null);
     };

     const updateSubjectStatus = (subCode, newStatus) => {
          setSubjectsData(prevData => {
               const updated = prevData.map(subject =>
                    subject.subCode === subCode
                         ? { ...subject, studentStatus: newStatus }
                         : subject
               );

               // Recalculate stats
               const newStats = updated.reduce((acc, subject) => {
                    acc.total++;
                    if (subject.studentStatus === 'present') acc.present++;
                    if (subject.status === 'running') acc.running++;
                    if (subject.status === 'complete') acc.completed++;
                    return acc;
               }, { total: 0, present: 0, running: 0, completed: 0 });
               setStats(newStats);

               return updated;
          });
     };

     const handleGoBack = () => {
          if (window.history.length > 1) {
               navigate(-1); // Go back to previous page
          } else {
               navigate('/'); // Fallback to home if no history
          }
     };
     if (lecturesDataLoading) {
          return (
               <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-maroon-50'>
                    <div className='text-center'>
                         <div className='animate-spin rounded-full h-16 w-16 border-4 border-maroon-500 border-t-transparent mx-auto mb-4'></div>
                         <h1 className='text-xl font-semibold text-maroon-800'>Loading your classes...</h1>
                         <p className='text-maroon-600 mt-2'>Please wait</p>
                    </div>
               </div>
          );
     }

     if (!lecturesData || !subjectsData) {
          return (
               <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-maroon-50'>
                    <div className='text-center'>
                         <div className='animate-spin rounded-full h-16 w-16 border-4 border-maroon-500 border-t-transparent mx-auto mb-4'></div>
                         <h1 className='text-xl font-semibold text-maroon-800'>Loading your classes...</h1>
                         <p className='text-maroon-600 mt-2'>Please wait</p>
                    </div>
               </div>
          );
     }

     if (!lecturesData || !subjectsData) {
          return (
               <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-maroon-50'>
                    <div className='text-center'>
                         <div className='bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
                              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                         </div>
                         <h3 className='text-lg font-semibold text-slate-700 mb-2'>No Classes Found</h3>
                         <p className='text-slate-500'>You are not enrolled in any classes yet</p>
                    </div>
               </div>
          );
     }

     return (
          <div className='min-h-screen bg-gradient-to-br from-slate-50 to-maroon-50 p-0'>
               <div className='max-w-7xl mx-auto p-0 py-0 sm:px-0 lg:px-0'>
                    {/* Header Section */}
                    {/* rounded-2xl shadow-lg border border-maroon-100 */}
                    <div className='bg-white/80 backdrop-blur-md p-4 sm:p-6 mb-6'>
                         {/* Back Arrow Button */}
                         <div className='text-center'>
                              <div className="flex">
                                   <button
                                        onClick={handleGoBack}
                                        className='flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-maroon-100 hover:bg-maroon-200 text-maroon-700 hover:text-maroon-800 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-maroon-300 focus:ring-offset-2'
                                        title="Go back"
                                   >
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                   </button>

                                   <h1 className='lg:text-3xl md:text-4xl font-bold m-2 text-[#800000]'>
                                        Class Room
                                   </h1>
                              </div>
                         </div>
                         <div className='border-3 border-[#800000] rounded-3xl bg-[#800000] '>

                              <div className='flex flex-wrap justify-evenly items-center gap-2 text-lg text-white p-5 bg-[#800000] rounded-t-2xl'>
                                   <div className='flex flex-wrap justify-between items-center gap-2 text-3xl font-medium'>
                                        <div>{studentInfo.name}</div>
                                        <div>({studentInfo.username})</div>
                                   </div>
                                   <div className='flex justify-between items-center gap-2'>
                                        <span className='bg-maroon-50 px-3 py-1 rounded-full font-medium text-3xl'>
                                             {lecturesData?.department}
                                        </span>
                                        <span className='text-maroon-400'>•</span>
                                        <span className='bg-maroon-50 px-3 py-1 rounded-full font-medium text-3xl'>
                                             {lecturesData?.year}
                                        </span>
                                        <span className='text-maroon-400'>•</span>
                                        <span className='bg-maroon-50 px-3 py-1 rounded-full font-medium text-3xl'>
                                             {lecturesData?.branch}
                                        </span>
                                   </div>
                              </div>


                              {/* Quick Stats */}
                              <div className='bg-white p-2 m-1 rounded-2xl'>
                                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 m-2 ">
                                        <div className="md:text-xl text-center bg-gradient-to-br from-red-500 to-red-900 text-white p-3 rounded-xl">
                                             <div className="text-2xl font-bold">{stats.total}</div>
                                             <div className="text-xs text-maroon-100">Total Classes</div>
                                        </div>
                                        <div className="text-center bg-gradient-to-br from-green-500 to-green-900 text-white p-3 rounded-xl">
                                             <div className="text-2xl font-bold">{stats.present}</div>
                                             <div className="text-xs text-green-100">Present</div>
                                        </div>
                                        <div className="text-center bg-gradient-to-br from-blue-500 to-blue-900 text-white p-3 rounded-xl">
                                             <div className="text-2xl font-bold">{stats.running}</div>
                                             <div className="text-xs text-blue-100">Live Now</div>
                                        </div>
                                        <div className="text-center bg-gradient-to-br from-slate-500 to-slate-900 text-white p-3 rounded-xl">
                                             <div className="text-2xl font-bold">{stats.completed}</div>
                                             <div className="text-xs text-slate-100">Completed</div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                         {/* Attendance Progress */}
                         {/* <div className="mt-4">
                              <div className="flex justify-between text-sm text-maroon-700 mb-2">
                                   <span>Attendance Rate</span>
                                   <span>{stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%</span>
                              </div>
                              <div className="w-full bg-maroon-200 rounded-full h-3">
                                   <div
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${stats.total > 0 ? (stats.present / stats.total) * 100 : 0}%` }}
                                   ></div>
                              </div>
                         </div> */}
                    </div>

                    {/* Action Bar */}
                    {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-maroon-100">
                         <div>
                              <h2 className='text-lg font-bold text-maroon-800'>Your Subjects</h2>
                              <p className='text-sm text-maroon-600'>Mark attendance for live classes</p>
                         </div>
                         <div className='flex items-center gap-2 text-sm'>
                              <div className='flex items-center gap-2'>
                                   <div className='w-3 h-3 bg-blue-500 rounded-full animate-pulse'></div>
                                   <span className='text-slate-600'>Live classes available</span>
                              </div>
                         </div>
                    </div> */}

                    {/* Subjects Grid */}
                    {/*  lg:grid-cols-3 xl:grid-cols-4 */}
                    {subjectsData.length != 0 ? (

                         <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-5">
                              {subjectsData?.map((item, index) => (
                                   <LectureCard
                                        key={index}
                                        item={item}
                                        onClick={() => handleOpenModal(item)}
                                   />
                              ))}
                         </div>
                    ) : (
                         <div className='text-center mb-8'>
                              <div className='bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-red-300 p-6'>
                                   <div className='flex items-center justify-center gap-3 mb-4'>
                                        <div className='bg-red-100 p-3 rounded-xl'>
                                             <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  {/* <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /> */}
                                             </svg>
                                        </div>
                                        <div>
                                             <h1 className='text-3xl font-bold text-red-800'>No Lectures Allocated yet</h1>
                                             <p className='text-red-600 mt-1'>wait for your instructor to allocate lectures</p>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    )
                    }
               </div>
               {/* Modal Component */}
               {showModal && selectedLecture && (
                    <ModalForSubmitAttendance
                         lecture={selectedLecture}
                         onClose={handleCloseModal}
                         onSuccess={(subCode) => updateSubjectStatus(subCode, 'present')}
                    />
               )}
               <Outlet />
          </div>
     )
}

// Enhanced Lecture Card Component
function LectureCard({ item, onClick }) {
     console.log(item);
     const studentStatus = item.studentStatus;
     const lectureStatus = item.status;

     const getStatusConfig = () => {
          if (lectureStatus === 'running') {
               if (studentStatus === 'present') {
                    return {
                         border: 'border-l-4 border-green-500',
                         badge: 'bg-green-100 text-green-800 border-green-200',
                         icon: '✅',
                         action: null,
                         statusBorder: 'border-l border-green-500 bg-gradient-to-br from-green-50 to-green-300'
                    };
               } else {
                    return {
                         border: 'border-l-4 border-blue-500',
                         badge: 'bg-blue-100 text-blue-800 border-blue-200',
                         icon: '🟢',
                         action: 'Mark Present',
                         statusBorder: 'border-l border-green-50 bg-gradient-to-br from-green-50 to-green-300'
                    };
               }
          } else if (lectureStatus === 'complete') {
               return {
                    border: studentStatus === 'present' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500',
                    badge: 'bg-slate-100 text-slate-600 border-slate-200',
                    icon: studentStatus === 'present' ? '✅' : '❌',
                    action: null,
                    statusBorder: 'border-l border-black-900 bg-gradient-to-br from-gray-50 to-gray-400'
               };
          } else {
               return {
                    border: 'border-l-4 border-amber-500',
                    badge: 'bg-amber-100 text-amber-800 border-amber-200',
                    icon: '⏳',
                    action: null,
                    statusBorder: 'border-l border-amber-500 bg-gradient-to-br from-amber-50 to-amber-300'
               };
          }
     };

     const config = getStatusConfig();

     return (
          <div className={`bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 ${config.border} transition-all duration-200 transform hover:-translate-y-1 hover:scale-102 overflow-hidden h-48`}>
               <div className="p-4 h-full flex flex-col">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-3">
                         <div className={`px-2 py-1 rounded-full text-xs font-medium border ${config.badge} ${config.statusBorder}`}>
                              {lectureStatus.toUpperCase()}
                         </div>
                         <span className="text-lg">{config.icon}</span>
                    </div>

                    {/* Subject Info */}
                    <div className="flex-1 mb-3">
                         <h3 className="font-bold text-[#800000] text-base mb-1 line-clamp-2">
                              {item.subName}
                         </h3>
                         <p className="text-sm text-maroon-600 font-mono mb-1">
                              {item.subCode}
                         </p>
                         <p className="text-xs text-slate-600 truncate">
                              {item.teacher}
                         </p>
                    </div>

                    {/* Status Display */}
                    <div className="mt-auto">
                         {lectureStatus === 'running' && studentStatus === 'present' && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                                   <span className="text-green-800 font-medium text-sm">Present</span>
                              </div>
                         )}

                         {lectureStatus === 'running' && studentStatus !== 'present' && (
                              <button
                                   onClick={onClick}
                                   className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-3 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                              >
                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                   </svg>
                                   Mark Present
                              </button>
                         )}

                         {lectureStatus === 'complete' && (
                              <div className={`border rounded-lg p-2 text-center ${studentStatus === 'present'
                                   ? 'bg-green-50 border-green-200'
                                   : 'bg-red-50 border-red-200'
                                   }`}>
                                   <span className={`font-medium text-sm ${studentStatus === 'present'
                                        ? 'text-green-800'
                                        : 'text-red-800'
                                        }`}>
                                        {studentStatus === 'present' ? 'Present' : 'Absent'}
                                   </span>
                              </div>
                         )}

                         {lectureStatus === 'pending' && (
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                                   <span className="text-amber-800 font-medium text-sm">Pending</span>
                              </div>
                         )}
                    </div>
               </div>
          </div>
     )
}

// Enhanced Modal Component
function ModalForSubmitAttendance({ lecture, onClose, onSuccess }) {
     const [processing, setProcessing] = useState("idle");
     const [attendanceCode, setAttendanceCode] = useState('');

     const handleSubmit = async (e) => {
          e.preventDefault();
          if (!attendanceCode || attendanceCode.length < 6) {
               toast.error("Please enter a valid 6-digit code");
               return;
          }

          setProcessing("loading");

          try {
               const response = await axios.put(`${import.meta.env.VITE_API_URL}/submit-attendance`, {
                    verificationPin: attendanceCode,
                    subCode: lecture.subCode,
                    classId: lecture.classId,
               }, {
                    withCredentials: true,
               });

               if (response.status === 200) {
                    console.log(response.data);
                    setProcessing("success");
                    toast.success("Successfully marked present!");
                    onSuccess(lecture.subCode);
                    setTimeout(() => {
                         onClose();
                    }, 1000);
               } else if (response.status === 400) {
                    toast.error("Invalid PIN code");
                    setProcessing("error");
               } else if (response.status === 404) {
                    toast.error("Class not found");
                    setProcessing("error");
               }
          } catch (error) {
               console.error("Attendance submission error:", error);
               toast.error("Failed to submit attendance");
               setProcessing("error");
          }

          if (processing !== "success") {
               setTimeout(() => {
                    setProcessing("idle");
                    setAttendanceCode('');
               }, 2000);
          }
     };

     return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-maroon-100 transform transition-all duration-300 scale-100">
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-maroon-600 to-maroon-700 text-white p-6 rounded-t-2xl">
                         <div className="flex justify-between items-center">
                              <div>
                                   <h2 className="text-xl font-bold">Mark Attendance</h2>
                                   <p className="text-maroon-100 text-sm">Enter the code from your teacher</p>
                              </div>
                              <button
                                   onClick={onClose}
                                   className="text-maroon-200 hover:text-white bg-maroon-500/30 hover:bg-maroon-500/50 rounded-lg p-1 transition-colors"
                              >
                                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                   </svg>
                              </button>
                         </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6">
                         {/* Subject Info */}
                         <div className="bg-maroon-50 rounded-xl p-4 mb-6 border border-maroon-100">
                              <h3 className="text-lg font-bold text-maroon-800 mb-1">{lecture.subName}</h3>
                              <div className="flex items-center justify-between text-sm">
                                   <span className="text-maroon-600 font-mono">{lecture.subCode}</span>
                                   <span className="text-maroon-600">{lecture.teacher}</span>
                              </div>
                         </div>

                         {/* Form */}
                         <form onSubmit={handleSubmit}>
                              <div className="mb-6">
                                   <label className="block text-sm font-semibold text-maroon-800 mb-3">
                                        Attendance PIN
                                   </label>
                                   <input
                                        type="number"
                                        value={attendanceCode}
                                        onChange={(e) => setAttendanceCode(e.target.value)}
                                        className="w-full px-4 py-3 text-center text-xl font-mono border-2 border-maroon-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 bg-white"
                                        placeholder="000000"
                                        maxLength="6"
                                        disabled={processing === "loading"}
                                        required
                                   />
                                   <p className="text-xs text-slate-500 text-center mt-2">
                                        Enter the 6-digit code shown by your teacher
                                   </p>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-3">
                                   <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 text-maroon-700 bg-maroon-100 hover:bg-maroon-200 rounded-xl font-semibold transition-colors"
                                        disabled={processing === "loading"}
                                   >
                                        Cancel
                                   </button>
                                   <button
                                        type="submit"
                                        disabled={processing === "loading" || !attendanceCode}
                                        className={`flex-1 px-4 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${processing === "idle" && attendanceCode
                                             ? "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                             : processing === "loading"
                                                  ? "bg-gradient-to-r from-blue-500 to-blue-600 cursor-not-allowed"
                                                  : processing === "success"
                                                       ? "bg-gradient-to-r from-green-600 to-green-700"
                                                       : processing === "error"
                                                            ? "bg-gradient-to-r from-red-500 to-red-600"
                                                            : "bg-slate-300 cursor-not-allowed"
                                             }`}
                                   >
                                        {processing === "loading" && (
                                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        )}

                                        {processing === "idle" && (
                                             <>
                                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                  </svg>
                                                  Submit
                                             </>
                                        )}
                                        {processing === "loading" && "Processing..."}
                                        {processing === "success" && (
                                             <>
                                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                  </svg>
                                                  Success!
                                             </>
                                        )}
                                        {processing === "error" && "Try Again"}
                                   </button>
                              </div>
                         </form>
                    </div>
               </div>
          </div>
     );
}

// // module for submitting attendance student side
// import axios from 'axios';
// import React, { useState, useContext, useEffect } from 'react'
// import toast from 'react-hot-toast';
// import Cookies from 'js-cookie';
// import { Outlet } from 'react-router-dom';
// import FullPageSpinner from '../../animation-components/spinner';
// import { time } from 'motion/react-client';

// export default function SubmitAttendance() {
//      const [showModal, setShowModal] = useState(false);
//      const [selectedLecture, setSelectedLecture] = useState(null);
//      const [lecturesData, setLecturesData] = useState(null);
//      const [subjectsData, setSubjectsData] = useState(null);
//      const [lecturesDataLoading, setLecturesDataIsLoading] = useState(false);
//      useEffect(() => {
//           // setLecturesDataIsLoading(true);
//           async function fetchLectures() {
//                console.log("Fetching lectures... for student");
//                try {
//                     const response = await axios.get(`${import.meta.env.VITE_API_URL}/student-lectures`, {
//                          withCredentials: true,
//                     });
//                     if (response.data) {
//                          console.log("lectures information fetched");
//                          console.log(response.data);
//                          setLecturesData(response.data?.lectureObject)
//                          setSubjectsData(response.data?.lectureObject?.subjectsData)
//                     } else {
//                          console.log("No lecture information found");
//                     }
//                } catch (error) {
//                     console.log(error);
//                     return;
//                }
//           }
//           fetchLectures();
//      }, []);

//      const handleOpenModal = (lecture) => {
//           setSelectedLecture(lecture);
//           setShowModal(true);
//      };

//      const handleCloseModal = () => {
//           setShowModal(false);
//      };
//      if (!lecturesData || !subjectsData) return <FullPageSpinner message={"Loading lectures data..."} />;
//      return (
//           // px-4 sm:px-0 md:px-6 lg:px-10
//           < div className='min-h-screen p-0 md:p-5 lg:p-10 flex justify-center bg-white font-mono' >
//                {lecturesData &&
//                     <div className="bg-gray-100 rounded-2xl">
//                          {/* h-fit w-full max-w-8xl my-8 md:m-20 */}
//                          <div className="heading grid place-items-center border-b-2">
//                               <h1 className='text-xl sm:text-2xl md:text-3xl px-4 md:px-10 py-3 md:py-5 font-medium text-cyan-950'>
//                                    Submit Attendance
//                               </h1>
//                          </div>
//                          <div className=''>
//                               <div className="LectureContainer">
//                                    <div className='mx-4 sm:mx-8 md:mx-16 lg:mx-40 rounded-br-2xl p-2 md:p-4 m-2 rounded-tl-2xl'>
//                                         <div className='flex flex-wrap justify-center text-base sm:text-xl md:text-2xl'>
//                                              <p className='mx-1 sm:mx-3 md:mx-5 lg:mx-10'>{lecturesData.department}</p>
//                                              <span></span>
//                                              <p>{lecturesData.year}</p>
//                                              <span> / </span>
//                                              <p>{lecturesData.branch}</p>
//                                         </div>
//                                    </div>
//                                    <div className='flex justify-start text-lg sm:text-xl md:text-2xl px-4 sm:px-6 md:px-10'>
//                                         <h2>Your All Lecture</h2>
//                                    </div>
//                                    <div className='flex justify-center'>
//                                         <div className='flex flex-wrap justify-center scrollbar-hide p-2 md:p-5 w-full'>
//                                              {subjectsData?.map((item, index) => (
//                                                   <LectureCard
//                                                        key={index}
//                                                        item={item}
//                                                        onClick={() => handleOpenModal(item)}
//                                                   />
//                                              ))}
//                                         </div>
//                                    </div>
//                               </div>
//                          </div>
//                     </div>
//                }

//                {/* Modal Component */}
//                {
//                     showModal && selectedLecture && (
//                          <ModalForSubmitAttendace
//                               lecture={selectedLecture}
//                               subjectsData={subjectsData}
//                               setSubjectsData={setSubjectsData}
//                               onClose={handleCloseModal}
//                          />
//                     )
//                }
//                <Outlet></Outlet>
//           </ div>

//      )
// }
// // item hold subjects info
// function LectureCard({ item, onClick }) {
//      console.log(item);
//      const studentStatus = item.studentStatus;
//      const lectureStatus = item.status;
//      const styles = {
//           pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
//           running: "bg-blue-100 text-blue-700 border border-blue-300",
//           complete: "bg-green-100 text-green-700 border border-green-300",
//      };
//      const statusStyle = studentStatus === "present" ? `border-green-500` : studentStatus === "absent" ? `border-red-500` : `border-yellow-500`
//      return (
//           <div className={`singalCard md:min-w-52 min-h-40 w-full min-w-52 md:w-64 my-2 md:my-3 mx-1 md:mx-2 p-3 md:p-5 border-t-4 border-[1.5px] ${statusStyle} shadow-md shadow-gray-700 rounded-2xl flex flex-col hover:-translate-y-2 hover:scale-105 duration-200 transform-gpu will-change-transform`}>
//                <div className="details flex flex-col cursor-pointer text-sm md:text-[15px] font-medium flex-grow">
//                     <div className="min-w-40 p-0 m-0">
//                          <p className="hover:bg-indigo-400 rounded-2xl px-1 break-words">
//                               {item.subName}
//                          </p>
//                          <span className="whitespace-nowrap p-1 rounded-2xl">({item.subCode})</span>
//                          <p className="text-xs md:text-[14px]">{item.teacher}</p>
//                     </div>
//                </div>
//                <div className='flex'>
//                     <p className={`status text-center rounded-4xl border-[1.5px] ${styles[lectureStatus]}`}>{lectureStatus}</p>
//                     <h3>
//                          {
//                               lectureStatus == "running" ? (studentStatus == "present" ? (
//                                    <div>✅ Present</div>) : (<button
//                                         type="button"
//                                         onClick={onClick}
//                                         className="text-[10px] sm:text-xs rounded-2xl hover:bg-amber-200 p-1 sm:p-2 m-1 sm:m-2 bg-cyan-300 cursor-pointer mt-auto"
//                                    >
//                                         Mark as Present
//                                    </button>)
//                               ) : null
//                          }
//                          {
//                               lectureStatus == "complete" ? (studentStatus == "present" ? (<div>✅ Present</div>) : (<div>❌ Absent</div>)) : null
//                          }
//                     </h3>

//                </div>
//           </div>
//      )
// }
// // lecture stored class details
// // profileData of student
// //mainObject stored lecture data
// function ModalForSubmitAttendace({ lecture, onClose, setSubjectsData, subjectsData }) {
//      const [processing, setProcessing] = useState("idle"); // idle, loading, success, error
//      const [attendanceCode, setAttendanceCode] = useState('');
//      const handleSubmit = async (e) => {
//           e.preventDefault();
//           console.log(attendanceCode);
//           setProcessing("loading");
//           const response = await axios.put(`${import.meta.env.VITE_API_URL}/submit-attendance`, {
//                verificationPin: attendanceCode,
//                subCode: lecture.subCode,
//                classId: lecture.classId,
//           }, {
//                withCredentials: true,
//           });
//           if (response.status === 200) {
//                console.log(response.data);
//                // alert(response.data.message);
//                setSubjectsData(subjectsData => {
//                     const updated = subjectsData.map(el =>
//                          el.subCode === lecture.subCode
//                               ? { ...el, studentStatus: "present" }
//                               : el
//                     );
//                     console.log("Updated array:", updated);
//                     return updated;
//                });
//                setProcessing("success");
//                toast.success("Successfully marked as present your attendance")
//           } else if (response.status === 400) {
//                toast.error("Wrong Pin")
//                setProcessing("error");
//                console.log("Wrong Pin");
//           } else if (response.status === 404) {
//                // toast.error("server Not Found")
//                setProcessing("error");
//                setAttendanceCode('')
//                setTimeout(() => {
//                     setProcessing("idle");
//                }, 2000)
//           }

//           setProcessing(false)
//           onClose();
//           // Close the modal after submission
//      };
//      // if (processing) return <FullPageSpinner message={"Submitting attendance..."} />;
//      return (
//           <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
//                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
//                     <div className="flex justify-between items-center mb-4">
//                          <h2 className="text-xl font-bold text-gray-800">Mark Attendance</h2>
//                          <button
//                               onClick={onClose}
//                               className="text-gray-500 hover:text-gray-700"
//                          >
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                               </svg>
//                          </button>
//                     </div>

//                     <div className="mb-4">
//                          <h3 className="text-lg font-semibold text-indigo-600">{lecture.subName}</h3>
//                          {/* <p className="text-gray-600">Code: {lecture.code}</p> */}
//                          <p className="text-gray-600">Teacher: {lecture.teacher}</p>
//                     </div>

//                     <form onSubmit={handleSubmit}>
//                          <div className="mb-4">
//                               <label htmlFor="attendanceCode" className="block text-sm font-medium text-gray-700 mb-1">
//                                    Enter Attendance Code
//                               </label>
//                               <input
//                                    type="number"
//                                    id="attendanceCode"
//                                    value={attendanceCode}
//                                    onChange={(e) => setAttendanceCode(e.target.value)}
//                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                    placeholder="Enter the code provided by your teacher"
//                                    required
//                               />
//                          </div>

//                          <div className="flex justify-end space-x-2">
//                               <button
//                                    type="button"
//                                    onClick={onClose}
//                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
//                               >
//                                    Cancel
//                               </button>
//                               <button
//                                    type='submit'
//                                    disabled={processing === "loading"}
//                                    className={`
//         flex items-center justify-center gap-2 px-6 py-2 rounded-2xl font-semibold text-white shadow-md transition
//         ${processing === "idle" && "bg-blue-600 hover:bg-blue-700"}
//         ${processing === "loading" && "bg-gray-400 cursor-not-allowed"}
//         ${processing === "success" && "bg-green-600"}
//         ${processing === "error" && "bg-red-600"}
//       `}
//                               >
//                                    {processing === "processing" && (
//                                         <span
//                                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
//                                         ></span>
//                                    )}

//                                    {processing === "idle" && "Submit"}
//                                    {processing === "loading" && "Processing..."}
//                                    {processing === "success" && "✅ Success"}
//                                    {processing === "error" && "❌ Error"}
//                               </button>
//                          </div>
//                     </form>
//                </div>
//           </div>
//      );
// }