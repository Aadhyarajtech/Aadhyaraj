const Contact = require('../models/Contact');
const { sendSuccess, sendError } = require('../utils/response');
const resend = require('../config/resend');
// @desc Submit contact form
// @route POST /api/contact
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message, service } = req.body;

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      service
    });

    // Email to Company
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'contact@aadhyarajtech.com',
      subject: 'New Contact Form Submission',
      html: `
        <h2>New Contact Form Submission</h2>

        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || 'N/A'}</p>
        <p><b>Service:</b> ${service || 'N/A'}</p>
        <p><b>Subject:</b> ${subject || 'N/A'}</p>

        <p><b>Message:</b></p>
        <p>${message}</p>
      `
    });
console.log('Contact form submitted');
    // Confirmation Email to Customer
    await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: ['dsreeshanth48@gmail.com'],
  subject: 'Resend Test',
  html: `
    <h2>Resend is working!</h2>
    <p>Name: ${name}</p>
    <p>Email: ${email}</p>
  `
});
console.log('Resend email sent');

    sendSuccess(
      res,
      'Thank you! Your message has been received. We will get back to you shortly.',
      contact,
      201
    );

  } catch (error) {
    console.error('Submit contact error:', error);
    sendError(res, 'Server error. Please try again.', 500);
  }
};

// @desc Get all contacts (admin)
// @route GET /api/contact
exports.getContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments();

    const data = {
      contacts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalContacts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };

    sendSuccess(res, 'Contacts retrieved successfully', data);
  } catch (error) {
    console.error('Get contacts error:', error);
    sendError(res, 'Failed to retrieve contacts', 500);
  }
};

// @desc Get single contact (admin)
// @route GET /api/contact/:id
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return sendError(res, 'Contact not found', 404);
    }

    sendSuccess(res, 'Contact retrieved successfully', contact);
  } catch (error) {
    console.error('Get contact error:', error);
    sendError(res, 'Failed to retrieve contact', 500);
  }
};

// @desc Update contact status (admin)
// @route PUT /api/contact/:id
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return sendError(res, 'Contact not found', 404);
    }

    sendSuccess(res, 'Contact updated successfully', contact);
  } catch (error) {
    console.error('Update contact error:', error);
    sendError(res, 'Failed to update contact', 500);
  }
};

// @desc Delete contact (admin)
// @route DELETE /api/contact/:id
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return sendError(res, 'Contact not found', 404);
    }

    sendSuccess(res, 'Contact deleted successfully');
  } catch (error) {
    console.error('Delete contact error:', error);
    sendError(res, 'Failed to delete contact', 500);
  }
};

// @desc Get contact statistics (admin)
// @route GET /api/contact/stats
exports.getContactStats = async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const unreadContacts = await Contact.countDocuments({ status: 'unread' });
    const readContacts = await Contact.countDocuments({ status: 'read' });
    const repliedContacts = await Contact.countDocuments({ status: 'replied' });

    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email subject status createdAt');

    const stats = {
      total: totalContacts,
      unread: unreadContacts,
      read: readContacts,
      replied: repliedContacts,
      recent: recentContacts
    };

    sendSuccess(res, 'Contact statistics retrieved successfully', stats);
  } catch (error) {
    console.error('Get contact stats error:', error);
    sendError(res, 'Failed to retrieve contact statistics', 500);
  }
};
