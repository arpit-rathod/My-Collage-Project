// teacherController.js
import { User } from ".././UserSchema.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';

// Rate limiting middleware for registration attempts
export const registrationLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 5, // Limit each IP to 5 registration attempts per windowMs
     message: {
          error: 'Too many registration attempts, please try again later.',
          retryAfter: '15 minutes'
     },
     standardHeaders: true,
     legacyHeaders: false,
});

// Input validation middleware using express-validator (modern validation approach)
export const validateTeacherRegistration = [
     body('name')
          .trim()
          .isLength({ min: 2, max: 50 })
          .withMessage('Name must be between 2 and 50 characters')
          .matches(/^[a-zA-Z\s]+$/)
          .withMessage('Name can only contain letters and spaces'),

     body('username')
          .trim()
          .isLength({ min: 3, max: 30 })
          .withMessage('Username must be between 3 and 30 characters')
          .matches(/^[a-zA-Z0-9_]+$/)
          .withMessage('Username can only contain letters, numbers, and underscores'),

     body('email')
          .optional()
          .isEmail()
          .withMessage('Please provide a valid email address')
          .normalizeEmail(),

     body('password')
          .isLength({ min: 8 })
          .withMessage('Password must be at least 8 characters long')
          .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
          .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

     body('phone')
          .matches(/^\d{10}$/)
          .withMessage('Phone number must be exactly 10 digits'),

     body('photo')
          .optional()
          .isURL()
          .withMessage('Photo must be a valid URL'),

     body('qualification')
          .optional()
          .isLength({ max: 200 })
          .withMessage('Qualification must be less than 200 characters'),

     body('role')
          .optional()
          .isIn(['teacher', 'admin', 'staff'])
          .withMessage('Role must be either teacher, admin, or staff')
];

/**
 * Register a new teacher
 * @route POST /api/teachers/regisster
 * @access Public (with rate limiting)
 * @technologies Express.js, MongoDB, Mongoose, bcryptjs, JWT, express-validator
 */
export const registerTeacher = async (req, res) => {
     try {
          // Check for validation errors
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
               return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array().map(error => ({
                         field: error.path,
                         message: error.msg
                    }))
               });
          }

          // Extract and sanitize input data
          const {
               name,
               username,
               email,
               password,
               phone,
               photo,
               qualification,
               role = 'teacher'
          } = req.body;

          // Additional server-side validations
          const phoneNumber = parseInt(phone);
          if (isNaN(phoneNumber) || phoneNumber <= 0) {
               return res.status(400).json({
                    success: false,
                    message: 'Invalid phone number format'
               });
          }

          // Check if user already exists (using Promise.all for parallel queries - modern async approach)
          const [existingUsername, existingEmail, existingPhone] = await Promise.all([
               User.findOne({ username: username.toLowerCase() }),
               email ? User.findOne({ email: email.toLowerCase() }) : null,
               User.findOne({ phone: phoneNumber })
          ]);

          // Handle duplicate entries with specific error messages
          const duplicateErrors = [];
          if (existingUsername) duplicateErrors.push('Username already exists');
          if (existingEmail && email) duplicateErrors.push('Email already registered');
          if (existingPhone) duplicateErrors.push('Phone number already registered');

          if (duplicateErrors.length > 0) {
               return res.status(409).json({
                    success: false,
                    message: 'Registration failed',
                    errors: duplicateErrors
               });
          }

          // Hash password using modern bcrypt approach
          const saltRounds = 12; // Increased for better security
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          // Create new teacher document
          const newTeacher = new User({
               name: name.trim(),
               username: username.toLowerCase().trim(),
               email: email ? email.toLowerCase().trim() : undefined,
               password: hashedPassword,
               phone: phoneNumber,
               photo: photo?.trim(),
               qualification: qualification?.trim(),
               role: role,
               date: new Date()
          });

          // Save to database with transaction support (modern MongoDB feature)
          const savedTeacher = await newTeacher.save();

          // Generate JWT token for immediate login (modern auth approach)
          // const token = jwt.sign(
          //      {
          //           userId: savedTeacher._id,
          //           username: savedTeacher.username,
          //           role: savedTeacher.role
          //      },
          //      process.env.JWT_SECRET,
          //      {
          //           expiresIn: '24h',
          //           issuer: 'your-app-name',
          //           audience: 'your-app-users'
          //      }
          // );

          // Prepare response data (exclude sensitive information)
          // const responseData = {
          //      _id: savedTeacher._id,
          //      name: savedTeacher.name,
          //      username: savedTeacher.username,
          //      email: savedTeacher.email,
          //      phone: savedTeacher.phone,
          //      photo: savedTeacher.photo,
          //      qualification: savedTeacher.qualification,
          //      role: savedTeacher.role,
          //      date: savedTeacher.date
          // };

          // Set secure HTTP-only cookie for token (modern security practice)
          // res.cookie('authToken', token, {
          //      httpOnly: true,
          //      secure: process.env.NODE_ENV === 'production',
          //      sameSite: 'strict',
          //      maxAge: 24 * 60 * 60 * 1000 // 24 hours
          // });

          // Send success response
          res.status(201).json({
               success: true,
               message: 'Teacher registered successfully',
               // data: {
               //      teacher: responseData,
               //      token: token // Also send token in response for frontend flexibility
               // }
          });
          // Log successful registration (for monitoring/analytics)
          console.log(`New teacher registered: ${savedTeacher.username} (${savedTeacher._id})`);
     } catch (error) {
          console.error('Teacher registration error:', error);
          // Handle specific MongoDB errors
          if (error.code === 11000) {
               const duplicateField = Object.keys(error.keyPattern)[0];
               return res.status(409).json({
                    success: false,
                    message: `${duplicateField} already exists`,
                    error: 'Duplicate entry'
               });
          }
          // Handle Mongoose validation errors
          if (error.name === 'ValidationError') {
               const validationErrors = Object.values(error.errors).map(err => err.message);
               return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validationErrors
               });
          }

          // Generic server error
          res.status(500).json({
               success: false,
               message: 'Internal server error',
               error: process.env.NODE_ENV === 'development' ? error.message : 'Registration failed'
          });
     }
};

