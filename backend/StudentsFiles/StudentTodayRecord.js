import mongoose from "mongoose";

const StudentDayRecordSchema = mongoose.Schema({}, { strict: false });

const StudentDayRecord = mongoose.model(
  "studentdayrecords",
  StudentDayRecordSchema
);
export default StudentDayRecord;
