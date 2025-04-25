import mongoose from "mongoose";

const UserSchema = mongoose.Schema({}, { strict: false });

export default mongoose.model("User", UserSchema);
