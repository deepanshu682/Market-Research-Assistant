const axios = require('axios');
require('dotenv').config();

// News API configuration
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Mock news data for development/testing
// Replace with actual API integration when available
const mockNews = {
  tech: [
    { title: 'AI Advancements Changing Business Landscape', source: 'Tech News', date: '2023-07-15', url: 'https://example.com/news/1' },
    { title: 'Cloud Computing Market Growing at 20% Annually', source: 'Business Insider', date: '2023-07-10', url: 'https://example.com/news/2' },
    { title: 'New Regulations Impact Tech Industry', source: 'Tech Journal', date: '2023-07-05', url: 'https://example.com/news/3' },
    { title: 'Tech Companies Investing in Green Infrastructure', source: 'Green Tech', date: '2023-06-28', url: 'https://example.com/news/4' },
    { title: 'Remote Work Trends Boosting Tech Productivity', source: 'Work Insights', date: '2023-06-22', url: 'https://example.com/news/5' }
  ],
  finance: [
    { title: 'Global Banking Sector Faces New Challenges', source: 'Finance Weekly', date: '2023-07-14', url: 'https://example.com/news/6' },
    { title: 'Fintech Startups Disrupting Traditional Banking', source: 'Disrupt Finance', date: '2023-07-08', url: 'https://example.com/news/7' },
    { title: 'Interest Rate Changes Impact Market Stability', source: 'Market Watch', date: '2023-07-02', url: 'https://example.com/news/8' },
    { title: 'Cryptocurrency Regulations Evolving Globally', source: 'Crypto News', date: '2023-06-25', url: 'https://example.com/news/9' },
    { title: 'Investment Strategies for Uncertain Markets', source: 'Investor Daily', date: '2023-06-18', url: 'https://example.com/news/10' }
  ],
  healthcare: [
    { title: 'Healthcare Innovation Accelerates Post-Pandemic', source: 'Health Tech', date: '2023-07-13', url: 'https://example.com/news/11' },
    { title: 'Telehealth Adoption Stabilizes at New Heights', source: 'Digital Health', date: '2023-07-06', url: 'https://example.com/news/12' },
    { title: 'Pharmaceutical Companies Invest in AI Research', source: 'Pharma News', date: '2023-06-29', url: 'https://example.com/news/13' },
    { title: 'Healthcare Staffing Shortages Present Opportunities', source: 'Healthcare Insights', date: '2023-06-21', url: 'https://example.com/news/14' },
    { title: 'Patient Data Security Becoming Top Priority', source: 'Health Security', date: '2023-06-15', url: 'https://example.com/news/15' }
  ],
  retail: [
    { title: 'E-commerce Growth Slows as Physical Retail Recovers', source: 'Retail Weekly', date: '2023-07-12', url: 'https://example.com/news/16' },
    { title: 'Supply Chain Innovations Reducing Retail Costs', source: 'Supply Chain Today', date: '2023-07-04', url: 'https://example.com/news/17' },
    { title: 'Retail Personalization Driving Customer Loyalty', source: 'Customer Experience', date: '2023-06-27', url: 'https://example.com/news/18' },
    { title: 'Sustainable Retail Practices Becoming Standard', source: 'Green Retail', date: '2023-06-19', url: 'https://example.com/news/19' },
    { title: 'AR/VR Changing the In-store Experience', source: 'Retail Innovation', date: '2023-06-12', url: 'https://example.com/news/20' }
  ],
  companies: {
    apple: [
      { title: 'Apple\'s AI Strategy Evolves with New Products', source: 'Tech News', date: '2023-07-15', url: 'https://example.com/news/21' },
      { title: 'Apple Supply Chain Diversification Continues', source: 'Supply Chain Today', date: '2023-07-08', url: 'https://example.com/news/22' },
      { title: 'Apple Services Revenue Reaches New Heights', source: 'Business Insider', date: '2023-07-01', url: 'https://example.com/news/23' },
      { title: 'Apple\'s Environmental Initiatives Gain Recognition', source: 'Green Tech', date: '2023-06-24', url: 'https://example.com/news/24' },
      { title: 'Apple Store Expansion in Emerging Markets', source: 'Retail Weekly', date: '2023-06-17', url: 'https://example.com/news/25' }
    ],
    google: [
      { title: 'Google Cloud Growth Accelerates in Enterprise Segment', source: 'Cloud News', date: '2023-07-14', url: 'https://example.com/news/26' },
      { title: 'Google\'s AI Models Setting New Industry Standards', source: 'AI Weekly', date: '2023-07-07', url: 'https://example.com/news/27' },
      { title: 'Google Ad Business Adapts to Privacy Changes', source: 'Marketing Today', date: '2023-06-30', url: 'https://example.com/news/28' },
      { title: 'Google Workspace Updates Target Remote Collaboration', source: 'Work Insights', date: '2023-06-23', url: 'https://example.com/news/29' },
      { title: 'Google\'s Regulatory Challenges in Europe Continue', source: 'Tech Policy', date: '2023-06-16', url: 'https://example.com/news/30' }
    ]
  },
  markets: {
    stock: [
      { title: 'Stock Market Volatility Increases Amid Economic Uncertainty', source: 'Market Watch', date: '2023-07-13', url: 'https://example.com/news/31' },
      { title: 'Technology Stocks Lead Market Rally', source: 'Tech Investor', date: '2023-07-06', url: 'https://example.com/news/32' },
      { title: 'Dividend Stocks Gain Attention in High-Interest Environment', source: 'Dividend News', date: '2023-06-29', url: 'https://example.com/news/33' },
      { title: 'Small Cap Stocks Show Signs of Recovery', source: 'Small Cap Today', date: '2023-06-22', url: 'https://example.com/news/34' },
      { title: 'ESG Investing Continues to Influence Market Trends', source: 'Sustainable Finance', date: '2023-06-15', url: 'https://example.com/news/35' }
    ],
    crypto: [
      { title: 'Bitcoin Adoption by Institutional Investors Grows', source: 'Crypto News', date: '2023-07-12', url: 'https://example.com/news/36' },
      { title: 'Ethereum Upgrade Promises Enhanced Scalability', source: 'Blockchain Weekly', date: '2023-07-05', url: 'https://example.com/news/37' },
      { title: 'Central Banks Accelerate CBDC Development', source: 'Banking Tech', date: '2023-06-28', url: 'https://example.com/news/38' },
      { title: 'DeFi Platforms Implement Enhanced Security Measures', source: 'DeFi Insights', date: '2023-06-21', url: 'https://example.com/news/39' },
      { title: 'Crypto Regulations Finding Balance Between Innovation and Protection', source: 'Crypto Regulation', date: '2023-06-14', url: 'https://example.com/news/40' }
    ]
  }
};

