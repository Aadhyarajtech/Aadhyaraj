const Testimonial = require('../models/Testimonial');
const { sendSuccess, sendError } = require('../utils/response');

const defaultTestimonials = [
  {
    name: 'James Richardson',
    position: 'CTO',
    company: 'TechCorp Solutions',
    country: 'USA',
    icon: '🧠',
    message: 'AadhyaRaj Technologies delivered our enterprise platform ahead of schedule. Their team\'s technical expertise and dedication to quality is unmatched. A true technology partner.',
    rating: 5
  },
  {
    name: 'Sarah Mitchell',
    position: 'CEO',
    company: 'Digital Ventures',
    country: 'UK',
    icon: '🌟',
    message: 'Working with AadhyaRaj has been transformative for our business. They understood our vision from day one and built a solution that exceeded all our expectations.',
    rating: 5
  },
  {
    name: 'David Chen',
    position: 'Product Manager',
    company: 'Innovate Labs',
    country: 'Australia',
    icon: '🚀',
    message: 'The team\'s professionalism and technical prowess are exceptional. They provided end-to-end IT solutions with seamless communication throughout the entire project.',
    rating: 5
  },
  {
    name: 'Priya Sharma',
    position: 'Director of IT',
    company: 'GlobalTech NZ',
    country: 'New Zealand',
    icon: '🤝',
    message: 'Outstanding quality and support. AadhyaRaj Technologies is our go-to IT partner. Their offshore model delivers incredible value without compromising on quality.',
    rating: 5
  }
];

exports.getTestimonials = async (req, res) => {
  try {
    let testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });

    if (testimonials.length === 0) {
      testimonials = await Testimonial.insertMany(defaultTestimonials.map((item) => ({
        ...item,
        isActive: true,
      })));
    }

    sendSuccess(res, 'Testimonials retrieved successfully', testimonials);
  } catch (error) {
    console.error('Get testimonials error:', error);
    sendError(res, 'Failed to retrieve testimonials', 500);
  }
};

exports.getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return sendError(res, 'Testimonial not found', 404);
    }

    sendSuccess(res, 'Testimonial retrieved successfully', testimonial);
  } catch (error) {
    console.error('Get testimonial error:', error);
    sendError(res, 'Failed to retrieve testimonial', 500);
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    sendSuccess(res, 'Testimonial created successfully', testimonial, 201);
  } catch (error) {
    console.error('Create testimonial error:', error);
    sendError(res, 'Failed to create testimonial', 500);
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return sendError(res, 'Testimonial not found', 404);
    }

    sendSuccess(res, 'Testimonial updated successfully', testimonial);
  } catch (error) {
    console.error('Update testimonial error:', error);
    sendError(res, 'Failed to update testimonial', 500);
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!testimonial) {
      return sendError(res, 'Testimonial not found', 404);
    }

    sendSuccess(res, 'Testimonial deleted successfully');
  } catch (error) {
    console.error('Delete testimonial error:', error);
    sendError(res, 'Failed to delete testimonial', 500);
  }
};

exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    sendSuccess(res, 'All testimonials retrieved successfully', testimonials);
  } catch (error) {
    console.error('Get all testimonials error:', error);
    sendError(res, 'Failed to retrieve testimonials', 500);
  }
};
