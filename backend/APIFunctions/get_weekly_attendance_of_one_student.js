import mongoose from 'mongoose';
import AttendanceSchema from '../schema/AttendanceSchema.js'

// OPTIMIZED QUERY: Get Weekly Attendance
// ============================================

// Query for student's weekly attendance (SUPER FAST):
// const queryHybridStructure = async (studentUsername, startDate, endDate) => {
//      // No $unwind needed! Direct query on indexed field
//      return await db.collection('studentAttendance').find({
//           studentUsername: studentUsername,  // ← Index hit (instant)
//           date: { $gte: startDate, $lte: endDate }  // ← Index hit (instant)
//      }).sort({ date: -1 }).toArray();
// };



// const getWeeklyAttendanceOptimized = async (studentUsername, startDate, endDate) => {
//      console.time('Query Time');

//      // Direct query with index - NO aggregation needed!
//      const attendanceRecords = await StudentAttendance
//           .find({
//                studentUsername: studentUsername,
//                date: { $gte: new Date(startDate), $lte: new Date(endDate) }
//           })
//           .sort({ date: 1 })
//           .lean()  // Returns plain JS objects (faster)
//           .exec();

//      console.timeEnd('Query Time');
//      // Output: Query Time: 15ms

//      // Group by date in JavaScript (fast since already filtered)
//      const groupedByDate = {};
//      attendanceRecords.forEach(record => {
//           const dateKey = record.date.toISOString().split('T')[0];
//           if (!groupedByDate[dateKey]) {
//                groupedByDate[dateKey] = { date: dateKey, lectures: [] };
//           }
//           groupedByDate[dateKey].lectures.push(record);
//      });

//      // Calculate stats
//      const days = Object.values(groupedByDate).map(day => {
//           const present = day.lectures.filter(l => l.status === 'present').length;
//           const absent = day.lectures.filter(l => l.status === 'absent').length;
//           return {
//                ...day,
//                stats: {
//                     total: day.lectures.length,
//                     present,
//                     absent,
//                     percentage: Math.round((present / day.lectures.length) * 100)
//                }
//           };
//      });

//      return days;
// };



// ALTERNATIVE: More Efficient with $unwind
const getStudentAttendanceWithUnwind = async (req, res) => {
  let studentUsername = req.params.studentUsername;
  console.log(studentUsername);

  if (!studentUsername) {
    return res.status(401).json({ message: "all fields are required" })
  }
  const {
    department,
    year,
    branch,
    session,
    startDate,
    endDate
  } = req.query;
  const pipeline = [
    // Stage 1: Filter by class only (department, year, branch)
    {
      $match: {
        ...(department && { department }),
        ...(year && { year }),
        ...(branch && { branch }),
        ...(startDate && endDate && {
          date: { $gte: startDate, $lte: endDate }
        })
      }
    },
    // Stage 2: Unwind record (unwind = array ko item–item me todna)
    {
      $unwind: {
        path: '$record',
        preserveNullAndEmptyArrays: true  // <-- IMPORTANT
      }
    },
    // Stage 3: Add status (absent/present)
    {
      $addFields: {
        status: {
          $cond: [
            { $eq: ['$record.username', studentUsername] },
            "present",    // student mila → present
            "absent"      // student nahi mila → absent
          ]
        }
      }
    },
    // Stage 4: Final projection (projection = kya fields bhejni)
    {
      $project: {
        _id: 0,
        date: 1,
        subCode: 1,
        subName: 1,
        status: 1
      }
    },
    // Stage 5: Sort result (sort = क्रमबद्ध करना)
    {
      $sort: { date: -1 }
    }
  ];
  console.log("getStudentAttendanceWithUnwind fun run ");
  const result = await AttendanceSchema.aggregate(pipeline);

  res.status(200).json(
    {
      success: true,
      count: result.length,
      data: result
    }
  )
};


const fullYearMonthlyRecord = async (req, res) => {
  const {
    department,
    year,
    branch,
    session,
    startDate,
    endDate
  } = req.query;
  const { username } = req.params;

  const pipeline = [
    {
      $match: {
        ...(department && { department }),
        ...(year && { year }),
        ...(branch && { branch }),
        ...(startDate && endDate && {
          date: { $gte: startDate, $lte: endDate }
        })
      }
    },
    {
      $unwind: {
        path: '$record',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        status: {
          $cond: [
            { $eq: ['$record.username', studentUsername] },
            "present",
            "absent"
          ]
        }
      }
    },
    {
      $project: {
        _id: 0,
        date: 1,
        status: 1
      }
    },
    {
      $sort: { date: -1 }
    }
  ];

  console.log("fullYearMonthlyRecord fun run");

  const result = await AttendanceSchema.aggregate(pipeline);
  res.status(200).json({
    status: true,
    count: result.length,
    data: result,
  })
}
export { getStudentAttendanceWithUnwind };