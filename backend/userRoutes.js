import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { io } from "./index.js";
//schemas
import { User, StudentValidator, TeacherValidator } from "./UserSchema.js";
import AttendanceSchema from "./schema/AttendanceSchema.js";
import mongoose from "mongoose";
import cron from "node-cron";
import BranchLectureInfoSchema, { subjectsDataValidator } from "./StudentsFiles/BranchLectureInfoSchema.js"; // path to your model
import StudentGroupSchema from "./schema/studentgroupsSchema.js";

const ObjectId = mongoose.Types.ObjectId;

const errorHandlerAndReturnError = async (res, err) => {
  if (err.code === 11000) {
    console.error("Duplicate key error:", err.keyValue);
    console.log(Object.keys(err.keyValue));

    // Example: if 'username' is unique
    let duplicateKeys = Object.keys(err.keyValue);
    return res.status(400).json({
      success: false,
      message: `${duplicateKeys[0]} ${err.keyValue[duplicateKeys[0]]} is already allocated and used!`
    });
  }
  console.error("Error in /add-student:", err);
  return res.status(500).json({ err, error: err.message });

}


const getProfileAllDetails = async (req, res) => {
  try {
    const username = req.user.username;
    const userProfile = await User.aggregate([
      { $match: { "username": username } },
      {
        $project: {
          name: 1,
          username: 1,
          email: 1,
          phone: 1,
          deparmentID: 1,
          branchID: 1,
          year: 1,
        }
      }
    ]);
    if (userProfile) {
      //user,
      return res.status(200).json({ user: userProfile[0], message: "user found" });
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
  console.log("login function run");
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      console.log("all field are mandotory");
      return res.status(400).json({ ress: req.body, message: "all field are mandotory" });
    }
    const availableUser = await User.findOne({ username: username });
    if (!availableUser) {
      console.log("user not available for login ", username);
      return res.status(404).json({ usernameMsg: "User not found", passwordMsg: "", message: "username not found" });
    }
    console.log("user available for login ", availableUser);
    const lectureDocId = availableUser?.currentLectureDocId;
    console.log("current lecture id", lectureDocId);
    if (
      availableUser &&
      (await bcrypt.compare(password, availableUser.password))
    ) {
      console.log("user matched");
      // const studentProfile = await StudentValidator.findOne({ username: username });
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
      console.log("payload", payload);

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
        sameSite: "lax", // if same origin user lax other wise use none
        // sameSite: process.env.NODE_ENV === "production" ? "None" : "lax", // if same origin user lax other wise use none
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
        // domain: process.env.NODE_ENV === "production" ? ".onrender.com" : "10.195.223.69:5173"  // Only for production subdomains
        domain: process.env.NODE_ENV === "production" ? ".onrender.com" : "localhost"  // Only for production subdomains
        // domain: "http://10.195.223.69:5173"
      });
      //Cookie MUST be stored on: localhost domain(where backend runs)
      // Cookie CANNOT be stored on: 172.19.144.1 domain(that's impossible!)
      // Frontend - After login
      // res.cookie("uiRole_token", uiRole_token, {
      //   httpOnly: false,
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "Lax",
      //   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      // });

      // Note : cookie is not accessible in JS so set cookie manually for UI role based rendering
      // res.cookie("uiRole_token", uiRole_token, {
      //      httpOnly: false,
      //      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      //      secure: process.env.NODE_ENV === "production", // Set true for HTTPS
      //      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // });

      // Backend - After setting cookie
      console.log("Cookie headers sent:", res.getHeaders()['set-cookie']);
      console.log("token saved in cookies at login");
      return res.status(200).json({
        message: "Login successful",
        uiRole_token: uiRole_token,
      });
    } else {
      console.log(`password not matched for ${username}`);
      return res
        .status(404)
        .json({ usernameMsg: "", passwordMsg: "Incorrect Password", message: `password not matched for ${username}` });
    }
  } catch (error) {
    return res.status(500).json({ error, message: "catch error" });
  }
};
const UserSignUp = async (req, res) => {
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
  try {
    console.log("getLecturesOfTeacher run ");
    console.log(req.user);
    const { username } = req.user;
    console.log("finding lectures for teacher = ", username);
    if (!username) {
      console.log("all field required");
      return res.status(400).json({ message: "username required in token" });
    }
    // const branch = "CSE A";
    // const lecturObject = await BranchLectureInfoSchema.findOne({
    //      branch: branch,
    // });
    // console.log(lecturObject.year, lecturObject.branch);

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


    let searchedLectureDocument = await BranchLectureInfoSchema.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(objectId) },
      },
      {
        $project: {
          _id: 1,
          departmentID: 1,
          year: 1,
          branchID: 1,
          totalStudents: 1,
          previousAttendanceCount: 1,
          subjectsData: { $arrayElemAt: ["$subjectsData", Number(index)] },
        },
      },
      {
        // Populate departmentID
        $lookup: {
          from: 'departments',  // Collection name (lowercase plural)
          localField: 'departmentID',
          foreignField: '_id',
          as: 'departmentDoc',
          pipeline: [{ $project: { departmentName: 1, code: 1 } }]  // Select only needed fields
        }
      },
      {
        // Populate branchID
        $lookup: {
          from: 'branches',
          localField: 'branchID',
          foreignField: '_id',
          as: 'branchDoc',
          pipeline: [{ $project: { branchName: 1, code: 1 } }]
        }
      },
      {
        // Populate campusID (if exists in schema)
        $lookup: {
          from: 'campus',
          localField: 'campusID',  // Add if your schema has it
          foreignField: '_id',
          as: 'campusDoc',
          pipeline: [{ $project: { campusName: 1, code: 1 } }]
        }
      },
      {
        $addFields: {
          department: { $arrayElemAt: ['$departmentDoc.departmentName', 0] },  // Single object
          branch: { $arrayElemAt: ['$branchDoc.branchName', 0] },
          campus: { $arrayElemAt: ['$campusDoc.campusName', 0] }
        }
      },
      {
        $project: {
          _id: 1,
          year: 1,
          totalStudents: 1,
          previousAttendanceCount: 1,
          subjectsData: 1,
          department: 1,
          branch: 1,
          campusName: 1,
        }
      },
      // departmentID, branchID, campusID, departmentDoc, branchDoc, campusDoc REMOVED
      { $limit: 1 },
    ]);
    // ///////////////////////////////////
    // let searchedLectureDocument = await BranchLectureInfoSchema.aggregate([{
    //   $match: { _id: new mongoose.Types.ObjectId(objectId) },
    // },
    // {
    //   $project: {
    //     _id: 1,
    //     departmentID: 1,
    //     year: 1,
    //     branchID: 1,
    //     totalStudents: 1,
    //     previousAttendanceCount: 1,
    //     subjectsData: { $arrayElemAt: ["$subjectsData", Number(index)] },
    //   },
    // },
    // { $limit: 1 },
    // ]);
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
        _id: searchedLectureDocument?.subjectsData?.classId,
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
const addBranchYearDoc = async (req, res) => {
  try {
    const docObject = req.body;

    // Basic validation
    // if (!docObject.department || !docObject.degree || !docObject.year || !docObject.branch || !docObject.totalStudents) {
    //   return res.status(400).json({ error: "Missing required fields." });
    // }

    const newStudentsGroup = new StudentGroupSchema({
      groupName: `${docObject.department}-${docObject.year}-${docObject.branch}`,
      group: [],
    });
    await newStudentsGroup.save();
    // Create new document
    const newLecture = new BranchLectureInfoSchema({
      ...docObject,
      subjectsData: [], // Empty initially
      studentGroupDocId: ObjectId.isValid(newStudentsGroup._id) ? newStudentsGroup._id : undefined // Reference to StudentGroupSchema
    });

    await newLecture.save();

    return res.status(201).json({
      message: "Lecture document created successfully.",
      data: newLecture
    });
  } catch (err) {
    return await errorHandlerAndReturnError(res, err);
  }
};
const addSubjectToBranchYear = async (req, res) => {
  try {
    const { department, degree, year, branch, subjectObject } = req.body;
    const subject = subjectObject; // { subName, subCode, username, teacher, pin (optional) }
    if (!department || !degree || !year || !branch || !subject.subName || !subject.subCode || !subject.username || !subject.teacher) {
      return res.status(400).json({ error: "All fields (department, degree, year, branch, subName, subCode, username, teacher) are required" });
    }
    console.log("Adding subject to:", { department, degree, year, branch });
    // ✅ Find the branch lecture doc
    const targetDoc = await BranchLectureInfoSchema.findOne({ department, year, branch });
    if (!targetDoc) {
      return res.status(404).json({ error: "Branch lecture info not found" });
    }
    console.log("Found target document:", targetDoc._id);
    // ✅ Check if subject already exists (by subCode or subName)
    const duplicate = targetDoc.subjectsData.find(s =>
      s.subCode.toLowerCase() === subject.subCode.toLowerCase() ||
      s.subName.toLowerCase() === subject.subName.toLowerCase()
    );

    if (duplicate) {
      console.log("Duplicate subject found:", duplicate);
      return res.status(400).json({ error: "Subject already exists in this branch" });
    }
    // await subjectsDataValidator(subject);
    const validSubject = new mongoose.Document(subject, subjectsDataValidator);

    // ✅ Push new subject
    targetDoc.subjectsData.push(validSubject);
    console.log("Updated subjectsData pushed:");
    // Save updated doc
    await targetDoc.save();
    console.log("Target document saved with new subject.");
    return res.status(200).json({
      message: "Subject added successfully",
      data: targetDoc
    });

  } catch (err) {
    console.error("Error adding subject:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const addStudentProfile = async (req, res) => {
  try {
    const { username, name, department, year, branch, password, phone, photo, role } = req.body;

    // Step 1: Find lectureDoc for department/year/branch
    console.log("Finding lecture document for:", { department, year, branch });

    const lectureDoc = await BranchLectureInfoSchema.findOne({ department, year, branch });
    if (!lectureDoc) {
      return res.status(404).json({ message: "Lecture document not found" });
    }
    const hashedPassword = await bcrypt.hash(password, 1);
    // Step 2: Create student with reference to lectureDoc
    const newStudent = new User({
      name: name,
      username,
      password: hashedPassword,
      role: role || "student",
      department,
      year,
      branch,
      phone,
      photo,
      currentLectureDocId: lectureDoc._id
    });

    await newStudent.save();

    // Step 3: Find studentGroup doc by reference in lectureDoc
    const studentGroupId = lectureDoc.studentGroupDocId;
    console.log("Finding student group document with ID:", studentGroupId);

    const studentGroupDoc = await StudentGroupSchema.findOne({ _id: studentGroupId });

    if (!studentGroupDoc) {
      return res.status(404).json({ message: "Student group not found" });
    }

    // Step 4: Push student into group array if not already present
    const alreadyExists = studentGroupDoc.group.some(s => s.username === username);
    if (!alreadyExists) {
      studentGroupDoc.group.push({ name, username });
      await studentGroupDoc.save();
    }
    console.log("Student added as user and to group:", studentGroupDoc.group);

    res.status(201).json({
      message: "Student created successfully",
      student: newStudent
    });

  } catch (err) {
    if (err.code === 11000) {
      console.error("Duplicate key error:", err.keyValue);
      console.log(Object.keys(err.keyValue));

      // Example: if 'username' is unique
      let duplicateKeys = Object.keys(err.keyValue);
      return res.status(400).json({
        success: false,
        message: `${duplicateKeys[0]} ${err.keyValue[duplicateKeys[0]]} is already allocated and used!`
      });
    }
    console.error("Error in /add-student:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  };
}
// admin get students by username deparment branch
const searchStudent = async (req, res) => {
  console.log("search students fun run ", req.query);
  const { username, department, branch, year } = req.query;

  let matchQuery = {};

  if (username.length > 0) {
    matchQuery.username = { $regex: username, $options: "i" };
  }
  if (department.length > 0) {
    matchQuery.department = department;
  }
  if (branch.length > 0) {
    matchQuery.branch = branch;
  }
  if (year.length > 0) {
    matchQuery.year = year;
  }
  console.log(matchQuery);
  if (Object.keys(matchQuery).length < 1) {
    console.log(matchQuery);
    return res.status(400).json({ message: "No query provided" })
  }
  try {     // Now use aggregation
    const results = await User.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: "branchlectureinfoschemas",   // 👈 collection name in MongoDB (always plural, lowercase)
          localField: "currentLectureDocId",  // field in User
          foreignField: "_id",                // field in BranchLectureInfoSchema
          as: "lectureInfo"                   // output field
        }
      },
      {
        $unwind: {
          path: "$lectureInfo", preserveNullAndEmptyArrays: true
        } // flatten array (so you get one object instead of array)
      },
      {
        $project: {
          _id: 1,
          username: 1,
          name: 1,
          // father:1,
          phone: 1,
          department: "$lectureInfo.department", // pulling from joined collection
          branch: "$lectureInfo.branch",
          degree: "$lectureInfo.degree"
        }
      }
    ]);

    // console.log(results);
    res.status(200).json({ results, message: "res successful" })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "internal server error" })
  }
}

