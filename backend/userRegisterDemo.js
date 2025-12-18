import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import validator from 'validator';
import xss from 'xss';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { StudentValidator, TeacherValidator } from './UserSchema.js';
import { Department } from "./schema/DepartmentSchema.js";
import { Branch } from "./schema/BranchSchema.js";

import BranchLectureInfoSchema from './StudentsFiles/BranchLectureInfoSchema.js';
// import { registrationLimiter } from './index.js';

const router = express.Router();
// File upload configuration with security
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/');
  },
  filename: (req, file, cb) => {
    // Generate secure random filename
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Input Validation Rules
const baseValidationRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name must contain only letters and spaces, 2-50 characters'),

  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-20 characters, alphanumeric and underscore only'),

  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be 8+ chars with uppercase, lowercase, number and special character'),

  body('phone')
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
];

const studentValidationRules = [
  ...baseValidationRules,
  // body('department')
  //   .trim()
  //   .isLength({ min: 2, max: 50 })
  //   .matches(/^[a-zA-Z\s]+$/)
  //   .withMessage('Department must contain only letters and spaces'),

  body('year')
    .isIn(['first-year', 'second-year', 'third-year', 'fourth-year'])
    .withMessage('Year must first-year, second-year, third-year, fourth-year'),

  // body('branch')
  //   .trim()
  //   .isLength({ min: 2, max: 50 })
  //   .matches(/^[a-zA-Z\s&()-]+$/)
  //   .withMessage('Branch must contain only letters and spaces'),
];

const teacherValidationRules = [
  ...baseValidationRules,
  body('qualification')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Qualification must be less than 100 characters'),

  body('subjects')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subjects must be less than 200 characters'),
];

// Security Helper Functions
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return xss(input.trim());
  }
  return input;
};

