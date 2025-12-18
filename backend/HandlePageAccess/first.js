import {
     authenticateUser,
     adminValidation,
     teacherValidation,
     studentValidation,
} from '../validationsFiles/StuTeaAdminMiddleware.js';

// pageAccessRoutes.js - Backend API Routes for Page Access Control

import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const router = express.Router();

// MongoDB Schema for Page Access Control
const PageAccessControlSchema = new mongoose.Schema({
     pageId: {
          type: String,
          required: true,
          unique: true
     }, // e.g., 'registration-page', 'exam-results', 'fee-payment'

     pageName: {
          type: String,
          required: true
     },

     isPublic: {
          type: Boolean,
          default: false
     }, // true = anyone can access, false = role-based

     allowedRoles: [{
          type: String
     }], // ['admin', 'teacher', 'student', 'parent']

     isActive: {
          type: Boolean,
          default: true
     }, // master switch to enable/disable page

     accessConditions: {
          startDate: Date,
          endDate: Date,
          maxUsers: Number,
          currentUsers: { type: Number, default: 0 }
     },

     accessMessage: {
          type: String,
          default: "This page is currently not available"
     },

     createdBy: String,
     lastUpdatedBy: String,

}, { timestamps: true });

const PageAccessControl = mongoose.model('PageAccessControl', PageAccessControlSchema);


// GET - List all page access controls (Admin only)
router.get('/page-access/list',
     authenticateUser,
     adminValidation, async (req, res) => {
          try {
               const { search, role } = req.query;

               let query = {};

               // Search functionality
               if (search) {
                    query.$or = [
                         { pageName: { $regex: search, $options: 'i' } },
                         { pageId: { $regex: search, $options: 'i' } }
                    ];
               }

               // Role filtering
               if (role && role !== 'all') {
                    if (role === 'public') {
                         query.isPublic = true;
                    } else {
                         query.allowedRoles = { $in: [role] };
                    }
               }

               const pageAccess = await PageAccessControl.find(query)
                    .sort({ createdAt: -1 });

               res.json({
                    success: true,
                    data: pageAccess,
                    count: pageAccess.length
               });
          } catch (error) {
               console.error('Error fetching page access:', error);
               res.status(500).json({
                    success: false,
                    message: 'Failed to fetch page access data'
               });
          }
     });

// GET - Check specific page access (Public endpoint)
router.get('/page-access/check/:pageId', async (req, res) => {
     try {
          const { pageId } = req.params;

          // Get user info from token if present
          let userRole = 'public';
          let userId = null;
          const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];

          if (token) {
               try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    userRole = decoded.userAvailable?.role || decoded.role || 'public';
                    userId = decoded.userAvailable?.username || decoded.username;
               } catch (err) {
                    // Token invalid, continue as public user
               }
          }

          const pageAccess = await PageAccessControl.findOne({ pageId });

          if (!pageAccess) {
               return res.json({
                    success: false,
                    hasAccess: false,
                    message: "Page not found or not configured"
               });
          }

          // Check if page is active
          if (!pageAccess.isActive) {
               return res.json({
                    success: false,
                    hasAccess: false,
                    message: pageAccess.accessMessage || "Page is currently not available"
               });
          }

          // Check if page is public
          if (pageAccess.isPublic) {
               return res.json({
                    success: true,
                    hasAccess: true,
                    message: "Public access granted",
                    pageInfo: {
                         pageName: pageAccess.pageName,
                         accessConditions: pageAccess.accessConditions
                    }
               });
          }

          // Check role-based access
          if (pageAccess.allowedRoles && pageAccess.allowedRoles.includes(userRole)) {
               // Check date-based access
               const now = new Date();
               const { startDate, endDate, maxUsers, currentUsers } = pageAccess.accessConditions || {};

               if (startDate && now < new Date(startDate)) {
                    return res.json({
                         success: false,
                         hasAccess: false,
                         message: `Page will be available from ${new Date(startDate).toDateString()}`
                    });
               }

               if (endDate && now > new Date(endDate)) {
                    return res.json({
                         success: false,
                         hasAccess: false,
                         message: "Page access has expired"
                    });
               }

               // Check max users limit
               if (maxUsers && currentUsers >= maxUsers) {
                    return res.json({
                         success: false,
                         hasAccess: false,
                         message: "Maximum user limit reached. Please try again later."
                    });
               }

               return res.json({
                    success: true,
                    hasAccess: true,
                    message: "Role-based access granted",
                    pageInfo: {
                         pageName: pageAccess.pageName,
                         accessConditions: pageAccess.accessConditions
                    }
               });
          }

          return res.json({
               success: false,
               hasAccess: false,
               message: pageAccess.accessMessage || "Access denied: Insufficient permissions"
          });

     } catch (error) {
          console.error('Error checking page access:', error);
          res.status(500).json({
               success: false,
               hasAccess: false,
               message: 'Unable to verify page access'
          });
     }
});

