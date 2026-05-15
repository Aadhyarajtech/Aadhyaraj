const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    minlength: [2, 'Department must be at least 2 characters'],
    maxlength: [100, 'Department cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    minlength: [2, 'Location must be at least 2 characters'],
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Job type is required'],
    enum: {
      values: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Hybrid'],
      message: 'Job type must be one of: Full-time, Part-time, Contract, Remote, Hybrid'
    }
  },
  experience: {
    type: String,
    trim: true,
    required: [true, 'Experience level is required'],
    minlength: [2, 'Experience must be at least 2 characters'],
    maxlength: [100, 'Experience cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  requirements: [{
    type: String,
    trim: true,
    maxlength: [500, 'Each requirement cannot exceed 500 characters']
  }],
  responsibilities: [{
    type: String,
    trim: true,
    maxlength: [500, 'Each responsibility cannot exceed 500 characters']
  }],
  benefits: [{
    type: String,
    trim: true,
    maxlength: [200, 'Each benefit cannot exceed 200 characters']
  }],
  salary: {
    min: {
      type: Number,
      min: [0, 'Minimum salary cannot be negative']
    },
    max: {
      type: Number,
      min: [0, 'Maximum salary cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD']
    },
    period: {
      type: String,
      default: 'yearly',
      enum: ['hourly', 'monthly', 'yearly']
    }
  },
  skills: [{
    type: String,
    trim: true,
    maxlength: [50, 'Each skill cannot exceed 50 characters']
  }],
  applicationDeadline: {
    type: Date,
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Application deadline must be in the future'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  applicationCount: {
    type: Number,
    default: 0,
    min: [0, 'Application count cannot be negative']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
careerSchema.index({ isActive: 1, createdAt: -1 });
careerSchema.index({ department: 1 });
careerSchema.index({ location: 1 });
careerSchema.index({ type: 1 });
careerSchema.index({ experience: 1 });
careerSchema.index({ applicationDeadline: 1 });

// Virtual for checking if applications are still open
careerSchema.virtual('isApplicationOpen').get(function() {
  if (!this.isActive) return false;
  if (!this.applicationDeadline) return true;
  return this.applicationDeadline > new Date();
});

// Method to increment application count
careerSchema.methods.incrementApplicationCount = function() {
  this.applicationCount += 1;
  return this.save();
};

module.exports = mongoose.model('Career', careerSchema);