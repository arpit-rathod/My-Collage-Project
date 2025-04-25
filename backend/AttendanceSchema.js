import mongoos from "mongoose";

const AttendanceSchema = mongoos.Schema({},{strict:false});

export default mongoos.model("Attendance", AttendanceSchema);