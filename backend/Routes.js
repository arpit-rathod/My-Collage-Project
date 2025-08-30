import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser()); // This allows req.cookies to work

import {
     //For all user, functions     
     getProfileAllDetails,
     UserLogin,
     UserSignUp,
     //teacher functions
     getLecturesOfTeacher,
     getLecturesStatusAndInfo,
     submitPIN,
     submitRecord,
     //student functions
     getLecturesOfStudent,
     presentAsMark,
     //admin functions
     postYearBranchInfo,
} from "./userRoutes.js";
import {
     adminValidation,
     teacherValidation,
     studentValidation,
     authenticateUser,
} from "./validationsFiles/StuTeaAdminMiddleware.js";
import e from "express";
// app.get("/CollectAttendance/attendance-page", attedancePage);

// for teachers
app.post("/submit-pin", authenticateUser, teacherValidation, submitPIN);
app.put("/submit-record", authenticateUser, teacherValidation, submitRecord);
app.get(
     "/get-lectures-of-teacher",
     authenticateUser,
     teacherValidation,
     getLecturesOfTeacher
);
// app.get(
//   "/running-class-detail",
//   authenticateUser,
//   teacherValidation,
//   getRunningClassDetails
// );
app.get(
     "/CollectAttendance/get-lecture-info",
     authenticateUser,
     teacherValidation,
     getLecturesStatusAndInfo
);

// for students
app.put(
     "/submit-attendance",
     authenticateUser,
     studentValidation,
     presentAsMark
);
app.get(
     "/student-lectures",
     authenticateUser,
     studentValidation,
     getLecturesOfStudent
);

//for teachers and students
app.post("/UserSignUp", UserSignUp);
app.post("/Login", UserLogin);
app.get("/getProfileAllDetails", authenticateUser, getProfileAllDetails);
// backend
app.post("/logout", (req, res) => {
     res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
     res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials
     console.log("logout run cookie token = " + req.cookies?.auth_token);
     if (!req.cookies?.auth_token) {
          return res.status(401).json({ message: "Not logged in" });
     } else {
          res.clearCookie("auth_token", {
               httpOnly: process.env.NODE_ENV === "production",
               secure: process.env.NODE_ENV === "production",
               sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          });
          res.status(200).json({ message: "User Logged out successfully" });
     }
});

app.get("/me", (req, res) => {
     res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
     res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials
     const auth_token = req.cookies.auth_token;
     console.log("auth_token from cookies", auth_token);

     if (!auth_token) return res.status(401).json({ message: "Not logged in" });

     const user = jwt.verify(auth_token, process.env.JWT_SECRET);
     res.status(200).json({ user });
});

//for admin
app.post(
     "/post-new-branch-data",
     authenticateUser,
     adminValidation,
     postYearBranchInfo
);
// app.post("/create-teacher-lecture", createTeacherLecture);

export default app;
