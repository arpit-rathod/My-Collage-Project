// /*
// BETTER STRUCTURE:
// ✅ Array of week objects
// ✅ Each week has a unique key (weekStart)
// ✅ Can be indexed and queried efficiently
// ✅ Easy to update/delete/fetch individual weeks
// */

// // const correctWeeklyAttendanceStructure = [
// //   {
// //     weekStart: "2025-11-17",      // ← Primary key (Monday of week)
// //     weekEnd: "2025-11-23",
// //     studentUsername: "0114CS231023",
// //     lectures: [
// //       {
// //         subCode: "CS505",
// //         subName: "Theory of Computation",
// //         date: "2025-11-18",
// //         teacher: "Prof. Narayan",
// //         time: "09:00-10:00",
// //         status: "present"
// //       },
// //       {
// //         subCode: "CS506",
// //         subName: "Database Management",
// //         date: "2025-11-18",
// //         teacher: "Prof. Sharma",
// //         time: "10:00-11:00",
// //         status: "present"
// //       },
// //       {
// //         subCode: "CS507",
// //         subName: "Operating Systems",
// //         date: "2025-11-18",
// //         teacher: "Prof. Kumar",
// //         time: "11:00-12:00",
// //         status: "absent"
// //       },
// //       {
// //         subCode: "CS508",
// //         subName: "Computer Networks",
// //         date: "2025-11-18",
// //         teacher: "Prof. Singh",
// //         time: "14:00-15:00",
// //         status: "present"
// //       },
// //       {
// //         subCode: "CS505",
// //         subName: "Theory of Computation",
// //         date: "2025-11-19",
// //         teacher: "Prof. Narayan",
// //         time: "09:00-10:00",
// //         status: "present"
// //       },
// //       // ... more lectures
// //     ],
// //     stats: {
// //       totalLectures: 20,
// //       present: 18,
// //       absent: 2,
// //       percentage: 90
// //     },
// //     lastUpdated: new Date().toISOString()
// //   },
// //   {
// //     weekStart: "2025-11-24",
// //     weekEnd: "2025-11-30",
// //     studentUsername: "0114CS231023",
// //     lectures: [
// //       {
// //         subCode: "CS505",
// //         subName: "Theory of Computation",
// //         date: "2025-11-24",
// //         teacher: "Prof. Narayan",
// //         time: "09:00-10:00",
// //         status: "present"
// //       },
// //       // ... more lectures
// //     ],
// //     stats: {
// //       totalLectures: 18,
// //       present: 17,
// //       absent: 1,
// //       percentage: 94
// //     },
// //     lastUpdated: new Date().toISOString()
// //   }
// // ];

// // ============================================
// // INDEXEDDB SETUP
// // ============================================

// class AttendanceDB {
//   constructor() {
//     this.dbName = 'StudentAttendanceDB';
//     this.version = 1;
//     this.db = null;
//   }

//   // Initialize IndexedDB
//   async init() {
//     return new Promise((resolve, reject) => {
//       const request = indexedDB.open(this.dbName, this.version);

//       // Create object stores on first run or version upgrade
//       request.onupgradeneeded = (event) => {
//         const db = event.target.result;

//         // Create store for weekly attendance
//         if (!db.objectStoreNames.contains('weeklyAttendance')) {
//           const store = db.createObjectStore('weeklyAttendance', {
//             keyPath: 'weekStart'  // ← Primary key
//           });

//           // Create indexes for efficient queries
//           store.createIndex('studentUsername', 'studentUsername', { unique: false });
//           store.createIndex('weekEnd', 'weekEnd', { unique: false });
//           store.createIndex('lastUpdated', 'lastUpdated', { unique: false });
//         }

//         // Create store for individual lecture records (optional)
//         if (!db.objectStoreNames.contains('lectureRecords')) {
//           const lectureStore = db.createObjectStore('lectureRecords', {
//             keyPath: 'id',
//             autoIncrement: true
//           });

//           lectureStore.createIndex('studentUsername', 'studentUsername', { unique: false });
//           lectureStore.createIndex('date', 'date', { unique: false });
//           lectureStore.createIndex('subCode', 'subCode', { unique: false });
//           lectureStore.createIndex('status', 'status', { unique: false });
//         }
//       };

//       request.onsuccess = (event) => {
//         this.db = event.target.result;
//         console.log('IndexedDB initialized successfully');
//         resolve(this.db);
//       };

//       request.onerror = (event) => {
//         console.error('IndexedDB error:', event.target.error);
//         reject(event.target.error);
//       };
//     });
//   }

//   // ============================================
//   // STORE WEEKLY ATTENDANCE
//   // ============================================

//   async storeWeeklyAttendance(weekData) {
//     return new Promise((resolve, reject) => {
//       const transaction = this.db.transaction(['weeklyAttendance'], 'readwrite');
//       const store = transaction.objectStore('weeklyAttendance');

//       const request = store.put(weekData);  // put = insert or update

//       request.onsuccess = () => {
//         console.log(`Stored week: ${weekData.weekStart}`);
//         resolve(weekData.weekStart);
//       };

//       request.onerror = () => {
//         console.error('Error storing week:', request.error);
//         reject(request.error);
//       };
//     });
//   }

