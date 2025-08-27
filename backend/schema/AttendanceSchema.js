import mongoose from "mongoose";

const AttendanceSchema = mongoose.Schema({}, { strict: false });

export default mongoose.model("attendances", AttendanceSchema);
