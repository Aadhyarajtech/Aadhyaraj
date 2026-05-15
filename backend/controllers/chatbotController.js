const { sendSuccess, sendError } = require('../utils/response');

// Chatbot responses using OpenAI
exports.getChatbotResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return sendError(res, 'Message is required', 400);
    }

    const lowerMessage = message.toLowerCase();

let response = '';

if (
  lowerMessage.includes('service') ||
  lowerMessage.includes('services')
) {
  response =
    'We provide web development, mobile app development, AI solutions, cloud services, DevOps, UI/UX design, and enterprise software solutions.';
}

else if (
  lowerMessage.includes('career') ||
  lowerMessage.includes('job')
) {
  response =
    'You can explore our Careers page to view current openings and apply for available positions.';
}

else if (
  lowerMessage.includes('contact')
) {
  response =
    'You can contact our team through the Contact section available on the website.';
}

else if (
  lowerMessage.includes('team')
) {
  response =
    'Our team consists of experienced developers, designers, cloud engineers, AI specialists, and project managers.';
}

else if (
  lowerMessage.includes('project') ||
  lowerMessage.includes('cost')
) {
  response =
    'Project cost depends on the requirements, features, and timeline. Our team can provide a customized quotation after understanding your needs.';
}

else if (
  lowerMessage.includes('hello') ||
  lowerMessage.includes('hi')
) {
  response =
    'Hello! Welcome to AadhyaRaj Technologies. How can I assist you today?';
}

else {
  response =
    'Thank you for your message. Our team at AadhyaRaj Technologies will be happy to assist you.';
}

    sendSuccess(res, 'Chatbot response generated', { response });
  } catch (error) {
    console.error('Chatbot error:', error);
    sendError(res, 'Failed to generate chatbot response', 500);
  }
};

// Future implementation with OpenAI
/*
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.getChatbotResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return sendError(res, 'Message is required', 400);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for AadhyaRaj Technologies, a leading IT solutions provider. Be professional, informative, and helpful. Keep responses concise but comprehensive."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    const response = completion.choices[0].message.content;

    sendSuccess(res, 'Chatbot response generated', { response });
  } catch (error) {
    console.error('Chatbot error:', error);
    sendError(res, 'Failed to generate chatbot response', 500);
  }
};
*/