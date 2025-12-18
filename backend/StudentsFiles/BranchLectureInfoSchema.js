import mongoose from "mongoose";
const BranchLectureInfoSchema = mongoose.Schema({
     campusID: {type: mongoose.Schema.Types.ObjectId,
         ref: "campus",
         index: true},
     departmentID: {type: mongoose.Schema.Types.ObjectId,
         ref: "departments",
         required: true,
         index: true},
    branchID: {
          type: mongoose.Schema.Types.ObjectId,
              ref: "branches",
              required: true,
              index: true},
     year: { type: String, required: true },
     subjectsData: [],
     totalStudents: { type: Number, required: true },
     previousAttendanceCount: { type: Number, default: 0, required: true },
     studentGroupDocId: { type: mongoose.Schema.Types.ObjectId, default:new mongoose.Types.ObjectId(), ref: "StudentGroup" }
     
}, { strict: false });

const subjectsDataValidator = new mongoose.Schema({
     subName: { type: String ,required: true},
     subCode: { type: String, required: true },
     teacher: { type: String, required: true },
     username: { type: String, required: true },
     status: { type: String, default: "pending", required: true },
     roomId: { type: String, default: new mongoose.Types.ObjectId().toString(), required: true },
     teacherRoomId: { type: String, default: new mongoose.Types.ObjectId().toString(), required: true },
});
export {subjectsDataValidator};
export default mongoose.model(
     "BranchLectureInfoSchema",
     BranchLectureInfoSchema
);

// const LectureSchema = new mongoose.Schema({
     //      department: String,
     //      students: [{ type: mongoose.Schema.Types.ObjectId, ref: "StudentGroup" }]
     // });
     
     
     
     // then to access the students field
     // const lectureDoc = await LectureSchema.findById(lectureId).populate("students");
     // console.log(lectureDoc.students); // already contains student group docs
     