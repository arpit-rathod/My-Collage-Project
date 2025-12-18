// // ============================================
// // REACT COMPONENT EXAMPLE
// // ============================================
// // {
// //   weekStart: "2025-11-17",      // ← Primary key (Monday of week)
// //     weekEnd: "2025-11-23",
// //       studentUsername: "0114CS231023",
// //         lectures: [
// //           {
// //             subCode: "CS505",
// //             subName: "Theory of Computation",
// //             date: "2025-11-18",
// //             teacher: "Prof. Narayan",
// //             time: "09:00-10:00",
// //             status: "present"
// //           },
// //           {
// //             subCode: "CS506",
// //             subName: "Database Management",
// //             date: "2025-11-18",
// //             teacher: "Prof. Sharma",
// //             time: "10:00-11:00",
// //             status: "present"
// //           },
// //           {
// //             subCode: "CS507",
// //             subName: "Operating Systems",
// //             date: "2025-11-18",
// //             teacher: "Prof. Kumar",
// //             time: "11:00-12:00",
// //             status: "absent"
// //           },
// //           {
// //             subCode: "CS508",
// //             subName: "Computer Networks",
// //             date: "2025-11-18",
// //             teacher: "Prof. Singh",
// //             time: "14:00-15:00",
// //             status: "present"
// //           },
// //           {
// //             subCode: "CS505",
// //             subName: "Theory of Computation",
// //             date: "2025-11-19",
// //             teacher: "Prof. Narayan",
// //             time: "09:00-10:00",
// //             status: "present"
// //           },
// //           // ... more lectures
// //         ],
// //           stats: {
// //     totalLectures: 20,
// //       present: 18,
// //         absent: 2,
// //           percentage: 90
// //   },
// //   lastUpdated: new Date().toISOString()
// // },
// import React, { useState, useEffect } from 'react';
// import { AttendanceDB } from '../db.js'
// import axios from 'axios'
// // ============================================
// // USAGE EXAMPLES
// // ============================================

// // Example 1: Store a week
// const storeWeekExample = async () => {
//   const db = new AttendanceDB();
//   await db.init();

//   const weekData = {
//     weekStart: "2025-11-17",
//     weekEnd: "2025-11-23",
//     studentUsername: "0114CS231023",
//     lectures: [
//       {
//         subCode: "CS505",
//         subName: "Theory of Computation",
//         date: "2025-11-18",
//         teacher: "Prof. Narayan",
//         time: "09:00-10:00",
//         status: "present"
//       },
//       // ... more lectures
//     ],
//     stats: { totalLectures: 20, present: 18, absent: 2, percentage: 90 },
//     lastUpdated: new Date().toISOString()
//   };

//   await db.storeWeeklyAttendance(weekData);
// };
// // storeWeekExample();
// // Example 2: Get a specific week
// const getWeekExample = async () => {
//   const db = new AttendanceDB();
//   await db.init();

//   const week = await db.getWeekAttendance('2025-11-17');
//   console.log(week);
//   // Use in React state: setCurrentWeek(week);
// };

// // Example 3: Get all weeks
// const getAllWeeksExample = async () => {
//   const db = new AttendanceDB();
//   await db.init();

//   const weeks = await db.getAllWeeksForStudent('0114CS231023');
//   console.log(weeks);
//   // Use in React state: setAllWeeks(weeks);
// };
// const db = new AttendanceDB();
// await db.init();
// const calculateWeekEnd = (weekStart) => {
//   const date = new Date(weekStart);
//   date.setDate(date.getDate() + 6);
//   return date.toISOString().split('T')[0];
// };

// function WeeklyAttendanceComponent() {

//   const now = new Date('2025-09-15');
//   const onlyDate = now.toLocaleDateString("en-CA", {
//     timeZone: "Asia/Kolkata"  // Force IST (IST को मजबूरी से इस्तेमाल करो)
//   });
//   let studentUsername = '0114CS231023';
//   const [currentWeek, setCurrentWeek] = useState(null);
//   const [allWeeks, setAllWeeks] = useState([]);
//   const [selectedWeekStart, setSelectedWeekStart] = useState(onlyDate);
//   const [db, setDb] = useState(null);
//   // ${ toDayDate.getFullYear() - toDayDate.getMonth() - toDayDate.getDate() }
//   const getSelectedWeekData = async () => {
//     let selectDateStr = new Date(selectedWeekStart);
//     let endDateStr = selectDateStr.setDate(selectDateStr.getDate() + 5);
//     let endDate = new Date(endDateStr).toLocaleDateString("en-CA", {
//       timeZone: "Asia/Kolkata"  // Force IST (IST को मजबूरी से इस्तेमाल करो)
//     });
//     console.log(endDate);
//     const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/student-attendance/${studentUsername}`, {
//       withCredentials: true,
//       params: {
//         startDate: selectedWeekStart,
//         endDate: endDate,
//         // startDate: "2025-11-23",
//         // endDate: "2025-09-22"
//       },
//     });
//     console.log(response.data);
//     const weekData = {
//       weekStart: selectedWeekStart,
//       weekEnd: calculateWeekEnd(selectedWeekStart),
//       studentUsername: '0114CS231023',
//       lectures: response.data.data,
//       stats: null,
//       lastUpdated: new Date().toISOString()
//     };
//     setCurrentWeek(weekData);
//     await db.storeWeeklyAttendance(weekData);
//   }
//   useEffect(() => {
//     getSelectedWeekData();
//   }, [selectedWeekStart])

