import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import helmet from "helmet";
import hpp from 'hpp';
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';

import DBConnection from "./DataBaseConnection.js";
import BranchLectureInfoSchema from "./StudentsFiles/BranchLectureInfoSchema.js";
import { User } from "./UserSchema.js";

import StudentGroupSchema from "./schema/studentgroupsSchema.js";
import router from "./Routes.js";
import userRouter from './userRegisterDemo.js';
import { pageAccessRouter } from "./HandlePageAccess/first.js";
import adminHierarchyRoutes from './adminEndPoints/AdminRouter.js';
import { startLectureResetCron } from './utils/ResetLectureStatus.js';

dotenv.config();
const app = express();
const server = http.createServer(app);
// import { io } from '../index.js';
// import BranchLectureInfoSchema from '../StudentsFiles/BranchLectureInfoSchema';
import { addUserSocket, removeUserSocket, getUserSockets } from './socket-modules/userSocketStore.js';
import AttendanceSchema from './schema/AttendanceSchema.js';
// import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
import cookie from 'cookie'


DBConnection();
// Security Middleware (Modern best practices)
// Rate limiting
// const limiter = rateLimit({
//      windowMs: 10 * 60 * 1000, // 10 minutes
//      max: 100 // limit each IP to 100 requests per windowMs
// });


// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
// Data sanitization
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Clean user input from malicious HTML
app.use(hpp()); // Prevent HTTP Parameter Pollution
// Node.js/Express example
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', "http://localhost:5173"]);
//   next();
// });
// only use manually (app.use) or cors to allow origin 
if (process.env.NODE_ENV === 'development') {
  console.log("development is detected in index js file ");
  app.use(cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://10.195.223.69:5173",
        "http://172.19.144.1:5173",
        "http://10.195.223.69:5173"
      ];
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"]
  }));
} else {
  console.log("production is detected in index js file ");
  app.use(cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://my-collage-project-frontend.onrender.com",
        "http://localhost:5173",
        "http://10.195.223.69:5173",
        "http://172.19.144.1:5173"
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With", "Accept"]
  }));
};
const io = new Server(server, {
  cors: {
    origin: [
      "https://my-collage-project-frontend.onrender.com", "http://localhost:5173", "http://10.195.223.69:5173", "http://172.19.144.1:5173"
    ], // Allow all origins in development
    methods: ["GET", "POST"],
    credentials: true,
    allowEIO3: true
  },
});

// const io = new Server(server, {
//      cors: {
//           origin: [
//                "https://my-collage-project-frontend.onrender.com",
//                "http://localhost:5173",
//           ],
//           methods: ["GET", "POST"],
//           credentials: true,
//      },
// });
// // Database connection

// // CORS
// const allowedOrigins = [
//      "https://my-collage-project-frontend.onrender.com",
//      "http://localhost:5173",
// ];
// app.use(
//      cors({
//           origin: function (origin, callback) {
//                if (!origin || allowedOrigins.includes(origin)) {
//                     callback(null, true);
//                } else {
//                     callback(new Error("Not allowed by CORS"));
//                }
//           },
//           credentials: true,
//           methods: ["GET", "POST", "PUT", "DELETE"],
//           allowedHeaders: ["Content-Type", "Authorization"],
//      })
// );

// Helmet for security
// export const registrationLimiter = rateLimit({
//      windowMs: 15 * 60 * 1000, // 15 minutes
//      max: 5, // Limit each IP to 5 registration attempts per windowMs
//      message: {
//           error: 'Too many registration attempts, please try again later.',
//           retryAfter: '15 minutes'
//      },
//      standardHeaders: true,
//      legacyHeaders: false,
// });
// app.use(registrationLimiter);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'"],
      connectSrc: [
        "'self'",
        "https://my-collage-project-frontend.onrender.com",
      ],
    },
  })
);
app.use(bodyParser.json());
app.use(express.json())
app.use(cookieParser()); // This allows req.cookies to work


// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
// Error handling middleware (must be last)
app.use(errorHandler);
// function to fillter available student usernames

app.use(userRouter); // Use the router for all user routes
app.use(router); // Use the router for all registration routes
app.use('/api', pageAccessRouter); // Use the router for all access routes
app.use('/api/admin', adminHierarchyRoutes);
startLectureResetCron(); // Auto midnight resets

