import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();
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
     addStudentAttendaceManually,
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

// for teachers
router.post("/submit-pin", authenticateUser, teacherValidation, submitPIN);
router.post("/add-student-attendace-manually", authenticateUser, teacherValidation, addStudentAttendaceManually);
router.put("/submit-record", authenticateUser, teacherValidation, submitRecord);
router.get(
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
router.get(
     "/user-lectures/get-lecture-info",
     authenticateUser,
     teacherValidation,
     getLecturesStatusAndInfo
);

// for students
router.put(
     "/submit-attendance",
     authenticateUser,
     studentValidation,
     presentAsMark
);
router.get(
     "/student-lectures",
     authenticateUser,
     studentValidation,
     getLecturesOfStudent
);

//for teachers and students
router.post("/UserSignUp", UserSignUp);
router.post("/Login", UserLogin);
router.get("/getProfileAllDetails", authenticateUser, getProfileAllDetails);
// backend
router.post("/logout", (req, res) => {
     res.setHeader("Access-Control-Allow-Origin", "*");
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
          res.clearCookie("uiRole_token", {
               httpOnly: false,
               secure: process.env.NODE_ENV === "production",
               sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          });
          res.status(200).json({ message: "User Logged out successfully" });
     }
});

router.get("/me", (req, res) => {
     const auth_token = req.cookies.auth_token;
     console.log("auth_token from cookies", auth_token);

     if (!auth_token) return res.status(401).json({ message: "Not logged in" });

     const user = jwt.verify(auth_token, process.env.JWT_SECRET);
     res.status(200).json({ user });
});

//for admin
router.post(
     "/post-new-branch-data",
     authenticateUser,
     adminValidation,
     postYearBranchInfo
);
// app.post("/create-teacher-lecture", createTeacherLecture);

export default router;
