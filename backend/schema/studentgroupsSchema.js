import mongoose from "mongoose";

const GroupSchemas = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    unique: true, // one group per branch/year/section
    index: true
  },
  group: [
    {
      name: { type: String, required: true },
      username: { type: String, required: true },
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  ],
  createdAt: { type: Date, default: Date.now, index: true }
  // StudentsGroupId: {
  //      type: mongoose.Schema.Types.ObjectId,
  //      ref: "BranchLectureInfo",
  //      required: true
  // }
}, { timestamps: true });
// // 1. Find groups by name (O(1))
// GroupSchemas.index({ groupName: 1 });
// // 2. Find if user in group (MOST IMPORTANT - <5ms even 1000s members)
GroupSchemas.index({ "group.username": 1 });
// // 3. Find user's groups (critical for WhatsApp-style "my groups")
GroupSchemas.index({ "group._id": 1 });
// GroupSchemas.index({ "group.username": 1 }); // Your username format
// // 4. Recent groups
GroupSchemas.index({ createdAt: -1 });
const StudentGroupSchema = mongoose.model("studentgroups", GroupSchemas);
export default StudentGroupSchema;



// // User's all groups (<10ms)
// db.groups.find({ "group.username": "0114CS231023" });

// // Check if user in specific group (<1ms)
// db.groups.findOne({
//   groupName: "engineering-third-year...",
//   "group.username": "0114CS231023"
// });

// // Recent groups
// db.groups.find().sort({ createdAt: -1 }).limit(20);