// admin get a student full details for update on update page 
const studentAllData = async (req, res) => {
  console.log("get all data of student fun run ", req.query);
  const { id } = req.query;
  if (!ObjectId.isValid(id)) {
    console.log("object id is invalid");
    return res.status(400).json({ message: "No query provided" })
  }
  if (!id) {
    console.log(id);
    return res.status(400).json({ message: "No query provided" })
  }
  try {     // Now use aggregation
    const results = await User.aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "branchlectureinfoschemas",   // 👈 collection name in MongoDB (always plural, lowercase)
          localField: "currentLectureDocId",  // field in User
          foreignField: "_id",                // field in BranchLectureInfoSchema
          as: "lectureInfo"                   // output field
        }
      },
      {
        $unwind: {
          path: "$lectureInfo", preserveNullAndEmptyArrays: true
        } // flatten array (so you get one object instead of array)
      },
      {
        $project: {
          _id: 1,
          username: 1,
          name: 1,
          phone: 1,
          email: 1,
          // father:1,
          phone: 1,
          department: "$lectureInfo.department", // pulling from joined collection
          branch: "$lectureInfo.branch",
          degree: "$lectureInfo.degree",
          year: "$lectureInfo.year"
        }
      }
    ]);
    let object = results[0]
    const student = {
      username: object.username,
      name: object.name,
      phone: object.phone,
      email: object.email,
    }
    const academic = {
      department: object.department,
      degree: object.degree,
      branch: object.branch,
      year: object.year,
    }
    res.status(200).json({ student, academic, message: "res successful" })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "internal server error" })
  }
}