//   // Store new week data from API
//   const fetchAndStoreWeek = async (weekStart) => {
//     try {
//       // Fetch from API
//       // const response = await fetch(`/api/attendance/weekly?weekStart=${weekStart}`);
//       // const data = await response.json();
//       // Transform to correct structure
//       // Store in IndexedDB
//       // Update state
//       // Refresh all weeks list
//       const weeks = await db.getAllWeeksForStudent('0114CS231023');
//       setAllWeeks(weeks);
//     } catch (error) {
//       console.error('Error fetching week:', error);
//     }
//   };
//   // Initialize IndexedDB on component mount
//   useEffect(() => {
//     const initDB = async () => {
//       const attendanceDB = new AttendanceDB();
//       await attendanceDB.init();
//       setDb(attendanceDB);

//       // Load all weeks
//       const weeks = await attendanceDB.getAllWeeksForStudent('0114CS231023');
//       setAllWeeks(weeks);
//     };

//     initDB();
//   }, []);

//   // Load specific week when user selects it
//   const loadWeek = async (weekStart) => {
//     if (db) {
//       const weekData = await db.getWeekAttendance(weekStart);
//       setCurrentWeek(weekData);
//       setSelectedWeekStart(weekStart);
//     }
//   };


//   // Helper to calculate week end date


//   // Group lectures by date for display
//   const groupLecturesByDate = (lectures) => {
//     const grouped = {};
//     lectures.forEach(lecture => {
//       if (!grouped[lecture.date]) {
//         grouped[lecture.date] = [];
//       }
//       grouped[lecture.date].push(lecture);
//     });
//     return grouped;
//   };

//   if (!currentWeek) {
//     return <div>Loading...</div>;
//   }

//   const lecturesByDate = groupLecturesByDate(currentWeek.lectures);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Weekly Attendance</h1>

//       {/* Week Selector */}
//       <div className="mb-6">
//         <label className="block mb-2">Select Week:</label>
//         <select
//           value={selectedWeekStart}
//           onChange={(e) => loadWeek(e.target.value)}
//           className="border rounded px-3 py-2"
//         >
//           {allWeeks.map(week => (
//             <option key={week.weekStart} value={week.weekStart}>
//               Week of {week.weekStart} ({week.stats?.percentage}%)
//             </option>
//           ))}
//         </select>

//         <button
//           onClick={() => fetchAndStoreWeek('2025-12-01')}
//           className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Fetch New Week
//         </button>
//       </div>

//       {/* Week Stats */}
//       <div className="bg-gray-100 p-4 rounded mb-6">
//         <h2 className="text-lg font-semibold mb-2">
//           Week: {currentWeek.weekStart} to {currentWeek.weekEnd}
//         </h2>
//         <div className="flex gap-4">
//           <div>Total: {currentWeek.stats?.totalLectures}</div>
//           <div className="text-green-600">Present: {currentWeek.stats?.present}</div>
//           <div className="text-red-600">Absent: {currentWeek.stats?.absent}</div>
//           <div className="font-bold">Percentage: {currentWeek.stats?.percentage}%</div>
//         </div>
//       </div>

//       {/* Lectures by Date */}
//       {Object.entries(lecturesByDate).map(([date, lectures]) => (
//         <div key={date} className="mb-6">
//           <h3 className="font-semibold text-lg mb-3">{date}</h3>
//           <div className="space-y-2">
//             {lectures.map((lecture, idx) => (
//               <div
//                 key={idx}
//                 className={`p-3 rounded flex justify-between ${lecture.status === 'present' ? 'bg-green-100' : 'bg-red-100'
//                   }`}
//               >
//                 <div>
//                   <div className="font-semibold">{lecture.subName}</div>
//                   <div className="text-sm text-gray-600">
//                     {lecture.subCode} • {lecture.teacher}
//                   </div>
//                 </div>
//                 <div className={`font-semibold ${lecture.status === 'present' ? 'text-green-700' : 'text-red-700'
//                   }`}>
//                   {lecture.status.toUpperCase()}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export { WeeklyAttendanceComponent };
