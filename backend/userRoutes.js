import User from "./UserSchema.js";
import Attendances from "./AttendanceSchema.js";
// import BranchLectureInfo from ".//StudentsFiles/BranchLectureInfoSchema.js";
import subRecordSchema from "./schema/submitRecord.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { io } from "./index.js";
// import BranchLectureInfoSchema from ".//StudentsFiles/BranchLectureInfoSchema.js";
import StudentDayRecord from ".//StudentsFiles/StudentTodayRecord.js";
import mongoose from "mongoose";
import cron from "node-cron";
import BranchLectureInfoSchema from "./StudentsFiles/BranchLectureInfoSchema.js"; // path to your model
const getProfileDetail = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  const { username } = req.query;
  // console.log(username);

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
  try {
    const { username } = req.query;
    const user = await User.findOne({ username: username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "user details not found" });
    }
    return res.status(200).json({ user, message: "user found" });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};
const UserLogin = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  console.log("login function run allowed this origin");
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      console.log("all field are mandotory");
      return res.status(404).json("all field are mandotory");
    }

    const availableUser = await User.findOne({ username: username });
    if (!availableUser) {
      console.log("user NOT available for login ", availableUser);
      return res.status(404).json("no account found for this username");
    }
    console.log("user available for login ", availableUser);
    if (
      availableUser &&
      (await bcrypt.compare(password, availableUser.password))
    ) {
      console.log("user matched");
      const token = jwt.sign(
        {
          userAvailable: {
            username: availableUser.username,
            id: availableUser._id,
            role: availableUser.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET
      );
      console.log(token);
      return res.status(200).json({
        name: availableUser.name,
        username: availableUser.username,
        token: token,
      });
    } else {
      console.log();
      console.log(`password not matched for ${username}`);

      return res
        .status(201)
        .json({ message: `password not matched for ${username}` });
    }
  } catch (error) {
    return res.status(404).json({ error, message: "catch error" });
  }
};
const UserSignUp = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  try {
    // console.log("try");
    const bodyData = req.body;
    // console.log(bodyData);
    const username = bodyData.username;
    const newPassward = bodyData.password;

    if (!username || !newPassward) {
      return res.status(400).json({ message: "All field are mandotory" });
    }
    // console.log(username + " " + newPassward);

    const IfAvailable = await User.findOne({ username: username });
    console.log("present data " + IfAvailable);
    if (IfAvailable) {
      console.log("username already available");
      return res.status(200).json({ message: "username already available" });
    }
    const hashedPassword = await bcrypt.hash(newPassward, 1);
    // console.log(hashedPassword);
    const newCreatedUser = new User({
      username: username,
      password: hashedPassword,
    });
    // console.log(newCreatedUser);
    await newCreatedUser.save();

    return res.status(200).json({
      message: "User Created successfully",
      user: { _id: newCreatedUser._id, username: newCreatedUser.username },
    });
  } catch (error) {
    return res.status(404).json({ message: "catch run during signup", error });
  }
};
// for student
const getLecturesStatus = async (req, res) => {
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  console.log("getLecturesStatus function run ");
  // res.header("Access-Control-Allow-Origin", "*");
  const token = req.headers.authorization;
  console.log(token);

  if (!token) return res.status(401).json({ message: "unauthorized user" });

  try {
    const { year, branch, username } = req.query;
    // console.log(year + " " + branch);
    if (!year || !branch || !username) {
      console.log("all field required");
      return res.status(400).json({ message: "subCode required" });
    }
    const date = new Date().toISOString().split("T")[0];
    const lecturesData = await BranchLectureInfoSchema.findOne({
      year,
      branch,
    });
    const subjectsData = lecturesData.subjectsData;
    if (!lecturesData || !subjectsData) {
      console.log("data not found");
      return res.status(201).json({ message: "data not found" });
    }
    const RecordOfStudent = await StudentDayRecord.findOne({ username, date });
    if (!RecordOfStudent) {
      console.log("student today's record not exists ", RecordOfStudent);
    }
    const attendance = RecordOfStudent?.attendance;
    return res
      .status(201)
      .json({ lecturesData, attendance, message: "data fetched" });
  } catch (error) {
    return res.status(404).json({ message: "data fetch error" });
  }
};
// for teacher
const getLecturesOfTeacher = async (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  try {
    console.log("getLecturesOfTeacher run ");
    const { username } = req.query;
    console.log(username);
    if (!username) {
      console.log("all field required");
      return res.status(400).json({ message: "username required" });
    }
    const lecturesData = await BranchLectureInfoSchema.aggregate([
      {
        $match: { "subjectsData.username": username }, // Match documents that have this teacher
      },
      {
        $project: {
          department: 1,
          year: 1,
          branch: 1,
          totalStudents: 1,
          subjectsData: {
            $filter: {
              input: "$subjectsData",
              as: "subject",
              cond: { $eq: ["$$subject.username", username] }, // Keep only matching subjects
            },
          },
        },
      },
    ]);

    // console.log(lecturesData);
    return res.status(201).json({ lecturesData, message: "data fetched" });
  } catch (error) {
    return res.status(404).json({ message: "data fetch error" });
  }
};
// for teacher
const submitPIN = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  try {
    const {
      department,
      year,
      branch,
      subCode,
      subName,
      pin,
      teacher,
      username,
    } = req.body;

    console.log(req.body);
    if (
      !department ||
      !year ||
      !branch ||
      !subCode ||
      !subName ||
      !pin ||
      !teacher ||
      !username
    ) {
      console.log(" All field mandotory");
      return res.status(400).json({ message: "All field mandotory" });
    }
    console.log("run2");
    const availbleData = await BranchLectureInfoSchema.findOne({
      year,
      branch,
      "subjectsData.subCode": subCode,
    });
    console.log("run3");
    console.log(availbleData);
    console.log(" status is running and");
    if (!availbleData) {
      return res.status(200).json({
        message:
          "This class is alreadey running, So please submit this before one more class",
      });
    }
    console.log("run4");
    const newClassObject = new subRecordSchema({
      department: department,
      year: year,
      branch: branch,
      subCode: subCode,
      subName: subName,
      teacher: teacher,
      username: username,
      date: new Date().toISOString().split("T")[0],
      record: [],
      remark: "remark",
      totalStudents: 0,
      totalFeedback: "totalFeedback",
      totalStars: "totalStars",
    });

    console.log("run5");
    await newClassObject.save();
    console.log("new class object", newClassObject);
    // new class object created
    const available = await BranchLectureInfoSchema.findOneAndUpdate(
      {
        year,
        branch,
        "subjectsData.subCode": subCode,
      },
      {
        $set: {
          "subjectsData.$.status": "running",
          "subjectsData.$.pin": pin,
          "subjectsData.$.classId": newClassObject._id,
        },
      }
    );
    return res
      .status(201)
      .json({ newClassObject, available, message: "pin stored" });
  } catch (error) {
    console.log("pin does not stored");
    return res.status(404).json({ message: "pin does not stored", error });
  }
};
// for teacher
const getRunningClassDetails = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  try {
    console.log("classId");
    const { classId } = req.query;
    console.log(classId);
    if (!classId) {
      console.log("All field mandotory");
      return res.status(400).json({ message: "All field mandotory" });
    }
    let _id = classId;
    console.log(_id);
    const available = await Attendances.findOne({ _id });
    console.log(available);
    return res.status(201).json({ available, message: "running class data" });
  } catch (error) {
    console.log("error in running class data ");
    return res
      .status(404)
      .json({ message: "error while fetching running class details", error });
  }
};
// for teacher
const submitRecord = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  const { classId } = req.body;
  console.log(
    classId,
    "classId for submit its record from submitRecord function"
  );

  if (!classId) {
    return res
      .status(400)
      .json({ message: "All fields are required to submit record" });
  }
  const classObjectId = new mongoose.Types.ObjectId(classId);
  console.log("class id", classObjectId);
  // console.log(updated);
  try {
    const updated = await BranchLectureInfoSchema.findOneAndUpdate(
      { "subjectsData.classId": classObjectId },
      {
        $set: { "subjectsData.$.status": "complete" },
        $unset: { "subjectsData.$.pin": "", "subjectsData.$.classId": "" },
      },
      { new: true }
    );
    console.log("updated ", updated);
    if (!updated) {
      return res
        .status(404)
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
const submitAttendance = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  try {
    const {
      department,
      year,
      branch,
      subCode,
      classId,
      PIN,
      username,
      yearBranchObjectId,
      studentName,
    } = req.body;
    if (
      !year ||
      !branch ||
      !subCode ||
      !PIN ||
      !classId ||
      !yearBranchObjectId ||
      !username ||
      !studentName
    ) {
      console.log("all field are mandotory");
      return res.status(400).json({ message: "All Field Mandotory" });
    }
    const date = new Date().toISOString().split("T")[0];
    console.log(date);

    console.log("run 1");
    const result = await BranchLectureInfoSchema.findOne(
      {
        _id: yearBranchObjectId,
        "subjectsData.subCode": subCode,
      },
      { "subjectsData.$": 1 }
    );
    console.log(result);
    console.log("run 2");
    if (!result || !result.subjectsData || result.subjectsData.length === 0) {
      return res.status(404).json({ message: "Subject not found" });
    }
    console.log("run 3");
    if (result.subjectsData[0].pin == PIN) {
      console.log("pin matched");
      const updateStuAtte = await subRecordSchema.findOneAndUpdate(
        { _id: classId },
        { $addToSet: { record: username } }, // or $push
        { new: true }
      );
      console.log("attendance updated ", updateStuAtte.record);

      if (!updateStuAtte) {
        console.log("class not found to store student attendance");
        return res.status(404).json({ message: "Class record not found" });
      }
      var dayRecord = await StudentDayRecord.findOne({
        username,
        date,
      });
      console.log("dayRecord retrieved from db ", dayRecord);
      if (!dayRecord) {
        console.log("this is today's first lecture of student");
        dayRecord = new StudentDayRecord({
          studentName: studentName,
          username: username,
          date: date,
          attendance: { [subCode]: true },
        });
        await dayRecord.save();
        console.log("run 3.5");
      } else {
        console.log("this is another lecture of student");
        if (!dayRecord.attendance) {
          dayRecord.attendance = {};
        }
        dayRecord.attendance[subCode] = true;
        await dayRecord.save();
        console.log("run 3.6");
      }
      console.log("day record saved", dayRecord);
      // console.log("run 4");

      io.emit("trubaId", {
        studentName: studentName,
        username: username,
        status: "present",
      });
      console.log("socket io run at submit attendance ");
      return res
        .status(200)
        .json({ message: "attendance submited successfully ", dayRecord });
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
  getProfileDetail,
  getProfileAllDetails,
  UserLogin,
  UserSignUp,
  getLecturesStatus,
  submitPIN,
  postYearBranchInfo,
  submitRecord,
  submitAttendance,
  getLecturesOfTeacher,
  getRunningClassDetails,
};
const resetLectures = async () => {
  try {
    await BranchLectureInfoSchema.updateMany(
      {},
      {
        $set: {
          "subjectsData.$[].status": "pending",
        },
        $unset: {
          "subjectsData.$[].pin": "",
          "subjectsData.$[].classId": "",
        },
      }
    );
    console.log("✅ Lectures reset.");
  } catch (err) {
    console.error("❌ Error:", err);
  }
};
// Schedule it to run after 1 minute
// cron.schedule('*/1 * * * *', async () => {
// ⏰ Schedule it to run every night at 12:00 AM
cron.schedule("0 0 * * *", async () => {
  console.log("🕛 Running midnight reset...");
  await resetLectures();
});