// Handle undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});
async function addStudentAttendaceManually(userId, bodyData, callback) {
  try {
    let lectureDetailsDoc = await BranchLectureInfoSchema.aggregate([
      { "$match": { "_id": new mongoose.Types.ObjectId(bodyData.docId) } },
      {
        "$addFields": {
          subjectsData: {
            $filter: {
              input: "$subjectsData",
              as: "sub",
              cond: { $eq: ["$$sub.subCode", bodyData.subCode] }
            }
          },
          student: {
            $filter: {
              input: "$students",
              as: "stu",
              cond: { $eq: ["$$stu.username", bodyData.studentUsername] }
            }
          }
        }
      }
    ]);
    console.log("add Student Attendace Manually filter BY document");
    // console.log(" lectureDetailsDoc ", lectureDetailsDoc[0]?.subjectsData);
    const subject = lectureDetailsDoc[0]?.subjectsData[0];
    console.log(userId);

    if (
      subject?.username != bodyData.teacherUsername ||
      subject?.status != "running" ||
      !subject?.classId
    ) {
      console.log("detail mismatch");
      return callback({ success: false, message: "Invalid lecture data" });
    }
    const studentUsername = bodyData.studentUsername;
    const studentInfo = await User.aggregate([
      { $match: { 'username': studentUsername } },
      {
        $project: {
          name: 1,
          currentLectureDocId: 1,
          username: 1,
        }
      }
    ])
    console.log('student information in index.js 288');
    console.log(studentInfo);
    if (studentInfo[0].currentLectureDocId != bodyData.docId) {
      console.log("Student Not Belong");
      return callback({ success: false, message: "Student Not Belong" })
    }


    // const studentGroupId = lectureDetailsDoc[0]?.studentGroupDocId
    console.log(bodyData?.studentUsername);
    // const studentGroupDoc = await StudentGroupSchema.aggregate([
    //   {
    //     // Match the document by _id
    //     $match: { _id: studentGroupId }
    //   },
    //   // Project a new field "studentExists"
    //   {
    //     // $project (प्रोजेक्ट करना = only selected fields ko output me dikhana)
    //     $project: {
    //       groupName: 1, // keep groupName as it is

    //       // studentObject = filtered array of students
    //       studentObject: {
    //         // $filter (फ़िल्टर = array me se matching elements nikalna)
    //         $filter: {
    //           input: "$group",   // group = students ka array (jaise class ke students)
    //           as: "student",     // har element ko "student" naam se refer karenge

    //           // cond (condition = शर्त)
    //           cond: {
    //             // $eq (equals = barabar hai ya nahi)
    //             $eq: [
    //               "$$student.username",     // current student ka username
    //               bodyData?.studentUsername // frontend se aaya username
    //             ]
    //           }
    //         }
    //       }
    //     }
    //   }
    // ]);
    // console.log("student group doc =>");
    // console.log(studentGroupDoc, studentGroupDoc[0]?.studentObject[0]?.username);
    // const studentIdentity = studentGroupDoc[0]?.studentObject[0];

    // if (studentIdentity?.username !== bodyData.studentUsername) {
    //   console.log("student not found in req or group collection", studentIdentity[0]?.username);
    //   return callback({ success: false, message: "Student Not Found in Group" })
    // }
    const studentName = studentInfo[0]?.name;
    const result = await AttendanceSchema.updateOne(
      { _id: new ObjectId(lectureDetailsDoc[0].subjectsData[0].classId) }, // match document by _id
      [
        {
          $set: {
            record: {
              $cond: [
                {
                  $in: [bodyData.studentUsername, "$record.username"] // check if username exists
                },
                "$record",  // if already exists, keep as is
                { $concatArrays: ["$record", [{ username: bodyData.studentUsername, name: studentName }]] }
              ]
            }
          }
        }
      ]
    )
    console.log(result);
    if (result.modifiedCount == 0) {
      console.log("student already exist ");
      return callback({ success: false, message: "Student already present" })
    }
    // emit a event to all teacher sockets 
    const teacherSockets = await getUserSockets(userId);
    if (!teacherSockets.length == 0 && teacherSockets) {
      teacherSockets.forEach(id =>
        io.to(id).emit("student-added", {
          // name, username
          message: "Student added successfully",
          ...studentInfo[0]
        })
      );
    }
    // emit a event to all student sockets 
    const studentSockets = getUserSockets(studentUsername);
    if (!studentSockets.length == 0 && studentSockets) {
      studentSockets.forEach(id =>
        io.to(id).emit("attendance-marked", {
          message: "You have been marked present",
          subCode: subject.subCode,
          receiverId: studentUsername,
        })
      );
    }
  } catch (err) {
    console.error("AddStudentsManually error:", err);
    return callback({ success: false, message: "Server error" });
  }
}

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  // const { authToken } = socket.handshake.auth;
  const cookies = cookie.parse(socket.handshake.headers.cookie || "");
  console.log(cookies);
  const authToken = cookies.auth_token;
  let decode = null;
  let userId = null;
  // console.log("auth token present in io connection index.js");

  if (!authToken) {
    console.log("auth token is not present for io connection");
    return { message: "auth token is not present for io connection" }
  }
  decode = jwt.verify(authToken, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      if (error.name == "TokenExpiredError") {
        console.log("JWT Token Expired error:", error);
        return null;
      }
      console.log("Invalid JWT:", error);
      return null
    }
    // console.log("decoded token");
    return user;
  });


  console.log("user info for socket connection ", decode?.userAvailable);
  userId = decode?.userAvailable?.username;
  if (decode?.userAvailable) {
    let searchQuery =
      decode?.userAvailable?.currentLectureDocId ||
      decode?.userAvailable?.username;
    console.log("searchQuery of user is", searchQuery);
    addUserSocket(userId, socket.id)
    async function getGroupIds(searchQuery) {
      let groupsIdsDocument = null;
      if (decode?.userAvailable?.role === "teacher") {
        groupsIdsDocument = await BranchLectureInfoSchema.aggregate([
          { $unwind: "$subjectsData" }, // flatten subjectsData array
          { $match: { "subjectsData.username": searchQuery } }, // filter by username
          {
            $project: { _id: 0, roomIds: "$subjectsData.teacherRoomId" },
          }, // keep only teacherRoomId
        ]);
      } else if (decode?.userAvailable?.role === "student") {
        groupsIdsDocument = await BranchLectureInfoSchema.aggregate([
          { $unwind: "$subjectsData" },
          { $match: { _id: new mongoose.Types.ObjectId(searchQuery) } },
          { $project: { _id: 0, roomIds: "$subjectsData.roomId" } },
        ]);
      } else if (decode?.userAvailable?.role === "admin") {
        // admin can join all rooms of all teachers 
        groupsIdsDocument = await BranchLectureInfoSchema.aggregate([
          { $unwind: "$subjectsData" }, // flatten subjectsData array
          {
            $project: { _id: 0, roomIds: "$subjectsData.teacherRoomId" },
          }, // keep only teacherRoomId
        ]);
      }
      console.log("socket teacher groups doc => ", groupsIdsDocument);

      const teacherRoomIds = groupsIdsDocument.map((doc) => {
        if (doc.roomIds) {
          return doc.roomIds;
        }
      });
      console.log(teacherRoomIds);
      teacherRoomIds.forEach((roomId) => { if (roomId) socket.join(roomId) });
      console.log(`User ${searchQuery} joined rooms:`, teacherRoomIds);
      socket.emit("joinedRooms", teacherRoomIds);
    }
    getGroupIds(searchQuery);
  }

  socket.on("add_Student_Attendance_Manually_By_Teacher", (data, callback) => {
    console.log("add_Student_Attendance_Manually_By_Teacher run", data);
    // data = { ,studentUsernames=[username1, username2 username3]}
    // add students attendance and verify its username in data then emit a notification to student and teacher 
    addStudentAttendaceManually(userId, data, callback);
  })
  socket.on("disconnect", () => {
    removeUserSocket(userId, socket.id);
  });
})

// Start server
const PORT = process.env.PORT || 5173;

server.listen(5005, "0.0.0.0", () => {
  console.log("Server running...");
  console.log(`Server running on port ${PORT}`);
});

// server.listen(PORT, () => {
//      console.log(`Server running on port ${PORT}`);
// });
export { io };








// middleware/errorHandler.js - Global error handling
/**
 * Global Error Handler Middleware
 * Modern error handling with proper logging
 */


// package.json dependencies needed
/*
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "express-validator": "^7.0.1",
    "express-rate-limit": "^6.10.0",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "cookie-parser": "^1.4.6",
    "morgan": "^1.10.0",
    "express-mongo-sanitize": "^2.2.0",
    "xss-clean": "^0.1.4",
    "hpp": "^0.2.3",
    "validator": "^13.11.0",
    "dotenv": "^16.3.1"
  }
}
*/

// .env file configuration
/*
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:3000
*/