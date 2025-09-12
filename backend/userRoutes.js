import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { io } from "./index.js";
//schemas
import User from "./UserSchema.js";
import AttendanceSchema from "./schema/AttendanceSchema.js";
import StudentDayRecord from ".//StudentsFiles/StudentTodayRecord.js"; //student today record schema
import mongoose from "mongoose";
import cron from "node-cron";
// import subRecordSchema from "";
import BranchLectureInfoSchema from "./StudentsFiles/BranchLectureInfoSchema.js"; // path to your model

const getProfileAllDetails = async (req, res) => {
     res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL)
     try {
          const username = req.user.username;
          const userProfile = await User.findOne({ username: username }).select("-password");
          if (userProfile) {
               return res.status(200).json({ userProfile, message: "user found" });
          } else {
               return res.status(404).json({ message: "user details not found" });
          }
     } catch (error) {
          return res.status(500).json({ message: "server error" });
     }
};
const UserLogin = async (req, res) => {
     res.setHeader("Cache-Control", "no-store");
     res.setHeader("Content-Security-Policy", "default-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self'; img-src 'self'; connect-src 'self' https://my-collage-project-frontend.onrender.com https://my-collage-project-0ccb.onrender.com; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; object-src 'none'; script-src-attr 'none'; upgrade-insecure-requests");
     res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
     res.setHeader("Access-Control-Allow-Credentials", "true");
     console.log("login function run");
     res.setHeader("Vary", "Origin");

     try {
          const { username, password } = req.body;
          if (!username || !password) {
               console.log("all field are mandotory");
               return res.status(400).json("all field are mandotory");
          }

          const availableUser = await User.findOne({ username: username });
          if (!availableUser) {
               console.log("user not available for login ", username);
               return res.status(404).json("no account found for this username");
          }
          console.log("user available for login ", availableUser.username);
          if (
               availableUser &&
               (await bcrypt.compare(password, availableUser.password))
          ) {
               console.log("user matched");
               const payload = {
                    userAvailable: {
                         username: availableUser.username,
                         role: availableUser.role,
                         id: availableUser._id,
                         name: availableUser.name,
                         ...(availableUser.currentLectureDocId && {
                              currentLectureDocId: availableUser.currentLectureDocId,
                         }), // conditional add
                    },
               };
               if (!payload) {
                    console.log("payload not generated at login");
                    return res.status(500).json({ message: "payload not generated" })
               }

               const auth_token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: "7d",
               });
               const uiRole_token = jwt.sign({ role: availableUser.role, username: availableUser.username }, "UI_SECRET", {
                    expiresIn: "7d",
               });
               if (!auth_token || !uiRole_token) {
                    console.log("auth_token or uiRole_token not generated at login");
                    return res.status(500).json({ message: "auth_token or uiRole_token not generated" })
               }
               console.log(process.env.NODE_ENV);
               if (process.env.NODE_ENV === "production") {
                    console.log(process.env.NODE_ENV);
               }
               console.log("token generated ");
               // domain: "my-collage-project-frontend.onrender.com", // when in production for same-site cookie
               res.cookie("auth_token", auth_token, {
                    httpOnly: process.env.NODE_ENV === "production", // Cannot access with JS
                    secure: process.env.NODE_ENV === "production", // Set true for HTTPS
                    sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
               });
               // Note : cookie is not accessible in JS so set cookie manually for UI role based rendering
               // res.cookie("uiRole_token", uiRole_token, {
               //      httpOnly: false,
               //      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
               //      secure: process.env.NODE_ENV === "production", // Set true for HTTPS
               //      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
               // });

               console.log("token saved in cookies at login");
               return res.status(200).json({
                    message: "Login successful",
                    uiRole_token: uiRole_token,
               });
          } else {
               console.log(`password not matched for ${username}`);
               return res
                    .status(404)
                    .json({ message: `password not matched for ${username}` });
          }
     } catch (error) {
          return res.status(500).json({ error, message: "catch error" });
     }
};
const UserSignUp = async (req, res) => {
     res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
     res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials
     try {
          const { username, newPassword } = req.body;

          if (!username || !newPassword) {
               return res.status(400).json({ message: "All field are mandotory" });
          }
          // console.log(username + " " + newPassword);

          const IfAvailable = await User.findOne({ username: username });
          console.log("present data " + IfAvailable);
          if (IfAvailable) {
               console.log("username already available");
               return res.status(409).json({ message: "username already available" });
          }
          const hashedPassword = await bcrypt.hash(newPassword, 1);
          // console.log(hashedPassword);
          const newCreatedUser = new User({
               username: username,
               password: hashedPassword,
          });
          await newCreatedUser.save();

          return res.status(201).json({
               message: "User Created successfully",
               user: { _id: newCreatedUser._id, username: newCreatedUser.username },
          });
     } catch (error) {
          return res.status(500).json({ message: "catch run during signup", error });
     }
};
// for student sent notification for lecture activated
// const lectureActiveNotification = async (msgObject, targetId) => {
//   if (msgObject || targetId) {
//     io.to(targetId).emit("lecture-active-notification", msgObject);
//   }
// };

