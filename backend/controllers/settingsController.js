const Settings = require('../models/Settings');
const { sendSuccess, sendError } = require('../utils/response');

// Default settings
const defaultSettings = {
  siteName: 'AadhyaRaj Technologies',
  siteDescription: 'Leading IT solutions provider specializing in web development, AI, cloud services, and enterprise software.',
  contactEmail: 'info@aadhyaraj.com',
  contactPhone: '+1 (555) 123-4567',
  address: {
    street: '123 Tech Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'USA'
  },
  socialLinks: {
    linkedin: 'https://linkedin.com/company/aadhyaraj-technologies',
    twitter: 'https://twitter.com/aadhyarajtech',
    github: 'https://github.com/aadhyaraj-technologies',
    facebook: 'https://facebook.com/aadhyarajtech'
  },
  businessHours: {
    monday: '9:00 AM - 6:00 PM',
    tuesday: '9:00 AM - 6:00 PM',
    wednesday: '9:00 AM - 6:00 PM',
    thursday: '9:00 AM - 6:00 PM',
    friday: '9:00 AM - 6:00 PM',
    saturday: '10:00 AM - 4:00 PM',
    sunday: 'Closed'
  },
  seoSettings: {
    metaTitle: 'AadhyaRaj Technologies - Leading IT Solutions Provider',
    metaDescription: 'Professional IT services including web development, AI solutions, cloud services, and enterprise software development.',
    keywords: ['IT solutions', 'web development', 'AI', 'cloud services', 'enterprise software'],
    ogImage: '/images/og-image.jpg'
  },
  features: {
    enableContactForm: true,
    enableJobApplications: true,
    enableTestimonials: true,
    enableServices: true,
    enableCareers: true
  },
  maintenance: {
    isUnderMaintenance: false,
    maintenanceMessage: 'We are currently performing maintenance. Please check back soon.'
  }
};

// @desc Get all settings
// @route GET /api/settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(defaultSettings);
    }

    sendSuccess(res, 'Settings retrieved successfully', settings);
  } catch (error) {
    console.error('Get settings error:', error);
    sendError(res, 'Failed to retrieve settings', 500);
  }
};

// @desc Update settings (admin)
// @route PUT /api/settings
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(defaultSettings);
    }

    // Update settings with provided data
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        if (typeof req.body[key] === 'object' && req.body[key] !== null) {
          settings[key] = { ...settings[key], ...req.body[key] };
        } else {
          settings[key] = req.body[key];
        }
      }
    });

    await settings.save();

    sendSuccess(res, 'Settings updated successfully', settings);
  } catch (error) {
    console.error('Update settings error:', error);
    sendError(res, 'Failed to update settings', 500);
  }
};

// @desc Get public settings (for frontend)
// @route GET /api/settings/public
exports.getPublicSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(defaultSettings);
    }

    // Return only public settings
    const publicSettings = {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      address: settings.address,
      socialLinks: settings.socialLinks,
      businessHours: settings.businessHours,
      seoSettings: settings.seoSettings,
      features: settings.features,
      maintenance: settings.maintenance
    };

    sendSuccess(res, 'Public settings retrieved successfully', publicSettings);
  } catch (error) {
    console.error('Get public settings error:', error);
    sendError(res, 'Failed to retrieve settings', 500);
  }
};

// @desc Reset settings to defaults (admin)
// @route POST /api/settings/reset
exports.resetSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (settings) {
      settings = await Settings.findByIdAndUpdate(
        settings._id,
        defaultSettings,
        { new: true, runValidators: true }
      );
    } else {
      settings = await Settings.create(defaultSettings);
    }

    sendSuccess(res, 'Settings reset to defaults successfully', settings);
  } catch (error) {
    console.error('Reset settings error:', error);
    sendError(res, 'Failed to reset settings', 500);
  }
};

// @desc Update maintenance mode (admin)
// @route PUT /api/settings/maintenance
exports.updateMaintenance = async (req, res) => {
  try {
    const { isUnderMaintenance, maintenanceMessage } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(defaultSettings);
    }

    settings.maintenance = {
      isUnderMaintenance: isUnderMaintenance ?? settings.maintenance.isUnderMaintenance,
      maintenanceMessage: maintenanceMessage ?? settings.maintenance.maintenanceMessage
    };

    await settings.save();

    sendSuccess(res, 'Maintenance settings updated successfully', settings.maintenance);
  } catch (error) {
    console.error('Update maintenance error:', error);
    sendError(res, 'Failed to update maintenance settings', 500);
  }
};