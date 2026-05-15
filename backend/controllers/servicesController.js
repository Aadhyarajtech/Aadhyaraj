const Service = require('../models/Service');
const { sendSuccess, sendError } = require('../utils/response');

const defaultServices = [
  {
    title: 'Custom Software Development',
    description: 'We architect and build bespoke software applications that solve your unique business challenges. From enterprise-grade web platforms to mobile applications and APIs, our engineers deliver robust, scalable, and secure solutions with modern tech stacks.',
    icon: '⚙️',
    features: [
      'Full-stack web application development',
      'Native and cross-platform mobile apps',
      'RESTful & GraphQL API development',
      'Cloud-native application architecture',
      'Legacy system modernisation',
      'Database design and optimisation',
    ],
    techStack: ['React', 'Node.js', 'Python', 'Java', 'MongoDB', 'PostgreSQL'],
    order: 1
  },
  {
    title: 'Enterprise Web Solutions',
    description: 'We create powerful web experiences that convert visitors into customers. From e-commerce platforms handling thousands of transactions to content management systems and progressive web apps, we build for performance, SEO, and scalability.',
    icon: '🌐',
    features: [
      'E-commerce platform development',
      'Custom CMS solutions',
      'Progressive Web Apps (PWA)',
      'UI/UX design and prototyping',
      'Performance optimisation',
      'SEO-ready architecture',
    ],
    techStack: ['Next.js', 'WordPress', 'Shopify', 'Figma', 'Tailwind', 'Vue.js'],
    order: 2
  },
  {
    title: 'IT Consulting & Strategy',
    description: 'Our seasoned consultants work alongside your leadership team to design technology strategies that align with your business goals. We assess your current landscape, identify gaps, and create actionable roadmaps that deliver measurable outcomes.',
    icon: '💡',
    features: [
      'Digital transformation strategy',
      'Technology stack assessment',
      'Architecture design and review',
      'Business process optimisation',
      'IT governance frameworks',
      'Vendor selection and management',
    ],
    techStack: ['TOGAF', 'Agile', 'ITIL', 'Scrum', 'DevSecOps', 'PMBOK'],
    order: 3
  },
  {
    title: 'Cloud & DevOps Services',
    description: 'We help organisations harness the full power of cloud computing. From seamless cloud migrations to building robust CI/CD pipelines and container orchestration, we ensure your infrastructure is agile, cost-effective, and highly available.',
    icon: '☁️',
    features: [
      'AWS, Azure and GCP migration',
      'CI/CD pipeline implementation',
      'Docker & Kubernetes orchestration',
      'Infrastructure as Code (Terraform)',
      'Cost optimisation and FinOps',
      'Disaster recovery planning',
    ],
    techStack: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform'],
    order: 4
  },
  {
    title: 'Maintenance & Support',
    description: 'Our dedicated support teams ensure your applications and systems run at peak performance around the clock. With proactive monitoring, rapid incident response, and regular updates, we keep your technology running so you can focus on your business.',
    icon: '🛡️',
    features: [
      '24/7 application monitoring',
      'Bug tracking and resolution',
      'Security patch management',
      'Performance tuning',
      'Scheduled maintenance windows',
      'SLA-backed response times',
    ],
    techStack: ['Datadog', 'New Relic', 'PagerDuty', 'Jira', 'Grafana', 'ELK Stack'],
    order: 5
  },
  {
    title: 'Training & Implementation',
    description: 'We ensure successful adoption of new technology through comprehensive training programmes and hands-on implementation support. From go-live planning to knowledge transfer sessions, we set your team up for long-term success.',
    icon: '🎓',
    features: [
      'Custom training programmes',
      'System integration and go-live',
      'Knowledge transfer workshops',
      'Documentation and SOPs',
      'Post-launch hypercare',
      'Ongoing learning resources',
    ],
    techStack: ['LMS Platforms', 'Confluence', 'Notion', 'Teams', 'Zoom', 'Miro'],
    order: 6
  }
];

exports.getServices = async (req, res) => {
  try {
    let services = await Service.find({ isActive: true }).sort({ order: 1 });

    if (services.length === 0) {
      // Insert default services if none exist
      services = await Service.insertMany(defaultServices.map(service => ({
        ...service,
        isActive: true
      })));
    }

    sendSuccess(res, 'Services retrieved successfully', services);
  } catch (error) {
    console.error('Get services error:', error);
    sendError(res, 'Failed to retrieve services', 500);
  }
};

exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return sendError(res, 'Service not found', 404);
    }

    sendSuccess(res, 'Service retrieved successfully', service);
  } catch (error) {
    console.error('Get service error:', error);
    sendError(res, 'Failed to retrieve service', 500);
  }
};

exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    sendSuccess(res, 'Service created successfully', service, 201);
  } catch (error) {
    console.error('Create service error:', error);
    sendError(res, 'Failed to create service', 500);
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return sendError(res, 'Service not found', 404);
    }

    sendSuccess(res, 'Service updated successfully', service);
  } catch (error) {
    console.error('Update service error:', error);
    sendError(res, 'Failed to update service', 500);
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return sendError(res, 'Service not found', 404);
    }

    sendSuccess(res, 'Service deleted successfully');
  } catch (error) {
    console.error('Delete service error:', error);
    sendError(res, 'Failed to delete service', 500);
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    sendSuccess(res, 'All services retrieved successfully', services);
  } catch (error) {
    console.error('Get all services error:', error);
    sendError(res, 'Failed to retrieve services', 500);
  }
};
