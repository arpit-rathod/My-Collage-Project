import express from "express";
import {
  getProfileDetail,
  getProfileAllDetails,
  UserLogin,
  UserSignUp,
  submitPIN,
  getLecturesStatus,
  postYearBranchInfo,
  submitRecord,
  submitAttendance,
  getLecturesOfTeacher,
  getRunningClassDetails,
} from "./userRoutes.js";
import {
  adminValidation,
  teacherValidation,
  studentValidation,
  authenticateUser,
} from "./validationsFiles/StuTeaAdminMiddleware.js";
import bodyParser from "body-parser";
const app = express();

app.use(bodyParser.json());
// app.use(express.json())
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
app.get(
  "/running-class-detail",
  authenticateUser,
  teacherValidation,
  getRunningClassDetails
);

// for students
app.put(
  "/submit-attendance",
  authenticateUser,
  studentValidation,
  submitAttendance
);
app.get(
  "/getLecturesStatus",
  authenticateUser,
  studentValidation,
  getLecturesStatus
);

//for teachers and students
app.post("/UserSignUp", UserSignUp);
app.post("/Login", UserLogin);
app.get("/profileDetails", getProfileDetail);
app.get("/getProfileAllDetails", getProfileAllDetails);

//for admin
app.post(
  "/post-new-branch-data",
  authenticateUser,
  adminValidation,
  postYearBranchInfo
);
// app.post("/create-teacher-lecture", createTeacherLecture);

export default app;
