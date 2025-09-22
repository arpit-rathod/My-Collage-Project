import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
     name: { type: String, required: true },
     username: { type: String, required: true, unique: true },
     email: { type: String, unique: true },
     password: { type: String, required: true },
     date: { type: Date, default: Date.now },
     phone: { type: Number, required: true, unique: true },
     photo: { type: String },
}, { strict: false });

const User = mongoose.model("User", UserSchema);

const studentSchema = new mongoose.Schema({

     department: { type: String, required: true },
     year: { type: String, required: true },
     branch: { type: String, required: true },
     currentLectureDocId: { type: mongoose.Schema.Types.ObjectId, ref: 'BranchLectureInfoSchema' },
     role: { type: String, default: "student" },
});

const teacherSchema = new mongoose.Schema({
     qualification: { type: String },
     subjects: { type: String },
});
const StudentValidator = User.discriminator("student", studentSchema);
const TeacherValidator = User.discriminator("teacher", teacherSchema);
export { User, StudentValidator, TeacherValidator };