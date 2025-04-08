const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate content using OpenAI
 * @param {string} prompt - The prompt to generate content from
 * @param {Object} options - Additional options for the API call
 * @returns {string} Generated content
 */
const generateContent = async (prompt, options = {}) => {
  try {
    const defaultOptions = {
      model: 'gpt-4o',
      temperature: 0.7,
      max_tokens: 2000
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    const response = await openai.chat.completions.create({
      model: mergedOptions.model,
      temperature: mergedOptions.temperature,
      max_tokens: mergedOptions.max_tokens,
      messages: [
        { role: 'system', content: 'You are a professional business analyst and market research expert who provides detailed, insightful, and data-driven business analysis. Your responses are well-structured, concise, and actionable.' },
        { role: 'user', content: prompt }
      ]
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating content with OpenAI:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
};

/**
 * Summarize text using OpenAI
 * @param {string} text - The text to summarize
 * @param {number} maxLength - Maximum length of the summary
 * @returns {string} Summarized text
 */
const summarizeText = async (text, maxLength = 200) => {
  try {
    const prompt = `Summarize the following text in a concise, professional manner. Ensure the summary captures the key points and is no longer than ${maxLength} words:\n\n${text}`;
    
    return await generateContent(prompt, { temperature: 0.5, max_tokens: 500 });
  } catch (error) {
    console.error('Error summarizing text with OpenAI:', error);
    throw error;
  }
};

/**
 * Extract key insights from text
 * @param {string} text - The text to extract insights from
 * @param {number} numInsights - Number of insights to extract
 * @returns {Array} Array of insights
 */
const extractInsights = async (text, numInsights = 5) => {
  try {
    const prompt = `Extract exactly ${numInsights} key business insights from the following text. Format each insight as a separate point with a brief explanation:\n\n${text}`;
    
    const response = await generateContent(prompt, { temperature: 0.3, max_tokens: 1000 });
    
    // Parse the response into an array of insights
    const insights = response
      .split(/\d+\./)
      .filter(item => item.trim().length > 0)
      .map(item => item.trim());
    
    return insights.slice(0, numInsights);
  } catch (error) {
    console.error('Error extracting insights with OpenAI:', error);
    throw error;
  }
};

module.exports = {
  generateContent,
  summarizeText,
  extractInsights
}; 