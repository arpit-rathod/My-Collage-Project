import mongoose from "mongoose";
const campusSchema = new mongoose.Schema({
  campusName: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true, index: true },
  address: { type: String, trim: true },
  isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true });

campusSchema.index({ name: 1 });
campusSchema.index({ isActive: 1, code: 1 }); // common filter + search

export const Campus = mongoose.model("Campus", campusSchema);
