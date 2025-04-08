const axios = require('axios');
const geminiService = require('./geminiService');
const newsService = require('./newsService');

/**
 * Get trends for a specific keyword
 * @param {string} keyword - The keyword to get trends for
 * @returns {Object} Keyword trends
 */
const getKeywordTrends = async (keyword) => {
  try {
    // Get news related to the keyword
    const news = await newsService.getKeywordNews(keyword);
    
    // Generate trends analysis using Gemini
    const prompt = `
      Generate a comprehensive trend analysis for the keyword "${keyword}".
      Include:
      1. Current popularity and trend direction
      2. Historical trend analysis (last 12 months)
      3. Related keywords and concepts
      4. Industry relevance
      5. Future projections
      
      Base your analysis on recent developments related to this keyword.
      
      Recent news: ${JSON.stringify(news.slice(0, 5))}
    `;
    
    const trends = await geminiService.generateContent(prompt);
    
    return {
      keyword,
      trends,
      news: news.slice(0, 5),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error in getKeywordTrends for ${keyword}:`, error);
    throw error;
  }
};

/**
 * Get trends for a specific industry
 * @param {string} industry - The industry to get trends for
 * @returns {Object} Industry trends
 */
const getIndustryTrends = async (industry) => {
  try {
    // Get industry news
    const news = await newsService.getIndustryNews(industry);
    
    // Generate trends analysis using Gemini
    const prompt = `
      Generate a comprehensive trend analysis for the ${industry} industry.
      Include:
      1. Current market trajectory
      2. Emerging technologies and innovations
      3. Consumer behavior shifts
      4. Regulatory developments
      5. Investment trends
      6. Future outlook (next 1-3 years)
      
      Base your analysis on recent developments in the industry.
      
      Recent news: ${JSON.stringify(news.slice(0, 5))}
    `;
    
    const trends = await geminiService.generateContent(prompt);
    
    return {
      industry,
      trends,
      news: news.slice(0, 5),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error in getIndustryTrends for ${industry}:`, error);
    throw error;
  }
};

/**
 * Get trends for a specific market type
 * @param {string} marketType - The market type to get trends for
 * @returns {Object} Market trends
 */
const getMarketTrends = async (marketType) => {
  try {
    // Get market news
    const news = await newsService.getMarketNews(marketType);
    
    // Generate trends analysis using Gemini
    const prompt = `
      Generate a comprehensive trend analysis for the ${marketType} market.
      Include:
      1. Current market conditions
      2. Key economic indicators
      3. Market sentiment analysis
      4. Major influencing factors
      5. Volatility assessment
      6. Short and medium-term projections
      
      Base your analysis on recent market developments.
      
      Recent news: ${JSON.stringify(news.slice(0, 5))}
    `;
    
    const trends = await geminiService.generateContent(prompt);
    
    return {
      marketType,
      trends,
      news: news.slice(0, 5),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error in getMarketTrends for ${marketType}:`, error);
    throw error;
  }
};

module.exports = {
  getKeywordTrends,
  getIndustryTrends,
  getMarketTrends
}; 