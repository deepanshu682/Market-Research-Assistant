const geminiService = require('./geminiService');
const newsService = require('./newsService');

/**
 * Generate custom analysis based on provided data
 * @param {Object} analysisData - The data to base the analysis on
 * @returns {Object} Custom analysis
 */
const generateCustomAnalysis = async (analysisData) => {
  try {
    console.log('Starting custom analysis generation with data:', JSON.stringify(analysisData));
    
    const { query, industry, company, timeframe, region, additionalContext } = analysisData;
    
    // Get related news if industry or company is provided
    let news = [];
    if (company) {
      console.log(`Fetching news for company: ${company}`);
      news = await newsService.getCompanyNews(company);
      console.log(`Retrieved ${news.length} news items for company`);
    } else if (industry) {
      console.log(`Fetching news for industry: ${industry}`);
      news = await newsService.getIndustryNews(industry);
      console.log(`Retrieved ${news.length} news items for industry`);
    }
    
    // Generate analysis using Gemini
    console.log('Generating prompt for Gemini API');
    const prompt = `
      Generate a detailed business analysis based on the following query:
      "${query}"
      
      ${industry ? `Industry: ${industry}` : ''}
      ${company ? `Company: ${company}` : ''}
      ${timeframe ? `Timeframe: ${timeframe}` : ''}
      ${region ? `Region: ${region}` : ''}
      ${additionalContext ? `Additional Context: ${additionalContext}` : ''}
      
      ${news.length > 0 ? `Recent news: ${JSON.stringify(news.slice(0, 5))}` : ''}
      
      Provide a structured, data-driven analysis that addresses the query directly.
      Include relevant statistics, market insights, and actionable recommendations.
    `;
    
    console.log('Calling Gemini API with prompt');
    const analysis = await geminiService.generateContent(prompt);
    console.log('Received response from Gemini API');
    
    return {
      query,
      analysis,
      metadata: {
        industry,
        company,
        timeframe,
        region,
        timestamp: new Date().toISOString()
      },
      news: news.slice(0, 5)
    };
  } catch (error) {
    console.error('Error in generateCustomAnalysis:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    throw error;
  }
};

/**
 * Generate market report for an industry
 * @param {string} industry - The industry to generate report for
 * @param {string} timeframe - The timeframe to consider (e.g., "2023", "Q3 2023", "Last 3 years")
 * @param {string} region - The region to focus on (e.g., "Global", "North America", "Europe")
 * @returns {Object} Market report
 */
const generateMarketReport = async (industry, timeframe = "Current", region = "Global") => {
  try {
    // Get industry news
    const news = await newsService.getIndustryNews(industry);
    
    // Generate market report using Gemini
    const prompt = `
      Generate a comprehensive market report for the ${industry} industry.
      
      Timeframe: ${timeframe}
      Region: ${region}
      
      The report should include:
      
      1. Executive Summary
      2. Market Overview
         - Market size and growth
         - Key segments
         - Geographic distribution
      3. Market Dynamics
         - Growth drivers
         - Restraints
         - Opportunities
         - Challenges
      4. Competitive Landscape
         - Major players and market share
         - Recent developments
         - SWOT analysis of the industry
      5. Market Forecast
         - Short-term outlook
         - Long-term projections
      6. Key Trends
         - Technological innovations
         - Consumer preferences
         - Regulatory landscape
      7. Strategic Recommendations
      
      Base your analysis on your knowledge and the following recent news:
      ${JSON.stringify(news.slice(0, 5))}
    `;
    
    const report = await geminiService.generateContent(prompt);
    
    return {
      industry,
      timeframe,
      region,
      report,
      news: news.slice(0, 5),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error in generateMarketReport for ${industry}:`, error);
    throw error;
  }
};

/**
 * Generate SWOT analysis for a company
 * @param {string} companyName - The company to analyze
 * @returns {Object} SWOT analysis
 */
const generateSwotAnalysis = async (companyName) => {
  try {
    // Get company news
    const news = await newsService.getCompanyNews(companyName);
    
    // Generate SWOT analysis using Gemini
    const prompt = `
      Generate a detailed SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis for ${companyName}.
      
      For each category, provide at least 5 points with detailed explanations.
      
      Strengths and Weaknesses should focus on internal factors within the company's control.
      Opportunities and Threats should focus on external factors in the market or environment.
      
      Base your analysis on your knowledge and the following recent news:
      ${JSON.stringify(news.slice(0, 5))}
      
      Format the response clearly with major headings and bullet points.
      Conclude with a summary of strategic implications and recommended actions based on the SWOT analysis.
    `;
    
    const analysis = await geminiService.generateContent(prompt);
    
    return {
      company: companyName,
      swotAnalysis: analysis,
      news: news.slice(0, 5),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error in generateSwotAnalysis for ${companyName}:`, error);
    throw error;
  }
};

module.exports = {
  generateCustomAnalysis,
  generateMarketReport,
  generateSwotAnalysis
}; 