// module for submitting attendance student side
import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react'
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { Outlet } from 'react-router-dom';
import FullPageSpinner from '../../animation-components/spinner';
import { time } from 'motion/react-client';

export default function SubmitAttendance() {
     const [showModal, setShowModal] = useState(false);
     const [selectedLecture, setSelectedLecture] = useState(null);
     const [lecturesData, setLecturesData] = useState(null);
     const [subjectsData, setSubjectsData] = useState(null);
     const [lecturesDataLoading, setLecturesDataIsLoading] = useState(false);
     useEffect(() => {
          // setLecturesDataIsLoading(true);
          async function fetchLectures() {
               console.log("Fetching lectures... for student");
               try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/student-lectures`, {
                         withCredentials: true,
                    });
                    if (response.data) {
                         console.log("lectures information fetched");
                         console.log(response.data);
                         setLecturesData(response.data?.lectureObject)
                         setSubjectsData(response.data?.lectureObject?.subjectsData)
                    } else {
                         console.log("No lecture information found");
                    }
               } catch (error) {
                    console.log(error);
                    return;
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
     };
     if (!lecturesData || !subjectsData) return <FullPageSpinner message={"Loading lectures data..."} />;
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
                                             {subjectsData?.map((item, index) => (
                                                  <LectureCard
                                                       key={index}
                                                       item={item}
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
                         <ModalForSubmitAttendace
                              lecture={selectedLecture}
                              subjectsData={subjectsData}
                              setSubjectsData={setSubjectsData}
                              onClose={handleCloseModal}
                         />
                    )
               }
               <Outlet></Outlet>
          </ div>

     )
}
// item hold subjects info
function LectureCard({ item, onClick }) {
     console.log(item);
     const studentStatus = item.studentStatus;
     const lectureStatus = item.status;
     const styles = {
          pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
          running: "bg-blue-100 text-blue-700 border border-blue-300",
          complete: "bg-green-100 text-green-700 border border-green-300",
     };
     const statusStyle = studentStatus === "Present" ? `border-green-500` : studentStatus === "Absent" ? `border-red-500` : `border-yellow-500`
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
               <div className='flex'>
                    <p className={`status text-center rounded-4xl border-[1.5px] ${styles[lectureStatus]}`}>{lectureStatus}</p>
                    <h3>
                         {
                              lectureStatus == "running" ? (studentStatus == "present" ? (
                                   <div>✅ Present</div>) : (<button
                                        type="button"
                                        onClick={onClick}
                                        className="text-[10px] sm:text-xs rounded-2xl hover:bg-amber-200 p-1 sm:p-2 m-1 sm:m-2 bg-cyan-300 cursor-pointer mt-auto"
                                   >
                                        Mark as Present
                                   </button>)
                              ) : null
                         }
                         {
                              lectureStatus == "complete" ? (studentStatus == "present" ? (<div>✅ Present</div>) : (<div>❌ Absent</div>)) : null
                         }
                    </h3>

               </div>
          </div>
     )
}
// lecture stored class details
// profileData of student
//mainObject stored lecture data
function ModalForSubmitAttendace({ lecture, onClose, setSubjectsData, subjectsData }) {
     const [processing, setProcessing] = useState("idle"); // idle, loading, success, error
     const [attendanceCode, setAttendanceCode] = useState('');
     const handleSubmit = async (e) => {
          e.preventDefault();
          console.log(attendanceCode);
          setProcessing("loading");
          const response = await axios.put(`${import.meta.env.VITE_API_URL}/submit-attendance`, {
               verificationPin: attendanceCode,
               subCode: lecture.subCode,
               classId: lecture.classId,
          }, {
               withCredentials: true,
          });
          if (response.status === 200) {
               console.log(response.data);
               // alert(response.data.message);
               setSubjectsData(subjectsData => {
                    const updated = subjectsData.map(el =>
                         el.subCode === lecture.subCode
                              ? { ...el, studentStatus: "present" }
                              : el
                    );
                    console.log("Updated array:", updated);
                    return updated;
               });
               setProcessing("success");
               toast.success("Successfully marked as present your attendance")
          } else if (response.status === 400) {
               toast.error("Wrong Pin")
               setProcessing("error");
               console.log("Wrong Pin");
          } else if (response.status === 404) {
               // toast.error("server Not Found")
               setProcessing("error");
               setAttendanceCode('')
               setTimeout(() => {
                    setProcessing("idle");
               }, 2000)
          }

          setProcessing(false)
          onClose();
          // Close the modal after submission
     };
     // if (processing) return <FullPageSpinner message={"Submitting attendance..."} />;
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
                                   type='submit'
                                   disabled={processing === "loading"}
                                   className={`
        flex items-center justify-center gap-2 px-6 py-2 rounded-2xl font-semibold text-white shadow-md transition
        ${processing === "idle" && "bg-blue-600 hover:bg-blue-700"}
        ${processing === "loading" && "bg-gray-400 cursor-not-allowed"}
        ${processing === "success" && "bg-green-600"}
        ${processing === "error" && "bg-red-600"}
      `}
                              >
                                   {processing === "processing" && (
                                        <span
                                             className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                                        ></span>
                                   )}

                                   {processing === "idle" && "Submit"}
                                   {processing === "loading" && "Processing..."}
                                   {processing === "success" && "✅ Success"}
                                   {processing === "error" && "❌ Error"}
                              </button>
                         </div>
                    </form>
               </div>
          </div>
     );
}