import React, { useState, useEffect, useContext, lazy } from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import { NavLink, useLocation } from 'react-router-dom';
// const ProfileContext = lazy(require('./All-Provider/profileDataProvider'))
import io from 'socket.io-client'
import toast from 'react-hot-toast'
// const socket = io("http://localhostS:5005")
const socket = io(import.meta.env.VITE_API_URL)

export default function AttendancePage() {
     const [rollNumber, setRollNumber] = useState(""); // to store manually added student rollnumber;
     const [detailsFetched, setDetailsFetched] = useState(false);
     const [presentCurrent, setPresentCurrent] = useState(0); // to store next student roll number;
     // [{ username: 'arpit rathore', enrollment: '0114CS231023', status: true }]
     const [attendanceList, setAttendanceList] = useState([]); // students list that all present
     const [pin, setPin] = useState(); // pin that has to generate by teacher;
     const presentPrevious = 60;// highest number of student present in previous class 
     const location = useLocation(); // to access data shared through state;
     const item = location.state?.item; // data from state
     const item2 = location.state?.item2; // data from state

     const [pin2, setPin2] = useState(); // pin that has to generate by teacher;
     const [status, setStatus] = useState(item2?.status);
     console.log(item2?.pin);
     console.log(item2?.classId);
     const classId = item2?.classId;
     console.log(status);
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
          socket.on("trubaId", handler);
          return () => {
               socket.off("trubaId", handler); // Proper cleanup
          };
     }, []);
     const handleAddStudent = () => {
          // Logic to add student
          if (rollNumber) {
               setRollNumber('');
               setPresentCurrent(prev => prev + 1);
          }
     }
     // useeffect prevent unwanted re renders 
     useEffect(() => {
          if (item2?.pin) setPin2(item2.pin);
     }, [item2?.pin]);

     const token = Cookies.get('token')
     const handleSubmitPin = async () => {
          if (pin < 100000) {
               console.log("length of pin is sort");
               return;
          }
          const bodyData = {
               department: item.department,
               year: item.year,
               branch: item.branch,
               subCode: item2.subCode,
               subName: item2.subName,
               pin: pin,
               teacher: item2.teacher,
               username: item2.username,
          }
          console.log(bodyData);
          const resp = await axios.post(`${import.meta.env.VITE_API_URL}/submit-pin`, bodyData, { headers: { authorization: `Bearer ${token}` } });
          if (resp) {
               console.log(resp.data);
               setPin2(bodyData.pin)
               toast.success("Class is activated")
          } else {
               toast.error("Class have not activated")
          }
     }
     useEffect(() => {
          if (item2.status == "running" && !detailsFetched) {
               console.log("class is running so trying to fetch details");
               const classTitle = {
                    classId: item2?.classId,
               }
               console.log(classTitle);
               try {
                    const fetchAllDetails = async () => {

                         const respo = await axios.get(`${import.meta.env.VITE_API_URL}/running-class-detail`, { headers: { authorization: `Bearer ${token}` }, params: classTitle })
                         console.log("api fetching");
                         if (respo.data) {
                              console.log(respo.data);
                              console.log(respo.data.available.record);
                              setAttendanceList(respo.data.available.record)
                              setPresentCurrent(respo.data.available.record.length)
                              toast.success("runnig class datails fetched")
                         } else {
                              toast.error("runnig class fetching error")
                              console.log("data not found");
                         }
                         setDetailsFetched(true);
                    }
                    fetchAllDetails();
               } catch (error) {
                    toast.error("running class fetching error", error.message)
                    console.log("error form while fetching detail of running class", error);
               }
          }
     }, [])

     const submitRecord = async () => {
          const bodyData = {
               classId: item2?.classId,
          }
          console.log(bodyData);

          console.log("submiting.");
          try {
               const response = await axios.put(`${import.meta.env.VITE_API_URL}/submit-record`, bodyData, { headers: { authorization: `Bearer ${token}` } })
               if (response) {
                    console.log(response.data);
                    toast.success("Class Successfully saved", response.data.message)
               }
          } catch (error) {
               console.log("error during submittin record", error);
               toast.error("Error in saving class");
          }
     }
     // if (profileDataLoading) {
     //      return (<h1>Loading...</h1>)
     // }

     return (//bg-gray-50 from-gray-100 to-gray-200
          <div className='min-h-screen  bg-gradient-to-br '>
               <div className='max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
                    {/* Header */}
                    {/* bg-white */}
                    <div className=' rounded-lg shadow-md p-6 mb-8 border-l-4 border-maroon-700 text-gray-800'>
                         <div className='flex justify-center items-center text-center sm:space-x-2 text-2xl font-bold text-gray-800'>
                              <h1 className="px-2">{item?.year || 'Year'}</h1>
                              <span className='px-2'>/</span>
                              <h1 className='px-2'>{item?.branch || 'Branch'}</h1>
                         </div>
                         <div className='m-3 md:m-5 flex justify-evenly md:text-2xl font-medium'>
                              <h3 className="m-0 md:m-2 px-0 md:px-9">{item2.subName} / {item2.subCode}</h3>
                              {/* <h3 className="m-2 px-3"></h3> */}
                              <h3 className="m-0 md:m-2 px-0 md:px-9">{item2.teacher}</h3>
                         </div>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                         {/* Left Column */}
                         <div className='lg:col-span-1 space-y-6'>
                              {/* PIN Generator bg-white */}
                              <div className=" rounded-lg shadow-md p-6">
                                   <h2 className='text-xl font-semibold text-gray-800 mb-4'>Generate PIN</h2>
                                   {
                                        pin2 ? (
                                             <h1>Pin : {pin2}</h1>
                                        ) : null
                                   }
                                   <div className="flex flex-col space-y-4">
                                        <div className="flex items-center">
                                             <label htmlFor="newPin" className='text-gray-700 font-medium w-20'>PIN</label>
                                             <input
                                                  type="number"
                                                  name="pin"
                                                  id="newPin"
                                                  value={pin}
                                                  onChange={(e) => setPin(e.target.value)}
                                                  maxLength={6}
                                                  className='flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-transparent'
                                             />
                                        </div>
                                        <button
                                             onClick={handleSubmitPin}
                                             className='w-full bg-maroon-700 hover:bg-maroon-800 text-black font-bold py-2 px-4 rounded-lg transition duration-200'>
                                             Generate PIN
                                        </button>
                                   </div>
                              </div>

                              {/* Manual Add Student */}
                              {
                                   true &&
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
                              true &&

                              <div className='lg:col-span-2'>
                                   <div className="bg-white rounded-lg shadow-md p-6">
                                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                                             <div className='flex items-center mb-4 sm:mb-0'>
                                                  <span className="text-gray-700 font-semibold">Total Students:</span>
                                                  <span className="ml-2 bg-gray-200 px-3 py-1 rounded-full text-gray-800 font-bold">{item.totalStudents}</span>
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
                         <div className="submit-attendance">
                              <button className='w-full bg-maroon-700 hover:bg-maroon-800 text-black font-bold py-2 px-4 rounded-lg transition duration-200' type="submit" onClick={() => submitRecord()}>Submit Record</button>
                         </div>
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