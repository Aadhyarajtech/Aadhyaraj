const mongoose = require('mongoose');

const technologySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  icon: { type: String, default: '🔧', trim: true },
  description: { type: String, default: '', trim: true }
}, { _id: false });

const techStackSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  icon: { type: String, default: '🔧', trim: true },
  description: { type: String, default: '', trim: true },
  category: {
    type: String,
    required: true,
    enum: ['frontend', 'backend', 'database', 'cloud-devops', 'ai-machine-learning', 'mobile', 'other'],
    default: 'other'
  },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  technologies: { type: [technologySchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TechStack', techStackSchema);
