import mongoose from "mongoose";
const departmentSchema = new mongoose.Schema({
  departmentName: { type: String, required: true, trim: true, index:true },
  code: { type: String, required: true, uppercase: true, index: true },
  isActive: { type: Boolean, default: true, index: true },

  campusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campus",
    required: true,
    index: true,
  },
}, { timestamps: true });

departmentSchema.index({ campusId: 1, code: 1 }, { unique: true }); // code unique per campus
departmentSchema.index({ campusId: 1, isActive: 1, name: 1 });

export const Department = mongoose.model("Department", departmentSchema);