// POST - Create new page access control (Admin only)
router.post('/page-access/create',
     authenticateUser,
     adminValidation, async (req, res) => {
          try {
               const {
                    pageId,
                    pageName,
                    isPublic,
                    allowedRoles,
                    isActive,
                    accessConditions,
                    accessMessage
               } = req.body;

               // Validation
               if (!pageId || !pageName) {
                    return res.status(400).json({
                         success: false,
                         message: 'pageId and pageName are required'
                    });
               }

               // Check if pageId already exists
               const existingPage = await PageAccessControl.findOne({ pageId });
               if (existingPage) {
                    return res.status(400).json({
                         success: false,
                         message: 'Page ID already exists'
                    });
               }

               const newPageAccess = new PageAccessControl({
                    pageId: pageId.toLowerCase().replace(/\s+/g, '-'), // normalize pageId
                    pageName,
                    isPublic: isPublic || false,
                    allowedRoles: allowedRoles || [],
                    isActive: isActive !== undefined ? isActive : true,
                    accessConditions: {
                         startDate: accessConditions?.startDate || null,
                         endDate: accessConditions?.endDate || null,
                         maxUsers: accessConditions?.maxUsers || null,
                         currentUsers: 0
                    },
                    accessMessage: accessMessage || "This page is currently not available",
                    createdBy: req.user.username
               });

               await newPageAccess.save();

               res.status(201).json({
                    success: true,
                    message: 'Page access control created successfully',
                    data: newPageAccess
               });

          } catch (error) {
               console.error('Error creating page access:', error);
               res.status(500).json({
                    success: false,
                    message: 'Failed to create page access control'
               });
          }
     });

// PUT - Update page access control (Admin only)
router.put('/page-access/:pageId',
     authenticateUser,
     adminValidation, async (req, res) => {
          try {
               const { pageId } = req.params;
               const updateData = req.body;

               // Add metadata
               updateData.lastUpdatedBy = req.user.username;

               // Handle accessConditions properly
               if (updateData.accessConditions) {
                    const existingPage = await PageAccessControl.findOne({ pageId });
                    if (existingPage) {
                         updateData.accessConditions = {
                              ...existingPage.accessConditions,
                              ...updateData.accessConditions
                         };
                    }
               }

               const updatedPageAccess = await PageAccessControl.findOneAndUpdate(
                    { pageId },
                    { $set: updateData },
                    {
                         new: true,
                         upsert: true, // Create if doesn't exist
                         runValidators: true
                    }
               );

               res.json({
                    success: true,
                    message: `Page access updated successfully for ${pageId}`,
                    data: updatedPageAccess
               });

          } catch (error) {
               console.error('Error updating page access:', error);
               res.status(500).json({
                    success: false,
                    message: 'Failed to update page access control'
               });
          }
     });

// DELETE - Delete page access control (Admin only)
router.delete('/page-access/:pageId',
     authenticateUser,
     adminValidation, async (req, res) => {
          try {
               const { pageId } = req.params;

               const deletedPage = await PageAccessControl.findOneAndDelete({ pageId });

               if (!deletedPage) {
                    return res.status(404).json({
                         success: false,
                         message: 'Page access control not found'
                    });
               }

               res.json({
                    success: true,
                    message: `Page access control deleted for ${pageId}`,
                    data: deletedPage
               });

          } catch (error) {
               console.error('Error deleting page access:', error);
               res.status(500).json({
                    success: false,
                    message: 'Failed to delete page access control'
               });
          }
     });

