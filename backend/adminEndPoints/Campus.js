
import { Campus } from "../schema/CampusSchema.js";
import { Department } from "../schema/DepartmentSchema.js";
import { Branch } from "../schema/BranchSchema.js";
import { Section } from "../schema/SectionInBranch.js";
//Admin=> Create get update 
export const createCampus = async (req, res) => {
  try {
    const campus = await Campus.create(req.body);
    res.status(201).json(campus);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
export const getCampusById = async (req, res) => {
  try {
    const campus = await Campus.findById(req.params.id);
    if (!campus) return res.status(404).json({ error: 'Campus not found' });
    res.status(200).json(campus);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Create department
export const createDepartment = async (req, res) => {
  try {
    // optional: verify campusId exists
    const dept = await Department.create(req.body);
    res.status(201).json(dept);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create branch
export const createBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json(branch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create section
export const createSection = async (req, res) => {
  try {
    const section = await Section.create(req.body);
    res.status(201).json(section);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
