const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  career: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career',
    required: [true, 'Career reference is required']
  },
  applicantName: {
    type: String,
    required: [true, 'Applicant name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  experience: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: {
      values: ['0-1 years', '1-3 years', '3-5 years', '5-8 years', '8+ years'],
      message: 'Experience must be one of: 0-1 years, 1-3 years, 3-5 years, 5-8 years, 8+ years'
    }
  },
  currentPosition: {
    type: String,
    trim: true,
    maxlength: [100, 'Current position cannot exceed 100 characters']
  },
  currentCompany: {
    type: String,
    trim: true,
    maxlength: [100, 'Current company cannot exceed 100 characters']
  },
  expectedSalary: {
    min: {
      type: Number,
      min: [0, 'Minimum expected salary cannot be negative']
    },
    max: {
      type: Number,
      min: [0, 'Maximum expected salary cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD']
    }
  },
  coverLetter: {
    type: String,
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
  },
  resume: {
    type: String,
    required: [true, 'Resume is required']
  },
  portfolio: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Portfolio must be a valid URL']
  },
  linkedin: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(www\.)?linkedin\.com\/.+/, 'LinkedIn must be a valid LinkedIn URL']
  },
  github: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(www\.)?github\.com\/.+/, 'GitHub must be a valid GitHub URL']
  },
  skills: [{
    type: String,
    trim: true,
    maxlength: [50, 'Each skill cannot exceed 50 characters']
  }],
  status: {
    type: String,
    enum: {
      values: ['pending', 'reviewing', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected'],
      message: 'Status must be one of: pending, reviewing, shortlisted, interviewed, offered, hired, rejected'
    },
    default: 'pending'
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected']
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    }
  }],
  interviewDate: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
jobApplicationSchema.index({ career: 1, createdAt: -1 });
jobApplicationSchema.index({ email: 1 });
jobApplicationSchema.index({ status: 1 });
jobApplicationSchema.index({ createdAt: -1 });

// Pre-save middleware to update career application count
jobApplicationSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const Career = mongoose.model('Career');
      await Career.findByIdAndUpdate(this.career, { $inc: { applicationCount: 1 } });
    } catch (error) {
      console.error('Error updating career application count:', error);
    }
  }
  next();
});

// Method to update status with history
jobApplicationSchema.methods.updateStatus = function(newStatus, changedBy, notes = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    changedBy: changedBy,
    notes: notes
  });
  return this.save();
};

module.exports = mongoose.model('JobApplication', jobApplicationSchema);