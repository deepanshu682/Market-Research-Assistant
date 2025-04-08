const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Mock response for fallback when API fails
const generateMockContent = (prompt) => {
  console.log('Using mock content generator as fallback');
  
  // Extract the main query from the prompt
  const queryMatch = prompt.match(/"([^"]+)"/);
  const query = queryMatch ? queryMatch[1] : 'market analysis';
  
  // Check for industry in the prompt
  const industryMatch = prompt.match(/Industry: ([^\n]+)/);
  const industry = industryMatch ? industryMatch[1] : 'technology';
  
  // Generate a basic structured response
  return `# Analysis: ${query}

## Executive Summary
This is a mock analysis generated because the AI service is currently unavailable. The analysis would normally provide detailed insights on ${query}.

## Market Overview
The ${industry} industry has been showing significant changes in recent months. Key players are adapting to new market conditions and consumer demands.

## Key Findings
- Market growth is projected to continue at a steady pace
- Innovation remains a critical factor for success
- Consumer preferences are shifting toward sustainable solutions
- Regulatory changes may impact industry dynamics in the coming year

## Recommendations
1. Focus on digital transformation initiatives
2. Invest in sustainable practices
3. Monitor regulatory developments closely
4. Enhance customer experience through personalization

This analysis is provided as a placeholder. Please try again later for a comprehensive AI-generated analysis.`;
};

/**
 * Generate content using Gemini
 * @param {string} prompt - The prompt to generate content from
 * @param {Object} options - Additional options for the API call
 * @returns {string} Generated content
 */
const generateContent = async (prompt, options = {}) => {
  try {
    console.log('Initializing Gemini API with key:', process.env.GEMINI_API_KEY ? 'Key is set' : 'Key is missing');
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_new_gemini_api_key_here') {
      console.log('No valid Gemini API key found, using mock content generator');
      return generateMockContent(prompt);
    }
    
    const defaultOptions = {
      model: 'gemini-pro',
      temperature: 0.7,
      maxOutputTokens: 2000
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    console.log('Using Gemini options:', JSON.stringify(mergedOptions));
    
    // Get the generative model
    console.log('Getting generative model');
    const model = genAI.getGenerativeModel({ model: mergedOptions.model });
    
    // Generate content
    console.log('Generating content with prompt length:', prompt.length);
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: mergedOptions.temperature,
        maxOutputTokens: mergedOptions.maxOutputTokens
      }
    });
    
    console.log('Received result from Gemini API');
    const response = await result.response;
    console.log('Extracted text from response');
    return response.text();
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    
    // Fall back to mock content in case of API error
    console.log('Falling back to mock content due to API error');
    return generateMockContent(prompt);
  }
};

/**
 * Summarize text using Gemini
 * @param {string} text - The text to summarize
 * @param {number} maxLength - Maximum length of the summary
 * @returns {string} Summarized text
 */
const summarizeText = async (text, maxLength = 200) => {
  try {
    const prompt = `Summarize the following text in a concise, professional manner. Ensure the summary captures the key points and is no longer than ${maxLength} words:\n\n${text}`;
    
    return await generateContent(prompt, { temperature: 0.5, maxOutputTokens: 500 });
  } catch (error) {
    console.error('Error summarizing text with Gemini:', error);
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
    
    const response = await generateContent(prompt, { temperature: 0.3, maxOutputTokens: 1000 });
    
    // Parse the response into an array of insights
    const insights = response
      .split(/\d+\./)
      .filter(item => item.trim().length > 0)
      .map(item => item.trim());
    
    return insights.slice(0, numInsights);
  } catch (error) {
    console.error('Error extracting insights with Gemini:', error);
    throw error;
  }
};

module.exports = {
  generateContent,
  summarizeText,
  extractInsights
}; 