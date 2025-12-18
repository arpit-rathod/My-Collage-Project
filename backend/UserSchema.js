import mongoose from "mongoose";
function getCurrentSession() {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12 (Jan=1)
  const year = now.getFullYear();

  if (month > 7) {
    // Aug-Dec: current year to next year
    return `${year}-${year + 1}`;
  } else {
    // Jan-Jul: previous year to current year
    return `${year - 1}-${year}`;
  }
}

/* =========================
   Reusable Sub-Schemas
   ========================= */
// Device tracking (डिवाइस पहचान)
const DeviceSchema = new mongoose.Schema({
  deviceId: String,          // unique device id
  userAgent: String,         // browser / OS
  ip: String,                // last IP
  lastSeen: Date,
  deviceTokenHash: String    // hashed device token
}, { _id: false });

// Session / Refresh token storage (सेशन प्रबंधन)
const SessionSchema = new mongoose.Schema({
  jti: { type: String, index: true }, // JWT ID
  refreshTokenHash: String,           // hashed refresh token
  issuedAt: Date,
  expiresAt: Date,
  deviceId: String
}, { _id: false });
/* =========================
   Base User Schema
   ========================= */
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // College roll / username
  username: { type: String, required: true, unique: true, index: true, uppercase: true, minlegth: 6, maxlength: 14, match: /^[a-zA-Z0-9]+$/ },
  email: { type: String, unique: true, sparse: true, index: true, trim: true, lowercase: true, },
  password: { type: String, required: true, trim: true, }, // bcrypt hash
  phone: { type: String, unique: true, trim: true, }, // string to keep formatting
  photo: { type: String }, // profile photo URL

  role: {
    type: String,
    enum: ["student", "teacher", "admin", "principle", "hod"],
    required: true
  },
  isActive: { type: Boolean, default: true },
  deletedAt: { type: Date, default: null },
  lastLogin: Date,
  lastActiveAt: Date
}, {
  strict: false,
  timestamps: true,     // createdAt, updatedAt
  discriminatorKey: "__t" // auto-added: student / teacher
});
const User = mongoose.model("User", UserSchema);

//  Student Schema
const StudentSchema = new mongoose.Schema({
  /* ---- Academic Identity ---- */
  enrollmentNumber: { type: String, unique: true, sparse: true },
  departmentID: { type: mongoose.Schema.Types.ObjectId, ref: 'departments', required: true, index: true },
  branchID: { type: mongoose.Schema.Types.ObjectId, ref: 'branches', required: true },
  // RECOMMENDED naming
  batch: { type: String, index: true },        // "2022-2026"
  admissionYear: { type: Number, index: true },// 2022
  currentSemester: { type: Number, default: 1 },            // 6
  year: { type: String, default: "first-year" },                       // "third-year"
  session: { type: String, default: getCurrentSession() },                    // "2024-2025"
  currentLectureDocId: { type: mongoose.Schema.Types.ObjectId, ref: 'BranchLectureInfoSchema' },

  /* ---- Attendance (Fast UI use) ---- */
  // attendanceSummary: {
  //   totalDays: { type: Number, default: 0 },
  //   present: { type: Number, default: 0 },
  //   absent: { type: Number, default: 0 },
  //   percentage: { type: Number, default: 0 }
  // },

  /* ---- Courses & Grades ---- */
  enrolledCourses: [{
    courseId: mongoose.Schema.Types.ObjectId,
    semester: Number,
    status: String
  }],

  grades: [{
    semester: Number,
    cgpa: Number
  }],

  /* ---- Security ---- */
  sessions: [SessionSchema], // refresh tokens (hashed)
  devices: [DeviceSchema],

  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },

  resetPasswordTokenHash: String,
  resetPasswordExpires: Date,

  /* ---- Personal Info ---- */
  dateOfBirth: Date,
  gender: String,
  bloodGroup: String,

  guardian: {
    name: String,
    relationship: String,
    phone: String
  },

  address: {
    line1: String,
    city: String,
    state: String,
    pincode: String
  },

  /* ---- Profile & Placement ---- */
  resumeUrl: String,
  portfolioLinks: {
    github: { type: String, default: null },
    linkedin: { type: String, default: null },
    website: { type: String, default: null }
  },
  socialLinks: {
    instagram: { type: String, default: null },
    fachebook: { type: String, default: null },
    x: { type: String, default: null },
    whatsapp: { type: String, default: null }
  },

  skills: [String],
  achievements: [String],

  /* ---- Preferences ---- */
  preferences: {
    language: { type: String, default: "en" },
    timezone: { type: String, default: "Asia/Kolkata" }
  },

  privacySettings: {
    showEmail: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: false }
  },
  adminRemarks: String
}, { strict: false, });
/* =========================
Teacher Schema
========================= */
const TeacherSchema = new mongoose.Schema({
  qualification: String,
  subjects: [String], // changed to array (better)
  department: String,
  experienceYears: Number
}, { strict: false, });

const StudentValidator = User.discriminator("student", StudentSchema);
const TeacherValidator = User.discriminator("teacher", TeacherSchema);
export { User, StudentValidator, TeacherValidator };


// import mongoose from "mongoose";
// const UserSchema = mongoose.Schema({
//   name: { type: String, required: true },
//   username: { type: String, required: true, unique: true },
//   email: { type: String, unique: true },
//   password: { type: String, required: true },
//   date: { type: Date, default: Date.now },
//   phone: { type: Number, required: true, unique: true },
//   photo: { type: String },
// }, { strict: false });

// const User = mongoose.model("User", UserSchema);

// const studentSchema = new mongoose.Schema({
//   department: { type: String, required: true },
//   year: { type: String, required: true },
//   branch: { type: String, required: true },
//   currentLectureDocId: { type: mongoose.Schema.Types.ObjectId, ref: 'BranchLectureInfoSchema' },
//   role: { type: String, default: "student" },
//   session: { type: String, default: "student" },

// });

// const teacherSchema = new mongoose.Schema({
//   qualification: { type: String },
//   subjects: { type: String },
// });
// const StudentValidator = User.discriminator("student", studentSchema);
// const TeacherValidator = User.discriminator("teacher", teacherSchema);
// export { User, StudentValidator, TeacherValidator };


