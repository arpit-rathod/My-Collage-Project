import mongoose from "mongoose";

const submitRecord = mongoose.Schema({}, { strict: false });

export default mongoose.model("attendances", submitRecord);
