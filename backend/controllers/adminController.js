const Admin = require('../models/Admin');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');
const bcrypt = require('bcryptjs');

// @desc Register admin (one-time setup)
// @route POST /api/admin/register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      return sendError(res, 'Admin already exists', 400);
    }

    // Hash password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await Admin.create({
      username,
      email,
      password: password
    });

    // Generate token
    const token = generateToken(admin._id);

    const adminData = {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt
    };

    sendSuccess(res, 'Admin registered successfully', { admin: adminData, token }, 201);
  } catch (error) {
    console.error('Register admin error:', error);
    sendError(res, 'Failed to register admin', 500);
  }
};

// @desc Login admin
// @route POST /api/admin/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists (explicitly select password field)
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return sendError(res, 'Invalid credentials', 401);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials', 401);
    }

    // Generate token
    const token = generateToken(admin._id);

    const adminData = {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      lastLogin: admin.lastLogin
    };

    // Update last login
    await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date() });

    sendSuccess(res, 'Login successful', { admin: adminData, token });
  } catch (error) {
    console.error('Login admin error:', error);
    sendError(res, 'Failed to login', 500);
  }
};

// @desc Get current admin profile
// @route GET /api/admin/profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');

    if (!admin) {
      return sendError(res, 'Admin not found', 404);
    }

    sendSuccess(res, 'Profile retrieved successfully', admin);
  } catch (error) {
    console.error('Get profile error:', error);
    sendError(res, 'Failed to retrieve profile', 500);
  }
};

// @desc Update admin profile
// @route PUT /api/admin/profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return sendError(res, 'Admin not found', 404);
    }

    // If updating password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return sendError(res, 'Current password is required to set new password', 400);
      }

      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) {
        return sendError(res, 'Current password is incorrect', 400);
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(newPassword, salt);
    }

    // Update other fields
    if (username) admin.username = username;
    if (email) admin.email = email;

    await admin.save();

    const adminData = {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      updatedAt: admin.updatedAt
    };

    sendSuccess(res, 'Profile updated successfully', adminData);
  } catch (error) {
    console.error('Update profile error:', error);
    sendError(res, 'Failed to update profile', 500);
  }
};

// @desc Get dashboard statistics
// @route GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    const Service = require('../models/Service');
    const Testimonial = require('../models/Testimonial');
    const Career = require('../models/Career');
    const JobApplication = require('../models/JobApplication');

    // Get counts
    const [contacts, services, testimonials, careers, applications] = await Promise.all([
      Contact.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Testimonial.countDocuments({ isActive: true }),
      Career.countDocuments({ isActive: true }),
      JobApplication.countDocuments()
    ]);

    // Get recent activity
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email subject status createdAt');

    const recentApplications = await JobApplication.find()
      .populate('career', 'title')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('applicantName email career status createdAt');

    const stats = {
      overview: {
        totalContacts: contacts,
        totalServices: services,
        totalTestimonials: testimonials,
        totalCareers: careers,
        totalApplications: applications
      },
      recentActivity: {
        contacts: recentContacts,
        applications: recentApplications
      }
    };

    sendSuccess(res, 'Dashboard data retrieved successfully', stats);
  } catch (error) {
    console.error('Get dashboard error:', error);
    sendError(res, 'Failed to retrieve dashboard data', 500);
  }
};

// @desc Check if admin exists (for initial setup)
// @route GET /api/admin/check
exports.checkAdminExists = async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    sendSuccess(res, 'Admin check completed', { adminExists: adminCount > 0 });
  } catch (error) {
    console.error('Check admin exists error:', error);
    sendError(res, 'Failed to check admin status', 500);
  }
};