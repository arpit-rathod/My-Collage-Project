import { Schema, model } from 'mongoose';

// Schema 1: Lectures
const LectureSchema = new Schema({
     department: { type: String, required: true, index: true },
     year: { type: String, required: true, index: true },
     branch: { type: String, required: true, index: true },
     subCode: { type: String, required: true, index: true },
     subName: { type: String, required: true },
     teacher: { type: String, required: true },
     teacherUsername: { type: String, required: true, index: true },
     date: { type: Date, required: true, index: true },
     startTime: { type: String, required: true },
     endTime: { type: String, required: true },
     remark: String,
     totalStudents: Number,
     presentCount: Number,
     absentCount: Number,
     createdAt: { type: Date, default: Date.now }
});


// Schema 2: Student Attendance (denormalized for speed)
const StudentAttendanceSchema = new Schema({
     studentUsername: { type: String, required: true, index: true },
     lectureId: { type: Schema.Types.ObjectId, ref: 'Lecture', required: true, index: true },

     // Denormalized fields (no join needed!)
     date: { type: Date, required: true, index: true },
     subCode: { type: String, required: true, index: true },
     subName: { type: String, required: true },
     teacher: { type: String, required: true },
     department: { type: String, required: true },
     year: { type: String, required: true },
     branch: { type: String, required: true },
     startTime: String,
     endTime: String,

     status: { type: String, enum: ['present', 'absent'], required: true, index: true },
     markedAt: { type: Date, default: Date.now }
});




// Compound indexes for complex queries
StudentAttendanceSchema.index({ studentUsername: 1, date: -1 });
StudentAttendanceSchema.index({ studentUsername: 1, subCode: 1 });
StudentAttendanceSchema.index({ studentUsername: 1, status: 1 });
StudentAttendanceSchema.index({ lectureId: 1, status: 1 });

// Prevent duplicate records
StudentAttendanceSchema.index({ studentUsername: 1, lectureId: 1 }, { unique: true });

const Lecture = model('Lecture', LectureSchema);
const StudentAttendance = model('StudentAttendance', StudentAttendanceSchema);
