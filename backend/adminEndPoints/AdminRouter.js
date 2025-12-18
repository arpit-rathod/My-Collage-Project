import { createCampus, getCampusById, createDepartment, createBranch, createSection } from './Campus.js';
import { manualResetLectures } from '../utils/ResetLectureStatus.js';

// routes/adminHierarchy.js
import express from 'express';
const router = express.Router();

// Admin Hierarchy Endpoints - RESTful + Semantic
router.post('/campus', createCampus);                    // POST /api/admin/campus
router.get('/campus/:id', getCampusById);                    // POST /api/admin/campus

router.post('/departments', createDepartment);           // POST /api/admin/departments
router.post('/branches', createBranch);                  // POST /api/admin/branches  
router.post('/sections', createSection);                 // POST /api/admin/sections


router.patch('/reset-lectures', manualResetLectures);

export default router;
// app.use('/api/admin', adminHierarchyRoutes);