// POST - Increment current users count (when user accesses page)
router.post('/page-access/increment-users/:pageId',
     authenticateUser, async (req, res) => {
          try {
               const { pageId } = req.params;

               const updatedPage = await PageAccessControl.findOneAndUpdate(
                    { pageId },
                    { $inc: { 'accessConditions.currentUsers': 1 } },
                    { new: true }
               );

               if (!updatedPage) {
                    return res.status(404).json({
                         success: false,
                         message: 'Page not found'
                    });
               }

               res.json({
                    success: true,
                    message: 'User count incremented',
                    currentUsers: updatedPage.accessConditions.currentUsers
               });

          } catch (error) {
               console.error('Error incrementing user count:', error);
               res.status(500).json({
                    success: false,
                    message: 'Failed to increment user count'
               });
          }
     });

// POST - Quick toggle page status (Admin only)
router.post('/page-access/toggle-status/:pageId',
     authenticateUser,
     adminValidation, async (req, res) => {
          try {
               const { pageId } = req.params;
               const { field } = req.body; // 'isActive' or 'isPublic'

               const page = await PageAccessControl.findOne({ pageId });
               if (!page) {
                    return res.status(404).json({
                         success: false,
                         message: 'Page not found'
                    });
               }

               const updateData = {
                    lastUpdatedBy: req.user.username
               };

               if (field === 'isActive') {
                    updateData.isActive = !page.isActive;
               } else if (field === 'isPublic') {
                    updateData.isPublic = !page.isPublic;
               } else {
                    return res.status(400).json({
                         success: false,
                         message: 'Invalid field. Use "isActive" or "isPublic"'
                    });
               }

               const updatedPage = await PageAccessControl.findOneAndUpdate(
                    { pageId },
                    { $set: updateData },
                    { new: true }
               );

               res.json({
                    success: true,
                    message: `${field} toggled for ${pageId}`,
                    data: updatedPage
               });

          } catch (error) {
               console.error('Error toggling page status:', error);
               res.status(500).json({
                    success: false,
                    message: 'Failed to toggle page status'
               });
          }
     });

// GET - Dashboard statistics (Admin only)
router.get('/page-access/stats',
     authenticateUser,
     adminValidation, async (req, res) => {
          try {
               const totalPages = await PageAccessControl.countDocuments();
               const activePages = await PageAccessControl.countDocuments({ isActive: true });
               const publicPages = await PageAccessControl.countDocuments({ isPublic: true });
               const restrictedPages = await PageAccessControl.countDocuments({ isActive: false });

               // Recent activity (pages created in last 7 days)
               const sevenDaysAgo = new Date();
               sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
               const recentPages = await PageAccessControl.countDocuments({
                    createdAt: { $gte: sevenDaysAgo }
               });

               // Pages by role
               const roleStats = await PageAccessControl.aggregate([
                    { $unwind: { path: '$allowedRoles', preserveNullAndEmptyArrays: true } },
                    { $group: { _id: '$allowedRoles', count: { $sum: 1 } } },
                    { $sort: { count: -1 } }
               ]);

               res.json({
                    success: true,
                    data: {
                         totalPages,
                         activePages,
                         publicPages,
                         restrictedPages,
                         recentPages,
                         roleDistribution: roleStats
                    }
               });

          } catch (error) {
               console.error('Error fetching statistics:', error);
               res.status(500).json({
                    success: false,
                    message: 'Failed to fetch statistics'
               });
          }
     });

// Export the router and model
export { router as pageAccessRouter, PageAccessControl };

// Usage example in your main app.js:
/*
import { pageAccessRouter } from './pageAccessRoutes.js';

// Add to your main app
app.use('/api', pageAccessRouter);

// Sample data insertion (run once to populate)
async function insertSampleData() {
  const sampleData = [
    {
      pageId: 'student-registration',
      pageName: 'Student Registration',
      isPublic: true,
      allowedRoles: ['admin', 'student'],
      isActive: true,
      accessConditions: {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        maxUsers: 1000,
        currentUsers: 0
      },
      accessMessage: 'Registration is currently open for all students',
      createdBy: 'system'
    },
    {
      pageId: 'exam-results',
      pageName: 'Exam Results',
      isPublic: false,
      allowedRoles: ['student'],
      isActive: false,
      accessConditions: {
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-03-30'),
        maxUsers: null,
        currentUsers: 0
      },
      accessMessage: 'Results will be available on March 15th',
      createdBy: 'system'
    }
  ];
  
  for (const data of sampleData) {
    await PageAccessControl.findOneAndUpdate(
      { pageId: data.pageId },
      data,
      { upsert: true }
    );
  }
  
  console.log('Sample page access data inserted');
}
*/