/**
 * Get news for a specific industry
 * @param {string} industry - The industry to get news for
 * @returns {Array} Industry news
 */
const getIndustryNews = async (industry) => {
  try {
    // If News API key is available, use the real API
    if (NEWS_API_KEY && NEWS_API_KEY !== 'your_news_api_key_here') {
      const response = await axios.get(`${NEWS_API_BASE_URL}/everything`, {
        params: {
          q: `${industry} industry`,
          sortBy: 'publishedAt',
          language: 'en',
          pageSize: 5,
          apiKey: NEWS_API_KEY
        }
      });
      
      // Transform News API response to our format
      if (response.data && response.data.articles) {
        return response.data.articles.map(article => ({
          title: article.title,
          source: article.source.name,
          date: article.publishedAt,
          url: article.url
        }));
      }
    }
    
    // Fallback to mock data if API not available or error occurs
    // Normalize industry name
    const normalizedIndustry = industry.toLowerCase();
    
    // Return mock data based on industry
    if (mockNews[normalizedIndustry]) {
      return mockNews[normalizedIndustry];
    }
    
    // Default to tech news if industry not found
    return mockNews.tech;
  } catch (error) {
    console.error(`Error getting news for industry ${industry}:`, error);
    // Fallback to mock data in case of error
    const normalizedIndustry = industry.toLowerCase();
    return mockNews[normalizedIndustry] || mockNews.tech;
  }
};

