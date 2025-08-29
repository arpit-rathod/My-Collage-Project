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

const getProfileDetail = async (req, res) => {
     res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials
     res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
     const { username } = req.query;
     try {
          const user = User.finnById(username).select("name avtar");
          if (!user) {
               return res.status(404).json({ message: "user details not found" });
          }
          return res.status(200).json({ user, message: "data fetched" });
     } catch (error) {
          return res.status(500).json({ message: "server error" });
     }
};
const getProfileAllDetails = async (req, res) => {
     res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
     res.header("Access-Control-Allow-Credentials", "true");
     try {
          const username = req.user.username;
          const user = await User.findOne({ username: username }).select("-password");
          if (user) {
               return res.status(200).json({ user, message: "user found" });
          } else {
               return res.status(404).json({ message: "user details not found" });
          }
     } catch (error) {
          return res.status(500).json({ message: "server error" });
     }
};
const UserLogin = async (req, res) => {
     res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
     res.setHeader("Access-Control-Allow-Credentials", "true");
     console.log("login function run");

     try {
          const { username, password } = req.body;
          if (!username || !password) {
               console.log("all field are mandotory");
               return res.status(400).json("all field are mandotory");
          }

          const availableUser = await User.findOne({ username: username });
          if (!availableUser) {
               console.log("user not available for login ", availableUser);
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
                         ...(availableUser.currentLectureDocId && {
                              currentLectureDocId: availableUser.currentLectureDocId,
                         }), // conditional add
                    },
               };
               const auth_token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: "24h",
               });
               console.log("token generated ");
               res.cookie("auth_token", auth_token, {
                    domain: "https://my-collage-project-frontend.onrender.com/",
                    httpOnly: process.env.NODE_ENV === "production", // Cannot access with JS
                    secure: process.env.NODE_ENV === "production", // Set true for HTTPS
                    sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
                    // sameSite: "lax", // for working on local host
                    // sameSite: "strict", // for production
               });

               console.log("token saved in cookies");
               return res.status(200).json({
                    message: "Login successful",
                    auth_token: auth_token,
               });
          } else {
               console.log(`password not matched for ${username}`);
               return res
                    .status(404)
                    .json({ message: `password not matched for ${username}` });
          }
     } catch (error) {
          return res.status(404).json({ error, message: "catch error" });
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
               return res.status(200).json({ message: "username already available" });
          }
          const hashedPassword = await bcrypt.hash(newPassword, 1);
          // console.log(hashedPassword);
          const newCreatedUser = new User({
               username: username,
               password: hashedPassword,
          });
          await newCreatedUser.save();

          return res.status(200).json({
               message: "User Created successfully",
               user: { _id: newCreatedUser._id, username: newCreatedUser.username },
          });
     } catch (error) {
          return res.status(404).json({ message: "catch run during signup", error });
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
     console.log("currentLectureDocId: ", currentLectureDocId);
     try {
          const date = new Date().toISOString().split("T")[0];
          let lectureDocument = await BranchLectureInfoSchema.findOne({
               _id: currentLectureDocId,
          });
          // if lecture status is running or complete then check the status of attendance for student in corosponding lecture attendance document

          let lectureObject = lectureDocument.toObject();
          lectureObject.subjectsData = await Promise.all(
               lectureObject.subjectsData.map(async (subjectElement) => {
                    let studentStatus = "pending"; // default

                    if (subjectElement.status === "pending") {
                         studentStatus = "pending";
                    } else if (
                         subjectElement.status === "running" ||
                         subjectElement.status === "completed"
                    ) {
                         // find attendance for that subject
                         const attendanceDoc = await AttendanceSchema.findOne({
                              _id: subjectElement.classId,
                         });

                         if (attendanceDoc) {
                              const isPresent = attendanceDoc.record.includes(req.user.username);

                              if (subjectElement.status === "running") {
                                   studentStatus = isPresent ? "present" : "not_marked";
                              } else if (subjectElement.status === "completed") {
                                   studentStatus = isPresent ? "Present" : "Absent";
                              }
                         } else {
                              studentStatus = "no_record";
                         }
                    }

                    const plainSubject = subjectElement.toObject ? subjectElement.toObject() : subjectElement;
                    return {
                         ...plainSubject,
                         studentStatus,
                    };

                    //  return {
                    //      ...(subjectElement.toObject ? .() || subjectElement), // convert mongoose object if needed
                    //      studentStatus,
                    //  };
               })
          );
          //  lectureDocument = lectureDocument.toObject;
          //  lectureDocument.subjectsData = subjectsWithStatus;
          console.log("Updated lecture document: ", lectureObject);

          //  console.log("lecture document found");
          //  // have to remove
          //  const subjectsData = lectureDocument.subjectsData;
          //  console.log("subjects data found");
          //  if (!lectureDocument || !subjectsData) {
          //    console.log("lectureDocument or subjectsData data not found");
          //    return res.status(201).json({ message: "data not found" });
          //  }
          //  const todaysRecordOfStudent = await StudentDayRecord.findOne({
          //    username: req.user.username,
          //    date,
          //  });
          //  console.log("todaysRecordOfStudent found");
          //  if (!todaysRecordOfStudent) {
          //    console.log("student today's record not exists");
          //  }
          //  const attendance = todaysRecordOfStudent?.attendance;
          return res.status(201).json({
               lectureObject,
               message: "student lectures fetched successfully",
          });
     } catch (error) {
          console.log("Error fetching student lectures: ", error);
          return res.status(404).json({ message: "data fetch error" });
     }
};
// for teacher
const getLecturesOfTeacher = async (req, res) => {
     res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
     res.setHeader("Access-Control-Allow-Credentials", "true");
     try {
          console.log("getLecturesOfTeacher run ");
          const { username } = req.query;
          console.log("finding lectures for teacher = ", username);
          if (!username) {
               console.log("all field required");
               return res.status(400).json({ message: "username required" });
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
          return res.status(201).json({ lecturesData, message: "data fetched" });
     } catch (error) {
          return res.status(404).json({ message: "data fetch error" });
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
          console.log("run2");
          let lectureObjectForUpdatePin = await BranchLectureInfoSchema.findOne({
               _id: new mongoose.Types.ObjectId(objectId),
          });
          // check the target lecture is corrosponding to teacher or not meaning no other teacher can not coordinate another lecture
          if (!lectureObjectForUpdatePin) {
               console.log("data not found at submit PIN");
               return res.status(400).json({ message: "All field mandotory" });
          }
          console.log("run2");
          console.log("Creating new class object ", lectureObjectForUpdatePin);
          if (lectureObjectForUpdatePin.subjectsData[index].status === "pending") {
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
                         // "subjectsData.${index}.status": "running",
                         // "subjectsData.${index}.pin": pin,
                         // "subjectsData.${index}.classId": newClassObject._id,
                    },
               });
               console.log(available);
               console.log("run4");
               const newPin = available.subjectsData[index].pin;
               return res
                    .status(200)
                    .json({ newClassObject, newPin, message: "pin stored" });
          }
          console.log("run5");
     } catch (error) {
          console.log("pin does not stored");
          return res.status(404).json({ message: "pin does not stored", error });
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
               return res
                    .status(202)
                    .json({ message: "lecture is pending", searchedLectureDocument });
          } else if (
               searchedLectureDocument.subjectsData.status === "running" ||
               searchedLectureDocument.subjectsData.status === "complete"
          ) {
               let attendanceDocument = await AttendanceSchema.findOne({
                    _id: searchedLectureDocument.subjectsData.classId,
               });
               if (!attendanceDocument) {
                    console.log(
                         "Lecture info not found for classId:",
                         searchedLectureDocument.subjectsData.classId
                    );
               }
               return res.status(202).json({
                    searchedLectureDocument,
                    attendanceDocument,
                    message: "lecture is running or completed",
               });
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
     const { objectId, index } = req.body;
     console.log(
          objectId,
          index,
          "classId for submit its record from submitRecord function"
     );

     if (!objectId || !index) {
          return res
               .status(400)
               .json({ message: "All fields are required to submit record" });
     }
     console.log("objectId", objectId);
     console.log("index", index);
     const path = `subjectsData.${index}`;
     try {
          const updated = await BranchLectureInfoSchema.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(objectId) }, {
               $set: {
                    [`${path}.status`]: "complete",
               },
               $unset: {
                    [`${path}.classId`]: "",
               },
          }, { new: true });
          console.log("updated ", updated);
          if (!updated) {
               return res
                    .status(301)
                    .json({ message: "Class ID not found in subjectsData" });
          }
          return res
               .status(200)
               .json({ message: "Lecture rocorded successfully", data: updated });
     } catch (error) {
          console.error("error", error);
          return res.status(404).json({ error, message: "error from catch" });
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
               const updateStuAtte = await AttendanceSchema.findOneAndUpdate({ _id: classId }, { $addToSet: { record: req.user.username } }, // or $push
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
               return res.status(401).json({ message: "PIN not Matched" });
          }
     } catch (error) {
          console.log("error during submitting attendaces");
          return res.status(500).json({ message: "server error", error });
     }
};
export {
     UserSignUp,
     UserLogin,
     getProfileDetail,
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
cron.schedule("*/30 * * * *", async () => {
     // ⏰ Schedule it to run every night at 12:00 AM
     // cron.schedule("0 0 * * *", async () => {
     console.log("🕛 Running midnight reset...");
     await resetLectures();
});
// await resetLectures();