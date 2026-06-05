const Career = require('../models/Career');
const JobApplication = require('../models/JobApplication');
const { sendSuccess, sendError } = require('../utils/response');
const resend = require('../config/resend');
const upload = require('../config/cloudinary');

// @desc Get all active careers
// @route GET /api/careers
exports.getCareers = async (req, res) => {
  try {
    const careers = await Career.find({ isActive: true }).sort({ createdAt: -1 });
    sendSuccess(res, 'Careers retrieved successfully', careers);
  } catch (error) {
    console.error('Get careers error:', error);
    sendError(res, 'Failed to retrieve careers', 500);
  }
};

// @desc Get single career
// @route GET /api/careers/:id
exports.getCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return sendError(res, 'Career not found', 404);
    }

    sendSuccess(res, 'Career retrieved successfully', career);
  } catch (error) {
    console.error('Get career error:', error);
    sendError(res, 'Failed to retrieve career', 500);
  }
};

// @desc Create new career (admin)
// @route POST /api/careers
exports.createCareer = async (req, res) => {
  try {
    const career = await Career.create(req.body);
    sendSuccess(res, 'Career created successfully', career, 201);
  } catch (error) {
    console.error('Create career error:', error);
    sendError(res, 'Failed to create career', 500);
  }
};

// @desc Update career (admin)
// @route PUT /api/careers/:id
exports.updateCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!career) {
      return sendError(res, 'Career not found', 404);
    }

    sendSuccess(res, 'Career updated successfully', career);
  } catch (error) {
    console.error('Update career error:', error);
    sendError(res, 'Failed to update career', 500);
  }
};

// @desc Delete career (admin)
// @route DELETE /api/careers/:id
exports.deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!career) {
      return sendError(res, 'Career not found', 404);
    }

    sendSuccess(res, 'Career deleted successfully');
  } catch (error) {
    console.error('Delete career error:', error);
    sendError(res, 'Failed to delete career', 500);
  }
};

// @desc Get all careers (admin)
// @route GET /api/careers/admin/all
exports.getAllCareers = async (req, res) => {
  try {
    const careers = await Career.find().sort({ createdAt: -1 });
    sendSuccess(res, 'All careers retrieved successfully', careers);
  } catch (error) {
    console.error('Get all careers error:', error);
    sendError(res, 'Failed to retrieve careers', 500);
  }
};

// @desc Submit job application
// @route POST /api/careers/:id/apply
exports.submitApplication = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return sendError(res, 'Career not found', 404);
    }

    if (!career.isActive) {
      return sendError(res, 'This position is no longer accepting applications', 400);
    }

    const applicationData = {
      ...req.body,
      career: req.params.id,
      resume: req.file ? req.file.path : req.body.resume
    };

    const application = await JobApplication.create(applicationData);
console.log("FILE:", req.file);
console.log("RESUME IN DB:", application.resume);

await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: ['info@aadhyarajtech.com'],
  subject: 'Website Application',

  html: `
    <h2>New Job Application</h2>

    <p><b>Name:</b> ${application.applicantName}</p>
    <p><b>Email:</b> ${application.email}</p>
    <p><b>Phone:</b> ${application.phone || 'N/A'}</p>
    <p><b>Experience:</b> ${application.experience}</p>
    <p><b>Position:</b> ${career.title}</p>

    <p><b>Cover Note:</b></p>
    <p>${application.coverLetter || 'N/A'}</p>

    <hr/>

    <p><b>Resume:</b> ${application.resume}</p>
  `
});


    // Confirmation Email to Applicant
    // await transporter.sendMail({
    //   from: process.env.EMAIL_USER,
    //   to: application.email,
    //   subject: 'Application Submitted Successfully',
    //   html: `
    //     <h2>Thank You for Applying</h2>

    //     <p>Dear ${application.applicantName},</p>

    //     <p>
    //       We have successfully received your application for
    //       <b>${career.title}</b>.
    //     </p>

    //     <p>
    //       Our recruitment team will review your profile and
    //       reach out to you shortly if your qualifications match
    //       our requirements.
    //     </p>

    //     <p>
    //       Thank you for your interest in AadhyaRaj Technologies.
    //     </p>

    //     <br/>

    //     <p>
    //       Regards,<br/>
    //       AadhyaRaj Technologies
    //     </p>
    //   `
    // });

    sendSuccess(res, 'Application submitted successfully', application, 201);

  } catch (error) {
    console.error('Submit application error:', error);
    console.error(JSON.stringify(error, null, 2));
    sendError(res, 'Failed to submit application', 500);
  }
};

// @desc Get applications for a career (admin)
// @route GET /api/careers/:id/applications
exports.getCareerApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({ career: req.params.id })
      .populate('career', 'title department')
      .sort({ createdAt: -1 });

    sendSuccess(res, 'Applications retrieved successfully', applications);
  } catch (error) {
    console.error('Get career applications error:', error);
    sendError(res, 'Failed to retrieve applications', 500);
  }
};

// @desc Get all job applications (admin)
// @route GET /api/applications
exports.getAllApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const applications = await JobApplication.find()
      .populate('career', 'title department location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await JobApplication.countDocuments();

    const data = {
      applications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalApplications: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };

    sendSuccess(res, 'Applications retrieved successfully', data);
  } catch (error) {
    console.error('Get all applications error:', error);
    sendError(res, 'Failed to retrieve applications', 500);
  }
};

// @desc Update application status (admin)
// @route PUT /api/applications/:id
exports.updateApplication = async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('career', 'title department');

    if (!application) {
      return sendError(res, 'Application not found', 404);
    }

    sendSuccess(res, 'Application updated successfully', application);
  } catch (error) {
    console.error('Update application error:', error);
    sendError(res, 'Failed to update application', 500);
  }
};

// @desc Delete application (admin)
// @route DELETE /api/applications/:id
exports.deleteApplication = async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndDelete(req.params.id);

    if (!application) {
      return sendError(res, 'Application not found', 404);
    }

    sendSuccess(res, 'Application deleted successfully');
  } catch (error) {
    console.error('Delete application error:', error);
    sendError(res, 'Failed to delete application', 500);
  }
};