/**
 * Get news for a specific company
 * @param {string} companyName - The company to get news for
 * @returns {Array} Company news
 */
const getCompanyNews = async (companyName) => {
  try {
    // If News API key is available, use the real API
    if (NEWS_API_KEY && NEWS_API_KEY !== 'your_news_api_key_here') {
      const response = await axios.get(`${NEWS_API_BASE_URL}/everything`, {
        params: {
          q: companyName,
          sortBy: 'publishedAt',
          language: 'en',
          pageSize: 5,
          apiKey: NEWS_API_KEY
        }
      });
      
      // Transform News API response to our format
      if (response.data && response.data.articles) {
        return response.data.articles.map(article => ({
          title: article.title,
          source: article.source.name,
          date: article.publishedAt,
          url: article.url
        }));
      }
    }
    
    // Fallback to mock data if API not available or error occurs
    // Normalize company name
    const normalizedCompany = companyName.toLowerCase();
    
    // Return mock data based on company
    if (mockNews.companies[normalizedCompany]) {
      return mockNews.companies[normalizedCompany];
    }
    
    // Default to first company if not found
    return mockNews.companies.apple;
  } catch (error) {
    console.error(`Error getting news for company ${companyName}:`, error);
    // Fallback to mock data in case of error
    return mockNews.companies.apple;
  }
};

/**
 * Get news related to a keyword
 * @param {string} keyword - The keyword to get news for
 * @returns {Array} Keyword news
 */
const getKeywordNews = async (keyword) => {
  try {
    // If News API key is available, use the real API
    if (NEWS_API_KEY && NEWS_API_KEY !== 'your_news_api_key_here') {
      const response = await axios.get(`${NEWS_API_BASE_URL}/everything`, {
        params: {
          q: keyword,
          sortBy: 'relevancy',
          language: 'en',
          pageSize: 5,
          apiKey: NEWS_API_KEY
        }
      });
      
      // Transform News API response to our format
      if (response.data && response.data.articles) {
        return response.data.articles.map(article => ({
          title: article.title,
          source: article.source.name,
          date: article.publishedAt,
          url: article.url
        }));
      }
    }
    
    // Fallback to mock data
    return mockNews.tech;
  } catch (error) {
    console.error(`Error getting news for keyword ${keyword}:`, error);
    // Return mock data in case of error
    return mockNews.tech;
  }
};

/**
 * Get news for a specific market type
 * @param {string} marketType - The market type to get news for
 * @returns {Array} Market news
 */
const getMarketNews = async (marketType) => {
  try {
    // If News API key is available, use the real API
    if (NEWS_API_KEY && NEWS_API_KEY !== 'your_news_api_key_here') {
      const response = await axios.get(`${NEWS_API_BASE_URL}/everything`, {
        params: {
          q: `${marketType} market`,
          sortBy: 'publishedAt',
          language: 'en',
          pageSize: 5,
          apiKey: NEWS_API_KEY
        }
      });
      
      // Transform News API response to our format
      if (response.data && response.data.articles) {
        return response.data.articles.map(article => ({
          title: article.title,
          source: article.source.name,
          date: article.publishedAt,
          url: article.url
        }));
      }
    }
    
    // Fallback to mock data if API not available or error occurs
    // Normalize market type
    const normalizedMarket = marketType.toLowerCase();
    
    // Return mock data based on market type
    if (mockNews.markets[normalizedMarket]) {
      return mockNews.markets[normalizedMarket];
    }
    
    // Default to stock market if not found
    return mockNews.markets.stock;
  } catch (error) {
    console.error(`Error getting news for market ${marketType}:`, error);
    // Return mock data in case of error
    return mockNews.markets.stock;
  }
};

module.exports = {
  getIndustryNews,
  getCompanyNews,
  getKeywordNews,
  getMarketNews
}; 