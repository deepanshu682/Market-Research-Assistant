const axios = require('axios');
const geminiService = require('./geminiService');
const newsService = require('./newsService');

/**
 * Get insights for a specific industry
 * @param {string} industry - The industry to get insights for
 * @returns {Object} Industry insights
 */
const getIndustryInsights = async (industry) => {
  try {
    // Get industry news
    const news = await newsService.getIndustryNews(industry);
    
    // Generate insights using Gemini
    const prompt = `
      Generate comprehensive business insights for the ${industry} industry.
      Include key market trends, growth projections, major players, 
      regulatory considerations, and technological disruptions.
      Base your analysis on recent developments in the industry.
      
      Recent news: ${JSON.stringify(news.slice(0, 5))}
    `;
    
    const insights = await geminiService.generateContent(prompt);
    
    return {
      industry,
      insights,
      news: news.slice(0, 5),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error in getIndustryInsights for ${industry}:`, error);
    throw error;
  }
};

/**
 * Get insights for a specific company
 * @param {string} companyName - The company to get insights for
 * @returns {Object} Company insights
 */
const getCompanyInsights = async (companyName) => {
  try {
    // Get company news
    const news = await newsService.getCompanyNews(companyName);
    
    // Generate insights using Gemini
    const prompt = `
      Generate comprehensive business insights for ${companyName}.
      Include information about their business model, market position, 
      recent performance, competitive advantages, challenges, and future outlook.
      Base your analysis on recent developments related to the company.
      
      Recent news: ${JSON.stringify(news.slice(0, 5))}
    `;
    
    const insights = await geminiService.generateContent(prompt);
    
    return {
      company: companyName,
      insights,
      news: news.slice(0, 5),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error in getCompanyInsights for ${companyName}:`, error);
    throw error;
  }
};

/**
 * Get competitive analysis for a company
 * @param {string} companyName - The company to analyze
 * @returns {Object} Competitive analysis
 */
const getCompetitiveAnalysis = async (companyName) => {
  try {
    // Get company insights first to determine industry and competitors
    const companyInsights = await getCompanyInsights(companyName);
    
    // Generate competitive analysis using Gemini
    const prompt = `
      Generate a detailed competitive analysis for ${companyName}.
      First, identify the top 5 competitors in the same market space.
      Then, for each competitor, provide:
      1. Company overview
      2. Market share (approximate)
      3. Key strengths and weaknesses relative to ${companyName}
      4. Competitive strategies
      
      Conclude with strategic recommendations for ${companyName} to improve their competitive position.
      
      Base your analysis on your knowledge and the following insights:
      ${companyInsights.insights}
    `;
    
    const analysis = await geminiService.generateContent(prompt);
    
    return {
      company: companyName,
      competitiveAnalysis: analysis,
      insights: companyInsights.insights,
      news: companyInsights.news,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error in getCompetitiveAnalysis for ${companyName}:`, error);
    throw error;
  }
};

module.exports = {
  getIndustryInsights,
  getCompanyInsights,
  getCompetitiveAnalysis
}; 