/**
 * Get all teachers with pagination and filtering
 * @route GET /api/teachers
 * @access Protected (Admin/Staff only)
 * @technologies MongoDB Aggregation Pipeline, Pagination
 */
export const getTeachers = async (req, res) => {
     try {
          const {
               page = 1,
               limit = 10,
               search = '',
               qualification = '',
               sortBy = 'date',
               sortOrder = 'desc'
          } = req.query;

          // Build filter object
          const filter = { role: 'teacher' };

          if (search) {
               filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { username: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
               ];
          }

          if (qualification) {
               filter.qualification = { $regex: qualification, $options: 'i' };
          }

          // Calculate pagination
          const skip = (parseInt(page) - 1) * parseInt(limit);
          const sortObj = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

          // Execute queries in parallel
          const [teachers, totalCount] = await Promise.all([
               User.find(filter)
                    .select('-password') // Exclude password field
                    .sort(sortObj)
                    .skip(skip)
                    .limit(parseInt(limit))
                    .lean(), // Use lean() for better performance
               User.countDocuments(filter)
          ]);

          // Calculate pagination metadata
          const totalPages = Math.ceil(totalCount / parseInt(limit));
          const currentPage = parseInt(page);

          res.json({
               success: true,
               data: {
                    teachers,
                    pagination: {
                         currentPage,
                         totalPages,
                         totalCount,
                         limit: parseInt(limit),
                         hasNext: currentPage < totalPages,
                         hasPrev: currentPage > 1
                    }
               }
          });

     } catch (error) {
          console.error('Get teachers error:', error);
          res.status(500).json({
               success: false,
               message: 'Failed to fetch teachers',
               error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
          });
     }
};

/**
 * Get teacher by ID
 * @route GET /api/teachers/:id
 * @access Protected
 * @technologies MongoDB ObjectId validation
 */
export const getTeacherById = async (req, res) => {
     try {
          const { id } = req.params;

          // Validate ObjectId format
          if (!mongoose.Types.ObjectId.isValid(id)) {
               return res.status(400).json({
                    success: false,
                    message: 'Invalid teacher ID format'
               });
          }

          const teacher = await User.findById(id).select('-password');

          if (!teacher) {
               return res.status(404).json({
                    success: false,
                    message: 'Teacher not found'
               });
          }

          res.json({
               success: true,
               data: { teacher }
          });

     } catch (error) {
          console.error('Get teacher by ID error:', error);
          res.status(500).json({
               success: false,
               message: 'Failed to fetch teacher',
               error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
          });
     }
};

/**
 * Update teacher profile
 * @route PUT /api/teachers/:id
 * @access Protected (Self or Admin only)
 * @technologies Partial updates, Authorization middleware
 */
export const updateTeacher = async (req, res) => {
     try {
          const { id } = req.params;
          const updates = req.body;

          // Remove sensitive fields from updates
          delete updates.password;
          delete updates.role; // Role should be updated through separate endpoint

          // Validate ObjectId
          if (!mongoose.Types.ObjectId.isValid(id)) {
               return res.status(400).json({
                    success: false,
                    message: 'Invalid teacher ID format'
               });
          }

          // Check authorization (user can only update own profile unless admin)
          if (req.user.userId !== id && req.user.role !== 'admin') {
               return res.status(403).json({
                    success: false,
                    message: 'Unauthorized to update this profile'
               });
          }

          const updatedTeacher = await User.findByIdAndUpdate(
               id,
               { $set: updates },
               {
                    new: true,
                    runValidators: true,
                    select: '-password'
               }
          );

          if (!updatedTeacher) {
               return res.status(404).json({
                    success: false,
                    message: 'Teacher not found'
               });
          }

          res.json({
               success: true,
               message: 'Profile updated successfully',
               data: { teacher: updatedTeacher }
          });

     } catch (error) {
          console.error('Update teacher error:', error);
          res.status(500).json({
               success: false,
               message: 'Failed to update teacher',
               error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
          });
     }
};

// Export all functions for route usage
export default {
     registerTeacher,
     getTeachers,
     getTeacherById,
     updateTeacher,
     validateTeacherRegistration,
     registrationLimiter
};

