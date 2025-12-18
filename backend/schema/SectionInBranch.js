import mongoose from "mongoose";
const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, uppercase: true, index: true },
  isActive: { type: Boolean, default: true, index: true },

  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
    index: true,
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
    index: true,
  },
  campusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campus",
    required: true,
    index: true,
  },
}, { timestamps: true });

sectionSchema.index(
  { campusId: 1, departmentId: 1, branchId: 1, code: 1 },
  { unique: true }
);
sectionSchema.index({ branchId: 1, isActive: 1, name: 1 });

export const Section = mongoose.model("Section", sectionSchema);
