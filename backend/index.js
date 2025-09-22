import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import helmet from "helmet";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import DBConnection from "./DataBaseConnection.js";
import BranchLectureInfoSchema from "./StudentsFiles/BranchLectureInfoSchema.js";
import StudentGroupSchema from "./schema/studentgroupsSchema.js";
import mongoose from "mongoose";
import router from "./Routes.js";
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';


dotenv.config();
const app = express();
const server = http.createServer(app);
// import { io } from '../index.js';
import { addUserSocket, removeUserSocket, getUserSockets } from './socket-modules/userSocketStore.js';
// import BranchLectureInfoSchema from '../StudentsFiles/BranchLectureInfoSchema';
import AttendanceSchema from './schema/AttendanceSchema.js';
// import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
import cookie from 'cookie'


DBConnection();
// Security Middleware (Modern best practices)
// Rate limiting
const limiter = rateLimit({
     windowMs: 10 * 60 * 1000, // 10 minutes
     max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
// Data sanitization
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Clean user input from malicious HTML
app.use(hpp()); // Prevent HTTP Parameter Pollution

const io = new Server(server, {
     cors: {
          origin: [
               "https://my-collage-project-frontend.onrender.com",
               "http://localhost:5173",
          ],
          methods: ["GET", "POST"],
          credentials: true,
     },
});
// Database connection

// CORS
const allowedOrigins = [
     "https://my-collage-project-frontend.onrender.com",
     "http://localhost:5173",
];
app.use(
     cors({
          origin: function (origin, callback) {
               if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
               } else {
                    callback(new Error("Not allowed by CORS"));
               }
          },
          credentials: true,
          methods: ["GET", "POST", "PUT", "DELETE"],
          allowedHeaders: ["Content-Type", "Authorization"],
     })
);

// Helmet for security
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

app.use(router); // Use the router for all routes
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
          console.log("filter document", lectureDetailsDoc[0]);
          console.log(" lectureDetailsDoc ", lectureDetailsDoc[0]?.subjectsData);
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
          var studentUsername = bodyData.studentUsername;
          const studentGroupId = lectureDetailsDoc[0]?.studentGroupDocId
          const studentGroupDoc = await StudentGroupSchema.aggregate([
               {
                    // Match the document by _id
                    $match: { _id: studentGroupId }
               },
               {
                    // Project a new field "studentExists"
                    $project: {
                         group_name: 1,
                         studentObject: {
                              $filter: {
                                   input: "$group",          // the array field
                                   as: "student",
                                   cond: { $eq: ["$$student.username", "0114CS231023"] }
                              }
                         }
                    },
               }
          ]);
          const studentIdentity = studentGroupDoc[0].studentObject[0];
          if (studentIdentity.username !== bodyData.studentUsername) {
               console.log("student not exist", studentIdentity[0].username);
               return callback({ success: false, message: "Invalid Student" })
          }


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
                                        { $concatArrays: ["$record", [{ username: bodyData.studentUsername, name: studentIdentity.name }]] }
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
                         message: "Student added successfully",
                         ...studentIdentity
                    })
               );
          }
          // emit a event to all student sockets 
          const studentSockets = getUserSockets(studentIdentity.username);
          if (!studentSockets.length == 0 && studentSockets) {
               studentSockets.forEach(id =>
                    io.to(id).emit("attendance-marked", {
                         message: "You have been marked present",
                         subject: subject.subCode
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
     console.log("auth token", authToken);

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
          }
          console.log("decoded token");
          return user;
     });


     userId = decode?.userAvailable?.username;
     if (decode?.userAvailable) {
          let searchQuery =
               decode?.userAvailable?.currentLectureDocId ||
               decode?.userAvailable?.username;
          console.log(searchQuery);
          addUserSocket(decode?.userAvailable?.username, socket.id)
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

     socket.on("addStudentManually", (data, callback) => {
          console.log("addStudentManually run", data);
          // data = { ,studentUsernames=[username1, username2 username3]}
          // add students attendance and verify its username in data then emit a notification to student and teacher 
          addStudentAttendaceManually(userId, data, callback);
     })
     socket.on("disconnect", () => {
          removeUserSocket(userId, socket.id);
     });
})

// Start server
const PORT = process.env.PORT || 5005;
server.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
});
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