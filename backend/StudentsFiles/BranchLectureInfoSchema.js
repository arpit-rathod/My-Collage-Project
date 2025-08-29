import mongoose from "mongoose";

const BranchLectureInfoSchema = mongoose.Schema({}, { strict: false });

export default mongoose.model(
  "BranchLectureInfoSchema",
  BranchLectureInfoSchema
);
