import mongoose from "mongoose";
const branchSchema = new mongoose.Schema({
  branchName: { type: String, required: true, trim: true },
  code: { type: String, required: true, uppercase: true, index: true },
  isActive: { type: Boolean, default: true, index: true },

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

branchSchema.index({ campusId: 1, departmentId: 1, code: 1 }, { unique: true });
branchSchema.index({ departmentId: 1, isActive: 1, name: 1 });

export const Branch = mongoose.model("Branch", branchSchema);