//   // ============================================
//   // GET SPECIFIC WEEK
//   // ============================================

//   async getWeekAttendance(weekStart) {
//     return new Promise((resolve, reject) => {
//       const transaction = this.db.transaction(['weeklyAttendance'], 'readonly');
//       const store = transaction.objectStore('weeklyAttendance');

//       const request = store.get(weekStart);

//       request.onsuccess = () => {
//         if (request.result) {
//           console.log(`Found week: ${weekStart}`);
//           resolve(request.result);
//         } else {
//           console.log(`Week not found: ${weekStart}`);
//           resolve(null);
//         }
//       };

//       request.onerror = () => {
//         console.error('Error fetching week:', request.error);
//         reject(request.error);
//       };
//     });
//   }

//   // ============================================
//   // GET ALL WEEKS FOR A STUDENT
//   // ============================================

//   async getAllWeeksForStudent(studentUsername) {
//     return new Promise((resolve, reject) => {
//       const transaction = this.db.transaction(['weeklyAttendance'], 'readonly');
//       const store = transaction.objectStore('weeklyAttendance');
//       const index = store.index('studentUsername');

//       const request = index.getAll(studentUsername);

//       request.onsuccess = () => {
//         console.log(`Found ${request.result.length} weeks for ${studentUsername}`);
//         resolve(request.result);
//       };

//       request.onerror = () => {
//         console.error('Error fetching weeks:', request.error);
//         reject(request.error);
//       };
//     });
//   }

//   // ============================================
//   // GET WEEKS IN DATE RANGE
//   // ============================================

//   async getWeeksInRange(startDate, endDate) {
//     return new Promise((resolve, reject) => {
//       const transaction = this.db.transaction(['weeklyAttendance'], 'readonly');
//       const store = transaction.objectStore('weeklyAttendance');

//       const request = store.openCursor();
//       const results = [];

//       request.onsuccess = (event) => {
//         const cursor = event.target.result;
//         if (cursor) {
//           const week = cursor.value;
//           // Check if week falls in range
//           if (week.weekStart >= startDate && week.weekStart <= endDate) {
//             results.push(week);
//           }
//           cursor.continue();
//         } else {
//           console.log(`Found ${results.length} weeks in range`);
//           resolve(results);
//         }
//       };

//       request.onerror = () => {
//         reject(request.error);
//       };
//     });
//   }

//   // ============================================
//   // UPDATE WEEK (Add/Update lectures)
//   // ============================================

//   async updateWeekAttendance(weekStart, newLectures) {
//     const existingWeek = await this.getWeekAttendance(weekStart);

//     if (existingWeek) {
//       // Update existing week
//       existingWeek.lectures = [...existingWeek.lectures, ...newLectures];

//       // Recalculate stats
//       const present = existingWeek.lectures.filter(l => l.status === 'present').length;
//       const total = existingWeek.lectures.length;
//       existingWeek.stats = {
//         totalLectures: total,
//         present: present,
//         absent: total - present,
//         percentage: Math.round((present / total) * 100)
//       };
//       existingWeek.lastUpdated = new Date().toISOString();

//       return this.storeWeeklyAttendance(existingWeek);
//     } else {
//       console.error('Week not found');
//       return null;
//     }
//   }

//   // ============================================
//   // DELETE WEEK
//   // ============================================

//   async deleteWeek(weekStart) {
//     return new Promise((resolve, reject) => {
//       const transaction = this.db.transaction(['weeklyAttendance'], 'readwrite');
//       const store = transaction.objectStore('weeklyAttendance');

//       const request = store.delete(weekStart);

//       request.onsuccess = () => {
//         console.log(`Deleted week: ${weekStart}`);
//         resolve(true);
//       };

//       request.onerror = () => {
//         reject(request.error);
//       };
//     });
//   }

//   // ============================================
//   // CLEAR ALL DATA
//   // ============================================

//   async clearAllWeeks() {
//     return new Promise((resolve, reject) => {
//       const transaction = this.db.transaction(['weeklyAttendance'], 'readwrite');
//       const store = transaction.objectStore('weeklyAttendance');

//       const request = store.clear();

//       request.onsuccess = () => {
//         console.log('Cleared all weekly attendance data');
//         resolve(true);
//       };

//       request.onerror = () => {
//         reject(request.error);
//       };
//     });
//   }
// }


// export { AttendanceDB };

// // ============================================
// // KEY POINTS SUMMARY
// // ============================================

// /*
// ✅ CORRECT STRUCTURE:
// - Store as ARRAY of objects
// - Each object has weekStart as PRIMARY KEY
// - Include studentUsername for querying
// - Add stats for quick access
// - Include lastUpdated for cache management

// ✅ BENEFITS:
// - Fast queries by week (O(1) lookup)
// - Can index by student, date, etc.
// - Easy to update individual weeks
// - Efficient storage and retrieval
// - Works offline (PWA ready)

// ✅ WHEN TO USE:
// - Store data when fetched from API
// - Load from IndexedDB before API call (cache-first)
// - Update when new data arrives
// - Clear old data periodically

// ❌ AVOID:
// - Storing as nested objects with dynamic keys
// - Not using indexes
// - Not having a primary key
// - Storing everything as one big object
// */
