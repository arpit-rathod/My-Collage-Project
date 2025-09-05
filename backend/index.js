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
import mongoose from "mongoose";
import router from "./Routes.js";
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
app.use(router); // Use the router for all routes



// function to fillter available student usernames

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
          const studentIdentity = lectureDetailsDoc[0].student[0];
          if (studentIdentity.username !== bodyData.studentUsername) {
               console.log("student not exist", lectureDetailsDoc[0].student[0].username);
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
     const { authToken } = socket.handshake.auth;
     const cookies = cookie.parse(socket.handshake.headers.cookie || "");
     console.log(cookies);
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


// const distPath = path.join(__dirname, "dist"); // Ensure 'dist' is the correct build folder name

// app.use(express.static(distPath));

// // For all GET requests not handled above, send index.html (important for React Router)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(distPath, "index.html"));
// });==


// No need to serve frontend from here
// Do NOT include app.use(express.static(...)) or app.get("*")
// Socket.IO
// Start server
const PORT = process.env.PORT || 5005;
server.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
});
export { io };

// Export Socket instance if needed

// import express from "express";
// import DBConnection from "./DataBaseConnection.js";
// import app from "./Routes.js";
// import dotenv from "dotenv";
// import cors from "cors";
// import http from "http";
// import { Server } from "socket.io";
// import helmet from "helmet";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config();
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://my-collage-project-frontend.onrender.com",
// ];
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
// DBConnection();
// const PORT = process.env.PORT || 5005;
// // app.use((req, res, next) => {
// //   res.setHeader(
// //     "Content-Security-Policy",
// //     "default-src 'self'; font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"
// //   );
// //   next();
// // });

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       fontSrc: ["'self'", "https://fonts.gstatic.com"],
//       styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
//       scriptSrc: ["'self'"],
//       imgSrc: ["'self'"],
//       connectSrc: ["'self'"],
//     },
//   })
// );
// app.use(express.json());
// // hwo create a route for all url end point in backend

// const distPath = path.join(__dirname, "dist"); // Ensure 'dist' is the correct build folder name

// app.use(express.static(distPath));

// // For all GET requests not handled above, send index.html (important for React Router)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(distPath, "index.html"));
// });

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   //socket is a client
//   console.log(`user connected: ${socket.id}`);
//   socket.on("trubaId", (msg) => {
//     console.log(`new msg from ${msg}`);
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Server runnig on PORT ${PORT}`);
// });

// export { io };
// // app.use(cors({
// //      origin: 'http://localhost:3000', // Allow only this frontend
// //      methods: ['GET', 'POST'], // Allow specific HTTP methods
// //      allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
// //  }));
