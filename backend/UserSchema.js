import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
     name: { type: String, required: true },
     username: { type: String, required: true, unique: true },
     email: { type: String, unique: true },
     password: { type: String, required: true },
     role: { type: String, default: "student" },
     department: { type: String, required: true },
     year: { type: String, required: true },
     branch: { type: String, required: true },
     date: { type: Date, default: Date.now },
     phone: { type: Number, required: true, unique: true },
     photo: { type: String },
     currentLectureDocId: { type: mongoose.Schema.Types.ObjectId, ref: 'BranchLectureInfoSchema' },
}, { strict: false });

export default mongoose.model("User", UserSchema);
