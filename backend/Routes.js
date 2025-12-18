import express from "express";
import jwt from "jsonwebtoken";
import { User } from "./UserSchema.js";
// app.js or server.js - Main application setup
// import teacherRoutes from './routes/teacherRoutes.js';

import { getStudentAttendanceWithUnwind } from './APIFunctions/get_weekly_attendance_of_one_student.js';
import {
  registerTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  validateTeacherRegistration,
  registrationLimiter
} from './adminEndPoints/registerTeacher.js';
// } from '../controllers/teacherController.js';
// import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
// import { asyncHandler } from './index.js';


function allowRoles(...roles) {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (roles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({ message: "Access denied. Allowed roles: " + roles.join(", ") });
  };
}

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
  // addStudentProfile,
  addBranchYearDoc,
  addSubjectToBranchYear,
  searchStudent,
  studentAllData,
  updateStudentProfile,
  updateStudentAcademicData
} from "./userRoutes.js";
import {
  adminValidation,
  teacherValidation,
  studentValidation,
  authenticateUser,
} from "./validationsFiles/StuTeaAdminMiddleware.js";


export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

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
  console.log("logout run cookie token = " + req.cookies?.auth_token);
  if (!req.cookies?.auth_token) {
    return res.status(401).json({ message: "Not logged in" });
  } else {
    res.clearCookie("auth_token", {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
    res.clearCookie("uiRole_token", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
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
// router.post(
//      "/post-new-branch-data",
//      authenticateUser,
//      adminValidation,
//      postYearBranchInfo
// );
// router.post(
//      "/add-student-profile",
//      authenticateUser,
//      adminValidation,
//      addStudentProfile
// );
router.post(
  "/add-branch-year-doc",
  authenticateUser,
  adminValidation,
  addBranchYearDoc
);
// app.post("/create-teacher-lecture", createTeacherLecture);
router.post(
  "/add-subject-to-branch-year",
  authenticateUser,
  allowRoles("teacher", "admin"),
  addSubjectToBranchYear
);
router.get(
  "/find-user-students",
  authenticateUser,
  adminValidation,
  searchStudent
);
router.get(
  "/get-student-all-info",
  authenticateUser,
  adminValidation,
  studentAllData
);
router.put(
  "/api/admin/update/student/profile/:studentId",
  authenticateUser,
  adminValidation,
  updateStudentProfile
);
router.put(
  "/api/admin/update/student/academic/:studentId",
  authenticateUser,
  adminValidation,
  updateStudentAcademicData
);

// Public Routes (with rate limiting)
// router.post('/api/teacher/register',
//      authenticateUser,
//      validateTeacherRegistration,
//      asyncHandler(registerTeacher)
// );
router.get('/:id',
  authenticateUser,
  asyncHandler(getTeacherById)
);
router.put('/:id',
  authenticateUser,
  asyncHandler(updateTeacher)
);

// Attendance get routes
// authenticateUser,
router.get('/api/student-attendance/:studentUsername',
  getStudentAttendanceWithUnwind
)


export default router;
