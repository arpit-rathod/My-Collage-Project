import mongoose from "mongoose";

const ClassRoomSchema = new mongoose.connect({}, { strict: false });

export default mongoose.model("attendances", ClassRoomSchema);