// for student
const getLecturesOfStudent = async (req, res) => {
     res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
     res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials
     console.log("getLecturesOfStudent function run ");
     console.log(req.user);
     if (req.user.role !== "student") {
          return res
               .status(403)
               .json({ message: "Access denied, This page is only for Students" });
     }
     const currentLectureDocId = req.user.currentLectureDocId;
     console.log("getLectureOfStudent => currentLectureDocId: ", currentLectureDocId);
     try {
          const date = new Date().toISOString().split("T")[0];
          let lectureDocument = await BranchLectureInfoSchema.findOne({
               _id: new mongoose.Types.ObjectId(currentLectureDocId),
          });
          // if lecture status is running or complete then check the status of attendance for student in corosponding lecture attendance document

          let lectureObject = lectureDocument.toObject();
          lectureObject.subjectsData = await Promise.all(
               lectureObject.subjectsData.map(async (subjectElement) => {
                    let studentStatus = "pending"; // default status
                    if (subjectElement?.status === "pending") {
                         studentStatus = "pending";
                    } else if (
                         subjectElement?.status === "running" ||
                         subjectElement?.status === "complete"
                    ) {
                         // find attendance for that subject
                         console.log("subject status is running or completed");
                         const attendanceDoc = await AttendanceSchema.findOne({
                              _id: new mongoose.Types.ObjectId(subjectElement.classId),
                         });

                         if (attendanceDoc) {
                              // const isPresent = attendanceDoc.record.includes(req.user.username); // for string in array
                              const isPresent = Array.isArray(attendanceDoc.record) && attendanceDoc.record.some(obj => obj.username === req.user.username);
                              console.log("isPresent for student : ", isPresent);
                              if (subjectElement?.status === "running") {
                                   studentStatus = isPresent ? "present" : "not_marked";
                              } else if (subjectElement?.status === "complete") {
                                   studentStatus = isPresent ? "present" : "absent";
                              }
                              console.log("studentStatus for student : ", studentStatus);
                         } else {
                              studentStatus = "no_status";
                         }
                    }

                    const plainSubject = subjectElement.toObject ? subjectElement.toObject() : subjectElement;
                    return {
                         ...plainSubject,
                         studentStatus,
                    };
               })
          );
          lectureObject = {
               ...lectureObject,
               username: req.user.username,
               name: req.user.name
          }
          console.log("Updated lecture document ");
          return res.status(200).json({
               lectureObject,
               message: "student lectures fetched successfully",
          });
     } catch (error) {
          console.log("Error fetching student lectures: ", error);
          return res.status(500).json({ message: "data fetch error" });
     }
};
// for teacher
const getLecturesOfTeacher = async (req, res) => {
     res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
     res.setHeader("Access-Control-Allow-Credentials", "true");
     try {
          console.log("getLecturesOfTeacher run ");
          console.log(req.user);
          const { username } = req.user;
          console.log("finding lectures for teacher = ", username);
          if (!username) {
               console.log("all field required");
               return res.status(400).json({ message: "username required in token" });
          }
          const branch = "CSE A";
          const lecturObject = await BranchLectureInfoSchema.findOne({
               branch: branch,
          });
          console.log(lecturObject.year, lecturObject.branch);

          const lecturesData = await BranchLectureInfoSchema.aggregate([{
               $match: { "subjectsData.username": username },
          },
          {
               $project: {
                    _id: 1,
                    department: 1,
                    year: 1,
                    branch: 1,
                    totalStudents: 1,
                    subjectsData: {
                         $map: {
                              input: {
                                   $filter: {
                                        input: "$subjectsData",
                                        as: "subject",
                                        cond: { $eq: ["$$subject.username", username] },
                                   },
                              },
                              as: "filtered",
                              in: {
                                   $mergeObjects: [
                                        "$$filtered",
                                        {
                                             index: {
                                                  $indexOfArray: ["$subjectsData", "$$filtered"],
                                             },
                                        },
                                   ],
                              },
                         },
                    },
               },
          },
          ]);
          console.log("lecturesData fetched for teacher");
          return res.status(200).json({ lecturesData, message: "data fetched" });
     } catch (error) {
          return res.status(500).json({ message: "data fetch error" });
     }
};
// for teacher
const submitPIN = async (req, res) => {
     res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
     res.setHeader("Access-Control-Allow-Credentials", "true");
     console.log("submitPIN run");
     try {
          const { objectId, index, pin } = req.body;
          console.log(req.body);
          if (!objectId || !index || !pin) {
               console.log(" All field mandotory");
               return res.status(400).json({ message: "All field mandotory" });
          }
          let lectureObjectForUpdatePin = await BranchLectureInfoSchema.findOne({
               _id: new mongoose.Types.ObjectId(objectId),
          });
          // check the target lecture is corrosponding to teacher or not meaning no other teacher can not coordinate another lecture
          if (!lectureObjectForUpdatePin) {
               console.log("teacher document not found to update pin");
               return res.status(404).json({ message: "teacher document not found to update pin" });
          }
          console.log("Creating new class object ");
          if (lectureObjectForUpdatePin.subjectsData[index].status === "pending" || lectureObjectForUpdatePin.subjectsData[index].status === "complete") {
               console.log("run3");
               const newClassObject = new AttendanceSchema({
                    department: lectureObjectForUpdatePin.department,
                    year: lectureObjectForUpdatePin.year,
                    branch: lectureObjectForUpdatePin.branch,
                    subCode: lectureObjectForUpdatePin.subjectsData[index].subCode,
                    subName: lectureObjectForUpdatePin.subjectsData[index].subName,
                    teacher: lectureObjectForUpdatePin.subjectsData[index].teacher,
                    username: lectureObjectForUpdatePin.subjectsData[index].username,
                    date: new Date().toISOString().split("T")[0],
                    record: [],
                    remark: "remark",
                    totalStudents: 0,
                    Feedback: "totalFeedback",
                    totalStars: "totalStars",
               });
               // and delete the pin and class Id if exists;
               // BranchLectureInfoSchema.updateOne(
               //   { _id: new mongoose.Types.ObjectId(objectId) },
               //   {
               //     $unset: {
               //       "subjectsData.$.pin": "",
               //       "subjectsData.$.classId": "",
               console.log("run3");
               //     },
               //   }
               // );
               //now save the newClassObject in collection attendance
               console.log("run3");
               await newClassObject.save();
               console.log("new class object", newClassObject);

               const updatePath = `subjectsData.${index}`;
               console.log("run 33 ");
               console.log("updatePath", updatePath);
               console.log(pin, newClassObject._id);

               const available = await BranchLectureInfoSchema.findOneAndUpdate({
                    _id: new mongoose.Types.ObjectId(objectId),
               }, {
                    $set: {
                         [`${updatePath}.status`]: "running",
                         [`${updatePath}.pin`]: pin,
                         [`${updatePath}.classId`]: newClassObject._id,
                    },
               },
                    { new: true }
               );
               const previousAttendanceCount = available.subjectsData[index].previousAttendanceCount;
               console.log("submitPin fun updated document in the BranchLectureInfoSchema");
               console.log("run4");
               const storedPin = available.subjectsData[index].pin;
               return res
                    .status(200)
                    .json({ storedPin: storedPin, message: "pin stored" });
          }
     } catch (error) {
          console.log("error during submit pin for teacher", error);
          return res.status(500).json({ message: "error during submit pin for teacher", error });
     }
};
// for teacher