const hashPassword = async (password) => {
  const saltRounds = 12; // High salt rounds for security
  return await bcrypt.hash(password, saltRounds);
};

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Check for existing user
const checkExistingUser = async (email, username, phone) => {
  const existingUser = await StudentValidator.findOne({
    $or: [
      { email: email },
      { username: username },
      { phone: phone }
    ]
  }) || await TeacherValidator.findOne({
    $or: [
      { email: email },
      { username: username },
      { phone: phone }
    ]
  });

  return existingUser;
};
const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 registration attempts per windowMs
  message: {
    error: 'Too many registration attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
// Student Registration Endpoint///////////////////////////////////////////////////////////////////////////////////////////////
router.post('/add-student-profile',
  registrationLimiter,
  upload.single('photo'),
  studentValidationRules,
  handleValidationErrors,
  async (req, res) => {
    try {
      // Sanitize all inputs
      const sanitizedData = {
        name: sanitizeInput(req.body.name),
        username: sanitizeInput(req.body.username).toUpperCase(),
        email: sanitizeInput(req.body.email).toLowerCase(),
        password: req.body.password, // Don't sanitize password (will be hashed)
        phone: sanitizeInput(req.body.phone),
        year: sanitizeInput(req.body.year),
        // department: sanitizeInput(req.body.department),
        // branch: sanitizeInput(req.body.branch),
      };

      // Additional security checks
      if (!validator.isEmail(sanitizedData.email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Check for existing user
      const existingUser = await checkExistingUser(
        sanitizedData.email,
        sanitizedData.username,
        sanitizedData.phone
      );

      if (existingUser) {
        let conflictField = 'User';
        if (existingUser.email === sanitizedData.email) conflictField = 'Email';
        else if (existingUser.username === sanitizedData.username) conflictField = 'Username';
        else if (existingUser.phone == sanitizedData.phone) conflictField = 'Phone number';

        return res.status(409).json({
          success: false,
          message: `${conflictField} already exists`
        });
      }
      const departmentID = await Department.findOne({
        departmentName: req.body?.department,    // Match schema field
        isActive: true
      }).select('_id');

      const branchID = await Branch.findOne({
        branchName: req.body?.branch,        // Match schema field  
        isActive: true
      }).select('_id');              // Fixed quotes

      if (!departmentID || !branchID) {
        return res.status(400).json({ error: 'Department/Branch not found' });
      }
      // Hash password
      const hashedPassword = await hashPassword(sanitizedData.password);
      const currentLectureDocId = await BranchLectureInfoSchema.findOne({})
      // Prepare user data
      const userData = {
        currentLectureDocId: currentLectureDocId,
        ...sanitizedData,
        departmentID: departmentID,
        branchID: branchID,
        password: hashedPassword,
        role: 'student',
        photo: req.file ? req.file.filename : null,
      };

      // Create student
      const student = new StudentValidator(userData);
      await student.save();

      // Remove sensitive data before sending response
      const studentResponse = student.toObject();
      delete studentResponse.password;

      res.status(201).json({
        success: true,
        message: 'Student registered successfully',
        student: studentResponse,
      });

    } catch (error) {
      console.error('Student registration error:', error);
      if (error.code === 11000) {
        console.error("Duplicate key error:", error.keyValue);
        console.log(JSON.stringify(error?.errorResponse) || 'No errorResponse');
        // let duplicateKeys = Object.keys(error.keyValue);
        const message = JSON.stringify(error?.errorResponse) || 'No errorResponse';
        return res.status(400).json({
          success: false,
          message: `${message} is already allocated and used!`,
          error: error,
        });
      };
      // message: 'Duplicate entry detected',

      res.status(500).json({
        success: false,
        message: 'Internal server error during registration',
        error: error,
      });
    }
  }
);

// Teacher Registration Endpoint/////////////////////////////////////////////////////////////////////
router.post('/api/teacher/register',
  registrationLimiter,
  upload.single('photo'),
  teacherValidationRules,
  handleValidationErrors,
  async (req, res) => {
    try {
      // Sanitize all inputs
      const sanitizedData = {
        name: sanitizeInput(req.body.name),
        username: sanitizeInput(req.body.username).toLowerCase(),
        email: sanitizeInput(req.body.email),
        password: req.body.password, // Don't sanitize password (will be hashed)
        phone: sanitizeInput(req.body.phone),
        qualification: sanitizeInput(req.body.qualification) || '',
        subjects: sanitizeInput(req.body.subjects) || '',
      };

      // Additional security checks
      if (!validator.isEmail(sanitizedData.email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Check for existing user
      const existingUser = await checkExistingUser(
        sanitizedData.email,
        sanitizedData.username,
        sanitizedData.phone
      );

      if (existingUser) {
        let conflictField = 'User';
        if (existingUser.email === sanitizedData.email) conflictField = 'Email';
        else if (existingUser.username === sanitizedData.username) conflictField = 'Username';
        else if (existingUser.phone == sanitizedData.phone) conflictField = 'Phone number';

        return res.status(409).json({
          success: false,
          message: `${conflictField} already exists`
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(sanitizedData.password);

      // Prepare user data
      const userData = {
        ...sanitizedData,
        password: hashedPassword,
        role: 'teacher',
        photo: req.file ? req.file.filename : null,
      };

      // Create teacher
      const teacher = new TeacherValidator(userData);
      await teacher.save();

      // Generate JWT token (optional - for immediate login)
      // const token = jwt.sign(
      //   {
      //     userId: teacher._id,
      //     username: teacher.username,
      //     role: 'teacher',
      //     tokenId: generateSecureToken() // Additional security
      //   },
      // process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      // {
      //   expiresIn: '24h',
      //   issuer: 'your-app-name',
      //   audience: 'your-app-users'
      // }
      // );

      // Remove sensitive data before sending response
      const teacherResponse = teacher.toObject();
      delete teacherResponse.password;

      res.status(201).json({
        success: true,
        message: 'Teacher registered successfully',
        data: {
          user: teacherResponse,
          token: null
        }
      });

    } catch (error) {
      console.error('Teacher registration error:', error);
      if (error.code === 11000) {
        console.error("Duplicate key error:", error.keyValue);
        console.log(JSON.stringify(error?.errorResponse) || 'No errorResponse');
        // let duplicateKeys = Object.keys(error.keyValue);
        const message = JSON.stringify(error?.errorResponse) || 'No errorResponse';
        return res.status(400).json({
          success: false,
          message: `${message} is already allocated and used!`,
          error: error,
        });
      };
      // message: `${duplicateKeys[0]} ${err.keyValue[duplicateKeys[0]]} is already allocated and used!`

      res.status(500).json({
        success: false,
        error: error,
        message: 'Internal server error during registration'
      });
    }
  }
);

// Additional Security Middleware for checking registration attempts
router.use('/register/*', (req, res, next) => {
  // Log registration attempts for monitoring
  console.log(`Registration attempt from IP: ${req.ip} at ${new Date()}`);
  next();
});

export default router;