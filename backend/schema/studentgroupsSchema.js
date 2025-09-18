import mongoose from "mongoose";

const StudentGroupSchemas = new mongoose.Schema({
     group_name: {
          type: String,
          required: true,
          unique: true // one group per branch/year/section
     },
     group: [
          {
               name: { type: String, required: true },
               username: { type: String, required: true }
          }
     ],
     // StudentsGroupId: {
     //      type: mongoose.Schema.Types.ObjectId,
     //      ref: "BranchLectureInfo",
     //      required: true
     // }
}, { timestamps: true });
const StudentGroupSchema = mongoose.model("StudentGroup", StudentGroupSchemas);
export default StudentGroupSchema;