// const getRunningClassDetails = async (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
//   try {
//     console.log("classId");
//     const { classId } = req.query;
//     console.log(classId);
//     if (!classId) {
//       console.log("All field mandotory");
//       return res.status(400).json({ message: "All field mandotory" });
//     }
//     let _id = classId;
//     console.log(_id);
//     const available = await Attendances.findOne({ _id });
//     console.log(available);
//     return res.status(201).json({ available, message: "running class data" });
//   } catch (error) {
//     console.log("1 error in running class data ");
//     return res
//       .status(404)
//       .json({ message: "error while fetching running class details", error });
//   }
// };
// const searchedLectureObject2 = await BranchLectureInfoSchema.findOne({
//   _id: new mongoose.Types.ObjectId(objectId),
// });
// console.log("searchedLectureObject = ", searchedLectureObject);
// const searchedLectureObject3 = await BranchLectureInfoSchema.aggregate([
//   { $match: { _id: new mongoose.Types.ObjectId(objectId) } },
//   {
//     $project: {
//       _id: 1,
//       department: 1,
//       year: 1,
//       branch: 1,
//       totalStudents: 1,
//       // subjectAtIndex: { $arrayElemAt: ["$subjectsData", index] },
//     },
//   },
// ]);

const getLecturesStatusAndInfo = async (req, res) => {
     res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
     res.setHeader("Access-Control-Allow-Credentials", "true");
     var message = null;
     try {
          console.log("get Lectures Status And Info run");
          // prettier-ignore
          const { objectId, index } = req?.query;
          console.log("objectId", objectId, "index", index);
          if (!objectId || !index) {
               console.log("All field mandatory");
               return res.status(400).json({ message: "All field mandatory" });
          }
          console.log("try to filter the subjectsData");
          let searchedLectureDocument = await BranchLectureInfoSchema.aggregate([{
               $match: { _id: new mongoose.Types.ObjectId(objectId) },
          },
          {
               $project: {
                    _id: 1,
                    department: 1,
                    year: 1,
                    branch: 1,
                    totalStudents: 1,
                    previousAttendanceCount: 1,
                    subjectsData: { $arrayElemAt: ["$subjectsData", Number(index)] },
               },
          },
          { $limit: 1 },
          ]);
          searchedLectureDocument = searchedLectureDocument[0];
          console.log(searchedLectureDocument);
          //  let searchedLectureObject = await BranchLectureInfoSchema.findOne({
          //    _id: new mongoose.Types.ObjectId(objectId),
          //  });
          //  console.log(searchedLectureObject);
          //  searchedLectureObject = searchedLectureObject.toObject();
          //  console.log(searchedLectureObject);

          //  let lectureElement = searchedLectureObject?.subjectsData[index];
          console.log(
               "status to compare = ",
               searchedLectureDocument.subjectsData.status
          );
          if (searchedLectureDocument.subjectsData.status === "pending") {
               // console.log("delete subjects from object = ", searchedLectureObject);
               // searchedLectureObject["subjectData"] = lectureElement
               message = "Lecture is Pending, Please Generate the OTP to start the class"
               return res
                    .status(200)
                    .json({ message: message, searchedLectureDocument });
          } else if (
               searchedLectureDocument.subjectsData.status === "running" ||
               searchedLectureDocument.subjectsData.status === "complete"
          ) {
               let attendanceDocument = await AttendanceSchema.findOne({
                    _id: searchedLectureDocument.subjectsData.classId,
               });
               if (!attendanceDocument) {
                    message = "Attendace document not found for current session";
                    attendanceDocument = null;
                    console.log(
                         "Lecture info not found for classId:",
                         searchedLectureDocument.subjectsData.classId
                    );

               }
               return res.status(200).json({
                    searchedLectureDocument,
                    attendanceDocument,
                    message: message,
               });
          } else {
               return res.status(204).json({ message: "No content available" });
          }
     } catch (error) {
          console.log("error while fetching status and information");
          return res
               .status(404)
               .json({ message: "error while fetching running class details", error });
     }
};
// for teacher
const submitRecord = async (req, res) => {
     res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
     res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials
     const { objectId, index, currentLectureAttDocId } = req.body;
     console.log(
          objectId,
          index,
          currentLectureAttDocId,
          "classId for submit its record from submitRecord function"
     );

     if (!objectId || !index || !currentLectureAttDocId) {
          return res
               .status(400)
               .json({ message: "All fields are required to submit record" });
     }
     console.log("objectId", objectId);
     console.log("index", index);
     const path = `subjectsData.${index}`;
     const result = await AttendanceSchema.aggregate([
          { $match: { _id: new mongoose.Types.ObjectId(currentLectureAttDocId) } },
          { $project: { previousAttendanceCount: { $size: "$record" } } }
     ]);
     // Get the count value:
     console.log("submitRecord => result ", result);

     const previousAttendanceCount = result[0]?.previousAttendanceCount;
     console.log("submitRecord => previous Attendance Count ", previousAttendanceCount);

     try {
          const updated = await BranchLectureInfoSchema.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(objectId) }, {
               $set: {
                    [`previousAttendanceCount`]: previousAttendanceCount,
                    [`${path}.status`]: "complete",
               },
          }, { new: true });
          // $unset: {
          //      [`${path}.classId`]: "",
          // },
          console.log("updated ", updated);
          if (!updated) {
               return res
                    .status(404)
                    .json({ message: "Class ID not found in subjectsData" });
          }
          return res.status(200)
               .json({ message: "Lecture recorded successfully", data: updated });
     } catch (error) {
          console.error("error during submit record of lecture for teacher ", error);
          return res.status(404).json({ message: "error during submit record of lecture for teacher ", error });
     }
};
// for admin
const postYearBranchInfo = async (req, res) => {
     res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
     res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials
     try {
          const { department, year, branch, subjectsData } = req.body;
          if (!department || !year || !branch || !subjectsData) {
               return res.status(400).json({ message: "all field mandotory" });
          }
          const available = await BranchLectureInfoSchema.findOne({
               department,
               year,
               branch,
          });
          if (available) {
               return res.status(400).json({ message: "data already exists" });
          }
          const newData = new BranchLectureInfoSchema({
               department: department,
               year: year,
               branch: branch,
               subjectsData: subjectsData,
          });
          await newData.save();
          return res.status(200).json({ message: "data created", newData });
     } catch (error) {
          return res.status(400).json({ message: "can not submit data" });
     }
};
// mark as present
// for students
const presentAsMark = async (req, res) => {
     res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
     res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials
     try {
          console.log(req.body);
          const { verificationPin, subCode, classId } = req.body;
          console.log("verificationPin from request body: ", verificationPin);
          if (!verificationPin) {
               console.log("all field are mandotory");
               return res.status(400).json({ message: "All Field Mandotory" });
          }
          const date = new Date().toISOString().split("T")[0];
          console.log(date);

          console.log("run 1");
          console.log(req.user);
          const result = await BranchLectureInfoSchema.findOne({
               _id: new mongoose.Types.ObjectId(req.user.currentLectureDocId),
               "subjectsData.subCode": subCode,
          }, { "subjectsData.$": 1 });
          console.log(result);
          console.log("run 2");
          //  if (!result || !result?.subjectsData || result?.subjectsData?.length === 0) {
          //    return res.status(404).json({ message: "Subject not found" });
          //  }
          console.log("run 3");
          if (result.subjectsData[0].pin == verificationPin) {
               console.log("pin matched");

               if (!mongoose.Types.ObjectId.isValid(classId)) {
                    throw new Error("Invalid classId format");
               }
               const updateStuAtte = await AttendanceSchema.findOneAndUpdate({ _id: classId }, { $addToSet: { record: { username: req.user.username, name: req.user.name } } }, // or $push
                    { new: true }
               );
               console.log("attendance updated ", updateStuAtte.record);

               if (!updateStuAtte) {
                    console.log("class not found to store student attendance");
                    return res.status(404).json({ message: "Class record not found" });
               }
               console.log(result.subjectsData[0].teacherRoomId);
               io.to(result.subjectsData[0].teacherRoomId).emit("newAttendanceEvent", {
                    username: req.user.username,
                    status: "present",
                    name: req.user.name
               });
               //       io.emit("studentmPresentEvent", {
               //         //   studentName: ,
               //         username: req.user.username,
               //         status: "present",
               //       });
               console.log("socket io run at submit attendance ");
               return res
                    .status(200)
                    .json({ message: "attendance submited successfully " });
               console.log("socket io run at submit attendance ");
          } else {
               console.log("pin not matched");
               return res.status(404).json({ message: "PIN not Matched" });
          }
     } catch (error) {
          console.log("error during submitting attendaces");
          return res.status(500).json({ message: "server error", error });
     }
};

const addStudentAttendaceManually = async (req, res) => {
     const { bodyData } = req.body;
     console.log(bodyData);
     return res.status(200).json({ message: "student attendance marked successfully" });
}

export {
     addStudentAttendaceManually,
     UserSignUp,
     UserLogin,
     getProfileAllDetails,
     getLecturesOfTeacher,
     getLecturesStatusAndInfo,
     submitPIN,
     submitRecord,
     getLecturesOfStudent,
     presentAsMark,
     postYearBranchInfo,
};
// getRunningClassDetails
const resetLectures = async () => {
     try {
          await BranchLectureInfoSchema.updateMany({}, {
               $set: {
                    "subjectsData.$[].status": "pending",
               },
               $unset: {
                    "subjectsData.$[].pin": "",
                    "subjectsData.$[].classId": "",
               },
          });
          console.log("✅ Lectures reset.");
     } catch (err) {
          console.error("❌ Error:", err);
     }
};
// Schedule it to run after 1 minute
// cron.schedule("*/1 * * * *", async () => {
// ⏰ Schedule it to run every night at 12:00 AM
cron.schedule("0 0 * * *", async () => {
     console.log("🕛 Running midnight reset...");
     await resetLectures();
});
// await resetLectures();