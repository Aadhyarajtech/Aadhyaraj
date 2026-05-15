const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: [true, 'Site name is required'],
    trim: true,
    maxlength: [100, 'Site name cannot exceed 100 characters']
  },
  siteDescription: {
    type: String,
    required: [true, 'Site description is required'],
    trim: true,
    maxlength: [500, 'Site description cannot exceed 500 characters']
  },
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  contactPhone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  address: {
    street: {
      type: String,
      trim: true,
      maxlength: [200, 'Street address cannot exceed 200 characters']
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, 'City cannot exceed 100 characters']
    },
    state: {
      type: String,
      trim: true,
      maxlength: [100, 'State cannot exceed 100 characters']
    },
    zipCode: {
      type: String,
      trim: true,
      maxlength: [20, 'ZIP code cannot exceed 20 characters']
    },
    country: {
      type: String,
      trim: true,
      maxlength: [100, 'Country cannot exceed 100 characters']
    }
  },
  socialLinks: {
    linkedin: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'LinkedIn must be a valid URL']
    },
    twitter: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Twitter must be a valid URL']
    },
    github: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'GitHub must be a valid URL']
    },
    facebook: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Facebook must be a valid URL']
    },
    instagram: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Instagram must be a valid URL']
    }
  },
  businessHours: {
    monday: {
      type: String,
      trim: true,
      maxlength: [50, 'Business hours cannot exceed 50 characters']
    },
    tuesday: {
      type: String,
      trim: true,
      maxlength: [50, 'Business hours cannot exceed 50 characters']
    },
    wednesday: {
      type: String,
      trim: true,
      maxlength: [50, 'Business hours cannot exceed 50 characters']
    },
    thursday: {
      type: String,
      trim: true,
      maxlength: [50, 'Business hours cannot exceed 50 characters']
    },
    friday: {
      type: String,
      trim: true,
      maxlength: [50, 'Business hours cannot exceed 50 characters']
    },
    saturday: {
      type: String,
      trim: true,
      maxlength: [50, 'Business hours cannot exceed 50 characters']
    },
    sunday: {
      type: String,
      trim: true,
      maxlength: [50, 'Business hours cannot exceed 50 characters']
    }
  },
  seoSettings: {
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      trim: true,
      maxlength: [50, 'Each keyword cannot exceed 50 characters']
    }],
    ogImage: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'OG image must be a valid URL']
    }
  },
  features: {
    enableContactForm: {
      type: Boolean,
      default: true
    },
    enableJobApplications: {
      type: Boolean,
      default: true
    },
    enableTestimonials: {
      type: Boolean,
      default: true
    },
    enableServices: {
      type: Boolean,
      default: true
    },
    enableCareers: {
      type: Boolean,
      default: true
    },
    enableBlog: {
      type: Boolean,
      default: false
    }
  },
  maintenance: {
    isUnderMaintenance: {
      type: Boolean,
      default: false
    },
    maintenanceMessage: {
      type: String,
      trim: true,
      maxlength: [500, 'Maintenance message cannot exceed 500 characters'],
      default: 'We are currently performing maintenance. Please check back soon.'
    }
  },
  analytics: {
    googleAnalyticsId: {
      type: String,
      trim: true,
      match: [/^G-[A-Z0-9]+$/, 'Google Analytics ID must be in format G-XXXXXXXXXX']
    },
    facebookPixelId: {
      type: String,
      trim: true
    }
  },
  integrations: {
    emailService: {
      provider: {
        type: String,
        enum: ['sendgrid', 'mailgun', 'ses', 'smtp'],
        default: 'smtp'
      },
      apiKey: {
        type: String,
        select: false // Don't include in queries by default
      },
      domain: {
        type: String,
        trim: true
      }
    },
    cloudStorage: {
      provider: {
        type: String,
        enum: ['cloudinary', 'aws-s3', 'azure-blob'],
        default: 'cloudinary'
      },
      cloudName: {
        type: String,
        trim: true
      },
      apiKey: {
        type: String,
        select: false
      },
      apiSecret: {
        type: String,
        select: false
      }
    }
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.pre('save', async function(next) {
  if (this.isNew) {
    const existing = await this.constructor.findOne();
    if (existing) {
      const error = new Error('Only one settings document is allowed');
      return next(error);
    }
  }
  next();
});

// Static method to get settings
settingsSchema.statics.getSettings = function() {
  return this.findOne().select('+integrations.emailService.apiKey +integrations.cloudStorage.apiKey +integrations.cloudStorage.apiSecret');
};

module.exports = mongoose.model('Settings', settingsSchema);