// mark as present for students
const presentAsMark = async (req, res) => {
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
        return res.status(400).json({ message: "Class record not found" });
      }
      console.log(result.subjectsData[0].teacherRoomId);
      io.to(result.subjectsData[0].teacherRoomId).emit("MarkAttByStudentEvent", {
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
// admin manually add student attendance
const addStudentAttendaceManually = async (req, res) => {
  const { bodyData } = req.body;
  console.log(bodyData);
  return res.status(200).json({ message: "student attendance marked successfully" });
}
// admin update student profile 
const updateStudentProfile = async (req, res) => {
  console.log("update student run ", req.params);
  const { studentId } = req.params;

  const updateData = req.body;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: 'Invalid student ID' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      studentId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    if (err.code === 11000) {
      console.error("Duplicate key error:", err.keyValue);
      console.log(Object.keys(err.keyValue));

      // Example: if 'username' is unique
      let duplicateKeys = Object.keys(err.keyValue);
      return res.status(400).json({
        success: false,
        message: `${duplicateKeys[0]} ${err.keyValue[duplicateKeys[0]]} is already allocated and used!`
      });
    }
    console.error("Error in /add-student:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
const updateStudentAcademicData = async (req, res) => {
  console.log("update student academic run ", req.params);
  const { studentId } = req.params;
  let degree = "bachelor of technology";
  const academicDetails = req.body;
  let matchQuery = {}
  if (academicDetails.department &&
    academicDetails.branch &&
    academicDetails.year &&
    academicDetails.degree
  ) {
    matchQuery.department = academicDetails?.department;
    matchQuery.branch = academicDetails?.branch;
    matchQuery.year = academicDetails?.year;
  } else {
    console.log("all field are required");
    return res.status(400).json({ message: "Failed : All fields are required to change academic Data" })
  }
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: 'Invalid student ID' });
  }
  try {
    console.log(matchQuery);
    const targetDepartDocArr = await BranchLectureInfoSchema.aggregate([
      { $match: matchQuery },
      {
        $project: {
          _id: 1,
        }
      }
    ]);
    const targetDepartDocId = targetDepartDocArr[0]?._id;
    console.log(targetDepartDocId);
    if (!targetDepartDocId) {
      return res.status(404).json({ message: 'Error : Document not found for this credentials' });
    }
    const studentDoc = await User.findByIdAndUpdate(
      { _id: new ObjectId(studentId) },
      { $set: { currentLectureDocId: targetDepartDocId } },
      { new: true, runValidators: true }
    );
    // console.log(studentDoc);
    return res.status(200).json({ message: "Successfully updated Academic Details" });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Error : Server error' });
  }
};

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
  addStudentProfile,
  addBranchYearDoc,
  addSubjectToBranchYear,
  searchStudent,
  studentAllData,
  updateStudentProfile,
  updateStudentAcademicData
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