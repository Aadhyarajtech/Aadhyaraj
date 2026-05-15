const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Admin = require('./models/Admin');
const Service = require('./models/Service');
const Testimonial = require('./models/Testimonial');
const Career = require('./models/Career');
const Contact = require('./models/Contact');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aadhyaraj';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🔄 Clearing existing data...');
    await Admin.deleteMany({});
    await Service.deleteMany({});
    await Testimonial.deleteMany({});
    await Career.deleteMany({});
    await Contact.deleteMany({});

    // Create default admin
    console.log('📝 Creating default admin account...');
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = await Admin.create({
      username: 'admin',
      email: 'admin@aadhyarajtech.com',
      password: 'admin123',
      role: 'superadmin',
      isActive: true
    });
    console.log('✅ Super Admin created: admin@aadhyarajtech.com / admin123');

    await Admin.create({
      username: 'careeradmin',
      email: 'careers@aadhyarajtech.com',
      password: 'career123',
      role: 'careeradmin',
      isActive: true
    });
    console.log('✅ Career Admin created: careers@aadhyarajtech.com / career123');

    // Create sample services
    console.log('📝 Creating sample services...');
    const services = await Service.create([
      {
        title: 'Custom Software Development',
        description: 'Tailored software solutions built specifically for your business needs',
        icon: '🛠️',
        details: 'From concept to deployment, we build scalable and robust software solutions',
        category: 'Development',
        isActive: true
      },
      {
        title: 'Web Development',
        description: 'Modern responsive web applications using latest technologies',
        icon: '🌐',
        details: 'React, Node.js, and more - we create stunning web experiences',
        category: 'Web',
        isActive: true
      },
      {
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile applications',
        icon: '📱',
        details: 'iOS and Android apps that users love',
        category: 'Mobile',
        isActive: true
      },
      {
        title: 'Cloud & DevOps',
        description: 'Scalable cloud infrastructure and deployment solutions',
        icon: '☁️',
        details: 'AWS, Azure, and on-premise deployment strategies',
        category: 'Infrastructure',
        isActive: true
      },
      {
        title: 'IT Consulting',
        description: 'Strategic technology guidance for digital transformation',
        icon: '💼',
        details: 'Expert advice on technology stack and architecture',
        category: 'Consulting',
        isActive: true
      },
      {
        title: 'Training & Support',
        description: 'Team training and ongoing technical support',
        icon: '🎓',
        details: 'Upskill your team with our comprehensive training programs',
        category: 'Support',
        isActive: true
      }
    ]);
    console.log(`✅ Created ${services.length} services`);

    // Create sample testimonials
    console.log('📝 Creating sample testimonials...');
    const testimonials = await Testimonial.create([
      {
        name: 'Rajesh Kumar',
        position: 'CEO',
        company: 'TechStart Innovations',
        country: 'India',
        message: 'AadhyaRaj delivered exceptional results on time and within budget. Their team\'s expertise was invaluable.',
        rating: 5,
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      {
        name: 'Priya Sharma',
        position: 'CTO',
        company: 'Global Solutions Inc',
        country: 'USA',
        message: 'Outstanding technical excellence and customer support. Highly recommend for any enterprise project.',
        rating: 5,
        avatar: 'https://i.pravatar.cc/150?img=2'
      },
      {
        name: 'Ahmed Hassan',
        position: 'Project Manager',
        company: 'Digital First Ltd',
        country: 'UK',
        message: 'Professional team with deep technical knowledge. They transformed our legacy system beautifully.',
        rating: 5,
        avatar: 'https://i.pravatar.cc/150?img=3'
      }
    ]);
    console.log(`✅ Created ${testimonials.length} testimonials`);

    // Create sample job openings
    console.log('📝 Creating sample job openings...');
    const careers = await Career.create([
      {
        title: 'Senior Full Stack Developer',
        department: 'Engineering',
        location: 'Bangalore, India',
        type: 'Full-time',
        experience: 'Senior Level',
        description: 'We are looking for experienced full stack developers to join our growing team and build scalable web applications.',
        requirements: [
          'Strong knowledge of React, Node.js, and MongoDB',
          'Experience with cloud platforms (AWS/Azure)',
          'Excellent problem-solving skills',
          'Team player with good communication'
        ],
        responsibilities: [
          'Design and develop full stack web applications',
          'Collaborate with cross-functional teams',
          'Write clean and maintainable code',
          'Participate in code reviews'
        ],
        benefits: [
          'Competitive salary',
          'Health insurance',
          'Flexible working hours',
          'Professional development opportunities'
        ],
        salary: {
          min: 1500000,
          max: 2500000,
          currency: 'INR',
          period: 'yearly'
        },
        skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
        applicationDeadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        title: 'DevOps Engineer',
        department: 'Infrastructure',
        location: 'Remote',
        type: 'Remote',
        experience: 'Mid Level',
        description: 'Join our DevOps team to manage and optimize our cloud infrastructure and deployment pipelines.',
        requirements: [
          'Experience with Docker, Kubernetes, and CI/CD',
          'AWS or Azure cloud platform knowledge',
          'Linux system administration',
          'Infrastructure as Code (Terraform/CloudFormation)'
        ],
        responsibilities: [
          'Manage cloud infrastructure',
          'Implement CI/CD pipelines',
          'Monitor system performance',
          'Collaborate with development teams'
        ],
        benefits: [
          'Competitive salary',
          'Remote work',
          'Health & wellness benefits',
          'Stock options'
        ],
        salary: {
          min: 120000,
          max: 160000,
          currency: 'USD',
          period: 'yearly'
        },
        skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Python'],
        applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        title: 'UI/UX Designer',
        department: 'Design',
        location: 'Mumbai, India',
        type: 'Full-time',
        experience: 'Mid Level',
        description: 'Create beautiful and functional user experiences for our digital products and platforms.',
        requirements: [
          'Proficiency in Figma or Adobe XD',
          'Understanding of UX principles and design thinking',
          'Portfolio of design work',
          'Attention to detail and visual aesthetics'
        ],
        responsibilities: [
          'Design user interfaces for web and mobile apps',
          'Conduct user research and usability testing',
          'Create design prototypes and mockups',
          'Collaborate with product and engineering teams'
        ],
        benefits: [
          'Creative environment',
          'Modern design tools and software',
          'Collaborative team',
          'Growth opportunities'
        ],
        salary: {
          min: 1000000,
          max: 1500000,
          currency: 'INR',
          period: 'yearly'
        },
        skills: ['Figma', 'UI Design', 'UX Design', 'Prototyping', 'Wireframing'],
        applicationDeadline: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
        isActive: true
      }
    ]);
    console.log(`✅ Created ${careers.length} job openings`);

    console.log('\n✨ Database seeded successfully!\n');
    console.log('📌 DEFAULT ADMIN CREDENTIALS:');
    console.log('   Email: admin@aadhyarajtech.com');
    console.log('   Password: admin123\n');
    console.log('📊 Data Summary:');
    console.log(`   - Admin accounts: 1`);
    console.log(`   - Services: ${services.length}`);
    console.log(`   - Testimonials: ${testimonials.length}`);
    console.log(`   - Job Openings: ${careers.length}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
